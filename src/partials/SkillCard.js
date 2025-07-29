import React from "react";

const SkillCard = ({ skillName, skillIcon }) => {
  return (
    <div className="m-4 w-40 flex-none mx-auto text-center p-5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
        {skillIcon}
      </div>
      <p className="text-xl font-semibold mt-4 text-gray-900 dark:text-white transition-colors duration-300">{skillName}</p>
    </div>
  );
};

export default SkillCard;
