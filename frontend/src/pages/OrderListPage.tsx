import React, { useState, useCallback, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';
import type { Order } from '../interfaces/interfaces';
import { Table, Button, Form, Card, Row, Col, Pagination } from 'react-bootstrap';
import api from '../services/api';
import { createOrder, deleteItem } from '../services/utils';
import { PhotoListModal } from '../components/PhotoListModal';

export const OrderListPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<Order[]>([]);

    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    // Filter State
    const [filterOrderNumber, setFilterOrderNumber] = useState<string>('');
    const [filterClientName, setFilterClientName] = useState<string>('');
    const [filterClientEmail, setFilterClientEmail] = useState<string>('');

    const handleClearFilters = () => {
        setFilterOrderNumber('');
        setFilterClientName('');
        setFilterClientEmail('');
        setCurrentPage(1);
    };

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
    // const [newItemOrderNumber, setNewItemOrderNumber] = useState<string>('');
    // const [newItemClientName, setNewItemClientName] = useState<string>('');
    // const [newItemClientContact, setNewItemClientContact] = useState<string>('');
    // const [newItemClientEmail, setNewItemClientEmail] = useState<string>('');
    // const [newItemPrice, setNewItemPrice] = useState<number>(0);
    //const [newItemPhotos, setNewItemPhotos] = useState<string>('');

    // Add Item Handler
    // const handleAddItem = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!newItemClientName.trim() || !newItemOrderNumber.trim()) return;

    //     const newItem: Order = {
    //         id: Date.now(),
    //         order_number: newItemOrderNumber,
    //         client_name: newItemClientName,
    //         client_contact: newItemClientContact,
    //         client_email: newItemClientEmail,
    //         price: newItemPrice,
    //         photos: [],
    //     };

    //     // Create new album
    //     const response = await createOrder(newItem);
    //     if (response) {
    //         setStatus('success');
    //         setItems((prev) => [...prev, newItem]);
    //     } else {
    //         setStatus('error');
    //     }

    //     // Reset Form Fields
    //     setNewItemOrderNumber('');
    //     setNewItemClientName('');
    //     setNewItemClientContact('');
    //     setNewItemClientEmail('');
    //     setNewItemPrice(0);
    // };

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

    // Filter items by Order Number, Client Name, and Email
    const filteredItems = items.filter((item) => {
        const matchesOrder = (item.order_number ?? '')
            .toLowerCase()
            .includes(filterOrderNumber.trim().toLowerCase());
        const matchesClient = (item.client_name ?? '')
            .toLowerCase()
            .includes(filterClientName.trim().toLowerCase());
        const matchesEmail = (item.client_email ?? '')
            .toLowerCase()
            .includes(filterClientEmail.trim().toLowerCase());

        return matchesOrder && matchesClient && matchesEmail;
    });

    // 2. Pagination Calculations
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

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
            {/* React Bootstrap Table */}
            <Card className="shadow-sm">
                <Card.Header className="bg-white py-3">
                    <Row className="align-items-center mb-3">
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

                    {/* Filter Inputs */}
                    <Row className="g-2 align-items-center">
                        <Col md={3}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Filter by Order # (e.g. ORD-...)"
                                value={filterOrderNumber}
                                onChange={(e) => {
                                    setFilterOrderNumber(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Filter by Client name..."
                                value={filterClientName}
                                onChange={(e) => {
                                    setFilterClientName(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Filter by Email..."
                                value={filterClientEmail}
                                onChange={(e) => {
                                    setFilterClientEmail(e.target.value);
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
                                disabled={!filterOrderNumber && !filterClientName && !filterClientEmail}
                            >
                                Clear Filters
                            </Button>
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
                            {filteredItems.length === 0 ? (
                                <tr key="noorders-1">
                                    <td colSpan={8} className="text-center text-muted py-4">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr key={item.order_number}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.order_number ?? '—'}</td>
                                        <td>{item.client_name ?? '—'}</td>
                                        <td>{item.client_email ?? '—'}</td>
                                        <td>{item.client_contact ?? '—'}</td>
                                        <td>{item.price ?? '—'}</td>
                                        <td>
                                            <Row className="align-items-center justify-content-center mt-2">
                                                <Col md={6} className="mb-2">
                                                    <PhotoListModal photos={item.photos} />
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