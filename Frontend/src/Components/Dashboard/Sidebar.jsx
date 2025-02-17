import { useState } from "react";
import { Home, User, Settings, Menu, X } from "lucide-react";
import logo from "../../assets/Images/logo.svg";
import { RiLockFill } from "react-icons/ri";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="flex h-screen">
      <div className="w-fit">
        {/* Sidebar */}
        <div
          className={`bg-[#000517] text-[#D7E3FF] border border-[#000B34] h-full transition-all duration-300 rounded-lg ${
            isOpen ? "w-64" : "w-20"
          }`}
        >
          {/* Fixed Header */}
          <div className="border-b-2 border-transparent bg-gradient-to-r from-[#000517] via-[#011459] to-[#000517] bg-clip-border">
            <div className="flex items-center w-full h-fit justify-center bg-[#000517] py-5">
              {isOpen ? (
                <img src={logo} alt="logo" />
              ) : (
                <button
                  className="text-white w-fit p-2 mb-4 cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Menu size={24} />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Nav Section */}
          <div className="overflow-y-auto h-[calc(100vh-100px)] px-2 scrollbar-hidden">
            <nav className="flex flex-col items-start space-y-4  mt-8 ">
              <ul className="w-full space-y-5">
                <NavItem icon={<Home size={24} />} label="Market Depth" isOpen={isOpen} />
                <NavItem icon={<User size={24} />} label="Smart Money Action" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Sector Depth" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Ai Swing Trades" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Option Clock" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Ai Option Data" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="FII / DII Data" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Index Depth" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Trading Journal" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Learn From Us" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Our Strategy" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Financial Calendar" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Calculator" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Feedback Form" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Profit" isOpen={isOpen} />
                <NavItem icon={<Settings size={24} />} label="Updates" isOpen={isOpen} />
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Close Button (Fixed) */}
      <div
        className={`w-fit h-fit border flex items-center rounded-lg justify-center border-[#000B34] ml-1 bg-[#000517] ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <button className="text-white p-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <X size={24} />
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, isOpen }) => (
  <li className="flex items-center justify-between w-full  px-4 py-2  rounded-md cursor-pointer text-base font-medium space-x-4 hover:bg-gradient-to-r from-[#000517] via-[#011459] to-[#000517] transition-all duration-1000 ease-in-out ">
    <span className="flex items-center space-x-2 ">
      {icon}
      {isOpen && <span>{label}</span>}
    </span>

    {isOpen && <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0256F5" />  
          <stop offset="100%" stopColor="#77A6FF" />  
        </linearGradient>
      </defs>
      <RiLockFill size={24} fill="url(#gradient)" />
    </svg>}
  </li>
);

export default Sidebar;
