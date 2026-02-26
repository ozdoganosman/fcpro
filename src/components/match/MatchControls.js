import React from 'react';
import PropTypes from 'prop-types';

const MatchControls = ({ isPlaying, matchEnded, playbackSpeed, onTogglePlay, onFastForward, onContinue, onSpeedChange }) => {
  if (matchEnded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button
          className="fc-btn"
          onClick={onContinue}
          style={{
            background: 'var(--win)', color: 'white', padding: '10px 20px',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold'
          }}
        >
          Devam Et
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
      <button
        className="fc-btn"
        onClick={onTogglePlay}
        style={{
          background: isPlaying ? 'var(--loss)' : 'var(--win)', color: 'white',
          padding: '10px 20px', border: 'none', borderRadius: '6px',
          cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
        }}
      >
        {isPlaying ? 'Duraklat' : 'Başlat'}
      </button>

      {/* Hız kontrolleri */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 4].map(speed => (
          <button
            key={speed}
            className="fc-btn"
            onClick={() => onSpeedChange(speed)}
            style={{
              background: playbackSpeed === speed ? 'var(--gold)' : '#888',
              color: 'white', padding: '8px 12px', border: 'none',
              borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
              fontWeight: playbackSpeed === speed ? 'bold' : 'normal',
              minWidth: '36px', transition: 'background 0.2s'
            }}
          >
            {speed}x
          </button>
        ))}
      </div>

      <button
        className="fc-btn"
        onClick={onFastForward}
        style={{
          background: 'var(--blue)', color: 'white', padding: '10px 20px',
          border: 'none', borderRadius: '6px', cursor: 'pointer',
          fontSize: '14px', fontWeight: 'bold'
        }}
      >
        Sona Atla
      </button>
    </div>
  );
};

MatchControls.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  matchEnded: PropTypes.bool.isRequired,
  playbackSpeed: PropTypes.number.isRequired,
  onTogglePlay: PropTypes.func.isRequired,
  onFastForward: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  onSpeedChange: PropTypes.func.isRequired
};

export default MatchControls;
