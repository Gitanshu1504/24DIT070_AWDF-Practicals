import { useState } from "react";

function Projects() {
  const [showDetails, setShowDetails] = useState(true);

  const projects = [
    { title: "Portfolio Website", description: "Built a React-based personal portfolio." },
    { title: "Task Manager", description: "Created a small task tracker with reusable components." },
  ];

  return (
    <section className="card">
      <h2>Projects</h2>
      <button className="toggle-btn" onClick={() => setShowDetails((value) => !value)} type="button">
        {showDetails ? "Hide project details" : "Show project details"}
      </button>

      {showDetails && (
        <div className="project-list">
          {projects.map((project) => (
            <article key={project.title} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Projects;
