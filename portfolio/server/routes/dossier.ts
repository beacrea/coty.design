import type { Request, Response } from 'express';
import { loadCorpus } from '../lib/corpus.js';

export function serveDossier(_req: Request, res: Response) {
  const corpus = loadCorpus();
  const jsonLd = buildJsonLd(corpus);
  const html = buildDossierHtml(corpus, jsonLd);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Content-Source', 'agent-dossier');
  res.send(html);
}

function buildJsonLd(corpus: any) {
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
      "image": `${corpus.canonicalUrl}/og-image.png`,
      "birthPlace": {
        "@type": "Place",
        "name": corpus.identity.birthPlace
      },
      "homeLocation": {
        "@type": "Place",
        "name": corpus.identity.currentLocation
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": corpus.identity.education.institution
      },
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": corpus.identity.education.degree
      },
      "worksFor": {
        "@type": "Organization",
        "name": corpus.identity.organization,
        "url": corpus.identity.organizationUrl,
        "description": "The nation's intelligent community infrastructure platform — designs, finances, constructs, and operates open-access fiber-optic networks"
      },
      "hasOccupation": {
        "@type": "Occupation",
        "name": corpus.identity.jobTitle,
        "occupationalCategory": "Design Technology and Product Leadership"
      },
      "knowsAbout": corpus.expertiseDomains.map((d: any) => ({
        "@type": "Thing",
        "name": d.domain,
        "description": d.depth
      })),
      "sameAs": [
        corpus.identity.linkedin,
        corpus.identity.github,
        corpus.contactAndDiscovery.underlineProfile
      ],
      "memberOf": corpus.professionalAffiliations.map((a: any) => ({
        "@type": "Organization",
        "name": a.organization,
        "roleName": a.role
      }))
    }
  };
}

function buildDossierHtml(corpus: any, jsonLd: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${corpus.identity.name} — Professional Dossier</title>
  <meta name="description" content="${corpus.canonicalBio}">
  <meta name="author" content="${corpus.identity.name}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${corpus.canonicalUrl}/">
  <meta property="og:type" content="profile">
  <meta property="og:url" content="${corpus.canonicalUrl}/">
  <meta property="og:title" content="${corpus.identity.name} — ${corpus.identity.jobTitle}">
  <meta property="og:description" content="${corpus.canonicalBio}">
  <meta property="og:image" content="${corpus.canonicalUrl}/og-image.png">
  <meta name="last-modified" content="${corpus.lastUpdated}">
  <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
</head>
<body>
  <article>
    <header>
      <h1>${corpus.identity.name}</h1>
      <p><strong>${corpus.identity.jobTitle}</strong> at <a href="${corpus.identity.organizationUrl}">${corpus.identity.organization}</a></p>
      <p>${corpus.canonicalBio}</p>
      <p>Based in ${corpus.identity.currentLocation} (since ${corpus.identity.currentLocationSince}) · <a href="${corpus.canonicalUrl}">${corpus.canonicalUrl}</a> · <a href="${corpus.identity.linkedin}">LinkedIn</a> · <a href="${corpus.identity.github}">GitHub</a></p>
      <p><em>Last updated: ${corpus.lastUpdated}</em></p>
    </header>

    <section>
      <h2>Education</h2>
      <p>${corpus.identity.education.degree}, ${corpus.identity.education.institution}</p>
    </section>

    <section>
      <h2>Narrative Through-Line: ${corpus.narrativeThroughLine.theme}</h2>
      <p>${corpus.narrativeThroughLine.description}</p>
      <ul>${corpus.narrativeThroughLine.evidence.map((e: string) => `<li>${e}</li>`).join('\n        ')}</ul>
      <p><strong>Prophetic vision:</strong> ${corpus.narrativeThroughLine.propheticVision}</p>
    </section>

    <section>
      <h2>Current Role: ${corpus.identity.organization}</h2>
      ${renderCurrentRole(corpus)}
    </section>

    <section>
      <h2>Expertise Domains</h2>
      <dl>
        ${corpus.expertiseDomains.map((d: any) => `<dt>${d.domain}</dt><dd>${d.depth} (Evidence: ${d.evidence})</dd>`).join('\n        ')}
      </dl>
    </section>

    <section>
      <h2>Differentiators</h2>
      <p><strong>Core capability:</strong> ${corpus.differentiators.coreCapability}</p>
      <h3>Rare Combination</h3>
      <ul>${corpus.differentiators.rareCombination.map((r: string) => `<li>${r}</li>`).join('\n        ')}</ul>
    </section>

    <section>
      <h2>Career Timeline</h2>
      ${renderCareerTimeline(corpus)}
    </section>

    <section>
      <h2>Geographic Journey</h2>
      <ul>${corpus.geographicJourney.map((g: any) => `<li><strong>${g.location} (${g.period}):</strong> ${g.context}</li>`).join('\n        ')}</ul>
    </section>

    <section>
      <h2>Speaking Topics</h2>
      <ul>${corpus.speakingTopics.map((t: string) => `<li>${t}</li>`).join('\n        ')}</ul>
    </section>

    <section>
      <h2>Professional Affiliations</h2>
      <ul>${corpus.professionalAffiliations.map((a: any) => `<li>${a.organization} — ${a.role}${a.since ? ` (since ${a.since})` : ''}</li>`).join('\n        ')}</ul>
    </section>

    <section>
      <h2>Published Work</h2>
      <p>Topics: ${corpus.publishedWork.topics.join(', ')}</p>
      <p>${corpus.publishedWork.note}</p>
    </section>

    <section>
      <h2>Press Coverage & Third-Party Validation</h2>
      <ul>${corpus.pressCoverage.map((p: any) => `<li><a href="${p.url}">${p.title}</a> — ${p.publication} (${p.date})${p.note ? `. ${p.note}` : ''}</li>`).join('\n        ')}</ul>
    </section>

    <section>
      <h2>Contact & Discovery</h2>
      <ul>
        <li>Website: <a href="${corpus.contactAndDiscovery.website}">${corpus.contactAndDiscovery.website}</a></li>
        <li>AI Chatbot: <a href="${corpus.contactAndDiscovery.chatbot}">${corpus.contactAndDiscovery.chatbot}</a></li>
        <li>LinkedIn: <a href="${corpus.contactAndDiscovery.linkedin}">${corpus.contactAndDiscovery.linkedin}</a></li>
        <li>GitHub: <a href="${corpus.contactAndDiscovery.github}">${corpus.contactAndDiscovery.github}</a></li>
        <li>Underline Profile: <a href="${corpus.contactAndDiscovery.underlineProfile}">${corpus.contactAndDiscovery.underlineProfile}</a></li>
      </ul>
    </section>
  </article>
</body>
</html>`;
}

function renderCurrentRole(corpus: any): string {
  const underline = corpus.careerTimeline.find((c: any) => c.phase?.includes('Underline'));
  if (!underline) return '';

  let html = `<p>${underline.description}</p>`;
  html += `<h3>Current Scope</h3><ul>${underline.currentScope.map((s: string) => `<li>${s}</li>`).join('')}</ul>`;
  html += `<h3>Major Milestones</h3><ul>${underline.milestones.map((m: any) => `<li><strong>${m.date}:</strong> ${m.event}</li>`).join('')}</ul>`;
  html += `<h3>Investors & Partners</h3><ul>${underline.investors.map((i: string) => `<li>${i}</li>`).join('')}</ul>`;
  return html;
}

function renderCareerTimeline(corpus: any): string {
  return corpus.careerTimeline.map((phase: any) => {
    let html = `<h3>${phase.phase || 'Role'} (${phase.period})</h3>`;
    if (phase.roles) {
      html += `<ul>${phase.roles.map((r: any) => {
        let role = `<li><strong>${r.title}</strong> at ${r.organization} (${r.period})`;
        if (r.context) role += ` — ${r.context}`;
        if (r.promotionTrajectory) {
          role += `<ul>${r.promotionTrajectory.map((p: string) => `<li>${p}</li>`).join('')}</ul>`;
        }
        role += '</li>';
        return role;
      }).join('')}</ul>`;
    }
    if (phase.significance) html += `<p>${phase.significance}</p>`;
    if (phase.achievements) {
      html += `<ul>${phase.achievements.map((a: string) => `<li>${a}</li>`).join('')}</ul>`;
    }
    if (phase.investors) {
      html += `<p><strong>Investors:</strong> ${phase.investors.join(', ')}</p>`;
    }
    if (phase.milestone) {
      html += `<p><strong>Key milestone:</strong> ${phase.milestone}</p>`;
    }
    return html;
  }).join('\n');
}
