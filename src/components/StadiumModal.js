import React from 'react';
import PropTypes from 'prop-types';

const StadiumModal = ({ setShowStadium, onShowFacilities, onShowTribuneUpgrade, onShowPitchImprovement }) => {

  // Stadyum verileri
  const stadiumData = {
    kuzey: { name: 'Kuzey Tribünü', built: '2023', capacity: 100, upgradeMultiplier: 1.0 },
    dogu: { name: 'Doğu Tribünü', built: '2023', capacity: 200, upgradeMultiplier: 1.5 },
    guney: { name: 'Güney Tribünü', built: '2023', capacity: 100, upgradeMultiplier: 1.0 },
    bati: { name: 'Batı Tribünü', built: '2023', capacity: 200, upgradeMultiplier: 1.5 },
    koseler: { name: 'Tribün Köşeleri', built: '-', capacity: 0, upgradeMultiplier: 0.8 }
  };

  const handleTribuneClick = (standKey) => {
    onShowTribuneUpgrade(stadiumData[standKey]);
  };

  const totalCapacity = Object.values(stadiumData).reduce((sum, stand) => sum + stand.capacity, 0);

  return (
    <div className="fc-modal-backdrop">
      <div className="fc-modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #2c466b, #1a365d)',
          padding: '20px',
          borderRadius: '8px 8px 0 0',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
            ESTADIO MUNICIPAL
          </div>
          <div style={{ fontSize: '16px' }}>
            Toplam Kapasite: {totalCapacity}
          </div>
        </div>

        <div className="fc-panel" style={{ padding: '20px' }}>
          {/* Stadyum Görseli */}
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
            </div>
          </div>

          {/* Stadyum Bilgileri */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              textAlign: 'center', 
              color: 'var(--blue)',
              fontSize: '18px'
            }}>
              STADYUM BİLGİLERİ
            </h4>
            
            <div style={{ 
              background: '#f5f5f5', 
              padding: '15px', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Kuzey Tribünü:</span>
                <span>İnşa Edildi: 2023 | Kapasite: 100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Doğu Tribünü:</span>
                <span>İnşa Edildi: 2023 | Kapasite: 200</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Güney Tribünü:</span>
                <span>İnşa Edildi: 2023 | Kapasite: 100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Batı Tribünü:</span>
                <span>İnşa Edildi: 2023 | Kapasite: 200</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Tribün Köşeleri:</span>
                <span>İnşa Edildi: - | Kapasite: 0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Saha (46/99):</span>
                <span>Toplam Kapasite: 600</span>
              </div>
            </div>
          </div>

          {/* Tribün Yönetimi */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              textAlign: 'center', 
              color: 'var(--blue)',
              fontSize: '16px'
            }}>
              TRIBÜN YÖNETİMİ
            </h4>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '10px',
              marginBottom: '15px'
            }}>
              {Object.keys(stadiumData).map((stand) => (
                <button
                  key={stand}
                  onClick={() => handleTribuneClick(stand)}
                  style={{
                    background: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--win)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f0f0f0';
                    e.target.style.color = '#333';
                  }}
                >
                  {stadiumData[stand].name}
                </button>
              ))}
            </div>
          </div>

          {/* Stadyum Yönetimi */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              textAlign: 'center', 
              color: 'var(--blue)',
              fontSize: '16px'
            }}>
              STADYUM YÖNETİMİ
            </h4>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '10px',
              marginBottom: '15px'
            }}>
              <button
                onClick={() => {
                  setShowStadium(false);
                  onShowFacilities();
                }}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#218838';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#28a745';
                }}
              >
                TESİSLER<br/><span style={{fontSize: '1.2em'}}>🏟️</span>
              </button>
              <button
                onClick={() => {
                  setShowStadium(false);
                  onShowPitchImprovement();
                }}
                style={{
                  background: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#138496';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#17a2b8';
                }}
              >
                SAHA İYİLEŞTİRME<br/><span style={{fontSize: '1.2em'}}>⚽</span>
              </button>
            </div>
          </div>
        </div>

        <div className="fc-footerbar">
          <button 
            className="fc-btn" 
            onClick={() => setShowStadium(false)}
          >
            Geri
          </button>
        </div>
      </div>
    </div>
  );
};

StadiumModal.propTypes = {
  setShowStadium: PropTypes.func.isRequired,
  onShowFacilities: PropTypes.func.isRequired,
  onShowTribuneUpgrade: PropTypes.func.isRequired,
  onShowPitchImprovement: PropTypes.func.isRequired,
};

export default StadiumModal;
