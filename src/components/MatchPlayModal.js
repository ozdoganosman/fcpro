import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { allSquads, allManagers } from '../data';

const MatchPlayModal = ({ setShowMatchPlay, club, matchData, onMatchEnd, playerEnergies, setPlayerEnergies }) => {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchEvents, setMatchEvents] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFastForward, setIsFastForward] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);
  const [preCalculatedMatch, setPreCalculatedMatch] = useState(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  
  // Yeni state değişkenleri
  const [homeSubstitutions, setHomeSubstitutions] = useState(0);
  const [awaySubstitutions, setAwaySubstitutions] = useState(0);
  const [homeSuspended, setHomeSuspended] = useState([]);
  const [awaySuspended, setAwaySuspended] = useState([]);
  const [homeInjured, setHomeInjured] = useState([]);
  const [awayInjured, setAwayInjured] = useState([]);
  const [homeSubstitutedPlayers, setHomeSubstitutedPlayers] = useState([]);
  const [awaySubstitutedPlayers, setAwaySubstitutedPlayers] = useState([]);
  const [homeYellowCards, setHomeYellowCards] = useState({}); // Oyuncu adı -> sarı kart sayısı
  const [awayYellowCards, setAwayYellowCards] = useState({});

  const homeTeam = club.name;
  const awayTeam = matchData.awayTeam;

  // Maçı önceden hesaplama fonksiyonu
  const preCalculateMatch = () => {
    // Maç öncesi enerjileri hesapla
    calculatePreMatchEnergies();
    
    const events = [];
    let homeScore = 0;
    let awayScore = 0;
    
    // 90 dakika boyunca olayları hesapla
    for (let minute = 1; minute <= 90; minute++) {
      // Yarı zaman kontrolü
      if (minute === 45) {
        events.push({ minute: 45, type: 'half', description: '⏸️ İlk Yarı Sonu' });
        continue;
      }
      
      // Kart olayları (%8 olasılık)
      if (Math.random() < 0.08) {
        const cardTeam = Math.random() < 0.5 ? 'home' : 'away';
        const teamName = cardTeam === 'home' ? homeTeam : awayTeam;
        const squad = Object.keys(allSquads).find(league => allSquads[league][teamName]) ? 
          allSquads[Object.keys(allSquads).find(league => allSquads[league][teamName])][teamName] : null;
        
        if (squad && squad.firstTeam.length > 0) {
          const player = squad.firstTeam[Math.floor(Math.random() * squad.firstTeam.length)];
          const cardType = Math.random() < 0.7 ? 'yellow' : 'red';
          
          events.push({
            minute: minute,
            type: 'card',
            team: cardTeam,
            player: player,
            cardType: cardType,
            description: `${minute}' ${cardType === 'yellow' ? '🟡' : '🔴'} ${player.name} ${cardType === 'yellow' ? 'sarı kart' : 'kırmızı kart'} gördü`
          });
        }
      }
      
      // Sakatlık olayları (%3 olasılık)
      if (Math.random() < 0.03) {
        const injuryTeam = Math.random() < 0.5 ? 'home' : 'away';
        const teamName = injuryTeam === 'home' ? homeTeam : awayTeam;
        const squad = Object.keys(allSquads).find(league => allSquads[league][teamName]) ? 
          allSquads[Object.keys(allSquads).find(league => allSquads[league][teamName])][teamName] : null;
        
        if (squad && squad.firstTeam.length > 0) {
          // Enerjisi düşük oyuncuların sakatlanma ihtimali daha yüksek
          const availablePlayers = squad.firstTeam.filter(p => p.energy > 0);
          if (availablePlayers.length > 0) {
            // Enerji seviyesine göre ağırlıklı seçim
            const weights = availablePlayers.map(p => Math.max(0.1, 1 - (p.energy / 100)));
            const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
            let random = Math.random() * totalWeight;
            let selectedIndex = 0;
            
            for (let i = 0; i < weights.length; i++) {
              random -= weights[i];
              if (random <= 0) {
                selectedIndex = i;
                break;
              }
            }
            
            const player = availablePlayers[selectedIndex];
            events.push({
              minute: minute,
              type: 'injury',
              team: injuryTeam,
              player: player,
              description: `${minute}' 🏥 ${player.name} sakatlandı`
            });
          }
        }
      }
      
      // Pozisyon başlatma olasılığı (%15)
      if (Math.random() < 0.15) {
        const homeStrength = calculateTeamStrength(homeTeam);
        const awayStrength = calculateTeamStrength(awayTeam);
        
        // Hangi takımın pozisyonu olacağını belirle
        const totalStrength = homeStrength + awayStrength;
        const homeChance = homeStrength / totalStrength;
        const attackingTeam = Math.random() < homeChance ? 'home' : 'away';
        const defendingTeam = attackingTeam === 'home' ? 'away' : 'home';
        
        // Rastgele senaryo seç
        const scenario = positionScenarios[Math.floor(Math.random() * positionScenarios.length)];
        
        // Oyuncuları seç
        const attackingSquad = attackingTeam === 'home' ? 
          Object.keys(allSquads).find(league => allSquads[league][homeTeam]) ? 
            allSquads[Object.keys(allSquads).find(league => allSquads[league][homeTeam])][homeTeam] : null :
          Object.keys(allSquads).find(league => allSquads[league][awayTeam]) ? 
            allSquads[Object.keys(allSquads).find(league => allSquads[league][awayTeam])][awayTeam] : null;
        
        const defendingSquad = defendingTeam === 'home' ? 
          Object.keys(allSquads).find(league => allSquads[league][homeTeam]) ? 
            allSquads[Object.keys(allSquads).find(league => allSquads[league][homeTeam])][homeTeam] : null :
          Object.keys(allSquads).find(league => allSquads[league][awayTeam]) ? 
            allSquads[Object.keys(allSquads).find(league => allSquads[league][awayTeam])][awayTeam] : null;
        
        if (attackingSquad && defendingSquad) {
          // Pozisyon için oyuncuları seç
          const players = {
            attackingPlayer: attackingSquad.firstTeam[Math.floor(Math.random() * attackingSquad.firstTeam.length)],
            defendingPlayer: defendingSquad.firstTeam[Math.floor(Math.random() * defendingSquad.firstTeam.length)],
            midfielder: attackingSquad.firstTeam.filter(p => p.position === 'O')[Math.floor(Math.random() * attackingSquad.firstTeam.filter(p => p.position === 'O').length)] || attackingSquad.firstTeam[0],
            goalkeeper: defendingSquad.firstTeam.filter(p => p.position === 'K')[0] || defendingSquad.firstTeam[0],
            cornerTaker: attackingSquad.firstTeam[Math.floor(Math.random() * attackingSquad.firstTeam.length)],
            freeKickTaker: attackingSquad.firstTeam[Math.floor(Math.random() * attackingSquad.firstTeam.length)],
            passer: attackingSquad.firstTeam[Math.floor(Math.random() * attackingSquad.firstTeam.length)],
            headerPlayer: attackingSquad.firstTeam.filter(p => p.position === 'F')[Math.floor(Math.random() * attackingSquad.firstTeam.filter(p => p.position === 'F').length)] || attackingSquad.firstTeam[0],
            winger: attackingSquad.firstTeam.filter(p => p.position === 'O')[Math.floor(Math.random() * attackingSquad.firstTeam.filter(p => p.position === 'O').length)] || attackingSquad.firstTeam[0],
            striker: attackingSquad.firstTeam.filter(p => p.position === 'F')[Math.floor(Math.random() * attackingSquad.firstTeam.filter(p => p.position === 'F').length)] || attackingSquad.firstTeam[0],
            passer1: attackingSquad.firstTeam[Math.floor(Math.random() * attackingSquad.firstTeam.length)],
            passer2: attackingSquad.firstTeam[Math.floor(Math.random() * attackingSquad.firstTeam.length)],
            passer3: attackingSquad.firstTeam[Math.floor(Math.random() * attackingSquad.firstTeam.length)]
          };
          
          // Pozisyon adımlarını oluştur
          for (let step = 0; step < scenario.steps.length; step++) {
            const stepText = scenario.steps[step];
            let description = stepText;
            
            // Oyuncu isimlerini yerleştir
            Object.keys(players).forEach(key => {
              const player = players[key];
              if (player && player.name) {
                description = description.replace(`{${key}}`, player.name);
              }
            });
            
            // Takım isimlerini yerleştir
            description = description.replace('{attackingTeam}', attackingTeam === 'home' ? homeTeam : awayTeam);
            description = description.replace('{defendingTeam}', defendingTeam === 'home' ? homeTeam : awayTeam);
            
            events.push({
              minute: minute,
              type: 'position',
              team: attackingTeam,
              description: description,
              step: step + 1,
              totalSteps: scenario.steps.length
            });
          }
          
          // Pozisyon sonucunu belirle
          const attackingStrength = calculateTeamStrength(attackingTeam === 'home' ? homeTeam : awayTeam);
          const defendingStrength = calculateTeamStrength(defendingTeam === 'home' ? homeTeam : awayTeam);
          
          const successChance = attackingStrength / (attackingStrength + defendingStrength);
          const random = Math.random();
          
          if (random < successChance * 0.3) { // %30 şans gol
            const scorer = attackingSquad.firstTeam[Math.floor(Math.random() * attackingSquad.firstTeam.length)];
            
            events.push({
              minute: minute,
              type: 'goal',
              team: attackingTeam,
              description: `⚽ GOL! ${attackingTeam === 'home' ? homeTeam : awayTeam}li ${scorer ? scorer.name : 'Oyuncu'} gol attı!`,
              player: scorer ? scorer.name : 'Oyuncu'
            });
            
            if (attackingTeam === 'home') {
              homeScore++;
            } else {
              awayScore++;
            }
          } else if (random < successChance * 0.6) { // %30 şans korner
            events.push({
              minute: minute,
              type: 'corner',
              team: attackingTeam,
              description: `Korner vuruşu ${attackingTeam === 'home' ? homeTeam : awayTeam} için`
            });
          } else { // %40 şans pozisyon kayboldu
            events.push({
              minute: minute,
              type: 'position_lost',
              team: defendingTeam,
              description: `Pozisyon ${defendingTeam === 'home' ? homeTeam : awayTeam} tarafından temizlendi`
            });
          }
        }
      }
      
      // Diğer olaylar (kart, sakatlık vb.)
      const random = Math.random();
      
      if (random < 0.015) { // %1.5 sarı kart (azaltıldı)
        const team = Math.random() < 0.5 ? 'home' : 'away';
        const teamName = team === 'home' ? homeTeam : awayTeam;
        
        let squad = null;
        Object.keys(allSquads).forEach(league => {
          if (allSquads[league][teamName]) {
            squad = allSquads[league][teamName];
          }
        });
        
        const player = squad ? squad.firstTeam[Math.floor(Math.random() * squad.firstTeam.length)] : null;
        
        events.push({
          minute: minute,
          type: 'yellow',
          team: team,
          description: `🟨 ${teamName}li ${player ? player.name : 'Oyuncu'} sert müdahalesi nedeniyle sarı kart gördü!`,
          player: player
        });
      } else if (random < 0.016) { // %0.1 kırmızı kart (çok azaltıldı)
        const team = Math.random() < 0.5 ? 'home' : 'away';
        const teamName = team === 'home' ? homeTeam : awayTeam;
        
        let squad = null;
        Object.keys(allSquads).forEach(league => {
          if (allSquads[league][teamName]) {
            squad = allSquads[league][teamName];
          }
        });
        
        const player = squad ? squad.firstTeam[Math.floor(Math.random() * squad.firstTeam.length)] : null;
        
        events.push({
          minute: minute,
          type: 'red',
          team: team,
          description: `🟥 ${teamName}li ${player ? player.name : 'Oyuncu'} çok sert müdahalesi nedeniyle kırmızı kart gördü!`,
          player: player
        });
      } else if (random < 0.035) { // %3.5 sakatlık kontrolü (normal seviye)
        const team = Math.random() < 0.5 ? 'home' : 'away';
        const teamName = team === 'home' ? homeTeam : awayTeam;
        
        let squad = null;
        Object.keys(allSquads).forEach(league => {
          if (allSquads[league][teamName]) {
            squad = allSquads[league][teamName];
          }
        });
        
        if (squad && squad.firstTeam.length > 0) {
          // Sakat olmayan oyuncuları filtrele
          const availablePlayers = squad.firstTeam.filter(player => {
            // Bu oyuncunun daha önce sakatlanıp sakatlanmadığını kontrol et
            const alreadyInjured = events.some(event => 
              event.type === 'injury' && 
              event.player && 
              event.player.name === player.name
            );
            return !alreadyInjured;
          });
          
          if (availablePlayers.length > 0) {
            // Enerjisi en düşük oyuncuyu seç
            const player = availablePlayers.reduce((lowest, p) => 
              p.energy < lowest.energy ? p : lowest, availablePlayers[0]);
            
            // Enerji bazlı sakatlık ihtimali: %0.5 / (enerji/100)
            // Enerji 100% ise: %0.5 / 1 = %0.5
            // Enerji 50% ise: %0.5 / 0.5 = %1
            // Enerji 25% ise: %0.5 / 0.25 = %2
            const injuryChance = 0.5 / (player.energy / 100);
            
            if (Math.random() < injuryChance / 100) { // Yüzdelik değeri 100'e böl (normal seviye)
              const injuries = ['ayak bileği burkulması', 'kas yırtığı', 'menisküs yırtığı', 'çapraz bağ kopması', 'kırık ayak'];
              const injury = injuries[Math.floor(Math.random() * injuries.length)];
              
              events.push({
                minute: minute,
                type: 'injury',
                team: team,
                description: `🏥 ${teamName}li ${player.name} ${injury} nedeniyle sakatlandı! (Enerji: %${Math.round(player.energy)})`,
                player: player,
                injuryType: injury
              });
            }
          }
        }
      }
    }
    
    return { events, homeScore, awayScore };
  };

  // Takım reyting ortalamasını hesaplama fonksiyonu
  const calculateTeamRating = (teamName) => {
    let squad = null;
    
    // Tüm liglerde takımı ara
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][teamName]) {
        squad = allSquads[league][teamName];
      }
    });
    
    if (!squad) return 0;
    
    // Cezalı ve sakatlı oyuncuları çıkar
    const suspended = teamName === homeTeam ? homeSuspended : awaySuspended;
    const injured = teamName === homeTeam ? homeInjured : awayInjured;
    
    // Mevcut oyuncular (cezalı ve sakatlı olmayanlar)
    const availablePlayers = squad.firstTeam.filter(player => 
      !suspended.some(s => s.name === player.name) && 
      !injured.some(i => i.name === player.name)
    );
    
    if (availablePlayers.length === 0) return 0;
    
    // Mevcut oyuncuların ortalama reytingi
    const averageRating = availablePlayers.reduce((sum, player) => sum + player.rating, 0) / availablePlayers.length;
    
    return Math.round(averageRating * 10) / 10;
  };

  // Takım gücünü hesaplama fonksiyonu
  const calculateTeamStrength = (teamName) => {
    let squad = null;
    
    // Tüm liglerde takımı ara
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][teamName]) {
        squad = allSquads[league][teamName];
      }
    });
    
    if (!squad) return 50; // Varsayılan güç
    
    // Cezalı ve sakatlı oyuncuları çıkar
    const suspended = teamName === homeTeam ? homeSuspended : awaySuspended;
    const injured = teamName === homeTeam ? homeInjured : awayInjured;
    
    // Mevcut oyuncular (cezalı ve sakatlı olmayanlar)
    const availablePlayers = squad.firstTeam.filter(player => 
      !suspended.some(s => s.name === player.name) && 
      !injured.some(i => i.name === player.name)
    );
    
    if (availablePlayers.length === 0) return 30; // Hiç oyuncu yoksa çok düşük güç
    
    // Mevcut oyuncuların ortalama gücü
    const firstTeamStrength = availablePlayers.reduce((sum, player) => {
      const form = player.form[0]?.value || 0; // Form
      const fitness = player.form[1]?.value || 0; // Fitness
      const morale = player.form[2]?.value || 0; // Morale
      const energy = player.energy || 100;
      
      // Oyuncu gücü = Rating + Form + Fitness + Morale + Enerji etkisi
      const playerStrength = player.rating + form + fitness + morale + (energy - 100) * 0.1;
      return sum + playerStrength;
    }, 0) / availablePlayers.length;
    
    // Eksik oyuncu cezası (her eksik oyuncu için %5 düşüş)
    const missingPlayers = 11 - availablePlayers.length;
    const missingPenalty = missingPlayers * 5;
    
    // Menajer etkisi (varsayılan %10)
    const managerBonus = 10;
    
    return Math.round(Math.max(20, firstTeamStrength + managerBonus - missingPenalty));
  };



  // Gerçekçi pozisyon senaryoları
  const positionScenarios = [
    // Orta saha senaryoları
    {
      name: "Orta Saha Kontrolü",
      steps: [
        "ortasahada {attackingPlayer} kaptı topu",
        "{attackingPlayer} {defendingPlayer}'ya uzun top attı",
        "top {defendingPlayer}'ya ulaştı, şimdi kaleye doğru sürüyor",
        "{defendingPlayer} {goalkeeper} ile karşı karşıya!"
      ]
    },
    {
      name: "Savunma Müdahalesi",
      steps: [
        "{attackingPlayer} hücum bölgesinde topu aldı",
        "{defendingPlayer} mükemmel bir müdahale yaptı",
        "top {midfielder} kontrolüne geçti",
        "{midfielder} kontra atağa çıktı"
      ]
    },
    {
      name: "Korner Pozisyonu",
      steps: [
        "{attackingPlayer} sağ kanattan koşuyor",
        "{defendingPlayer} topu çizgi dışına çıkardı",
        "korner vuruşu {cornerTaker} tarafından",
        "top kaleye doğru gidiyor..."
      ]
    },
    {
      name: "Serbest Vuruş",
      steps: [
        "{attackingPlayer} faul yedi",
        "serbest vuruş {freeKickTaker} tarafından",
        "duvar kuruldu",
        "vuruş kaleye doğru..."
      ]
    },
    {
      name: "Ofsayt Pozisyonu",
      steps: [
        "{attackingPlayer} hücum bölgesinde",
        "{passer} pas verdi",
        "bayrak kalktı!",
        "ofsayt pozisyonu"
      ]
    },
    {
      name: "Kaleci Kurtarışı",
      steps: [
        "{attackingPlayer} şut çekti",
        "top kaleye doğru gidiyor",
        "{goalkeeper} mükemmel kurtarış yaptı",
        "top güvenli bölgeye"
      ]
    },
    {
      name: "Kale Direği",
      steps: [
        "{attackingPlayer} şut çekti",
        "top kaleye doğru gidiyor",
        "kale direğinden döndü!",
        "fırsat kaçtı"
      ]
    },
    {
      name: "Penaltı Pozisyonu",
      steps: [
        "{attackingPlayer} ceza sahasına girdi",
        "{defendingPlayer} müdahale etti",
        "hakem düdük çaldı!",
        "penaltı kararı"
      ]
    },
    {
      name: "Kontra Atak",
      steps: [
        "{goalkeeper} topu yakaladı",
        "hızlı kontra atağa çıktı",
        "{midfielder} topu aldı",
        "kaleye doğru koşuyor"
      ]
    },
    {
      name: "Uzun Şut",
      steps: [
        "{attackingPlayer} uzaktan şut çekti",
        "top kaleye doğru gidiyor",
        "{goalkeeper} pozisyon aldı",
        "top üst direğin üstünden"
      ]
    },
    {
      name: "Kafa Vuruşu",
      steps: [
        "{cornerTaker} korner vuruşu",
        "top kaleye doğru gidiyor",
        "{headerPlayer} kafa vuruşu yaptı",
        "top kaleye doğru..."
      ]
    },
    {
      name: "Dribling",
      steps: [
        "{attackingPlayer} topu aldı",
        "rakibi geçiyor",
        "bir tane daha geçti",
        "kaleye doğru sürüyor"
      ]
    },
    {
      name: "Pas Oyunu",
      steps: [
        "{passer1} {passer2}'ya pas verdi",
        "{passer2} {passer3}'ya pas verdi",
        "hızlı pas oyunu",
        "kaleye yaklaşıyorlar"
      ]
    },
    {
      name: "Savunma Hatası",
      steps: [
        "{defendingPlayer} topu kontrol etmeye çalıştı",
        "top ayağından kaydı",
        "{attackingPlayer} fırsatı yakaladı",
        "kaleye doğru koşuyor"
      ]
    },
    {
      name: "Kaleci Hatası",
      steps: [
        "{goalkeeper} topu yakaladı",
        "top elinden kaydı",
        "{attackingPlayer} fırsatı yakaladı",
        "boş kale!"
      ]
    },
    {
      name: "Uzun Pas",
      steps: [
        "{defendingPlayer} uzun pas attı",
        "top {attackingPlayer}'ya ulaştı",
        "{attackingPlayer} topu kontrol etti",
        "hücum bölgesinde"
      ]
    },
    {
      name: "Kısa Pas Oyunu",
      steps: [
        "{passer1} kısa pas verdi",
        "{passer2} topu aldı",
        "yavaş yavaş ilerliyorlar",
        "orta sahada kontrol"
      ]
    },
    {
      name: "Kanat Oyunu",
      steps: [
        "{winger} sağ kanattan koşuyor",
        "çapraz pas verdi",
        "{striker} topu aldı",
        "kaleye doğru"
      ]
    },
    {
      name: "Savunma Bloku",
      steps: [
        "{attackingPlayer} şut çekti",
        "{defendingPlayer} blok yaptı",
        "top dışarı çıktı",
        "korner vuruşu"
      ]
    },
    {
      name: "Hızlı Atak",
      steps: [
        "{attackingPlayer} hızlı koşuyor",
        "rakibi geçti",
        "kaleye doğru sürüyor",
        "{goalkeeper} çıktı"
      ]
    }
  ];







  // Maç öncesi enerji hesaplama fonksiyonu
  // Menajerin taktiğine göre formasyon belirleme fonksiyonu
  const getFormationFromTactic = (tactic) => {
    const tacticFormations = {
      '4-4-2': { 'K': 1, 'D': 4, 'O': 4, 'F': 2 },
      '4-3-3': { 'K': 1, 'D': 4, 'O': 3, 'F': 3 },
      '4-2-3-1': { 'K': 1, 'D': 4, 'O': 5, 'F': 1 },
      '3-5-2': { 'K': 1, 'D': 3, 'O': 5, 'F': 2 },
      '3-4-3': { 'K': 1, 'D': 3, 'O': 4, 'F': 3 },
      '5-3-2': { 'K': 1, 'D': 5, 'O': 3, 'F': 2 },
      '4-5-1': { 'K': 1, 'D': 4, 'O': 5, 'F': 1 },
      '4-1-4-1': { 'K': 1, 'D': 4, 'O': 5, 'F': 1 },
      '4-3-2-1': { 'K': 1, 'D': 4, 'O': 5, 'F': 1 },
      '3-6-1': { 'K': 1, 'D': 3, 'O': 6, 'F': 1 }
    };
    
    // Menajerin taktiğini kontrol et, yoksa varsayılan 4-4-2 kullan
    return tacticFormations[tactic] || tacticFormations['4-4-2'];
  };

  // Dinamik İLK 11 seçim fonksiyonu
  const selectBestFirstTeam = (squad, manager) => {
    if (!squad) return { firstTeam: [], substitutes: [] };
    
    // Tüm oyuncuları birleştir
    const allPlayers = [...squad.firstTeam, ...squad.substitutes];
    
    // Menajerin taktiğine göre formasyon belirle
    const positionCounts = getFormationFromTactic(manager?.tactic || '4-4-2');
    
    // Her pozisyon için en iyi oyuncuları seç
    const selectedFirstTeam = [];
    const remainingPlayers = [];
    
    Object.entries(positionCounts).forEach(([position, count]) => {
      // Bu pozisyondaki oyuncuları enerji ve reytinge göre sırala
      const positionPlayers = allPlayers
        .filter(player => player.position === position)
        .sort((a, b) => {
          // Önce enerji, sonra reytinge göre sırala
          const energyDiff = (b.energy || 100) - (a.energy || 100);
          if (Math.abs(energyDiff) > 10) return energyDiff;
          return b.rating - a.rating;
        });
      
      // En iyi oyuncuları İLK 11'e al
      const selected = positionPlayers.slice(0, count);
      selectedFirstTeam.push(...selected);
      
      // Kalan oyuncuları yedeklere al
      remainingPlayers.push(...positionPlayers.slice(count));
    });
    
    // Kalan oyuncuları yedeklere ekle
    const otherPositionPlayers = allPlayers.filter(player => 
      !selectedFirstTeam.some(selected => selected.name === player.name) &&
      !remainingPlayers.some(remaining => remaining.name === player.name)
    );
    remainingPlayers.push(...otherPositionPlayers);
    
    return {
      firstTeam: selectedFirstTeam,
      substitutes: remainingPlayers
    };
  };

  const calculatePreMatchEnergies = () => {
    // Ev sahibi takım enerjilerini hesapla
    let homeSquad = null;
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][homeTeam]) {
        homeSquad = allSquads[league][homeTeam];
      }
    });
    
    // Deplasman takımı enerjilerini hesapla
    let awaySquad = null;
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][awayTeam]) {
        awaySquad = allSquads[league][awayTeam];
      }
    });
    
    // Kalıcı enerji sistemini kullan
    const homeTeamKey = `${club.league}_${homeTeam}`;
    const awayTeamKey = `${club.league}_${awayTeam}`;
    
    // Ev sahibi takım için dinamik İLK 11 seç
    if (homeSquad) {
      // Ev sahibi takım menajerini bul
      let homeManager = null;
      Object.keys(allManagers).forEach(league => {
        if (allManagers[league][homeTeam]) {
          homeManager = allManagers[league][homeTeam];
        }
      });
      
      if (!playerEnergies[homeTeamKey]) {
        // İlk kez yükleniyorsa tüm oyuncuları %100 enerji ile başlat
        const allPlayers = [...homeSquad.firstTeam, ...homeSquad.substitutes].map(player => ({
          ...player,
          energy: 100
        }));
        
        // Dinamik İLK 11 seç (menajer taktiğine göre)
        const { firstTeam, substitutes } = selectBestFirstTeam({ 
          firstTeam: allPlayers.filter(p => homeSquad.firstTeam.some(original => original.name === p.name)),
          substitutes: allPlayers.filter(p => homeSquad.substitutes.some(original => original.name === p.name))
        }, homeManager);
        
        // Yeni İLK 11'i kaydet
        homeSquad.firstTeam = firstTeam;
        homeSquad.substitutes = substitutes;
        
        setPlayerEnergies(prev => ({
          ...prev,
          [homeTeamKey]: allPlayers
        }));
      } else {
        // Mevcut enerjileri kullan ve dinamik İLK 11 seç
        const allPlayers = playerEnergies[homeTeamKey];
        const { firstTeam, substitutes } = selectBestFirstTeam({ 
          firstTeam: allPlayers.filter(p => homeSquad.firstTeam.some(original => original.name === p.name)),
          substitutes: allPlayers.filter(p => homeSquad.substitutes.some(original => original.name === p.name))
        }, homeManager);
        
        homeSquad.firstTeam = firstTeam;
        homeSquad.substitutes = substitutes;
      }
    }
    
    // Deplasman takımı için dinamik İLK 11 seç
    if (awaySquad) {
      // Deplasman takımı menajerini bul
      let awayManager = null;
      Object.keys(allManagers).forEach(league => {
        if (allManagers[league][awayTeam]) {
          awayManager = allManagers[league][awayTeam];
        }
      });
      
      if (!playerEnergies[awayTeamKey]) {
        // İlk kez yükleniyorsa tüm oyuncuları %100 enerji ile başlat
        const allPlayers = [...awaySquad.firstTeam, ...awaySquad.substitutes].map(player => ({
          ...player,
          energy: 100
        }));
        
        // Dinamik İLK 11 seç (menajer taktiğine göre)
        const { firstTeam, substitutes } = selectBestFirstTeam({ 
          firstTeam: allPlayers.filter(p => awaySquad.firstTeam.some(original => original.name === p.name)),
          substitutes: allPlayers.filter(p => awaySquad.substitutes.some(original => original.name === p.name))
        }, awayManager);
        
        // Yeni İLK 11'i kaydet
        awaySquad.firstTeam = firstTeam;
        awaySquad.substitutes = substitutes;
        
        setPlayerEnergies(prev => ({
          ...prev,
          [awayTeamKey]: allPlayers
        }));
      } else {
        // Mevcut enerjileri kullan ve dinamik İLK 11 seç
        const allPlayers = playerEnergies[awayTeamKey];
        const { firstTeam, substitutes } = selectBestFirstTeam({ 
          firstTeam: allPlayers.filter(p => awaySquad.firstTeam.some(original => original.name === p.name)),
          substitutes: allPlayers.filter(p => awaySquad.substitutes.some(original => original.name === p.name))
        }, awayManager);
        
        awaySquad.firstTeam = firstTeam;
        awaySquad.substitutes = substitutes;
      }
    }
  };

  // Yeni sunum sistemi - önceden hesaplanmış maçı göster
  const advanceTime = () => {
    if (!preCalculatedMatch) return;
    
    if (currentEventIndex < preCalculatedMatch.events.length) {
      const currentEvent = preCalculatedMatch.events[currentEventIndex];
      
      // Dakikayı güncelle
      setCurrentMinute(currentEvent.minute);
      
      // Olayı ekle
      setMatchEvents(prev => [...prev, currentEvent]);
      
      // Skoru güncelle (eğer gol ise)
      if (currentEvent.type === 'goal') {
        if (currentEvent.team === 'home') {
          setHomeScore(prev => prev + 1);
        } else {
          setAwayScore(prev => prev + 1);
        }
      }
      
      // Sarı kart olayını işle
      if (currentEvent.type === 'yellow') {
        if (currentEvent.team === 'home') {
          const playerName = currentEvent.player.name || currentEvent.player;
          const currentYellowCards = homeYellowCards[playerName] || 0;
          const newYellowCards = currentYellowCards + 1;
          
          if (newYellowCards >= 2) {
            // 2. sarı kart: Kırmızı kart olarak işle
            setHomeSuspended(prev => [...prev, currentEvent.player]);
            setHomeYellowCards(prev => ({ ...prev, [playerName]: 0 })); // Sıfırla
            
            // Oyuncuyu takımdan çıkar
            const homeSquad = Object.keys(allSquads).find(league => allSquads[league][homeTeam]) ? 
              allSquads[Object.keys(allSquads).find(league => allSquads[league][homeTeam])][homeTeam] : null;
            if (homeSquad) {
              const playerIndex = homeSquad.firstTeam.findIndex(p => p.name === playerName);
              if (playerIndex !== -1) {
                homeSquad.firstTeam.splice(playerIndex, 1);
              }
            }
            
            // İkinci sarı kart mesajını güncelle
            setMatchEvents(prev => [...prev.slice(0, -1), {
              minute: currentEvent.minute,
              type: 'red',
              team: currentEvent.team,
              description: `🟥 ${playerName} ikinci sarı kart nedeniyle kırmızı kart gördü!`
            }]);
          } else {
            // İlk sarı kart: Sadece sayacı güncelle
            setHomeYellowCards(prev => ({ ...prev, [playerName]: newYellowCards }));
          }
        } else {
          const playerName = currentEvent.player.name || currentEvent.player;
          const currentYellowCards = awayYellowCards[playerName] || 0;
          const newYellowCards = currentYellowCards + 1;
          
          if (newYellowCards >= 2) {
            // 2. sarı kart: Kırmızı kart olarak işle
            setAwaySuspended(prev => [...prev, currentEvent.player]);
            setAwayYellowCards(prev => ({ ...prev, [playerName]: 0 })); // Sıfırla
            
            // Oyuncuyu takımdan çıkar
            const awaySquad = Object.keys(allSquads).find(league => allSquads[league][awayTeam]) ? 
              allSquads[Object.keys(allSquads).find(league => allSquads[league][awayTeam])][awayTeam] : null;
            if (awaySquad) {
              const playerIndex = awaySquad.firstTeam.findIndex(p => p.name === playerName);
              if (playerIndex !== -1) {
                awaySquad.firstTeam.splice(playerIndex, 1);
              }
            }
            
            // İkinci sarı kart mesajını güncelle
            setMatchEvents(prev => [...prev.slice(0, -1), {
              minute: currentEvent.minute,
              type: 'red',
              team: currentEvent.team,
              description: `🟥 ${playerName} ikinci sarı kart nedeniyle kırmızı kart gördü!`
            }]);
          } else {
            // İlk sarı kart: Sadece sayacı güncelle
            setAwayYellowCards(prev => ({ ...prev, [playerName]: newYellowCards }));
          }
        }
      }
      
            // Kırmızı kart olayını işle
      if (currentEvent.type === 'red') {
        // Kırmızı kart: Oyuncuyu cezalı listesine ekle ve takımdan çıkar
        if (currentEvent.team === 'home') {
          setHomeSuspended(prev => [...prev, currentEvent.player]);
          // Oyuncuyu takımdan çıkar
          const homeSquad = Object.keys(allSquads).find(league => allSquads[league][homeTeam]) ? 
            allSquads[Object.keys(allSquads).find(league => allSquads[league][homeTeam])][homeTeam] : null;
          if (homeSquad) {
            const playerIndex = homeSquad.firstTeam.findIndex(p => p.name === currentEvent.player.name);
            if (playerIndex !== -1) {
              homeSquad.firstTeam.splice(playerIndex, 1);
            }
          }
        } else {
          setAwaySuspended(prev => [...prev, currentEvent.player]);
          // Oyuncuyu takımdan çıkar
          const awaySquad = Object.keys(allSquads).find(league => allSquads[league][awayTeam]) ? 
            allSquads[Object.keys(allSquads).find(league => allSquads[league][awayTeam])][awayTeam] : null;
          if (awaySquad) {
            const playerIndex = awaySquad.firstTeam.findIndex(p => p.name === currentEvent.player.name);
            if (playerIndex !== -1) {
              awaySquad.firstTeam.splice(playerIndex, 1);
            }
          }
        }
        
        // Değişiklik hakkı varsa otomatik değişiklik yap
        const currentSubs = currentEvent.team === 'home' ? homeSubstitutions : awaySubstitutions;
        if (currentSubs < 3) {
          const substitution = makeSubstitution(currentEvent.team);
          if (substitution) {
            setMatchEvents(prev => [...prev, {
              minute: currentEvent.minute,
              type: 'substitution',
              team: currentEvent.team,
              description: substitution.description
            }]);
          }
        } else {
          // Değişiklik hakkı yoksa takım eksik kalır
          setMatchEvents(prev => [...prev, {
            minute: currentEvent.minute,
            type: 'card',
            team: currentEvent.team,
            description: `${currentEvent.minute}' ⚠️ ${currentEvent.team === 'home' ? homeTeam : awayTeam} kırmızı kart nedeniyle eksik oyuncuyla devam ediyor`
          }]);
        }

      }
      
      // Sakatlık olayını işle
      if (currentEvent.type === 'injury') {
        // Oyuncuyu sakatlı listesine ekle ve takımdan çıkar
        if (currentEvent.team === 'home') {
          // Oyuncunun zaten sakat olup olmadığını kontrol et
          const isAlreadyInjured = homeInjured.some(injured => injured.name === currentEvent.player.name);
          if (!isAlreadyInjured) {
            setHomeInjured(prev => [...prev, currentEvent.player]);
            // Oyuncuyu takımdan çıkar
            const homeSquad = Object.keys(allSquads).find(league => allSquads[league][homeTeam]) ? 
              allSquads[Object.keys(allSquads).find(league => allSquads[league][homeTeam])][homeTeam] : null;
            if (homeSquad) {
              const playerIndex = homeSquad.firstTeam.findIndex(p => p.name === currentEvent.player.name);
              if (playerIndex !== -1) {
                homeSquad.firstTeam.splice(playerIndex, 1);
              }
            }
            
            // Değişiklik hakkı varsa otomatik değişiklik yap
            if (homeSubstitutions < 3) {
              const substitution = makeSubstitution('home');
              if (substitution) {
                setMatchEvents(prev => [...prev, {
                  minute: currentEvent.minute,
                  type: 'substitution',
                  team: 'home',
                  description: substitution.description
                }]);
              }
            } else {
              // Değişiklik hakkı yoksa takım eksik kalır
              setMatchEvents(prev => [...prev, {
                minute: currentEvent.minute,
                type: 'injury',
                team: 'home',
                description: `${currentEvent.minute}' ⚠️ ${homeTeam} değişiklik hakkı dolduğu için eksik oyuncuyla devam ediyor`
              }]);
            }
          }
        } else {
          // Oyuncunun zaten sakat olup olmadığını kontrol et
          const isAlreadyInjured = awayInjured.some(injured => injured.name === currentEvent.player.name);
          if (!isAlreadyInjured) {
            setAwayInjured(prev => [...prev, currentEvent.player]);
            // Oyuncuyu takımdan çıkar
            const awaySquad = Object.keys(allSquads).find(league => allSquads[league][awayTeam]) ? 
              allSquads[Object.keys(allSquads).find(league => allSquads[league][awayTeam])][awayTeam] : null;
            if (awaySquad) {
              const playerIndex = awaySquad.firstTeam.findIndex(p => p.name === currentEvent.player.name);
              if (playerIndex !== -1) {
                awaySquad.firstTeam.splice(playerIndex, 1);
              }
            }
            
            // Değişiklik hakkı varsa otomatik değişiklik yap
            if (awaySubstitutions < 3) {
              const substitution = makeSubstitution('away');
              if (substitution) {
                setMatchEvents(prev => [...prev, {
                  minute: currentEvent.minute,
                  type: 'substitution',
                  team: 'away',
                  description: substitution.description
                }]);
              }
            } else {
              // Değişiklik hakkı yoksa takım eksik kalır
              setMatchEvents(prev => [...prev, {
                minute: currentEvent.minute,
                type: 'injury',
                team: 'away',
                description: `${currentEvent.minute}' ⚠️ ${awayTeam} değişiklik hakkı dolduğu için eksik oyuncuyla devam ediyor`
              }]);
            }
          }
        }
      }
      
      // Her dakika enerjileri güncelle
      updateEnergiesForMinute();
      
      // Enerjisi çok düşük oyuncular için otomatik değişiklik kontrolü
      const homeSquad = Object.keys(allSquads).find(league => allSquads[league][homeTeam]) ? 
        allSquads[Object.keys(allSquads).find(league => allSquads[league][homeTeam])][homeTeam] : null;
      const awaySquad = Object.keys(allSquads).find(league => allSquads[league][awayTeam]) ? 
        allSquads[Object.keys(allSquads).find(league => allSquads[league][awayTeam])][awayTeam] : null;
      
      // Enerjisi %20'nin altında olan oyuncular için değişiklik
      if (homeSquad && homeSubstitutions < 3) {
        const lowEnergyPlayer = homeSquad.firstTeam.find(p => p.energy < 20 && p.energy > 0);
        if (lowEnergyPlayer) {
          const substitution = makeSubstitution('home');
          if (substitution) {
            setMatchEvents(prev => [...prev, {
              minute: currentEvent.minute,
              type: 'substitution',
              team: 'home',
              description: substitution.description
            }]);
          }
        }
      }
      
      if (awaySquad && awaySubstitutions < 3) {
        const lowEnergyPlayer = awaySquad.firstTeam.find(p => p.energy < 20 && p.energy > 0);
        if (lowEnergyPlayer) {
          const substitution = makeSubstitution('away');
          if (substitution) {
            setMatchEvents(prev => [...prev, {
              minute: currentEvent.minute,
              type: 'substitution',
              team: 'away',
              description: substitution.description
            }]);
          }
        }
      }
      
      // Sonraki olaya geç
      setCurrentEventIndex(prev => prev + 1);
    } else {
      // Maç bitti
      setIsPlaying(false);
      setMatchEnded(true);
    }
  };

  // Oyuncu değişikliği fonksiyonu
  const makeSubstitution = (team) => {
    const teamName = team === 'home' ? homeTeam : awayTeam;
    const squad = Object.keys(allSquads).find(league => allSquads[league][teamName]) ? 
      allSquads[Object.keys(allSquads).find(league => allSquads[league][teamName])][teamName] : null;
    
    if (!squad) return null;
    
    // Mevcut değişiklik sayısını kontrol et
    const currentSubs = team === 'home' ? homeSubstitutions : awaySubstitutions;
    if (currentSubs >= 3) return null; // Maksimum 3 sefer
    
    // Enerjisi en düşük oyuncuyu bul
    const firstTeam = squad.firstTeam.filter(p => p.energy > 0);
    if (firstTeam.length === 0) return null;
    
    const lowestEnergyPlayer = firstTeam.reduce((lowest, player) => 
      player.energy < lowest.energy ? player : lowest, firstTeam[0]);
    
    // Yedek oyuncu bul
    const substitutes = squad.substitutes.filter(p => p.energy > 0);
    if (substitutes.length === 0) return null;
    
    // En yüksek enerjili yedek oyuncuyu seç
    const bestSubstitute = substitutes.reduce((best, player) => 
      player.energy > best.energy ? player : best, substitutes[0]);
    
    // Değişikliği yap
    const playerIndex = squad.firstTeam.findIndex(p => p.name === lowestEnergyPlayer.name);
    const subIndex = squad.substitutes.findIndex(p => p.name === bestSubstitute.name);
    
    if (playerIndex !== -1 && subIndex !== -1) {
      // Oyuncuları değiştir
      const temp = squad.firstTeam[playerIndex];
      squad.firstTeam[playerIndex] = squad.substitutes[subIndex];
      squad.substitutes[subIndex] = temp;
      
      // Değişiklik sayısını güncelle
      if (team === 'home') {
        setHomeSubstitutions(prev => prev + 1);
        setHomeSubstitutedPlayers(prev => [...prev, bestSubstitute.name]);
      } else {
        setAwaySubstitutions(prev => prev + 1);
        setAwaySubstitutedPlayers(prev => [...prev, bestSubstitute.name]);
      }
      
      return {
        outPlayer: lowestEnergyPlayer,
        inPlayer: bestSubstitute,
        description: `${currentMinute}' 🔄 ${lowestEnergyPlayer.name} çıktı, ${bestSubstitute.name} girdi`
      };
    }
    
    return null;
  };

  // Belirli bir dakika için enerjileri güncelleme fonksiyonu
  const updateEnergiesForMinute = () => {
    // Ev sahibi takım enerjilerini güncelle
    let homeSquad = null;
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][homeTeam]) {
        homeSquad = allSquads[league][homeTeam];
      }
    });
    
    // Deplasman takımı enerjilerini güncelle
    let awaySquad = null;
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][awayTeam]) {
        awaySquad = allSquads[league][awayTeam];
      }
    });
    
    // Dakika başına enerji düşüşü hesapla
    const calculateMinuteEnergyLoss = (player) => {
      const fitness = player.form[1]; // Fitness değeri
      let baseEnergyLossPerMinute = 0.15; // Dakika başına temel düşüş
      
      if (fitness && fitness.type === 'positive') {
        // Pozitif fitness: daha az enerji kaybı
        baseEnergyLossPerMinute = Math.max(0.05, baseEnergyLossPerMinute - (fitness.value * 0.03));
      } else if (fitness && fitness.type === 'negative') {
        // Negatif fitness: daha fazla enerji kaybı
        baseEnergyLossPerMinute = baseEnergyLossPerMinute + (fitness.value * 0.05);
      }
      
      // Pozisyona göre ek düşüş
      if (player.position === 'F') baseEnergyLossPerMinute += 0.05; // Forvetler daha çok koşar
      if (player.position === 'O') baseEnergyLossPerMinute += 0.03; // Orta saha oyuncuları
      
      return baseEnergyLossPerMinute;
    };
    
    // Ev sahibi takım enerjilerini güncelle
    if (homeSquad) {
      homeSquad.firstTeam.forEach(player => {
        if (player.energy !== undefined) {
          const energyLoss = calculateMinuteEnergyLoss(player);
          player.energy = Math.max(0, player.energy - energyLoss);
        }
      });
    }
    
    // Deplasman takımı enerjilerini güncelle
    if (awaySquad) {
      awaySquad.firstTeam.forEach(player => {
        if (player.energy !== undefined) {
          const energyLoss = calculateMinuteEnergyLoss(player);
          player.energy = Math.max(0, player.energy - energyLoss);
        }
      });
    }
  };





  const fastForwardToEnd = () => {
    if (!preCalculatedMatch) return;
    
    setIsFastForward(true);
    
    // Tüm kalan olayları göster ve enerjileri güncelle
    for (let i = currentEventIndex; i < preCalculatedMatch.events.length; i++) {
      const event = preCalculatedMatch.events[i];
      setCurrentMinute(event.minute);
      
      if (event.type === 'goal') {
        if (event.team === 'home') {
          setHomeScore(prev => prev + 1);
        } else {
          setAwayScore(prev => prev + 1);
        }
      }
      
      // Sarı kart olayını işle
      if (event.type === 'yellow') {
        if (event.team === 'home') {
          const playerName = event.player.name || event.player;
          const currentYellowCards = homeYellowCards[playerName] || 0;
          const newYellowCards = currentYellowCards + 1;
          
          if (newYellowCards >= 2) {
            // 2. sarı kart: Kırmızı kart olarak işle
            setHomeSuspended(prev => [...prev, event.player]);
            setHomeYellowCards(prev => ({ ...prev, [playerName]: 0 })); // Sıfırla
            
            // Oyuncuyu takımdan çıkar
            const homeSquad = Object.keys(allSquads).find(league => allSquads[league][homeTeam]) ? 
              allSquads[Object.keys(allSquads).find(league => allSquads[league][homeTeam])][homeTeam] : null;
            if (homeSquad) {
              const playerIndex = homeSquad.firstTeam.findIndex(p => p.name === playerName);
              if (playerIndex !== -1) {
                homeSquad.firstTeam.splice(playerIndex, 1);
              }
            }
          } else {
            // İlk sarı kart: Sadece sayacı güncelle
            setHomeYellowCards(prev => ({ ...prev, [playerName]: newYellowCards }));
          }
        } else {
          const playerName = event.player.name || event.player;
          const currentYellowCards = awayYellowCards[playerName] || 0;
          const newYellowCards = currentYellowCards + 1;
          
          if (newYellowCards >= 2) {
            // 2. sarı kart: Kırmızı kart olarak işle
            setAwaySuspended(prev => [...prev, event.player]);
            setAwayYellowCards(prev => ({ ...prev, [playerName]: 0 })); // Sıfırla
            
            // Oyuncuyu takımdan çıkar
            const awaySquad = Object.keys(allSquads).find(league => allSquads[league][awayTeam]) ? 
              allSquads[Object.keys(allSquads).find(league => allSquads[league][awayTeam])][awayTeam] : null;
            if (awaySquad) {
              const playerIndex = awaySquad.firstTeam.findIndex(p => p.name === playerName);
              if (playerIndex !== -1) {
                awaySquad.firstTeam.splice(playerIndex, 1);
              }
            }
          } else {
            // İlk sarı kart: Sadece sayacı güncelle
            setAwayYellowCards(prev => ({ ...prev, [playerName]: newYellowCards }));
          }
        }
      }
      
      // Kırmızı kart olayını işle
      if (event.type === 'red') {
        if (event.team === 'home') {
          setHomeSuspended(prev => [...prev, event.player]);
          // Oyuncuyu takımdan çıkar
          const homeSquad = Object.keys(allSquads).find(league => allSquads[league][homeTeam]) ? 
            allSquads[Object.keys(allSquads).find(league => allSquads[league][homeTeam])][homeTeam] : null;
          if (homeSquad) {
            const playerIndex = homeSquad.firstTeam.findIndex(p => p.name === event.player.name);
            if (playerIndex !== -1) {
              homeSquad.firstTeam.splice(playerIndex, 1);
            }
          }
        } else {
          setAwaySuspended(prev => [...prev, event.player]);
          // Oyuncuyu takımdan çıkar
          const awaySquad = Object.keys(allSquads).find(league => allSquads[league][awayTeam]) ? 
            allSquads[Object.keys(allSquads).find(league => allSquads[league][awayTeam])][awayTeam] : null;
          if (awaySquad) {
            const playerIndex = awaySquad.firstTeam.findIndex(p => p.name === event.player.name);
            if (playerIndex !== -1) {
              awaySquad.firstTeam.splice(playerIndex, 1);
            }
          }
        }
        
        // Değişiklik hakkı varsa otomatik değişiklik yap
        const currentSubs = event.team === 'home' ? homeSubstitutions : awaySubstitutions;
        if (currentSubs < 3) {
          const substitution = makeSubstitution(event.team);
          if (substitution) {
            setMatchEvents(prev => [...prev, {
              minute: event.minute,
              type: 'substitution',
              team: event.team,
              description: substitution.description
            }]);
          }
                  } else {
            // Değişiklik hakkı yoksa takım eksik kalır
            setMatchEvents(prev => [...prev, {
              minute: event.minute,
              type: 'card',
              team: event.team,
              description: `${event.minute}' ⚠️ ${event.team === 'home' ? homeTeam : awayTeam} kırmızı kart nedeniyle eksik oyuncuyla devam ediyor`
            }]);
          }
      }
      
      // Sakatlık olayını işle
      if (event.type === 'injury') {
        if (event.team === 'home') {
          setHomeInjured(prev => [...prev, event.player]);
          // Oyuncuyu takımdan çıkar
          const homeSquad = Object.keys(allSquads).find(league => allSquads[league][homeTeam]) ? 
            allSquads[Object.keys(allSquads).find(league => allSquads[league][homeTeam])][homeTeam] : null;
          if (homeSquad) {
            const playerIndex = homeSquad.firstTeam.findIndex(p => p.name === event.player.name);
            if (playerIndex !== -1) {
              homeSquad.firstTeam.splice(playerIndex, 1);
            }
          }
        } else {
          setAwayInjured(prev => [...prev, event.player]);
          // Oyuncuyu takımdan çıkar
          const awaySquad = Object.keys(allSquads).find(league => allSquads[league][awayTeam]) ? 
            allSquads[Object.keys(allSquads).find(league => allSquads[league][awayTeam])][awayTeam] : null;
          if (awaySquad) {
            const playerIndex = awaySquad.firstTeam.findIndex(p => p.name === event.player.name);
            if (playerIndex !== -1) {
              awaySquad.firstTeam.splice(playerIndex, 1);
            }
          }
        }
        
        // Değişiklik hakkı varsa otomatik değişiklik yap
        const currentSubs = event.team === 'home' ? homeSubstitutions : awaySubstitutions;
        if (currentSubs < 3) {
          const substitution = makeSubstitution(event.team);
          if (substitution) {
            setMatchEvents(prev => [...prev, {
              minute: event.minute,
              type: 'substitution',
              team: event.team,
              description: substitution.description
            }]);
          }
        } else {
          // Değişiklik hakkı yoksa takım eksik kalır
          setMatchEvents(prev => [...prev, {
            minute: event.minute,
            type: 'injury',
            team: event.team,
            description: `${event.minute}' ⚠️ ${event.team === 'home' ? homeTeam : awayTeam} değişiklik hakkı dolduğu için eksik oyuncuyla devam ediyor`
          }]);
        }
      }
      
      // Her dakika enerjileri güncelle
      updateEnergiesForMinute();
    }
    
    // Tüm olayları ekle
    setMatchEvents(preCalculatedMatch.events);
    setCurrentEventIndex(preCalculatedMatch.events.length);
    
    setIsFastForward(false);
    setIsPlaying(false);
    setMatchEnded(true);
  };

  // Maçı başlatma - önceden hesapla
  useEffect(() => {
    if (!preCalculatedMatch) {
      const calculatedMatch = preCalculateMatch();
      setPreCalculatedMatch(calculatedMatch);
      // Skorları 0'dan başlat, maç sırasında goller eklenecek
      setHomeScore(0);
      setAwayScore(0);
    }
  }, []);

  // Yeni sunum sistemi
  useEffect(() => {
    if (isPlaying && !isFastForward && preCalculatedMatch) {
      const interval = setInterval(() => {
        advanceTime();
      }, 800); // 800ms aralıklarla olayları göster
      return () => clearInterval(interval);
    }
  }, [isPlaying, isFastForward, preCalculatedMatch, currentEventIndex]);

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
    
         return players.map((player, index) => {
           // Enerji rengini belirle
           const getEnergyColor = (energy) => {
             if (energy >= 80) return '#4CAF50'; // Yeşil
             if (energy >= 60) return '#FF9800'; // Turuncu
             if (energy >= 40) return '#FF5722'; // Kırmızı
             return '#D32F2F'; // Koyu kırmızı
           };
           
           // Değiştirilen oyuncu kontrolü
           const substitutedPlayers = teamName === homeTeam ? homeSubstitutedPlayers : awaySubstitutedPlayers;
           const isSubstituted = substitutedPlayers.includes(player.name);
           
           // Sarı kart kontrolü
           const yellowCards = teamName === homeTeam ? homeYellowCards : awayYellowCards;
           const playerYellowCards = yellowCards[player.name] || 0;
           const yellowCardIcon = playerYellowCards > 0 ? `🟨${playerYellowCards}` : '';
           
           return (
       <div key={index} style={{ 
         display: 'flex', 
         justifyContent: 'space-between',
         padding: '2px 0',
         borderBottom: '1px solid #eee',
         whiteSpace: 'nowrap',
         overflow: 'hidden',
         textOverflow: 'ellipsis'
       }}>
         <span style={{ fontWeight: 'bold', flex: '1', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
           {player.name} {isSubstituted && '🔄'} {yellowCardIcon}
         </span>
         <span style={{ color: '#666', marginLeft: '8px', whiteSpace: 'nowrap' }}>
                  {player.position} • {player.rating} • 
                                     <span style={{ color: getEnergyColor(player.energy || 100), fontWeight: 'bold' }}>
                     {(Math.round((player.energy || 100) * 10) / 10).toFixed(1)}%
                   </span>
         </span>
       </div>
           );
         });
  };

  const renderSuspendedInjured = (teamName) => {
    // Takıma göre cezalı ve sakatlı listelerini al
    const suspended = teamName === homeTeam ? homeSuspended : awaySuspended;
    const injured = teamName === homeTeam ? homeInjured : awayInjured;
    
    const allSuspendedInjured = [...suspended, ...injured];
    
    if (allSuspendedInjured.length === 0) {
      return 'Cezalı veya sakat oyuncu yok';
    }
    
    return allSuspendedInjured.map((player, index) => (
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
          {suspended.includes(player) ? '🔴 Cezalı' : '🏥 Sakat'}
        </span>
      </div>
    ));
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'card': return '🟡';
      case 'injury': return '🏥';
      case 'substitution': return '🔄';
      case 'assist': return '🎯';
      case 'action': return '⚡';
      case 'half': return '⏸️';
      case 'position': return '🎯';
      case 'corner': return '🚩';
      case 'position_lost': return '❌';
      default: return '📝';
    }
  };

  // Auto-scroll to bottom when new events are added
  useEffect(() => {
    const eventsContainer = document.querySelector('.match-events-container');
    if (eventsContainer) {
      eventsContainer.scrollTop = eventsContainer.scrollHeight;
    }
  }, [matchEvents]);



  return (
    <div className="fc-modal-backdrop">
              <div className="fc-modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden' }}>
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
                  // Maç sonunda enerjileri kalıcı olarak kaydet
                  const homeTeamKey = `${club.league}_${homeTeam}`;
                  const awayTeamKey = `${club.league}_${awayTeam}`;
                  
                  // Ev sahibi takım enerjilerini kaydet
                  let homeSquad = null;
                  Object.keys(allSquads).forEach(league => {
                    if (allSquads[league][homeTeam]) {
                      homeSquad = allSquads[league][homeTeam];
                    }
                  });
                  
                  if (homeSquad) {
                    setPlayerEnergies(prev => ({
                      ...prev,
                      [homeTeamKey]: homeSquad.firstTeam
                    }));
                  }
                  
                  // Deplasman takımı enerjilerini kaydet
                  let awaySquad = null;
                  Object.keys(allSquads).forEach(league => {
                    if (allSquads[league][awayTeam]) {
                      awaySquad = allSquads[league][awayTeam];
                    }
                  });
                  
                  if (awaySquad) {
                    setPlayerEnergies(prev => ({
                      ...prev,
                      [awayTeamKey]: awaySquad.firstTeam
                    }));
                  }
                  
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
               gridTemplateColumns: '1fr 1.5fr 1fr',
               gap: '15px',
               height: '450px'
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
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '11px', 
                  color: '#666',
                  marginBottom: '5px'
                }}>
                  Reyting: {calculateTeamRating(homeTeam)} | Güç: {calculateTeamStrength(homeTeam)}
                </div>
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '11px', 
                  color: '#666',
                  marginBottom: '10px'
                }}>
                  Değişiklik: {homeSubstitutions}/3
                </div>
                
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
                  <div style={{ 
                    fontSize: '11px', 
                    lineHeight: '1.3',
                    maxHeight: '100px',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth'
                  }}>
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
                  <div style={{ 
                    fontSize: '11px', 
                    lineHeight: '1.3',
                    maxHeight: '80px',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth'
                  }}>
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
                  <div style={{ 
                    fontSize: '11px', 
                    lineHeight: '1.3', 
                    color: '#666',
                    maxHeight: '60px',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth'
                  }}>
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
                
                <div 
                  className="match-events-container"
                  style={{ 
                    height: '350px', 
                    overflowY: 'auto',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    scrollBehavior: 'smooth'
                  }}
                >
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
                         fontSize: '11px',
                         background: event.type === 'position' ? '#f0f8ff' : 'transparent',
                         borderLeft: event.type === 'position' ? '3px solid var(--blue)' : 'none'
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
                           {event.type === 'position' && event.step && (
                             <span style={{ 
                               fontSize: '10px', 
                               color: '#666', 
                               marginLeft: '5px',
                               background: '#e0e0e0',
                               padding: '1px 4px',
                               borderRadius: '3px'
                             }}>
                               {event.step}/{event.totalSteps}
                             </span>
                           )}
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
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '11px', 
                  color: '#666',
                  marginBottom: '5px'
                }}>
                  Reyting: {calculateTeamRating(awayTeam)} | Güç: {calculateTeamStrength(awayTeam)}
                </div>
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '11px', 
                  color: '#666',
                  marginBottom: '10px'
                }}>
                  Değişiklik: {awaySubstitutions}/3
                </div>
                
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
                  <div style={{ 
                    fontSize: '11px', 
                    lineHeight: '1.3',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth'
                  }}>
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
                  <div style={{ 
                    fontSize: '11px', 
                    lineHeight: '1.3',
                    maxHeight: '80px',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth'
                  }}>
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
                  <div style={{ 
                    fontSize: '11px', 
                    lineHeight: '1.3', 
                    color: '#666',
                    maxHeight: '80px',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth'
                  }}>
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
  playerEnergies: PropTypes.object,
  setPlayerEnergies: PropTypes.func,
};

export default MatchPlayModal;


