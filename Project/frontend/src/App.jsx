
import { useState } from "react";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

function App() {
  const [isRegister, setIsRegister] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [loginRole, setLoginRole] = useState("USER");
  const [registerRole, setRegisterRole] = useState("USER");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // REGISTRATION
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (registerRole === "ADMIN" && !adminCode.trim()) {
      setMessage("Admin invitation code is required!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: registerRole,
            adminCode: registerRole === "ADMIN" ? adminCode : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Registration successful! Please login.");

      setIsRegister(false);
      setLoginRole(registerRole);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAdminCode("");
      setRegisterRole("USER");

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (String(data.role).toUpperCase() !== loginRole) {
        throw new Error(
          `This account is registered as ${data.role}. Please select the correct login type.`
        );
      }

      if (!data.token) {
        throw new Error("Login successful, but JWT token was not received.");
      }

      // Store user details and JWT token
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      setUser(data);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setAdminCode("");
    setMessage("");
    setLoginRole("USER");
    setRegisterRole("USER");
    setIsRegister(false);
  };

  // DASHBOARD
  if (user) {
    if (String(user.role).toUpperCase() === "ADMIN") {
      return (
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
        />
      );
    }

    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // LOGIN AND REGISTRATION PAGE
  return (
    <div className="login-container">
      <div className="login-box">

        <h1>Complaint Management System</h1>

        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>

        {message && (
          <p className="message">{message}</p>
        )}

        <form onSubmit={isRegister ? handleRegister : handleLogin}>

          {!isRegister && (
            <select
              className="role-select"
              value={loginRole}
              onChange={(e) => {
                setLoginRole(e.target.value);
                setMessage("");
              }}
            >
              <option value="USER">User Login</option>
              <option value="ADMIN">Admin Login</option>
            </select>
          )}

          {isRegister && (
            <select
              className="role-select"
              value={registerRole}
              onChange={(e) => {
                setRegisterRole(e.target.value);
                setMessage("");
              }}
            >
              <option value="USER">Register as User</option>
              <option value="ADMIN">Register as Admin</option>
            </select>
          )}

          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isRegister && (
            <>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {registerRole === "ADMIN" && (
                <input
                  type="password"
                  placeholder="Admin Invitation Code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                />
              )}
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>

        </form>

        <p>
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            className="switch-link"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
              setName("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setAdminCode("");
            }}
          >
            {isRegister ? " Login" : " Register"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default App;
