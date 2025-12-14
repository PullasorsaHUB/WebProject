import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Navbar() {
  const { isLoggedIn, logout, getCurrentUserInfo } = useAuth();
  const userInfo = getCurrentUserInfo();

  return (
    <nav className="navbar bg-base-200 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <div className="flex justify-between items-center w-full md:w-auto">
          <div className="flex items-center gap-3">
            <Link to="/" className="btn btn-ghost text-xl">
              SimpleChef
            </Link>
            {isLoggedIn && userInfo && (
              <span className="text-sm text-base-content/70 hidden md:inline">
                Tervetuloa, {userInfo.userName || userInfo.email}
              </span>
            )}
          </div>
          {!isLoggedIn ? (
            <Link to="/login" className="btn btn-primary btn-sm md:hidden">
              Kirjaudu
            </Link>
          ) : (
            <div className="flex items-center gap-2 md:hidden">
              <span className="text-sm text-base-content/70">
                {userInfo?.userName || userInfo?.email}
              </span>
              <button onClick={logout} className="btn btn-ghost btn-sm">
                Kirjaudu ulos
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link to="/">Reseptit</Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/recipes/new">Uusi resepti</Link>
                </li>
                <li>
                  <Link to="/favorites">Suosikit</Link>
                </li>
              </>
            )}
          </ul>
          
          {!isLoggedIn ? (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="btn btn-primary btn-sm">
                Kirjaudu
              </Link>
              <Link to="/register" className="btn btn-ghost btn-sm">
                Rekisteröidy
              </Link>
            </div>
          ) : (
            <button onClick={logout} className="hidden md:inline-flex btn btn-ghost btn-sm">
              Kirjaudu ulos
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
