import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { turkishLeagues } from '../data';

const TeamSelection = ({ onTeamSelect }) => {
  const [selectedLeague, setSelectedLeague] = useState('2. Lig Kırmızı');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleTeamSelect = () => {
    if (selectedTeam) {
      onTeamSelect(selectedTeam, selectedLeague);
    }
  };

  // Turkish leagues yüklenene kadar bekle
  useEffect(() => {
    const checkLeaguesLoaded = () => {
      if (turkishLeagues && Object.keys(turkishLeagues).length > 0) {
        setIsLoading(false);
      } else {
        setTimeout(checkLeaguesLoaded, 100);
      }
    };
    checkLeaguesLoaded();
  }, []);

  if (isLoading) {
    return (
      <div className="fc-modal-backdrop">
        <div className="fc-modal" style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
          <h3>TAKIM SEÇİMİ</h3>
          <div className="fc-panel" style={{ textAlign: 'center', padding: '40px' }}>
            <div>Takım verileri yükleniyor...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fc-modal-backdrop">
      <div className="fc-modal" style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
        <h3>TAKIM SEÇİMİ</h3>
        
        <div className="fc-panel" style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>Lig Seçin</h4>
          <div className="fc-btn-row">
            <button 
              className={`fc-btn ${selectedLeague === '2. Lig Kırmızı' ? 'active' : ''}`}
              onClick={() => setSelectedLeague('2. Lig Kırmızı')}
              style={{ 
                background: selectedLeague === '2. Lig Kırmızı' ? 'var(--win)' : 'var(--green)',
                flex: 1 
              }}
            >
              2. Lig Kırmızı
            </button>
            <button 
              className={`fc-btn ${selectedLeague === '2. Lig Beyaz' ? 'active' : ''}`}
              onClick={() => setSelectedLeague('2. Lig Beyaz')}
              style={{ 
                background: selectedLeague === '2. Lig Beyaz' ? 'var(--win)' : 'var(--green)',
                flex: 1 
              }}
            >
              2. Lig Beyaz
            </button>
          </div>
        </div>

        <div className="fc-panel">
          <h4 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>
            {selectedLeague} Takımları
          </h4>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '10px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {turkishLeagues[selectedLeague]?.map((team, index) => (
              <button
                key={index}
                className={`fc-card ${selectedTeam === team.name ? 'selected' : ''}`}
                onClick={() => setSelectedTeam(team.name)}
                style={{
                  background: selectedTeam === team.name ? 'var(--win)' : 'var(--green-light)',
                  color: selectedTeam === team.name ? '#fff' : 'var(--blue)',
                  border: selectedTeam === team.name ? '2px solid var(--win)' : '1px solid #ddd',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{team.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Değer: €{team.value}M
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="fc-footerbar" style={{ marginTop: '20px' }}>
          <button 
            className="fc-btn" 
            onClick={handleTeamSelect}
            disabled={!selectedTeam}
            style={{ 
              background: selectedTeam ? 'var(--win)' : '#ccc',
              flex: 1 
            }}
          >
            Takımı Seç
          </button>
        </div>
      </div>
    </div>
  );
};

TeamSelection.propTypes = {
  onTeamSelect: PropTypes.func.isRequired,
};

export default TeamSelection;
