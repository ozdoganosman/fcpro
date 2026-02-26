import React from 'react';
import PropTypes from 'prop-types';

const MatchScoreboard = ({ homeTeam, awayTeam, homeScore, awayScore, currentMinute, matchType, league }) => (
  <div style={{
    background: 'linear-gradient(135deg, #2c466b, #1a365d)',
    padding: '20px',
    borderRadius: '8px 8px 0 0',
    color: 'white',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
      {homeTeam} vs {awayTeam}
    </div>
    <div style={{ fontSize: '16px', marginBottom: '10px' }}>
      {matchType === 'friendly' ? 'Hazırlık Maçı' : league} - {currentMinute} dk
    </div>
    <div style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '8px',
      color: 'var(--blue)'
    }}>
      <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
        {homeScore} - {awayScore}
      </div>
    </div>
  </div>
);

MatchScoreboard.propTypes = {
  homeTeam: PropTypes.string.isRequired,
  awayTeam: PropTypes.string.isRequired,
  homeScore: PropTypes.number.isRequired,
  awayScore: PropTypes.number.isRequired,
  currentMinute: PropTypes.number.isRequired,
  matchType: PropTypes.string,
  league: PropTypes.string
};

export default MatchScoreboard;
