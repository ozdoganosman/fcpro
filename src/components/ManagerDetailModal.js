import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ManagerDetailModal = ({ setShowManagerDetail, selectedManager, technicalStaff, onStaffHire }) => {
  const [activeTab, setActiveTab] = useState('records'); // 'records' or 'staff'
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  
  // Sadece seçilen menajer (yeni oyun başlangıcı)
  const managerRecords = [
    {
      name: selectedManager?.name || 'E FRIAS',
      avatar: selectedManager?.name?.split(' ')[0][0] || 'E',
      mbp: '-',
      cups: 0,
      period: 'Ağu 2024 -',
      stats: { played: 0, won: 0, drawn: 0, lost: 0 },
      status: 'current'
    }
  ];



  const renderManagerProfile = () => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '15px',
      padding: '15px',
      background: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      {/* Avatar */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#4CAF50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#fff'
      }}>
        {selectedManager?.name?.split(' ')[0][0] || 'E'}
      </div>
      
      {/* Manager Info */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '20px',
          marginBottom: '10px'
        }}>
          {selectedManager?.name || 'E FRIAS'}
        </div>
        
        {/* Attributes */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <span style={{
            background: '#4CAF50',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            M {selectedManager?.management || 37}
          </span>
          <span style={{
            background: '#4CAF50',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            A {selectedManager?.attacking || 37}
          </span>
          <span style={{
            background: '#4CAF50',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            T {selectedManager?.tactical || 38}
          </span>
        </div>
        
        {/* Tactic & Status */}
        <div style={{ fontSize: '16px', marginBottom: '5px' }}>
          {selectedManager?.tactic || '4-3-3 Pas Oyunu'}
        </div>
        <div style={{ fontSize: '16px', marginBottom: '5px' }}>
          86% mutlu
        </div>
        <div style={{ fontSize: '16px' }}>
          Ücret: 69 TL hftlk
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div style={{ display: 'flex', marginBottom: '20px' }}>
      <button
        onClick={() => setActiveTab('records')}
        style={{
          flex: 1,
          padding: '10px',
          background: activeTab === 'records' ? 'var(--win)' : '#fff',
          color: activeTab === 'records' ? '#fff' : '#666',
          border: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Menajer Rekorları
      </button>
      <button
        onClick={() => setActiveTab('staff')}
        style={{
          flex: 1,
          padding: '10px',
          background: activeTab === 'staff' ? 'var(--win)' : '#fff',
          color: activeTab === 'staff' ? '#fff' : '#666',
          border: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Teknik Kadro
      </button>
    </div>
  );

  const renderManagerRecords = () => (
    <div>
      {managerRecords.map((record, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          padding: '15px',
          background: '#fff',
          borderRadius: '8px',
          marginBottom: '10px',
          border: '1px solid #ddd'
        }}>
          {/* Avatar */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: record.status === 'current' ? '#4CAF50' : '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            {record.avatar}
          </div>
          
          {/* Record Info */}
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px',
              marginBottom: '5px'
            }}>
              {record.name} - {record.mbp} MBP, {record.cups} kupalar
            </div>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>
              {record.period} {record.status === 'fired' ? '(Kovuldu)' : ''}
            </div>
            <div style={{ fontSize: '14px' }}>
              O {record.stats.played} G {record.stats.won} B {record.stats.drawn} M {record.stats.lost}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleStaffHire = (staffType, index) => {
    const staffNames = {
      assistant: ['Ahmet Yılmaz', 'Mehmet Demir', 'Ali Kaya', 'Mustafa Özkan'],
      physio: ['Dr. Kemal Yıldız', 'Dr. Ayşe Demir', 'Dr. Hasan Kaya', 'Dr. Fatma Özkan'],
      coach: ['Burak Yılmaz', 'Emre Demir', 'Can Kaya', 'Deniz Özkan'],
      scout: ['Yusuf Yılmaz', 'Zeynep Demir', 'Yasin Kaya', 'Zara Özkan']
    };
    
    const staffTitles = {
      assistant: 'Asistan',
      physio: 'Fizyoterapist',
      coach: 'Antrenör',
      scout: 'Yetenek Avcısı'
    };
    
    const staffBonuses = {
      assistant: '+1 M (Yönetim)',
      physio: '+1 M (Yönetim)',
      coach: '+1 A (Hücum)',
      scout: '+1 T (Taktik)'
    };
    
    const randomName = staffNames[staffType][Math.floor(Math.random() * staffNames[staffType].length)];
    
    setConfirmData({
      name: randomName,
      title: staffTitles[staffType],
      bonus: staffBonuses[staffType],
      staffType,
      index
    });
    setShowConfirmModal(true);
  };

  const confirmHire = () => {
    if (confirmData) {
      onStaffHire(confirmData.staffType, confirmData.index, confirmData.name);
      setShowConfirmModal(false);
      setConfirmData(null);
    }
  };

  const renderConfirmModal = () => (
    <div className="fc-modal-backdrop" style={{ zIndex: 1000 }}>
      <div className="fc-modal" style={{ maxWidth: '400px' }}>
        <h3>Teknik Kadro Alımı</h3>
        <div className="fc-panel">
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            <strong>{confirmData?.name}</strong> isimli kişiyi <strong>{confirmData?.title}</strong> görevine almak istiyor musunuz?
          </p>
          <div style={{ 
            background: '#f0f8ff', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
                         <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--blue)', marginBottom: '5px' }}>
               Maaş: 70 TL
             </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Ek Bilgi: {confirmData?.title} {confirmData?.bonus} puanı sağlar.
            </div>
          </div>
        </div>
        <div className="fc-footerbar">
          <button className="fc-btn" onClick={() => setShowConfirmModal(false)}>
            İptal
          </button>
          <button className="fc-btn" style={{ background: 'var(--win)' }} onClick={confirmHire}>
            Al
          </button>
        </div>
      </div>
    </div>
  );

  const renderTechnicalStaff = () => (
    <div>
      {/* Asistan */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: 'var(--blue)' }}>Asistan</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {technicalStaff.assistant.map((staff, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: staff.filled ? '#f0f8ff' : (staff.available ? '#e8f5e8' : '#f5f5f5'),
                borderRadius: '8px',
                border: '1px solid #ddd',
                cursor: staff.available && !staff.filled ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (staff.available && !staff.filled) {
                  handleStaffHire('assistant', index);
                }
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: staff.filled ? '#4CAF50' : (staff.available ? '#28a745' : '#ccc'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                {staff.avatar || (staff.available ? '+' : '?')}
              </div>
              <span style={{ fontSize: '12px' }}>{staff.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fizyoterapist */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: 'var(--blue)' }}>Fizyoterapist</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {technicalStaff.physio.map((staff, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: staff.filled ? '#f0f8ff' : (staff.available ? '#e8f5e8' : '#f5f5f5'),
                borderRadius: '8px',
                border: '1px solid #ddd',
                cursor: staff.available && !staff.filled ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (staff.available && !staff.filled) {
                  handleStaffHire('physio', index);
                }
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: staff.filled ? '#4CAF50' : (staff.available ? '#28a745' : '#ccc'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                {staff.avatar || (staff.available ? '+' : '?')}
              </div>
              <span style={{ fontSize: '12px' }}>{staff.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Antrenör */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: 'var(--blue)' }}>Antrenör</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {technicalStaff.coach.map((staff, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: staff.filled ? '#f0f8ff' : (staff.available ? '#e8f5e8' : '#f5f5f5'),
                borderRadius: '8px',
                border: '1px solid #ddd',
                cursor: staff.available && !staff.filled ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (staff.available && !staff.filled) {
                  handleStaffHire('coach', index);
                }
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: staff.filled ? '#4CAF50' : (staff.available ? '#28a745' : '#ccc'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                {staff.avatar || (staff.available ? '+' : '?')}
              </div>
              <span style={{ fontSize: '12px' }}>{staff.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Yetenek Avcısı */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: 'var(--blue)' }}>Yetenek Avcısı</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {technicalStaff.scout.map((staff, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                background: staff.filled ? '#f0f8ff' : (staff.available ? '#e8f5e8' : '#f5f5f5'),
                borderRadius: '8px',
                border: '1px solid #ddd',
                cursor: staff.available && !staff.filled ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (staff.available && !staff.filled) {
                  handleStaffHire('scout', index);
                }
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: staff.filled ? '#4CAF50' : (staff.available ? '#28a745' : '#ccc'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                {staff.avatar || (staff.available ? '+' : '?')}
              </div>
              <span style={{ fontSize: '12px' }}>{staff.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fc-modal-backdrop">
        <div className="fc-modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
          <h3>MENAJRLR</h3>
          
          {renderManagerProfile()}
          {renderTabs()}
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {activeTab === 'records' ? renderManagerRecords() : renderTechnicalStaff()}
          </div>
          
          <div className="fc-footerbar" style={{ marginTop: '20px' }}>
            <button className="fc-btn" onClick={() => setShowManagerDetail(false)}>
              Geri
            </button>
            <button className="fc-btn" style={{ background: 'var(--loss)' }}>
              Menajeri Kov
            </button>
            <button className="fc-btn" style={{ background: 'var(--green)' }}>
              Diğer Mnjrlr
            </button>
          </div>
        </div>
      </div>
      {showConfirmModal && renderConfirmModal()}
    </>
  );
};

ManagerDetailModal.propTypes = {
  setShowManagerDetail: PropTypes.func.isRequired,
  selectedManager: PropTypes.object,
  technicalStaff: PropTypes.object.isRequired,
  onStaffHire: PropTypes.func.isRequired,
};

export default ManagerDetailModal;
