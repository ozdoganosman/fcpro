import React from 'react';
import PropTypes from 'prop-types';
import { calculateTeamRating, calculateTeamStrength } from '../../engine/matchEngine';

const getEnergyColor = (energy) => {
  if (energy >= 80) return '#4CAF50';
  if (energy >= 60) return '#FF9800';
  if (energy >= 40) return '#FF5722';
  return '#D32F2F';
};

const PlayerRow = ({ player, isSubstituted, yellowCardCount }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', padding: '2px 0',
    borderBottom: '1px solid #eee', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis'
  }}>
    <span style={{ fontWeight: 'bold', flex: '1', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {player.name} {isSubstituted && '🔄'} {yellowCardCount > 0 && `🟨${yellowCardCount}`}
    </span>
    <span style={{ color: '#666', marginLeft: '8px', whiteSpace: 'nowrap' }}>
      {player.position} • {player.rating} •{' '}
      <span style={{ color: getEnergyColor(player.energy || 100), fontWeight: 'bold' }}>
        {(Math.round((player.energy || 100) * 10) / 10).toFixed(1)}%
      </span>
    </span>
  </div>
);

PlayerRow.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string,
    position: PropTypes.string,
    rating: PropTypes.number,
    energy: PropTypes.number
  }).isRequired,
  isSubstituted: PropTypes.bool,
  yellowCardCount: PropTypes.number
};

const SuspendedInjuredRow = ({ player, isSuspended }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', padding: '2px 0',
    borderBottom: '1px solid #eee', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis'
  }}>
    <span style={{ fontWeight: 'bold', flex: '1', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {player.name}
    </span>
    <span style={{ color: '#c00', marginLeft: '8px', whiteSpace: 'nowrap' }}>
      {isSuspended ? '🔴 Cezalı' : '🏥 Sakat'}
    </span>
  </div>
);

SuspendedInjuredRow.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  isSuspended: PropTypes.bool
};

const TeamSquadPanel = ({ teamName, matchState, isHome, manager }) => {
  const squad = isHome ? matchState.homeSquad : matchState.awaySquad;
  const substitutions = isHome ? matchState.homeSubstitutions : matchState.awaySubstitutions;
  const suspended = isHome ? matchState.homeSuspended : matchState.awaySuspended;
  const injured = isHome ? matchState.homeInjured : matchState.awayInjured;
  const substitutedPlayers = isHome ? matchState.homeSubstitutedPlayers : matchState.awaySubstitutedPlayers;
  const yellowCards = isHome ? matchState.homeYellowCards : matchState.awayYellowCards;

  const rating = squad ? calculateTeamRating(squad, suspended, injured) : 0;
  const strength = squad ? calculateTeamStrength(squad, manager, suspended, injured, isHome) : 0;

  const firstTeam = squad ? squad.firstTeam : [];
  const substitutes = squad ? squad.substitutes : [];
  const allSuspendedInjured = [...suspended, ...injured];

  return (
    <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '15px' }}>
      <h5 style={{
        margin: '0 0 10px 0', textAlign: 'center',
        color: 'var(--blue)', fontSize: '14px', fontWeight: 'bold'
      }}>
        {teamName}
      </h5>
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#666', marginBottom: '5px' }}>
        Reyting: {rating} | Güç: {strength}
      </div>
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#666', marginBottom: '10px' }}>
        Değişiklik: {substitutions}/3
      </div>

      {/* İlk 11 */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--blue)', marginBottom: '5px' }}>
          İLK 11
        </div>
        <div style={{ fontSize: '11px', lineHeight: '1.3', maxHeight: '120px', overflowY: 'auto', scrollBehavior: 'smooth' }}>
          {firstTeam.length === 0 ? 'Oyuncu bulunamadı' : firstTeam.map((player, i) => (
            <PlayerRow
              key={i} player={player}
              isSubstituted={substitutedPlayers.includes(player.name)}
              yellowCardCount={yellowCards[player.name] || 0}
            />
          ))}
        </div>
      </div>

      {/* Yedekler */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--blue)', marginBottom: '5px' }}>
          YEDEKLER
        </div>
        <div style={{ fontSize: '11px', lineHeight: '1.3', maxHeight: '80px', overflowY: 'auto', scrollBehavior: 'smooth' }}>
          {substitutes.length === 0 ? 'Yedek oyuncu yok' : substitutes.map((player, i) => (
            <PlayerRow
              key={i} player={player}
              isSubstituted={substitutedPlayers.includes(player.name)}
              yellowCardCount={yellowCards[player.name] || 0}
            />
          ))}
        </div>
      </div>

      {/* Cezalı/Sakat */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--blue)', marginBottom: '5px' }}>
          CEZALI/SAKAT
        </div>
        <div style={{ fontSize: '11px', lineHeight: '1.3', color: '#666', maxHeight: '60px', overflowY: 'auto', scrollBehavior: 'smooth' }}>
          {allSuspendedInjured.length === 0 ? 'Cezalı veya sakat oyuncu yok' : allSuspendedInjured.map((player, i) => (
            <SuspendedInjuredRow key={i} player={player} isSuspended={suspended.includes(player)} />
          ))}
        </div>
      </div>
    </div>
  );
};

TeamSquadPanel.propTypes = {
  teamName: PropTypes.string.isRequired,
  matchState: PropTypes.object.isRequired,
  isHome: PropTypes.bool.isRequired,
  manager: PropTypes.object
};

export default TeamSquadPanel;
