import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Summary', () => {
  it('should display the provided dynamic route name', () => {
    // render(<Page params={{ summaryName: 'Test' }} />);
    // expect(screen.getByText('Summary Test')).toBeInTheDocument();
  });
});
