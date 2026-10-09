import { PortfolioData } from '../types/portfolio';

export function generatePortfolioHtml(data: PortfolioData): string {
  const {
    githubUsername,
    brandName,
    fullName,
    credentials,
    headline,
    heroSummary,
    heroTags,
    aboutLabel,
    aboutHeading,
    aboutBio,
    experienceLabel,
    experienceHeading,
    experienceHighlights,
    skillsLabel,
    skillsHeading,
    skills,
    projectsLabel,
    projectsHeading,
    projectsLead,
    resumeHeading,
    resumeLead,
    resumeCtaText,
    contactHeading,
    email,
    location,
    linkedinUrl,
    hireMeButtonText,
    theme,
    cardStyle = 'clean'
  } = data;

  const sanitizedUsername = githubUsername.trim() || 'username';

  const tagsHtml = heroTags
    .filter(t => t.trim().length > 0)
    .map(tag => `      <span class="tag">${escapeHtml(tag)}</span>`)
    .join('\n');

  const highlightsHtml = experienceHighlights
    .filter(h => h.trim().length > 0)
    .map(item => `    <li>${escapeHtml(item)}</li>`)
    .join('\n');

  const skillsHtml = skills
    .filter(s => s.trim().length > 0)
    .map(skill => `    <span class="tag">${escapeHtml(skill)}</span>`)
    .join('\n');

  const linkedinBlock = linkedinUrl
    ? `\n  <p>LinkedIn: <a href="${escapeHtml(linkedinUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
        linkedinUrl
      )}</a></p>`
    : '';

  const locationBlock = location ? `\n  <p>Location: <span>${escapeHtml(location)}</span></p>` : '';

  const donationBlock = data.donationUrl
    ? `\n  <p>Support / Donate: <a href="${escapeHtml(data.donationUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
        data.donationUrl
      )}</a></p>`
    : '';

  const hasLogoImage = Boolean(data.logoImage?.uploaded || data.logoImage?.dataUrl);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Professional portfolio and projects of ${escapeHtml(fullName)}">
<title>${escapeHtml(fullName)} | Professional Portfolio</title>
<style>
:root{
  --bg:${theme.bg};
  --surface:${theme.surface};
  --surface-2:${theme.surface2};
  --border:${theme.border};
  --text:${theme.text};
  --muted:${theme.muted};
  --accent:${theme.accent};
  --accent-2:${theme.accent2};
  --button-gradient:linear-gradient(135deg, ${theme.buttonGradientStart} 0%, ${theme.buttonGradientEnd} 100%);
  --shadow:0 10px 30px rgba(0,0,0,.25);
  --radius:.75rem;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--accent)}
a:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.container{width:min(100% - 2rem,1100px);margin:auto}
header{position:sticky;top:0;z-index:10;background:rgba(11,17,32,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:1rem 0}
nav{display:flex;gap:1rem;align-items:center;justify-content:space-between;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:.75rem;text-decoration:none;color:#fff}
.brand-logo{max-height:32px;width:auto;object-fit:contain;border-radius:5px;display:inline-block}
.logo{display:flex;align-items:center;gap:.4rem;font-weight:800;letter-spacing:-.02em}
.logo::before{content:"";display:inline-block;width:1.2rem;height:1.2rem;background:var(--button-gradient);border-radius:.3rem}
.name{font-size:.92rem;line-height:1.2;font-weight:700}
.name small{display:block;color:var(--accent);font-weight:600;font-size:.75rem}
.nav-links{display:flex;gap:1.5rem;flex-wrap:wrap}
.nav-links a{color:var(--muted);text-decoration:none;font-weight:500;font-size:.95rem;transition:color .2s}
.nav-links a:hover,.nav-links a[aria-current="true"]{color:#fff}
.nav-actions{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap}
.button{display:inline-block;padding:.55rem 1.15rem;border-radius:999px;text-decoration:none;font-weight:600;font-size:.9rem;border:1px solid transparent;transition:transform .15s,box-shadow .2s;cursor:pointer}
.button:hover{transform:translateY(-1px)}
.button.primary{background:var(--button-gradient);color:#fff;box-shadow:0 4px 14px rgba(45,212,191,.25)}
.button.outline{background:transparent;border-color:var(--border);color:#fff}
.button.outline:hover{border-color:var(--accent);color:var(--accent)}
main{padding:2rem 0 4rem}
section{margin-top:4rem}
h1,h2,h3{line-height:1.2;margin:0 0 .75rem}
h1{font-size:clamp(2.4rem,5vw,3.6rem);font-weight:800;letter-spacing:-.02em}
h2{font-size:1.65rem;font-weight:700}
.section-label{display:flex;align-items:center;gap:.6rem;color:var(--muted);font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem}
.section-label::before{content:"";width:28px;height:1px;background:var(--accent)}
.lead{font-size:1.25rem;color:var(--muted);max-width:640px}
.hero{padding:3.5rem 0 1.5rem;display:flex;gap:2.5rem;align-items:center;justify-content:space-between;flex-wrap:wrap}
.hero-content{flex:1 1 480px}
.hero .lead{margin:1rem 0 1.5rem}
.hero-portrait{width:160px;height:160px;border-radius:50%;object-fit:cover;border:3px solid var(--accent);box-shadow:var(--shadow);flex-shrink:0}
.tags{display:flex;gap:.5rem;flex-wrap:wrap;margin:1.5rem 0 0}
.tag{padding:.35rem .85rem;background:var(--surface-2);border:1px solid var(--border);border-radius:999px;color:var(--accent-2);font-size:.85rem;font-weight:500}
.skills-grid{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.25rem;margin-top:1.25rem}
.card{position:relative;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;display:flex;flex-direction:column;transition:transform .25s ease,box-shadow .25s ease,border-color .2s ease;overflow:hidden}
.card:hover{transform:translateY(-4px);box-shadow:var(--shadow)}

/* Card Visual Design Styles */
.card-style-silver-shimmer{
  background:linear-gradient(135deg, rgba(255,255,255,.07) 0%, rgba(200,215,240,.015) 35%, rgba(255,255,255,.14) 50%, rgba(200,215,240,.015) 65%, rgba(255,255,255,.04) 100%), var(--surface);
  border:1px solid rgba(226,232,240,.28);
  box-shadow:0 4px 20px rgba(0,0,0,.35), inset 0 1px 1px rgba(255,255,255,.2);
}
.card-style-silver-shimmer::before{
  content:"";
  position:absolute;
  top:-50%;
  left:-130%;
  width:200%;
  height:200%;
  background:linear-gradient(60deg, transparent 40%, rgba(255,255,255,.22) 50%, transparent 60%);
  transform:rotate(25deg);
  transition:left .85s ease;
  pointer-events:none;
}
.card-style-silver-shimmer:hover::before{left:130%}
.card-style-silver-shimmer:hover{
  border-color:rgba(255,255,255,.65);
  box-shadow:0 14px 35px rgba(0,0,0,.5), 0 0 25px rgba(226,232,240,.22), inset 0 1px 2px rgba(255,255,255,.45);
}

.card-style-matrix-rain{
  background-color:#030c07;
  background-image:
    linear-gradient(rgba(16,185,129,.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16,185,129,.07) 1px, transparent 1px),
    radial-gradient(circle at 50% 0%, rgba(52,211,153,.15), transparent 75%);
  background-size:18px 18px, 18px 18px, 100% 100%;
  border:1px solid rgba(52,211,153,.35);
}
.card-style-matrix-rain::before{
  content:"";
  position:absolute;
  top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg, transparent, #34d399, transparent);
  box-shadow:0 0 8px #34d399;
  animation:matrixScan 3.5s linear infinite;
  opacity:.75;
  pointer-events:none;
}
@keyframes matrixScan{
  0%{top:-2px}
  100%{top:100%}
}
.card-style-matrix-rain:hover{
  border-color:#34d399;
  box-shadow:0 0 30px rgba(16,185,129,.35), inset 0 0 18px rgba(16,185,129,.12);
}

.card-style-diamond-grid{
  background-color:var(--surface);
  background-image:
    linear-gradient(45deg, rgba(255,255,255,.035) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255,255,255,.035) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255,255,255,.035) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255,255,255,.035) 75%);
  background-size:20px 20px;
  background-position:0 0, 0 10px, 10px -10px, -10px 0px;
  border:1px solid var(--border);
}
.card-style-diamond-grid:hover{
  border-color:var(--accent);
  box-shadow:0 12px 30px rgba(0,0,0,.35), 0 0 20px rgba(45,212,191,.18);
}

.card-style-tech-checker{
  background-color:var(--surface);
  background-image:
    linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size:24px 24px;
  border:1px solid var(--border);
}
.card-style-tech-checker::after{
  content:"+";
  position:absolute;
  top:10px;right:14px;
  font-family:monospace;font-size:15px;
  color:var(--accent);opacity:.55;
  pointer-events:none;
}
.card-style-tech-checker:hover{
  border-color:var(--accent);
  box-shadow:0 12px 30px rgba(0,0,0,.35), inset 0 0 20px rgba(255,255,255,.02);
}

.card-style-aurora-glow{
  background:
    radial-gradient(circle at 10% 10%, rgba(45,212,191,.14) 0%, transparent 60%),
    radial-gradient(circle at 90% 90%, rgba(129,140,248,.16) 0%, transparent 60%),
    var(--surface);
  border:1px solid rgba(255,255,255,.14);
  backdrop-filter:blur(10px);
}
.card-style-aurora-glow:hover{
  border-color:var(--accent);
  box-shadow:0 14px 35px rgba(0,0,0,.45), 0 0 28px rgba(45,212,191,.25);
}
.card-icon{width:42px;height:42px;display:grid;place-items:center;background:var(--surface-2);border:1px solid var(--border);border-radius:.6rem;color:var(--accent);margin-bottom:1rem;font-size:1.2rem}
.card h3{margin:.25rem 0 .6rem;font-size:1.15rem}
.card h3 a{color:#fff;text-decoration:none}
.card h3 a:hover{text-decoration:underline;text-decoration-color:var(--accent)}
.card p{color:var(--muted);margin:.25rem 0;font-size:.95rem;flex-grow:1}
.card-meta{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;margin-top:1rem;font-size:.82rem;color:var(--muted)}
.dot{width:8px;height:8px;border-radius:50%;background:var(--accent)}
.card-badges{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.9rem}
.badge{padding:.25rem .6rem;background:rgba(45,212,191,.1);border:1px solid rgba(45,212,191,.25);border-radius:.4rem;color:var(--accent);font-size:.75rem;font-weight:600}
.filters{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem}
.filter{padding:.45rem 1rem;background:transparent;border:1px solid var(--border);border-radius:999px;color:var(--muted);font-size:.85rem;cursor:pointer;transition:.2s}
.filter:hover{border-color:var(--accent);color:#fff}
.filter.active{background:rgba(45,212,191,.12);border-color:var(--accent);color:var(--accent);font-weight:600}
.compact-cards{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
.compact-cards .card{padding:1.25rem}
.compact-cards .card h3{font-size:1.05rem}
.hidden{display:none !important}
ul{padding-left:1.4rem;color:var(--muted)}
li{margin-bottom:.5rem;color:var(--text)}
footer{border-top:1px solid var(--border);padding:2.5rem 0;color:var(--muted);font-size:.9rem}
@media (max-width:800px){
  .nav-links{order:3;width:100%;justify-content:center;margin-top:.5rem}
  .hero{text-align:left}
}
</style>
</head>
<body>
<header>
<nav class="container" aria-label="Main navigation">
  <a class="brand" href="#top">
    ${hasLogoImage ? `<img class="brand-logo" src="logo.png" alt="${escapeHtml(brandName || 'Brand')} logo" onerror="this.style.display='none'">` : `<span class="logo">${escapeHtml(brandName)}</span>`}
    <span class="name">${escapeHtml(fullName)} ${credentials ? `<small>${escapeHtml(credentials)}</small>` : ''}</span>
  </a>
  <div class="nav-links">
    <a href="#about">About</a>
    <a href="#experience">Experience</a>
    <a href="#skills">Skills</a>
    <a href="#projects">Projects</a>
    <a href="#resume">Resume</a>
    <a href="#contact">Contact</a>
  </div>
  <div class="nav-actions">
    <a class="button outline" href="https://github.com/${encodeURIComponent(sanitizedUsername)}" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a class="button primary" href="mailto:${escapeHtml(email)}">${escapeHtml(hireMeButtonText || 'Hire Me')}</a>
  </div>
</nav>
</header>

<main id="top" class="container">
<section class="hero">
  <div class="hero-content">
    <h1>${escapeHtml(fullName)}</h1>
    <p class="lead">${escapeHtml(headline)}</p>
    <p>${escapeHtml(heroSummary)}</p>
    <div class="tags">
${tagsHtml}
    </div>
  </div>
  <img class="hero-portrait" src="profile.jpg" alt="Profile photo of ${escapeHtml(fullName)}" onerror="this.style.display='none'">
</section>

<section id="about">
  <div class="section-label">${escapeHtml(aboutLabel)}</div>
  <h2>${escapeHtml(aboutHeading)}</h2>
  <p>${escapeHtml(aboutBio).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>
</section>

<section id="experience">
  <div class="section-label">${escapeHtml(experienceLabel)}</div>
  <h2>${escapeHtml(experienceHeading)}</h2>
  <ul>
${highlightsHtml}
  </ul>
</section>

<section id="skills">
  <div class="section-label">${escapeHtml(skillsLabel)}</div>
  <h2>${escapeHtml(skillsHeading)}</h2>
  <div class="skills-grid">
${skillsHtml}
  </div>
</section>

<section id="projects">
  <div class="section-label">${escapeHtml(projectsLabel)}</div>
  <h2>${escapeHtml(projectsHeading)}</h2>
  <p class="lead">${escapeHtml(projectsLead)}</p>
  <div id="featured-list" class="cards" aria-live="polite"><p>Loading projects…</p></div>

  <div class="section-label" style="margin-top:3.5rem">All Repositories</div>
  <h2>Explore everything</h2>
  <div id="repo-filters" class="filters" aria-label="Repository categories"><button class="filter active" data-filter="all">All</button></div>
  <div id="repo-list" class="cards compact-cards" aria-live="polite"><p>Loading repositories…</p></div>
</section>

<section id="resume">
  <div class="section-label">${escapeHtml(resumeHeading)}</div>
  <h2>Download my résumé</h2>
  <p class="lead">${escapeHtml(resumeLead)}</p>
  <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
    <a class="button primary" href="resume.pdf" download="resume.pdf">${escapeHtml(resumeCtaText)}</a>
    <a class="button outline" href="#contact">Get in touch</a>
  </div>
</section>

<section id="contact">
  <div class="section-label">Contact</div>
  <h2>${escapeHtml(contactHeading)}</h2>
  <p>Email: <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>${locationBlock}
  <p>GitHub: <a id="github-profile" href="https://github.com/${encodeURIComponent(
    sanitizedUsername
  )}" target="_blank" rel="noopener noreferrer">View my GitHub profile</a></p>${linkedinBlock}${donationBlock}
</section>
</main>

<footer>
  <div class="container">© <span id="year"></span> ${escapeHtml(fullName)}. Hosted on GitHub Pages.</div>
</footer>

<script>
const username = "${sanitizedUsername}";
const cardStyle = "${cardStyle}";
const featuredList = document.querySelector("#featured-list");
const repoList = document.querySelector("#repo-list");
const filterList = document.querySelector("#repo-filters");
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#github-profile").href = \`https://github.com/\${encodeURIComponent(username)}\`;

const iconMap = {
  "pmp": "⊞",
  "dashboard": "⊞",
  "gov": "🔍",
  "contract": "🔍",
  "resume": "📝",
  "optimizer": "📝",
  "finance": "$",
  "redesign": "</>",
  "automation": "⋉",
  "api": "⚡",
  "portfolio": "◈",
  "bot": "🤖",
  "ai": "✦",
  default: "◈"
};

function getIcon(name){
  const key = name.toLowerCase();
  for (const k in iconMap) if (key.includes(k)) return iconMap[k];
  return iconMap.default;
}

function makeCard(repo, compact){
  const card = document.createElement("article");
  card.className = "card repo-card card-style-" + cardStyle;
  card.dataset.topics = (repo.topics || []).join(" ").toLowerCase();
  
  const icon = document.createElement("div");
  icon.className = "card-icon";
  icon.textContent = getIcon(repo.name);
  
  const heading = document.createElement("h3");
  const link = document.createElement("a");
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repo.name.replaceAll("-", " ");
  heading.append(link);
  
  const description = document.createElement("p");
  description.textContent = repo.description || "Explore this project on GitHub.";
  
  const meta = document.createElement("div");
  meta.className = "card-meta";
  if (repo.language){
    const lang = document.createElement("span");
    lang.innerHTML = \`<span class="dot"></span> \${repo.language}\`;
    meta.append(lang);
  }
  
  const badges = document.createElement("div");
  badges.className = "card-badges";
  const topics = (repo.topics || []).slice(0, compact ? 1 : 2);
  if (topics.length){
    for (const t of topics){
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = t.replaceAll("-", " ");
      badges.append(badge);
    }
  } else if (!compact && repo.language){
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = repo.language;
    badges.append(badge);
  }
  
  card.append(icon, heading, description, meta, badges);
  return card;
}

async function loadProjects(){
  try {
    const response = await fetch(\`https://api.github.com/users/\${encodeURIComponent(username)}/repos?sort=updated&per_page=100\`);
    if (!response.ok) throw new Error(\`GitHub API: \${response.status}\`);
    const repos = await response.json();
    const visible = repos.filter(r => !r.fork && !r.archived && r.name.toLowerCase() !== \`\${username}.github.io\`.toLowerCase());

    featuredList.replaceChildren();
    const selected = visible.slice(0, 6);
    if (selected.length === 0){
      featuredList.innerHTML = "<p>Projects are on the way. Visit my GitHub profile in the meantime.</p>";
    } else {
      for (const repo of selected) featuredList.append(makeCard(repo, false));
    }

    const topics = new Set();
    visible.forEach(r => (r.topics || []).forEach(t => topics.add(t)));
    repoList.replaceChildren();
    if (visible.length === 0){
      repoList.innerHTML = "<p>No public repositories found for this account.</p>";
    } else {
      for (const repo of visible) repoList.append(makeCard(repo, true));
      const sortedTopics = [...topics].sort();
      for (const topic of sortedTopics){
        const btn = document.createElement("button");
        btn.className = "filter";
        btn.dataset.filter = topic;
        btn.textContent = topic.replaceAll("-", " ");
        filterList.append(btn);
      }
      filterList.addEventListener("click", e => {
        if (!e.target.matches(".filter")) return;
        filterList.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === e.target));
        const filter = e.target.dataset.filter;
        document.querySelectorAll("#repo-list .repo-card").forEach(card => {
          const show = filter === "all" || card.dataset.topics.split(" ").includes(filter);
          card.classList.toggle("hidden", !show);
        });
      });
    }
  } catch (error) {
    featuredList.replaceChildren();
    repoList.replaceChildren();
    const message = document.createElement("p");
    message.textContent = "GitHub repositories could not load right now. Please visit my GitHub profile directly.";
    featuredList.append(message.cloneNode(true));
    repoList.append(message);
  }
}

loadProjects();
</script>
</body>
</html>`;
}

export function generateReadme(data: PortfolioData): string {
  const sanitizedUsername = data.githubUsername.trim() || 'username';
  return `# ${data.fullName} - Professional Portfolio

> Hosted live at **[https://${sanitizedUsername}.github.io/](https://${sanitizedUsername}.github.io/)**

## Overview
- **Role:** ${data.headline}
- **Contact:** [${data.email}](mailto:${data.email})
- **Certifications / Credentials:** ${data.credentials || 'N/A'}

## About
${data.aboutBio}

## Highlights
${data.experienceHighlights.map(h => `- ${h}`).join('\n')}

## Core Skills
${data.skills.map(s => `- ${s}`).join('\n')}

---

## Repository Files
- \`index.html\`: The portfolio web application with real-time GitHub repository card rendering.
- \`profile.jpg\`: Professional portrait photo.
- \`resume.pdf\`: Downloadable curriculum vitae / résumé.
- \`.nojekyll\`: GitHub Pages bypass file.

*Generated via [Portfoliomatic](https://${sanitizedUsername}.github.io)*
`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
