import React from 'react';
import PropTypes from 'prop-types';

const WeeklyReportModal = ({ setShowWeeklyReport, club }) => {
  // Şu anda gelir sistemi henüz eklenmemiş, sadece giderler var
  
  // Giderleri kategorilere ayır
     const calculateExpenseBreakdown = () => {
     let staffExpenses = 0;
     let facilityExpenses = 0;
     
     // Menajer maaşı
     if (club.manager && club.manager.salary) {
       staffExpenses += club.manager.salary;
     }
     
     // Oyuncu maaşları
     if (club.squad) {
       if (club.squad.firstTeam) {
         club.squad.firstTeam.forEach(player => {
           if (player.salary) {
             staffExpenses += player.salary;
           }
         });
       }
       if (club.squad.substitutes) {
         club.squad.substitutes.forEach(player => {
           if (player.salary) {
             staffExpenses += player.salary;
           }
         });
       }
     }
     
     // Tesis giderleri - haftalık maliyetler
     const antrenmanWeeklyFee = Math.round(Math.pow((club.antrenman || 37) / 10, 2.5) * 10);
     const altyapiWeeklyFee = Math.round(Math.pow((club.altyapi || 35) / 10, 2.5) * 10);
     facilityExpenses = antrenmanWeeklyFee + altyapiWeeklyFee;
     
     return { staffExpenses, facilityExpenses, antrenmanWeeklyFee, altyapiWeeklyFee };
   };
   
   const { staffExpenses, facilityExpenses, antrenmanWeeklyFee, altyapiWeeklyFee } = calculateExpenseBreakdown();
  
  return (
    <div className="fc-modal-backdrop">
      <div className="fc-modal">
        <h3>Hafta Sonu Raporu</h3>
        
        <div className="fc-panel">
          <div className="fc-row">
            <div className="fc-bank-icon">💰</div>
            <div>
              <div className="fc-bank-title">Haftalık Gider Raporu</div>
              <div className="fc-muted">Hafta {club.gameTime.week}</div>
            </div>
          </div>
          
          <div className="fc-fin-list">
            <div className="item">
              <span>Gelirler:</span>
              <span style={{ color: '#999', fontStyle: 'italic' }}>
                Henüz gelir sistemi eklenmedi
              </span>
            </div>
                                       <div className="item">
                <span>Giderler:</span>
                <span style={{ color: 'var(--loss)', fontWeight: 'bold' }}>
                  -{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(staffExpenses + facilityExpenses)}₺
                </span>
              </div>
             <div className="item" style={{ marginLeft: '20px', fontSize: '14px' }}>
               <span>• Personel Giderleri:</span>
               <span style={{ color: 'var(--loss)' }}>
                 -{new Intl.NumberFormat('tr-TR').format(staffExpenses)}₺
               </span>
             </div>
                           <div className="item" style={{ marginLeft: '20px', fontSize: '14px' }}>
                <span>• Tesis Giderleri:</span>
                <span style={{ color: 'var(--loss)' }}>
                  -{new Intl.NumberFormat('tr-TR').format(facilityExpenses)}₺
                </span>
              </div>
              <div className="item" style={{ marginLeft: '40px', fontSize: '12px' }}>
                <span>  - Antrenman Tesisleri:</span>
                <span style={{ color: 'var(--loss)' }}>
                  -{new Intl.NumberFormat('tr-TR').format(antrenmanWeeklyFee)}₺
                </span>
              </div>
              <div className="item" style={{ marginLeft: '40px', fontSize: '12px' }}>
                <span>  - Altyapı Tesisleri:</span>
                <span style={{ color: 'var(--loss)' }}>
                  -{new Intl.NumberFormat('tr-TR').format(altyapiWeeklyFee)}₺
                </span>
              </div>
            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #ddd' }} />
                         <div className="item" style={{ fontWeight: 'bold', fontSize: '16px' }}>
               <span>Net Sonuç:</span>
               <span style={{ color: 'var(--loss)' }}>
                 -{new Intl.NumberFormat('tr-TR').format(staffExpenses + facilityExpenses)}₺
               </span>
             </div>
          </div>
          
                     <div className="fc-cta">
             <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
               Yeni Bakiye: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(club.money)}₺
             </div>
             <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
               💡 Gelir sistemi yakında eklenecek (maç gelirleri, sponsorluk, vb.)
             </div>
           </div>
           
           <div style={{ 
             background: '#f8f9fa', 
             padding: '12px', 
             borderRadius: '8px', 
             marginTop: '10px',
             border: '1px solid #e9ecef'
           }}>
             <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--blue)' }}>
               Son Durum
             </div>
             <div style={{ fontSize: '14px', color: '#666' }}>
               Haftalık giderler düşüldükten sonra kalan bakiye: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(club.money)}₺
             </div>
           </div>
        </div>
        
        <div className="fc-footerbar">
          <button className="fc-btn" onClick={() => setShowWeeklyReport(false)}>
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};

WeeklyReportModal.propTypes = {
  setShowWeeklyReport: PropTypes.func.isRequired,
  club: PropTypes.shape({
    gameTime: PropTypes.shape({
      week: PropTypes.number.isRequired
    }).isRequired,
    money: PropTypes.number.isRequired,
    manager: PropTypes.shape({
      salary: PropTypes.number
    }),
    squad: PropTypes.shape({
      firstTeam: PropTypes.arrayOf(PropTypes.shape({
        salary: PropTypes.number
      })),
      substitutes: PropTypes.arrayOf(PropTypes.shape({
        salary: PropTypes.number
      }))
    }),
         antrenman: PropTypes.number,
     altyapi: PropTypes.number
   }).isRequired
 };

export default WeeklyReportModal;
