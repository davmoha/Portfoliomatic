import JSZip from 'jszip';
import { PortfolioData } from '../types/portfolio';
import { generatePortfolioHtml, generateReadme } from './templateGenerator';
import {
  generateDefaultProfileImage,
  generateStarterResumePdf,
  dataUrlToUint8Array
} from './assetsGenerator';

export interface PreparedFiles {
  'index.html': { content: string; base64: string };
  'profile.jpg': { uint8Array: Uint8Array; base64: string };
  'resume.pdf': { uint8Array: Uint8Array; base64: string };
  'logo.png'?: { uint8Array: Uint8Array; base64: string };
  'README.md': { content: string; base64: string };
  '.nojekyll': { content: string; base64: string };
}

export function preparePortfolioFiles(data: PortfolioData): PreparedFiles {
  const htmlContent = generatePortfolioHtml(data);
  const readmeContent = generateReadme(data);
  const nojekyllContent = '';

  // Profile image
  let profileDataUrl = data.profileImage.dataUrl;
  if (!profileDataUrl) {
    profileDataUrl = generateDefaultProfileImage(
      data.fullName,
      data.theme.accent,
      data.theme.bg
    );
  }
  const profileBytes = dataUrlToUint8Array(profileDataUrl);
  const profileBase64 = profileDataUrl.split(',')[1] || '';

  // Resume PDF
  let resumeDataUrl = data.resumePdf.dataUrl;
  if (!resumeDataUrl) {
    resumeDataUrl = generateStarterResumePdf(data.fullName, data.headline, data.email);
  }
  const resumeBytes = dataUrlToUint8Array(resumeDataUrl);
  const resumeBase64 = resumeDataUrl.split(',')[1] || '';

  // Optional Brand Logo
  let logoBytes: Uint8Array | undefined;
  let logoBase64: string | undefined;
  if (data.logoImage?.dataUrl) {
    logoBytes = dataUrlToUint8Array(data.logoImage.dataUrl);
    logoBase64 = data.logoImage.dataUrl.split(',')[1] || '';
  }

  // Base64 text helpers
  const htmlBase64 = btoa(unescape(encodeURIComponent(htmlContent)));
  const readmeBase64 = btoa(unescape(encodeURIComponent(readmeContent)));
  const nojekyllBase64 = btoa(nojekyllContent);

  const result: PreparedFiles = {
    'index.html': { content: htmlContent, base64: htmlBase64 },
    'profile.jpg': { uint8Array: profileBytes, base64: profileBase64 },
    'resume.pdf': { uint8Array: resumeBytes, base64: resumeBase64 },
    'README.md': { content: readmeContent, base64: readmeBase64 },
    '.nojekyll': { content: nojekyllContent, base64: nojekyllBase64 }
  };

  if (logoBytes && logoBase64) {
    result['logo.png'] = { uint8Array: logoBytes, base64: logoBase64 };
  }

  return result;
}

export async function downloadPortfolioZip(data: PortfolioData): Promise<void> {
  const zip = new JSZip();
  const files = preparePortfolioFiles(data);
  const username = data.githubUsername.trim() || 'portfolio';
  const folderName = `${username}.github.io`;

  // Place in root or folder
  const root = zip.folder(folderName) || zip;
  root.file('index.html', files['index.html'].content);
  root.file('profile.jpg', files['profile.jpg'].uint8Array);
  root.file('resume.pdf', files['resume.pdf'].uint8Array);
  if (files['logo.png']) {
    root.file('logo.png', files['logo.png'].uint8Array);
  }
  root.file('README.md', files['README.md'].content);
  root.file('.nojekyll', files['.nojekyll'].content);

  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

export function downloadSingleFile(filename: string, content: string | Uint8Array, mimeType: string = 'text/plain') {
  let blob: Blob;
  if (typeof content === 'string') {
    blob = new Blob([content], { type: mimeType });
  } else {
    // ArrayBufferView
    blob = new Blob([content as any], { type: mimeType });
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
