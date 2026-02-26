import React from 'react';
import PropTypes from 'prop-types';

const StatBar = ({ label, homeValue, awayValue }) => {
  const total = homeValue + awayValue;
  const homePercent = total > 0 ? (homeValue / total) * 100 : 50;
  const awayPercent = total > 0 ? (awayValue / total) * 100 : 50;

  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
        <span style={{ fontWeight: 'bold' }}>{homeValue}</span>
        <span style={{ color: '#666' }}>{label}</span>
        <span style={{ fontWeight: 'bold' }}>{awayValue}</span>
      </div>
      <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', background: '#e0e0e0' }}>
        <div style={{ width: `${homePercent}%`, background: 'var(--blue)', transition: 'width 0.3s' }} />
        <div style={{ width: `${awayPercent}%`, background: '#ff6b6b', transition: 'width 0.3s' }} />
      </div>
    </div>
  );
};

StatBar.propTypes = {
  label: PropTypes.string.isRequired,
  homeValue: PropTypes.number.isRequired,
  awayValue: PropTypes.number.isRequired
};

const MatchStatsPanel = ({ stats, matchEnded }) => {
  if (!matchEnded || !stats) return null;

  const totalPossession = stats.homePossession + stats.awayPossession;
  const homePossessionPct = totalPossession > 0 ? Math.round((stats.homePossession / totalPossession) * 100) : 50;
  const awayPossessionPct = 100 - homePossessionPct;

  return (
    <div style={{
      background: '#f9f9f9', borderRadius: '8px', padding: '15px', marginTop: '15px'
    }}>
      <h5 style={{
        margin: '0 0 12px 0', textAlign: 'center',
        color: 'var(--blue)', fontSize: '14px', fontWeight: 'bold'
      }}>
        MAÇ İSTATİSTİKLERİ
      </h5>
      <StatBar label="Topla Oynama %" homeValue={homePossessionPct} awayValue={awayPossessionPct} />
      <StatBar label="Şut" homeValue={stats.homeShots} awayValue={stats.awayShots} />
      <StatBar label="İsabetli Şut" homeValue={stats.homeShotsOnTarget} awayValue={stats.awayShotsOnTarget} />
      <StatBar label="Korner" homeValue={stats.homeCorners} awayValue={stats.awayCorners} />
      <StatBar label="Faul" homeValue={stats.homeFouls} awayValue={stats.awayFouls} />
    </div>
  );
};

MatchStatsPanel.propTypes = {
  stats: PropTypes.object,
  matchEnded: PropTypes.bool.isRequired
};

export default MatchStatsPanel;
