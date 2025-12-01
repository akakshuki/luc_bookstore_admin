import { render } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  // Mock localStorage to prevent redirect
  const mockLocalStorage = {
    getItem: jest.fn(() => JSON.stringify({ roles: [{ id: 1 }] })),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  const { container } = render(<App />);
  expect(container).toBeTruthy();
});
