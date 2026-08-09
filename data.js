const PROJECTS = [
  {
    title: "OpenGIN Bot",
    org: "Lanka Data Foundation",
    date: "Dec 2025 – May 2026",
    desc: "An LLM-powered agent for querying the OpenGIN government-data platform in natural language. Implemented LangGraph-based orchestration, parallel tool execution, topic-shift detection, entity caching, fact distillation, sliding-context memory, and automatic context pruning, engineered specifically to reduce token usage without losing conversational accuracy.",
    tags: ["LangGraph", "Next.js", "Agent Orchestration", "Fast API"],
    links: [{ label: "View repository ↗", url: "https://github.com/sehansi-9/research/tree/opengin-bot/opengin-bot" }]
  },
  {
    title: "OpenGINXplore",
    org: "Lanka Data Foundation",
    date: "May 2025 – May 2026",
    desc: "A temporal public and government data visualisation platform for Sri Lanka, built as part of an open-government initiative, tracing how the country's administrative structure has shifted over time.",
    tags: ["Data Visualization", "React"],
    links: [
      { label: "View Live Site ↗", url: "https://openginxplore.opendata.lk/" },
      { label: "Read More ↗", url: "https://medium.com/@sehansi/openginxplore-inside-the-journey-of-building-a-time-aware-map-of-sri-lankan-government-7972bf3c44c6" }
    ]
  },
  {
    title: "Resilify",
    org: "University of Westminster · Group Project",
    date: "Oct 2024 – May 2025",
    desc: "An AI-powered, gamified OCD therapy assistant, built with mental health professionals to improve therapy adherence. Selected for the Cutting Edge '25 exhibition and Top 15 of the TEDxColombo × John Keells IT Pitch-a-Thon.",
    tags: ["Flutter", "Rive Animations", "Python"],
    links: [
      { label: "View Project ↗", url: "https://www.sdgp.lk/project/a97414c0-50d4-4db5-ad2e-f19c0c5859c1" },
      { label: "View Social Platform ↗", url: "https://www.instagram.com/resilify_/" },
      { label: "View Repository ↗", url: "https://github.com/Resilify" }
    ]
  },
  {
    title: "Concurrent Ticket Management System",
    date: "Nov 2024 – Dec 2024",
    desc: "Full-stack ticketing system simulating synchronised multi-threaded ticket allocation between customers and vendors, a Java CLI for bulk configuration, real-time WebSocket updates, and transaction logging for debugging concurrent operations.",
    tags: ["Java", "Spring Boot", "WebSockets", "Angular"],
    links: [{ label: "View Repository ↗", url: "https://github.com/sehansi-9/Ticketing_System" }]
  },
  {
    title: "Catstagram",
    date: "May 2024 – Jul 2024",
    desc: "A social platform exclusively for cat lovers, using TensorFlow's COCO-SSD image recognition model to enforce cat-only uploads, with JWT auth and a full MERN social feed.",
    tags: ["MERN", "JWT", "TensorFlow"],
    links: [{ label: "View Repository ↗", url: "https://github.com/sehansi-9/catstagram" }]
  },
  {
    title: "Digital Art Portfolio",
    date: "since May 2020",
    desc: "Making illustrations using MS Powerpoint",
    tags: ["PowerPoint Art"],
    links: [{ label: "View Portfolio ↗", url: "https://www.instagram.com/sp_pptart/" }]
  }
];

const CERTIFICATIONS = [
  {
    title: "Neo4j Fundamentals",
    issuer: "Neo4j",
    date: "May 2025",
    url: "https://graphacademy.neo4j.com/c/72278eda-abfc-408b-a2a9-1eae771e5db5"
  },
  {
    title: "Spring Boot 2.0 Essential Training",
    issuer: "LinkedIn Learning",
    date: "Dec 2024",
    url: "https://www.linkedin.com/learning/certificates/f82e834b28d25b54e633406e521cd447077fac5aa4684913acb720e2cbdc0bf0/"
  },
  {
    title: "Java Object-Oriented Programming",
    issuer: "LinkedIn Learning",
    date: "Dec 2024",
    url: "https://www.linkedin.com/learning/certificates/498b7749881b595810b04a7fbddaefa3e7e69a4aa0c32d485ab66950d6624fdf?u=76664938"
  },
  {
    title: "Angular Essential Training",
    issuer: "LinkedIn Learning",
    date: "Dec 2024",
    url: "https://www.linkedin.com/learning/certificates/677ac317c373fef7d229d7b25d39186d01c4ceded1ac8633d300cd3644887a98"
  },
  {
    title: "Java (Intermediate)",
    issuer: "Sololearn",
    date: "Jun 2024",
    url: "https://www.sololearn.com/en/certificates/CC-L5GY1VZ7"
  },
  {
    title: "Article of the Month — May 2024",
    issuer: "IEEE Computer Society Student Branch, IIT",
    date: "Jun 2024",
    url: "https://www.linkedin.com/posts/ieee-computer-society-student-chapter-of-iit_ieeecs-iit-mediumblog-activity-7207326822491967488-ERb1?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEbEKwIBN9ML2adM_2MpvZTPPboCVmNrumM",
    badge: "Winner",
    extraLink: { label: "Read Article ↗", url: "https://www.sdgp.lk/project/a97414c0-50d4-4db5-ad2e-f19c0c5859c1" }
  },
  {
    title: "Artificial Intelligence",
    issuer: "American Institute of Innovation",
    date: "Sep 2023",
    url: "https://media.licdn.com/dms/image/v2/D562DAQEQZeFtywxlvQ/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1715430692079?e=1786888800&v=beta&t=GlY8nIrMvDS39Oqs71wZlSuQAGJyC6WdR9VbYWpQyas"
  },
  {
    title: "Webspire Front-End Development Workshop",
    issuer: "IEEE Computer Society Student Branch, IIT",
    date: "Feb 2024",
    url: "https://media.licdn.com/dms/image/v2/D562DAQFgJp_YnovUlw/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1708155709957?e=1786888800&v=beta&t=R1fSgaoPaODXRneqAyzslsw7xF0oVFfL39bXdi9BBcU"
  },
  {
    title: "All Island Virtual Wesak STEM Competition 2020 (Solo)",
    issuer: "Dialog Axiata PLC",
    date: "May 2020",
    url: "https://media.licdn.com/dms/image/v2/D562DAQGPv_pWK9jsHg/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1708153756579?e=1786888800&v=beta&t=3pfjjRk91Se0HfQ-JlPXQpfnxtYLNK2dBVlhZtQIbRo",
    badge: "Winner, Senior Category"
  },
  {
    title: "Inter-School English Essay Competition 2018",
    issuer: "National Institute of Business Management",
    date: "Sep 2018",
    url: "https://media.licdn.com/dms/image/v2/D562DAQEE0saX_I_W7g/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1708154378735?e=1786888800&v=beta&t=J4LWTyuF6lfQDdlq_QnKEg24z_QMvGsE0HYYubf1QUE",
    badge: "3rd Place, Under-19"
  }
];

const EVENTS = [
  {
    src: "https://media.licdn.com/dms/image/v2/D562DAQHaHdtbH_itoQ/profile-treasury-image-shrink_800_800/B56Z6C3zRqI8AI-/0/1780312127223?e=1786888800&v=beta&t=VS-_wlqDMp9upi-kwctQkpcgicC-TGqcnRMR5vTwps0",
    alt: "SWE intern @ LDF",
    title: "Software Engineer Intern at Lanka Data Foundation - 2025/2026",
    desc: "Contributed to the development of open source software for open government initiative"
  },
  {
    src: "https://media.licdn.com/dms/image/v2/D5622AQFn5UqmN62cUA/feedshare-shrink_480/B56ZiwxOxrHQAY-/0/1755312356235?e=1787788800&v=beta&t=r1dBEWi9CpOvedKLuJ5YsrfsHpVEqZXJfIWYx0TGot4",
    alt: "WSO2Con Asia 2025",
    title: "WSO2Con Asia - Jul 2025",
    desc: "Got invited to participate at the 3-day tech conference organised by WSO2 in Colombo"
  },
  {
    src: "https://media.licdn.com/dms/image/v2/D562DAQETuCIrfpFQ3A/profile-treasury-image-shrink_800_800/B56ZeRR_wgHUAY-/0/1750489105101?e=1786888800&v=beta&t=BBjxYRTg331l-8RdhgS2ehLE8DVvNy5E8nfDeCbR-gU",
    alt: "Cutting Edge - Jun 2025",
    title: "Cutting Edge - Jun 2025",
    desc: "Project 'Resilify' was selected to be presented at the annual tech exhibition organised by Informatics Institute of Technology"
  },
  {
    src: "https://media.licdn.com/dms/image/v2/D562DAQFJHM2EG9Uxkw/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1721288449956?e=1786888800&v=beta&t=pgT3ey9mQqxPo4jaYet5AddmfNzdkMznN9aoXkdzkqc",
    alt: "Cutting Edge 2024 Logistics Team",
    title: "Cutting Edge - Jul 2024",
    desc: "Served as part of the logistics committee for the annual tech exhibition organised by the Informatics Institute of Technology"
  },
  {
    src: "https://media.licdn.com/dms/image/v2/D562DAQEBh7TM-ARKJA/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1715627067770?e=1786888800&v=beta&t=kFbMybvSeLReNgd7M_8tBMakpW4e5XHw8PlkjYXoixc",
    alt: "Build with AI Event GDG",
    title: "Build with AI - May 2024",
    desc: 'Selected from an applicant pool of <a href="https://media.licdn.com/dms/image/v2/D562DAQFKoKlbhiyhwA/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1719363289447?e=1786888800&v=beta&t=FdkxcPYpVeV6u0Tv4BmZ--GmNb-aiMY7nlXVsgEgJQo" target="_blank" rel="noopener"><u>800</u></a> for the Google Developer Groups Sri Lanka Event'
  },
  {
    src: "https://media.licdn.com/dms/image/v2/D5622AQEwf8T2RM_zYg/feedshare-shrink_1280/feedshare-shrink_1280/0/1719195653846?e=1787788800&v=beta&t=DJ0_fvyDXIUkSReTAikCGLXtcofgv6J4AUc02_00UDM",
    alt: "Duothon - 2024",
    title: "Duothon - May 2024",
    desc: "Selected for the finals of the inter-university hackathon organised by IEEE CS Chapter of NSBM Green University"
  },
  {
    src: "https://media.licdn.com/dms/image/v2/D562DAQFVF5KCabaKbA/profile-treasury-image-shrink_800_800/B56ZVaMnCRHoAY-/0/1740975012332?e=1786888800&v=beta&t=40zBe2I82aL0_XV4G8s5oGVNJzKzSjHJ4Yb9TDGsKsU",
    alt: "RobotNexus Workshop Series - Apr 2024",
    title: "RobotNexus - Apr 2024",
    desc: "Robotics Workshop organized by the IEEE Robotics and Automation IIT Chapter"
  },
    {
    src: "https://media.licdn.com/dms/image/v2/D562DAQGefkHmK6HTNQ/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1721240800043?e=1786896000&v=beta&t=gy_ZXKNv5IfB8ApXolmU89zvMl3jnwHZ2AZ-gfeNS3Q",
    alt: "Awards Day - AII",
    title: "Awards Day at AII Campus - Sep 2023",
    desc: "Successfully completed Introduction to Artificial Intelligence and Machine Learning Course at American Institution of Innovation (first batch)"
  },
  {
    src: "https://media.licdn.com/dms/image/v2/D562DAQFDIfP239liog/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1721240537067?e=1786888800&v=beta&t=yxRfIl-y1YYgX3dKA4vDDOBSoZoWkGRpHbjqnY2Zjwo",
    alt: "Senior Science Society",
    title: "Senior Science Society Committee - 2021/2022",
    desc: 'Served as Vice Treasurer of the Senior Mathematics Branch of the Senior Science Society at Musaeus College · Organising committee and part of the judge panel for <a href="https://www.instagram.com/project_insurgence/" target="_blank" rel="noopener"><u>Insurgence \'21</u></a>'
  }
];

const BLOG = [
  {
    url: "https://medium.com/@sehansi/openginxplore-inside-the-journey-of-building-a-time-aware-map-of-sri-lankan-government-7972bf3c44c6",
    img: "https://miro.medium.com/v2/resize:fit:1200/1*kYRDmonDLdDe0x2hM8Py9w.png",
    meta: "Feb 2026 · 5 min read",
    title: "OpenGINXplore: Inside the Journey of Building a Time-Aware Map of Sri Lankan Government",
    desc: "On the design decisions behind visualising a government structure that keeps changing; timelines, 3D networks, and tracing entity histories across time."
  },
  {
    url: "https://medium.com/@ieeecomputersocietyiit/from-sci-fi-to-reality-how-ibms-influence-keeps-humanity-closer-to-the-future-of-space-travel-3ecd70bf43fe",
    img: "https://miro.medium.com/v2/resize:fit:975/1*SED2hZEJbBY1n60cyOYvUQ.png",
    meta: "May 2024 · 3 min read · IEEE Computer Society SBC of IIT",
    title: "From Sci-Fi to Reality: How IBM's Influence Keeps Humanity Closer to the Future of Space Travel",
    desc: "A look at IBM's quieter role in space exploration; from Apollo-era computing to CIMON, its AI companion aboard the ISS, and edge computing in orbit."
  }
];
