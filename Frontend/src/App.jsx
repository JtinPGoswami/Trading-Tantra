import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/WebPage/HomePage";
import UpdatesPage from "./pages/WebPage/UpdatesPage";
import ContactUsPage from "./pages/WebPage/ContactUsPage";
import AboutUsPage from "./pages/WebPage/AboutUsPage";
import DisclaimerPage from "./pages/WebPage/DisclaimerPage";
import RefundPolicyPage from "./pages/WebPage/RefundPolicyPage";
import DisclosuresPage from "./pages/WebPage/DisclosuresPage";
import TermsAndConditionPage from "./pages/WebPage/TermsAndConditionPage";
import PrivacyPolicyPage from "./pages/WebPage/PrivacyPolicyPage";
import FAQPage from "./pages/WebPage/FAQPage";
import RenewPlanPage from "./pages/WebPage/RenewPlanPage";
import BuyPlanPage from "./pages/WebPage/BuyPlanPage";
import ScrollToTop from "./Components/Web/ScrollTop";
import CalendarGrid from "./Components/Web/Trying";
import WebLayout from "./Layouts/WebLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import Homepage from "./pages/DashboardPage/Homepage";
import UpdatesPageDashboard from "./pages/DashboardPage/UpdatesPage";
import ProfitPage from "./pages/DashboardPage/ProfitPage";
import FeedBackPage from "./pages/DashboardPage/FeedBackPage";
import LearnFromUsPage from "./pages/DashboardPage/LearnFromUsPage";
import CalculatorsPage from "./pages/DashboardPage/CalculatorsPage";
import { RiskProvider } from "./contexts/RiskContext";
import Notifications from "./Components/Dashboard/Notifications";
import MyProfilePage from "./pages/DashboardPage/MyProfilePage";
import MyPlanPage from "./pages/DashboardPage/MyPlanPage";
import MarketDepthPage from "./pages/DashboardPage/MarketDepthPage";
import MonryActionPage from "./pages/DashboardPage/MoneyActionPage";
import AiSwingTradesPage from "./pages/DashboardPage/AiSwingTradesPage";
import OptionClockPage from "./pages/DashboardPage/OptionClockPage";
import AIOptionDataPage from "./pages/DashboardPage/AIOptionDatAPage";

const App = () => {
  return (
    <div>
      <ScrollToTop />
      <RiskProvider>
        <Routes>
          <Route path="/" element={<WebLayout />}>
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
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/renew-plan" element={<RenewPlanPage />} />
            <Route path="/buy-plan" element={<BuyPlanPage />} />
            <Route path="/trying" element={<CalendarGrid />} />
          </Route>


        <Route path="/dashboard" element={<DashboardLayout/>} >
          <Route index element={<Homepage/>}/>
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<MyProfilePage />} />
          <Route path="plan" element={<MyPlanPage />} />
          <Route path="market-depth" element={<MarketDepthPage />} />
          <Route path="smart-action" element={<MonryActionPage />} />
          <Route path="swing-trades" element={<AiSwingTradesPage />} />
          <Route path="option-clock" element={<OptionClockPage />} />
          <Route path="option-data" element={<AIOptionDataPage />} />
          <Route path="updates" element={<UpdatesPageDashboard />} />
          <Route path="profit" element={<ProfitPage />} />
          <Route path="feedback" element={<FeedBackPage />} />
          <Route path="learn-from-us" element={<LearnFromUsPage />} />
          <Route path="calculator" element={<CalculatorsPage />} />
        </Route>
      </Routes>
      </RiskProvider>
    </div>
  );
};

export default App;
