import React, { useState, useCallback, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';
import type { User } from '../interfaces/interfaces';
import { Table, Button, Form, Card, Row, Col } from 'react-bootstrap';
import api from '../services/api';
import { createUser, deleteUser } from '../services/userService';
import { formatDate } from '../services/utils';
import { PaginationBar } from '../components/PaginationBar';
import Alert from '@mui/material/Alert';

export const UserListPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<User[]>([]);

    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    // Filter State
    const [filterUsername, setFilterUsername] = useState<string>('');
    const [filterEmail, setFilterEmail] = useState<string>('');
    const [filterFirstName, setFilterFirstName] = useState<string>('');
    const [filterLastname, setFilterLastName] = useState<string>('');

    const handleClearFilters = () => {
        setFilterUsername('');
        setFilterEmail('');
        setFilterFirstName('');
        setFilterLastName('');
    };


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
        const response = await deleteUser(id);

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

    // Filter items by username, email, first name and last name
    const filteredItems = items.filter((item) => {
        const matchesUsername = (item.username ?? '')
            .toLowerCase()
            .includes(filterUsername.trim().toLowerCase());
        const matchesEmail = (item.email ?? '')
            .toLowerCase()
            .includes(filterEmail.trim().toLowerCase());
        const matchFirstName = (item.first_name ?? '')
            .toLowerCase()
            .includes(filterFirstName.trim().toLowerCase());
        const matchLastName = (item.last_name ?? '')
            .toLowerCase()
            .includes(filterLastname.trim().toLowerCase());

        return matchesUsername && matchesEmail && matchFirstName && matchLastName;
    });

    // 2. Pagination Calculations
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to page 1 on limit change
    };

    if (status === 'loading') return <p>Loading items...</p>;
    { error && <Alert severity="error">{error}</Alert> }

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
                    <Row className="align-items-center mb-3">
                        <Col>
                            <h5 className="mb-0">Users</h5>
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
                    {/* Filter inputs */}
                    <Row className="g-2 align-items-center">
                        <Col md={3}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Filter by username"
                                value={filterUsername}
                                onChange={(e) => {
                                    setFilterUsername(e.target.value)
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Filter by email"
                                value={filterEmail}
                                onChange={(e) => {
                                    setFilterEmail(e.target.value)
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Filter by first name"
                                value={filterFirstName}
                                onChange={(e) => {
                                    setFilterFirstName(e.target.value)
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Filter by last name"
                                value={filterLastname}
                                onChange={(e) => {
                                    setFilterLastName(e.target.value)
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                        <Col md={2}>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-100"
                                onClick={handleClearFilters}
                                disabled={!filterEmail && !filterUsername && !filterFirstName && !filterLastname}
                            >
                                Clear filters
                            </Button>
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
                            {filteredItems.length === 0 ? (
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
                        <PaginationBar
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </Card.Footer>
                )}
            </Card>
        </div>
    );
};