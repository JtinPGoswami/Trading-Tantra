import React from "react";
import { FiUser, FiMail, FiCamera } from "react-icons/fi";
import user from "../../assets/Images/Dashboard/HeaderImg/user.png";
import { PowerOffIcon } from "lucide-react";
import ProfileHeader from "../../Components/Dashboard/ProfileHeader";

const MyProfilePage = () => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  return (
    <>
    <div className="mt-10">
        <ProfileHeader/>
    </div>
      <div className="max-w-xl mx-auto p-6 bg-[#01071C] text-white rounded-xl mt-16 ">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FiUser className="text-[#4F46E5]" /> Account
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Lorem ipsum dolor sit amet consectetur sit mauris nec morbi nisi.
          </p>
        </div>

        {/* Personal Information */}
        <div className="mb-6">
          <h3 className="text-base font-medium">Personal Information</h3>
          <p className="text-gray-400 text-sm">
            Lorem ipsum dolor sit amet consectetur quisque nisi eget mi libero
            leo vel.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* First Name */}
          <div className="md:flex justify-between block">
            <div>
              <label className="text-sm text-gray-400">First Name</label>
              <div className="flex items-center bg-[#151B2D] p-2 rounded-md mt-1">
                <FiUser className="text-gray-500 ml-2" />
                <input
                  type="text"
                  placeholder="John"
                  className="bg-transparent outline-none text-white px-2 w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400">Last Name</label>
              <div className="flex items-center bg-[#151B2D] p-2 rounded-md mt-1">
                <FiUser className="text-gray-500 ml-2" />
                <input
                  type="text"
                  placeholder="Carter"
                  className="bg-transparent outline-none text-white px-2 w-full"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-400">Email Address</label>
            <div className="flex items-center bg-[#151B2D] p-2 rounded-md mt-1">
              <FiMail className="text-gray-500 ml-2" />
              <input
                type="email"
                placeholder="example@youremail.com"
                className="bg-transparent outline-none text-white px-2 w-full"
              />
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div className="flex gap-6">
            <div>
              <label className="text-sm text-gray-400">Photo</label>
              <div>
                <img
                  src={user}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </div>

              <button className="bg-transparent text-[#1A68FF] text-[12px] cursor-pointer">
                Delete
              </button>
            </div>
            <div className="mt-2 flex flex-col w-full items-center border border-dashed border-gray-500 p-6 rounded-md bg-[#151B2D]">
              <div className="text-center">
                <FiCamera className="text-gray-500 text-3xl mx-auto" />
                <p className="text-sm mt-2 text-gray-400">
                  <label className="text-blue-400 cursor-pointer">
                    Click to upload
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  SVG, PNG, JPG or GIF (max. 800 × 400px)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfilePage;
