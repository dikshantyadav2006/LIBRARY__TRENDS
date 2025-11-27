const Footer = () => {
  return (
    <footer className="w-full md:p-5 mt-[10vh] p-1">
      {/* Contact & Location Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="p-6 rounded-lg shadow-md bg-[--primary-light-color] dark:bg-[--primary-dark-color] flex flex-col items-start justify-center relative">
          <h3 className="text-md font-medium mb-1 capitalize text-gray-600 absolute top-[-20px] left-1/2 md:left-[10%] transform -translate-x-[50%] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-4 py-1 rounded-full">
            Contact Library
          </h3>
          <p>
            Email:{" "}
            <a href="mailto:dikshantyadav2024@gmail.com" className="text-blue-600 hover:underline">
              dikshantyadav2024@gmail.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:+917081884742" className="text-blue-500 hover:underline">
              +91 7081884742
            </a>
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition pointer-events-none"
            >
              Instagram
            </a>
          </div>
          {/* Address */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold">📍 Address:</p>
            <p>Ataria Sitapur, Sitapur Road</p>
            <p>Near Sai Hardware & Mishra Brother Store</p>
            <p>Sidhauli, Sitapur, UP - 261303</p>
          </div>
        </div>

        {/* Google Map */}
        <div className="p-6 rounded-lg shadow-md bg-[--primary-light-color] dark:bg-[--primary-dark-color] relative">
          <h3 className="text-md font-medium mb-1 capitalize text-gray-600 absolute top-[-20px] left-1/2 md:left-[10%] transform -translate-x-[50%] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-4 py-1 rounded-full">
            📍 Find Us
          </h3>
          <div className="w-full h-[250px] md:h-[300px] rounded-lg overflow-hidden mt-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.8!2d80.8476!3d27.2833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399f0b!2sSidhauli%2C%20Sitapur%2C%20Uttar%20Pradesh%20261303!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shai Library Location"
              className="rounded-lg"
            ></iframe>
          </div>
          <a
            href="https://maps.app.goo.gl/JHfJmSFodXustoNK9"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            🗺️ Open in Google Maps →
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="foot w-full text-center text-sm py-6 mt-10 border-t dark:border-gray-700 border-gray-300 text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Shai Library. All rights reserved.</p>
        <p className="mt-1">Made with ❤️ for readers and learners.</p>
      </div>
    </footer>
  );
};

export default Footer;