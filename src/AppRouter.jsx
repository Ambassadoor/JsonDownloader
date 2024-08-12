// src/RoutesConfig.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import SubscriptionsPage from "./components/SubscriptionsPage";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/subscriptions" element={<SubscriptionsPage />} />
  </Routes>
);

export default AppRouter;
