import React from "react";
import { NavLink } from "react-router-dom";
const NotFound = () => {
  return (
    <div>
      <h1>Error 404 page not found</h1>
      <NavLink to="/">Return to home</NavLink>
    </div>
  );
};

export default NotFound;
