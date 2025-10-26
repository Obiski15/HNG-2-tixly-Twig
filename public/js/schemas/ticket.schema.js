const TicketSchemas = {
  create: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
      requiredMessage: "Title is required",
      minLengthMessage: "Title must be at least 3 characters",
      maxLengthMessage: "Title must not exceed 100 characters",
    },
    description: {
      required: true,
      minLength: 10,
      requiredMessage: "Description is required",
      minLengthMessage: "Description must be at least 10 characters",
    },
    priority: {
      required: true,
      requiredMessage: "Priority is required",
    },
    status: {
      required: true,
      requiredMessage: "Status is required",
    },
  },

  edit: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
      requiredMessage: "Title is required",
      minLengthMessage: "Title must be at least 3 characters",
      maxLengthMessage: "Title must not exceed 100 characters",
    },
    description: {
      required: true,
      minLength: 10,
      requiredMessage: "Description is required",
      minLengthMessage: "Description must be at least 10 characters",
    },
    priority: {
      required: true,
      requiredMessage: "Priority is required",
    },
    status: {
      required: true,
      requiredMessage: "Status is required",
    },
  },
};

// Export to window
window.TicketSchemas = TicketSchemas;
