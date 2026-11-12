import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/img/DoIT .png";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
    setIsOpen(false);
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar
      expand="md"
      className={scrolled ? "scrolled" : ""}
      expanded={isOpen}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          onClick={() => onUpdateActiveLink("home")}
        >
          <img
            src={logo}
            alt="Codeadept"
            style={{ maxHeight: "60px", width: "auto" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={
                activeLink === "home" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("home")}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/Codeadept"
              className={
                activeLink === "CodeAdept"
                  ? "active navbar-link"
                  : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("CodeAdept")}
            >
              CodeAdept 10.0
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/practice"
              className={
                activeLink === "Practice" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("Practice")}
            >
              Practice
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/teams"
              className={
                activeLink === "teams" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("teams")}
            >
              Team
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/contact"
              className={
                activeLink === "contact" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("contact")}
            >
              Contact
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/register"
              className={
                activeLink === "register" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("register")}
            >
              Register
            </Nav.Link>
          </Nav>

          {/* <span className="navbar-text">
            <Link to="/register">
              <button className="vvd" onClick={() => setIsOpen(false)}>
                <span>Register</span>
              </button>
            </Link>
          </span> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
