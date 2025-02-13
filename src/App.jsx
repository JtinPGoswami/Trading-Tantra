import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./Layouts/AppLayout";
import HomePage from "./pages/HomePage";
import UpdatesPage from "./pages/UpdatesPage";


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/updates" element={<UpdatesPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
