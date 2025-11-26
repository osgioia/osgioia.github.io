import React from "react";
import {
  FaRegSun,
  FaCode,
  FaCloud,
  FaDatabase,
  FaUserTie,
} from "react-icons/fa";

const BOOTSTRAP_FOR_SKILL_ICON = "text-4xl mx-auto inline-block";
const data = {
  name: "Osvaldo Gioia",
  title: "Senior Software Engineer",
  social: {
    github: "https://github.com/osgioia",
    linkedin: "https://www.linkedin.com/in/osvaldogioia/",
    twitter: "https://x.com/aioigzo",
    email: "contact@osgioia.dev",
  },
  about: {
    title: "My Background",
    description:
      "Senior Backend Engineer with 14+ years of experience specializing in Node.js, TypeScript, AWS, SQL, and NoSQL databases. Skilled in designing scalable architectures, building reusable components, and optimizing cloud performance with a strong security mindset. I’m comfortable across the full stack, but my strength is backend and serverless systems. I enjoy mentoring teams, improving engineering processes, and delivering robust, high-impact solutions.",
  },
  skills: [
    {
      skillName: "Frontend",
      skillIcon: <FaCode className={BOOTSTRAP_FOR_SKILL_ICON} />,
    },
    {
      skillName: "Backend",
      skillIcon: <FaRegSun className={BOOTSTRAP_FOR_SKILL_ICON} />,
    },
    {
      skillName: "Cloud Services",
      skillIcon: <FaCloud className={BOOTSTRAP_FOR_SKILL_ICON} />,
    },
    {
      skillName: "Databases",
      skillIcon: <FaDatabase className={BOOTSTRAP_FOR_SKILL_ICON} />,
    },
    {
      skillName: "Leadership & Mentoring",
      skillIcon: <FaUserTie className={BOOTSTRAP_FOR_SKILL_ICON} />,
    },
  ],
  techStack: {
    languages: [
      "JavaScript",
      "TypeScript",
      "C#",
      "Python",
      "Java",
      "CoffeeScript",
    ],
    frameworks: [
      "Express",
      "Serverless Framework",
      "Flask",
      "Web2py",
      "Entity Framework",
      "React",
      "Redux",
      "Sequelize",
      "Prisma",
      "Knex.js",
      "Mongoose",
      "ASP.NET",
      "WPF",
      "Vue.js",
      "GraphQL",
    ],
    testing: ["Jest", "Cypress"],
    versionControl: ["Git", "Subversion"],
    databases: [
      "Progress 4GL",
      "MS SQL",
      "MySQL",
      "Oracle",
      "Postgres",
      "Redis",
      "DynamoDB",
      "MongoDB",
      "CouchDB",
    ],
    virtualization: ["Docker", "Kubernetes"],
    clouds: ["AWS", "Azure", "Google Cloud (GCP)"],
    softSkills: [
      "Leadership",
      "Team Collaboration",
      "Problem-Solving",
      "Effective Communication",
      "Time Management",
      "Adaptability",
      "Critical Thinking",
    ],
  },
  education: [
    {
      institution: "Universidad Tecnológica Nacional",
      title: "Técnico Superior en Programación",
      years: "2009 - 2014",
    },
    {
      institution: "Academia ITMaster",
      title: "Programador Web",
      years: "2018 - 2019",
    },
    {
      institution: "Amazon Web Services (AWS)",
      title: "AWS Certified Cloud Practitioner",
      issued: "Feb 2024",
    },
  ],
  experience: [
    {
      company: "Avenga",
      role: "Backend Engineer",
      period: "Aug 2025 - Present",
      description: [
        "Designed and maintained serverless backend services using Serverless Framework v4, AWS Lambda, DynamoDB, and SQS, enabling highly scalable and cost-efficient infrastructure.",
        "Implemented AWS Step Functions workflows to orchestrate complex financial operations with retries, auditing, observability, and state tracking.",
        "Developed event-driven architectures and optimized message processing pipelines, significantly improving system resilience and reducing execution latency.",
        "Delivered secure and compliant financial APIs, collaborating with cross-functional teams and applying cloud-native and automated testing best practices.",
      ],
    },
    {
      company: "FrontSpin",
      role: "Backend Engineer",
      period: "Dec 2024 - Jul 2025",
      description: [
        "Developed a public REST API with rate limiting using Java, Node.js with TypeScript, RabbitMQ, and Webhooks for secure third-party integrations.",
        "Maintained and enhanced the company’s internal CRM using Java, CoffeeScript, and CouchDB, improving performance and user experience.",
        "Contributed to an event-driven backend architecture implementing reusable design patterns, automated testing, and secure microservices best practices.",
      ],
    },
    {
      company: "StackZone",
      role: "Fullstack Engineer",
      period: "Jun 2022 - Dec 2024",
      description: [
        "Designed and developed StackZone, a secure and cost-efficient cloud governance solution with RESTful API architecture.",
        "Leveraged Node.js, Serverless Framework, AWS Lambda, AWS RDS (Postgres), and ElasticCache (Redis).",
        "Automated multi-account environments using AWS services, and implemented SQS and SNS for event-driven communication.",
      ],
    },
    {
      company: "Logicalis Latam",
      role: "Fullstack Engineer",
      period: "Sep 2021 - Jun 2022",
      description: [
        "Designed and delivered scalable software products using .NET Core, Node.js, Vue.js, and cloud platforms (GCP, Azure).",
        "Worked with Google Calendar and Microsoft Bot Framework APIs.",
      ],
    },
    {
      company: "Grupo Fidelatam",
      role: "Fullstack Developer / Freelance Consultant",
      period: "Mar 2021 - Jan 2023",
      description: [
        "Delivered scalable loyalty engineering projects using Node.js, React, MongoDB, Sequelize, Postgres, Docker, and GraphQL.",
        "Migrated monolith applications to microservices architecture with AWS and Kubernetes.",
        "Collaborated cross-functionally to ensure project success.",
      ],
    },
    {
      company: "Coderhouse",
      role: "Tutor Backend Node.js",
      period: "Sep 2021 - Dec 2021",
      description: [
        "Tutored students in backend concepts, emphasizing Node.js, Express, Knex.js, and Postgres best practices.",
        "Provided feedback and project guidance for skill development.",
      ],
    },
    {
      company: "Do Until Plus",
      role: "Full Stack Developer",
      period: "Oct 2014 - Dec 2020",
      description: [
        "Developed project plans and contributed ideas to enhance software products.",
        "Worked with .NET Framework, MS SQL, and Node.js to ensure integration and functionality.",
        "Integrated Google APIs for email automation.",
      ],
    },
    {
      company: "Close Up International",
      role: "Program Analyst",
      period: "Aug 2013 - Nov 2020",
      description: [
        "Solved program issues with in-depth analysis and modernization of legacy codebases.",
        "Used Progress 4GL OpenEdge for data modeling and analysis.",
        "Reduced operating costs and improved performance by updating old systems.",
      ],
    },
  ],
  projects: [
    {
      title: "Catastro-Notificacion",
      description: "Github Action Notification of Catastro of Paraguay.",
      tags: ["python", "github actions", "telegram", "json"],
      link: "https://github.com/osgioia/catastro-notification",
    },
    {
      title: "SubGPT",
      description: "Translate SRT files with ChatGPT.",
      tags: ["python", "openai api"],
      link: "https://github.com/osgioia/SubGPT",
    },
    {
      title: "step-functions-gateway",
      description: "Step Functions Example with API Gateway.",
      tags: ["nodejs", "aws", "serverless framework"],
      link: "https://github.com/osgioia/step-functions-gateway",
    },
    {
      title: "bot-menus-QnAMaker",
      description: "Bot Framework v4 QnA Maker bot sample.",
      tags: ["c sharp", "net core", "qna maker", "azure", "bot framework"],
      link: "https://github.com/osgioia/bot-menus-QnAMaker",
    },
  ],
};
export default data;
