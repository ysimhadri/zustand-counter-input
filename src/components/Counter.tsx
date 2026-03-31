import React from 'react';
import { useStore } from '../store/useStore';
import './Counter.css';

/**
 * Counter component that displays an interactive counter with increment, decrement, and reset functionality.
 * 
 * This component uses Zustand store hooks to manage counter state and operations.
 * 
 * @component
 * @returns {React.ReactElement} A card component displaying:
 *   - Current count value with dynamic scale animation based on absolute count
 *   - Decrease button that calls decrement() to reduce count by 1
 *   - Reset button that calls resetCount() to set count back to 0
 *   - Increase button that calls increment() to increase count by 1
 * 
 * @remarks
 * - `increment` and `decrement` are Zustand store actions that modify the global count state
 * - The count value dynamically scales up to 150% based on its absolute value (max 0.5 scale increase)
 * - Each button action triggers a re-render via Zustand's reactive state management
 * 
 * @example
 * ```tsx
 * <Counter />
 * ```
 */
export const Counter: React.FC = () => {
  const { count, increment, decrement, resetCount } = useStore();

  return (
    <div className="card counter-card">
      <div className="card-header">
        <h2>Smart Counter</h2>
        <span className="badge">State</span>
      </div>

      <div className="counter-display">
        <div className="count-value-container">
          <span className="count-value" style={{ transform: `scale(${1 + Math.min(Math.abs(count) * 0.05, 0.5)})` }}>
            {count}
          </span>
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={decrement}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
          Decrease
        </button>
        <button className="btn btn-danger" onClick={resetCount}>Reset</button>
        <button className="btn btn-primary" onClick={increment}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Increase
        </button>
      </div>
    </div>
  );
};
