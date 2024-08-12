import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AppStateProvider } from "./AppStateContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppStateProvider>
      <Router>
        <App />
      </Router>
    </AppStateProvider>
  </React.StrictMode>,
);
