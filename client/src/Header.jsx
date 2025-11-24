import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";

const Header = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const location = useLocation();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    showToast("Logged out successfully", "success");
    navigate("/login");
  };

  const renderNavLinks = () => {
    if (location.pathname === "/") {
      return (
        <>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/menu">
            Menu
          </Nav.Link>
          {username ? (
            <Nav.Link as={Link} to="/manage">
              {username}
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          )}
          <li className="nav-item">
            <a className="nav-link" href="#about">
              About
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#menu">
              Our Specials
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#gallery">
              Gallery
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#delivery">
              Delivery
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#reservation">
              Reservation
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#contact">
              Contact
            </a>
          </li>
        </>
      );
    } else if (location.pathname === "/manage") {
      return (
        <>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/menu">
            Menu
          </Nav.Link>
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        </>
      );
    } else {
      return (
        <>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/menu">
            Menu
          </Nav.Link>
          {username ? (
            <Nav.Link as={Link} to="/manage">
              {username}
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          )}
        </>
      );
    }
  };

  return (
    <header
      className="bg-header"

      
    >
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="mb-0 bg-transparent"
        style={{ position: "fixed", width:"100%",zIndex:10}}
      >
        <Container>
          <Navbar.Brand>KHAN FOOD COURT</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>{renderNavLinks()}</Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
      <br />
      <br />
      <div className="h-full w-full flex flex-col justify-center items-center header-content">
        <h1 className="text-white text-5xl font-bold">
          Welcome to Our Restaurant
        </h1>
        <p className="text-white text-xl mt-2">
          Experience the finest cuisine in town
        </p>
        <a href="#about" className="btn btn-primary mt-4 hover-bounce">
          Learn More
        </a>
      </div>
    </header>
  );
};

export default Header;
