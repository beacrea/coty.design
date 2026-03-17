export interface ConnectItem {
  text: string;
  description: string;
  url: string | null;
}

export const siteContent = {
  opener: {
    name: "Coty Beasley",
    role: "Product Architect &\u00A0Co\u2011Founder",
    summary: "I define how complex products fit together, aligning strategy, AI behavior, workflows, and interface rules so platforms scale without losing\u00A0coherence."
  },
  
  capabilities: {
    heading: "What I Define",
    items: [
      "Product vision, strategy, and architecture for complex multiparty\u00A0platforms",
      "AI\u2011enabled workflow design, advancing productive and responsible use of AI in real\u00A0products",
      "Design infrastructure: scalable systems, component architecture, and design\u2011engineering\u00A0alignment",
      "Humanizing complex systems, making technology genuinely useful and coherent for the people it\u00A0serves",
      "Operating model definition, shaping how cross\u2011functional product teams work\u00A0together",
      "Semantic governance: canonical schemas, contracts, and interface specifications that keep platforms consistent at\u00A0scale"
    ]
  },
  
  bio: {
    heading: "Background",
    items: [
      "Co\u2011founder at Underline, where I lead product strategy, AI innovation, and design engineering for the first privately funded open\u2011access fiber network in the\u00A0US.",
      "My work across two decades has been shaped by one consistent idea: critical systems \u2014 infrastructure, finance, data \u2014 should be accessible to the people who depend on\u00A0them."
    ]
  },

  proofStrip: {
    heading: "Track Record",
    items: [
      "Previously: VP Product, Neighborly (civic fintech) \u00B7 Co\u2011Founder & Head of Product, Edge\u00A0Up\u00A0Sports \u00D7 IBM\u00A0Watson",
      "Press: Wired \u00B7 Fast\u00A0Company \u00B7 Bloomberg \u00B7 NBC\u00A0News \u00B7 Forbes \u00B7\u00A0NPR",
      "Sector experience spanning infrastructure, fintech, civic tech, enterprise, and AI\u00A0systems"
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
