import React from 'react'
import { NavLink } from "react-router-dom";

const ResponsiveNavBar = ({username, logout, IsAuthenticated, setShowNavBar, showNavBar}) => {
  return (
    <nav className="max-container padding-x py-6 max-md:block hidden fixed top-20 z-10 z-10 bg-[#FFFFFF] dark:bg-[#141624] dark:text-[#FFFFFF]">
    <ul className="flex items-center justify-center gap-6 text-[#3B3C4A] lg:flex-1 flex-col dark:text-[#FFFFFF]">
          
          {
            IsAuthenticated ? 
            <>
              <li onClick={() => setShowNavBar(false)}>
                <NavLink
                  to={`/profile/${username}`}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Welcome {username}!
                </NavLink>
              </li>
              <li onClick={() => setShowNavBar(false)}>
                <NavLink
                  to="/change_password"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Change Password
                </NavLink>
              </li>
              <li onClick={() => { logout(); setShowNavBar(false); }}  className="cursor-pointer">Logout</li>
            </>
            : 
            <>
              <li onClick={() => setShowNavBar(false)}>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Login
                </NavLink>
              </li>
              
              <li onClick={() => setShowNavBar(false)}>
                <NavLink
                  to="/signup"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Sign-up
                </NavLink>
              </li>
              
            </>
          }
          <li onClick={() => setShowNavBar(false)}>
            <NavLink
              to="/create_blog"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Create Post
            </NavLink>
          </li>
          
        </ul>
  </nav>
  )
}

export default ResponsiveNavBar