import type { Request, Response } from 'express';
import { loadCorpus } from '../lib/corpus.js';

export function serveLlmsTxt(_req: Request, res: Response) {
  const corpus = loadCorpus();
  const content = generateLlmsTxt(corpus);
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.send(content);
}

export function serveLlmsFullTxt(_req: Request, res: Response) {
  const corpus = loadCorpus();
  const content = generateLlmsFullTxt(corpus);
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.send(content);
}

function generateLlmsTxt(corpus: any): string {
  return `# ${corpus.identity.name}

> ${corpus.canonicalBio}

${corpus.identity.name} is ${corpus.identity.jobTitle} at ${corpus.identity.organization}, based in ${corpus.identity.currentLocation}. Expertise includes ${corpus.expertiseDomains.map((d: any) => d.domain).join(', ')}.

${corpus.narrativeThroughLine.description} This summary is generated from the canonical portfolio corpus and was last updated ${corpus.lastUpdated}.

## Primary Resources

- [Portfolio](${corpus.canonicalUrl}/): Canonical professional overview and selected track record.
- [Full professional dossier](${corpus.canonicalUrl}/llms-full.txt): Portfolio extension containing the complete Markdown corpus for agents that need more context.
- [Doctrine](${corpus.canonicalUrl}/doctrine): Evidence-tracked personal predictions about AI-assisted development.
- [Agent plugin manifest](${corpus.canonicalUrl}/.well-known/ai-plugin.json): Portfolio-specific JSON discovery metadata; not part of the llms.txt proposal.

## Canonical Profiles

- [LinkedIn](${corpus.identity.linkedin}): Professional identity and work history.
- [GitHub](${corpus.identity.github}): Public software projects and contributions.
- [Underline company profile](${corpus.contactAndDiscovery.underlineProfile}): Current company leadership profile.
`;
}

function renderDesignSystemsMarkdown(experience: any): string {
  const production = experience.productionOwnership;

  return `## ${experience.title}

${experience.positioning}

### Operating Philosophy
${experience.operatingPhilosophy.map((principle: string) => `- ${principle}`).join('\n')}

### Demonstrated Capabilities
${experience.capabilities.map((capability: any) => `#### ${capability.name}
${capability.summary}

Evidence: ${capability.evidence}`).join('\n\n')}

### Production Ownership: ${production.system}

**Role:** ${production.role}
**Period:** ${production.period}
**Evidence status:** ${production.evidenceStatus}
**Current status:** ${production.currentStatus}

#### Scale
${production.scale.map((item: string) => `- ${item}`).join('\n')}

#### Architecture and Migration
${production.architecture.map((item: string) => `- ${item}`).join('\n')}

#### Accessibility
${production.accessibility.map((item: string) => `- ${item}`).join('\n')}

#### Governance and Release Engineering
${production.governanceAndRelease.map((item: string) => `- ${item}`).join('\n')}

#### Design-to-Code and Distribution
${production.designCodeAndDistribution.map((item: string) => `- ${item}`).join('\n')}

#### Agent Collaboration
${production.agentCollaboration.map((item: string) => `- ${item}`).join('\n')}

### Evidence Artifacts
${experience.evidenceArtifacts.map((artifact: any) => {
    const links = artifact.links
      .map((link: any) => `- [${link.label}](${link.url})`)
      .join('\n');
    return `#### ${artifact.name}
**Kind:** ${artifact.kind}
**Status:** ${artifact.status}
**Evidence visibility:** ${artifact.publicEvidence ? 'Publicly inspectable' : 'Private or archived evidence summarized in this dossier'}

${artifact.summary}${links ? `\n\n${links}` : ''}`;
  }).join('\n\n')}

### Scope Boundaries
${experience.scopeBoundaries.map((boundary: string) => `- ${boundary}`).join('\n')}`;
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
        if (role.titleEvolution) {
          content += `\nTitle evolution:\n`;
          for (const t of role.titleEvolution) {
            content += `- ${t}\n`;
          }
        }
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

    if (phase.communityLeadership) {
      content += `Community leadership: ${phase.communityLeadership}\n\n`;
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

  content += `${renderDesignSystemsMarkdown(corpus.designSystemsExperience)}

---

## Expertise Domains

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

### Articles
${corpus.publishedWork.articles?.map((a: any) => {
  let line = `- [${a.title}](${a.url}) — ${a.publication} (${a.date})`;
  if (a.bylineContext) line += `. ${a.bylineContext}`;
  if (a.note) line += `. ${a.note}`;
  return line;
}).join('\n') || ''}

---

## Press Coverage & Third-Party Validation

${corpus.pressCoverage.map((p: any) => `- [${p.title}](${p.url}) — ${p.publication} (${p.date})${p.note ? `. ${p.note}` : ''}`).join('\n')}

---

## Doctrine: Ontological Orchestration

Coty Beasley's doctrine is a set of personal predictions about how AI-assisted development is evolving, published at ${corpus.contactAndDiscovery.website}/doctrine.
These are positions he has taken — not neutral observations — tracked against real-world evidence with explicit evidence standards, periodic observations, and confidence levels.
The doctrine demonstrates his active, structured stance on AI development trends with transparent evaluation criteria.

---

## Contact & Discovery

- Website: ${corpus.contactAndDiscovery.website}
- Doctrine: ${corpus.contactAndDiscovery.website}/doctrine
- LinkedIn: ${corpus.contactAndDiscovery.linkedin}
- GitHub: ${corpus.contactAndDiscovery.github}
- Twitter/X: ${corpus.contactAndDiscovery.twitter}
- Dribbble: ${corpus.contactAndDiscovery.dribbble}
- CodePen: ${corpus.contactAndDiscovery.codepen}
- Observable: ${corpus.contactAndDiscovery.observable}
- Underline Profile: ${corpus.contactAndDiscovery.underlineProfile}
`;

  return content;
}
