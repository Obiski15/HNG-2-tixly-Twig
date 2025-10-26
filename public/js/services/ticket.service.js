// Ticket Service
class TicketService {
  constructor() {
    this.baseURL = window.API_BASE_URL || "http://localhost:4000";
  }

  // Get all tickets for current user
  async getAllTickets() {
    try {
      const response = await fetch(`${this.baseURL}/tickets`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const tickets = await response.json();
      return tickets;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  }

  // Get single ticket by ID
  async getTicketById(id) {
    try {
      const response = await fetch(`${this.baseURL}/tickets/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ticket");
      }

      const ticket = await response.json();
      return ticket;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  }

  // Create new ticket
  async createTicket(data) {
    try {
      const response = await fetch(`${this.baseURL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create ticket");
      }

      const ticket = await response.json();
      return ticket;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  }

  // Update ticket
  async updateTicket(id, data) {
    try {
      const response = await fetch(`${this.baseURL}/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update ticket");
      }

      const ticket = await response.json();
      return ticket;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  }

  // Delete ticket
  async deleteTicket(id) {
    try {
      const response = await fetch(`${this.baseURL}/tickets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete ticket");
      }

      return true;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  }

  // Calculate statistics
  calculateStats(tickets) {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in_progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      closed: tickets.filter((t) => t.status === "closed").length,
      lowPriority: tickets.filter((t) => t.priority === "low").length,
      mediumPriority: tickets.filter((t) => t.priority === "medium").length,
      highPriority: tickets.filter((t) => t.priority === "high").length,
    };
  }
}

// Export to window
window.TicketService = TicketService;
window.ticketService = new TicketService();
