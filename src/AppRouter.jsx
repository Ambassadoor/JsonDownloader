// src/RoutesConfig.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import SubscriptionsPage from "./components/SubscriptionsPage";
import FilesPage from "./components/FilesPage";
import EventUI from "./components/EventUI";
import RecurrenceCalendar from "./components/ExceptionCalendar";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/my_courses" element={<SubscriptionsPage />} />
    <Route path="/files" element={<FilesPage />} />
    <Route path="/ui" element={<EventUI />} />
    <Route path="/calendar" element={<RecurrenceCalendar />} />
  </Routes>
);

export default AppRouter;
