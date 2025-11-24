import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Link, useNavigate } from "react-router-dom";
import { Alert, Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useToast } from "./ToastContext";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const showToast = useToast();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", {
        username: username,
        password: password,
      })
      .then((result) => {
        console.log(result);
        if (result.data === "Success") {
          localStorage.setItem("username", username);
          showToast("Logged in successfully", "success");
          navigate("/");
        } else {
          showToast("Invalid username or password", "danger");
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("An error occurred during login");
      });
  };

  return (
    <div className="position-relative">

      <Container className="mt-0">
        <Form onSubmit={handleSubmit} className="shadow rounded p-4 col-md-6 offset-md-3">
          <h1 className="text-center">Login</h1>
          <p className="text-center">Enter your details to login</p>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label><b>Username</b></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label><b>Password</b></Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <hr />

          <div className="text-center">
            <Button variant="dark" type="submit">
              Login
            </Button>
          </div>
          <br />
          <div className="text-center">
            <p>
              Do not have an account? <Link to="/register">Register here</Link>.
            </p>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default Signin;
