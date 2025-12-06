const Footer = () => {
  // Contact persons data
  const contacts = [
    {
      name: "Rohit Patel",
      role: "Owner",
      mobile: "+91 7651958626",
      avatar: "👨‍💼",
      gradient: "from-teal-500 to-cyan-500",
    },

    {
      name: "Divakar Yadav",
      role: "",
      mobile: "+91 8181856378",
      avatar: "🎧",
      gradient: "from-orange-500 to-red-500",
    },
    {
      name: "Dikshant Yadav",
      role: "",
      mobile: "+91 7081884742",
      avatar: "👨‍💻",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <footer className="w-full md:p-5 mt-[10vh] p-1  overflow-hidden">
      {/* Contact & Location Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info - Redesigned */}
        <div className="p-6 rounded-2xl shadow-lg bg-[--primary-light-color] dark:bg-[--primary-dark-color] relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-purple-500/10 rounded-full blur-2xl"></div>

          <h3 className="text-sm font-semibold capitalize absolute top-[-12px] left-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-1 rounded-full shadow-md ">
            📞 Contact Us
          </h3>

          {/* Contact Cards */}
          <div className="mt-4 space-y-3">
            {contacts.map((contact, index) => (
              <a
                key={index}
                href={`tel:${contact.mobile.replace(/\s/g, "")}`}
                className="group flex items-center gap-4 p-3 rounded-xl bg-[--light-color] dark:bg-[--dark-color] hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${contact.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {contact.avatar}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {contact.role}
                  </p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                    {contact.mobile}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white group-hover:bg-green-600 transition-colors shadow-md">
                    📱
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Email Section */}
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl shadow-md">
                ✉️
              </span>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email us at
                </p>
                <a
                  href="mailto:dikshantyadav2024@gmail.com"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  dikshantyadav2024@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-4 flex gap-3 ">
            <a
              href="https://www.instagram.com/dikshantyadav.profile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md"
            >
              <span>📸</span> Instagram
            </a>
            <a
              href="https://wa.me/+918948000112"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md"
            >
              <span>💬</span> WhatsApp
            </a>{" "}
            <a
              href="https://chat.whatsapp.com/BtB9bgCQVwVCoRuUyzLphK"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-md"
            >
              <span>💬</span> WhatsApp GROUP
            </a>
          </div>

          {/* Address */}
          <div className="mt-4 p-3 rounded-xl bg-[--light-color] dark:bg-[--dark-color] border-l-4 border-teal-500">
            <p className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <span>📍</span> Address
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Ataria Sitapur, Sitapur Road
              <br />
              Near Sai Hardware & Mishra Brother Store
              <br />
              <span className="font-medium">
                Sidhauli, Sitapur, UP - 261303
              </span>
            </p>
          </div>
        </div>

        {/* Google Map */}
        <div className="p-6 rounded-lg shadow-md bg-[--primary-light-color] dark:bg-[--primary-dark-color] relative">
          <h3 className="text-md font-medium mb-1 capitalize text-gray-600 absolute top-[-20px] left-1/2 md:left-[10%] transform -translate-x-[50%] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-4 py-1 rounded-full">
            📍 Find Us
          </h3>
          <div className="w-full h-[250px] md:h-[300px] rounded-lg overflow-hidden mt-2">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.688548784714!2d80.860822!3d27.166087899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39994b00680b90af%3A0xff2f1b4937285c97!2sSai%20Library!5e0!3m2!1sen!2sin!4v1764951127728!5m2!1sen!2sin" width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shai Library Location"
              className="rounded-lg"></iframe>
          </div>
          <a
            href="https://maps.app.goo.gl/MNJSJbVCfTdvGJio9"
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
        <p>© {new Date().getFullYear()} Sai Library. All rights reserved.</p>
        <p className="mt-1">Made with ❤️ for readers and learners.</p>
      </div>
    </footer>
  );
};

export default Footer;
