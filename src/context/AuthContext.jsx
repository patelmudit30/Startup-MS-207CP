import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 🔥 Load user from localStorage (auto login after refresh)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("sms_user");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  // 🔥 LOGIN FUNCTION
  const login = useCallback(async (username, password) => {
    if (!username || !password) return false;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

      if (data && !error) {
        setUser(data);
        localStorage.setItem("sms_user", JSON.stringify(data));
        return true;
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  }, []);

  // 🔥 REGISTER FUNCTION (Student Only)
  const register = useCallback(async (username, password, providedId) => {
    if (!username || !password) return { success: false, error: "Please fill in all fields" };

    try {
      // 1. Check if username already exists
      const { data: existing } = await supabase
        .from("users")
        .select("uid")
        .eq("username", username)
        .maybeSingle();

      if (existing) {
        return { success: false, error: "Username already exists" };
      }

      // 2. Resolve ID (use explicitly provided ID or fallback to auto-increment)
      let finalId = providedId ? parseInt(providedId, 10) : null;
      if (!finalId) {
        const { data: maxRows } = await supabase.from("users").select("uid").order("uid", { ascending: false }).limit(1);
        finalId = (maxRows && maxRows.length > 0) ? maxRows[0].uid + 1 : 1;
      }

      const { data, error } = await supabase
        .from("users")
        .insert({
          uid: finalId,
          username,
          password,
          role: "student",
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setUser(data);
      localStorage.setItem("sms_user", JSON.stringify(data));
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: e.message };
    }
  }, []);

  // 🔥 LOGOUT FUNCTION
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("sms_user");
  }, []);

  // 🔥 AUTH STATE
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🔥 CUSTOM HOOK
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const role = context.user?.role?.toLowerCase() || "student";

  const isStudent = role === "student";
  const isInstructor = role === "instructor";
  const isAdmin = role === "admin";

  // Instructors and Admins can modify most records.
  const canModifyGeneral = isAdmin || isInstructor;
  // Only Admins can modify personnel records (Instructors/Admins).
  const canModifyStaff = isAdmin;

  return {
    ...context,
    role,
    isStudent,
    isInstructor,
    isAdmin,
    canModifyGeneral,
    canModifyStaff
  };
}