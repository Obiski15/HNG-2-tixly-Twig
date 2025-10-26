// Tickets page functionality
let allTickets = [];
let createDialog = null;
let editDialog = null;
let deleteAlert = null;
let currentEditTicket = null;
let currentDeleteTicket = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Protect route - authenticate with backend
  const isAuthenticated = await window.requireAuth();
  if (!isAuthenticated) {
    return;
  }

  const user = window.authService.getCurrentUser();

  // Initialize dialogs
  createDialog = new Dialog("create-ticket-dialog");
  editDialog = new Dialog("edit-ticket-dialog");
  deleteAlert = new AlertDialog("delete-ticket-alert");

  // Setup form handlers
  setupCreateForm();
  setupEditForm();

  // Setup event delegation for ticket actions (once only)
  setupTicketActions();

  // Load tickets
  await loadTickets();
});

async function loadTickets() {
  try {
    const ticketsContainer = document.getElementById("tickets-list");
    ticketsContainer.innerHTML = `
      <div class="text-center py-12 text-muted-foreground">
        <p>Loading tickets...</p>
      </div>
    `;

    allTickets = await window.ticketService.getAllTickets();
    displayTickets(allTickets);
  } catch (error) {
    toast.error(window.Utils.handleAPIError(error));
    const ticketsContainer = document.getElementById("tickets-list");
    ticketsContainer.innerHTML = `
      <div class="text-center py-12 text-destructive">
        <p>Failed to load tickets</p>
      </div>
    `;
  }
}

function displayTickets(tickets) {
  const container = document.getElementById("tickets-list");
  const ticketsCount = document.getElementById("tickets-count");

  if (ticketsCount) {
    ticketsCount.textContent = tickets.length;
  }

  if (tickets.length === 0) {
    container.innerHTML = `
      <div class="bg-card border-border rounded-lg border shadow-md">
        <div class="py-12 text-center">
          <p class="text-muted-foreground mb-4">No tickets yet</p>
          <button onclick="window.openCreateDialog()" class="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Create Your First Ticket
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      ${tickets
        .map(
          (ticket) => `
        <div class="bg-card border-border rounded-lg border shadow-md transition-shadow hover:shadow-lg">
          <div class="p-6">
            <div class="mb-2 flex items-start justify-between">
              ${getStatusBadge(ticket.status)}
              <span class="inline-flex items-center rounded-md border border-input px-2.5 py-0.5 text-xs font-semibold">
                ${window.Utils.capitalize(ticket.priority)}
              </span>
            </div>
            <h3 class="text-xl font-semibold mb-2 line-clamp-2">${
              ticket.title
            }</h3>
            <p class="text-muted-foreground text-sm line-clamp-3 mb-4">${
              ticket.description
            }</p>
          </div>
          <div class="p-6 pt-0">
            <div class="flex gap-2 mb-3">
              <button 
                data-action="edit" 
                data-ticket-id="${ticket.id}"
                class="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                Edit
              </button>
              <button 
                data-action="delete" 
                data-ticket-id="${ticket.id}"
                class="inline-flex items-center justify-center rounded-md bg-destructive text-destructive-foreground px-3 py-2 text-sm font-medium hover:bg-destructive/90 transition-colors flex-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                Delete
              </button>
            </div>
            <p class="text-muted-foreground text-xs">
              Created ${window.Utils.formatDate(ticket.createdAt)}
            </p>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function getStatusBadge(status) {
  const variants = {
    open: "bg-success text-success-foreground",
    in_progress: "bg-warning text-warning-foreground",
    closed: "bg-muted text-muted-foreground",
  };

  const className = variants[status] || variants.open;
  const displayText = status.replace("_", " ").toUpperCase();

  return `<span class="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${className}">${displayText}</span>`;
}

// Setup event delegation for ticket actions (called once during initialization)
function setupTicketActions() {
  const container = document.getElementById("tickets-list");

  container.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;

    const action = button.getAttribute("data-action");
    const ticketId = button.getAttribute("data-ticket-id");

    // Check if ticketId exists and is valid
    if (!ticketId || ticketId === "undefined" || ticketId === "null") {
      toast.error("Invalid ticket ID");
      return;
    }

    // Use ticketId as-is (JSON Server uses string IDs)
    if (action === "edit") {
      openEditDialog(ticketId);
    } else if (action === "delete") {
      openDeleteDialog(ticketId);
    }
  });
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
      await loadTickets();
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

function setupEditForm() {
  const form = document.getElementById("edit-ticket-form");
  const validator = new FormValidator("edit-ticket-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validator.validate(TicketSchemas.edit)) {
      return;
    }

    const values = validator.getValues();

    const submitButton = document.querySelector(
      'button[form="edit-ticket-form"]'
    );
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Updating...";
    }

    try {
      const result = await window.ticketService.updateTicket(
        currentEditTicket.id,
        values
      );
      toast.success("Ticket updated successfully!");
      editDialog.close();
      await loadTickets();
    } catch (error) {
      toast.error(window.Utils.handleAPIError(error));
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Update Ticket";
      }
    }
  });
}

function openCreateDialog() {
  const form = document.getElementById("create-ticket-form");
  form.reset();
  createDialog.open();
}

async function openEditDialog(ticketId) {
  try {
    const ticket = await window.ticketService.getTicketById(ticketId);
    currentEditTicket = ticket;

    // Populate form
    document.getElementById("edit-title").value = ticket.title;
    document.getElementById("edit-description").value = ticket.description;
    document.getElementById("edit-priority").value = ticket.priority;
    document.getElementById("edit-status").value = ticket.status;

    editDialog.open();
  } catch (error) {
    toast.error(window.Utils.handleAPIError(error));
  }
}

function openDeleteDialog(ticketId) {
  const ticket = allTickets.find((t) => t.id === ticketId);
  currentDeleteTicket = ticket;

  deleteAlert.open(async () => {
    try {
      await window.ticketService.deleteTicket(ticketId);
      toast.success("Ticket deleted successfully!");
      await loadTickets();
    } catch (error) {
      toast.error(window.Utils.handleAPIError(error));
    }
  });
}

// Export functions
window.openCreateDialog = openCreateDialog;
window.openEditDialog = openEditDialog;
window.openDeleteDialog = openDeleteDialog;
