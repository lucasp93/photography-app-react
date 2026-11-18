import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DynamicTable } from './ItemsTable';

describe('DynamicTable Component', () => {
    test('renders initial items in the table', () => {
        render(<DynamicTable />);

        expect(screen.getByText('Camera Lens 50mm')).toBeInTheDocument();
        expect(screen.getByText('Gear')).toBeInTheDocument();
        expect(screen.getByText('Tripod Carbon')).toBeInTheDocument();
        expect(screen.getByText('Accessories')).toBeInTheDocument();
    });

    test('adds a new item and resets form fields on submit', () => {
        render(<DynamicTable />);

        const nameInput = screen.getByLabelText('Item Name');
        const categoryInput = screen.getByLabelText('Category');
        const quantityInput = screen.getByLabelText('Quantity');

        fireEvent.change(nameInput, { target: { value: 'Memory Card' } });
        fireEvent.change(categoryInput, { target: { value: 'Storage' } });
        fireEvent.change(quantityInput, { target: { value: '4' } });

        fireEvent.submit(screen.getByRole('button', { name: '+ Add Item' }).closest('form')!);

        expect(screen.getByText('Memory Card')).toBeInTheDocument();
        expect(screen.getByText('Storage')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();

        expect(nameInput).toHaveValue('');
        expect(categoryInput).toHaveValue('');
        expect(quantityInput).toHaveValue(1);
    });

    test('does not add item when name or category is whitespace', () => {
        render(<DynamicTable />);

        fireEvent.change(screen.getByLabelText('Item Name'), { target: { value: '   ' } });
        fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Storage' } });
        fireEvent.submit(screen.getByRole('button', { name: '+ Add Item' }).closest('form')!);

        expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
    });

    test('deletes items and shows empty state message when all items are removed', () => {
        render(<DynamicTable />);

        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButtons[0]);
        expect(screen.queryByText('Camera Lens 50mm')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
        expect(screen.queryByText('Tripod Carbon')).not.toBeInTheDocument();
        expect(screen.getByText('No items in table. Add one above!')).toBeInTheDocument();
    });
});
