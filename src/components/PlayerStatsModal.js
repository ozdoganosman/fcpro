import React, { useState } from 'react';
import PropTypes from 'prop-types';

/* eslint-disable no-unused-vars */

const PlayerStatsModal = ({ setShowPlayerStats, club, playerStats }) => {
  const [activeTab, setActiveTab] = useState('cards'); // 'cards', 'injuries', 'goals'

  const renderTabs = () => (
    <div style={{ display: 'flex', marginBottom: '20px' }}>
      <button
        onClick={() => setActiveTab('cards')}
        style={{
          flex: 1,
          padding: '10px',
          background: activeTab === 'cards' ? 'var(--win)' : '#fff',
          color: activeTab === 'cards' ? '#fff' : '#666',
          border: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Kartlar
      </button>
      <button
        onClick={() => setActiveTab('injuries')}
        style={{
          flex: 1,
          padding: '10px',
          background: activeTab === 'injuries' ? 'var(--win)' : '#fff',
          color: activeTab === 'injuries' ? '#fff' : '#666',
          border: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Sakatlıklar
      </button>
      <button
        onClick={() => setActiveTab('goals')}
        style={{
          flex: 1,
          padding: '10px',
          background: activeTab === 'goals' ? 'var(--win)' : '#fff',
          color: activeTab === 'goals' ? '#fff' : '#666',
          border: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Gol/Asist
      </button>
    </div>
  );

  const renderCardsTab = () => {
    const playersWithCards = Object.entries(playerStats)
      .filter(([playerName, stats]) => stats.yellowCards > 0 || stats.redCards > 0)
      .sort((a, b) => (b[1].redCards * 2 + b[1].yellowCards) - (a[1].redCards * 2 + a[1].yellowCards));

    return (
      <div>
        <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: 'var(--blue)' }}>
          KART İSTATİSTİKLERİ
        </h4>
        {playersWithCards.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            Henüz kart gören oyuncu yok
          </div>
        ) : (
          <table className="fc-table">
            <thead>
              <tr>
                <th>Oyuncu</th>
                <th>🟨 Sarı</th>
                <th>🟥 Kırmızı</th>
                <th>Ceza Durumu</th>
              </tr>
            </thead>
            <tbody>
              {playersWithCards.map(([playerName, stats]) => {
                const totalYellow = stats.yellowCards || 0;
                const totalRed = stats.redCards || 0;
                const yellowSuspension = Math.floor(totalYellow / 4);
                const redSuspension = totalRed * (2 + Math.floor(Math.random() * 3)); // 2-4 maç
                const totalSuspension = yellowSuspension + redSuspension;
                
                return (
                  <tr key={playerName}>
                    <td>{playerName}</td>
                    <td>{totalYellow}</td>
                    <td>{totalRed}</td>
                    <td>
                      {totalSuspension > 0 ? (
                        <span style={{ 
                          background: 'var(--loss)', 
                          color: '#fff', 
                          padding: '2px 8px', 
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {totalSuspension} maç ceza
                        </span>
                      ) : (
                        <span style={{ color: 'var(--win)' }}>Temiz</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const renderInjuriesTab = () => {
    const injuredPlayers = Object.entries(playerStats)
      .filter(([playerName, stats]) => stats.injuries && stats.injuries.length > 0)
      .sort((a, b) => b[1].injuries.length - a[1].injuries.length);

    return (
      <div>
        <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: 'var(--blue)' }}>
          SAKATLIK İSTATİSTİKLERİ
        </h4>
        {injuredPlayers.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            Henüz sakatlanan oyuncu yok
          </div>
        ) : (
          <div>
            {injuredPlayers.map(([playerName, stats]) => (
              <div key={playerName} style={{ 
                marginBottom: '15px',
                padding: '15px',
                background: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  {playerName}
                </div>
                {stats.injuries.map((injury, index) => (
                  <div key={index} style={{ 
                    marginBottom: '5px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                                         • {injury.type} - {injury.matchesOut} maç yok
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderGoalsTab = () => {
    const playersWithGoals = Object.entries(playerStats)
      .filter(([playerName, stats]) => (stats.goals > 0 || stats.assists > 0))
      .sort((a, b) => (b[1].goals * 3 + b[1].assists) - (a[1].goals * 3 + a[1].assists));

    return (
      <div>
        <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: 'var(--blue)' }}>
          GOL VE ASİST İSTATİSTİKLERİ
        </h4>
        {playersWithGoals.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            Henüz gol/asist yapan oyuncu yok
          </div>
        ) : (
          <table className="fc-table">
            <thead>
              <tr>
                <th>Oyuncu</th>
                <th>⚽ Gol</th>
                <th>🎯 Asist</th>
                <th>Toplam Puan</th>
              </tr>
            </thead>
            <tbody>
              {playersWithGoals.map(([playerName, stats]) => {
                const goals = stats.goals || 0;
                const assists = stats.assists || 0;
                const totalPoints = goals * 3 + assists;
                
                return (
                  <tr key={playerName}>
                    <td>{playerName}</td>
                    <td>{goals}</td>
                    <td>{assists}</td>
                    <td style={{ fontWeight: 'bold', color: 'var(--win)' }}>
                      {totalPoints}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="fc-modal-backdrop">
      <div className="fc-modal" style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #2c466b, #1a365d)',
          padding: '20px',
          borderRadius: '8px 8px 0 0',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
            OYUNCU İSTATİSTİKLERİ
          </div>
          <div style={{ fontSize: '16px' }}>
            {club.name}
          </div>
        </div>

        <div className="fc-panel" style={{ padding: '20px' }}>
          {renderTabs()}
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {activeTab === 'cards' && renderCardsTab()}
            {activeTab === 'injuries' && renderInjuriesTab()}
            {activeTab === 'goals' && renderGoalsTab()}
          </div>
        </div>

        <div className="fc-footerbar">
          <button 
            className="fc-btn" 
            onClick={() => setShowPlayerStats(false)}
          >
            Geri
          </button>
        </div>
      </div>
    </div>
  );
};

PlayerStatsModal.propTypes = {
  setShowPlayerStats: PropTypes.func.isRequired,
  club: PropTypes.object.isRequired,
  playerStats: PropTypes.object.isRequired,
};

export default PlayerStatsModal;
