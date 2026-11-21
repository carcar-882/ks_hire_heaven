import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeAll } from 'vitest';
import '@testing-library/jest-dom';
import App from './App';

beforeAll(() => {
  global.IntersectionObserver = class {
    constructor() { }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  };
});

describe('App Smoke Test', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Cloud solutions for a smarter tomorrow/i)).toBeInTheDocument();
  });
});
