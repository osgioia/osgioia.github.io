import React from "react";
import { FaBriefcase } from "react-icons/fa";

const ExperienceCard = ({ experience: { company, role, period, description } }) => {
  return (
    <div className="w-full max-w-4xl mx-auto m-4 p-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaBriefcase className="text-3xl text-green-600 dark:text-green-400" />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {role}
              </h3>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-1 transition-colors duration-300">
                {company}
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0 sm:ml-4 transition-colors duration-300">
              {period}
            </p>
          </div>
          {description && description.length > 0 && (
            <ul className="mt-4 space-y-2">
              {description.map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 transition-colors duration-300 flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;

