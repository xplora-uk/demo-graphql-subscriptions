import { render, screen } from '@testing-library/react';
import App from './App';

test('renders demo text', () => {
  render(<App />);
  const linkElement = screen.getByText(/demo/i);
  expect(linkElement).toBeInTheDocument();
});
