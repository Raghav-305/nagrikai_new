import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Nagrik AI</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              An intelligent complaint management system for smart cities.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/" className="hover:text-gray-900 dark:hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/docs" className="hover:text-gray-900 dark:hover:text-white transition">
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/complaints"
                  className="hover:text-gray-900 dark:hover:text-white transition"
                >
                  Complaints
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Email: support@nagrikAI.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: Smart City, Country</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {currentYear} Nagrik AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
