import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Footer', () => {
  it('test', async () => {
    render(<Page />);

    expect(screen.getByText('Hallo')).toBeInTheDocument();
  });
});
