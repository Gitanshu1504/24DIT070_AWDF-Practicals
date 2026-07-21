function Header({ name }) {
  return (
    <header className="hero-card">
      <p className="eyebrow">React Portfolio</p>
      <h1>Welcome to {name}'s Portfolio</h1>
      <p className="lead">
        I build interactive user experiences with React and modern web tools.
      </p>
    </header>
  );
}

export default Header;
