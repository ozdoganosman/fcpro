import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const getEventIcon = (type) => {
  switch (type) {
    case 'goal': return '⚽';
    case 'card': return '🟡';
    case 'yellow': return '🟨';
    case 'red': return '🟥';
    case 'injury': return '🏥';
    case 'substitution': return '🔄';
    case 'assist': return '🎯';
    case 'action': return '⚡';
    case 'half': return '⏸️';
    case 'position': return '🎯';
    case 'corner': return '🚩';
    case 'position_lost': return '❌';
    default: return '📝';
  }
};

const MatchEventLog = ({ events }) => {
  useEffect(() => {
    const container = document.querySelector('.match-events-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [events]);

  return (
    <div style={{
      background: '#f9f9f9', borderRadius: '8px', padding: '15px'
    }}>
      <h5 style={{
        margin: '0 0 15px 0', textAlign: 'center',
        color: 'var(--blue)', fontSize: '14px', fontWeight: 'bold'
      }}>
        MAÇ OLAYLARI
      </h5>
      <div
        className="match-events-container"
        style={{
          height: '350px', overflowY: 'auto',
          fontSize: '12px', lineHeight: '1.4', scrollBehavior: 'smooth'
        }}
      >
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            Henüz olay yok...
          </div>
        ) : (
          events.map((event, index) => (
            <div key={index} style={{
              display: 'flex', alignItems: 'center', padding: '6px',
              borderBottom: '1px solid #eee', fontSize: '11px',
              background: event.type === 'position' ? '#f0f8ff' : 'transparent',
              borderLeft: event.type === 'position' ? '3px solid var(--blue)' : 'none'
            }}>
              <span style={{
                fontWeight: 'bold', color: 'var(--blue)',
                marginRight: '8px', minWidth: '25px'
              }}>
                {event.minute}&apos;
              </span>
              <span style={{ marginRight: '8px', fontSize: '14px' }}>
                {getEventIcon(event.type)}
              </span>
              <span style={{ color: '#333', flex: 1 }}>
                {event.description}
                {event.type === 'position' && event.step && (
                  <span style={{
                    fontSize: '10px', color: '#666', marginLeft: '5px',
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
