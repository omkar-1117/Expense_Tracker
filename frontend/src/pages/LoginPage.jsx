import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login: setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ username, password });
      setToken(res.data.access);
      navigate("/");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="mb-3 text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="input" placeholder="Username" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="input" placeholder="Password" required />
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <p className="mt-3 text-sm">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </div>
    </div>
  );
}
