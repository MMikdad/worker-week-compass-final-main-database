import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export type UserRole = "admin" | "user";

export interface User {
  username: string;
  role: UserRole;
  memberId?: string; // Link to team member ID
}

interface UserCredential {
  username: string;
  password: string;
  role: UserRole;
  isDefaultPassword: boolean;
  memberId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  resetUserPassword: (username: string) => boolean;
  isSelf: (memberId: string) => boolean;
  getUserCredentials: () => UserCredential[];
  addUserCredentials: (username: string, password: string, role: UserRole, memberId?: string) => void;
  updateUserRole: (username: string, role: UserRole) => boolean;
  saveCredentials: (newCreds: UserCredential[]) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Local storage keys
const API_URL = "http://localhost:8443/users";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [credentials, setCredentials] = useState<UserCredential[]>([]);

  // Load credentials from backend on mount
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCredentials(data))
      .catch(() => setCredentials([]));
  }, []);

  // Save credentials to backend
  const saveCredentials = async (newCreds: UserCredential[]) => {
    setCredentials(newCreds);
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCreds),
    });
  };

  const login = (username: string, password: string): boolean => {
    // Find user by username
    const userCredential = credentials.find(cred => cred.username === username);
    
    if (!userCredential) {
      toast.error("Invalid username or password");
      return false;
    }
    
    // Check password
    if (userCredential.password !== password) {
      toast.error("Invalid username or password");
      return false;
    }
    
    // Login successful
    setUser({
      username: userCredential.username,
      role: userCredential.role,
      memberId: userCredential.memberId
    });
    
    // Show appropriate message based on password status
    if (userCredential.isDefaultPassword) {
      toast.warning("Please change your default password", {
        duration: 5000
      });
    } else {
      toast.success(`Welcome, ${userCredential.role === "admin" ? "Admin" : "User"}!`);
    }
    
    return true;
  };

  const logout = () => {
    setUser(null);
    toast.info("Logged out successfully");
  };

  const isAdmin = (): boolean => {
    return user?.role === "admin";
  };

  const isAuthenticated = (): boolean => {
    return user !== null;
  };
  
  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!user) {
      toast.error("You must be logged in to change your password");
      return false;
    }
    
    const index = credentials.findIndex(cred => cred.username === user.username);
    if (index === -1) {
      toast.error("User not found");
      return false;
    }
    
    if (credentials[index].password !== currentPassword) {
      toast.error("Current password is incorrect");
      return false;
    }
    
    const updatedCredentials = [...credentials];
    updatedCredentials[index] = {
      ...updatedCredentials[index],
      password: newPassword,
      isDefaultPassword: false
    };
    
    saveCredentials(updatedCredentials);
    toast.success("Password changed successfully");
    return true;
  };
  
  const resetUserPassword = (username: string): boolean => {
    if (!isAdmin()) {
      toast.error("Only admin can reset passwords");
      return false;
    }
    
    const index = credentials.findIndex(cred => cred.username === username);
    if (index === -1) {
      toast.error("User not found");
      return false;
    }
    
    const updatedCredentials = [...credentials];
    updatedCredentials[index] = {
      ...updatedCredentials[index],
      password: "Hallo123",
      isDefaultPassword: true
    };
    
    saveCredentials(updatedCredentials);
    toast.success(`Password for ${username} has been reset to the default password`);
    return true;
  };
  
  const isSelf = (memberId: string): boolean => {
    return user?.memberId === memberId;
  };
  
  const getUserCredentials = (): UserCredential[] => {
    if (!isAdmin()) {
      return [];
    }
    return credentials;
  };
  
  const addUserCredentials = (username: string, password: string, role: UserRole, memberId?: string) => {
    if (!isAdmin()) {
      toast.error("Only admin can add users");
      return;
    }
    
    if (credentials.some(cred => cred.username === username)) {
      toast.error(`Username "${username}" already exists`);
      return;
    }
    
    const newUserCredential: UserCredential = {
      username,
      password,
      role,
      isDefaultPassword: true,
      memberId
    };
    
    saveCredentials([...credentials, newUserCredential]);
    toast.success(`User ${username} has been added`);
  };

  const updateUserRole = (username: string, role: UserRole): boolean => {
    if (!isAdmin()) {
      toast.error("Only admins can change user roles");
      return false;
    }
    
    if (username === 'admin') {
      toast.error("Cannot change role for the main admin account");
      return false;
    }
    
    const index = credentials.findIndex(cred => cred.username === username);
    if (index === -1) {
      toast.error("User not found");
      return false;
    }
    
    const updatedCredentials = [...credentials];
    updatedCredentials[index] = {
      ...updatedCredentials[index],
      role
    };
    
    saveCredentials(updatedCredentials);
    toast.success(`${username}'s role has been updated to ${role}`);
    
    if (user && user.username === username) {
      setUser({
        ...user,
        role
      });
    }
    
    return true;
  };

  // Expose saveCredentials for manual save (if needed)
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin,
        isAuthenticated,
        changePassword,
        resetUserPassword,
        isSelf,
        getUserCredentials,
        addUserCredentials,
        updateUserRole,
        saveCredentials, // Expose for Save button
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
