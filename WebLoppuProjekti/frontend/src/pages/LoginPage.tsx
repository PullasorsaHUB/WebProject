import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">Kirjaudu sisään</h2>
          
          <div className="alert alert-info mb-4">
            <span>Kirjautumislomake toteutetaan myöhemmin.</span>
          </div>

          <div className="divider">TAI</div>

          <Link to="/register" className="btn btn-ghost">
            Rekisteröidy
          </Link>
        </div>
      </div>
    </div>
  );
}
