import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TripEditor from './TripEditor';
import { fetchWeather } from '../services/weatherService';

// Mock the weather service
jest.mock('../services/weatherService', () => ({
    fetchWeather: jest.fn()
}));

const mockLocation = {
    id: 1,
    name: 'Tokyo',
    startDate: '2025-11-01',
    endDate: '2025-11-05',
    type: 'stay',
    color: '#4ECDC4',
    activities: ['Sightseeing'],
    transportDetails: [],
    accommodationDetails: [],
    dailyItinerary: {},
    dailyWeather: {},
    coords: [35.6762, 139.6503]
};

test('renders TripEditor and submits form', () => {
    const handleSave = jest.fn();
    const handleCancel = jest.fn();
    const handleDelete = jest.fn();

    render(
        <TripEditor
            location={mockLocation}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
        />
    );

    // Check if destination name input is present
    const nameInput = screen.getByDisplayValue('Tokyo');
    expect(nameInput).toBeInTheDocument();

    // Change name
    fireEvent.change(nameInput, { target: { value: 'Tokyo Updated' } });

    // Submit form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Tokyo Updated'
    }));
});

test('fetches weather when Auto-Fetch is clicked', async () => {
    fetchWeather.mockResolvedValue('☀️ 20°C');
    const handleSave = jest.fn();

    render(<TripEditor location={mockLocation} onSave={handleSave} onCancel={() => { }} onDelete={() => { }} />);

    // Switch to Daily Plan tab
    fireEvent.click(screen.getByText('Daily Plan'));

    // Find Auto button and click
    const autoButton = screen.getByText('Auto');
    fireEvent.click(autoButton);

    // Wait for weather to be updated in input
    await waitFor(() => {
        expect(fetchWeather).toHaveBeenCalled();
        expect(screen.getByDisplayValue('☀️ 20°C')).toBeInTheDocument();
    });
});
