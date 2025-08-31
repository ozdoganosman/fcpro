import React from 'react';
import PropTypes from 'prop-types';

const FanSatisfactionModal = ({ setShowFanSatisfaction, club, turkishLeagues }) => {
  // Beklenti pozisyonunu hesapla (değere göre)
  const getExpectedPosition = (club) => {
    if (!turkishLeagues || !turkishLeagues[club.league]) {
      return club.lig || 10; // Fallback değer
    }
    
    const leagueTeams = turkishLeagues[club.league];
    const currentTeam = leagueTeams.find(team => team.name === club.name);
    
    if (!currentTeam) {
      return club.lig || 10; // Fallback değer
    }
    
    // Takımları değere göre sırala (en yüksek değer 1. olur)
    const sortedTeams = [...leagueTeams].sort((a, b) => b.value - a.value);
    
    // Mevcut takımın sıralamadaki pozisyonunu bul
    const expectedPosition = sortedTeams.findIndex(team => team.name === club.name) + 1;
    
    return expectedPosition;
  };

  const renderFanIcons = (percentage, count = 10) => {
    const filledCount = Math.round((percentage / 100) * count);
    const icons = [];
    
    for (let i = 0; i < count; i++) {
      const isFilled = i < filledCount;
      icons.push(
        <img
          key={i}
          src={isFilled ? '/Figures/human_filled_1024.png' : '/Figures/human_outline_1024.png'}
          alt="fan"
          style={{
            width: '20px',
            height: '20px',
            margin: '0 2px'
          }}
        />
      );
    }
    
    return icons;
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
            TARAFTARLAR NE KADAR MUTLU?
          </div>
          <div style={{ fontSize: '16px' }}>
            Taraftar Memnuniyeti
          </div>
        </div>

        <div className="fc-panel" style={{ padding: '20px' }}>
          {/* Memnuniyet Yüzdesi */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: 'var(--win)',
              marginBottom: '10px'
            }}>
              {club.taraftarMutlu}%
            </div>
            <div style={{ fontSize: '16px', color: '#666' }}>
              Taraftar Memnuniyeti
            </div>
          </div>

          

          {/* Menajer ve Başkan Memnuniyeti */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              textAlign: 'center', 
              color: 'var(--blue)',
              fontSize: '16px'
            }}>
              MUTLULUK/BEKLENTİLER
            </h4>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {renderFanIcons(club.taraftarMutlu)}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--win)', fontWeight: 'bold' }}>{club.taraftarMutlu}%</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>ile ilgili mutlu Menajer</div>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {renderFanIcons(club.baskanMutlu)}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--win)', fontWeight: 'bold' }}>{club.baskanMutlu}%</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>ile ilgili mutlu Başkan</div>
                </div>
              </div>
            </div>
            
                         <div style={{ 
               background: '#e8f5e8', 
               padding: '10px', 
               borderRadius: '6px',
               fontSize: '12px',
               color: '#666'
             }}>
               <div>• Beklenti: {getExpectedPosition(club)}.&apos;i {club.league}da bitirmek.</div>
               <div>• Atmosfer: Genellikle neşeli.</div>
             </div>
          </div>

          {/* Dünya Çapındaki Popülerlik */}
          <div>
            <h4 style={{ 
              margin: '0 0 15px 0', 
              textAlign: 'center', 
              color: 'var(--blue)',
              fontSize: '16px'
            }}>
              DÜNYA ÇAPINDAKİ POPÜLARİTE
            </h4>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {renderFanIcons(0, 10)}
              </div>
              <div style={{ color: '#999', fontWeight: 'bold' }}>0 / 10</div>
            </div>
            
            <div style={{ 
              background: '#f0f0f0', 
              padding: '10px', 
              borderRadius: '6px',
              fontSize: '12px',
              color: '#666',
              textAlign: 'center'
            }}>
              Büyük kupalar kazandıkça, yıldız oyuncularla sözleşme imzaladıkça ve yurtdışı ziyaretlere katıldıkça kulübünüzün dünya çapındaki popülaritesi artar.
            </div>
          </div>
        </div>

        <div className="fc-footerbar">
          <button 
            className="fc-btn" 
            onClick={() => setShowFanSatisfaction(false)}
          >
            Geri
          </button>
        </div>
      </div>
    </div>
  );
};

FanSatisfactionModal.propTypes = {
  setShowFanSatisfaction: PropTypes.func.isRequired,
  club: PropTypes.object.isRequired,
  turkishLeagues: PropTypes.object,
};

export default FanSatisfactionModal;
