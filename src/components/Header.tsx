import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="text-gray-400 bg-xcodewhite shadow flex justify-between items-center p-4">
      <div className="flex-1">
        <input
          className="w-1/2 px-4 py-2 border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500"
          type="search"
          name="search"
          placeholder="Search something..."
        />
      </div>
      <div className="relative">
        <button
          className="flex items-center bg-gray-200 text-gray-400 font-semibold focus:outline-none"
          onClick={toggleDropdown}
        >
          {/* <span className="rounded-full text-gray-400">ADMIN</span> */}
          <FaCaretDown />
        </button>
        {isDropdownOpen && (
          <div className="bg-xcodeoffwhite text-xcodegold absolute right-0 mt-2 py-2 w-48 rounded-md shadow-xl z-20">
            <a
              href="/"
              className="bg-xcodeoffwhite text-xcodegold block px-4 py-2 text-sm"
              onClick={() => console.log('Logout')}
            >
              Logout
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
