import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await fetch(`${API}/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUser(data.user);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

const login = async (email, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  // fetch full user from /me instead of using login response
  await fetchMe();
  return data;
};

const register = async (name, email, password) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  await fetchMe();
  return data;
};

  const logout = async () => {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  const deleteAccount = async () => {
    const res = await fetch(`${API}/auth/delete-account`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    setUser(null);
  };

  const createApiKey = async () => {
    const res = await fetch(`${API}/auth/create-api-key`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    await fetchMe();
    return data.apiKey;
  };

  const regenerateApiKey = async () => {
    const res = await fetch(`${API}/auth/regenerate-key`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    await fetchMe();
    return data.apiKey;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      deleteAccount,
      createApiKey,
      regenerateApiKey,
      fetchMe,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
