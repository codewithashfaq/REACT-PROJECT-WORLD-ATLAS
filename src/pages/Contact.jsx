import { useState } from "react";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (formData) => {
    console.log(formData.entries());
    const formInputData = Object.fromEntries(formData.entries());
    console.log("Submitted Data:", formInputData);
  };

  return (
    <section className="section-contact">
      <h2 className="container-title">Contact Us</h2>

      <div className="contact-wrapper container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleFormSubmit(formData);
          }}
        >
          <input
            type="text"
            name="username"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Enter Your Name"
            required
            className="form-control"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            autoComplete="off"
            placeholder="Enter Your Email"
            required
            className="form-control"
          />

          <textarea
            name="message"
            rows="10"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter Your Message"
            autoComplete="off"
            required
          ></textarea>

          <button type="submit" value="send">
            Send
          </button>
        </form>
      </div>
    </section>
  );
};
