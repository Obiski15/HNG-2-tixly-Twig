// Dashboard page functionality
let createDialog = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Protect route - authenticate with backend
  const isAuthenticated = await window.requireAuth();
  if (!isAuthenticated) {
    return;
  }

  const user = window.authService.getCurrentUser();

  // Update header with user name
  const userNameElement = document.getElementById("user-name");
  if (userNameElement && user) {
    userNameElement.textContent = user.name || "User";
  }

  // Initialize create dialog
  createDialog = new Dialog("create-ticket-dialog");

  // Setup form handler
  setupCreateForm();

  // Load tickets and stats
  await loadDashboardData();
});

async function loadDashboardData() {
  try {
    // Fetch tickets
    const tickets = await window.ticketService.getAllTickets();

    // Calculate stats
    const stats = window.ticketService.calculateStats(tickets);

    // Update stats display
    document.getElementById("total-tickets").textContent = stats.total;
    document.getElementById("open-tickets").textContent = stats.open;
    document.getElementById("in-progress-tickets").textContent =
      stats.inProgress;
    document.getElementById("closed-tickets").textContent = stats.closed;
  } catch (error) {
    toast.error(window.Utils.handleAPIError(error));
  }
}

function setupCreateForm() {
  const form = document.getElementById("create-ticket-form");
  const validator = new FormValidator("create-ticket-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validator.validate(TicketSchemas.create)) {
      return;
    }

    const values = validator.getValues();

    const submitButton = document.querySelector(
      'button[form="create-ticket-form"]'
    );
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Creating...";
    }

    try {
      const result = await window.ticketService.createTicket(values);
      toast.success("Ticket created successfully!");
      createDialog.close();
      form.reset();
      await loadDashboardData(); // Refresh stats
    } catch (error) {
      toast.error(window.Utils.handleAPIError(error));
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Create Ticket";
      }
    }
  });
}

function openCreateDialog() {
  const form = document.getElementById("create-ticket-form");
  form.reset();
  createDialog.open();
}

// Export function
window.openCreateDialog = openCreateDialog;
