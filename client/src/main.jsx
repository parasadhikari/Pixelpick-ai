import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App";
import { AppProvider } from "./context/AppContext";
import { OverlayProvider } from "./context/OverlayContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <BrowserRouter>

      <AppProvider>
        <ThemeProvider>
          <OverlayProvider>

            <App />

            <Toaster
              position="top-right"
              reverseOrder={false}
            />

          </OverlayProvider>
        </ThemeProvider>
      </AppProvider>

    </BrowserRouter>

  </React.StrictMode>
);