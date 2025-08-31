import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { allSquads, allManagers } from '../data';

const SquadModal = ({ setShowSquad, club, selectedTeam = null, playerStats = {} }) => {
  const [activeTab, setActiveTab] = useState('squad'); // 'squad', 'stats', 'manager'
  // Eğer selectedTeam varsa o takımın kadrosunu göster, yoksa kendi kadrosunu
  const targetTeam = selectedTeam || club.name;
  const targetSquad = selectedTeam ? (() => {
    // Tüm liglerde takımı ara
    let foundSquad = null;
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][selectedTeam]) {
        foundSquad = allSquads[league][selectedTeam];
      }
    });
    return foundSquad;
  })() : club.squad;
  
  if (!targetSquad) {
    return (
      <div className="fc-modal-backdrop">
        <div className="fc-modal">
          <h3>KADRO BİLGİSİ YOK</h3>
          <p>{targetTeam} takımı için kadro bilgisi bulunamadı.</p>
          <div className="fc-footerbar">
            <button className="fc-btn" onClick={() => setShowSquad(false)}>Geri</button>
          </div>
        </div>
      </div>
    );
  }

  const { firstTeam, substitutes } = targetSquad;
  
  // Menajer bilgilerini bul
  const targetManager = selectedTeam ? (() => {
    let foundManager = null;
    Object.keys(allManagers).forEach(league => {
      if (allManagers[league][selectedTeam]) {
        foundManager = allManagers[league][selectedTeam];
      }
    });
    return foundManager;
  })() : club.manager;
  
  // Tüm oyuncuları pozisyonlarına göre sırala
  const allPlayers = [...firstTeam, ...substitutes].sort((a, b) => {
    const positionOrder = { 'K': 1, 'D': 2, 'O': 3, 'F': 4 };
    return positionOrder[a.position] - positionOrder[b.position];
  });

  const renderTabs = () => (
    <div style={{ display: 'flex', marginBottom: '20px' }}>
      <button
        onClick={() => setActiveTab('squad')}
        style={{
          flex: 1,
          padding: '10px',
          background: activeTab === 'squad' ? 'var(--win)' : '#fff',
          color: activeTab === 'squad' ? '#fff' : '#666',
          border: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        KADRO
      </button>
      <button
        onClick={() => setActiveTab('stats')}
        style={{
          flex: 1,
          padding: '10px',
          background: activeTab === 'stats' ? 'var(--win)' : '#fff',
          color: activeTab === 'stats' ? '#fff' : '#666',
          border: '1px solid #ddd',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        İSTATİSTİKLER
      </button>
      {targetManager && (
        <button
          onClick={() => setActiveTab('manager')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'manager' ? 'var(--win)' : '#fff',
            color: activeTab === 'manager' ? '#fff' : '#666',
            border: '1px solid #ddd',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          MENAJER
        </button>
      )}
    </div>
  );

  const renderManagerTab = () => {
    if (!targetManager) return <div>Menajer bilgisi bulunamadı.</div>;
    
    return (
      <div>
        <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: 'var(--blue)' }}>
          MENAJER BİLGİLERİ
        </h4>
        
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
          <h5 style={{ margin: '0 0 10px 0', color: 'var(--blue)' }}>{targetManager.name}</h5>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '14px', marginBottom: '15px' }}>
            <div style={{ textAlign: 'center', padding: '8px', background: '#fff', borderRadius: '5px' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--blue)' }}>M</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{targetManager.management}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Menajer</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: '#fff', borderRadius: '5px' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--blue)' }}>A</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{targetManager.attacking}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Hücum</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: '#fff', borderRadius: '5px' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--blue)' }}>T</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{targetManager.tactical}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Taktik</div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '10px', background: '#fff', borderRadius: '5px', marginBottom: '15px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>ORTALAMA SEVİYE</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--win)' }}>{targetManager.averageSkill}</div>
          </div>
          
          <div style={{ padding: '10px', background: '#fff', borderRadius: '5px' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Futbol Anlayışı:</strong> {targetManager.philosophy}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Favori Taktik:</strong> {targetManager.tactic}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Maaş:</strong> ₺{targetManager.salary?.toLocaleString()}
            </div>
            <div>
              <strong>Taraftar Desteği:</strong> {targetManager.fanSupport}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStatsTab = () => {
    const playersWithCards = Object.entries(playerStats)
      .filter(([, stats]) => stats.yellowCards > 0 || stats.redCards > 0)
      .sort((a, b) => (b[1].redCards * 2 + b[1].yellowCards) - (a[1].redCards * 2 + a[1].yellowCards));

    const injuredPlayers = Object.entries(playerStats)
      .filter(([, stats]) => stats.injuries && stats.injuries.length > 0)
      .sort((a, b) => b[1].injuries.length - a[1].injuries.length);

    const playersWithGoals = Object.entries(playerStats)
      .filter(([, stats]) => (stats.goals > 0 || stats.assists > 0))
      .sort((a, b) => (b[1].goals * 3 + b[1].assists) - (a[1].goals * 3 + a[1].assists));

    return (
      <div>
        <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: 'var(--blue)' }}>
          OYUNCU İSTATİSTİKLERİ
        </h4>
        
        {/* Kartlar */}
        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ margin: '0 0 10px 0', color: 'var(--blue)' }}>KART İSTATİSTİKLERİ</h5>
          {playersWithCards.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              Henüz kart gören oyuncu yok
            </div>
          ) : (
            <table className="fc-table">
              <thead>
                <tr>
                  <th>Oyuncu</th>
                  <th>🟨 Sarı</th>
                  <th>🟥 Kırmızı</th>
                  <th>Ceza Durumu</th>
                </tr>
              </thead>
              <tbody>
                {playersWithCards.map(([playerName, stats]) => {
                  const totalYellow = stats.yellowCards || 0;
                  const totalRed = stats.redCards || 0;
                  const yellowSuspension = Math.floor(totalYellow / 4);
                  const redSuspension = totalRed * (2 + Math.floor(Math.random() * 3)); // 2-4 maç
                  const totalSuspension = yellowSuspension + redSuspension;
                  
                  return (
                    <tr key={playerName}>
                      <td>{playerName}</td>
                      <td>{totalYellow}</td>
                      <td>{totalRed}</td>
                      <td>
                        {totalSuspension > 0 ? (
                          <span style={{ 
                            background: 'var(--loss)', 
                            color: '#fff', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {totalSuspension} maç ceza
                          </span>
                        ) : (
                          <span style={{ color: 'var(--win)' }}>Temiz</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Sakatlıklar */}
        <div style={{ marginBottom: '20px' }}>
          <h5 style={{ margin: '0 0 10px 0', color: 'var(--blue)' }}>SAKATLIK İSTATİSTİKLERİ</h5>
          {injuredPlayers.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              Henüz sakatlanan oyuncu yok
            </div>
          ) : (
            <div>
              {injuredPlayers.map(([playerName, stats]) => (
                <div key={playerName} style={{ 
                  marginBottom: '10px',
                  padding: '10px',
                  background: '#f5f5f5',
                  borderRadius: '6px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {playerName}
                  </div>
                  {stats.injuries.map((injury, index) => (
                    <div key={index} style={{ 
                      marginBottom: '3px',
                      fontSize: '13px',
                      color: '#666'
                    }}>
                      • {injury.type} - {injury.matchesOut} maç yok
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gol/Asist */}
        <div>
          <h5 style={{ margin: '0 0 10px 0', color: 'var(--blue)' }}>GOL VE ASİST İSTATİSTİKLERİ</h5>
          {playersWithGoals.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              Henüz gol/asist yapan oyuncu yok
            </div>
          ) : (
            <table className="fc-table">
              <thead>
                <tr>
                  <th>Oyuncu</th>
                  <th>⚽ Gol</th>
                  <th>🎯 Asist</th>
                  <th>Toplam Puan</th>
                </tr>
              </thead>
              <tbody>
                {playersWithGoals.map(([playerName, stats]) => {
                  const goals = stats.goals || 0;
                  const assists = stats.assists || 0;
                  const totalPoints = goals * 3 + assists;
                  
                  return (
                    <tr key={playerName}>
                      <td>{playerName}</td>
                      <td>{goals}</td>
                      <td>{assists}</td>
                      <td style={{ fontWeight: 'bold', color: 'var(--win)' }}>
                        {totalPoints}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  const renderFormFitnessMorale = (formData) => {
    const form = formData[0]?.value || 0;
    const fitness = formData[1]?.value || 0;
    const morale = formData[2]?.value || 0;
    
    return (
      <div style={{ display: 'flex', gap: '2px', fontSize: '11px' }}>
        <span style={{ 
          color: form > 0 ? 'green' : form < 0 ? 'red' : '#999', 
          fontWeight: 'bold',
          background: '#f5f5f5',
          padding: '1px 3px',
          borderRadius: '2px',
          minWidth: '20px',
          textAlign: 'center'
        }}>
          {form > 0 ? `+${form}` : form < 0 ? form : '-'}
        </span>
        <span style={{ 
          color: fitness > 0 ? 'green' : fitness < 0 ? 'red' : '#999', 
          fontWeight: 'bold',
          background: '#f5f5f5',
          padding: '1px 3px',
          borderRadius: '2px',
          minWidth: '20px',
          textAlign: 'center'
        }}>
          {fitness > 0 ? `+${fitness}` : fitness < 0 ? fitness : '-'}
        </span>
        <span style={{ 
          color: morale > 0 ? 'green' : morale < 0 ? 'red' : '#999', 
          fontWeight: 'bold',
          background: '#f5f5f5',
          padding: '1px 3px',
          borderRadius: '2px',
          minWidth: '20px',
          textAlign: 'center'
        }}>
          {morale > 0 ? `+${morale}` : morale < 0 ? morale : '-'}
        </span>
      </div>
    );
  };

     const renderPlayerRow = (player) => (
     <tr key={player.id}>
       <td style={{ textAlign: 'left' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <div style={{ 
             width: '24px', 
             height: '24px', 
             borderRadius: '50%', 
             background: getPositionColor(player.position),
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
       <td style={{ fontWeight: 'bold' }}>{player.rating}</td>
       <td>
         <div style={{ display: 'flex', gap: '4px' }}>
           {renderFormFitnessMorale(player.form)}
         </div>
       </td>
       <td>{player.age}</td>
       <td style={{ fontWeight: 'bold', color: 'var(--blue)' }}>
         {player.salary?.toLocaleString() || '0'} TL
       </td>
       <td>{player.contractEnd}</td>
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
      <div className="fc-modal" style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
        <h3>KADRO - {targetTeam}</h3>
        
        {renderTabs()}
        
                 {activeTab === 'squad' && (
           <div className="fc-panel">
             <h4 style={{ margin: '0 0 15px 0', textAlign: 'center', color: 'var(--blue)' }}>
               KADRO ({allPlayers.length} oyuncu)
             </h4>
             <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
               <table className="fc-table">
                 <thead>
                   <tr>
                     <th style={{ textAlign: 'left' }}>Oyuncu</th>
                     <th>Rey</th>
                     <th>Form/Fit/Mut</th>
                     <th>Yaş</th>
                     <th>Maaş</th>
                     <th>Söz Bit</th>
                   </tr>
                 </thead>
                 <tbody>
                   {allPlayers.map((player, index) => renderPlayerRow(player, index))}
                 </tbody>
               </table>
             </div>
           </div>
         )}
          
          {activeTab === 'stats' && (
            <div className="fc-panel">
              {renderStatsTab()}
            </div>
          )}
          
          {activeTab === 'manager' && (
            <div className="fc-panel">
              {renderManagerTab()}
            </div>
          )}

        <div className="fc-footerbar" style={{ marginTop: '20px' }}>
          <button className="fc-btn" onClick={() => setShowSquad(false)}>Geri</button>
        </div>
      </div>
    </div>
  );
};

SquadModal.propTypes = {
  setShowSquad: PropTypes.func.isRequired,
  club: PropTypes.object.isRequired,
  selectedTeam: PropTypes.string,
  playerStats: PropTypes.object,
};

export default SquadModal;
