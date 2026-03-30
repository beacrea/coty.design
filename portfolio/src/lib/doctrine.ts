export interface DoctrineData {
  name: string;
  description: string;
  version: string;
  dateCreated: string;
  dateModified: string;
  status: string;
  reviewCadence: string;
  author: { name: string; affiliation: { name: string; description: string } };
  thesis: string;
  definitions: Definition[];
  claims: Claim[];
  statusDefinitions: Record<string, string>;
  evidenceQualityRubric: EvidenceTier[];
}

export interface Definition {
  term: string;
  description: string;
}

export interface Observation {
  period: string;
  notes: string[];
}

export interface Reference {
  label: string;
  url: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  shortName: string;
  title: string;
  statement: string;
  rationale: string;
  status: string;
  statusLastChanged: string;
  supportingSignals: string[];
  challenges: string[];
  evaluationCriteria: string[];
  observations: Observation[];
  references: Reference[];
  splitFrom?: string;
  splitVersion?: string;
}

export interface EvidenceTier {
  tierLevel: string;
  description: string;
}

let cached: DoctrineData | null = null;

export async function fetchDoctrine(): Promise<DoctrineData> {
  if (cached) return cached;

  const res = await fetch('/doctrine.jsonld');
  if (!res.ok) {
    throw new Error(`Failed to fetch doctrine data: ${res.status}`);
  }
  const raw = await res.json();

  cached = {
    name: raw.name,
    description: raw.description,
    version: raw.version,
    dateCreated: raw.dateCreated,
    dateModified: raw.dateModified,
    status: raw.status,
    reviewCadence: raw.reviewCadence,
    author: {
      name: raw.author.name,
      affiliation: {
        name: raw.author['schema:affiliation']?.name ?? '',
        description: raw.author['schema:affiliation']?.description ?? '',
      },
    },
    thesis: raw.thesis,
    definitions: raw.definitions.map((d: any) => ({
      term: d.term,
      description: d.description,
    })),
    claims: raw.claims.map((c: any) => ({
      id: (c['@id'] ?? '').replace('#', ''),
      claimNumber: c.claimNumber,
      shortName: c.shortName,
      title: c.title,
      statement: c.statement,
      rationale: c.rationale,
      status: c.status,
      statusLastChanged: c.statusLastChanged,
      supportingSignals: c.supportingSignals ?? [],
      challenges: c.challenges ?? [],
      evaluationCriteria: c.evaluationCriteria ?? [],
      observations: (c.observations ?? []).map((o: any) => ({
        period: o.period,
        notes: o.notes ?? [],
      })),
      references: (c.references ?? []).map((r: any) => ({
        label: r.label,
        url: r.url,
      })),
      splitFrom: c.splitFrom,
      splitVersion: c.splitVersion,
    })),
    statusDefinitions: raw.statusRules?.statusDefinitions ?? {},
    evidenceQualityRubric: (raw.evidenceQualityRubric ?? []).map((t: any) => ({
      tierLevel: t.tierLevel,
      description: t.description,
    })),
  };

  return cached;
}

const STATUS_ORDER = [
  'Proposed',
  'Active',
  'Emerging',
  'Supported',
  'Strongly supported',
  'Contentious',
  'Refuted (for now)',
  'Retired',
];

export function statusLevel(status: string): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export function getStatusColor(status: string): { bg: string; fg: string; dot: string } {
  const colors: Record<string, { bg: string; fg: string; dot: string }> = {
    'Proposed': { bg: 'oklch(0.92 0.02 250)', fg: 'oklch(0.35 0.08 250)', dot: 'oklch(0.55 0.15 250)' },
    'Active': { bg: 'oklch(0.92 0.03 200)', fg: 'oklch(0.35 0.10 200)', dot: 'oklch(0.55 0.15 200)' },
    'Emerging': { bg: 'oklch(0.92 0.04 145)', fg: 'oklch(0.35 0.10 145)', dot: 'oklch(0.55 0.18 145)' },
    'Supported': { bg: 'oklch(0.90 0.05 130)', fg: 'oklch(0.30 0.12 130)', dot: 'oklch(0.50 0.20 130)' },
    'Strongly supported': { bg: 'oklch(0.88 0.06 130)', fg: 'oklch(0.25 0.14 130)', dot: 'oklch(0.45 0.22 130)' },
    'Contentious': { bg: 'oklch(0.92 0.04 45)', fg: 'oklch(0.35 0.12 45)', dot: 'oklch(0.55 0.18 45)' },
    'Refuted (for now)': { bg: 'oklch(0.92 0.04 25)', fg: 'oklch(0.35 0.12 25)', dot: 'oklch(0.50 0.18 25)' },
    'Retired': { bg: 'oklch(0.92 0 0)', fg: 'oklch(0.45 0 0)', dot: 'oklch(0.55 0 0)' },
  };
  return colors[status] ?? colors['Proposed'];
}

export function getStatusColorDark(status: string): { bg: string; fg: string; dot: string } {
  const colors: Record<string, { bg: string; fg: string; dot: string }> = {
    'Proposed': { bg: 'oklch(0.22 0.03 250)', fg: 'oklch(0.78 0.10 250)', dot: 'oklch(0.65 0.15 250)' },
    'Active': { bg: 'oklch(0.22 0.04 200)', fg: 'oklch(0.78 0.12 200)', dot: 'oklch(0.65 0.15 200)' },
    'Emerging': { bg: 'oklch(0.22 0.05 145)', fg: 'oklch(0.78 0.12 145)', dot: 'oklch(0.65 0.18 145)' },
    'Supported': { bg: 'oklch(0.20 0.06 130)', fg: 'oklch(0.80 0.14 130)', dot: 'oklch(0.60 0.20 130)' },
    'Strongly supported': { bg: 'oklch(0.18 0.07 130)', fg: 'oklch(0.82 0.16 130)', dot: 'oklch(0.58 0.22 130)' },
    'Contentious': { bg: 'oklch(0.22 0.05 45)', fg: 'oklch(0.78 0.14 45)', dot: 'oklch(0.65 0.18 45)' },
    'Refuted (for now)': { bg: 'oklch(0.22 0.05 25)', fg: 'oklch(0.78 0.14 25)', dot: 'oklch(0.60 0.18 25)' },
    'Retired': { bg: 'oklch(0.22 0 0)', fg: 'oklch(0.65 0 0)', dot: 'oklch(0.50 0 0)' },
  };
  return colors[status] ?? colors['Proposed'];
}

export function confidenceLevel(status: string): number {
  const map: Record<string, number> = {
    'Proposed': 1,
    'Active': 2,
    'Emerging': 3,
    'Supported': 4,
    'Strongly supported': 5,
    'Contentious': 3,
    'Refuted (for now)': 1,
    'Retired': 0,
  };
  return map[status] ?? 0;
}
