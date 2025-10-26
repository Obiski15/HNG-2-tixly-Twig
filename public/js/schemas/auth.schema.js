const AuthSchemas = {
  login: {
    email: {
      required: true,
      email: true,
      requiredMessage: "Email is required",
      emailMessage: "Please enter a valid email address",
    },
    password: {
      required: true,
      minLength: 6,
      requiredMessage: "Password is required",
      minLengthMessage: "Password must be at least 6 characters",
    },
  },

  signup: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 50,
      requiredMessage: "Name is required",
      minLengthMessage: "Name must be at least 3 characters",
      maxLengthMessage: "Name must not exceed 50 characters",
    },
    email: {
      required: true,
      email: true,
      requiredMessage: "Email is required",
      emailMessage: "Please enter a valid email address",
    },
    password: {
      required: true,
      minLength: 6,
      requiredMessage: "Password is required",
      minLengthMessage: "Password must be at least 6 characters",
    },
    confirmPassword: {
      required: true,
      requiredMessage: "Please confirm your password",
      custom: (value) => {
        const password = document.getElementById("password")?.value;
        if (value !== password) {
          return "Passwords do not match";
        }
        return null;
      },
    },
  },
};

// Export to window
window.AuthSchemas = AuthSchemas;
