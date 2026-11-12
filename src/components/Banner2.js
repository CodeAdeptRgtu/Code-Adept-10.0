import React from "react";
import logo from "../assets/img/Code_Adept_White.png";
import { Link } from "react-router-dom";
import "./Banner2.css";

const Flag = () => {
  return (
    <header className="flag">
      <div className="content">
        <img src={logo} alt="CodeAdept Logo" />
      </div>

      <h1 className="event-title">CodeAdept 10.0</h1>

      <p className="event-organizer">
        Department of Information Technology, UIT RGPV
      </p>

      <p className="event-facts">
        Individual participation <span aria-hidden="true">·</span> Free entry
        <span aria-hidden="true">·</span> UIT RGPV students
      </p>

      <Link to="/register" className="register-btn">
        Registration information
      </Link>
    </header>
  );
};

export default Flag;
