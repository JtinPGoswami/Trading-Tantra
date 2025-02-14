import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./Layouts/AppLayout";
import HomePage from "./pages/HomePage";
import UpdatesPage from "./pages/UpdatesPage";
import ContactUsPage from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import DisclaimerPage from "./pages/DisclaimerPage";


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
