import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { allSquads } from '../data';

const StandingsModal = ({ setShowStandings, club, fixtureData, onShowSquad, turkishLeagues }) => {
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('standings'); // 'standings' or 'fixtures'
  
  // Lig tablosunu direkt fikstürden hesapla
  const leagueTeams = turkishLeagues[club.league] || [];
  const leagueFixtures = fixtureData[club.league] || [];
  
  // Her takım için istatistikleri hesapla
  const calculateTeamStats = (teamName) => {
    let played = 0, wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;
    
    // Bu takımın oynadığı tüm maçları bul
    leagueFixtures.forEach(fixture => {
      if (fixture.played && (fixture.homeTeam === teamName || fixture.awayTeam === teamName)) {
        played++;
        const [homeScore, awayScore] = fixture.result.split('-').map(Number);
        
        if (fixture.homeTeam === teamName) {
          // Ev sahibi
          goalsFor += homeScore;
          goalsAgainst += awayScore;
          if (homeScore > awayScore) wins++;
          else if (homeScore < awayScore) losses++;
          else draws++;
        } else {
          // Deplasman
          goalsFor += awayScore;
          goalsAgainst += homeScore;
          if (awayScore > homeScore) wins++;
          else if (awayScore < homeScore) losses++;
          else draws++;
        }
      }
    });
    
    return {
      played,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      points: wins * 3 + draws
    };
  };
  
  // Takımları fikstürden hesaplanan verilerle sırala
  const sortedTeams = leagueTeams.map(team => {
    const stats = calculateTeamStats(team.name);
    return {
      ...team,
      ...stats
    };
  }).sort((a, b) => {
    // Önce puana göre sırala (yüksek puan üstte)
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // Puan eşitse averaja göre sırala
    const aAvg = a.goalsFor - a.goalsAgainst;
    const bAvg = b.goalsFor - b.goalsAgainst;
    if (bAvg !== aAvg) {
      return bAvg - aAvg;
    }
    // Averaj eşitse gol sayısına göre sırala
    return b.goalsFor - a.goalsFor;
  });

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

  const renderTabs = () => (
    <div style={{ display: 'flex', marginBottom: '20px' }}>
      <button
        onClick={() => setActiveTab('standings')}
        style={{
          flex: 1,
          padding: '10px',
          background: activeTab === 'standings' ? 'var(--win)' : '#fff',
          color: activeTab === 'standings' ? '#fff' : '#666',
          border: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        PUAN DURUMU
      </button>
      <button
        onClick={() => setActiveTab('fixtures')}
        style={{
          flex: 1,
          padding: '10px',
          background: activeTab === 'fixtures' ? 'var(--win)' : '#fff',
          color: activeTab === 'fixtures' ? '#fff' : '#666',
          border: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        FİKSTÜR
      </button>
    </div>
  );

  const renderFixtures = () => {
    const leagueFixtures = fixtureData[club.league] || [];
    const allTeams = turkishLeagues[club.league] || [];
    const totalWeeks = Math.max(...leagueFixtures.map(f => f.week));
    
    // Her hafta için bay geçen takımı bul (sadece tek sayılı takım için gerekli)
    const getByeTeam = (week) => {
      const weekFixtures = leagueFixtures.filter(f => f.week === week);
      const playingTeams = new Set();
      
      weekFixtures.forEach(fixture => {
        playingTeams.add(fixture.homeTeam);
        playingTeams.add(fixture.awayTeam);
      });
      
      // Bay geçen takımı bul (sadece tek sayılı takım için)
      const byeTeam = allTeams.find(team => !playingTeams.has(team.name));
      return byeTeam ? byeTeam.name : null;
    };
    
    return (
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {Array.from({ length: totalWeeks }, (_, weekIndex) => {
          const week = weekIndex + 1;
          const weekFixtures = leagueFixtures.filter(f => f.week === week);
          const byeTeam = getByeTeam(week);
          
          return (
            <div key={week} style={{ marginBottom: '20px' }}>
              <h4 style={{ 
                margin: '0 0 10px 0', 
                textAlign: 'center', 
                color: 'var(--blue)',
                fontSize: '16px',
                background: '#f5f5f5',
                padding: '8px',
                borderRadius: '4px'
              }}>
                HAFTA {week}
              </h4>
              <table className="fc-table">
                <thead>
                  <tr>
                    <th>Ev Sahibi</th>
                    <th>Skor</th>
                    <th>Deplasman</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {weekFixtures.map((fixture, index) => {
                    const isHome = fixture.homeTeam === club.name;
                    const isAway = fixture.awayTeam === club.name;
                    const isUserTeam = isHome || isAway;
                    
                    return (
                      <tr 
                        key={index}
                        style={{
                          background: isUserTeam ? 'var(--win)' : '',
                          color: isUserTeam ? '#fff' : '',
                          fontWeight: isUserTeam ? 'bold' : 'normal'
                        }}
                      >
                        <td 
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => handleTeamHover(fixture.homeTeam, e)}
                          onMouseLeave={handleTeamLeave}
                          onClick={() => onShowSquad && onShowSquad(fixture.homeTeam)}
                        >
                          {fixture.homeTeam}
                        </td>
                        <td>
                          {fixture.result || 'Henüz oynanmadı'}
                        </td>
                        <td 
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => handleTeamHover(fixture.awayTeam, e)}
                          onMouseLeave={handleTeamLeave}
                          onClick={() => onShowSquad && onShowSquad(fixture.awayTeam)}
                        >
                          {fixture.awayTeam}
                        </td>
                        <td>
                          {fixture.played ? (
                            <span style={{ 
                              background: 'var(--win)', 
                              color: '#fff', 
                              padding: '2px 6px', 
                              borderRadius: '4px', 
                              fontSize: '12px' 
                            }}>
                              Tamamlandı
                            </span>
                          ) : (
                            <span style={{ 
                              background: '#ccc', 
                              color: '#666', 
                              padding: '2px 6px', 
                              borderRadius: '4px', 
                              fontSize: '12px' 
                            }}>
                              Bekliyor
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Bay geçen takım satırı - sadece tek sayılı takım için göster */}
                  {byeTeam && allTeams.length % 2 === 1 && (
                    <tr style={{
                      background: byeTeam === club.name ? 'var(--win)' : '#f0f0f0',
                      color: byeTeam === club.name ? '#fff' : '#666',
                      fontWeight: byeTeam === club.name ? 'bold' : 'normal',
                      fontStyle: 'italic'
                    }}>
                      <td 
                        colSpan="2"
                        style={{ 
                          textAlign: 'center',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => handleTeamHover(byeTeam, e)}
                        onMouseLeave={handleTeamLeave}
                        onClick={() => onShowSquad && onShowSquad(byeTeam)}
                      >
                        {byeTeam}
                      </td>
                      <td colSpan="2" style={{ textAlign: 'center' }}>
                        <span style={{ 
                          background: '#ffa500', 
                          color: '#fff', 
                          padding: '2px 8px', 
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          BAY
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fc-modal-backdrop">
      <div className="fc-modal" style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
        <h3>{activeTab === 'standings' ? 'PUAN DURUMU' : 'FİKSTÜR'} - {club.league}</h3>
        
        {renderTabs()}
        
        {activeTab === 'standings' ? (
          <div className="fc-panel">
            <table className="fc-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Takım</th>
                  <th>O</th>
                  <th>G</th>
                  <th>B</th>
                  <th>M</th>
                  <th>A</th>
                  <th>Y</th>
                  <th>AV</th>
                  <th>P</th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((team, index) => (
                  <tr 
                    key={index}
                    style={{
                      background: team.name === club.name ? 'var(--win)' : '',
                      color: team.name === club.name ? '#fff' : '',
                      fontWeight: team.name === club.name ? 'bold' : 'normal'
                    }}
                  >
                    <td>{index + 1}</td>
                    <td 
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => handleTeamHover(team.name, e)}
                      onMouseLeave={handleTeamLeave}
                      onClick={() => onShowSquad && onShowSquad(team.name)}
                    >
                      {team.name}
                    </td>
                    <td>{team.wins + team.draws + team.losses}</td>
                    <td>{team.wins}</td>
                    <td>{team.draws}</td>
                    <td>{team.losses}</td>
                    <td>{team.goalsFor}</td>
                    <td>{team.goalsAgainst}</td>
                    <td>{team.goalsFor - team.goalsAgainst}</td>
                    <td>{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="fc-panel">
            {renderFixtures()}
          </div>
        )}
        
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
        
        <div className="fc-footerbar">
          <button className="fc-btn" onClick={() => setShowStandings(false)}>Geri</button>
        </div>
      </div>
    </div>
  );
};

StandingsModal.propTypes = {
  setShowStandings: PropTypes.func.isRequired,
  club: PropTypes.object.isRequired,
  fixtureData: PropTypes.object,
  onShowSquad: PropTypes.func,
  turkishLeagues: PropTypes.object.isRequired,
};

export default StandingsModal;