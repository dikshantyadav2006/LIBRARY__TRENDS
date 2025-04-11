
const Footer = () => {
    return (
      <footer className="w-full md:p-5  mt-[10vh] p-1 ">
        <div className="p-6  rounded-lg shadow-md bg-[--primary-light-color] dark:bg-[--primary-dark-color]  flex flex-col items-start justify-center relative">
          <h3 className="text-md font-medium mb-1 capitalize text-gray-600 absolute top-[-20px] left-1/2 md:left-[10%] transform -translate-x-[50%] bg-[--secondary-light-color] dark:bg-[--secondary-dark-color] px-4 py-1 rounded-full">
            Contact library
          </h3>
          <p>Email: <a href="mailto:dikshantyadav2024@gmail.com" className="text-blue-600 hover:underline ">dikshantyadav2024@gmail.com</a></p>
          <p>Phone: <a href="tel:+918181856378" className="text-blue-500 hover:underline">+91 8181856378</a></p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="https://www.instagram.com/" target="_blank" className="hover:text-pink-500 transition pointer-events-none">
              Instagram
            </a>
          </div>
        </div>
        
       <div className="foot w-full text-center text-sm py-6 mt-10 border-t dark:border-gray-700 border-gray-300 text-gray-500 dark:text-gray-400">
       <p>
          © {new Date().getFullYear()} Shai Library. All rights reserved.
        </p>
        <p className="mt-1">Made with ❤️ for readers and learners.</p>
       </div>
      </footer>
    );
  };

export default Footer