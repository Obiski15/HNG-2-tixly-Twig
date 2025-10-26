// Main JavaScript entry point
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./components.js";
import "./schemas/auth.schema.js";
import "./schemas/ticket.schema.js";
import "./services/auth.service.js";
import "./services/ticket.service.js";
import "./utils/guards.js";
import "./utils/helpers.js";

// Create toast wrapper to match sonner API with bottom-right position
window.toast = {
  success: (message) => {
    Toastify({
      text: message,
      duration: 4000,
      close: false,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      className: "toast-success",
      style: {
        background: "hsl(0 0% 100%)",
        color: "hsl(222 47% 11%)",
        border: "1px solid hsl(220 13% 91%)",
        borderRadius: "0.75rem",
        padding: "16px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
        minWidth: "300px",
        maxWidth: "420px",
        marginBottom: "16px",
      },
    }).showToast();
  },
  error: (message) => {
    Toastify({
      text: message,
      duration: 4000,
      close: false,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      className: "toast-error",
      style: {
        background: "hsl(0 0% 100%)",
        color: "hsl(222 47% 11%)",
        border: "1px solid hsl(0 84% 60% / 0.5)",
        borderRadius: "0.75rem",
        padding: "16px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
        minWidth: "300px",
        maxWidth: "420px",
        marginBottom: "16px",
      },
    }).showToast();
  },
  info: (message) => {
    Toastify({
      text: message,
      duration: 4000,
      close: false,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      className: "toast-info",
      style: {
        background: "hsl(0 0% 100%)",
        color: "hsl(222 47% 11%)",
        border: "1px solid hsl(239 84% 67% / 0.5)",
        borderRadius: "0.75rem",
        padding: "16px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
        minWidth: "300px",
        maxWidth: "420px",
        marginBottom: "16px",
      },
    }).showToast();
  },
  warning: (message) => {
    Toastify({
      text: message,
      duration: 4000,
      close: false,
      gravity: "bottom",
      position: "right",
      stopOnFocus: true,
      className: "toast-warning",
      style: {
        background: "hsl(0 0% 100%)",
        color: "hsl(222 47% 11%)",
        border: "1px solid hsl(38 92% 50% / 0.5)",
        borderRadius: "0.75rem",
        padding: "16px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
        minWidth: "300px",
        maxWidth: "420px",
        marginBottom: "16px",
      },
    }).showToast();
  },
};

// Initialize app

// API Configuration - prefer server-injected value (set in Twig). If absent, warn and use a local fallback.
if (!window.API_BASE_URL) {
  console.warn(
    "window.API_BASE_URL not provided by server. Falling back to http://localhost:4000"
  );
  window.API_BASE_URL = "http://localhost:4000";
}

// Utility function to logout (using authService)
window.logout = async () => {
  if (window.authService) {
    await window.authService.logout();
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

// Navigation helper
window.navigate = (path) => {
  window.location.href = path;
};
