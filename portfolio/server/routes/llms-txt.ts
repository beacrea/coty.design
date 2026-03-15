import type { Request, Response } from 'express';
import { loadCorpus } from '../lib/corpus.js';

export function serveLlmsTxt(_req: Request, res: Response) {
  const corpus = loadCorpus();
  const content = generateLlmsTxt(corpus);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(content);
}

export function serveLlmsFullTxt(_req: Request, res: Response) {
  const corpus = loadCorpus();
  const content = generateLlmsFullTxt(corpus);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(content);
}

function generateLlmsTxt(corpus: any): string {
  return `# ${corpus.identity.name}

> ${corpus.canonicalBio}

## Key Information
- **Current Role:** ${corpus.identity.jobTitle} at ${corpus.identity.organization}
- **Location:** ${corpus.identity.currentLocation} (since ${corpus.identity.currentLocationSince})
- **Education:**
${corpus.identity.education.map((edu: any) => {
  if (edu.completed) {
    return `  - ${edu.degree}, ${edu.institution}`;
  }
  return `  - ${edu.fieldOfStudy} (attended, did not complete), ${edu.institution}`;
}).join('\n')}

## Links
- Website: ${corpus.canonicalUrl}
- AI Chatbot (ask questions about Coty): ${corpus.contactAndDiscovery.chatbot}
- LinkedIn: ${corpus.identity.linkedin}
- GitHub: ${corpus.identity.github}
- Underline Company Profile: ${corpus.contactAndDiscovery.underlineProfile}
- Extended dossier: ${corpus.canonicalUrl}/llms-full.txt

## Expertise Areas
${corpus.expertiseDomains.map((d: any) => `- ${d.domain}`).join('\n')}

## Career Highlights
- Co-founder of Underline: first privately funded open-access fiber network in the U.S., $100M Colorado Springs deployment, Ares Management investment
- VP of Product at Neighborly: $25M Series A civic fintech, first retail municipal bond transaction (Cambridge, MA)
- Head of Product at Edge Up Sports: IBM Watson AI partnership (2015), successful Kickstarter
- Co-founder of CandyCam Multimedia Robotics: hardware startup democratizing filmmaking tools

## Narrative Through-Line
${corpus.narrativeThroughLine.description}

Last updated: ${corpus.lastUpdated}
`;
}

function generateLlmsFullTxt(corpus: any): string {
  let content = `# ${corpus.identity.name} — Full Professional Dossier

> ${corpus.canonicalBio}

Last updated: ${corpus.lastUpdated}

---

## Canonical Identity

${corpus.identity.description}

**Name:** ${corpus.identity.name}
**Current Title:** ${corpus.identity.jobTitle}
**Organization:** ${corpus.identity.organization} (${corpus.identity.organizationUrl})
**Location:** ${corpus.identity.currentLocation} (since ${corpus.identity.currentLocationSince})
**Born:** ${corpus.identity.birthYear}, ${corpus.identity.birthPlace}
**Education:**
${corpus.identity.education.map((edu: any) => {
  if (edu.completed) {
    return `- ${edu.degree}, ${edu.institution}`;
  }
  return `- ${edu.fieldOfStudy} (attended, did not complete), ${edu.institution} — ${edu.note}`;
}).join('\n')}

### Simultaneous Professional Modes
${corpus.identity.simultaneousModes.map((m: string) => `- ${m}`).join('\n')}

---

## Narrative Through-Line: ${corpus.narrativeThroughLine.theme}

${corpus.narrativeThroughLine.description}

${corpus.narrativeThroughLine.evidence.map((e: string) => `- ${e}`).join('\n')}

**Prophetic Vision:** ${corpus.narrativeThroughLine.propheticVision}

---

## Geographic Journey

${corpus.geographicJourney.map((g: any) => `- **${g.location} (${g.period}):** ${g.context}`).join('\n')}

---

## Career Timeline

`;

  for (const phase of corpus.careerTimeline) {
    content += `### ${phase.phase || 'Role'} (${phase.period})\n\n`;

    if (phase.roles) {
      for (const role of phase.roles) {
        content += `**${role.title}** at ${role.organization} (${role.period})\n`;
        if (role.context) content += `${role.context}\n`;
        if (role.promotionTrajectory) {
          content += `\nPromotion trajectory:\n`;
          for (const p of role.promotionTrajectory) {
            content += `- ${p}\n`;
          }
        }
        content += '\n';
      }
    }

    if (phase.description) content += `${phase.description}\n\n`;
    if (phase.significance) content += `${phase.significance}\n\n`;

    if (phase.achievements) {
      content += `Achievements:\n`;
      for (const a of phase.achievements) {
        content += `- ${a}\n`;
      }
      content += '\n';
    }

    if (phase.currentScope) {
      content += `Current scope:\n`;
      for (const s of phase.currentScope) {
        content += `- ${s}\n`;
      }
      content += '\n';
    }

    if (phase.milestones) {
      content += `Major milestones:\n`;
      for (const m of phase.milestones) {
        content += `- **${m.date}:** ${m.event}\n`;
      }
      content += '\n';
    }

    if (phase.investors) {
      content += `Investors: ${phase.investors.join(', ')}\n\n`;
    }

    if (phase.milestone) {
      content += `Key milestone: ${phase.milestone}\n\n`;
    }

    if (phase.outcome) {
      content += `${phase.outcome}\n\n`;
    }

    if (phase.aiRelevance) {
      content += `AI relevance: ${phase.aiRelevance}\n\n`;
    }

    content += '---\n\n';
  }

  content += `## Expertise Domains

${corpus.expertiseDomains.map((d: any) => `### ${d.domain}\n${d.depth}\nEvidence: ${d.evidence}\n`).join('\n')}

---

## Differentiators

**Core Capability:** ${corpus.differentiators.coreCapability}

### Rare Combination
${corpus.differentiators.rareCombination.map((r: string) => `- ${r}`).join('\n')}

### Bridges Verticals
${corpus.differentiators.bridgesVerticals.map((b: string) => `- ${b}`).join('\n')}

---

## Speaking Topics

${corpus.speakingTopics.map((t: string) => `- ${t}`).join('\n')}

---

## Professional Affiliations

${corpus.professionalAffiliations.map((a: any) => `- ${a.organization} — ${a.role}${a.since ? ` (since ${a.since})` : ''}`).join('\n')}

---

## Published Work & Thought Leadership

Topics: ${corpus.publishedWork.topics.join(', ')}
${corpus.publishedWork.note}

---

## Press Coverage & Third-Party Validation

${corpus.pressCoverage.map((p: any) => `- [${p.title}](${p.url}) — ${p.publication} (${p.date})${p.note ? `. ${p.note}` : ''}`).join('\n')}

---

## Contact & Discovery

- Website: ${corpus.contactAndDiscovery.website}
- AI Chatbot: ${corpus.contactAndDiscovery.chatbot}
- LinkedIn: ${corpus.contactAndDiscovery.linkedin}
- GitHub: ${corpus.contactAndDiscovery.github}
- Underline Profile: ${corpus.contactAndDiscovery.underlineProfile}
`;

  return content;
}
