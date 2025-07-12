import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { useApp } from "../../context/Appcontext";

export default function Footer() {
  const { openLogin } = useApp();

  const socials = [
    { icon: <FaFacebookF size={16} />, link: 'https://www.facebook.com/' },
    { icon: <FaInstagram size={16} />, link: 'https://www.instagram.com/' },
    { icon: <FaTwitter size={16} />, link: 'https://twitter.com/' },
    { icon: <FaLinkedinIn size={16} />, link: 'https://linkedin.com/' },
  ];


  const productLinks = [
    { name: 'Features', link: '#features' },
    { name: 'How It Works', link: '#howitworks' },
    { name: 'Pricing', link: '#pricing' },
    { name: 'FAQ', link: '#faq' },
    { name: 'Contact Us', link: '#contact' },
  ];

  const legalLinks = [
    { name: 'Privacy', link: '#policies' },
    { name: 'Terms', link: '#policies' },
    { name: 'Cookie Policy', link: '#policies' },
  ];

  return (
    <footer className="relative px-6 py-16 bg-white dark:bg-slate-900 border-t border-neutral-100 dark:border-slate-800">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between flex-wrap gap-8 mb-16">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <a href="/" className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4 inline-block">
              Up<span className="text-primary">Link</span>
            </a>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
              The referral marketplace connecting businesses with skilled promoters to drive growth through trusted recommendations.
            </p>
            <div className="flex space-x-4">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-slate-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">Links</h3>
            <ul className="space-y-3">
              {productLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.link} className="text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors flex items-center">
                    {link.name} <FiArrowUpRight className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-neutral-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-neutral-500 dark:text-neutral-500">
            &copy; {new Date().getFullYear()} Uplink. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-6">
            {legalLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.link}
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            onClick={openLogin}
            className="bg-gradient-to-r from-primary to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:shadow-lg transition-all flex items-center gap-2"
          >
            Login to Dashboard <FiArrowUpRight />
          </button>
        </div>
      </div>
    </footer>
  );
}