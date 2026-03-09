import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import GuestUnits from './Units';

// Mock axios
jest.mock('axios');

// Mock DashboardLayout
jest.mock('../../components/DashboardLayout', () => {
  return function MockDashboardLayout({ children }) {
    return <div data-testid="dashboard-layout">{children}</div>;
  };
});

// Mock PropertyChatbot
jest.mock('../../components/PropertyChatbot', () => {
  return function MockPropertyChatbot() {
    return <div data-testid="property-chatbot">Chatbot</div>;
  };
});

// Mock useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/guest/units'
  })
}));

describe('GuestUnits - Responsive Grid', () => {
  const mockUnits = [
    {
      id: 1,
      name: 'Cozy Condo',
      type: 'condo',
      description: 'A beautiful condo in the city',
      capacity: 4,
      bedrooms: 2,
      pricePerNight: 2500,
      rating: 4.8,
      images: ['/image1.jpg'],
      hostId: 'host1',
      hostName: 'John Doe',
      hostCompanyName: 'Doe Properties'
    },
    {
      id: 2,
      name: 'Modern Apartment',
      type: 'apartment',
      description: 'Spacious apartment with great views',
      capacity: 6,
      bedrooms: 3,
      pricePerNight: 3500,
      rating: 4.9,
      images: ['/image2.jpg'],
      hostId: 'host2',
      hostName: 'Jane Smith'
    },
    {
      id: 3,
      name: 'Beach House',
      type: 'house',
      description: 'Relaxing beach house',
      capacity: 8,
      bedrooms: 4,
      pricePerNight: 5000,
      rating: 5.0,
      images: ['/image3.jpg'],
      hostId: 'host3',
      hostName: 'Bob Johnson'
    }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        success: true,
        units: mockUnits,
        page: 1,
        totalPages: 1,
        total: 3
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders unit cards grid with responsive classes', async () => {
    render(
      <BrowserRouter>
        <GuestUnits />
      </BrowserRouter>
    );

    // Wait for units to load
    await waitFor(() => {
      expect(screen.getByText('Cozy Condo')).toBeInTheDocument();
    });

    // Find the grid container
    const gridContainer = screen.getByText('Cozy Condo').closest('a').parentElement;

    // Verify responsive grid classes are present
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer).toHaveClass('grid-cols-1'); // Mobile: single column
    expect(gridContainer).toHaveClass('md:grid-cols-2'); // Tablet: two columns
    expect(gridContainer).toHaveClass('lg:grid-cols-3'); // Desktop: three columns
  });

  test('displays all unit cards in the grid', async () => {
    render(
      <BrowserRouter>
        <GuestUnits />
      </BrowserRouter>
    );

    // Wait for units to load
    await waitFor(() => {
      expect(screen.getByText('Cozy Condo')).toBeInTheDocument();
    });

    // Verify all three units are rendered
    expect(screen.getByText('Cozy Condo')).toBeInTheDocument();
    expect(screen.getByText('Modern Apartment')).toBeInTheDocument();
    expect(screen.getByText('Beach House')).toBeInTheDocument();
  });

  test('unit cards have proper structure for responsive layout', async () => {
    render(
      <BrowserRouter>
        <GuestUnits />
      </BrowserRouter>
    );

    // Wait for units to load
    await waitFor(() => {
      expect(screen.getByText('Cozy Condo')).toBeInTheDocument();
    });

    // Get all unit card links
    const unitCards = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href')?.startsWith('/guest/units/')
    );

    // Verify we have 3 unit cards
    expect(unitCards).toHaveLength(3);

    // Verify each card has proper classes for responsive behavior
    unitCards.forEach(card => {
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('shadow-sm');
    });
  });

  test('grid maintains gap spacing', async () => {
    render(
      <BrowserRouter>
        <GuestUnits />
      </BrowserRouter>
    );

    // Wait for units to load
    await waitFor(() => {
      expect(screen.getByText('Cozy Condo')).toBeInTheDocument();
    });

    // Find the grid container
    const gridContainer = screen.getByText('Cozy Condo').closest('a').parentElement;

    // Verify gap class is present
    expect(gridContainer).toHaveClass('gap-6');
  });

  test('handles empty units array gracefully', async () => {
    axios.get.mockResolvedValue({
      data: {
        success: true,
        units: [],
        page: 1,
        totalPages: 1,
        total: 0
      }
    });

    render(
      <BrowserRouter>
        <GuestUnits />
      </BrowserRouter>
    );

    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No units found matching your criteria.')).toBeInTheDocument();
    });

    // Verify grid is not rendered when there are no units
    const gridContainers = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    expect(gridContainers.length).toBe(0);
  });

  test('grid container has proper margin bottom', async () => {
    render(
      <BrowserRouter>
        <GuestUnits />
      </BrowserRouter>
    );

    // Wait for units to load
    await waitFor(() => {
      expect(screen.getByText('Cozy Condo')).toBeInTheDocument();
    });

    // Find the grid container
    const gridContainer = screen.getByText('Cozy Condo').closest('a').parentElement;

    // Verify margin bottom class
    expect(gridContainer).toHaveClass('mb-8');
  });
});

describe('GuestUnits - Responsive Grid Requirements', () => {
  const mockUnits = [
    {
      id: 1,
      name: 'Test Unit 1',
      type: 'condo',
      description: 'Test description',
      capacity: 4,
      bedrooms: 2,
      pricePerNight: 2500,
      rating: 4.8,
      images: ['/image1.jpg'],
      hostId: 'host1',
      hostName: 'Test Host'
    }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        success: true,
        units: mockUnits,
        page: 1,
        totalPages: 1,
        total: 1
      }
    });
  });

  test('validates Requirement 10.1: Single-column layout on mobile', async () => {
    render(
      <BrowserRouter>
        <GuestUnits />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Unit 1')).toBeInTheDocument();
    });

    const gridContainer = screen.getByText('Test Unit 1').closest('a').parentElement;
    
    // Requirement 10.1: THE Guest_Pages SHALL display unit cards in single-column layout on Mobile_Device
    expect(gridContainer).toHaveClass('grid-cols-1');
  });

  test('validates Requirement 10.2: Two-column layout on tablet', async () => {
    render(
      <BrowserRouter>
        <GuestUnits />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Unit 1')).toBeInTheDocument();
    });

    const gridContainer = screen.getByText('Test Unit 1').closest('a').parentElement;
    
    // Requirement 10.2: WHEN unit cards are displayed on Tablet_Device, THE Guest_Pages SHALL show 2-column grid layouts
    expect(gridContainer).toHaveClass('md:grid-cols-2');
  });

  test('validates Requirement 10.3: Three-column layout on desktop', async () => {
    render(
      <BrowserRouter>
        <GuestUnits />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Unit 1')).toBeInTheDocument();
    });

    const gridContainer = screen.getByText('Test Unit 1').closest('a').parentElement;
    
    // Requirement 10.3: WHEN unit cards are displayed on Desktop_Device, THE Guest_Pages SHALL show 3 or 4-column grid layouts
    expect(gridContainer).toHaveClass('lg:grid-cols-3');
  });

  test('validates Requirement 14.1: Units page displays single-column on mobile', async () => {
    render(
      <BrowserRouter>
        <GuestUnits />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Unit 1')).toBeInTheDocument();
    });

    const gridContainer = screen.getByText('Test Unit 1').closest('a').parentElement;
    
    // Requirement 14.1: THE Units_Page SHALL display unit cards in single-column layout on Mobile_Device
    expect(gridContainer).toHaveClass('grid-cols-1');
  });
});
