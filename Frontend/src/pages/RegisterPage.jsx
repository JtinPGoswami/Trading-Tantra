import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";



const RegisterPage = () => {
  const [FormData, setFormData] = useState({
    firstname: "",
    lastname:"",
    email: "",
    password: "",
    confirmPassword:""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name,value} = e.target;
    setFormData({...FormData, [name]:value});

  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(FormData.password !== FormData.confirmPassword){
      setError("Password not match.")
      return  error;
    }
    console.log(FormData,',wdkjebkdbs')
  }


   

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative ">
      {loading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
          <div className="loader"></div>
        </div>
      )}
      <div
        className={`w-full max-w-md bg-gray-50 p-8 shadow-md rounded-md ${
          loading ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="border-b-[1px] pb-2">
          <h2 className="font-bold text-center text-2xl text-gray-700">
            Register
          </h2>
          <p className="text-center text-xs text-gray-500 font-semibold mt-1">
            CREATE A NEW ACCOUNT
          </p>
        </div>

        <form className="flex flex-col mt-2" onSubmit={handleSubmit}>
          <div className="mb-4 flex md:flex-row flex-col w-full gap-2">
           <div className="flex flex-col w-1/2">
           <label htmlFor="name" className="block text-lg text-gray-600 mb-1">
              Firstname:
            </label>
            <input
              type="text"
              name="firstname"
              value={FormData.firstname}
              onChange={handleChange}
              id="name"
              placeholder="Firstname"
              className=" w-full border-2 outline-none border-gray-300 rounded-lg px-4 py-2 text-base focus:border-[#2196F3] focus:ring-4 focus:ring-[#2195f34f] transition duration-300 ease-in-out"
            />
           </div>

            <div className="flex flex-col w-1/2">
            <label className="block text-lg text-gray-600 mb-1">Lastname:
              
              </label>
  
              <input type="text" 

              name="lastname"
              value={FormData.lastname}
              onChange={handleChange}
              placeholder="Lastname"
                  className=" w-full border-2 outline-none border-gray-300 rounded-lg px-4 py-2 text-base focus:border-[#2196F3] focus:ring-4 focus:ring-[#2195f34f] transition duration-300 ease-in-out"
                />
            </div>
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="email" className="block text-lg text-gray-600 mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={FormData.email}
              onChange={handleChange}
              id="email"
              placeholder="Enter your email"
              className="border-2 outline-none border-gray-300 rounded-lg px-4 py-2 text-base focus:border-[#2196F3] focus:ring-4 focus:ring-[#2195f34f] transition duration-300 ease-in-out"
            />
          </div>

          <div className="mb-4 flex flex-col">
            <label
              htmlFor="password"
              className="block text-lg text-gray-600 mb-1"
            >
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={FormData.password}
              onChange={handleChange}
              id="password"
              placeholder="Enter your password"
              className="border-2 outline-none border-gray-300 rounded-lg px-4 py-2 text-base focus:border-[#2196F3] focus:ring-4 focus:ring-[#2195f34f] transition duration-300 ease-in-out"
            />
          </div>
          <div className="mb-4 flex flex-col">
            <label
              htmlFor="password"
              className="block text-lg text-gray-600 mb-1"
            >
            Confirm Password:
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={FormData.confirmPassword}
              onChange={handleChange}
              id="confrimPassword"
              placeholder="Confirm your password"
              className="border-2 outline-none border-gray-300 rounded-lg px-4 py-2 text-base focus:border-[#2196F3] focus:ring-4 focus:ring-[#2195f34f] transition duration-300 ease-in-out"
            />
          </div>
            
          {error && <p className="text-red-500 mb-1">{error}</p>}
          <button
            type="submit"
            className="bg-[#2196F3] text-white rounded-lg py-2 text-lg font-semibold hover:bg-[#348dd6] transition duration-300 ease-in-out"
          >
            Register
          </button>


          <button  className="bg-[#2196F3] text-white rounded-lg py-2 text-lg font-semibold hover:bg-[#348dd6] transition duration-300 ease-in-out mt-2">Google Signup</button>
        </form>

        <div className="flex gap-1 items-center justify-center mt-2">
          <p className="text-gray-600">Already have an Account?</p>
          <Link to="/login">
          <span className="text-[#2196F3] underline font-semibold">Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
