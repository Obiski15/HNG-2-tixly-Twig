const Utils = {
  // Handle API errors
  handleAPIError(error) {
    if (error.message.includes("fetch")) {
      return "Network error. Please check your connection.";
    }
    if (error.message.includes("authenticated")) {
      return "Session expired. Please login again.";
    }
    return error.message || "An unexpected error occurred";
  },

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString();
    }
    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  },

  // Truncate text
  truncate(text, length = 100) {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  },

  // Capitalize first letter
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Format status display
  formatStatus(status) {
    return status
      .split("-")
      .map((word) => this.capitalize(word))
      .join(" ");
  },
};

// Export to window
window.Utils = Utils;
