import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="navbar bg-base-200 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link to="/" className="btn btn-ghost text-xl">
            SimpleChef
          </Link>
          <Link to="/login" className="btn btn-primary btn-sm md:hidden">
            Kirjaudu
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link to="/">Reseptit</Link>
            </li>
            <li>
              <Link to="/recipes/new">Uusi resepti</Link>
            </li>
            <li>
              <Link to="/favorites">Suosikit</Link>
            </li>
          </ul>
          <Link to="/login" className="hidden md:inline-flex btn btn-primary btn-sm">
            Kirjaudu
          </Link>
        </div>
      </div>
    </nav>
  );
}
