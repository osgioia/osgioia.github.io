import React from "react";
import EducationCard from "./EducationCard";

const Education = ({ education }) => {
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <h1 className="text-2xl md:text-4xl text-center font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
        Education
      </h1>
      <div className="flex flex-wrap justify-center mt-8">
        {education.map((edu, index) => (
          <EducationCard key={index} education={edu} />
        ))}
      </div>
    </div>
  );
};

export default Education;

