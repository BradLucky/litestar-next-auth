"use client";

import { useContext, useState } from "react";
import AuthContext from "../AuthContext";

const Logout = () => {
  const { logout } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await logout();
  };

  return (
    <div className="container">
      <h2>Logout</h2>
      <form onSubmit={handleSubmit}>
        <button type="submit">Logout</button>
      </form>
    </div>
  )
}

export default Logout;
