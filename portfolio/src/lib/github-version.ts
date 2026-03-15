const GITHUB_API_URL = 'https://api.github.com/repos/beacrea/coty.design/releases';
const TAG_PREFIX = 'portfolio-v';

export interface VersionInfo {
  version: string;
  versionUrl: string;
}

function parseSemver(version: string): [number, number, number] | null {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

function compareSemver(a: string, b: string): number {
  const parsedA = parseSemver(a);
  const parsedB = parseSemver(b);
  if (!parsedA || !parsedB) return 0;
  for (let i = 0; i < 3; i++) {
    if (parsedA[i] !== parsedB[i]) return parsedB[i] - parsedA[i];
  }
  return 0;
}

export function getFallbackVersion(): VersionInfo {
  return {
    version: `v${__APP_VERSION__}`,
    versionUrl: `https://github.com/beacrea/coty.design/releases/tag/${TAG_PREFIX}${__APP_VERSION__}`
  };
}

export async function fetchLatestVersion(): Promise<VersionInfo> {
  const fallback = getFallbackVersion();

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!response.ok) {
      return fallback;
    }

    const releases: Array<{ tag_name: string; html_url: string }> = await response.json();

    const portfolioReleases = releases
      .filter(r => r.tag_name.startsWith(TAG_PREFIX))
      .map(r => ({ ...r, version: r.tag_name.replace(TAG_PREFIX, '') }))
      .sort((a, b) => compareSemver(a.version, b.version));

    if (portfolioReleases.length === 0) {
      return fallback;
    }

    const latest = portfolioReleases[0];

    return {
      version: `v${latest.version}`,
      versionUrl: latest.html_url
    };
  } catch {
    return fallback;
  }
}
