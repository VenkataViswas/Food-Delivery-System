import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { useToast } from "./ToastContext";

function AdminMenu() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        item_name: "",
        item_description: "",
        item_price: "",
        item_image: "",
        item_rating: "",
        category: "Main Course" // Default category
    });
    const showToast = useToast();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        axios
            .get("http://localhost:3001/menu")
            .then((result) => {
                const normalized = result.data.map((it) => ({
                    ...it,
                    image: it.item_image ?? it.image ?? "https://via.placeholder.com/400x300?text=No+Image",
                }));
                setItems(normalized);
            })
            .catch((err) => {
                console.error("Error fetching menu:", err);
                showToast("Failed to fetch menu items", "danger");
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:3001/menu", newItem)
            .then((result) => {
                showToast("Item added successfully", "success");
                setNewItem({
                    item_name: "",
                    item_description: "",
                    item_price: "",
                    item_image: "",
                    item_rating: "",
                    category: "Main Course"
                });
                fetchItems(); // Refresh list
            })
            .catch((err) => {
                console.error("Error adding item:", err);
                showToast("Failed to add item", "danger");
            });
    };

    const handleDeleteItem = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            axios
                .delete(`http://localhost:3001/menu/${id}`)
                .then((result) => {
                    showToast("Item deleted successfully", "success");
                    fetchItems(); // Refresh list
                })
                .catch((err) => {
                    console.error("Error deleting item:", err);
                    showToast("Failed to delete item", "danger");
                });
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Admin Menu Management</h2>

            <Row>
                <Col md={4}>
                    <Card className="mb-4 p-3 shadow-sm">
                        <Card.Title>Add New Item</Card.Title>
                        <Form onSubmit={handleAddItem}>
                            <Form.Group className="mb-3">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="item_name"
                                    value={newItem.item_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="item_description"
                                    value={newItem.item_description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Price (₹)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="item_price"
                                    value={newItem.item_price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="item_image"
                                    value={newItem.item_image}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Rating</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.1"
                                    max="5"
                                    name="item_rating"
                                    value={newItem.item_rating}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Add Item
                            </Button>
                        </Form>
                    </Card>
                </Col>

                <Col md={8}>
                    <h3>Current Menu Items</h3>
                    {items.length === 0 ? (
                        <Alert variant="info">No items found.</Alert>
                    ) : (
                        <Row>
                            {items.map((item) => (
                                <Col md={6} lg={4} key={item._id ?? item.item_name} className="mb-4">
                                    <Card className="h-100 shadow-sm">
                                        <Card.Img
                                            variant="top"
                                            src={item.image}
                                            style={{ height: "150px", objectFit: "cover" }}
                                        />
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title>{item.item_name}</Card.Title>
                                            <Card.Text className="small text-muted flex-grow-1">
                                                {item.item_description}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <span className="fw-bold">₹{item.item_price}</span>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteItem(item._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default AdminMenu;
