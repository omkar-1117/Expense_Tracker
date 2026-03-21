import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await registerUser({ username, password });
      setSuccess("Registration successful. Redirecting... ");
      setTimeout(() => navigate("/login"), 1100);
    } catch {
      setError("Registration failed. Use different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-lime-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {error && <p className="mb-3 text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>}
        {success && <p className="mb-3 text-sm text-green-600 bg-green-100 p-2 rounded">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="input" placeholder="Username" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="input" placeholder="Password" required />
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
        <p className="mt-3 text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
}
