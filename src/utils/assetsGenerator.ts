/**
 * Generates fallback assets when the user hasn't uploaded custom files.
 * This guarantees index.html references valid profile.jpg and resume.pdf files.
 */

// Generate a sleek monogram/portrait image data URL using Canvas
export function generateDefaultProfileImage(name: string, accentColor: string, bgColor: string): string {
  if (typeof document === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 400, 400);
  gradient.addColorStop(0, bgColor || '#0b1120');
  gradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 400);

  // Outer decorative circle
  ctx.strokeStyle = accentColor || '#2dd4bf';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(200, 200, 180, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle inner glow
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(200, 200, 160, 0, Math.PI * 2);
  ctx.stroke();

  // Extract initials
  const initials = name
    .trim()
    .split(/\s+/)
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'P';

  // Draw initials
  ctx.fillStyle = accentColor || '#2dd4bf';
  ctx.font = 'bold 120px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, 200, 195);

  // Draw small label below
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 20px system-ui, -apple-system, sans-serif';
  ctx.fillText('PORTFOLIO', 200, 280);

  return canvas.toDataURL('image/jpeg', 0.92);
}

// Generate a valid minimal PDF file data URL for starter resume
export function generateStarterResumePdf(fullName: string, headline: string, email: string): string {
  // A clean, valid minimal PDF document structure in Base64
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  const textContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length 420 >>
stream
BT
/F1 24 Tf
50 720 Td
(${escapePdf(fullName)}) Tj
/F2 12 Tf
0 -24 Td
(${escapePdf(headline)}) Tj
/F2 10 Tf
0 -18 Td
(Contact: ${escapePdf(email)} | Updated: ${escapePdf(dateStr)}) Tj
0 -30 Td
/F1 14 Tf
(PROFESSIONAL PROFILE) Tj
/F2 10 Tf
0 -18 Td
(Experienced operations and technical specialist with a proven track record of delivery.) Tj
0 -14 Td
(Please replace this starter document with your finalized comprehensive resume.pdf.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000714 00000 n 
0000000784 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
849
%%EOF
`.trim();

  // Convert to base64 data URL
  const base64 = btoa(unescape(encodeURIComponent(textContent)));
  return `data:application/pdf;base64,${base64}`;
}

function escapePdf(str: string): string {
  return str.replace(/[()\\]/g, '\\$&');
}

// Convert base64 data URL to ArrayBuffer / Uint8Array for zip packaging or API push
export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const parts = dataUrl.split(',');
  const base64 = parts.length > 1 ? parts[1] : parts[0];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function dataUrlToBase64Only(dataUrl: string): string {
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : parts[0];
}
