// Login page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Redirect if already authenticated
  if (window.authService.isAuthenticated()) {
    window.location.href = "/dashboard";
    return;
  }

  const form = document.getElementById("login-form");
  const submitButton = document.getElementById("login-button");
  const validator = new FormValidator("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate form
    if (!validator.validate(AuthSchemas.login)) {
      return;
    }

    // Get form values
    const values = validator.getValues();

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    try {
      // Login
      await window.authService.login(values.email, values.password);

      // Show success message
      toast.success("Login successful! Redirecting...");

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      // Show error message
      toast.error(error.message || "Login failed. Please try again.");

      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = "Login";
    }
  });
});
