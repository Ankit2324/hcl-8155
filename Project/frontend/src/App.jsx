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
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: registerRole,
          adminCode: registerRole === "ADMIN" ? adminCode : null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      if (String(data.role).toUpperCase() !== loginRole) {
        throw new Error(`This account is registered as ${data.role}. Please select the correct login type.`);
      }
      if (!data.token) throw new Error("Login successful, but JWT token was not received.");

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      setUser(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (user) {
    if (String(user.role).toUpperCase() === "ADMIN") {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    }
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">⚖</div>
          <span>Resolve<span className="brand-dot">.</span></span>
        </div>
        <div className="showcase-copy">
          <span className="eyebrow">YOUR VOICE MATTERS</span>
          <h1>Every concern deserves<br />to be heard.</h1>
          <p>A simpler, smarter way to raise concerns, follow progress, and make things better.</p>
          <div className="showcase-points">
            <div><span>✓</span><p>Submit complaints online</p></div>
            <div><span>✓</span><p>Track every update</p></div>
            <div><span>✓</span><p>Stay informed at every step</p></div>
          </div>
        </div>
        <div className="showcase-footer">ONLINE COMPLAINT MANAGEMENT SYSTEM <span>•</span> SIMPLE. TRANSPARENT. ACCOUNTABLE.</div>
        <div className="showcase-orb orb-one" />
        <div className="showcase-orb orb-two" />
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand"><span className="brand-mark">⚖</span> Resolve<span className="brand-dot">.</span></div>
          <div className="auth-heading">
            <span className="eyebrow">{isRegister ? "GET STARTED" : "WELCOME BACK"}</span>
            <h2>{isRegister ? "Create your account" : "Sign in to continue"}</h2>
            <p>{isRegister ? "Join us and make your voice count." : "Enter your details to access your dashboard."}</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" className={!isRegister ? "active" : ""} onClick={() => { setIsRegister(false); setMessage(""); }}>Sign in</button>
            <button type="button" className={isRegister ? "active" : ""} onClick={() => { setIsRegister(true); setMessage(""); }}>Create account</button>
          </div>

          {message && <div className={`auth-message ${message.toLowerCase().includes("successful") ? "success" : "error"}`} role="status">{message}</div>}

          <form className="auth-form" onSubmit={isRegister ? handleRegister : handleLogin}>
            <label className="field-label" htmlFor="account-role">{isRegister ? "Account type" : "Sign in as"}</label>
            <select id="account-role" className="auth-input" value={isRegister ? registerRole : loginRole} onChange={(e) => { isRegister ? setRegisterRole(e.target.value) : setLoginRole(e.target.value); setMessage(""); }}>
              <option value="USER">User</option>
              <option value="ADMIN">Administrator</option>
            </select>

            {isRegister && <>
              <label className="field-label" htmlFor="full-name">Full name</label>
              <input id="full-name" className="auth-input" type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
            </>}

            <label className="field-label" htmlFor="email-address">Email address</label>
            <input id="email-address" className="auth-input" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" className="auth-input" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {isRegister && <>
              <label className="field-label" htmlFor="confirm-password">Confirm password</label>
              <input id="confirm-password" className="auth-input" type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              {registerRole === "ADMIN" && <>
                <label className="field-label" htmlFor="admin-code">Admin invitation code</label>
                <input id="admin-code" className="auth-input" type="password" placeholder="Enter invitation code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />
              </>}
            </>}

            {!isRegister && <div className="auth-helper"><span>Secure access</span><span>JWT protected</span></div>}
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Please wait..." : isRegister ? "Create account" : "Sign in to dashboard"}<span aria-hidden="true">→</span></button>
          </form>
          <p className="auth-legal">By continuing, you agree to use this platform responsibly.</p>
        </div>
        <footer className="auth-footer">© 2026 Resolve. All rights reserved.</footer>
      </section>
    </main>
  );
}

export default App;
