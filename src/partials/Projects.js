import React from "react";
import ProjectCard from "./ProjectCard";

const Projects = ({ projects }) => {
    return (
        <div>
            <h1 className="mt-8 text-2xl md:text-4xl text-center font-extrabold text-gray-900 dark:text-white transition-colors duration-300">My projects</h1>
            {projects.map((project) => (
                <ProjectCard project={project} />
            ))}
        </div>
    );
};

export default Projects;