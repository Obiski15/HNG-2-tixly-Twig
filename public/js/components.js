class Dialog {
  constructor(dialogId) {
    this.dialog = document.getElementById(dialogId);
    this.overlay = this.dialog?.querySelector("[data-dialog-overlay]");
    this.closeButtons = this.dialog?.querySelectorAll("[data-dialog-close]");

    if (this.dialog) {
      this.init();
    }
  }

  init() {
    // Close on overlay click
    this.overlay?.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close on close button click
    this.closeButtons?.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.close();
      });
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });
  }

  open() {
    if (this.dialog) {
      this.dialog.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  close() {
    if (this.dialog) {
      this.dialog.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  isOpen() {
    return this.dialog && !this.dialog.classList.contains("hidden");
  }
}

class AlertDialog {
  constructor(alertId) {
    this.alert = document.getElementById(alertId);
    this.overlay = this.alert?.querySelector("[data-alert-overlay]");
    this.cancelButtons = this.alert?.querySelectorAll("[data-alert-cancel]");
    this.actionButtons = this.alert?.querySelectorAll("[data-alert-action]");
    this.onConfirm = null;

    if (this.alert) {
      this.init();
    }
  }

  init() {
    // Close on overlay click
    this.overlay?.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close on cancel button click
    this.cancelButtons?.forEach((btn) => {
      btn.addEventListener("click", () => this.close());
    });

    // Handle action button click
    this.actionButtons?.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.onConfirm) {
          this.onConfirm();
        }
        this.close();
      });
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });
  }

  open(callback) {
    if (this.alert) {
      this.onConfirm = callback;
      this.alert.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  close() {
    if (this.alert) {
      this.alert.classList.add("hidden");
      document.body.style.overflow = "";
      this.onConfirm = null;
    }
  }

  isOpen() {
    return this.alert && !this.alert.classList.contains("hidden");
  }
}

// Form validation utilities
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.errors = {};
  }

  validate(schema) {
    this.clearErrors();
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      const error = this.validateField(field, value, rules);

      if (error) {
        this.errors[field] = error;
        this.showError(field, error);
      }
    }

    return Object.keys(this.errors).length === 0;
  }

  validateField(field, value, rules) {
    if (rules.required && !value) {
      return rules.requiredMessage || `${field} is required`;
    }

    if (rules.email && value && !this.isValidEmail(value)) {
      return rules.emailMessage || "Invalid email address";
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return (
        rules.minLengthMessage ||
        `Minimum ${rules.minLength} characters required`
      );
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      return (
        rules.maxLengthMessage ||
        `Maximum ${rules.maxLength} characters allowed`
      );
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.patternMessage || "Invalid format";
    }

    if (rules.custom && value) {
      return rules.custom(value);
    }

    return null;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showError(field, message) {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  clearErrors() {
    this.errors = {};
    const errorElements = this.form.querySelectorAll('[id$="-error"]');
    errorElements.forEach((el) => (el.textContent = ""));
  }

  getValues() {
    const formData = new FormData(this.form);
    return Object.fromEntries(formData);
  }
}

// Badge helper utilities
const BadgeVariants = {
  status: {
    open: "info",
    "in-progress": "warning",
    resolved: "success",
    closed: "secondary",
  },
  priority: {
    low: "secondary",
    medium: "warning",
    high: "destructive",
  },
};

function getStatusBadgeVariant(status) {
  return BadgeVariants.status[status] || "default";
}

function getPriorityBadgeVariant(priority) {
  return BadgeVariants.priority[priority] || "default";
}

// Export to window
window.Dialog = Dialog;
window.AlertDialog = AlertDialog;
window.FormValidator = FormValidator;
window.getStatusBadgeVariant = getStatusBadgeVariant;
window.getPriorityBadgeVariant = getPriorityBadgeVariant;
