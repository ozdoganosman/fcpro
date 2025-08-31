import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { allSquads } from '../data';

const FixtureModal = ({ setShowFixture, club, preSeasonFixtures, fixtureData, onShowSquad }) => {
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Sabit fikstür verilerini kullan (data.js'den gelen) - sadece kendi takımının maçlarını göster
  const leagueFixtures = (fixtureData[club.league] || []).filter(fixture => 
    fixture.homeTeam === club.name || fixture.awayTeam === club.name
  ).sort((a, b) => a.week - b.week).map((fixture, index) => ({
    ...fixture,
    week: index + 1 // Hafta numaralarını 1'den başlayarak yeniden numaralandır
  }));
  
  // Seçilen takımın lig maçlarını filtrele (tüm 36 maç)
  const teamLeagueFixtures = leagueFixtures.filter(fixture => 
    fixture.homeTeam === club.name || fixture.awayTeam === club.name
  );

  // Hazırlık maçları - props olarak al (App.js'den gelecek)
  const fixturesToShow = preSeasonFixtures || [];

  const handleTeamHover = (teamName, event) => {
    // Tüm liglerde takımı ara
    let foundSquad = null;
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][teamName]) {
        foundSquad = allSquads[league][teamName];
      }
    });
    
    if (foundSquad) {
      setHoveredTeam(teamName);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleTeamLeave = () => {
    setHoveredTeam(null);
  };

  const getResult = (fixture) => {
    if (!fixture.result || fixture.result === 'null-null') return null; // Henüz oynanmamış
    
    const [homeScore, awayScore] = fixture.result.split('-').map(Number);
    
    if (fixture.homeTeam === club.name) {
      if (homeScore > awayScore) return 'G';
      if (homeScore < awayScore) return 'M';
      return 'B';
    } else {
      if (awayScore > homeScore) return 'G';
      if (awayScore < homeScore) return 'M';
      return 'B';
    }
  };

  const getResultColor = (result) => {
    if (result === 'M') return 'var(--loss)';
    if (result === 'G') return 'var(--win)';
    if (result === 'B') return 'var(--draw)';
    return '#ccc';
  };

  const renderFixtureRow = (fixture, index) => {
    const isHome = fixture.homeTeam === club.name;
    const result = getResult(fixture);
    const score = fixture.result && fixture.result !== 'null-null' && fixture.played
      ? fixture.result 
      : 'Henüz oynanmadı';
    
    return (
      <tr key={index}>
        <td>{fixture.isPreSeason ? `Hazırlık ${Math.abs(fixture.matchday)}` : `Hafta ${fixture.week}`}</td>
        <td 
          style={{ 
            fontWeight: isHome ? 'bold' : 'normal',
            cursor: 'pointer',
            position: 'relative'
          }}
          onMouseEnter={(e) => handleTeamHover(fixture.homeTeam, e)}
          onMouseLeave={handleTeamLeave}
          onClick={() => onShowSquad && onShowSquad(fixture.homeTeam)}
        >
          {fixture.homeTeam}
        </td>
        <td>{score}</td>
        <td 
          style={{ 
            fontWeight: !isHome ? 'bold' : 'normal',
            cursor: 'pointer',
            position: 'relative'
          }}
          onMouseEnter={(e) => handleTeamHover(fixture.awayTeam, e)}
          onMouseLeave={handleTeamLeave}
          onClick={() => onShowSquad && onShowSquad(fixture.awayTeam)}
        >
          {fixture.awayTeam}
        </td>
        <td>
          {result ? (
            <span 
              style={{ 
                background: getResultColor(result),
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              {result}
            </span>
          ) : (
            <span style={{ color: '#999', fontSize: '12px' }}>-</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="fc-modal-backdrop">
      <div className="fc-modal" style={{ maxHeight: '90vh', overflow: 'auto' }}>
        <h3>FİKSTÜR - {club.name}</h3>
        
        {/* Hazırlık Maçları */}
        <div className="fc-panel" style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: 'var(--gold)' }}>
            HAZIRLIK MAÇLARI
          </h4>
          <table className="fc-table">
            <thead>
              <tr>
                <th>Maç</th>
                <th>Ev Sahibi</th>
                <th>Skor</th>
                <th>Deplasman</th>
                <th>Sonuç</th>
              </tr>
            </thead>
            <tbody>
                              {fixturesToShow.map((fixture, index) => renderFixtureRow(fixture, index))}
            </tbody>
          </table>
        </div>

        {/* Lig Maçları */}
        <div className="fc-panel">
          <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: 'var(--blue)' }}>
            LİG MAÇLARI - {club.league} (Toplam: {teamLeagueFixtures.length} maç)
          </h4>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="fc-table">
              <thead>
                <tr>
                  <th>Hafta</th>
                  <th>Ev Sahibi</th>
                  <th>Skor</th>
                  <th>Deplasman</th>
                  <th>Sonuç</th>
                </tr>
              </thead>
              <tbody>
                {teamLeagueFixtures.map((fixture, index) => renderFixtureRow(fixture, index))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="fc-footerbar">
          <button className="fc-btn" onClick={() => setShowFixture(false)}>Geri</button>
        </div>
      </div>
      
      {/* Kadro Tooltip */}
      {hoveredTeam && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '12px',
            maxWidth: '300px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            {hoveredTeam} Kadrosu
          </div>
                          {(() => {
                  let foundSquad = null;
                  Object.keys(allSquads).forEach(league => {
                    if (allSquads[league][hoveredTeam]) {
                      foundSquad = allSquads[league][hoveredTeam];
                    }
                  });
                  return foundSquad?.firstTeam?.slice(0, 8).map((player, index) => (
                    <div key={index} style={{ marginBottom: '2px' }}>
                      {player.name} ({player.age}) - {player.rating}
                    </div>
                  ));
                })()}
          {(() => {
            let foundSquad = null;
            Object.keys(allSquads).forEach(league => {
              if (allSquads[league][hoveredTeam]) {
                foundSquad = allSquads[league][hoveredTeam];
              }
            });
            return foundSquad?.firstTeam?.length > 8 ? (
              <div style={{ color: '#ccc', fontSize: '11px' }}>
                +{foundSquad.firstTeam.length - 8} oyuncu daha...
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};

FixtureModal.propTypes = {
  setShowFixture: PropTypes.func.isRequired,
  club: PropTypes.object.isRequired,
  preSeasonFixtures: PropTypes.array,
  fixtureData: PropTypes.object,
  onShowSquad: PropTypes.func,
};

export default FixtureModal;