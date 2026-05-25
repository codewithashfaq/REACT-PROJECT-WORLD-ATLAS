import { useState } from "react";

// ============================================================
// Contact
//
// Renders the Contact Us page with a controlled form.
// All three fields (name, email, message) are stored in a
// single formData state object — one handler covers all of
// them using the input's name attribute as the dynamic key.
//
// Form submission currently logs to the console. This is the
// integration point where a real backend call (e.g. EmailJS,
// Formspree, or a custom API) would be added later.
//
// Validation strategy:
//   - "required" on every field — browser blocks submission
//     if any field is empty.
//   - "pattern" on the email field — enforces a valid email
//     format before the form can be submitted.
// ============================================================
export const Contact = () => {
  // Single state object for all form fields — avoids declaring
  // three separate useState calls for name, email, and message.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // ── Universal change handler ─────────────────────────────
  // Works for every input by using e.target.name as the key.
  // Spreading the previous state first ensures the other
  // fields are not wiped out on each keystroke.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ── Submit handler ───────────────────────────────────────
  // Receives a FormData object built from the form element.
  // Object.fromEntries converts it to a plain object so it's
  // easy to read, log, or pass to an API call.
  //
  // TODO: replace the console.log with a real API call, e.g.
  //   await emailjs.send(serviceId, templateId, formInputData)
  const handleFormSubmit = (formData) => {
    console.log(formData.entries());
    const formInputData = Object.fromEntries(formData.entries());
    console.log("Submitted Data:", formInputData);
  };

  return (
    <section className="section-contact">
      <h2 className="container-title">Contact Us</h2>

      <div className="contact-wrapper container">
        {/* e.preventDefault() stops the browser's default full-page
            form submission so we can handle it ourselves           */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleFormSubmit(formData);
          }}
        >
          {/* Name field — autoComplete off prevents browser autofill
              from pre-populating the field on load                  */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Enter Your Name"
            required
            className="form-control"
          />

          {/* Email field — pattern enforces a valid email format;
              the browser shows an inline error if it doesn't match  */}
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

          {/* Message textarea — rows="10" sets the default visible
              height; the user can resize it further if needed       */}
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
