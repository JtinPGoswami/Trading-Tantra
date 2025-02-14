import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./Layouts/AppLayout";
import HomePage from "./pages/HomePage";
import UpdatesPage from "./pages/UpdatesPage";
import ContactUsPage from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import DisclosuresPage from "./pages/DisclosuresPage";
import TermsAndConditionPage from "./pages/TermsAndConditionPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

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
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/disclosures" element={<DisclosuresPage />} />
          <Route
            path="/terms-and-condition"
            element={<TermsAndConditionPage />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
