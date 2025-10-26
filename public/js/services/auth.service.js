// Authentication Service
class AuthService {
  constructor() {
    // Prefer Vite-injected env var, then server-injected global, then fallback.
    this.baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
      || window.API_BASE_URL
      || "http://localhost:4000";
    this.tokenKey = "token";
    this.userKey = "user";
  }

  // Register new user
  async signup(data) {
    try {
      const response = await fetch(`${this.baseURL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Signup failed");
      }

      const result = await response.json();
      return result.user;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Login failed");
      }

      const result = await response.json();
      const user = result.user;

      // Generate a simple token (session is managed by cookies)
      const token = btoa(`${user.email}:${Date.now()}`);

      // Store token and user
      this.setToken(token);
      this.setUser(user);

      return { user, token };
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await fetch(`${this.baseURL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Clear local storage regardless of response
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);

      if (!response.ok) {
        const error = await response.json();
        console.error("Logout error:", error);
      }

      // Redirect to login
      window.location.href = "/login";
    } catch (error) {
      // Clear local storage even on network error
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      console.error("Logout network error:", error);

      // Redirect to login anyway
      window.location.href = "/login";
    }
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Verify authentication with backend
  async authenticate() {
    try {
      const response = await fetch(`${this.baseURL}/authenticate`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        // Session invalid, clear local data
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        return { isAuthenticated: false };
      }

      // Update user data if provided
      if (result.user) {
        this.setUser(result.user);
      }

      return { isAuthenticated: result.isAuthenticated || true };
    } catch (error) {
      // Network error - clear local data
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      throw error;
    }
  }

  // Get token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Set token
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Set user
  setUser(user) {
    // Don't store password
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(this.userKey, JSON.stringify(userWithoutPassword));
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
}

// Export to window
window.AuthService = AuthService;
window.authService = new AuthService();
