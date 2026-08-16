const PROJECTS = [
  {
    title: "OpenGIN Bot",
    org: "Lanka Data Foundation",
    date: "Dec 2025 – May 2026",
    desc: "An LLM-powered agent for querying the OpenGIN government-data platform in natural language. Implemented LangGraph-based orchestration, parallel tool execution, topic-shift detection, entity caching, fact distillation, sliding-context memory, and automatic context pruning, engineered specifically to reduce token usage without losing conversational accuracy.",
    tags: ["LangGraph", "Next.js", "Agent Orchestration", "Fast API"],
    links: [{ label: "View repository ↗", url: "https://github.com/sehansi-9/research/tree/opengin-bot/opengin-bot" }],
    detail: {
      problem: "The OpenGIN platform exposes Sri Lanka's government data as a temporal graph database — a rich but highly technical structure that most users can't query directly. The challenge was building a conversational interface capable of understanding natural language, translating it into multi-step graph querying API endpoints, and doing so within strict token and cost constraints without sacrificing accuracy across multi-turn conversations.",
      approach: [
        { heading: "LangGraph Agent Orchestration", body: "Designed a multi-node LangGraph pipeline where each step in the reasoning process is a distinct node. This made the agent's behaviour transparent and predictable." },
        { heading: "Topic Shift Detection", body: "Integrated a secondary lightweight 8B LLM as a 'topic skeptic' — it compares each new user question against the current knowledge pool and decides whether the conversation is continuing or pivoting. On a pivot, a hard state purge fires, wiping stale facts and entity caches." },
        { heading: "Fact Distillation & Entity Cache", body: "Raw JSON tool results are compressed into concise, structured 'facts' by a Fact-Clerk LLM. A separate entity cache maps internal graph IDs to human-readable names, preventing the primary LLM from ever having to re-resolve the same entity twice." },
        { heading: "Tiered Truncation & Sliding Context", body: "Older tool results are progressively downgraded in fidelity — recent results get 1000 character summaries, older ones get 300 character thumbnails. The active conversation window is capped at the 10 most recent messages. Together, these mechanisms keep every prompt well within token limits." },
        { heading: "Auto-Healing & Resilience", body: "A heal_json utility fixes malformed LLM tool call arguments (trailing quotes, stray backticks) before they reach the tool layer. A retry loop with up to 3 attempts handles rate-limit (429) errors with a 5-second backoff, and context-overflow (400/413) errors with an emergency context wipe." },
        { heading: "Parallel Tool Execution", body: "Entity, relation, and attribute searches can be dispatched in parallel batches via LangGraph's ToolNode, significantly cutting latency for queries that require data from multiple graph endpoints simultaneously." }
      ],
      highlights: [
        "Multi-model architecture: 120B primary reasoning LLM + two 8B specialist LLMs for topic detection and fact distillation",
        "Dual-layer state sync: LangGraph-managed persistent state for message history, plus local-only truncated copies for context assembly",
        "Zero-redundancy entity resolution via a session-scoped ID-to-name lookup table",
        "Fact pool capped at 15 most recent distilled facts to bound token growth across long sessions",
        "Emergency context recovery: if the assembled prompt overflows, the agent falls back to facts-only context and retries"
      ],
      stack: {
        backend: ["FastAPI", "LangGraph", "Pydantic", "Python", "Groq API"],
        frontend: ["Next.js (App Router)", "TypeScript", "Tailwind CSS"]
      },
      snapshots: [
        { src: "https://drive.google.com/thumbnail?id=18VtLLeFPw1GKG7EMp7WF7sKe44IwN-Vl&sz=w1600", alt: "LangGraph Architecture" },
        { src: "https://media.licdn.com/dms/image/v2/D562DAQHIX22oARCsGg/profile-treasury-image-shrink_1920_1920/B56Z_NkXvCJcAc-/0/1785860291778?e=1787378400&v=beta&t=qr5mQ0UHV2DLPda_yz4ZQaTOXnxVuQ1u0Wbm1r66Z-Y", alt: "Org structure query example" },
        { src: "https://media.licdn.com/dms/image/v2/D562DAQG51atWYlAdWg/profile-treasury-image-shrink_800_800/B56Z_Nh7WJJcAM-/0/1785859651193?e=1787378400&v=beta&t=NRe1pJrLF814uZgrQmHAMYvmxi2loH1TLdZ5aHRaIHA", alt: "Data query example" },
      ],
      sdgs: [
        {
          id: 16,
          title: "SDG 16: Peace, Justice & Strong Institutions",
          desc: "Promotes public access to information and government data transparency by converting complex temporal graph queries into natural language.",
          img: "https://www.logos.aiesec.org/_next/image?url=https%3A%2F%2Faiesec-logos.s3.eu-west-1.amazonaws.com%2FTGG_Icon_Color_16.png&w=640&q=75"
        },
        {
          id: 9,
          title: "SDG 9: Industry, Innovation & Infrastructure",
          desc: "Promotes efficient agentic AI orchestration for digital public data infrastructure.",
          img: "https://www.logos.aiesec.org/_next/image?url=https%3A%2F%2Faiesec-logos.s3.eu-west-1.amazonaws.com%2FTGG_Icon_Color_09.png&w=640&q=75"
        }
      ]
    }
  },
  {
    title: "OpenGINXplore",
    org: "Lanka Data Foundation",
    date: "May 2025 – May 2026",
    desc: "A temporal public and government data visualisation platform for Sri Lanka, built as part of an open-government initiative, tracing how the country's administrative structure has shifted over time.",
    tags: ["Data Visualization", "React", "Backend-for-Frontend Architecture"],
    links: [
      { label: "View Repository ↗", url: "https://github.com/LDFLK/openginxplore" },
      { label: "View Live Site ↗", url: "https://openginxplore.opendata.lk/" },
      { label: "Read More ↗", url: "https://medium.com/@sehansi/openginxplore-inside-the-journey-of-building-a-time-aware-map-of-sri-lankan-government-7972bf3c44c6" }
    ],
    detail: {
      problem: "Sri Lanka's government is a complex, constantly shifting ecosystem of ministries, departments, and public institutions. Administrative structures, reporting lines, and cabinet portfolios change frequently across gazette publications and presidential tenures. Most public data platforms present only static snapshots, making it nearly impossible for researchers, journalists, and citizens to trace institutional evolution, accountability, or past chains of command over time.",
      approach: [
        {
          heading: "Temporal Gazette Timeline & Range Selector",
          body: "Designed a time-aware data visualization architecture indexed by gazette publication timestamps. Integrated a multifaceted date range selector that allows users to travel back and forth in time, isolating specific presidential tenures or viewing government snapshots at any precise point in history."
        },
        {
          heading: "Dual 3D Network & Hierarchical Views",
          body: "Implemented two complementary visualization modes for interconnected data: an interactive 3D network graph for exploring complex structural relationships and a structured hierarchical tree view for clear chain-of-command analysis. Visual indicators highlight new entity transitions, additions, and cumulative changes per snapshot."
        },
        {
          heading: "Tracing Entity Histories & Profiles",
          body: "Built a historical entity profiling system that tracks past relationships and institutional roles across time. Users can inspect the full historical timeline of any department or person, showing how responsibilities shifted across cabinet reassignments and structural reorganizations."
        },
        {
          heading: "Entity-Associated Statistical Visualization",
          body: "Created a customizable plotting tool to visualize node-associated numerical metrics across time. Users can select data types and dynamically generate bar charts and line graphs to compare trends across multiple timestamps."
        },
        {
          heading: "Open Data Export & Shareable Snapshots",
          body: "Supported public research by integrating a multi-format export engine (CSV, JSON, XLSX, PDF) and a state serialization URL generator. Users can share exact temporal views and active filter states via a single deep link to promote open-government collaboration."
        }
      ],
      highlights: [
        "Time-aware government architecture mapping Sri Lanka's administrative evolutions across gazette timestamps",
        "Interactive 3D network graph and traditional hierarchy tree views for multi-perspective exploration",
        "Granular entity history timelines tracing past organizational roles and ministerial reassignments",
        "Customizable statistical chart generator (bar, line, pie) for cross-timestamp comparative analysis",
        "Deep-link state serialization and multi-format data exports (CSV, JSON, XLSX, PDF) for public research transparency",
        "Manage caches and sync server data across the client using TanStack Query"
      ],
      stack: {
        frontend: ["React", "TanStack Query", "Data Visualization", "3D Network Graphs", "Recharts", "Tailwind CSS"],
        platform: ["Temporal Graph API", "Open Government Data", "Backend-for-Frontend Architecture"]
      },
      snapshots: [
        { src: "https://miro.medium.com/v2/resize:fit:1200/1*kYRDmonDLdDe0x2hM8Py9w.png", alt: "Gazette Timeline and Range Selector" },
        { src: "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*VecS2jEs2t4N0ihV4CkORA.png", alt: "3D Network View" },
        { src: "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*bGNFaCo-G2ZPPBeCp0fayw.png", alt: "Statistics Expolatory View" }
      ],
      sdgs: [
        {
          id: 16,
          title: "SDG 16: Peace, Justice & Strong Institutions",
          desc: "Tracks Sri Lanka's administrative history, cabinet shifts, and gazettes to ensure public institutional accountability and open government transparency.",
          img: "https://www.logos.aiesec.org/_next/image?url=https%3A%2F%2Faiesec-logos.s3.eu-west-1.amazonaws.com%2FTGG_Icon_Color_16.png&w=640&q=75"
        },
        {
          id: 9,
          title: "SDG 9: Industry, Innovation & Infrastructure",
          desc: "Builds time-aware 3D network visualizations and interactive tools for exploring public government datasets.",
          img: "https://www.logos.aiesec.org/_next/image?url=https%3A%2F%2Faiesec-logos.s3.eu-west-1.amazonaws.com%2FTGG_Icon_Color_09.png&w=640&q=75"
        },
        {
          id: 17,
          title: "SDG 17: Partnerships for the Goals",
          desc: "Facilitates multi-stakeholder open-data collaboration and public research through shareable snapshot deep links and data exports.",
          img: "https://www.logos.aiesec.org/_next/image?url=https%3A%2F%2Faiesec-logos.s3.eu-west-1.amazonaws.com%2FTGG_Icon_Color_17.png&w=640&q=75"
        }
      ]
    }
  },
  {
    title: "Resilify",
    org: "University of Westminster · Group Project",
    date: "Oct 2024 – May 2025",
    desc: "An AI-powered, gamified OCD therapy assistant, built with mental health professionals to improve therapy adherence. Selected for the Cutting Edge '25 exhibition and Top 15 of the TEDxColombo × John Keells IT Pitch-a-Thon.",
    tags: ["Flutter", "Rive Animations", "Python"],
    links: [
      { label: "View Social Platform ↗", url: "https://www.instagram.com/resilify_/" },
      { label: "View Repository ↗", url: "https://github.com/Resilify" }
    ],
    detail: {
      problem: "Loop Tape Exposure & Response Prevention (ERP) — a technique where OCD patients record an intrusive thought out loud and listen to it on repeat until anxiety naturally habituates. Practicing ERP alone is emotionally taxing, tedious, and prone to high drop-out rates. Resilify transforms this clinical exercise into a gamified, supportive experience that keeps patients motivated, tracks therapy adherence accurately, and rewards session persistence.",
      approach: [
        {
          heading: "Loop Tape Exposure & Response Prevention (ERP)",
          body: "The patient records their anxiety-inducing intrusive thought via the in-app voice recorder. A custom duration picker sets the session time. Once triggered, it continuously loops the audio playback with pitch modulation (to mimic the Resilify mascot) while a Timer visually tracks exposure progress, keeping the patient in the therapy loop until anxiety subsides."
        },
        {
          heading: "Active Presence Balloon Mechanic",
          body: "To prevent patients from tuning out or resorting to avoidance behaviors, a floating balloon appears randomly. The patient must tap to pop it within a 10-second window. Missing a balloon ends the session and routes the patient according to progress — awarding 3 stars and a Halfway Victory badge if past 50% duration, or triggering a comforting Game Over if under halfway."
        },
        {
          heading: "Rive Animation & Mascot Integration",
          body: "Every UI interaction is animated with Rive. A friendly mascot dynamically toggles a 'talking' animation synced with audio stream state updates. The microphone control widget orchestrates 5 separate Rive animation controllers (idle, start record, recording, end record, delete) for smooth state transitions."
        },
        {
          heading: "Cross-Platform Audio Architecture",
          body: "Handles dual runtime environments: native Android uses the record package with path_provider for filesystem storage and permission_handler for mic access, while Web uses the microphone package with blob URLs."
        },
        {
          heading: "Streak System & Hive Data Persistence",
          body: "Session metrics (timestamp, duration, stars earned) are saved to Hive local storage upon session completion. The StreakService evaluates Firebase user credentials to trigger an animated flame scene (Rive) and a smooth AnimatedFlipCounter day-streak increment before routing back home."
        }
      ],
      highlights: [
        "Built in collaboration with mental health professionals to ensure clinical validity for ERP therapy",
        "Gamified exposure: balloon pop challenges ensures active patient focus without clinical fatigue",
        "Tiered rewards: 5 stars for full completion, 3 stars + Halfway Victory badge for >50% duration, encouraging partial progress over total abandonment",
        "Multi-layered Rive animations: Mascot lip-syncing, 5-state mic transitions, balloon popping, and day-streak flame animations",
        "Exhibition Winner & Finalist: Selected for Cutting Edge '25 exhibition and Top 15 of TEDxColombo × John Keells IT Pitch-a-Thon"
      ],
      stack: {
        mobile: ["Flutter", "Dart", "Rive Animations", "Hive Storage"],
        backend: ["Python", "Firebase Auth"]
      },
      snapshots: [
        {
          type: "embed",
          src: "https://drive.google.com/file/d/1m8WbFTK1d2nasEJKBAphGcLMpf7Gos7s/preview",
          alt: "ERP Loop Video Demo"
        },
        {
          type: "embed",
          src: "https://drive.google.com/file/d/1YiuAZ6utuutimqUGHL9EHTA5ptkBKA0Q/preview",
          alt: "Rive animations in the making"
        },
        // {
        //   src: "https://media.licdn.com/dms/image/v2/D560BAQF6b2-CNTRSxg/company-logo_200_200/company-logo_200_200/0/1734342113378/resilifyapp_logo?e=1788393600&v=beta&t=DM3AKcTW8VRttrHMzeKFDL9Agfqqc9KHPmRN9gacxcw",
        //   alt: "Resilify"
        // }
      ],
      sdgs: [
        {
          id: 3,
          title: "SDG 3: Good Health & Well-being",
          desc: "Supports mental health care adherence by gamifying OCD Exposure & Response Prevention (ERP) therapy alongside clinical professionals.",
          img: "https://www.logos.aiesec.org/_next/image?url=https%3A%2F%2Faiesec-logos.s3.eu-west-1.amazonaws.com%2FTGG_Icon_Color_03.png&w=640&q=75"
        },
        {
          id: 9,
          title: "SDG 9: Industry, Innovation & Infrastructure",
          desc: "Combines real-time state animations, cross-platform audio pipelines, and mobile health technology.",
          img: "https://www.logos.aiesec.org/_next/image?url=https%3A%2F%2Faiesec-logos.s3.eu-west-1.amazonaws.com%2FTGG_Icon_Color_09.png&w=640&q=75"
        }
      ]
    }
  },
  {
    title: "Concurrent Ticket Management System",
    date: "Nov 2024 – Dec 2024",
    desc: "Full-stack ticketing system simulating synchronised multi-threaded ticket allocation between customers and vendors, a Java CLI for bulk configuration, real-time WebSocket updates, and transaction logging for debugging concurrent operations.",
    tags: ["Java", "Spring Boot", "WebSockets", "Angular"],
    links: [{ label: "View Repository ↗", url: "https://github.com/sehansi-9/Ticketing_System" }],
    detail: {
      problem: "Real-world ticket sales requires managing concurrent, synchronized interactions between multiple vendors releasing tickets and multiple customers attempting to buy them simultaneously. The challenge was preventing race conditions, over-allocation, and deadlocks in a multi-threaded pool while streaming real-time status updates across a full-stack Java/Angular application.",
      approach: [
        {
          heading: "Multi-Threaded Synchronized Ticket Pool",
          body: "Engineered a thread-safe ticket pool buffer in Java with synchronized locks and Producer-Consumer thread coordination. Vendor threads continuously release tickets up to max pool capacity at configured rates, while Customer threads retrieve tickets at designated buying rates without causing race conditions or deadlocks."
        },
        {
          heading: "Java CLI for Bulk Setup & Configuration",
          body: "Built a standalone Java CLI tool that allows administrators to perform bulk configuration of ticket pool parameters (capacity, release rate, retrieval rate, vendor/customer counts). Saved configurations to a shared config.json file and recorded raw transaction logs to local text files for offline auditability."
        },
        {
          heading: "Spring Boot Backend & WebSockets",
          body: "Developed a Spring Boot REST & WebSocket server that loads CLI configurations, manages active simulation threads, and handles dynamic Start/Stop controls. Integrated WebSocket messaging to broadcast live transaction events directly to connected client browsers."
        },
        {
          heading: "Angular Real-Time Dashboard",
          body: "Created an interactive Angular frontend displaying dynamic ticket pool statistics, real-time activity logs streamed via WebSockets, and controls to add individual customers/vendors on-the-fly and initiate or halt active background threads."
        },
        {
          heading: "Persistent Audit & Transaction Logging",
          body: "Implemented dual-layer transaction logging across both the CLI and Spring Boot backend. Every ticket release and purchase action is saved to timestamped text files in root directories for precise debugging, concurrency verification, and monitoring."
        }
      ],
      highlights: [
        "Synchronized Producer-Consumer architecture in Java ensuring thread safety during concurrent ticket transactions",
        "Dual-component workflow: Java CLI for bulk setup & persistent JSON configuration + Spring Boot WebApp",
        "Real-time WebSocket event streaming pushing live vendor/customer actions to the Angular dashboard",
        "Dynamic simulation controls allowing on-the-fly thread initialization, individual user additions, and thread interruption",
        "Timestamped file transaction logging for auditing multi-threaded race condition safety"
      ],
      stack: {
        backend: ["Java", "Spring Boot", "WebSockets"],
        frontend: ["Angular", "TypeScript", "RxJS", "WebSockets"]
      },
      snapshots: [
        { src: "https://drive.google.com/thumbnail?id=14oQDUwd8GVYvsNAz88XyNEFpgykgZbia&sz=w1600", alt: "Angular Realtime Dashboard" },
        { src: "https://drive.google.com/thumbnail?id=1m2-X3iSMwfBjYRwsLDsA7gfIXqy_xfzN&sz=w1600", alt: "Sequence Diagram" },
        { src: "https://drive.google.com/thumbnail?id=1aUa7-ZkMyNsG0-pQRe6fZ_YUKCizB6jR&sz=w1600", alt: "Transaction Logs" }
      ]
    }
  },
  {
    title: "Catstagram",
    date: "May 2024 – Jul 2024",
    desc: "A social platform exclusively for cat lovers, using TensorFlow's COCO-SSD image recognition model to enforce cat-only uploads, with JWT auth and a full MERN social feed.",
    tags: ["MERN", "JWT", "TensorFlow"],
    links: [{ label: "View Repository ↗", url: "https://github.com/sehansi-9/catstagram" }],
    detail: {
      problem: "Niche social communities often suffer from off-topic media posts and spam that degrade the user experience. Catstagram solves this by combining a full MERN social network with client-side AI image recognition, ensuring that only verified cat photos can be uploaded to the platform.",
      approach: [
        {
          heading: "TensorFlow COCO-SSD Content Filtering",
          body: "Integrated TensorFlow's COCO-SSD pre-trained object detection model directly into the upload workflow. Before any post is accepted, the image is analyzed client-side to verify the presence of a cat class, automatically rejecting non-feline uploads to keep the feed 100% purr-fect."
        },
        {
          heading: "Full MERN Architecture & REST API",
          body: "Architected a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application. Designed RESTful API endpoints for post creation, comment threads, like toggles, user follow/unfollow relationships, and profile updates."
        },
        {
          heading: "Secure JWT Session Management",
          body: "Implemented JSON Web Token (JWT) authentication with password hashing to secure user login sessions, protect private user endpoints, and maintain stateful client sessions across page reloads."
        },
        {
          heading: "Modular Frontend & Interactive Feeds",
          body: "Built a responsive, component-based frontend using React.js and Materialize CSS. Created dynamic feeds with real-time comment threads, active like counts, user profiles, and customized social feeds for cat enthusiasts."
        }
      ],
      highlights: [
        "Client-side AI image filtering using TensorFlow.js COCO-SSD to enforce cat-only media uploads",
        "Full MERN stack implementation supporting posts, likes, comments, and follow/unfollow interactions",
        "Secure user authentication pipeline built with JWTs and encrypted password storage",
        "Modular React frontend styled with Materialize CSS for responsive cross-device usability"
      ],
      stack: {
        frontend: ["React.js", "Materialize CSS", "TensorFlow.js (COCO-SSD)"],
        backend: ["Node.js", "Express.js", "MongoDB", "JWT Auth"]
      },
      snapshots: [
        { src: "https://media.licdn.com/dms/image/v2/D562DAQH_vkkxIUbC9g/profile-treasury-image-shrink_1920_1920/profile-treasury-image-shrink_1920_1920/0/1734680602737?e=1787382000&v=beta&t=AWrmpV_uHHtuA_Gtu9ee7T307L5qRQxDKNWRCfRt3Jk", alt: "Catstagram Social Feed" },
        { src: "https://media.licdn.com/dms/image/v2/D562DAQEUfitcu2QRKA/profile-treasury-image-shrink_8192_8192/profile-treasury-image-shrink_8192_8192/0/1734680699838?e=1787382000&v=beta&t=UnRYYq2CSkh2Liy3edmTIOWP5qjMNKrRFBXIJwE028E", alt: "TensorFlow COCO-SSD Cat Detector" },
        { src: "https://media.licdn.com/dms/image/v2/D562DAQH0zHdDIbh8jA/profile-treasury-image-shrink_1280_1280/profile-treasury-image-shrink_1280_1280/0/1734680676511?e=1787382000&v=beta&t=drgB7N-JwY4ta9NqC5HyRpC2d6vAndFHmxDfjqEg8gk", alt: "User Profile View" }
      ]
    }
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
  },
  {
    src: "https://drive.google.com/thumbnail?id=1dvYO6tyt7mO8Lsv114w3zjJIObe71mSn&sz=w1600",
    alt: "Quiz Competitions - Brainstorm",
    title: "Quiz Competitions - Brainstorm (2017 & 2019)",
    desc: "Emerged champions at 2017 Junior Category and 2nd Runner up at 2019 Senior Category at Brainstorm, the annual Table Quiz Competition organized by the Quiz Combine of Musaeus College"
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
