import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PitchImprovementModal = ({ setShowPitchImprovement, club, onShowStadium }) => {
  const [newLevel, setNewLevel] = useState(41);

  const currentLevel = 40; // Mevcut saha kalitesi
  const maxLevel = 99;

  const calculateUpgradeCost = (level) => {
    if (level <= currentLevel) return 0;
    return Math.round(Math.pow(level / 10, 2) * 10);
  };

  const upgradeCost = calculateUpgradeCost(newLevel);

  const handleLevelChange = (change) => {
    const newValue = Math.max(currentLevel, Math.min(maxLevel, newLevel + change));
    setNewLevel(newValue);
  };

  const handleUpgrade = () => {
    if (upgradeCost <= club.money && newLevel > currentLevel) {
      club.money -= upgradeCost; // Para düşüldü
      alert(`Saha kalitesi ${currentLevel}'den ${newLevel}'e yükseltildi! Kalan bakiye: ${club.money.toLocaleString()} TL`);
      setShowPitchImprovement(false);
    } else if (newLevel === currentLevel) {
      alert('Saha zaten mevcut seviyede.');
    } else {
      alert('Yetersiz bakiye!');
    }
  };

  return (
    <div className="fc-modal-backdrop">
      <div className="fc-modal" style={{ maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #2c466b, #1a365d)',
          padding: '20px',
          borderRadius: '8px 8px 0 0',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
            SAHA İYİLEŞTİRMELERİ
          </div>
          <div style={{ fontSize: '16px' }}>
            Mevcut Saha Kalitesi: {currentLevel}
          </div>
        </div>

        <div className="fc-panel" style={{ padding: '20px' }}>
          {/* Saha Görseli */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            background: 'linear-gradient(180deg, #87CEEB, #98FB98)',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <div style={{ 
              width: '200px', 
              height: '120px', 
              margin: '0 auto',
              background: '#228B22',
              border: '3px solid #8B4513',
              borderRadius: '8px',
              position: 'relative'
            }}>
              {/* Saha çizgileri */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '60px',
                height: '60px',
                border: '2px solid white',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '2px',
                height: '100%',
                background: 'white',
                transform: 'translate(-50%, -50%)'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '2px',
                background: 'white',
                transform: 'translate(-50%, -50%)'
              }}></div>
            </div>
          </div>

          {/* Seviye Kontrolleri */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              textAlign: 'center', 
              color: 'var(--blue)',
              fontSize: '18px'
            }}>
              SAHA KALİTESİ AYARLAMA
            </h4>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '15px',
              background: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <button 
                onClick={() => handleLevelChange(-5)}
                style={{
                  background: 'var(--loss)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                &lt;&lt; 5
              </button>
              <button 
                onClick={() => handleLevelChange(-1)}
                style={{
                  background: 'var(--loss)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                &lt; 1
              </button>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: 'var(--blue)',
                background: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '2px solid var(--blue)'
              }}>
                {newLevel}
              </div>
              <button 
                onClick={() => handleLevelChange(1)}
                style={{
                  background: 'var(--win)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                1 &gt;
              </button>
              <button 
                onClick={() => handleLevelChange(5)}
                style={{
                  background: 'var(--win)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                5 &gt;&gt;
              </button>
            </div>
          </div>

          {/* Detay Bilgileri */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              textAlign: 'center', 
              color: 'var(--blue)',
              fontSize: '16px'
            }}>
              SAHA DETAYLARI
            </h4>
            
            <div style={{ 
              background: '#f0f8ff', 
              padding: '15px', 
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Mevcut Saha Kalitesi:</span>
                <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>{currentLevel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>Geliştirme Masrafı:</span>
                <span style={{ color: 'var(--loss)', fontWeight: 'bold' }}>{upgradeCost.toLocaleString()} TL</span>
              </div>
            </div>
          </div>

          {/* Saha Kalitesi Açıklaması */}
          <div style={{ 
            background: '#e8f5e8', 
            padding: '15px', 
            borderRadius: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            <h5 style={{ margin: '0 0 10px 0', color: 'var(--blue)' }}>Saha Kalitesi Etkileri:</h5>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Yüksek kalite: Oyuncu performansını artırır</li>
              <li>Düşük kalite: Sakatlık riskini artırır</li>
              <li>Maksimum seviye: 99</li>
            </ul>
          </div>
        </div>

        <div className="fc-footerbar">
          <button 
            className="fc-btn" 
            onClick={() => {
              setShowPitchImprovement(false);
              onShowStadium();
            }}
          >
            Geri
          </button>
          <button 
            className="fc-btn" 
            style={{ 
              background: upgradeCost <= club.money && newLevel > currentLevel ? 'var(--win)' : '#ccc',
              cursor: upgradeCost <= club.money && newLevel > currentLevel ? 'pointer' : 'not-allowed'
            }}
            onClick={handleUpgrade}
            disabled={upgradeCost > club.money || newLevel <= currentLevel}
          >
            {newLevel > currentLevel ? 'Sahayı Geliştir' : 'Güncelle'}
          </button>
        </div>
      </div>
    </div>
  );
};

PitchImprovementModal.propTypes = {
  setShowPitchImprovement: PropTypes.func.isRequired,
  club: PropTypes.object.isRequired,
  onShowStadium: PropTypes.func.isRequired,
};

export default PitchImprovementModal;
