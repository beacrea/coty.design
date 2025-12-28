export interface ConnectItem {
  text: string;
  description: string;
  url: string | null;
}

export const siteContent = {
  opener: {
    name: "Coty Beasley",
    role: "Design and Product Leader",
    summary: "Good design brings clarity to complexity and makes technology actually useful. With this in mind, I work at the intersection of systems, people, and innovation to help organizations and communities connect, collaborate, and grow."
  },
  
  recentFocus: {
    heading: "Recent Focus",
    items: [
      "Setting product vision and strategy",
      "Leading cross-functional teams",
      "Humanizing complex digital experiences",
      "Building design systems and development workflows",
      "Advancing productive and responsible use of emerging AI",
      "Developing and mentoring talent",
      "Driving innovation for network, civic, and social impact"
    ]
  },
  
  currentStatus: {
    heading: "Current Status",
    items: [
      "Founder at Underline Technologies (est. 2019), where I create an open-access fiber network platform serving residents, businesses, and institutions.",
      "Our mission is to make essential infrastructure accessible, competitive, and responsive to real human needs.",
      "I serve as Head of Product Design and Innovation."
    ]
  },
  
  foundations: {
    heading: "Foundations",
    items: [
      "My work is built on a strong foundation in computer science, combined with two decades in product and design leadership. Each project aims for technical rigor, empathy, and entrepreneurship.",
      "I bring experience across civic technology, infrastructure, artificial intelligence, and emerging platforms, with a consistent commitment to the people and communities these systems serve."
    ]
  },
  
  domainExpertise: {
    heading: "Domain Expertise",
    items: [
      "Financial technology",
      "Civic and government technology",
      "Consumer robotics and smart devices",
      "Medical platforms and devices",
      "Networks and telecommunications",
      "Digital mapping and GIS",
      "Multimedia, interface, and brand systems"
    ]
  },
  
  familyExplainer: {
    heading: "Family Explainer Tool",
    description: "Cornered at the grocery store? Neighbors asking questions? Need to explain what I do and \"I think he does something with computers\" isn't cutting it? This AI translates my work into plain English.",
    buttonText: "Ask My AI Assistant",
    buttonUrl: "https://ask.coty.design"
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
    legal: "© Coty Beasley 2025",
    version: `v${__APP_VERSION__}`,
    versionUrl: `https://github.com/beacrea/coty.design/releases/tag/portfolio-v${__APP_VERSION__}`
  }
};
