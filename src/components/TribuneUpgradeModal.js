import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TribuneUpgradeModal = ({ setShowTribuneUpgrade, selectedTribune, club, setClub }) => {
  const [newCapacity, setNewCapacity] = useState(selectedTribune.capacity);
  const [buildSpeed, setBuildSpeed] = useState('slow');

  const calculateBuildCost = (capacity, speed, multiplier) => {
    if (capacity <= selectedTribune.capacity) return 0;
    const baseCost = capacity * 10 * multiplier;
    return speed === 'fast' ? baseCost * 1.5 : baseCost;
  };

  const calculateBuildTime = (capacity, speed) => {
    const baseTime = Math.ceil(capacity / 50);
    return speed === 'fast' ? Math.ceil(baseTime / 2) : baseTime;
  };

  const buildCost = calculateBuildCost(newCapacity, buildSpeed, selectedTribune.upgradeMultiplier);
  const buildTime = calculateBuildTime(newCapacity, buildSpeed);

  const handleCapacityChange = (change) => {
    const newValue = Math.max(selectedTribune.capacity, Math.min(1000, newCapacity + change));
    setNewCapacity(newValue);
  };

  const handleRebuild = () => {
    if (buildCost <= club.money && newCapacity > selectedTribune.capacity) {
      setClub(prev => ({ ...prev, money: prev.money - buildCost }));
      selectedTribune.capacity = newCapacity;
      alert(`${selectedTribune.name} kapasitesi ${newCapacity} olarak güncellendi! Kalan bakiye: ${(club.money - buildCost).toLocaleString()} TL`);
      setShowTribuneUpgrade(false);
    } else if (newCapacity === selectedTribune.capacity) {
      alert('Tribün zaten mevcut kapasitede.');
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
            {selectedTribune.name.toUpperCase()}
          </div>
          <div style={{ fontSize: '16px' }}>
            Tribün Yükseltme
          </div>
        </div>

        <div className="fc-panel" style={{ padding: '20px' }}>
          {/* Tribün Görseli */}
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
              {/* Tribün çizgileri */}
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

          {/* Tribün Bilgileri */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              textAlign: 'center', 
              color: 'var(--blue)',
              fontSize: '18px'
            }}>
              TRIBÜN BİLGİLERİ
            </h4>
            
            <div style={{ 
              background: '#f5f5f5', 
              padding: '15px', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Mevcut Kapasite:</span>
                <span style={{ fontWeight: 'bold' }}>{selectedTribune.capacity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>İnşa Edildi:</span>
                <span>{selectedTribune.built}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Yükseltme Çarpanı:</span>
                <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>{selectedTribune.upgradeMultiplier}x</span>
              </div>
            </div>
          </div>

          {/* Kapasite Ayarlama */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              textAlign: 'center', 
              color: 'var(--blue)',
              fontSize: '16px'
            }}>
              KAPASİTE AYARLAMA
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
                onClick={() => handleCapacityChange(-50)}
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
                &lt;&lt; 50
              </button>
              <button 
                onClick={() => handleCapacityChange(-10)}
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
                &lt; 10
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
                {newCapacity}
              </div>
              <button 
                onClick={() => handleCapacityChange(10)}
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
                10 &gt;
              </button>
              <button 
                onClick={() => handleCapacityChange(50)}
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
                50 &gt;&gt;
              </button>
            </div>
          </div>

          {/* İnşa Detayları */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              textAlign: 'center', 
              color: 'var(--blue)',
              fontSize: '16px'
            }}>
              İNŞA DETAYLARI
            </h4>
            
            <div style={{ 
              background: '#f0f8ff', 
              padding: '15px', 
              borderRadius: '8px'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>İnşa Hızı:</span>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <button
                    onClick={() => setBuildSpeed('slow')}
                    style={{
                      background: buildSpeed === 'slow' ? 'var(--win)' : '#f0f0f0',
                      color: buildSpeed === 'slow' ? 'white' : '#333',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Yavaş
                  </button>
                  <button
                    onClick={() => setBuildSpeed('fast')}
                    style={{
                      background: buildSpeed === 'fast' ? 'var(--win)' : '#f0f0f0',
                      color: buildSpeed === 'fast' ? 'white' : '#333',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Hızlı
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>İnşa Maliyeti:</span>
                <span style={{ color: 'var(--loss)', fontWeight: 'bold' }}>{buildCost.toLocaleString()} TL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>İnşa Süresi:</span>
                <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>{buildTime} hafta</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>Banka Bakiyesi:</span>
                <span style={{ color: 'var(--win)', fontWeight: 'bold' }}>{club.money.toLocaleString()} TL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fc-footerbar">
          <button 
            className="fc-btn" 
            onClick={() => setShowTribuneUpgrade(false)}
          >
            Geri
          </button>
          <button 
            className="fc-btn" 
            style={{ 
              background: buildCost <= club.money && newCapacity > selectedTribune.capacity ? 'var(--win)' : '#ccc',
              cursor: buildCost <= club.money && newCapacity > selectedTribune.capacity ? 'pointer' : 'not-allowed'
            }}
            onClick={handleRebuild}
            disabled={buildCost > club.money || newCapacity <= selectedTribune.capacity}
          >
            {newCapacity > selectedTribune.capacity ? 'Yeniden İnşa Et' : 'Güncelle'}
          </button>
        </div>
      </div>
    </div>
  );
};

TribuneUpgradeModal.propTypes = {
  setShowTribuneUpgrade: PropTypes.func.isRequired,
  selectedTribune: PropTypes.object.isRequired,
  club: PropTypes.object.isRequired,
  setClub: PropTypes.func.isRequired,
};

export default TribuneUpgradeModal;
