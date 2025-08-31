import React from 'react';
import PropTypes from 'prop-types';

const YouthSquadModal = ({ setShowYouthSquad, club }) => {
  if (!club.youthSquad) {
    return (
      <div className="fc-modal-backdrop">
        <div className="fc-modal">
          <h3>ALTYAPI KADROSU BİLGİSİ YOK</h3>
          <p>Bu takım için altyapı kadrosu bilgisi bulunamadı.</p>
          <div className="fc-footerbar">
            <button className="fc-btn" onClick={() => setShowYouthSquad(false)}>Geri</button>
          </div>
        </div>
      </div>
    );
  }

  const renderPlayerRow = (player) => (
    <tr key={player.id}>
      <td style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            background: '#28a745',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            {player.name.split(' ')[0][0]}
          </div>
          {player.name}
        </div>
      </td>
      <td>
        <span style={{ 
          background: getPositionColor(player.position),
          color: '#fff',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {player.position}
        </span>
      </td>
      <td style={{ fontWeight: 'bold', color: '#28a745' }}>{player.rating}</td>
      <td style={{ color: '#666' }}>{player.age}</td>
    </tr>
  );

  const getPositionColor = (position) => {
    const colors = {
      'K': '#2c7b2c', // Yeşil
      'D': '#2c466b', // Mavi
      'O': '#b88c2c', // Altın
      'F': '#c33'     // Kırmızı
    };
    return colors[position] || '#999';
  };

  return (
    <div className="fc-modal-backdrop">
      <div className="fc-modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
        <h3>ALTYAPI KADROSU - {club.name}</h3>
        
        <div className="fc-panel" style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: '#28a745' }}>
            GENÇ OYUNCULAR ({club.youthSquad.length} oyuncu)
          </h4>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="fc-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Oyuncu</th>
                  <th>Poz</th>
                  <th>Rey</th>
                  <th>Yaş</th>
                </tr>
              </thead>
              <tbody>
                {club.youthSquad.map((player) => renderPlayerRow(player))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Altyapı İstatistikleri */}
        <div className="fc-panel" style={{ marginTop: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: '#28a745' }}>
            ALTYAPI İSTATİSTİKLERİ
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                {club.youthSquad.length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Toplam Oyuncu</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                {Math.round(club.youthSquad.reduce((sum, p) => sum + p.rating, 0) / club.youthSquad.length)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Ortalama Reyting</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                {Math.round(club.youthSquad.reduce((sum, p) => sum + p.age, 0) / club.youthSquad.length)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Ortalama Yaş</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                {club.youthSquad.filter(p => p.position === 'K').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Kaleci</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                {club.youthSquad.filter(p => p.position === 'D').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Defans</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                {club.youthSquad.filter(p => p.position === 'O').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Orta Saha</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                {club.youthSquad.filter(p => p.position === 'F').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Forvet</div>
            </div>
          </div>
        </div>

        <div className="fc-footerbar" style={{ marginTop: '20px' }}>
          <button className="fc-btn" onClick={() => setShowYouthSquad(false)}>Geri</button>
        </div>
      </div>
    </div>
  );
};

YouthSquadModal.propTypes = {
  setShowYouthSquad: PropTypes.func.isRequired,
  club: PropTypes.object.isRequired,
};

export default YouthSquadModal;
