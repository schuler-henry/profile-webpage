import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Summaries', () => {
  it('should render (placeholder)', () => {
    render(<Page />);

    expect(screen.getByText('Summaries')).toBeInTheDocument();
  });
});
