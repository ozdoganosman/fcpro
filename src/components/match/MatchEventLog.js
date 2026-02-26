import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// ========== OLAY İKONLARI ==========

const getEventIcon = (type) => {
  switch (type) {
    case 'goal': return '⚽';
    case 'yellow': return '🟨';
    case 'red': return '🟥';
    case 'injury': return '🏥';
    case 'substitution': return '🔄';
    case 'half': return '⏸️';
    case 'position': return '🎯';
    case 'corner': return '🚩';
    case 'position_lost': return '❌';
    case 'save': return '🧤';
    case 'offside': return '🚫';
    case 'foul': return '⚠️';
    case 'throw_in': return '📍';
    case 'card': return '🟡';
    case 'assist': return '🎯';
    case 'action': return '⚡';
    default: return '📝';
  }
};

// ========== OLAY STİLLERİ ==========

const getEventStyle = (event) => {
  const base = {
    display: 'flex', alignItems: 'center', padding: '5px 6px',
    fontSize: '11px', borderRadius: '3px', marginBottom: '2px',
    transition: 'background 0.3s'
  };

  switch (event.type) {
    case 'goal':
      return { ...base, background: '#fff8e1', borderLeft: '3px solid #FFD700', fontWeight: 'bold', fontSize: '12px' };
    case 'yellow':
      return { ...base, background: '#fffde7', borderLeft: '3px solid #ffeb3b' };
    case 'red':
      return { ...base, background: '#ffebee', borderLeft: '3px solid #f44336', fontWeight: 'bold' };
    case 'injury':
      return { ...base, background: '#fce4ec', borderLeft: '3px solid #e91e63' };
    case 'substitution':
      return { ...base, background: '#e8f5e9', borderLeft: '3px solid #4CAF50' };
    case 'half':
      return { ...base, background: '#e3f2fd', borderLeft: '3px solid var(--blue)', fontWeight: 'bold', justifyContent: 'center' };
    case 'position':
      return { ...base, background: event.team === 'home' ? '#e8eaf6' : '#fff3e0', borderLeft: `3px solid ${event.team === 'home' ? 'var(--blue)' : '#ff6b6b'}` };
    case 'save':
      return { ...base, background: '#e0f7fa', borderLeft: '3px solid #00bcd4' };
    case 'corner':
      return { ...base, background: '#f3e5f5', borderLeft: '3px solid #9c27b0' };
    case 'offside':
      return { ...base, background: '#fff3e0', borderLeft: '3px solid #ff9800' };
    case 'foul':
      return { ...base, background: '#fff8e1', borderLeft: '3px solid #ffc107' };
    case 'throw_in':
      return { ...base, background: '#f5f5f5', borderLeft: '3px solid #9e9e9e' };
    default:
      return { ...base, background: 'transparent', borderLeft: '3px solid #e0e0e0' };
  }
};

// ========== ANA BİLEŞEN ==========

const MatchEventLog = ({ events }) => {
  useEffect(() => {
    const container = document.querySelector('.match-events-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [events]);

  return (
    <div style={{
      background: '#f9f9f9', borderRadius: '8px', padding: '10px',
      display: 'flex', flexDirection: 'column', height: '100%'
    }}>
      <h5 style={{
        margin: '0 0 6px 0', textAlign: 'center',
        color: 'var(--blue)', fontSize: '12px', fontWeight: 'bold'
      }}>
        MAÇ OLAYLARI
      </h5>

      <div
        className="match-events-container"
        style={{
          flex: 1, overflowY: 'auto',
          fontSize: '12px', lineHeight: '1.4', scrollBehavior: 'smooth'
        }}
      >
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            Henüz olay yok...
          </div>
        ) : (
          events.map((event, index) => (
            <div key={index} style={getEventStyle(event)}>
              <span style={{
                fontWeight: 'bold', color: 'var(--blue)',
                marginRight: '6px', minWidth: '22px', fontSize: '10px'
              }}>
                {event.minute}&apos;
              </span>
              <span style={{ marginRight: '6px', fontSize: '13px' }}>
                {getEventIcon(event.type)}
              </span>
              <span style={{ color: '#333', flex: 1, fontSize: '11px' }}>
                {event.description}
                {event.type === 'position' && event.step && (
                  <span style={{
                    fontSize: '9px', color: '#888', marginLeft: '4px',
                    background: '#e0e0e0', padding: '1px 4px', borderRadius: '3px'
                  }}>
                    {event.step}/{event.totalSteps}
                  </span>
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

MatchEventLog.propTypes = {
  events: PropTypes.array.isRequired
};

export default MatchEventLog;
