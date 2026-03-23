export interface ConnectItem {
  text: string;
  description: string;
  url: string | null;
}

export interface ProofRow {
  label: string;
  items: string[];
}


export const siteContent = {
  opener: {
    name: "Coty Beasley",
    role: "Product Architect &\u00A0Co\u2011Founder",
    summary: "I define how complex products fit together, aligning strategy, AI behavior, workflows, and interface rules so platforms scale without losing\u00A0clarity."
  },
  
  capabilities: {
    heading: "What I Work On",
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
      "Our mission is to make essential infrastructure accessible, competitive, and responsive to real human\u00A0needs.",
      "My work is built on a foundation in computer science, combined with two decades in product and design leadership. Each engagement aims for technical rigor, empathy, and\u00A0entrepreneurship.",
      "Across every domain, one consistent idea shapes my approach: critical systems \u2014 infrastructure, finance, data \u2014 should be accessible to the people who depend on\u00A0them."
    ]
  },

  proofStrip: {
    heading: "Track Record",
    rows: [
      { label: "Previously", items: [
        "VP\u00A0Product, Neighborly (civic\u00A0fintech)",
        "Co\u2011Founder &\u00A0Head\u00A0of\u00A0Product, Edge\u00A0Up\u00A0Sports \u00D7\u00A0IBM\u00A0Watson"
      ]},
      { label: "Featured In", items: [
        "Wired", "Fast\u00A0Company", "Bloomberg", "NBC\u00A0News", "Forbes", "NPR"
      ]},
      { label: "Sectors", items: [
        "Infrastructure", "Fintech", "Civic\u00A0Tech", "Enterprise", "AI\u00A0Systems"
      ]}
    ] as ProofRow[]
  },

  domainExperience: {
    heading: "Domain Experience",
    items: [
      "Telecom and network\u00A0infrastructure",
      "Financial technology and civic\u00A0fintech",
      "Civic and government technology\u00A0platforms",
      "AI systems, context engineering, and intelligent\u00A0workflows",
      "Medical platforms and connected\u00A0devices",
      "Digital mapping, GIS, and spatial\u00A0systems",
      "Multimedia, interface, and brand\u00A0systems"
    ]
  },

  advisory: {
    heading: "Advisory &\u00A0Speaking",
    framing: "Drawing on two decades across infrastructure, fintech, and AI\u00A0systems, I occasionally take on a small number of advisory and speaking\u00A0engagements.",
    rows: [
      { label: "Advisory", items: [
        "Product architecture\u00A0review",
        "AI product\u00A0strategy",
        "Design system\u00A0architecture"
      ]},
      { label: "Speaking", items: [
        "Building infrastructure for public\u00A0benefit",
        "AI as a product\u00A0discipline",
        "Scaling design systems across\u00A0organizations"
      ]}
    ] as ProofRow[]
  },

  connect: {
    heading: "Connect",
    items: [
      { text: "LinkedIn", description: "for professional conversations", url: "https://linkedin.com/in/cbeasley0" },
      { text: "GitHub", description: "for code and collaborations", url: "https://github.com/beacrea" },
      { text: "Advisory &\u00A0speaking", description: "inquiries via LinkedIn", url: "https://linkedin.com/in/cbeasley0" },
      { text: "Email", description: "available upon request", url: null }
    ] as ConnectItem[]
  },
  
  metadata: {
    legal: "\u00A9 Coty Beasley 2025",
    version: `v${__APP_VERSION__}`,
    versionUrl: `https://github.com/beacrea/coty.design/releases/tag/portfolio-v${__APP_VERSION__}`
  }
};
