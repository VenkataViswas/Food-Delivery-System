import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function PaymentsPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const bill = parseFloat(localStorage.getItem("totalBill")) || 0;
    setCartItems(items);
    setTotalBill(bill);
  }, []);

  const formatCurrency = (v) =>
    typeof v === "number" ? `₹${v.toFixed(2)}` : `₹${parseFloat(v).toFixed(2)}`;

  const taxRate = 0.05; // 5% example tax (adjust or remove)
  const taxAmount = parseFloat((totalBill * taxRate).toFixed(2));
  const grandTotal = parseFloat((totalBill + taxAmount).toFixed(2));

  const confirmOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      setErrorMsg("Your cart is empty. Add items before confirming.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    const orderData = {
      items: cartItems,
      totalBill: grandTotal,
      username: localStorage.getItem("username") || "guest",
      orderDate: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/cart/checkout",
        orderData
      );

      // success
      setLoading(false);
      setSuccessMsg("Booking successful! Your order has been placed.");
      // clear cart
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalBill");
      setCartItems([]);
      setTotalBill(0);
    } catch (err) {
      console.error("Error confirming order:", err);
      setLoading(false);
      setErrorMsg(
        err?.response?.data?.message ||
          "Something went wrong while placing the order. Try again."
      );
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <h2 className="mb-4 text-center">Confirm Your Booking</h2>

          {successMsg && (
            <Alert variant="success" onClose={() => setSuccessMsg("")} dismissible>
              {successMsg}{" "}
              <Button
                variant="outline-success"
                size="sm"
                className="ms-2"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </Alert>
          )}

          {errorMsg && (
            <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible>
              {errorMsg}
            </Alert>
          )}

          <Card className="mb-4 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Order Summary</strong>
              <small className="text-muted">Review items before confirming</small>
            </Card.Header>

            <ListGroup variant="flush">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((it, idx) => {
                  const lineTotal = parseFloat(it.price) * parseInt(it.quantity, 10);
                  return (
                    <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{it.name}</div>
                        <div className="text-muted small">
                          {formatCurrency(it.price)} × {it.quantity}
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-semibold">{formatCurrency(lineTotal)}</div>
                      </div>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <ListGroup.Item className="text-center text-muted">
                  Your cart is empty.
                </ListGroup.Item>
              )}
            </ListGroup>

            <Card.Body>
              <Row className="mb-2">
                <Col>Subtotal</Col>
                <Col className="text-end">{formatCurrency(totalBill)}</Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  Tax <Badge bg="secondary" pill>{(taxRate * 100).toFixed(0)}%</Badge>
                </Col>
                <Col className="text-end">{formatCurrency(taxAmount)}</Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col className="fw-bold">Grand Total</Col>
                <Col className="text-end fw-bold">{formatCurrency(grandTotal)}</Col>
              </Row>

              <div className="d-flex justify-content-between align-items-center">
                <Button
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Back
                </Button>

                <div>
                  <Button
                    variant="danger"
                    onClick={confirmOrder}
                    disabled={loading || cartItems.length === 0}
                    className="me-2"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" /> Confirming...
                      </>
                    ) : (
                      "Confirm Order"
                    )}
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      localStorage.removeItem("cartItems");
                      localStorage.removeItem("totalBill");
                      setCartItems([]);
                      setTotalBill(0);
                    }}
                    disabled={loading || cartItems.length === 0}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="text-center shadow-sm">
            <Card.Body>
              <small className="text-muted">
                By confirming, you agree to our terms and conditions. For any
                queries contact us at <strong>+123-456-7890</strong>.
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PaymentsPage;
