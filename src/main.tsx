import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./styles/globals.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#0a3527",
            color: "#FBF5E4",
            border: "1px solid #FF3D8B",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
