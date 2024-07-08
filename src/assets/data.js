import React from "react";
import { FaRegSun, FaCode, FaCloud } from "react-icons/fa";

const BOOTSTRAP_FOR_SKILL_ICON = "text-4xl mx-auto inline-block";
const data = {
  name: "Osvaldo Gioia",
  title: "Senior Software Engineer",
  social: {
    github: "https://github.com/osgioia",
    linkedln: "https://www.linkedin.com/in/osvaldogioia/",
    twitter: "https://x.com/aioigzo",
    email: "contact@osgioia.dev",
  },
  about: {
    title: "My Background",
    description:
      "Well-qualified Full Stack Developer and experienced Team Leader, hailing from Argentina. I bring over 12 years of expertise in backend development, specializing in Python, JavaScript, TypeScript, SQL, and NoSQL databases. Proficient in cloud platforms like AWS, Azure, and GCP, I possess comprehensive knowledge of programming utilities and languages, enabling smooth handling of both backend and frontend development requirements. A collaborative team player with excellent technical abilities, I excel in guiding teams to success while ensuring seamless project execution. ",
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
  ],
  projects: [
    {
      title: "Catastro-Notificacion",
      description: "Github Action Notification of Catastro of Paraguay.",
      tags: [
        "python",
        "github actions",
        "telegram",
        "json"
      ],
      link: "https://github.com/osgioia/catastro-notification"
    },
    {
      title: "SubGPT",
      description: "Translate SRT files with ChatGPT.",
      tags: [
        "python",
        "openai api"
      ],
      link: "https://github.com/osgioia/SubGPT"
    },
    {
      title: "step-functions-gateway",
      description: "Step Functions Example with API Gateway.",
      tags: [
        "nodejs",
        "aws",
        "serverless framework",
      ],
      link: "https://github.com/osgioia/node-tracker"
    },
    {
      title: "bot-menus-QnAMaker",
      description: "Bot Framework v4 QnA Maker bot sample.",
      tags: [
        "c sharp",
        "net core",
        "qna maker",
        "azure",
        "bot framework",
      ],
      link: "https://github.com/osgioia/node-tracker"
    }
  ]
};
export default data;
