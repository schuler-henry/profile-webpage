import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Impressum', () => {
  it('should contain my personal data', () => {
    render(<Page />);

    expect(screen.getAllByText('Henry Schuler')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Kastellstraße 69/1')[0]).toBeInTheDocument();
    expect(screen.getAllByText('88316 Isny')[0]).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /contact@henryschuler\.de/i }),
    ).toHaveAttribute('href', 'mailto:contact@henryschuler.de');
    expect(
      screen.getByRole('link', { name: /\+49 163 7292914/i }),
    ).toHaveAttribute('href', 'tel:+491637292914');
  });
});
