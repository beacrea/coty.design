import { Router } from 'express';
import type { Request, Response } from 'express';
import { loadCorpus } from '../lib/corpus.js';

export const agentPreview = Router();

agentPreview.get('/', (_req: Request, res: Response) => {
  const corpus = loadCorpus();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agent Preview — What AI Agents See</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #0f0f0f; color: #e0e0e0; line-height: 1.6; }
    .banner { background: #1a1a2e; border-bottom: 2px solid #00d4aa; padding: 16px 24px; text-align: center; }
    .banner h1 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #00d4aa; margin-bottom: 4px; }
    .banner p { font-size: 13px; color: #888; }
    .tabs { display: flex; gap: 0; border-bottom: 1px solid #333; background: #1a1a1a; }
    .tab { padding: 12px 24px; cursor: pointer; font-size: 13px; color: #888; border-bottom: 2px solid transparent; transition: all 0.2s; }
    .tab:hover { color: #ccc; }
    .tab.active { color: #00d4aa; border-bottom-color: #00d4aa; }
    .content { max-width: 900px; margin: 0 auto; padding: 32px 24px; }
    .panel { display: none; }
    .panel.active { display: block; }
    pre { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 20px; overflow-x: auto; font-size: 13px; line-height: 1.5; color: #b0b0b0; }
    .dossier-frame { background: #fff; color: #111; border-radius: 8px; padding: 32px; }
    .dossier-frame h1 { font-size: 28px; margin-bottom: 8px; }
    .dossier-frame h2 { font-size: 20px; margin-top: 28px; margin-bottom: 12px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    .dossier-frame h3 { font-size: 16px; margin-top: 20px; margin-bottom: 8px; color: #555; }
    .dossier-frame p { margin-bottom: 12px; }
    .dossier-frame ul, .dossier-frame dl { margin-bottom: 12px; padding-left: 20px; }
    .dossier-frame li { margin-bottom: 6px; }
    .dossier-frame dt { font-weight: bold; margin-top: 8px; }
    .dossier-frame dd { margin-left: 16px; color: #555; }
    .dossier-frame a { color: #0066cc; }
    .dossier-frame em { color: #888; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .meta-card { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px; }
    .meta-card h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #00d4aa; margin-bottom: 8px; }
    .meta-card .value { font-size: 20px; font-weight: bold; }
    .stats { display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat .num { font-size: 28px; font-weight: bold; color: #00d4aa; }
    .stat .label { font-size: 12px; color: #888; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="banner">
    <h1>Agent Dossier Preview</h1>
    <p>This is exactly what AI agents see when they visit coty.design · Last updated: ${corpus.lastUpdated}</p>
  </div>

  <div class="tabs">
    <div class="tab active" onclick="switchTab('rendered')">Rendered Dossier</div>
    <div class="tab" onclick="switchTab('jsonld')">JSON-LD</div>
    <div class="tab" onclick="switchTab('llms')">llms.txt</div>
    <div class="tab" onclick="switchTab('llmsfull')">llms-full.txt</div>
    <div class="tab" onclick="switchTab('corpus')">Raw Corpus</div>
    <div class="tab" onclick="switchTab('stats')">Corpus Stats</div>
  </div>

  <div class="content">
    <div id="rendered" class="panel active">
      <div class="dossier-frame" id="dossier-content">Loading...</div>
    </div>

    <div id="jsonld" class="panel">
      <pre id="jsonld-content">Loading...</pre>
    </div>

    <div id="llms" class="panel">
      <pre id="llms-content">Loading...</pre>
    </div>

    <div id="llmsfull" class="panel">
      <pre id="llmsfull-content">Loading...</pre>
    </div>

    <div id="corpus" class="panel">
      <pre>${escapeHtml(JSON.stringify(corpus, null, 2))}</pre>
    </div>

    <div id="stats" class="panel">
      <div class="stats">
        <div class="stat"><div class="num">${corpus.careerTimeline.length}</div><div class="label">Career Phases</div></div>
        <div class="stat"><div class="num">${corpus.expertiseDomains.length}</div><div class="label">Expertise Domains</div></div>
        <div class="stat"><div class="num">${corpus.pressCoverage.length}</div><div class="label">Press Citations</div></div>
        <div class="stat"><div class="num">${corpus.professionalAffiliations.length}</div><div class="label">Affiliations</div></div>
        <div class="stat"><div class="num">${corpus.speakingTopics.length}</div><div class="label">Speaking Topics</div></div>
        <div class="stat"><div class="num">${JSON.stringify(corpus).length}</div><div class="label">Corpus Bytes</div></div>
      </div>
      <div class="meta-grid">
        <div class="meta-card">
          <h3>Last Updated</h3>
          <div class="value">${corpus.lastUpdated}</div>
        </div>
        <div class="meta-card">
          <h3>Canonical URL</h3>
          <div class="value">${corpus.canonicalUrl}</div>
        </div>
        <div class="meta-card">
          <h3>Geographic Entries</h3>
          <div class="value">${corpus.geographicJourney.length}</div>
        </div>
        <div class="meta-card">
          <h3>Differentiator Points</h3>
          <div class="value">${corpus.differentiators.rareCombination.length}</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    function switchTab(id) {
      document.querySelectorAll('.tab').forEach((t, i) => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      const tabs = document.querySelectorAll('.tab');
      const panels = ['rendered', 'jsonld', 'llms', 'llmsfull', 'corpus', 'stats'];
      tabs[panels.indexOf(id)].classList.add('active');
    }

    fetch('/api/dossier-preview')
      .then(r => r.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const article = doc.querySelector('article');
        document.getElementById('dossier-content').innerHTML = article ? article.innerHTML : html;
      })
      .catch(() => {
        document.getElementById('dossier-content').innerHTML = '<p>Could not load rendered dossier. View the other tabs for content.</p>';
      });

    fetch('/llms.txt').then(r => r.text()).then(t => { document.getElementById('llms-content').textContent = t; });
    fetch('/llms-full.txt').then(r => r.text()).then(t => { document.getElementById('llmsfull-content').textContent = t; });

    const jsonLd = ${JSON.stringify(buildPreviewJsonLd(corpus), null, 2)};
    document.getElementById('jsonld-content').textContent = JSON.stringify(jsonLd, null, 2);
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildPreviewJsonLd(corpus: any) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${corpus.canonicalUrl}/#profilepage`,
    "url": corpus.canonicalUrl,
    "name": corpus.identity.name,
    "dateModified": corpus.lastUpdated,
    "mainEntity": {
      "@type": "Person",
      "@id": `${corpus.canonicalUrl}/#person`,
      "name": corpus.identity.name,
      "jobTitle": corpus.identity.jobTitle,
      "description": corpus.identity.description,
      "url": corpus.canonicalUrl,
      "worksFor": {
        "@type": "Organization",
        "name": corpus.identity.organization,
        "url": corpus.identity.organizationUrl
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": corpus.identity.education.institution
      },
      "knowsAbout": corpus.expertiseDomains.map((d: any) => d.domain),
      "sameAs": [corpus.identity.linkedin, corpus.identity.github]
    }
  };
}
