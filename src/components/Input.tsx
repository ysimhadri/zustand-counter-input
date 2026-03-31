import React from 'react';
import { useStore } from '../store/useStore';
import './Input.css';

export const Input: React.FC = () => {
  const { text, setText, resetText } = useStore();

  return (
    <div className="card input-card">
      <div className="card-header">
        <h2>Live Input</h2>
        <span className="badge">Sync</span>
      </div>
      
      <div className="input-group">
        <div className="input-wrapper">
          <input 
            type="text" 
            className="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something amazing..."
          />
          {text && (
            <button 
              className="btn-clear" 
              onClick={resetText}
              aria-label="Clear text"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="text-display">
        <div className="preview-label">Live Preview</div>
        <div className="preview-content">
          {text ? (
            <span className="preview-text">{text}</span>
          ) : (
            <span className="placeholder-text">Waiting for inspiration...</span>
          )}
        </div>
      </div>
    </div>
  );
};
