// Signup page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Redirect if already authenticated
  if (window.authService.isAuthenticated()) {
    window.location.href = "/dashboard";
    return;
  }

  const form = document.getElementById("signup-form");
  const submitButton = document.getElementById("signup-button");
  const validator = new FormValidator("signup-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate form
    if (!validator.validate(AuthSchemas.signup)) {
      return;
    }

    // Get form values
    const values = validator.getValues();

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = "Creating account...";

    try {
      // Signup
      await window.authService.signup(values);

      // Show success message
      toast.success("Account created successfully! Please login.");

      // Redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      // Show error message
      toast.error(error.message || "Signup failed. Please try again.");

      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = "Sign Up";
    }
  });
});
