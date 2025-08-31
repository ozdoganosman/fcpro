import React from 'react';
import PropTypes from 'prop-types';

const OtherMatchesModal = ({ setShowOtherMatches, club, fixtureData, currentMatchWeek }) => {
  const leagueFixtures = fixtureData[club.league] || [];
  const weekFixtures = leagueFixtures.filter(fixture => fixture.week === currentMatchWeek);
  const otherMatches = weekFixtures.filter(fixture => 
    fixture.homeTeam !== club.name && fixture.awayTeam !== club.name
  );
  
  console.log(`OtherMatchesModal - Hafta ${currentMatchWeek}:`);
  console.log(`- Toplam maç: ${weekFixtures.length}`);
  console.log(`- Oynanmış maç: ${weekFixtures.filter(f => f.played).length}`);
  console.log(`- Diğer maçlar: ${otherMatches.length}`);
  console.log(`- Kullanıcının maçı: ${weekFixtures.filter(f => (f.homeTeam === club.name || f.awayTeam === club.name) && f.played).length}`);

  const getResultColor = (result) => {
    if (!result) return '#ccc';
    const [homeScore, awayScore] = result.split('-').map(Number);
    if (homeScore > awayScore) return 'var(--win)';
    if (homeScore < awayScore) return 'var(--loss)';
    return 'var(--draw)';
  };

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
            HAFTA {currentMatchWeek} MAÇ SONUÇLARI
          </div>
          <div style={{ fontSize: '16px' }}>
            {club.league}
          </div>
        </div>

        <div className="fc-panel" style={{ padding: '20px' }}>
          {otherMatches.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              Bu hafta başka lig maçı oynanmadı
            </div>
          ) : (
            <div>
              <h4 style={{ 
                margin: '0 0 15px 0', 
                textAlign: 'center', 
                color: 'var(--blue)',
                fontSize: '16px'
              }}>
                DİĞER MAÇLAR
              </h4>
              
              <div style={{ 
                background: '#f9f9f9',
                borderRadius: '8px',
                padding: '15px'
              }}>
                {otherMatches.map((match, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    borderBottom: index < otherMatches.length - 1 ? '1px solid #eee' : 'none',
                    fontSize: '14px'
                  }}>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      {match.homeTeam}
                    </div>
                    <div style={{ 
                      margin: '0 15px',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      background: match.result ? getResultColor(match.result) : '#ccc',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      {match.result || 'Henüz oynanmadı'}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      {match.awayTeam}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="fc-footerbar">
          <button 
            className="fc-btn" 
            onClick={() => setShowOtherMatches(false)}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

OtherMatchesModal.propTypes = {
  setShowOtherMatches: PropTypes.func.isRequired,
  club: PropTypes.object.isRequired,
  fixtureData: PropTypes.object.isRequired,
  currentMatchWeek: PropTypes.number.isRequired,
};

export default OtherMatchesModal;
