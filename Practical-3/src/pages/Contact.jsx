import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");

  return (
    <section className="card">
      <h2>Contact Me</h2>
      <p>Share a short message and I will get back to you soon.</p>
      <label className="contact-label" htmlFor="message">
        Your message
      </label>
      <textarea
        id="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows="5"
        placeholder="Write your message here..."
      />
      <p className="helper-text">Characters: {message.length}</p>
      <p className="preview">Preview: {message || "Your message will appear here."}</p>
    </section>
  );
}

export default Contact;
