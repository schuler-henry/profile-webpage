import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { expect } from '@jest/globals';

describe('Footer', () => {
  it('test', async () => {
    render(<Footer />);

    expect(screen.getByText('Copyright © 2023')).toBeInTheDocument();
  });
});
