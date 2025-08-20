import { Switch } from "@/components/ui/switch"
import { FaHamburger } from "react-icons/fa"
import ResponsiveNavBar from "./ResponsiveNavBar"
import { useState } from "react"
import { Link, NavLink } from "react-router-dom"

const NavBar = ({darkMode, handleDarkMode, IsAuthenticated, username, setUsername, setIsAuthenticated}) => {

  const [showNavBar, setShowNavBar] = useState(false)

  function logout(){
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("github_code_used")
    setIsAuthenticated(false)
    setUsername(null)
  }

  return (
    <>
      <nav className="max-container padding-x py-6 flex justify-between items-center  gap-6 sticky top-0 z-10 bg-[#FFFFFF] dark:bg-[#141624]">
        <Link to="/" className="text-[#141624] text-2xl dark:text-[#FFFFFF]">
          Blogify
        </Link>
        <ul className="flex items-center  justify-end gap-9 text-[#3B3C4A] lg:flex-1 max-md:hidden dark:text-[#FFFFFF]">
          
          {
            IsAuthenticated ? 
            <>
              <li>
                <NavLink
                  to={`/profile/${username}`}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Welcome {username}!
                </NavLink>
              </li>
              <li onClick={logout} className="cursor-pointer">Logout</li>
            </>
            : 
            <>
              
              <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                Login
              </NavLink>
              <NavLink
                  to="/signup"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                Sign-up
              </NavLink>
            </>
          }

          <NavLink
              to="/create_blog"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
            Create Post
          </NavLink>
        </ul>

        <Switch className="" onCheckedChange={handleDarkMode} checked={darkMode} />
        <FaHamburger className="text-2xl cursor-pointer hidden max-md:block dark:text-white" onClick={() => setShowNavBar(curr => !curr)} />
      </nav>

      {showNavBar && <ResponsiveNavBar IsAuthenticated={IsAuthenticated} username={username} logout={logout} />}
    </>
  );
};

export default NavBar;