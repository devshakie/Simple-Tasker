import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Mock routing context
import Login from './login';

// Mock the navigate function from react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('renders the login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('displays error message on failed login', async () => {
    // Mock the fetch API to return a failed response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Unauthorized',
      } as Response)
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for the async error message to appear
    await waitFor(() =>
      expect(screen.getByText(/Login failed. Please try again/i)).toBeInTheDocument()
    );
  });

  test('displays success message and redirects on successful login', async () => {
    // Mock the fetch API to return a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'mockedToken' }),
      } as Response)
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'correctpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for the success message to appear
    await waitFor(() =>
      expect(
        screen.getByText(/Login successful! Redirecting to dashboard/i)
      ).toBeInTheDocument()
    );

    // Verify that the navigate function is called
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard')
    );
  });
});