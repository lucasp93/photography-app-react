import React, { useState, useCallback, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';
import type { Album } from '../interfaces/interfaces';
import { Table, Button, Form, Card, Row, Col, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { createAlbum, updateAlbum, deleteAlbum } from '../services/albumService';
import { PaginationBar } from '../components/PaginationBar';
import Alert from '@mui/material/Alert';

export const AlbumListPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<Album[]>([]);

    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    // Filter state
    const [filterTitle, setFilterTitle] = useState<string>('');
    const [filterAuthor, setFilterAuthor] = useState<string>('');
    const [filterEvent, setFilterEvent] = useState<string>('');

    const handleClearFilters = () => {
        setFilterTitle('');
        setFilterAuthor('');
        setFilterEvent('');
        setCurrentPage(1);
    };

    // Get target items from db
    const fetchItems = useCallback(async () => {
        const url = `${ApiUrls.getAlbums}`;
        try {
            const data = await api.apiGet<Album[]>(url);
            setItems(data);
            setStatus('success');
        } catch (err) {
            setItems([]);
            setStatus('error');
            setError('Failed to fetch items: ' + err);
        }
    }, []);

    // Form Input State
    const [action, setAction] = useState<'create' | 'update'>('create');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [newItemId, setNewItemId] = useState<number>(0);
    const [newItemName, setNewItemName] = useState<string>('');
    const [newItemAuthor, setNewItemAuthor] = useState<string>('');
    const [newItemEvent, setNewItemEvent] = useState<string>('');

    const handleClearAlbumForm = () => {
        setNewItemId(0);
        setNewItemName('');
        setNewItemAuthor('');
        setNewItemEvent('');
    };

    // Add / Update Item Handler
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        if (!newItemName.trim() || !newItemAuthor.trim()) return;

        const newItem: Album = {
            id: newItemId,
            name: newItemName,
            event: newItemEvent,
            author: newItemAuthor,
        };

        setLoading(true);
        const response =
            action === 'create' ? await createAlbum(newItem) : await updateAlbum(newItem);

        if (response) {
            await fetchItems();
            setStatus('success');
            if (action !== 'create') {
                setAction('create');
            }
            handleClearAlbumForm();
        } else {
            setStatus('error');
            setErrorMessage(
                action === 'create' ? 'Failed to create album' : 'Failed to update album'
            );
        }

        setLoading(false);
    };

    // Edit Item Handler
    const handleEditItem = (item: Album) => {
        setNewItemId(Number(item.id));
        setNewItemName(item.name);
        setNewItemEvent(item.event);
        setNewItemAuthor(item.author);
        setAction('update');
    };

    // Delete Item Handler
    const handleDeleteItem = async (id: number) => {
        const response = await deleteAlbum(id);

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
        const matchesAuthor = (item.author ?? '')
            .toLowerCase()
            .includes(filterAuthor.trim().toLowerCase());
        const matchesEvent = (item.event ?? '')
            .toLowerCase()
            .includes(filterEvent.trim().toLowerCase());
        const matchName = (item.name ?? '')
            .toLowerCase()
            .includes(filterTitle.trim().toLowerCase());

        return matchesAuthor && matchesEvent && matchName;
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
                    <Card.Title className="mb-3">
                        {action === 'create' ? 'Add New Album' : 'Update Album'}
                    </Card.Title>
                    {errorMessage && <Alert severity="error" className="mb-3">{errorMessage}</Alert>}
                    {/* Add Item Form */}
                    <Form onSubmit={handleAddItem}>
                        <Row className="g-3 align-items-end">
                            <Col md={3}>
                                <Form.Group controlId="itemName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. John's Wedding"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="itemEvent">
                                    <Form.Label>Event</Form.Label>
                                    <Form.Select
                                        name="event"
                                        value={newItemEvent}
                                        onChange={(e) => setNewItemEvent(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Event</option>
                                        <option value="weddings">Weddings</option>
                                        <option value="birthday">Birthday</option>
                                        <option value="family">Family</option>
                                        <option value="business">Business</option>
                                        <option value="maternity">Maternity</option>
                                        <option value="newborn">Newborn</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="itemAuthor">
                                    <Form.Label>Author</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        value={newItemAuthor}
                                        onChange={(e) => setNewItemAuthor(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            {action === 'create' ? 'Saving...' : 'Updating...'}
                                        </>
                                    ) : (
                                        action === 'create' ? 'Save' : 'Update'
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* React Bootstrap Table */}
            <Card className="shadow-sm">
                <Card.Header className="bg-white py-3">
                    <Row className="align-items-center mb-3">
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
                    {/* Filter inputs */}
                    <Row className="g-2 align-items-center">
                        <Col md={3}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Filter by name"
                                value={filterTitle}
                                onChange={(e) => {
                                    setFilterTitle(e.target.value)
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Filter by author"
                                value={filterAuthor}
                                onChange={(e) => {
                                    setFilterAuthor(e.target.value)
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Filter by event"
                                value={filterEvent}
                                onChange={(e) => {
                                    setFilterEvent(e.target.value)
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-100"
                                onClick={handleClearFilters}
                                disabled={!filterAuthor && !filterEvent && !filterTitle}
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
                                <th>Name</th>
                                <th>Author</th>
                                <th>Event</th>
                                <th className="text-center" style={{ width: '160px' }}>
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
                                        <td>{item.name}</td>
                                        <td>{item.author}</td>
                                        <td>{item.event}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleEditItem(item)}
                                                    title="Edit Item"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteItem(Number(item.id))}
                                                    title="Delete Item"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
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