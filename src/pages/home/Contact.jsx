import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import contactImage from "../../assets/undraw_contact-us_kcoa.svg";
import toast from 'react-hot-toast';
import { FaPaperPlane } from "react-icons/fa";

export default function Contact() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Sending message...");

    emailjs
      .sendForm(
        "service_fpdb9v1",
        "template_vqor67q",
        formRef.current,
        "oJAmWVw7zKEZLk5gI"
      )
      .then(
        (result) => {
          toast.dismiss(loadingToast);
          toast.success("Message sent successfully!");
          setSent(true);
          setLoading(false);
          formRef.current.reset();
        },
        (error) => {
          toast.dismiss(loadingToast);
          toast.error("Failed to send. Please try again.");
          setLoading(false);
        }
      );
  };

  const inputFields = [
    { type: 'text', name: 'user_name', placeholder: 'Your Name' },
    { type: 'email', name: 'user_email', placeholder: 'Your Email' },
  ];

  return (
    <section id="contact" className="relative py-20 px-5 sm:px-8 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/80 via-neutral-50/80 to-white/80 dark:from-slate-900/80 dark:via-slate-950/80 dark:to-slate-900/80 backdrop-blur-sm"></div>
        <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            GET IN TOUCH
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Contact <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Our Team</span>
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Have questions about our referral marketplace? Reach out to our team for support or partnership inquiries.
          </p>
        </motion.div>

        <div className="flex items-center flex-wrap gap-5 justify-around">
          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-slate-700 p-8"
          >
            <h3 className="text-2xl uppercase font-bold text-neutral-900 dark:text-white mb-6">
              Send Us a Message
            </h3>
            
            <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {inputFields.map((input, i) => (
                  <div key={i} className="relative">
                    <input
                      type={input.type}
                      name={input.name}
                      placeholder={input.placeholder}
                      className="w-full bg-neutral-100 dark:border-slate-600 dark:bg-slate-700 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent hover:border-primary/30 transition"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  placeholder="Your message..."
                  rows={5}
                  className="w-full bg-neutral-100 dark:bg-slate-700 dark:border-slate-600 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent hover:border-primary/30 transition"
                  required
                ></textarea>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-cyan-500 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <FaPaperPlane /> Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img  src={contactImage} alt="Contact Us" className="w-full drop-shadow-lg h-auto max-w-md mx-auto" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}