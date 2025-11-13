import React from "react";
import { FaGraduationCap } from "react-icons/fa";

const EducationCard = ({ education: { institution, title, years, issued } }) => {
  return (
    <div className="w-full sm:w-1/2 m-4 mx-auto p-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaGraduationCap className="text-3xl text-blue-600 dark:text-blue-400" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {title}
          </h3>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2 transition-colors duration-300">
            {institution}
          </p>
          {(years || issued) && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
              {years || issued}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationCard;

