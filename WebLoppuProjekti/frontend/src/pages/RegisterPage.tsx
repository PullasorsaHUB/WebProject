import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError("Kaikki kentät ovat pakollisia");
      return;
    }

    if (password.length < 6) {
      setError("Salasanan tulee olla vähintään 6 merkkiä pitkä");
      return;
    }

    if (password !== confirmPassword) {
      setError("Salasanat eivät täsmää");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await register(email, password);
      navigate("/"); // Redirect to home page after successful registration
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rekisteröinti epäonnistui");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">Rekisteröidy</h2>
          
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sähköposti</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Salasana (vähintään 6 merkkiä)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
                minLength={6}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Vahvista salasana</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Rekisteröidään..." : "Rekisteröidy"}
            </button>
          </form>

          <div className="divider">TAI</div>

          <Link to="/login" className="btn btn-ghost w-full">
            Kirjaudu sisään
          </Link>
        </div>
      </div>
    </div>
  );
}
