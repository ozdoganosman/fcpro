import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { allSquads } from '../data';

const MatchPlayModal = ({ setShowMatchPlay, club, matchData, onMatchEnd }) => {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchEvents, setMatchEvents] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFastForward, setIsFastForward] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);

  const homeTeam = club.name;
  const awayTeam = matchData.awayTeam;

  const generateMatchEvent = (minute) => {
    // Gerçek oyuncu isimlerini al - tüm liglerde ara
    let homeSquad = null;
    let awaySquad = null;
    
    // Tüm liglerde takımları ara
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][homeTeam]) {
        homeSquad = allSquads[league][homeTeam];
      }
      if (allSquads[league][awayTeam]) {
        awaySquad = allSquads[league][awayTeam];
      }
    });
    
    const homePlayers = homeSquad ? [...homeSquad.firstTeam, ...homeSquad.substitutes].map(player => player.name) : [];
    const awayPlayers = awaySquad ? [...awaySquad.firstTeam, ...awaySquad.substitutes].map(player => player.name) : [];
    
    // Eğer kadro yoksa varsayılan isimler kullan
    const defaultHomePlayers = ['Alfaro', 'Valcarcel', 'Monreal', 'Olmo', 'Puente', 'Arroyo', 'Segarra', 'Ordoez', 'PGA', 'Jodar', 'Alonso'];
    const defaultAwayPlayers = ['Kaleci', 'Defans1', 'Defans2', 'Defans3', 'Defans4', 'Orta1', 'Orta2', 'Orta3', 'Forvet1', 'Forvet2', 'Forvet3'];
    
    const finalHomePlayers = homePlayers.length > 0 ? homePlayers : defaultHomePlayers;
    const finalAwayPlayers = awayPlayers.length > 0 ? awayPlayers : defaultAwayPlayers;
    
    // Daha gerçekçi olay olasılıkları
    const random = Math.random();
    let event;
    
    if (random < 0.15) { // %15 gol
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const player = team === 'home' ? 
        finalHomePlayers[Math.floor(Math.random() * finalHomePlayers.length)] :
        finalAwayPlayers[Math.floor(Math.random() * finalAwayPlayers.length)];
      const teamName = team === 'home' ? homeTeam : awayTeam;
      
      event = {
        minute: minute,
        type: 'goal',
        team: team,
        description: `${teamName}li ${player} muhteşem bir gol attı!`,
        player: player
      };
      
      if (team === 'home') {
        setHomeScore(prev => prev + 1);
      } else {
        setAwayScore(prev => prev + 1);
      }
    } else if (random < 0.25) { // %10 sarı kart
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const player = team === 'home' ? 
        finalHomePlayers[Math.floor(Math.random() * finalHomePlayers.length)] :
        finalAwayPlayers[Math.floor(Math.random() * finalAwayPlayers.length)];
      const teamName = team === 'home' ? homeTeam : awayTeam;
      
      event = {
        minute: minute,
        type: 'yellow',
        team: team,
        description: `${teamName}li ${player} sert müdahalesi nedeniyle sarı kart gördü!`,
        player: player
      };
    } else if (random < 0.28) { // %3 kırmızı kart
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const player = team === 'home' ? 
        finalHomePlayers[Math.floor(Math.random() * finalHomePlayers.length)] :
        finalAwayPlayers[Math.floor(Math.random() * finalAwayPlayers.length)];
      const teamName = team === 'home' ? homeTeam : awayTeam;
      
      event = {
        minute: minute,
        type: 'red',
        team: team,
        description: `${teamName}li ${player} çok sert müdahalesi nedeniyle kırmızı kart gördü!`,
        player: player
      };
    } else if (random < 0.32) { // %4 sakatlık
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const player = team === 'home' ? 
        finalHomePlayers[Math.floor(Math.random() * finalHomePlayers.length)] :
        finalAwayPlayers[Math.floor(Math.random() * finalAwayPlayers.length)];
      const teamName = team === 'home' ? homeTeam : awayTeam;
      const injuries = ['ayak bileği burkulması', 'kas yırtığı', 'menisküs yırtığı', 'çapraz bağ kopması', 'kırık ayak'];
      const injury = injuries[Math.floor(Math.random() * injuries.length)];
      
      event = {
        minute: minute,
        type: 'injury',
        team: team,
        description: `${teamName}li ${player} ${injury} nedeniyle sakatlandı!`,
        player: player,
        injuryType: injury
      };
    } else if (random < 0.40) { // %8 asist
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const player = team === 'home' ? 
        finalHomePlayers[Math.floor(Math.random() * finalHomePlayers.length)] :
        finalAwayPlayers[Math.floor(Math.random() * finalAwayPlayers.length)];
      const teamName = team === 'home' ? homeTeam : awayTeam;
      
      event = {
        minute: minute,
        type: 'assist',
        team: team,
        description: `${teamName}li ${player} mükemmel bir asist yaptı!`,
        player: player
      };
    } else { // %40 normal oyun
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const teamName = team === 'home' ? homeTeam : awayTeam;
      const actions = ['kaleci mükemmel kurtarış yaptı', 'kale direğinden döndü', 'ofsayt pozisyonu', 'korner kazandı', 'serbest vuruş kazandı'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      event = {
        minute: minute,
        type: 'action',
        team: team,
        description: `${teamName} ${action}!`
      };
    }

    setMatchEvents(prev => [...prev, event]);
  };

  const advanceTime = () => {
    if (currentMinute < 90) {
      const newMinute = currentMinute + 1;
      setCurrentMinute(newMinute);

      // Rastgele olay üretimi (düşük olasılık)
      if (Math.random() < 0.1) {
        generateMatchEvent(newMinute);
      }

      // Yarı zaman kontrolü
      if (newMinute === 45) {
        setMatchEvents(prev => [...prev, { minute: 45, type: 'half', description: 'İlk Yarı Sonu' }]);
      }
    } else {
      // Maç bitti
      setIsPlaying(false);
      setMatchEnded(true);
    }
  };

  const fastForwardToEnd = () => {
    setIsFastForward(true);
    setCurrentMinute(90);
    
    // Son dakikaya kadar hızlı ilerlet
    for (let i = currentMinute + 1; i <= 90; i++) {
      if (Math.random() < 0.15) {
        generateMatchEvent(i);
      }
    }
    
    setIsFastForward(false);
    setIsPlaying(false);
    setMatchEnded(true);
  };

  useEffect(() => {
    if (isPlaying && !isFastForward) {
      const interval = setInterval(() => {
        advanceTime();
      }, 500); // 1 saniyeden 500ms'ye düşürdük
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentMinute, isFastForward]);

  const renderTeamSquad = (teamName, squadType) => {
    // Tüm liglerde takımı ara
    let squad = null;
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][teamName]) {
        squad = allSquads[league][teamName];
      }
    });
    
    if (!squad) {
      return 'Kadro bilgisi bulunamadı';
    }
    
    const players = squadType === 'firstTeam' ? squad.firstTeam : squad.substitutes;
    
    if (!players || players.length === 0) {
      return 'Oyuncu bulunamadı';
    }
    
         return players.map((player, index) => (
       <div key={index} style={{ 
         display: 'flex', 
         justifyContent: 'space-between',
         padding: '2px 0',
         borderBottom: '1px solid #eee',
         whiteSpace: 'nowrap',
         overflow: 'hidden',
         textOverflow: 'ellipsis'
       }}>
         <span style={{ fontWeight: 'bold', flex: '1', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</span>
         <span style={{ color: '#666', marginLeft: '8px', whiteSpace: 'nowrap' }}>
           {player.position} • {player.rating}
         </span>
       </div>
     ));
  };

  const renderSuspendedInjured = (teamName) => {
    // Tüm liglerde takımı ara
    let squad = null;
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][teamName]) {
        squad = allSquads[league][teamName];
      }
    });
    
    if (!squad) {
      return 'Kadro bilgisi bulunamadı';
    }
    
    const allPlayers = [...squad.firstTeam, ...squad.substitutes];
    const suspendedInjured = allPlayers.filter(player => 
      player.suspended || player.injured
    );
    
    if (suspendedInjured.length === 0) {
      return 'Cezalı veya sakat oyuncu yok';
    }
    
         return suspendedInjured.map((player, index) => (
       <div key={index} style={{ 
         display: 'flex', 
         justifyContent: 'space-between',
         padding: '2px 0',
         borderBottom: '1px solid #eee',
         whiteSpace: 'nowrap',
         overflow: 'hidden',
         textOverflow: 'ellipsis'
       }}>
         <span style={{ fontWeight: 'bold', flex: '1', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</span>
         <span style={{ color: '#c00', marginLeft: '8px', whiteSpace: 'nowrap' }}>
           {player.suspended ? 'Cezalı' : 'Sakat'}
         </span>
       </div>
     ));
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow': return '🟨';
      case 'red': return '🟥';
      case 'injury': return '🏥';
      case 'assist': return '🎯';
      case 'action': return '⚡';
      case 'half': return '⏸️';
      default: return '📝';
    }
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
            {homeTeam} vs {awayTeam}
          </div>
          <div style={{ fontSize: '16px' }}>
            {matchData.type === 'friendly' ? 'Hazırlık Maçı' : club.league} - {currentMinute} dk
          </div>
        </div>

        <div className="fc-panel" style={{ padding: '20px' }}>
          {/* Skor Paneli */}
          <div style={{ 
            background: '#f5f5f5', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--blue)' }}>
              {homeScore} - {awayScore}
            </div>
            <div style={{ fontSize: '18px', marginTop: '10px' }}>
              {homeTeam} vs {awayTeam}
            </div>
          </div>

          {/* Maç Kontrolleri */}
          {!matchEnded ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                className="fc-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: isPlaying ? 'var(--loss)' : 'var(--win)',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {isPlaying ? 'Duraklat' : 'Başlat'}
              </button>
              <button
                className="fc-btn"
                onClick={fastForwardToEnd}
                style={{
                  background: 'var(--blue)',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Sona Atla
              </button>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                className="fc-btn"
                onClick={() => {
                  onMatchEnd({ homeScore, awayScore, events: matchEvents });
                  setShowMatchPlay(false);
                }}
                style={{
                  background: 'var(--win)',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Devam Et
              </button>
            </div>
          )}

                     {/* Maç Olayları ve Takım Kadroları */}
           <div style={{ marginBottom: '20px' }}>
             <div style={{ 
               display: 'grid',
               gridTemplateColumns: '1.2fr 1.6fr 1.2fr',
               gap: '20px',
               maxHeight: '500px',
               overflowY: 'auto'
             }}>
              {/* Sol: Ev Sahibi Takım */}
              <div style={{ 
                background: '#f9f9f9',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h5 style={{ 
                  margin: '0 0 10px 0', 
                  textAlign: 'center', 
                  color: 'var(--blue)',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {homeTeam}
                </h5>
                
                {/* İlk 11 */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    color: 'var(--blue)',
                    marginBottom: '5px'
                  }}>
                    İLK 11
                  </div>
                  <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
                    {renderTeamSquad(homeTeam, 'firstTeam')}
                  </div>
                </div>
                
                {/* Yedekler */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    color: 'var(--blue)',
                    marginBottom: '5px'
                  }}>
                    YEDEKLER
                  </div>
                  <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
                    {renderTeamSquad(homeTeam, 'substitutes')}
                  </div>
                </div>
                
                {/* Kart Cezalısı ve Sakatlar */}
                <div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    color: 'var(--blue)',
                    marginBottom: '5px'
                  }}>
                    CEZALI/SAKAT
                  </div>
                  <div style={{ fontSize: '11px', lineHeight: '1.3', color: '#666' }}>
                    {renderSuspendedInjured(homeTeam)}
                  </div>
                </div>
              </div>
              
              {/* Orta: Maç Olayları */}
              <div style={{ 
                background: '#f9f9f9',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h5 style={{ 
                  margin: '0 0 15px 0', 
                  textAlign: 'center', 
                  color: 'var(--blue)',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  MAÇ OLAYLARI
                </h5>
                
                <div style={{ 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  fontSize: '12px',
                  lineHeight: '1.4'
                }}>
                  {matchEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                      Henüz olay yok...
                    </div>
                  ) : (
                    matchEvents.map((event, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        padding: '6px',
                        borderBottom: '1px solid #eee',
                        fontSize: '11px'
                      }}>
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: 'var(--blue)',
                          marginRight: '8px',
                          minWidth: '25px'
                        }}>
                          {event.minute}&apos;
                        </span>
                        <span style={{ marginRight: '8px', fontSize: '14px' }}>
                          {getEventIcon(event.type)}
                        </span>
                        <span style={{ color: '#333', flex: 1 }}>
                          {event.description}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Sağ: Deplasman Takımı */}
              <div style={{ 
                background: '#f9f9f9',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h5 style={{ 
                  margin: '0 0 10px 0', 
                  textAlign: 'center', 
                  color: 'var(--blue)',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {awayTeam}
                </h5>
                
                {/* İlk 11 */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    color: 'var(--blue)',
                    marginBottom: '5px'
                  }}>
                    İLK 11
                  </div>
                  <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
                    {renderTeamSquad(awayTeam, 'firstTeam')}
                  </div>
                </div>
                
                {/* Yedekler */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    color: 'var(--blue)',
                    marginBottom: '5px'
                  }}>
                    YEDEKLER
                  </div>
                  <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
                    {renderTeamSquad(awayTeam, 'substitutes')}
                  </div>
                </div>
                
                {/* Kart Cezalısı ve Sakatlar */}
                <div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    color: 'var(--blue)',
                    marginBottom: '5px'
                  }}>
                    CEZALI/SAKAT
                  </div>
                  <div style={{ fontSize: '11px', lineHeight: '1.3', color: '#666' }}>
                    {renderSuspendedInjured(awayTeam)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

MatchPlayModal.propTypes = {
  setShowMatchPlay: PropTypes.func.isRequired,
  club: PropTypes.object.isRequired,
  matchData: PropTypes.object.isRequired,
  onMatchEnd: PropTypes.func.isRequired,
};

export default MatchPlayModal;
