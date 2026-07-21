import Header from './Header';
import About from './About';
import Skills from './Skills';
import Footer from './Footer';

function App() {
  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'];

  return (
    <div className="app">
      <Header Gitanshu="Gitanshu" />
      <About />
      <Skills skillList={skills} />
      <Footer />
    </div>
  );
}

export default App;
