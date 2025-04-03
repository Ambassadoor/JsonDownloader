// src/RoutesConfig.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import EventUI from "./components/EventUI";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/ui" element={<EventUI />} />
    <Route path="calendar_confirmation" element={<div>CalendarConfirmation</div>} />
  </Routes>
);

export default AppRouter;
