import React, { useState, useCallback, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';
import type { User } from '../interfaces/interfaces';
import { Table, Button, Form, Card, Row, Col, Pagination } from 'react-bootstrap';
import api from '../services/api';
import { createUser, deleteItem, formatDate } from '../services/utils';

export const UserListPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<User[]>([]);

    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    // Get target items from db
    const fetchItems = useCallback(async () => {
        const url = `${ApiUrls.getUsers}`;
        try {
            const data = await api.apiGet<User[]>(url);
            setItems(data);
            setStatus('success');
        } catch (err) {
            setItems([]);
            setStatus('error');
            setError('Failed to fetch items: ' + err);
        }
    }, []);

    // Form Input State
    const [newItemUsername, setNewItemUsername] = useState<string>('');
    const [newItemEmail, setNewItemEmail] = useState<string>('');
    const [newItemFirstName, setNewItemFirstName] = useState<string>('');
    const [newItemLastName, setNewItemLastName] = useState<string>('');
    const [newItemRole, setNewItemRole] = useState<string>('user');
    const [newItemPassword, setNewItemPassword] = useState<string>('');
    //const [newItemLastLogin, setNewItemLastLogin] = useState<string>('');

    // Add Item Handler
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemUsername.trim() || !newItemEmail.trim()) return;
        const currentDate = new Date();
        const newItem: User = {
            id: Date.now(),
            username: newItemUsername,
            password: newItemPassword,
            email: newItemEmail,
            first_name: newItemFirstName,
            last_name: newItemLastName,
            last_login: currentDate.toISOString(),
            role: newItemRole,
        };

        // Create new album
        const response = await createUser(newItem);
        if (response) {
            setStatus('success');
            setItems((prev) => [...prev, newItem]);
        } else {
            setStatus('error');
        }

        // Reset Form Fields
        setNewItemUsername('');
        setNewItemEmail('');
        setNewItemFirstName('');
        setNewItemLastName('');
        setNewItemRole('');
        setNewItemPassword('');
        //setNewItemLastLogin('');
    };

    // Delete Item Handler
    const handleDeleteItem = async (id: number) => {
        const url = id ? ApiUrls.deleteUser ? ApiUrls.deleteUser.replace(':id', id.toString()) : '' : '';
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
                    <Card.Title className="mb-4">Add New User</Card.Title>
                    {/* Add Item Form */}
                    <Form onSubmit={handleAddItem}>
                        <Row className="g-3 align-items-end">
                            <Col md={4}>
                                <Form.Group controlId="itemUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. John's Wedding"
                                        value={newItemUsername}
                                        onChange={(e) => setNewItemUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="itemEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. john@example.com"
                                        value={newItemEmail}
                                        onChange={(e) => setNewItemEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="itemPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={newItemPassword}
                                        onChange={(e) => setNewItemPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="itemFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. John"
                                        value={newItemFirstName}
                                        onChange={(e) => setNewItemFirstName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="itemLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. Doe"
                                        value={newItemLastName}
                                        onChange={(e) => setNewItemLastName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="itemRole">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select
                                        name="role"
                                        defaultValue="user"
                                        onChange={(e) => setNewItemRole(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Event</option>
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                        <option value="user">User</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3} className="align-center justify-center">
                                <Button variant="primary" type="submit" className="w-100" onClick={handleAddItem}>
                                    + Add Item
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    {error ? <p className="text-danger">{error}</p> : null}
                </Card.Body>
            </Card>

            {/* React Bootstrap Table */}
            <Card className="shadow-sm">
                <Card.Header className="bg-white py-3">
                    <Row className="align-items-center">
                        <Col>
                            <h5 className="mb-0">Albums</h5>
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
                                <th>Username</th>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Role</th>
                                <th>Last Login</th>
                                <th className="text-center" style={{ width: '120px' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        No items in table. Add one above!
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.username}</td>
                                        <td>{item.email}</td>
                                        <td>{item.first_name ? item.first_name : '—'}</td>
                                        <td>{item.last_name ? item.last_name : '—'}</td>
                                        <td>{item.role}</td>
                                        <td>{item.last_login ? formatDate(item.last_login) : '—'}</td>
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