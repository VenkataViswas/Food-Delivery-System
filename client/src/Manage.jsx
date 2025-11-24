import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Card,
  Col,
  Row,
  Container,
  Button,
  ListGroup,
} from "react-bootstrap";
import { useToast } from "./ToastContext";
import axios from "axios";
import "./Menu.css";
import { useNavigate } from "react-router-dom";

function Manage() {
  const handleDeleteAccount = () => {
    // Add logic to delete account
    console.log("Account deleted");
  };

  const [oldpassword, setOldpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [newrepeatPassword, setNewRepeatPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const username = localStorage.getItem("username");
  const showToast = useToast();
  const navigate = useNavigate();


  const handleChangePassword = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/changepassword", {
        username: username,
        oldpassword: oldpassword,
        newpassword: newpassword,
      })
      .then((result) => {
        console.log(result.data);
        if (result.data === "Success") {
          showToast("Password changed successfully", "success");
          navigate("/");
        } else {
          showToast("Current password may be", "danger");
        }
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        showToast("An error occurred while changing the password", "danger");
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/history/${username}`)
      .then((result) => {
        setOrders(result.data);
      })
      .catch((error) => {
        console.error("Error fetching order history:", error);
      });
  }, [username]);

  const formatDate = (orderDate) => {
    const date = new Date(orderDate);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const [items, setItems] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/menu").then((result) => {
      setItems(result.data);
    });
  }, []);

  const [selectedItem, setSelectedItem] = useState("");
  const [rating, setRating] = useState("");

  const handleItemSelect = (event) => {
    setSelectedItem(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const submitRating = () => {
    axios
      .post("http://localhost:3001/rate-item", {
        itemName: selectedItem,
        rating: parseFloat(rating),
      })
      .then((response) => {
        console.log("Rating submitted successfully:", response.data);
        showToast("Rating submited successfully", "success");

        setSelectedItem("");
        setRating("");
      })
      .catch((error) => {
        showToast("error while submitting ratings", "danger");
      });
  };

  return (
    <><br></br>
      <Container className="manage-container">
        <h2 className="manage-heading">Manage Account</h2>
        <hr className="manage-divider" />

        <div className="manage-section">
          <h3 className="manage-subheading">Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                onChange={(e) => setOldpassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                onChange={(e) => setNewpassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                onChange={(e) => setNewRepeatPassword(e.target.value)}
                required
              />
            </div>
            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </form>
        </div>

        <hr className="manage-divider" />

        <div className="manage-section">
          <h3 className="manage-subheading">Delete Account</h3>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </Container>
      <br />
      <Container className="manage-container">
        <div className="manage-section">
          <h3 className="manage-subheading">Order History</h3>
          <ListGroup className="order-history">
            {orders.map((order) => (
              <Card key={order._id} className="mb-3">
                <Card.Body>
                  <Card.Title>
                    Order Date : {formatDate(order.orderDate)}
                  </Card.Title>
                  <Card.Text>Total Bill: ₹{order.totalBill}</Card.Text>
                  <ListGroup>
                    {order.items.map((item, index) => (
                      <ListGroup.Item key={index}>
                        {item.name} - ₹{item.price} x {item.quantity}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ))}
          </ListGroup>
        </div>
        <hr className="manage-divider" />

        <div className="manage-section">
          <h3 className="manage-subheading">Rate Items</h3>
          <div className="mb-3">
            <label htmlFor="itemSelect" className="form-label">
              Select Item
            </label>
            <select
              className="form-select"
              id="itemSelect"
              value={selectedItem}
              onChange={handleItemSelect}
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item._id} value={item.item_name}>
                  {item.item_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <input
              type="number"
              className="form-control"
              id="rating"
              min="1"
              max="5"
              value={rating}
              onChange={handleRatingChange}
              required
            />
          </div>
          <Button variant="primary" type="button" onClick={submitRating}>
            Submit Rating
          </Button>
        </div>
      </Container>
    </>
  );
}

export default Manage;
