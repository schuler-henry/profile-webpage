import { render as rtlRender } from '@testing-library/react';
import { JSXElementConstructor, ReactElement } from 'react';

async function render(
  ui: ReactElement<any, string | JSXElementConstructor<any>>,
  { ...renderOptions } = {},
) {
  const returnValues = {
    ...rtlRender(ui, {
      ...renderOptions,
    }),
  };

  return returnValues;
}

export * from '@testing-library/react';
export { render };
