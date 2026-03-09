import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import Units from '../Units';

jest.mock('axios');

// Mock useAuth hook
jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock the AuthModal so we can detect when it's opened
jest.mock('../../../components/AuthModal', () => ({ isOpen }) => (
  isOpen ? <div data-testid="auth-modal">AuthModal</div> : null
));

describe('Units page - booking auth modal flow', () => {
  const mockUnits = [
    {
      id: '1',
      name: 'Test Unit',
      type: 'condo',
      description: 'Nice place',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      pricePerNight: 1200,
      rating: 4.5,
      reviewCount: 10,
      images: ['/img.jpg']
    }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { units: mockUnits, page: 1, totalPages: 1, total: 1 } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('opens AuthModal when Book is clicked and user is not authenticated', async () => {
    useAuth.mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <Units />
      </BrowserRouter>
    );

    // wait for unit to render
    await waitFor(() => expect(screen.getByText('Test Unit')).toBeInTheDocument());

    const bookButton = screen.getByText('Book');
    fireEvent.click(bookButton);

    // Auth modal should be shown
    expect(await screen.findByTestId('auth-modal')).toBeInTheDocument();
  });
});
