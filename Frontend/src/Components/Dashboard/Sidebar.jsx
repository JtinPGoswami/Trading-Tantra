import { useState } from "react";
import { Home, User, Settings, Menu,X } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
      <aside className="flex">
    <div className="w-fit h-screen bg-gray-500 relative">

      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white h-full p-4 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <nav className="flex flex-col items-start space-y-4 mt-6">
        <button
          className={`text-white w-fit p-2    mb-4 cursor-pointer ${!isOpen?"block":"hidden"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
         
        </button>

          <NavItem icon={<Home size={24} />} label="Home" isOpen={isOpen} />
          <NavItem icon={<User size={24} />} label="Profile" isOpen={isOpen} />
          <NavItem icon={<Settings size={24} />} label="Settings" isOpen={isOpen} />
        </nav>
      </div>

      
         
      
    </div>
     <div className={`w-fit h-fit border border-[#0256F5] bg-[#000A2D] p-2 ${isOpen?"block":"hidden"} `}>
          
          <button
          className="text-white    mb-4 space-x-2 cursor-pointer"
            
          onClick={() => setIsOpen(!isOpen)}
        >
          <X size={24} />
         
        </button>
          </div>
    </ aside>
  );
};

const NavItem = ({ icon, label, isOpen }) => (
  <div className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md cursor-pointer">
    {icon}
    {isOpen && <span>{label}</span>}
  </div>
);

export default Sidebar;
