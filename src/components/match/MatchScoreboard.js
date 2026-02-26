import React from 'react';
import PropTypes from 'prop-types';

const MatchScoreboard = ({ homeTeam, awayTeam, homeScore, awayScore, currentMinute, matchType, league, allEvents, showGoalOverlay }) => {
  const keyEvents = (allEvents || []).filter(e => ['goal', 'yellow', 'red'].includes(e.type));

  return (
    <div style={{
      background: 'linear-gradient(135deg, #2c466b, #1a365d)',
      padding: '15px 20px',
      borderRadius: '8px 8px 0 0',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '6px' }}>
        {homeTeam} vs {awayTeam}
      </div>
      <div style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.8 }}>
        {matchType === 'friendly' ? 'Hazırlık Maçı' : league} - {currentMinute} dk
      </div>

      {/* Skor kutusu */}
      <div style={{
        background: showGoalOverlay ? '#FFD700' : '#f5f5f5',
        padding: '12px',
        borderRadius: '8px',
        transition: 'background 0.3s, transform 0.3s',
        transform: showGoalOverlay ? 'scale(1.08)' : 'scale(1)',
        marginBottom: '10px'
      }}>
        <div style={{
          fontSize: '32px', fontWeight: 'bold',
          color: showGoalOverlay ? '#1a365d' : 'var(--blue)',
          transition: 'color 0.3s'
        }}>
          {homeScore} - {awayScore}
        </div>
      </div>

      {/* Zaman çizelgesi */}
      <div style={{
        position: 'relative', height: '16px', background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px', overflow: 'hidden'
      }}>
        {/* İlerleme dolgusu */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          width: `${Math.min(100, (currentMinute / 90) * 100)}%`,
          background: 'rgba(255,255,255,0.15)',
          transition: 'width 0.3s',
          borderRadius: '8px'
        }} />
        {/* Devre ayırıcı */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, width: '1px',
          height: '100%', background: 'rgba(255,255,255,0.3)'
        }} />
        {/* Olay noktaları */}
        {keyEvents.map((e, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(e.minute / 90) * 100}%`,
            top: '50%', transform: 'translate(-50%, -50%)',
            width: e.type === 'goal' ? '10px' : '6px',
            height: e.type === 'goal' ? '10px' : '6px',
            borderRadius: '50%',
            background: e.type === 'goal' ? '#FFD700' : e.type === 'red' ? '#ff4444' : '#ffeb3b',
            border: '1px solid rgba(0,0,0,0.2)',
            zIndex: 2
          }} />
        ))}
        {/* Dakika etiketleri */}
        <span style={{ position: 'absolute', left: '3px', top: '1px', fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>0</span>
        <span style={{ position: 'absolute', left: '50%', top: '1px', fontSize: '8px', color: 'rgba(255,255,255,0.4)', transform: 'translateX(-50%)' }}>45</span>
        <span style={{ position: 'absolute', right: '3px', top: '1px', fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>90</span>
      </div>
    </div>
  );
};

MatchScoreboard.propTypes = {
  homeTeam: PropTypes.string.isRequired,
  awayTeam: PropTypes.string.isRequired,
  homeScore: PropTypes.number.isRequired,
  awayScore: PropTypes.number.isRequired,
  currentMinute: PropTypes.number.isRequired,
  matchType: PropTypes.string,
  league: PropTypes.string,
  allEvents: PropTypes.array,
  showGoalOverlay: PropTypes.bool
};

export default MatchScoreboard;
