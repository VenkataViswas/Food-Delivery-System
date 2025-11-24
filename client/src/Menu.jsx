import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Menu() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/menu")
      .then((result) => {
        // Normalize backend field item_image -> image for easier usage in UI
        const normalized = result.data.map((it) => ({
          ...it,
          image:
            it.item_image ??
            it.image ??
            "https://via.placeholder.com/400x300?text=No+Image",
        }));
        setItems(normalized);
      })
      .catch((err) => {
        console.error("Error fetching menu:", err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const username = localStorage.getItem("username");

  const addToCart = (itemName, itemPrice) => {
    const existingItem = cartItems.find((item) => item.name === itemName);
    if (existingItem) {
      const updatedCart = cartItems.map((item) =>
        item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([
        ...cartItems,
        { name: itemName, price: parseFloat(itemPrice), quantity: 1 },
      ]);
    }
  };

  const removeFromCart = (itemName) => {
    const updatedCart = cartItems.filter((item) => item.name !== itemName);
    setCartItems(updatedCart);
  };

  const reduceQuantity = (itemName) => {
    const existingItem = cartItems.find((item) => item.name === itemName);
    if (!existingItem) return;
    if (existingItem.quantity === 1) {
      removeFromCart(itemName);
    } else {
      const updatedCart = cartItems.map((item) =>
        item.name === itemName ? { ...item, quantity: item.quantity - 1 } : item
      );
      setCartItems(updatedCart);
    }
  };

  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalBill = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const submitCart = () => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalBill", totalBill.toString());
    navigate("/payments");
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col md={8}>
          <input
            type="text"
            placeholder="Search items"
            className="form-control mb-3"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />

          {filteredItems.length === 0 && (
            <p className="text-muted">No items found.</p>
          )}

          {filteredItems.map((item) => (
            <Card key={item._id ?? item.item_name} className="mb-3">
              <Row className="g-0">
                <Col md={4}>
                  <Card.Img
                    src={item.image}
                    alt={item.item_name}
                    style={{ objectFit: "cover", height: "200px", width: "100%" }}
                  />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>{item.item_name}</Card.Title>
                    <Card.Text>Description : {item.item_description}</Card.Text>
                    <Card.Text>Rating : {item.item_rating}★</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Price: ₹{item.item_price}</small>
                      {username ? (
                        <Button
                          variant="outline-secondary"
                          onClick={() => addToCart(item.item_name, item.item_price)}
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <Link to="/login">
                          <Button variant="outline-secondary">Login to Order</Button>
                        </Link>
                      )}
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>

        <Col md={4} className="cart-section">
          <h2>Cart</h2>
          <br />
          {cartItems.length === 0 && <p className="text-muted">Your cart is empty.</p>}
          {cartItems.map((item, index) => (
            <div key={index} className="mb-2">
              <p>
                {item.name} - ₹{item.price} x {item.quantity}
              </p>
              <Button variant="danger" size="sm" onClick={() => reduceQuantity(item.name)}>
                Reduce
              </Button>{" "}
              <Button variant="danger" size="sm" onClick={() => removeFromCart(item.name)}>
                Remove
              </Button>
              <hr />
            </div>
          ))}

          {cartItems.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center">
                <p>Total Items in Cart: {totalItemsInCart}</p>
                <p>Total Bill: ₹{totalBill}</p>
              </div>
              <center>
                <Button variant="danger" size="sm" onClick={submitCart}>
                  Proceed to Payments
                </Button>
              </center>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Menu;
