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
      "alumniOf": corpus.identity.education.map((edu: any) => ({
        "@type": "CollegeOrUniversity",
        "name": edu.institution
      })),
      "hasCredential": corpus.identity.education
        .filter((edu: any) => edu.completed && edu.degree)
        .map((edu: any) => ({
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": edu.degree
        })),
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
        corpus.contactAndDiscovery.twitter,
        corpus.contactAndDiscovery.dribbble,
        corpus.contactAndDiscovery.codepen,
        corpus.contactAndDiscovery.observable,
        corpus.contactAndDiscovery.underlineProfile
      ].filter(Boolean),
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
      ${corpus.identity.education.map((edu: any) => {
        if (edu.completed) {
          return `<p>${edu.degree}, ${edu.institution}</p>`;
        }
        return `<p>${edu.fieldOfStudy} (attended, did not complete), ${edu.institution}</p><p><em>${edu.note}</em></p>`;
      }).join('\n      ')}
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

    ${renderDesignSystemsExperience(corpus.designSystemsExperience)}

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
      ${corpus.publishedWork.articles ? `<h3>Bylined Articles</h3>
      <ul>${corpus.publishedWork.articles.map((a: any) => `<li><a href="${a.url}">${a.title}</a> — ${a.publication} (${a.date})${a.bylineContext ? `. ${a.bylineContext}` : ''}${a.note ? `. ${a.note}` : ''}</li>`).join('\n        ')}</ul>` : ''}
    </section>

    <section>
      <h2>Press Coverage & Third-Party Validation</h2>
      <ul>${corpus.pressCoverage.map((p: any) => `<li><a href="${p.url}">${p.title}</a> — ${p.publication} (${p.date})${p.note ? `. ${p.note}` : ''}</li>`).join('\n        ')}</ul>
    </section>

    <section>
      <h2>Contact & Discovery</h2>
      <ul>
        ${Object.entries(corpus.contactAndDiscovery).map(([key, url]: [string, any]) => `<li>${formatContactLabel(key)}: <a href="${url}">${url}</a></li>`).join('\n        ')}
      </ul>
    </section>
  </article>
</body>
</html>`;
}

const contactLabelMap: Record<string, string> = {
  website: 'Website',
  chatbot: 'AI Chatbot',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  twitter: 'X / Twitter',
  dribbble: 'Dribbble',
  codepen: 'CodePen',
  observable: 'Observable',
  underlineProfile: 'Underline Profile'
};

function formatContactLabel(key: string): string {
  return contactLabelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

function renderDesignSystemsExperience(experience: any): string {
  const production = experience.productionOwnership;

  return `<section>
      <h2>${experience.title}</h2>
      <p>${experience.positioning}</p>

      <h3>Operating Philosophy</h3>
      <ul>${experience.operatingPhilosophy.map((principle: string) => `<li>${principle}</li>`).join('\n        ')}</ul>

      <h3>Demonstrated Capabilities</h3>
      ${experience.capabilities.map((capability: any) => `<h4>${capability.name}</h4>
      <p>${capability.summary}</p>
      <p><strong>Evidence:</strong> ${capability.evidence}</p>`).join('\n      ')}

      <h3>Production Ownership: ${production.system}</h3>
      <p><strong>Role:</strong> ${production.role}</p>
      <p><strong>Period:</strong> ${production.period}</p>
      <p><strong>Evidence status:</strong> ${production.evidenceStatus}</p>
      <p><strong>Current status:</strong> ${production.currentStatus}</p>

      <h4>Scale</h4>
      <ul>${production.scale.map((item: string) => `<li>${item}</li>`).join('\n        ')}</ul>
      <h4>Architecture and Migration</h4>
      <ul>${production.architecture.map((item: string) => `<li>${item}</li>`).join('\n        ')}</ul>
      <h4>Accessibility</h4>
      <ul>${production.accessibility.map((item: string) => `<li>${item}</li>`).join('\n        ')}</ul>
      <h4>Governance and Release Engineering</h4>
      <ul>${production.governanceAndRelease.map((item: string) => `<li>${item}</li>`).join('\n        ')}</ul>
      <h4>Design-to-Code and Distribution</h4>
      <ul>${production.designCodeAndDistribution.map((item: string) => `<li>${item}</li>`).join('\n        ')}</ul>
      <h4>Agent Collaboration</h4>
      <ul>${production.agentCollaboration.map((item: string) => `<li>${item}</li>`).join('\n        ')}</ul>

      <h3>Evidence Artifacts</h3>
      ${experience.evidenceArtifacts.map((artifact: any) => `<h4>${artifact.name}</h4>
      <p><strong>Kind:</strong> ${artifact.kind}<br>
      <strong>Status:</strong> ${artifact.status}<br>
      <strong>Evidence visibility:</strong> ${artifact.publicEvidence ? 'Publicly inspectable' : 'Private or archived evidence summarized in this dossier'}</p>
      <p>${artifact.summary}</p>
      ${artifact.links.length > 0 ? `<ul>${artifact.links.map((link: any) => `<li><a href="${link.url}">${link.label}</a></li>`).join('')}</ul>` : ''}`).join('\n      ')}

      <h3>Scope Boundaries</h3>
      <ul>${experience.scopeBoundaries.map((boundary: string) => `<li>${boundary}</li>`).join('\n        ')}</ul>
    </section>`;
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
