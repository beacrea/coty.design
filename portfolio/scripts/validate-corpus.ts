import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CORPUS_PATH = path.resolve(__dirname, '../content/agent-corpus.json');

interface ValidationResult {
  pass: boolean;
  check: string;
  message: string;
}

const results: ValidationResult[] = [];

function check(name: string, condition: boolean, message: string) {
  results.push({ pass: condition, check: name, message });
}

function run() {
  let corpus: any;
  try {
    const raw = fs.readFileSync(CORPUS_PATH, 'utf-8');
    corpus = JSON.parse(raw);
    check('JSON Parse', true, 'Corpus file is valid JSON');
  } catch (err) {
    check('JSON Parse', false, `Failed to parse corpus: ${err}`);
    printResults();
    process.exit(1);
  }

  check('Has lastUpdated', !!corpus.lastUpdated, `lastUpdated: ${corpus.lastUpdated || 'MISSING'}`);
  check('Has canonicalUrl', !!corpus.canonicalUrl, `canonicalUrl: ${corpus.canonicalUrl || 'MISSING'}`);
  check('Has canonicalBio', !!corpus.canonicalBio && corpus.canonicalBio.length > 50, `canonicalBio length: ${corpus.canonicalBio?.length || 0} chars`);

  check('Has identity', !!corpus.identity, 'identity section exists');
  if (corpus.identity) {
    check('identity.name', !!corpus.identity.name, `name: ${corpus.identity.name || 'MISSING'}`);
    check('identity.jobTitle', !!corpus.identity.jobTitle, `jobTitle: ${corpus.identity.jobTitle || 'MISSING'}`);
    check('identity.organization', !!corpus.identity.organization, `organization: ${corpus.identity.organization || 'MISSING'}`);
    check('identity.currentLocation', !!corpus.identity.currentLocation, `currentLocation: ${corpus.identity.currentLocation || 'MISSING'}`);
    check('identity.education', Array.isArray(corpus.identity.education) && corpus.identity.education.length > 0, `${corpus.identity.education?.length || 0} education entries`);
    if (Array.isArray(corpus.identity.education)) {
      for (const edu of corpus.identity.education) {
        check(`education entry: ${edu.institution}`, !!edu.institution, `institution: ${edu.institution || 'MISSING'}`);
        if (edu.completed) {
          check(`education degree: ${edu.institution}`, !!edu.degree, `degree: ${edu.degree || 'MISSING'}`);
        } else {
          check(`education fieldOfStudy: ${edu.institution}`, !!edu.fieldOfStudy, `fieldOfStudy: ${edu.fieldOfStudy || 'MISSING'}`);
          check(`education note: ${edu.institution}`, !!edu.note, `note: ${edu.note ? 'present' : 'MISSING'}`);
        }
      }
    }
    check('identity.linkedin', !!corpus.identity.linkedin, `linkedin: ${corpus.identity.linkedin || 'MISSING'}`);
    check('identity.github', !!corpus.identity.github, `github: ${corpus.identity.github || 'MISSING'}`);
    check('identity.description', !!corpus.identity.description && corpus.identity.description.length > 50, `description length: ${corpus.identity.description?.length || 0}`);
  }

  check('Has geographicJourney', Array.isArray(corpus.geographicJourney) && corpus.geographicJourney.length > 0, `${corpus.geographicJourney?.length || 0} entries`);
  check('Has narrativeThroughLine', !!corpus.narrativeThroughLine?.theme, `theme: ${corpus.narrativeThroughLine?.theme || 'MISSING'}`);

  check('Has careerTimeline', Array.isArray(corpus.careerTimeline) && corpus.careerTimeline.length > 0, `${corpus.careerTimeline?.length || 0} phases`);
  if (corpus.careerTimeline) {
    for (const phase of corpus.careerTimeline) {
      check(`timeline: ${phase.phase || phase.period}`, !!phase.period, `period: ${phase.period || 'MISSING'}`);
    }
  }

  check('Has expertiseDomains', Array.isArray(corpus.expertiseDomains) && corpus.expertiseDomains.length >= 5, `${corpus.expertiseDomains?.length || 0} domains`);
  if (corpus.expertiseDomains) {
    for (const domain of corpus.expertiseDomains) {
      check(`domain: ${domain.domain}`, !!domain.domain && !!domain.evidence && !!domain.depth, 'has domain, evidence, and depth');
    }
  }

  check('Has differentiators', !!corpus.differentiators?.coreCapability, 'coreCapability exists');
  check('Has differentiators.rareCombination', Array.isArray(corpus.differentiators?.rareCombination) && corpus.differentiators.rareCombination.length > 0, `${corpus.differentiators?.rareCombination?.length || 0} items`);

  check('Has professionalAffiliations', Array.isArray(corpus.professionalAffiliations) && corpus.professionalAffiliations.length > 0, `${corpus.professionalAffiliations?.length || 0} affiliations`);
  check('Has pressCoverage', Array.isArray(corpus.pressCoverage) && corpus.pressCoverage.length > 0, `${corpus.pressCoverage?.length || 0} citations`);
  if (corpus.pressCoverage) {
    for (const press of corpus.pressCoverage) {
      check(`press: ${press.title?.slice(0, 40)}`, !!press.title && !!press.url && !!press.publication, 'has title, url, publication');
    }
  }

  check('Has speakingTopics', Array.isArray(corpus.speakingTopics) && corpus.speakingTopics.length > 0, `${corpus.speakingTopics?.length || 0} topics`);
  check('Has contactAndDiscovery', !!corpus.contactAndDiscovery?.website && !!corpus.contactAndDiscovery?.linkedin, 'has website and linkedin');
  check('Has publishedWork', !!corpus.publishedWork?.topics, 'publishedWork section exists');

  const bioWordCount = corpus.canonicalBio?.split(/\s+/).length || 0;
  check('Bio length 50-120 words', bioWordCount >= 50 && bioWordCount <= 120, `${bioWordCount} words (target: 60-90)`);

  printResults();

  const failures = results.filter(r => !r.pass);
  if (failures.length > 0) {
    console.log(`\n❌ ${failures.length} check(s) failed`);
    process.exit(1);
  } else {
    console.log(`\n✅ All ${results.length} checks passed`);
    process.exit(0);
  }
}

function printResults() {
  console.log('\n=== Agent Corpus Validation ===\n');
  for (const r of results) {
    const icon = r.pass ? '✅' : '❌';
    console.log(`${icon} ${r.check}: ${r.message}`);
  }
}

run();
