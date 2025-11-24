import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Link} from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";


function Signup() {
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [repeatPassword, setRepeatPassword] = useState();
  const navigate = useNavigate();
  const showToast = useToast();


  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/register", {
        username: username,
        password: password,
      })
      .then((result) => {
        console.log(result);
        showToast("created an account succesfully", "success");
        navigate("/login");
      })
      .catch(showToast("error occured while creating an account", "danger"));
  };

  const validatePasswords = () => {
    const password = document.getElementById("psw").value;
    const repeatPassword = document.getElementById("psw-repeat").value;

    if (password !== repeatPassword) {
      setPasswordError("Error: Passwords do not match.");
    } else {
      setPasswordError("");
    }
  };

  const checkPasswordStrength = () => {
    const password = document.getElementById("psw").value;
    const strength = calculatePasswordStrength(password);
    const indicators = [
      "Very Weak",
      "Weak",
      "Moderate",
      "Strong",
      "Very Strong",
      "No one Hack this (joke)",
    ];

    let color = "";
    if (strength === 0) {
      color = "text-danger";
    } else if (strength === 1) {
      color = "text-warning";
    } else if (strength === 2 || strength === 3) {
      color = "text-secondary";
    } else if (strength >= 4) {
      color = "text-success";
    }

    setPasswordStrength(`Password Strength: ${indicators[strength]}`);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) {
      strength++;
    }
    if (/[A-Z]/.test(password)) {
      strength++;
    }
    if (/[a-z]/.test(password)) {
      strength++;
    }
    if (/\d/.test(password)) {
      strength++;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength++;
    }

    return strength;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-center">Register</h1>
        <p className="text-center">Please fill in this form to register</p>
        <div className="container shadow rounded p-4 col-md-6 offset-md-3">
          <label htmlFor="username">
            <b>username</b>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            name="username"
            id="user_name"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="psw">
            <b>Password</b>
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            name="password"
            id="psw"
            onInput={checkPasswordStrength}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="psw-repeat">
            <b>Repeat Password</b>
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Repeat Password"
            name="password-repeat"
            id="psw-repeat"
            onInput={validatePasswords}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
          <p id="error" className="text-danger">
            {passwordError}
          </p>
          <div id="passwordStrength" className="mt-2">
            {passwordStrength}
          </div>
          <hr />
          <center>
            <p>
              By creating an account you agree to our{" "}
              <a href="#" className="text-primary">
                Terms & Privacy
              </a>
              .
            </p>
          </center>
          <center>
            <button type="submit" className="btn btn-dark registerbtn">
              Register
            </button>
          </center>
          <br />
          <div className="container">
            <center>
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-primary">
                  Login
                </Link>
                .
              </p>
            </center>
          </div>
        </div>
      </form>
      
    </div>
  );
}

function toggleNav() {
  const nav = document.querySelector("nav");
  const hamburger = document.querySelector(".hamburger");
  const container = document.querySelector(".container");
  hamburger.classList.toggle("active");
  container.classList.toggle("active");
  nav.classList.toggle("show");
}

export default Signup;
