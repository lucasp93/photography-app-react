import React, { useState, useCallback, useEffect } from 'react';
import { ApiUrls } from '../utils/ApiUrls';
import type { Photo, Album } from '../interfaces/interfaces';
import { Table, Button, Form, Card, Row, Col } from 'react-bootstrap';
import api from '../services/api';
import { createPhoto, deletePhoto } from '../services/photoService';
import { PaginationBar } from '../components/PaginationBar';

export const PhotoListPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<Photo[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);

    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    // 2. Form Input State
    const [newItemName, setNewItemName] = useState<string>('');
    const [newItemAuthor, setNewItemAuthor] = useState<string>('');
    const [newItemFeatured, setNewItemFeatured] = useState<boolean>(false);
    const [newItemUrl, setNewItemUrl] = useState<string>('');
    const [newItemAlbumId, setNewItemAlbumId] = useState<string>('');

    // Filter state
    const [filterName, setFilterName] = useState<string>('');
    const [filterAuthor, setFilterAuthor] = useState<string>('');
    const [filterEvent, setFilterEvent] = useState<string>('');

    const handleClearFilters = () => {
        setFilterName('');
        setFilterAuthor('');
        setFilterEvent('');
        setCurrentPage(1);
    };

    // Get target items from db
    const fetchItems = useCallback(async () => {
        const url = `${ApiUrls.getPhotos}`;
        try {
            const data = await api.apiGet<Photo[]>(url);
            setItems(data);
            setStatus('success');
        } catch (err) {
            setItems([]);
            setStatus('error');
            setError('Failed to fetch items: ' + err);
        }
    }, []);

    // Get photos' album info
    const fetchAlbumsInfo = useCallback(async () => {
        const url = `${ApiUrls.getAlbums}`;
        try {
            const data = await api.apiGet<Album[]>(url);
            setAlbums(data);
        } catch (err) {
            console.error(`Failed to fetch albums for photos`, err);
            setAlbums([]);
        }
    }, []);

    useEffect(() => {
        setStatus('loading');
        Promise.all([fetchItems(), fetchAlbumsInfo()]).catch(() => setStatus('error'));
    }, [fetchItems, fetchAlbumsInfo]);

    // Filter items by username, email, first name and last name
    const filteredItems = items.filter((item) => {
        const matchesName = (item.name ?? '')
            .toLowerCase()
            .includes(filterName.trim().toLowerCase());
        const matchesAuthor = (item.author ?? '')
            .toLowerCase()
            .includes(filterAuthor.trim().toLowerCase());
        const matchEvent = (item.album_name ?? '')
            .toLowerCase()
            .includes(filterEvent.trim().toLowerCase());

        return matchesAuthor && matchesName && matchEvent;
    });

    // Pagination Calculations
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Add Item Handler
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim() || !newItemAuthor.trim()) return;

        const newAlbum = albums.find((album) => String(album.id) === newItemAlbumId) || null;

        const newItem: Photo = {
            id: Date.now(),
            name: newItemName,
            author: newItemAuthor,
            featured: newItemFeatured,
            is_favorited: false,
            url: newItemUrl,
            album_id: newItemAlbumId,
            album: newAlbum,
            album_name: newAlbum?.name ?? '',
            album_author: newAlbum?.author ?? '',
            size: '',
        };

        const response = await createPhoto(newItem);
        if (response) {
            setStatus('success');
            setItems((prev) => [...prev, newItem]);
        } else {
            setStatus('error');
            setError('Failed to create photo');
        }

        // Reset Form Fields
        setNewItemName('');
        setNewItemAuthor('');
        setNewItemFeatured(false);
        setNewItemUrl('');
        setNewItemAlbumId('');
    };

    // Delete Item Handler
    const handleDeleteItem = async (id: number) => {
        const response = await deletePhoto(id);

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

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to page 1 on limit change
    };

    if (status === 'loading') return <p className="p-4">Loading items...</p>;
    if (status === 'error') return <p className="p-4 text-danger">Error: {error}</p>;
    return (
        <div className="container py-4">
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Card.Title className="mb-3">Add New Photo</Card.Title>
                    {/* Add Item Form */}
                    <Form onSubmit={handleAddItem}>
                        <Row className="g-3 align-items-end">
                            <Col md={4}>
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
                            <Col md={4}>
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
                            <Col md={4}>
                                <Form.Group controlId="itemUrl">
                                    <Form.Label>Url</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. www.example.com"
                                        value={newItemUrl}
                                        onChange={(e) => setNewItemUrl(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="itemAlbum">
                                    <Form.Label>Album</Form.Label>
                                    <Form.Select
                                        value={newItemAlbumId}
                                        onChange={(e) => setNewItemAlbumId(e.target.value)}
                                    >
                                        <option value="">Select Album</option>
                                        {albums.map((album) => (
                                            <option key={album.id} value={album.id}>
                                                {album.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={5}>
                                <Form.Group className="mb-3 flex flex-row justify-left" controlId="itemFeatured">
                                    <Form.Label>Featured</Form.Label>
                                    <Form.Check
                                        className="ml-2"
                                        type="checkbox"
                                        name="featured"
                                        checked={newItemFeatured}
                                        onChange={(e) => setNewItemFeatured(e.target.checked)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Button variant="primary" type="submit" className="w-100">
                                    + Add Item
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Table Section */}
            <Card className="shadow-sm">
                <Card.Header className="bg-white py-3">
                    <Row className="align-items-center mb-3">
                        <Col>
                            <h5 className="mb-0">Photos</h5>
                        </Col>
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
                                value={filterName}
                                onChange={(e) => {
                                    setFilterName(e.target.value)
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
                                placeholder="Filter by album"
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
                                disabled={!filterAuthor && !filterEvent && !filterName}
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
                                <th>Album</th>
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
                                        <td>{item.name ?? '—'}</td>
                                        <td>{item.author ?? '—'}</td>
                                        <td>
                                            {
                                                albums.find((album) => String(album.id) === String(item.album))?.name ?? '—'
                                            }
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