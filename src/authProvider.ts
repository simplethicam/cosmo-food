import { AuthProvider } from "@refinedev/core";

export const TOKEN_KEY = "cosmo-auth";
export const REFRESH_TOKEN_KEY = "cosmo-refresh";

const API_BASE_URL = "https://oyr2ljag97.execute-api.eu-west-3.amazonaws.com/dev/v1";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const result = await response.json();

      if (result.message !== "Success") {
        throw new Error(result.message || "Login failed");
      }

      const { data } = result;
      const { token, refreshToken } = data;

      if (!token) {
        throw new Error("Token not found");
      }

      localStorage.setItem(TOKEN_KEY, token);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Login error: ", error); // Debug log
      return {
        success: false,
        error: {
          message: (error as Error).message || "Login failed",
          name: "Login Error",
        },
      };
    }
  },

  register: async ({ email, password, name, familyName }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name: name ?? "unknown", familyName: familyName ?? "unknown" }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const result = await response.json();

      if (result.success) {
        return { success: true };
      } else {
        throw new Error(result.error?.message);
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: (error as Error).message || "Register failed",
          name: "Register Error",
        },
      };
    }
  },

  updatePassword: async ({ email, code, newPassword }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, code, password: newPassword }),
      });

      if (!response.ok) {
        throw new Error("Password reset failed");
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          message: (error as Error).message || "Update password failed",
          name: "Update Password Error",
        },
      };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email }),
      });

      if (!response.ok) {
        throw new Error("Forgot password request failed");
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          message: (error as Error).message || "Forgot password request failed",
          name: "Forgot Password Error",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error) => {
    if (typeof error === "object" && error !== null && "response" in error) {
      if ((error as any).response?.status === 401) {
        return { logout: true };
      }
    }
    return { error };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST", // Ensure the correct method is used
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: JSON.parse(atob(token.split('.')[1])).sub, refreshToken: refreshToken }),
        });

        if (response.ok) {
          const result = await response.json();

          if (result.message !== "Success") {
            throw new Error(result.message || "Token refresh failed");
          }

          const { token: newToken } = result.data;
          localStorage.setItem(TOKEN_KEY, newToken);

          return { authenticated: true };
        } else {
          throw new Error("Token is not valid");
        }
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        console.error("Token check error: ", error); // Debug log
        return {
          authenticated: false,
          error: {
            message: "Token not valid",
            name: "Authentication Error",
          },
          logout: true,
          redirectTo: "/login",
        };
      }
    }

    return {
      authenticated: false,
      error: {
        message: "Token not found",
        name: "Authentication Error",
      },
      logout: true,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => null,

  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }

    // Decode the token and extract user information
    const userInfo = JSON.parse(atob(token.split('.')[1]));

    return {
      id: userInfo.sub,
      name: userInfo.name,
      avatar: userInfo.avatar || "https://i.pravatar.cc/150",
      email: userInfo.email,
    };
  },
};
