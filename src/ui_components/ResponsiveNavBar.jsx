import React from 'react'
import { NavLink } from "react-router-dom";

const ResponsiveNavBar = ({username, logout, IsAuthenticated}) => {
  return (
    <nav className="max-container padding-x py-6 max-md:block hidden dark:text-[#FFFFFF]">
    <ul className="flex items-center justify-center gap-6 text-[#3B3C4A] lg:flex-1 flex-col dark:text-[#FFFFFF]">
          
          {
            IsAuthenticated ? 
            <>
              <li>
                <NavLink
                  to="/profile"
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
  </nav>
  )
}

export default ResponsiveNavBar