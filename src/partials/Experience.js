import React from "react";
import ExperienceCard from "./ExperienceCard";

const Experience = ({ experience }) => {
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <h1 className="text-2xl md:text-4xl text-center font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
        Experience
      </h1>
      <div className="mt-8">
        {experience.map((exp, index) => (
          <ExperienceCard key={index} experience={exp} />
        ))}
      </div>
    </div>
  );
};

export default Experience;

