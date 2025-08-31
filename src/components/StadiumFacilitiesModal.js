import React, { useState } from 'react';
import PropTypes from 'prop-types';

const StadiumFacilitiesModal = ({ setShowStadiumFacilities, onShowStadium }) => {
  const [activeTab, setActiveTab] = useState('shopping');

  // Tesis verileri
  const facilitiesData = {
    food: {
      hamburgerTruck: { name: 'Hamburger Kamyoneti', level: 1, maxLevel: 5, icon: '🚚' },
      foodStall: { name: 'Yemek Tezgahı', level: 0, maxLevel: 5, icon: '🍔' },
      cafeBar: { name: 'Kafe/Bar', level: 0, maxLevel: 5, icon: '🍺' }
    },
    shopping: {
      giftCenter: { name: 'Hediye Merkezi', level: 1, maxLevel: 4, icon: '$' },
      salesBuffet: { name: 'Satış Büfesi', level: 0, maxLevel: 4, icon: '🛒' },
      clubStore: { name: 'Kulüp Mağazası', level: 0, maxLevel: 4, icon: '🏪' }
    }
  };

  const renderFacilitySlots = (facility) => {
    const slots = [];
    for (let i = 0; i < facility.maxLevel; i++) {
      const isActive = i < facility.level;
      slots.push(
        <div
          key={i}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: isActive ? 'var(--win)' : '#ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            margin: '0 2px'
          }}
        >
          {facility.icon}
        </div>
      );
    }
    return slots;
  };

  const getDescription = (category) => {
    if (category === 'food') {
      return 'yiyecek ve içecek satış noktanız 1,000\'e varan kalabalıkla başa çıkabilir ve satış başına ortalama 1.00 TL kar sağlayabilir.';
    } else {
      return 'takım eşyası alışverişi satış noktanız 2,000\'e varan kalabalıkla başa çıkabilir ve satış başına ortalama 2.00 TL kar sağlayabilir.';
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
            STADYUM TESİSLERİ
          </div>
          <div style={{ fontSize: '16px' }}>
            Tesis Yönetimi
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

          {/* Tab Butonları */}
          <div style={{ 
            display: 'flex', 
            marginBottom: '20px',
            background: '#f0f0f0',
            borderRadius: '8px',
            padding: '4px'
          }}>
            <button
              onClick={() => setActiveTab('food')}
              style={{
                flex: 1,
                background: activeTab === 'food' ? 'var(--win)' : 'transparent',
                color: activeTab === 'food' ? 'white' : '#666',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Yiyecek & İçecek
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              style={{
                flex: 1,
                background: activeTab === 'shopping' ? 'var(--win)' : 'transparent',
                color: activeTab === 'shopping' ? 'white' : '#666',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Alışveriş
            </button>
          </div>

          {/* Tesis Kategorileri */}
          <div style={{ marginBottom: '20px' }}>
            {Object.entries(facilitiesData[activeTab]).map(([key, facility]) => (
              <div key={key} style={{ 
                marginBottom: '15px',
                padding: '15px',
                background: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <span style={{ 
                    fontWeight: 'bold', 
                    fontSize: '16px',
                    color: 'var(--blue)'
                  }}>
                    {facility.name}
                  </span>
                  <span style={{ 
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    Seviye {facility.level}/{facility.maxLevel}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {renderFacilitySlots(facility)}
                </div>
              </div>
            ))}
          </div>

          {/* Açıklama Metni */}
          <div style={{ 
            background: '#e8f5e8', 
            padding: '15px', 
            borderRadius: '8px',
            fontSize: '14px',
            color: '#666',
            textAlign: 'center'
          }}>
            {getDescription(activeTab)}
          </div>
        </div>

        <div className="fc-footerbar">
          <button 
            className="fc-btn" 
            onClick={() => {
              setShowStadiumFacilities(false);
              onShowStadium();
            }}
          >
            Geri
          </button>
        </div>
      </div>
    </div>
  );
};

StadiumFacilitiesModal.propTypes = {
  setShowStadiumFacilities: PropTypes.func.isRequired,
  onShowStadium: PropTypes.func.isRequired,
};

export default StadiumFacilitiesModal;
