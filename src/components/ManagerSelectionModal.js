import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { generateManagerCandidates } from '../data/managerData';

const ManagerSelectionModal = ({ setShowManagerSelection, onManagerSelect, leagueName, teamValue = 50 }) => {
  const [selectedManager, setSelectedManager] = useState(null);
  const [managerCandidates, setManagerCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menajer adaylarını yükle
  React.useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true);
      try {
        const candidates = await generateManagerCandidates(leagueName, teamValue);
        setManagerCandidates(candidates);
      } catch (error) {
        console.error('Menajer adayları yüklenirken hata:', error);
        // Hata durumunda varsayılan adaylar oluştur
        const fallbackCandidates = [];
        for (let i = 0; i < 5; i++) {
          fallbackCandidates.push({
            name: `Menajer ${i + 1}`,
            management: 50,
            attacking: 50,
            tactical: 50,
            averageSkill: 50,
            salary: 1000,
            tactic: '4-4-2 Dikine Oyun',
            fanSupport: 'TAMAM',
            compensation: 0
          });
        }
        setManagerCandidates(fallbackCandidates);
      }
      setLoading(false);
    };
    
    loadCandidates();
  }, [leagueName, teamValue]);

  const handleManagerSelect = () => {
    if (selectedManager) {
      onManagerSelect(selectedManager);
      setShowManagerSelection(false);
    }
  };

  const handleRejectAndWait = () => {
    // Yeni menajer adayları oluştur
    generateManagerCandidates(leagueName);
    // Burada state'i güncellemek için bir callback gerekebilir
    // Şimdilik sadece modal'ı kapatıyoruz
    setShowManagerSelection(false);
  };

  const renderManagerCard = (manager) => (
    <div 
      key={manager.name}
      className={`fc-card ${selectedManager?.name === manager.name ? 'selected' : ''}`}
      onClick={() => setSelectedManager(manager)}
      style={{
        background: selectedManager?.name === manager.name ? 'var(--win)' : 'var(--green-light)',
        color: selectedManager?.name === manager.name ? '#fff' : 'var(--blue)',
        border: selectedManager?.name === manager.name ? '2px solid var(--win)' : '1px solid #ddd',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        padding: '15px',
        marginBottom: '10px'
      }}
    >
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr',
        gap: '15px',
        alignItems: 'start'
      }}>
        {/* Avatar */}
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#4CAF50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#fff'
        }}>
          {manager.name.split(' ')[0][0]}
        </div>
        
        {/* Manager Info Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr',
          gap: '8px'
        }}>
          {/* Name */}
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '16px',
            textAlign: 'center'
          }}>
            {manager.name}
          </div>
          
          {/* Attributes Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '6px', 
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            <span style={{
              background: '#4CAF50',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              M {manager.management}
            </span>
            <span style={{
              background: '#4CAF50',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              A {manager.attacking}
            </span>
            <span style={{
              background: '#4CAF50',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              T {manager.tactical}
            </span>
          </div>
          
          {/* Info Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr',
            gap: '4px',
            textAlign: 'center'
          }}>
            {/* Tactic */}
            <div style={{ fontSize: '14px' }}>
              {manager.tactic}
            </div>
            
            {/* Fan Support */}
            <div style={{ fontSize: '14px' }}>
              Taraftarlar: {manager.fanSupport}
            </div>
            
            {/* Average Skill */}
            <div style={{ fontSize: '14px' }}>
              Ortalama Yetenek: {manager.averageSkill || Math.round((manager.management + manager.attacking + manager.tactical) / 3)}
            </div>
            
            {/* Salary */}
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--blue)' }}>
              Maaş: {manager.salary ? `${manager.salary.toLocaleString()} TL` : 'Belirtilmemiş'}
            </div>
            

          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fc-modal-backdrop">
        <div className="fc-modal" style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
          <h3>BİR MENAJER KİRALA</h3>
          <div className="fc-panel">
            <h4 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>
              Menajer Adayları Yükleniyor
            </h4>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
              <div>Menajer adayları hazırlanıyor...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fc-modal-backdrop">
      <div className="fc-modal" style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
        <h3>BİR MENAJER KİRALA</h3>
        
        <div className="fc-panel">
          <h4 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>
            Menajer Adayları
          </h4>
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {managerCandidates.map(renderManagerCard)}
          </div>
        </div>
        
        <div className="fc-footerbar" style={{ marginTop: '20px' }}>
          <button
            className="fc-btn"
            onClick={handleManagerSelect}
            disabled={!selectedManager}
            style={{
              background: selectedManager ? 'var(--win)' : '#ccc',
              flex: 1,
              marginRight: '10px'
            }}
          >
            Menajeri Seç
          </button>
          <button
            className="fc-btn"
            onClick={handleRejectAndWait}
            style={{
              background: 'var(--green)',
              flex: 1
            }}
          >
            Reddet ve daha fazla aday bekle
          </button>
        </div>
      </div>
    </div>
  );
};

ManagerSelectionModal.propTypes = {
  setShowManagerSelection: PropTypes.func.isRequired,
  onManagerSelect: PropTypes.func.isRequired,
  leagueName: PropTypes.string.isRequired,
  teamValue: PropTypes.number,
};

export default ManagerSelectionModal;
