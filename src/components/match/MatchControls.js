import React from 'react';
import PropTypes from 'prop-types';

const MatchControls = ({ isPlaying, matchEnded, onTogglePlay, onFastForward, onContinue }) => {
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
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
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
  onTogglePlay: PropTypes.func.isRequired,
  onFastForward: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired
};

export default MatchControls;
