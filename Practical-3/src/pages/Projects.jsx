import { useEffect, useState } from "react";

function Spinner() {
  return (
    <div className="status-card" role="status" aria-live="polite">
      <div className="spinner" />
      <p>Loading repositories from GitHub...</p>
    </div>
  );
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-card error-card">
      <h3>Unable to load repositories</h3>
      <p>{message}</p>
      <button className="toggle-btn" onClick={onRetry} type="button">
        Retry
      </button>
    </div>
  );
}

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(true);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.github.com/users/octocat/repos?per_page=10");
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError(err.message || "Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter((repo) => repo.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return <section className="card"> <Spinner /> </section>;
  }

  if (error) {
    return <section className="card"> <ErrorMessage message={error} onRetry={fetchRepos} /> </section>;
  }

  return (
    <section className="card">
      <div className="section-heading">
        <h2>Projects</h2>
        <button className="toggle-btn" onClick={() => setShowDetails((value) => !value)} type="button">
          {showDetails ? "Hide project details" : "Show project details"}
        </button>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search repositories"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {showDetails && (
        <div className="project-list">
          {filteredRepos.length > 0 ? (
            filteredRepos.map((repo) => (
              <article key={repo.id} className="project-card">
                <h3>{repo.name}</h3>
                <p>{repo.description || "No description available."}</p>
                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  View repository
                </a>
                <p className="meta-text">⭐ {repo.stargazers_count}</p>
              </article>
            ))
          ) : (
            <p>No repositories matched your search.</p>
          )}
        </div>
      )}
    </section>
  );
}

export default Projects;
