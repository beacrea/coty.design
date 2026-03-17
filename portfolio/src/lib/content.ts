export interface ConnectItem {
  text: string;
  description: string;
  url: string | null;
}

export const siteContent = {
  opener: {
    name: "Coty Beasley",
    role: "Product Architect & Co-Founder",
    summary: "I define how complex products fit together, aligning strategy, AI behavior, workflows, and interface rules so platforms scale without losing coherence."
  },
  
  capabilities: {
    heading: "What I Define",
    items: [
      "Product vision, strategy, and architecture across complex, multi-party platforms",
      "AI-enabled workflow design, advancing productive and responsible use of AI in real products",
      "Design infrastructure: scalable systems, component architecture, and design-engineering alignment",
      "Humanizing complex systems, making technology genuinely useful and coherent for the people it serves",
      "Operating model definition, shaping how cross-functional product teams work together",
      "Semantic governance: canonical schemas, contracts, and interface specifications that keep platforms consistent at scale"
    ]
  },
  
  bio: {
    heading: "Background",
    items: [
      "Co-founder at Underline, where I lead product strategy, AI innovation, and design engineering for the first privately funded open-access fiber network in the United States.",
      "My work across two decades has been shaped by one consistent idea: critical systems \u2014 infrastructure, finance, data \u2014 should be accessible to the people who depend on them."
    ]
  },

  proofStrip: {
    heading: "Track Record",
    items: [
      "Previously: VP Product, Neighborly (civic fintech) \u00B7 Co-Founder & Head of Product, Edge Up Sports \u00D7 IBM Watson",
      "Press: Wired \u00B7 Fast Company \u00B7 Bloomberg \u00B7 NBC News \u00B7 Forbes \u00B7 NPR",
      "Sector experience across infrastructure, fintech, civic tech, enterprise, and AI systems"
    ]
  },

  connect: {
    heading: "Connect",
    items: [
      { text: "LinkedIn", description: "for professional conversations", url: "https://linkedin.com/in/cbeasley0" },
      { text: "GitHub", description: "for code and collaborations", url: "https://github.com/beacrea" },
      { text: "Email", description: "available upon request", url: null }
    ] as ConnectItem[]
  },
  
  metadata: {
    legal: "\u00A9 Coty Beasley 2025",
    version: `v${__APP_VERSION__}`,
    versionUrl: `https://github.com/beacrea/coty.design/releases/tag/portfolio-v${__APP_VERSION__}`
  }
};
