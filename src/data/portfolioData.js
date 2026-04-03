/**
 * Portfolio content — place project images in /public/images/
 * (ai.jpg, fantasy.png, health.jpg, interview.png, payment.png)
 *
 * Résumé: add your PDF as public/resume.pdf — it is served at /resume.pdf
 */
export const portfolioData = {
  siteTitle: 'Rahul Sharma — Full Stack Engineer & AI Builder',
  metaDescription:
    'Full stack engineer and AI builder. Java, TypeScript, React, distributed systems, and production-grade software — portfolio of Rahul Sharma.',

  loadingMarquee: [
    'Full Stack Engineer',
    'Software Engineer',
    'AI Builder',
    'Distributed Systems',
  ],

  navbar: {
    initials: 'RS',
    nameShort: 'Rahul Sharma',
    connectLabel: 'LinkedIn',
    connectUrl: 'https://www.linkedin.com/in/rsharma84/',
  },

  hero: {
    greeting: "Hello! I'm",
    firstName: 'RAHUL',
    lastName: 'SHARMA',
    rolePrefix: 'Full Stack',
    rolePrimary: 'Engineer',
    roleSecondary: 'AI Builder',
    intro:
      'Full-stack engineer shipping production systems and AI workflows — MS @ Northeastern, previously at WebCraft IT (10k+ daily users). Java · TypeScript · Python · AWS.',
    statusLine: 'MS @ Northeastern · Open to opportunities',
    focusPills: [
      'Java & Spring',
      'TypeScript & React',
      'Python & FastAPI',
      'AWS & Terraform',
      'AI / LLMs',
      'Distributed systems',
    ],
  },

  heroTerminal: {
    fileName: 'rahul.sh',
    whoami: 'rahul.sharma · full-stack · ai-builder',
    catCommand: 'cat ./stack.txt',
    stackLine: 'Java · TypeScript · Python · AWS · AI-native tooling',
  },

  about: {
    title: 'About me',
    subtitle:
      'Full-stack engineer shipping production systems — from APIs and data pipelines to interfaces users feel.',
    highlights: [
      { label: 'Experience', value: '2+ years' },
      { label: 'Domains', value: 'Backend · Cloud · AI' },
      { label: 'Stack', value: 'Java · TypeScript · Python' },
      { label: 'Now', value: 'MS @ Northeastern' },
    ],
    paragraphs: [
      "I'm a Full Stack Software Engineer with 2+ years of experience building scalable, production-grade systems across Java, Python, and TypeScript. I specialize in shipping end-to-end features — event-driven backends, cloud infrastructure, responsive frontends, and AI-powered workflows.",
      "I'm pursuing my MS in Information Systems at Northeastern University, focused on distributed systems, applied AI, and software craft that holds up in production.",
    ],
  },

  whatIDo: {
    title: 'What I do',
    cards: [
      {
        heading: 'Full stack engineering',
        subheading: 'Production systems at scale',
        description:
          'I build performant, maintainable applications end-to-end from React/Next.js frontends to Java Spring Boot and Node.js backends, backed by PostgreSQL and Redis, deployed on AWS with CI/CD.',
        tags: [
          'Java & Spring Boot',
          'React & TypeScript',
          'Node.js & FastAPI',
          'PostgreSQL & Redis',
          'REST & GraphQL APIs',
          'AWS & AI-native tools',
        ],
      },
      {
        heading: 'AI & LLM integration',
        subheading: 'Shipping AI in production',
        description:
          'I integrate LLMs into real workflows, building RAG pipelines, agentic systems, and AI-powered features that extract, personalize, and automate at scale — not just demos.',
        tags: [
          'OpenAI & Anthropic APIs',
          'RAG pipelines',
          'Agentic workflows',
          'Prompt engineering',
          'LLM evaluation',
          'AI-native dev tools',
        ],
      },
      {
        heading: 'Cloud & DevOps',
        subheading: 'Infrastructure that ships fast',
        description:
          "I provision, deploy, and monitor cloud-native applications with Terraform, Docker, and CI/CD — because great software means nothing if it doesn't run reliably in production.",
        tags: [
          'AWS (EC2, RDS, S3, ALB)',
          'Terraform & Packer',
          'Docker & Kubernetes',
          'GitHub Actions CI/CD',
          'CloudWatch monitoring',
          'Zero-downtime deploys',
        ],
      },
    ],
  },

  work: {
    title: 'My work',
    subtitle: 'Production systems, AI platforms, and full-stack products',
    projects: [
      {
        title: 'AI-Powered Document Intelligence Platform',
        category: 'LLM-powered data extraction',
        tools: 'Python, FastAPI, OpenAI API, RAG, PostgreSQL, Docker, AWS',
        image: '/images/ai.jpg',
        link: 'https://github.com/rahul24sharma/AI-Powered-Legal-Document-Intelligence-platform',
      },
      {
        title: 'Distributed Payment Processing Platform',
        category: 'Event-driven financial system',
        tools: 'Java, Spring Boot, Kafka, PostgreSQL, Redis, Docker, AWS',
        image: '/images/payment.png',
        link: 'https://github.com/rahul24sharma',
      },
      {
        title: 'Cloud-Native Health Tracker',
        category: 'Full stack app with IaC on AWS',
        tools: 'Node.js, Express, MySQL, Terraform, Packer, AWS (EC2, RDS, ALB, ASG, CloudWatch)',
        image: '/images/health.jpg',
        link: 'https://github.com/rahul24sharma/webapp',
      },
      {
        title: 'Fantasy Edge',
        category: 'Live sports fan platform',
        tools: 'TypeScript, React, Next.js, REST APIs, Bootstrap, real-time data',
        image: '/images/fantasy.png',
        link: 'https://fantasy-edge-seven.vercel.app/',
      },
      {
        title: 'AI Voice Agent Interview Platform',
        category: 'Real-time AI voice application',
        tools: 'TypeScript, React, AI voice APIs, real-time processing',
        image: '/images/interview.png',
        link: 'https://full-stack-real-time-ai-voice-agent-interview-platform-tawny.vercel.app/',
      },
    ],
  },

  career: {
    title: 'Experience & education',
    subtitle:
      'Work history on the left — degrees and study on the right.',
    experience: {
      heading: 'Experience',
      items: [
        {
          role: 'Software engineer',
          company: 'WebCraft IT · Indore, India',
          period: '2023–24',
          description:
            'Built production full-stack applications with Java Spring Boot, React/TypeScript, and Python. Designed event-driven pipelines, optimized PostgreSQL schemas, deployed on AWS with CI/CD, and integrated LLM-powered features — serving 10,000+ daily users across 5+ enterprise systems.',
        },
        {
          role: 'Software engineer intern',
          company: 'WebCraft IT · Indore, India',
          period: '2022–23',
          description:
            'Developed Java (Spring Boot) and Python (FastAPI) backend services automating business workflows. Optimized database performance, built React frontend components, and wrote comprehensive test suites — cutting query latency by 80% and saving 6+ engineering hours weekly.',
        },
      ],
    },
    education: {
      heading: 'Education',
      items: [
        {
          degree: 'MS in Information Systems',
          school: 'Northeastern University · Boston',
          period: '2024–2026',
          description:
            'GPA: 3.7. Coursework in distributed systems, machine learning, database systems, and software engineering. Actively building AI and full-stack projects.',
        },
        {
          degree: 'BE Computer Science',
          school: 'RGPV University · India',
          period: '2019–2023',
          description:
            'Undergraduate foundation in algorithms, systems, databases, and software engineering.',
        },
      ],
    },
  },

  contact: {
    connectHeading: 'Connect',
    connectLabel: 'LinkedIn — rsharma84',
    connectUrl: 'https://www.linkedin.com/in/rsharma84/',
    socialHeading: 'Links',
    creditPrefix: 'Designed & developed by',
    creditName: 'Rahul Sharma',
    copyrightYear: '2026',
    formHeading: "Let's talk",
    formLede:
      'Reach out for roles, collaborations, or to discuss distributed systems and AI — I respond on LinkedIn.',
    /** Used by command palette (⌘K) “Copy email”. Set to your address or leave null. */
    email: null,
  },

  /**
   * GitHub `owner/repo` for the status strip (last push via public API).
   * Set to `null` to skip the request. Public repos only (private → 404 without a token).
   */
  status: {
    githubRepo: 'rahul24sharma/PortfolioDevFuture',
  },

  /** Estimated read time for #main uses words / wordsPerMinute. */
  readTime: {
    wordsPerMinute: 200,
  },

  insights: {
    eyebrow: 'Craft & trust',
    title: 'How I ship',
    lede:
      'Trade-offs I default to, one honest production lesson, and the shelf I reach for when designing systems.',
    decisionLog: {
      title: 'Decisions I stand by',
      items: [
        {
          decision: 'Relational DB first',
          reason:
            'Postgres (or similar) until proven otherwise — constraints, migrations, and query clarity beat schema drift in production.',
        },
        {
          decision: 'Thin controllers, explicit boundaries',
          reason:
            'Keep HTTP/API layers dumb; push business rules into testable services so refactors don’t ripple unpredictably.',
        },
        {
          decision: 'Observability with the feature',
          reason:
            'Structured logs, metrics, and traces ship with the change — debugging blind in prod is a design failure.',
        },
      ],
    },
    lesson: {
      title: 'What broke & what I learned',
      body:
        'Early on I optimized a hot path before measuring end-to-end latency — saved microseconds while users still waited on an N+1 elsewhere. Now I profile the request first, fix the biggest measured gap, then tighten loops. Performance work without a trace is guesswork.',
    },
    readingStack: {
      title: 'Reading stack',
      items: [
        {
          title: 'Designing Data-Intensive Applications (Kleppmann)',
          note: 'My go-to when reasoning about storage, replication, and streams.',
        },
        {
          title: 'Release It! (Nygard)',
          note: 'Stability patterns — bulkheads, timeouts, and failing safe.',
        },
        {
          title: 'High Output Management (Grove)',
          note: 'Leverage, meetings, and clarity — for leading projects, not just coding them.',
        },
      ],
    },
  },

  socialLinks: {
    github: 'https://github.com/rahul24sharma',
    linkedin: 'https://www.linkedin.com/in/rsharma84/',
    portfolio: 'https://portfolio-25-s-rahul.vercel.app/',
    /** PDF file: public/resume.pdf → /resume.pdf */
    resume: '/Rahul_Sharma.pdf',
  },
}
