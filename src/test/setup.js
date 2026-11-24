import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Sin globals de Vitest, React Testing Library no limpia el DOM por su cuenta
afterEach(() => {
  cleanup();
});
