import React from 'react';
import { Pagination } from 'react-bootstrap';

export interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const PaginationBar: React.FC<PaginationProps> = ({
    totalItems = 0,
    itemsPerPage = 10,
    currentPage = 1,
    onPageChange,
}) => {
    // Pagination calculations
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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
                        onClick={() => onPageChange(i)}
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
                    onClick={() => onPageChange(1)}
                >
                    1
                </Pagination.Item>
            );

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

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
                        onClick={() => onPageChange(i)}
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
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        return pageItems;
    };

    return (
        <>
            <div className="text-muted small">
                Showing <strong>{indexOfFirstItem + 1}</strong> to{' '}
                <strong>{Math.min(indexOfLastItem, totalItems)}</strong> of{' '}
                <strong>{totalItems}</strong> entries
            </div>

            <Pagination className="mb-0">
                <Pagination.First
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                />
                <Pagination.Prev
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />

                {/* Render ellipsis-bounded page items */}
                {renderPaginationItems()}

                <Pagination.Next
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
                <Pagination.Last
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        </>
    );
};