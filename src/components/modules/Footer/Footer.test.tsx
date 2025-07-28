import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('test', async () => {
    render(<Footer />);

    expect(screen.getByText('© 2023', { exact: false })).toBeInTheDocument();
  });
});
