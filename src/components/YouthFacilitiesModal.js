import React, { useState } from 'react';
import PropTypes from 'prop-types';

const YouthFacilitiesModal = ({ setShowYouthFacilities, club, onUpgrade, onShowYouthSquad }) => {
  const [newLevel, setNewLevel] = useState((club.altyapi || 35) + 1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Haftalık ücret hesaplama (çok güçlü exponensiyel)
  const currentLevel = club.altyapi || 35;
  const weeklyFee = Math.round(Math.pow(currentLevel / 10, 2.5) * 10);
  const newWeeklyFee = Math.round(Math.pow(newLevel / 10, 2.5) * 10);
  
  // Masraf hesaplama (çok güçlü exponensiyel)
  const expense = newLevel <= currentLevel ? 0 : Math.round(Math.pow(newLevel / 10, 3.5) * 100);
  
  // Banka bakiyesi (ana para)
  const bankBalance = club.money;

  const handleLevelChange = (change) => {
    const newValue = Math.max(1, Math.min(100, newLevel + change));
    setNewLevel(newValue);
  };

  const handleUpgrade = () => {
    if (expense <= bankBalance) {
      setShowUpgradeModal(true);
      setTimeout(() => {
        onUpgrade(expense, newLevel);
        setShowYouthFacilities(false);
      }, 2000);
    } else {
      alert('Yetersiz bakiye!');
    }
  };

  const renderUpgradeMessage = () => (
    <div className="fc-modal-backdrop" style={{ zIndex: 1000 }}>
      <div className="fc-modal" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--win)' }}>
          {newLevel > currentLevel ? '🎉 Altyapı Tesisleri Yükseltildi!' : '📉 Altyapı Tesisleri Düşürüldü!'}
        </h3>
        <div className="fc-panel">
          <p style={{ fontSize: '16px', marginBottom: '15px' }}>
            {newLevel > currentLevel 
              ? 'Genç oyuncular yeni altyapı tesislerinden çok memnun! ⚽'
              : 'Genç oyuncular altyapı tesislerinin düşürülmesinden üzgün! 😞'
            }
          </p>
          <p style={{ fontSize: '14px', marginBottom: '15px' }}>
            {newLevel > currentLevel 
              ? 'Gelecekteki yıldızlar daha iyi gelişebilecek! 🌟'
              : 'Genç yeteneklerin gelişimi yavaşlayabilir! 😰'
            }
          </p>
          <div style={{ 
            background: '#e8f5e8', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--win)' }}>
              Yeni Haftalık Maliyet: {newWeeklyFee.toLocaleString()} TL
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Seviye: {newLevel} → Reytin: {newLevel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fc-modal-backdrop">
        <div className="fc-modal" style={{ maxWidth: '500px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            padding: '20px',
            borderRadius: '8px 8px 0 0',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
              ALTYAPI ANTRENÖRLÜĞÜ
            </div>
            <div style={{ fontSize: '16px' }}>
              REYTİNG: <span style={{ 
                background: 'black', 
                padding: '4px 8px', 
                borderRadius: '4px',
                marginLeft: '5px'
              }}>{currentLevel}</span>
            </div>
            <div style={{ fontSize: '14px', marginTop: '10px' }}>
              Haftalık ücret: {weeklyFee.toLocaleString()} TL
            </div>
          </div>

          <div className="fc-panel" style={{ padding: '20px' }}>
            {/* Seviye Kontrolleri */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '20px',
              padding: '15px',
              background: '#f5f5f5',
              borderRadius: '8px'
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

            {/* Finansal Bilgiler */}
            <div style={{ 
              background: '#f0f8ff', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Masraf:</span>
                <span style={{ color: 'var(--loss)', fontWeight: 'bold' }}>{expense.toLocaleString()} TL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Yeni haftalık maliyet:</span>
                <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>
                  {newWeeklyFee.toLocaleString()} TL
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>Banka Bakiyesi:</span>
                <span style={{ color: 'var(--win)', fontWeight: 'bold' }}>{bankBalance.toLocaleString()} TL</span>
              </div>
            </div>
          </div>

          <div className="fc-footerbar">
            <button 
              className="fc-btn" 
              onClick={() => setShowYouthFacilities(false)}
            >
              Geri
            </button>
            <button 
              className="fc-btn" 
              style={{ 
                background: expense <= bankBalance ? 'var(--win)' : '#ccc',
                cursor: expense <= bankBalance ? 'pointer' : 'not-allowed'
              }}
              onClick={handleUpgrade}
              disabled={expense > bankBalance}
            >
              {newLevel === currentLevel ? 'Güncelle' : newLevel > currentLevel ? 'Yükselt' : 'Düşür'}
            </button>
            <button 
              className="fc-btn" 
              style={{ background: '#28a745' }}
              onClick={() => {
                setShowYouthFacilities(false);
                onShowYouthSquad();
              }}
            >
              Kadro
            </button>
          </div>
        </div>
      </div>
      {showUpgradeModal && renderUpgradeMessage()}
    </>
  );
};

YouthFacilitiesModal.propTypes = {
  setShowYouthFacilities: PropTypes.func.isRequired,
  club: PropTypes.object.isRequired,
  onUpgrade: PropTypes.func.isRequired,
  onShowYouthSquad: PropTypes.func.isRequired,
};

export default YouthFacilitiesModal;
