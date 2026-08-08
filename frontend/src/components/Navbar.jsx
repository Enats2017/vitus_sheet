import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return(
    
    <nav>
      <NavLink to="/dashboard">Quick view</NavLink>
      <NavLink to="/centre-updates">Dialysis centre updates</NavLink>
      <NavLink to="/revenue-share">Revenue share</NavLink>
      <NavLink to="/sessions-engagement">Sessions and patient engagement</NavLink>
      <NavLink to="/maintenance-repair">Maintenance and repair</NavLink>
      <NavLink to="/keyDock">Key documents</NavLink> 
    </nav>
  
  )
};

export default Navbar;