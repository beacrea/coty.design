import { isbot } from 'isbot';

const AI_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'anthropic-ai',
  'ChatGPT-User',
  'Amazonbot'
];

export function isAIAgent(userAgent: string): boolean {
  if (isbot(userAgent)) {
    return AI_CRAWLERS.some(crawler => 
      userAgent.toLowerCase().includes(crawler.toLowerCase())
    );
  }
  return false;
}

export function getEnhancedJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Coty Beasley",
    "jobTitle": "Design and Product Leader",
    "description": "Good design brings clarity to complexity and makes technology actually useful. With this in mind, I work at the intersection of systems, people, and innovation to help organizations and communities connect, collaborate, and grow.",
    "url": "https://coty.design",
    "sameAs": [
      "https://linkedin.com/in/cbeasley",
      "https://github.com/beacrea"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Underline Technologies",
      "foundingDate": "2019",
      "description": "Open-access fiber network platform serving residents, businesses, and institutions"
    },
    "knowsAbout": [
      "Product Design",
      "Design Systems",
      "Product Strategy",
      "Cross-functional Team Leadership",
      "Financial Technology",
      "Civic and Government Technology",
      "Consumer Robotics",
      "Medical Platforms",
      "Networks and Telecommunications",
      "Digital Mapping and GIS",
      "Artificial Intelligence",
      "User Experience Design"
    ],
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Computer Science"
    },
    "alumniOf": {
      "@type": "Organization",
      "name": "Two decades of product and design leadership experience"
    }
  };
}

export function injectEnhancedJsonLd(): void {
  const userAgent = navigator.userAgent;
  
  if (isAIAgent(userAgent)) {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.textContent = JSON.stringify(getEnhancedJsonLd(), null, 2);
    } else {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(getEnhancedJsonLd(), null, 2);
      document.head.appendChild(script);
    }
  }
}
