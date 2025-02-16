import { useState } from "react";
import { Home, User, Settings, Menu } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-fit h-screen bg-gray-500 relative">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white h-full p-4 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <button
          className="text-white absolute top-2 right-3  mb-4 space-x-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
         
        </button>

        <nav className="flex flex-col space-y-4 mt-6">
          <NavItem icon={<Home size={24} />} label="Home" isOpen={isOpen} />
          <NavItem icon={<User size={24} />} label="Profile" isOpen={isOpen} />
          <NavItem icon={<Settings size={24} />} label="Settings" isOpen={isOpen} />
        </nav>
      </div>

      
      
    </div>
  );
};

const NavItem = ({ icon, label, isOpen }) => (
  <div className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md cursor-pointer">
    {icon}
    {isOpen && <span>{label}</span>}
  </div>
);

export default Sidebar;
