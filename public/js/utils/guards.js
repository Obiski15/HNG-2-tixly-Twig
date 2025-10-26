// Route protection utilities
async function requireAuth() {
  const authLoading = document.getElementById("auth-loading");

  try {
    // Show loading state
    if (authLoading) {
      authLoading.style.display = "flex";
      authLoading.textContent = "Authenticating...";
    }

    // Authenticate with backend
    const data = await window.authService.authenticate();

    if (!data.isAuthenticated) {
      // Keep loading spinner visible and redirect immediately
      // This prevents any flash of the protected content
      window.location.replace("/login");
      return false;
    }

    // Hide loading and show content
    if (authLoading) authLoading.style.display = "none";
    const dashboardContent = document.getElementById("dashboard-content");
    const ticketsContent = document.getElementById("tickets-content");
    if (dashboardContent) dashboardContent.style.display = "block";
    if (ticketsContent) ticketsContent.style.display = "block";

    return true;
  } catch (error) {
    // Keep loading spinner visible and redirect immediately
    // This prevents any flash of the protected content
    window.location.replace("/login");
    return false;
  }
}

function requireGuest() {
  if (window.authService && window.authService.isAuthenticated()) {
    window.location.href = "/dashboard";
    return false;
  }
  return true;
}

// Export to window
window.requireAuth = requireAuth;
window.requireGuest = requireGuest;
