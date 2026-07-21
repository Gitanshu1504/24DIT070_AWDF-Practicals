import Header from "../components/Header";
import About from "../components/About";
import Skills from "../components/Skills";

function Home() {
  const skills = ["HTML", "CSS", "JavaScript", "React", "Node.js"];

  return (
    <>
      <Header name="Gitanshu" />
      <About />
      <Skills skillList={skills} />
    </>
  );
}

export default Home;
