import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Initialize Gemini SDK with server environment key
const ai = new GoogleGenAI();

// Resilient AI generator with automatic retries and model fallbacks for 503 / capacity spikes
async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
}) {
  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite'
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || JSON.stringify(err);
        const isTemporarySpike =
          err?.status === 503 ||
          err?.code === 503 ||
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('429');

        console.warn(`[AI Engine] Attempt ${attempt} on ${model} failed: ${errMsg}`);

        if (isTemporarySpike) {
          // Wait 1.2s before retry or fallback
          await new Promise(resolve => setTimeout(resolve, 1200));
        } else {
          // If non-transient, skip to next model
          break;
        }
      }
    }
  }

  throw lastError;
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Determine app URL helper
function getEffectiveBaseUrl(req: express.Request): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  const clientOrigin = req.query.origin as string;
  if (clientOrigin) {
    return clientOrigin.replace(/\/+$/, '');
  }
  const originHeader = req.get('origin');
  if (originHeader) {
    return originHeader.replace(/\/+$/, '');
  }
  const proto = req.get('x-forwarded-proto') || req.protocol || 'http';
  const host = req.get('host') || `localhost:${PORT}`;
  return `${proto}://${host}`.replace(/\/+$/, '');
}

// GitHub OAuth configuration check
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

// Status endpoint
app.get('/api/auth/status', (req, res) => {
  const baseUrl = getEffectiveBaseUrl(req);
  res.json({
    oauthConfigured: Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET),
    clientId: GITHUB_CLIENT_ID ? `${GITHUB_CLIENT_ID.substring(0, 4)}...` : null,
    appUrl: baseUrl,
    callbackUrl: `${baseUrl}/auth/callback`
  });
});

// OAuth authorization URL endpoint
app.get('/api/auth/github/url', (req, res) => {
  if (!GITHUB_CLIENT_ID) {
    return res.status(400).json({
      error: 'GitHub OAuth Client ID is not configured in .env. You can use a GitHub Personal Access Token (PAT) directly!'
    });
  }

  const baseUrl = getEffectiveBaseUrl(req);
  const redirectUri = `${baseUrl}/auth/callback`;
  const scope = 'repo workflow read:user user:email';
  const state = Math.random().toString(36).substring(2, 15);

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
    GITHUB_CLIENT_ID
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(
    scope
  )}&state=${encodeURIComponent(state)}`;

  res.json({ url: authUrl, redirectUri });
});

// OAuth Callback handler with postMessage
app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error || !code) {
    return res.send(`
      <!doctype html>
      <html>
        <head><title>Authentication Failed</title></head>
        <body style="font-family:sans-serif;padding:2rem;background:#0f172a;color:#fff;text-align:center;">
          <h2 style="color:#ef4444;">GitHub Authentication Error</h2>
          <p>${error_description || error || 'Authorization was cancelled or failed.'}</p>
          <button onclick="window.close()" style="margin-top:1rem;padding:0.5rem 1rem;background:#334155;color:#fff;border:none;border-radius:4px;cursor:pointer;">Close Window</button>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error_description || error || 'Authentication failed'}' }, '*');
              setTimeout(() => window.close(), 2500);
            }
          </script>
        </body>
      </html>
    `);
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to obtain access token');
    }

    // Fetch basic user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'Portfoliomatic-App'
      }
    });

    let userData: any = {};
    if (userRes.ok) {
      userData = await userRes.json();
    }

    const payload = JSON.stringify({
      type: 'OAUTH_AUTH_SUCCESS',
      token: tokenData.access_token,
      user: {
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        email: userData.email,
        html_url: userData.html_url
      }
    });

    res.send(`
      <!doctype html>
      <html>
        <head><title>GitHub Connected</title></head>
        <body style="font-family:sans-serif;padding:2rem;background:#0f172a;color:#fff;text-align:center;">
          <h2 style="color:#2dd4bf;">Successfully connected to GitHub!</h2>
          <p>Logged in as <strong>${userData.login || 'GitHub User'}</strong>. This window will close automatically...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage(${payload}, '*');
              setTimeout(() => window.close(), 600);
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).send(`
      <!doctype html>
      <html>
        <body style="font-family:sans-serif;padding:2rem;background:#0f172a;color:#fff;text-align:center;">
          <h2 style="color:#ef4444;">Token Exchange Failed</h2>
          <p>${err.message || 'Unknown error occurred while connecting GitHub'}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${err.message}' }, '*');
            }
          </script>
        </body>
      </html>
    `);
  }
});

// Deploy Proxy API endpoint to handle GitHub API calls securely
app.post('/api/github/deploy', async (req, res) => {
  const { token, username, files, repoName = `${username}.github.io` } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'GitHub access token or Personal Access Token is required.' });
  }

  if (!username) {
    return res.status(400).json({ error: 'GitHub username is required.' });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfoliomatic-Portfolio-Deployer'
  };

  try {
    // 1. Verify User
    const userResp = await fetch('https://api.github.com/user', { headers });
    if (!userResp.ok) {
      const errJson = await userResp.json().catch(() => ({}));
      return res.status(userResp.status).json({
        error: `GitHub Authentication error: ${errJson.message || 'Invalid or expired token'}`
      });
    }
    const authedUser = await userResp.json();
    const targetOwner = authedUser.login;

    // 2. Check if repository exists, otherwise create it
    let repoResp = await fetch(`https://api.github.com/repos/${targetOwner}/${repoName}`, { headers });
    let createdNewRepo = false;

    if (repoResp.status === 404) {
      // Create repository
      const createResp = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repoName,
          description: 'Personal Portfolio website built with Portfoliomatic and hosted on GitHub Pages',
          homepage: `https://${targetOwner}.github.io`,
          private: false,
          auto_init: true
        })
      });

      if (!createResp.ok) {
        const createErr = await createResp.json().catch(() => ({}));
        return res.status(createResp.status).json({
          error: `Failed to create repository ${repoName}: ${createErr.message || 'Unknown error'}`
        });
      }
      repoResp = createResp;
      createdNewRepo = true;
      // Wait a moment for GitHub to initialize repo
      await new Promise(r => setTimeout(r, 1200));
    }

    const repoData = await repoResp.json();

    // 3. Commit / Update each file
    const committedFiles: string[] = [];
    const fileEntries = Object.entries(files as Record<string, { contentBase64: string; message?: string }>);

    for (const [filePath, fileData] of fileEntries) {
      // Check if file already exists to get SHA for updating
      let existingSha: string | undefined;
      const getFileResp = await fetch(`https://api.github.com/repos/${targetOwner}/${repoName}/contents/${filePath}`, {
        headers
      });

      if (getFileResp.ok) {
        const existingData = await getFileResp.json();
        existingSha = existingData.sha;
      }

      const putBody: any = {
        message: fileData.message || `Update ${filePath} via Portfoliomatic`,
        content: fileData.contentBase64,
        branch: repoData.default_branch || 'main'
      };
      if (existingSha) {
        putBody.sha = existingSha;
      }

      const putResp = await fetch(`https://api.github.com/repos/${targetOwner}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(putBody)
      });

      if (!putResp.ok) {
        const putErr = await putResp.json().catch(() => ({}));
        return res.status(putResp.status).json({
          error: `Failed to upload ${filePath}: ${putErr.message || 'Unknown commit error'}`
        });
      }
      committedFiles.push(filePath);
    }

    // 4. Ensure GitHub Pages is enabled
    let pagesStatus = 'already_enabled';
    const checkPages = await fetch(`https://api.github.com/repos/${targetOwner}/${repoName}/pages`, { headers });

    if (checkPages.status === 404) {
      // Enable pages
      const enablePages = await fetch(`https://api.github.com/repos/${targetOwner}/${repoName}/pages`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.switcheroo-preview+json'
        },
        body: JSON.stringify({
          source: {
            branch: repoData.default_branch || 'main',
            path: '/'
          }
        })
      });

      if (enablePages.ok) {
        pagesStatus = 'enabled';
      } else {
        pagesStatus = 'pending_manual';
      }
    }

    const liveSiteUrl = `https://${targetOwner.toLowerCase()}.github.io/`;

    res.json({
      success: true,
      owner: targetOwner,
      repo: repoName,
      createdNewRepo,
      committedFiles,
      pagesStatus,
      repoUrl: repoData.html_url,
      liveSiteUrl
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Unexpected server error while deploying to GitHub' });
  }
});

// ATS Resume Transformation & Career Transition API
app.post('/api/resume/transform', async (req, res) => {
  const { resumes, jobDescription, includeCoverLetter = false, candidateName = '' } = req.body;

  if (!resumes || (Array.isArray(resumes) && resumes.length === 0)) {
    return res.status(400).json({ error: 'Please provide at least one past resume, NCOER/evaluation, or career background.' });
  }

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
    return res.status(400).json({ error: 'Please provide the target job description (at least 20 characters).' });
  }

  const combinedResumesText = Array.isArray(resumes) ? resumes.join('\n\n--- NEXT BACKGROUND / RESUME ---\n\n') : resumes;

  const systemInstruction = `
ROLE:
You are an expert career transition strategist and professional resume writer with 17-20 years of experience guiding professionals through complex career transformations. You specialize in military-to-civilian transitions, career pivots across industries, and positioning seasoned professionals for advancement in their target fields. Your expertise includes translating military experience into compelling civilian terminology, identifying and articulating transferable skills that bridge career gaps, and strategically repositioning professionals' backgrounds to align with new industry requirements. You have deep knowledge of hiring practices across multiple sectors including technology, cybersecurity, healthcare, finance, and emerging industries, enabling you to craft narratives that resonate with hiring managers and ATS systems alike.

GOAL:
Analyze the provided resume against the specific job requirements for the target position and deliver actionable, prioritized recommendations to optimize the candidate's application. This includes identifying gaps between current qualifications and job requirements, suggesting specific language improvements, recommending skill emphasis adjustments, and providing strategic guidance on positioning experience to align with the role's key priorities and company culture.

CONTEXT:
The candidate is seeking to transition into a new role/industry and requires strategic resume optimization that accomplishes:
- Experience Translation: Convert current professional experience into industry-specific terminology and language that resonates with the target field's standards and expectations.
- Skills Alignment: Identify, articulate, and strategically position transferable skills to directly address the specific requirements and qualifications outlined in the target job description.
- Dual Optimization: Ensure the resume is both ATS-compliant for initial screening systems and compelling for human hiring managers, balancing keyword optimization with engaging, results-focused content.
- Transition Strategy: Proactively address potential concerns about the career change by crafting a cohesive narrative that positions the transition as a strategic advantage while clearly communicating the candidate's unique value proposition and readiness for the new role.

SPECIFIC DELIVERABLES TO PRODUCE IN STRUCTURED JSON:
1. Resume Analysis & Strategic Improvement Plan:
   - matchScore: Estimated ATS match percentage (0-100)
   - keywordsMatched: Array of key skills & terms from JD that were found in candidate background
   - keywordsMissing: Array of critical JD skills missing or needing emphasis
   - strategicGaps: Concrete gap observations between candidate experience and JD
   - militaryTranslations: Array of objects { originalMilitaryTerm: string, civilianCorporateTranslation: string, reason: string }
   - strategicRecommendations: Top prioritized recommendations for the candidate to consider
2. Complete Resume Transformation (Markdown formatted):
   - Professional header (Name, Credentials, Contact Placeholders)
   - Compelling Executive Summary bridging past accomplishments to target role
   - Core Competencies / Technical Skills (ATS-optimized)
   - Professional Experience with 3-5 high-impact, quantified bullets per role using active verbs
   - Education, Certifications & Clearance
3. Cover Letter (If requested by user):
   - A high-converting 3-paragraph executive cover letter connecting candidate's unique background to the company's mission and current business challenges.

CRITICAL INSTRUCTION:
Do not make anything up. Only use information, experiences, achievements, and qualifications that are explicitly provided in the candidate's resume/background. If you need to suggest adding content or certifications, clearly indicate it in the strategic recommendations for the candidate to consider based on their actual experience, not as fabricated information.

Respond ONLY with a valid JSON object matching this schema:
{
  "matchScore": number,
  "summaryHeadline": string,
  "keywordsMatched": string[],
  "keywordsMissing": string[],
  "militaryTranslations": [
    { "original": string, "civilian": string, "impact": string }
  ],
  "strategicGaps": string[],
  "strategicRecommendations": string[],
  "transformedResumeMarkdown": string,
  "coverLetterMarkdown": string | null
}
`;

  const userPrompt = `
CANDIDATE NAME: ${candidateName || 'Candidate'}
INCLUDE COVER LETTER: ${includeCoverLetter ? 'YES' : 'NO'}

TARGET JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROVIDED RESUME(S) AND BACKGROUND:
${combinedResumesText}
`;

  try {
    const response = await generateContentWithFallback({
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    let parsedData: any;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Fallback in case response had surrounding backticks
      const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
      parsedData = JSON.parse(clean);
    }

    res.json({
      success: true,
      data: parsedData
    });
  } catch (err: any) {
    console.error('Resume generation error:', err);
    const rawMsg = err?.message || JSON.stringify(err);
    let friendly = rawMsg;
    if (rawMsg.includes('503') || rawMsg.includes('high demand') || rawMsg.includes('UNAVAILABLE')) {
      friendly = 'Google AI service is experiencing a temporary surge in demand. Our automatic retry attempt was overwhelmed. Please click "Transform Resume" again in a few seconds.';
    }
    res.status(500).json({
      error: `AI Resume Transformation: ${friendly}`
    });
  }
});

// Hiring Manager Persona Mock Interview API
app.post('/api/interview/chat', async (req, res) => {
  const {
    positionName,
    jobDescription,
    candidateResume,
    interviewerName,
    interviewerCompany,
    interviewerEmail = '',
    conversationHistory = [],
    userMessage
  } = req.body;

  if (!positionName || !jobDescription || !candidateResume) {
    return res.status(400).json({
      error: 'Please provide Position Name, Job Description, and Candidate Resume.'
    });
  }

  const systemInstruction = `
ROLE & OBJECTIVE:
You are an expert interview preparation agent that helps candidates rehearse for a specific upcoming interview by simulating realistic, personalized interview questions.

CONTEXT:
Position: ${positionName}
Interviewer: ${interviewerName || 'Hiring Manager'} at ${interviewerCompany || 'Target Company'} ${interviewerEmail ? `(${interviewerEmail})` : ''}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${candidateResume}

INSTRUCTIONS:
1. Cross-reference the job description and candidate resume to identify the areas most likely to be probed — required skills, gaps between resume and role, notable achievements worth expanding on, and leadership/operational impact.
2. Conduct the interview conversationally: ask ONE question at a time.
3. When the candidate provides an answer, react the way a real interviewer would. Give brief, specific feedback in a distinct "Coach's Notes" block (what worked, what to sharpen, metrics to add) before seamlessly delivering the next question in character as the interviewer.
4. If the candidate asks to end the session or requests overall feedback, summarize their strongest answers, weakest points, and concrete suggestions for improvement before their actual interview.

RESPONSE FORMAT (JSON):
Respond with a JSON object:
{
  "interviewerPersona": string (brief description of tone/perspective adopted),
  "feedbackOnPrevious": string | null (brief coaching notes on candidate's previous response, or null if first question),
  "interviewerReply": string (the interviewer's in-character conversational reaction and their single next question),
  "questionNumber": number,
  "isConcluded": boolean,
  "overallSummary": string | null
}
`;

  try {
    const contents: any[] = [];

    // Add prior dialogue turns
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const turn of conversationHistory) {
        contents.push({
          role: turn.role === 'candidate' || turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        });
      }
    }

    // Add latest user input or session start trigger
    contents.push({
      role: 'user',
      parts: [
        {
          text: userMessage || 'Hello, I am ready to begin the interview rehearsal. Please introduce yourself in character as the interviewer and ask the first question.'
        }
      ]
    });

    const response = await generateContentWithFallback({
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
      parsed = JSON.parse(clean);
    }

    res.json({
      success: true,
      data: parsed
    });
  } catch (err: any) {
    console.error('Interview simulation error:', err);
    const rawMsg = err?.message || JSON.stringify(err);
    let friendly = rawMsg;
    if (rawMsg.includes('503') || rawMsg.includes('high demand') || rawMsg.includes('UNAVAILABLE')) {
      friendly = 'Google AI service is experiencing a temporary surge in demand. Please send your response again in a moment.';
    }
    res.status(500).json({
      error: `Interview simulation: ${friendly}`
    });
  }
});

// Setup Vite middlewares in development or serve static in production
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || hasDist;

  if (isProduction && hasDist) {
    // Production static serving
    console.log(`[Server] Serving production build from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Development mode with Vite middleware (allowing all hosts)
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfoliomatic server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
