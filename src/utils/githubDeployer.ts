import { PortfolioData } from '../types/portfolio';
import { preparePortfolioFiles } from './zipExporter';

export interface DeploymentLog {
  step: 'auth' | 'repo' | 'upload' | 'pages' | 'complete' | 'error';
  message: string;
  timestamp: string;
  isError?: boolean;
}

export interface DeploymentResult {
  success: boolean;
  owner: string;
  repo: string;
  liveSiteUrl: string;
  repoUrl: string;
  pagesStatus: string;
  error?: string;
  logs: DeploymentLog[];
}

export async function deployToGitHub(
  token: string,
  portfolio: PortfolioData,
  onProgress?: (log: DeploymentLog) => void
): Promise<DeploymentResult> {
  const logs: DeploymentLog[] = [];

  const addLog = (step: DeploymentLog['step'], message: string, isError = false) => {
    const entry: DeploymentLog = {
      step,
      message,
      timestamp: new Date().toLocaleTimeString(),
      isError
    };
    logs.push(entry);
    if (onProgress) onProgress(entry);
  };

  try {
    addLog('auth', 'Verifying GitHub credentials and authenticated account...');

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token.trim()}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Portfoliomatic-Deployer'
    };

    // 1. Verify User
    const userRes = await fetch('https://api.github.com/user', { headers });
    if (!userRes.ok) {
      const err = await userRes.json().catch(() => ({}));
      throw new Error(`Authentication failed (${userRes.status}): ${err.message || 'Invalid or expired GitHub token'}`);
    }

    const userData = await userRes.json();
    const owner = userData.login;
    addLog('auth', `Authenticated as GitHub user @${owner}`);

    // Determine target repo name: owner.github.io
    const targetRepoName = `${owner.toLowerCase()}.github.io`;
    addLog('repo', `Target GitHub Pages repository: ${owner}/${targetRepoName}`);

    // 2. Check if repo exists
    let repoRes = await fetch(`https://api.github.com/repos/${owner}/${targetRepoName}`, { headers });
    let defaultBranch = 'main';

    if (repoRes.status === 404) {
      addLog('repo', `Repository ${targetRepoName} does not exist. Creating new public repository...`);
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: targetRepoName,
          description: `${portfolio.fullName} - Professional Portfolio Website (Built with Portfoliomatic)`,
          homepage: `https://${owner.toLowerCase()}.github.io/`,
          private: false,
          auto_init: true
        })
      });

      if (!createRes.ok) {
        const createErr = await createRes.json().catch(() => ({}));
        throw new Error(`Failed to create repository ${targetRepoName}: ${createErr.message || 'Permission denied'}`);
      }

      addLog('repo', `Successfully created repository ${owner}/${targetRepoName}`);
      // Wait for GitHub to initialize
      await new Promise(r => setTimeout(r, 2000));
      repoRes = await fetch(`https://api.github.com/repos/${owner}/${targetRepoName}`, { headers });
    } else if (!repoRes.ok) {
      const repoErr = await repoRes.json().catch(() => ({}));
      throw new Error(`Error accessing repository ${targetRepoName}: ${repoErr.message || 'Unknown error'}`);
    } else {
      addLog('repo', `Found existing repository ${owner}/${targetRepoName}`);
    }

    const repoData = await repoRes.json();
    defaultBranch = repoData.default_branch || 'main';

    // 3. Prepare and upload files
    addLog('upload', 'Compiling and packaging portfolio files (index.html, profile.jpg, resume.pdf, README.md)...');
    const prepared = preparePortfolioFiles({
      ...portfolio,
      githubUsername: owner,
      repoName: targetRepoName
    });

    const fileMap: Array<{ path: string; base64: string; msg: string }> = [
      { path: 'index.html', base64: prepared['index.html'].base64, msg: 'Update portfolio index.html' },
      { path: 'profile.jpg', base64: prepared['profile.jpg'].base64, msg: 'Update portfolio photo profile.jpg' },
      { path: 'resume.pdf', base64: prepared['resume.pdf'].base64, msg: 'Update resume.pdf document' },
      { path: 'README.md', base64: prepared['README.md'].base64, msg: 'Update repository README.md' },
      { path: '.nojekyll', base64: prepared['.nojekyll'].base64, msg: 'Add .nojekyll for GitHub Pages' }
    ];

    if (prepared['logo.png']) {
      fileMap.push({
        path: 'logo.png',
        base64: prepared['logo.png'].base64,
        msg: 'Update brand logo logo.png'
      });
    }

    for (const file of fileMap) {
      addLog('upload', `Uploading ${file.path} to branch '${defaultBranch}'...`);

      // Check if file exists to fetch sha
      let sha: string | undefined;
      const existingRes = await fetch(
        `https://api.github.com/repos/${owner}/${targetRepoName}/contents/${file.path}?ref=${defaultBranch}`,
        { headers }
      );
      if (existingRes.ok) {
        const fileInfo = await existingRes.json();
        sha = fileInfo.sha;
      }

      const uploadBody: any = {
        message: file.msg,
        content: file.base64,
        branch: defaultBranch
      };
      if (sha) {
        uploadBody.sha = sha;
      }

      const putRes = await fetch(
        `https://api.github.com/repos/${owner}/${targetRepoName}/contents/${file.path}`,
        {
          method: 'PUT',
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(uploadBody)
        }
      );

      if (!putRes.ok) {
        const putErr = await putRes.json().catch(() => ({}));
        throw new Error(`Failed to commit ${file.path}: ${putErr.message || 'Commit error'}`);
      }

      addLog('upload', `Successfully committed ${file.path}`);
    }

    // 4. GitHub Pages activation
    addLog('pages', 'Configuring GitHub Pages deployment settings...');
    let pagesStatus = 'active';

    const pagesCheck = await fetch(`https://api.github.com/repos/${owner}/${targetRepoName}/pages`, { headers });
    if (pagesCheck.status === 404) {
      addLog('pages', `Enabling GitHub Pages on branch '${defaultBranch}' at root '/'...`);
      const enablePages = await fetch(`https://api.github.com/repos/${owner}/${targetRepoName}/pages`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.switcheroo-preview+json'
        },
        body: JSON.stringify({
          source: {
            branch: defaultBranch,
            path: '/'
          }
        })
      });

      if (enablePages.ok) {
        pagesStatus = 'enabled';
        addLog('pages', 'GitHub Pages has been successfully enabled!');
      } else {
        pagesStatus = 'pending_manual';
        addLog(
          'pages',
          'Pages activation queued. If needed, you can verify in Settings > Pages.'
        );
      }
    } else {
      pagesStatus = 'already_enabled';
      addLog('pages', 'GitHub Pages is already configured and active for this repository.');
    }

    const liveSiteUrl = `https://${owner.toLowerCase()}.github.io/`;
    addLog('complete', `🎉 Deployment complete! Your portfolio is live at: ${liveSiteUrl}`);

    return {
      success: true,
      owner,
      repo: targetRepoName,
      liveSiteUrl,
      repoUrl: repoData.html_url || `https://github.com/${owner}/${targetRepoName}`,
      pagesStatus,
      logs
    };
  } catch (error: any) {
    const errorMsg = error.message || 'An unexpected error occurred during GitHub deployment.';
    addLog('error', errorMsg, true);
    return {
      success: false,
      owner: portfolio.githubUsername,
      repo: `${portfolio.githubUsername}.github.io`,
      liveSiteUrl: `https://${portfolio.githubUsername}.github.io/`,
      repoUrl: `https://github.com/${portfolio.githubUsername}/${portfolio.githubUsername}.github.io`,
      pagesStatus: 'error',
      error: errorMsg,
      logs
    };
  }
}
