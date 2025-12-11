import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">Rekisteröidy</h2>
          
          <div className="alert alert-info mb-4">
            <span>Rekisteröintilomake toteutetaan myöhemmin.</span>
          </div>

          <div className="divider">TAI</div>

          <Link to="/login" className="btn btn-ghost">
            Kirjaudu sisään
          </Link>
        </div>
      </div>
    </div>
  );
}
