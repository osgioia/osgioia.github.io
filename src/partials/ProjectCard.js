import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import GitHubButton from "react-github-btn";

const ProjectCard = ({ project: { title, description, tags, link } }) => {
  return (
    <div className="group w-full sm:w-1/2 m-4 mx-auto p-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors duration-300">
      <a href={link}>
        <h1 className="text-xl text-center font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
          {title}{" "}
          <FaExternalLinkAlt className="inline align-baseline" />
        </h1>
      </a>
      <hr className="my-4 border-gray-300 dark:border-gray-600" />
      <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{description}</p>
      <div className="mt-4 mb-8 flex flex-wrap justify-center items-center gap-2">
        {tags.map((tag) => (
          <div className="px-4 py-1 border-2 border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 transition-colors duration-300">{tag}</div>
        ))}
      </div>
      <div className="w-full text-center">
        <GitHubButton href={link} data-color-scheme="no-preference: light; light: light; dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star project on GitHub">Star</GitHubButton>
        {"  "}
        <GitHubButton href={link + "/fork"} data-color-scheme="no-preference: light; light: light; dark: dark;" data-icon="octicon-repo-forked" data-size="large" data-show-count="true" aria-label="Fork project on GitHub">Fork</GitHubButton>
      </div>
    </div>
  );
};

export default ProjectCard;
