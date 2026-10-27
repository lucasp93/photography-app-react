import React, { useState, useCallback, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';
import type { Order } from '../interfaces/interfaces';
import { Table, Button, Form, Card, Row, Col, Pagination, Toast } from 'react-bootstrap';
import api from '../services/api';
import { createOrder, deleteItem } from '../services/utils';
import ImageIcon from '@mui/icons-material/Image';

export const OrderListPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<Order[]>([]);

    // Toast State
    const [showA, setShowA] = useState(true);
    const [showB, setShowB] = useState(true);

    const toggleShowA = () => setShowA(!showA);
    const toggleShowB = () => setShowB(!showB);

    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    // Get target items from db
    const fetchItems = useCallback(async () => {
        const url = `${ApiUrls.getOrders}`;
        try {
            const data = await api.apiGet<Order[]>(url);
            setItems(data);
            setStatus('success');
        } catch (err) {
            setItems([]);
            setStatus('error');
            setError('Failed to fetch items: ' + err);
        }
    }, []);
    // Form Input State
    const [newItemOrderNumber, setNewItemOrderNumber] = useState<string>('');
    const [newItemClientName, setNewItemClientName] = useState<string>('');
    const [newItemClientContact, setNewItemClientContact] = useState<string>('');
    const [newItemClientEmail, setNewItemClientEmail] = useState<string>('');
    const [newItemPrice, setNewItemPrice] = useState<number>(0);
    //const [newItemPhotos, setNewItemPhotos] = useState<string>('');

    // Add Item Handler
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemClientName.trim() || !newItemOrderNumber.trim()) return;

        const newItem: Order = {
            id: Date.now(),
            order_number: newItemOrderNumber,
            client_name: newItemClientName,
            client_contact: newItemClientContact,
            client_email: newItemClientEmail,
            price: newItemPrice,
            photos: [],
        };

        // Create new album
        const response = await createOrder(newItem);
        if (response) {
            setStatus('success');
            setItems((prev) => [...prev, newItem]);
        } else {
            setStatus('error');
        }

        // Reset Form Fields
        setNewItemOrderNumber('');
        setNewItemClientName('');
        setNewItemClientContact('');
        setNewItemClientEmail('');
        setNewItemPrice(0);
        //setNewItemPhotos('');
    };

    // Delete Item Handler
    const handleDeleteItem = async (id: number) => {
        const url = id ? ApiUrls.deleteOrder ? ApiUrls.deleteOrder.replace(':id', id.toString()) : '' : '';
        const response = await deleteItem(url, id);

        if (response) {
            setStatus('success');
            setItems((prev) => {
                const updated = prev.filter((item) => item.id !== id);

                // Adjust current page if last item on current page was deleted
                const newTotalPages = Math.ceil(updated.length / itemsPerPage);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }
                return updated;
            });
        } else {
            setStatus('error');
            setError('Failed to delete item');
        }
    };

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // 2. Pagination Calculations
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to page 1 on limit change
    };

    // Helper function to generate pagination items with ellipsis (...)
    const renderPaginationItems = () => {
        const pageItems = [];
        const maxVisiblePages = 5; // Number of page buttons shown around active page

        if (totalPages <= maxVisiblePages + 2) {
            // Show all pages if total pages are small
            for (let i = 1; i <= totalPages; i++) {
                pageItems.push(
                    <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }
        } else {
            // Always show first page
            pageItems.push(
                <Pagination.Item
                    key={1}
                    active={1 === currentPage}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </Pagination.Item>
            );

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Left ellipsis
            if (startPage > 2) {
                pageItems.push(<Pagination.Ellipsis key="left-ellipsis" disabled />);
            }

            // Middle pages around active page
            for (let i = startPage; i <= endPage; i++) {
                pageItems.push(
                    <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }

            // Right ellipsis
            if (endPage < totalPages - 1) {
                pageItems.push(<Pagination.Ellipsis key="right-ellipsis" disabled />);
            }

            // Always show last page
            pageItems.push(
                <Pagination.Item
                    key={totalPages}
                    active={totalPages === currentPage}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        return pageItems;
    };

    if (status === 'loading') return <p>Loading items...</p>;
    if (status === 'error') return <p>Error: {error}</p>;

    return (
        <div className="container py-4">
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Card.Title className="mb-3">Add New Order</Card.Title>
                    {/* Add Item Form */}
                    <Form onSubmit={handleAddItem}>
                        <Row className="g-3 align-items-end">
                            <Col md={4}>
                                <Form.Group controlId="itemClientName">
                                    <Form.Label>Client</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. John's Wedding"
                                        value={newItemClientName}
                                        onChange={(e) => setNewItemClientName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="itemClientContact">
                                    <Form.Label>Contact</Form.Label>
                                    <Form.Control
                                        type="phone"
                                        placeholder="e.g. +14155552671"
                                        value={newItemClientContact}
                                        onChange={(e) => setNewItemClientContact(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="ItemClientEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="e.g. john@example.com"
                                        value={newItemClientEmail}
                                        onChange={(e) => setNewItemClientEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="ItemPrice">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="float"
                                        placeholder="e.g. 10.00"
                                        value={newItemPrice}
                                        onChange={(e) => setNewItemPrice(Number(e.target.value))}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3} className="align-center justify-center">
                                <Button variant="primary" type="submit" className="w-100" onClick={handleAddItem}>
                                    + Add Item
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* React Bootstrap Table */}
            <Card className="shadow-sm">
                <Card.Header className="bg-white py-3">
                    <Row className="align-items-center">
                        <Col>
                            <h5 className="mb-0">Orders</h5>
                        </Col>
                        {/* Items per page limit selector */}
                        <Col xs="auto" className="d-flex align-items-center gap-2">
                            <Form.Label className="mb-0 text-muted small">Show per page:</Form.Label>
                            <Form.Select
                                size="sm"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                style={{ width: '80px' }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Header>

                <Card.Body className="p-0">
                    <Table responsive striped bordered hover className="mb-0 align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Order</th>
                                <th>Client</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Price</th>
                                <th>Photos</th>
                                {currentItems.length > 0 ?
                                    <th className="text-center" style={{ width: '120px' }}>
                                        Actions
                                    </th>
                                    : null
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.order_number ?? '—'}</td>
                                        <td>{item.client_name ?? '—'}</td>
                                        <td>{item.client_email ?? '—'}</td>
                                        <td>{item.client_contact ?? '—'}</td>
                                        <td>{item.price ?? '—'}</td>
                                        <td>
                                            <Row className="align-items-center justify-content-center mt-2">
                                                <Col md={6} className="mb-2">
                                                    <Button onClick={toggleShowA} className="mb-2">
                                                        <ImageIcon />
                                                    </Button>
                                                    <Toast show={showA} onClose={toggleShowA}>
                                                        <Toast.Header>
                                                            <img
                                                                src="holder.js/20x20?text=%20"
                                                                className="rounded me-2"
                                                                alt=""
                                                            />
                                                            <strong className="me-auto">Bootstrap</strong>
                                                            <small>11 mins ago</small>
                                                        </Toast.Header>
                                                        <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
                                                    </Toast>
                                                </Col>
                                            </Row>
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteItem(Number(item.id))}
                                                title="Delete Item"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>

                {/* Card Footer with Ellipsis Pagination */}
                {totalPages > 1 && (
                    <Card.Footer className="bg-white d-flex justify-content-between align-items-center py-3">
                        <div className="text-muted small">
                            Showing <strong>{indexOfFirstItem + 1}</strong> to{' '}
                            <strong>{Math.min(indexOfLastItem, totalItems)}</strong> of{' '}
                            <strong>{totalItems}</strong> entries
                        </div>

                        <Pagination className="mb-0">
                            <Pagination.First
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                            />
                            <Pagination.Prev
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />

                            {/* Render ellipsis-bounded page items */}
                            {renderPaginationItems()}

                            <Pagination.Next
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                            <Pagination.Last
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </Card.Footer>
                )}
            </Card>
        </div>
    );
};