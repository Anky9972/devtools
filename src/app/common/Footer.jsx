
// Footer.jsx
const Footer = () => {
    return (
      <footer className="border-t py-6 md:py-0 px-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-500">
           Copyright © 2024 DevTools by Vivek Gaur. <br />All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
              Terms
            </a>
            <a href="/contact" className="text-sm text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  

  export default Footer;