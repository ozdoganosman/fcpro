import React, { useState, useEffect } from 'react';
import TrainingMenu from './TrainingMenu';
import { createClubData, loadTurkishLeaguesFromCSV, advanceWeek, generateRealisticFixtures } from './data';
import './styles.css';
import FinanceModal from './components/FinanceModal';
import StandingsModal from './components/StandingsModal';
import FixtureModal from './components/FixtureModal';
import SquadModal from './components/SquadModal';
import TeamSelection from './components/TeamSelection';
import ManagerSelectionModal from './components/ManagerSelectionModal';
import ManagerDetailModal from './components/ManagerDetailModal';
import TrainingFacilitiesModal from './components/TrainingFacilitiesModal';
import YouthFacilitiesModal from './components/YouthFacilitiesModal';
import YouthSquadModal from './components/YouthSquadModal';
import FanSatisfactionModal from './components/FanSatisfactionModal';
import StadiumModal from './components/StadiumModal';
import PitchImprovementModal from './components/PitchImprovementModal';
import StadiumFacilitiesModal from './components/StadiumFacilitiesModal';
import TribuneUpgradeModal from './components/TribuneUpgradeModal';
import MatchPlayModal from './components/MatchPlayModal';
import OtherMatchesModal from './components/OtherMatchesModal';
import PlayerStatsModal from './components/PlayerStatsModal';
import WeeklyReportModal from './components/WeeklyReportModal';


const getResultColor = (result) => {
  if (typeof result === 'string') {
    if (result === 'M') return 'var(--loss)';
    if (result === 'G') return 'var(--win)';
    if (result === 'B') return 'var(--draw)';
    return '#ccc';
  } else if (typeof result === 'object' && result.homeScore !== undefined) {
    // Yeni format: obje
    if (result.homeScore > result.awayScore) return 'var(--win)';
    if (result.homeScore < result.awayScore) return 'var(--loss)';
    return 'var(--draw)';
  }
  return '#ccc';
};

function App() {
  const [club, setClub] = useState(null);
  const [showFixture, setShowFixture] = useState(false);
  const [showStandings, setShowStandings] = useState(false);
  const [showFinance, setShowFinance] = useState(false);
  const [showSquad, setShowSquad] = useState(false);
  const [showTrainingMenu, setShowTrainingMenu] = useState(false);
  const [showTeamSelection, setShowTeamSelection] = useState(true);
  const [showManagerSelection, setShowManagerSelection] = useState(false);
  const [showManagerDetail, setShowManagerDetail] = useState(false);
  const [showTrainingFacilities, setShowTrainingFacilities] = useState(false);
  const [showYouthFacilities, setShowYouthFacilities] = useState(false);
  const [showYouthSquad, setShowYouthSquad] = useState(false);
  const [showFanSatisfaction, setShowFanSatisfaction] = useState(false);
  const [showStadium, setShowStadium] = useState(false);
  const [showPitchImprovement, setShowPitchImprovement] = useState(false);
  const [showStadiumFacilities, setShowStadiumFacilities] = useState(false);
  const [showTribuneUpgrade, setShowTribuneUpgrade] = useState(false);
  const [selectedTribune, setSelectedTribune] = useState(null);
  const [showMatchPlay, setShowMatchPlay] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [gameTime, setGameTime] = useState({ week: 1, day: 'Hafta Başı' });
  const [showOtherMatches, setShowOtherMatches] = useState(false);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedTeamForSquad, setSelectedTeamForSquad] = useState(null);
  const [fixtureData, setFixtureData] = useState({});
  const [turkishLeagues, setTurkishLeagues] = useState({});
  
  // Takım verilerini yükle
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const leagues = await loadTurkishLeaguesFromCSV();
        setTurkishLeagues(leagues);
      } catch (error) {
        console.error('Takım verileri yüklenirken hata:', error);
      }
    };
    
    loadTeams();
  }, []);
  
  // Fikstürü başlangıçta yükle
  useEffect(() => {
    const loadFixtures = async () => {
      try {
        const fixtures = {};
        
        // Her lig için fikstür oluştur
        Object.keys(turkishLeagues).forEach(leagueName => {
          const teams = turkishLeagues[leagueName];
          if (teams && teams.length > 0) {
            const leagueFixtures = generateRealisticFixtures(teams);
            fixtures[leagueName] = leagueFixtures;
            
            console.log(`${leagueName} fikstürü: ${leagueFixtures.length} maç, ${Math.max(...leagueFixtures.map(f => f.week))} hafta`);
          }
        });
        
        setFixtureData(fixtures);
      } catch (error) {
        console.error('Fikstür yüklenirken hata:', error);
      }
    };
    
    if (Object.keys(turkishLeagues).length > 0) {
      loadFixtures();
    }
  }, [turkishLeagues]);
  
  // Oyuncu istatistikleri state'i
  const [playerStats, setPlayerStats] = useState({});
  const [currentMatchWeek, setCurrentMatchWeek] = useState(1);

  // Ana menüde gösterilecek lig sıralamasını hesapla
  const calculateCurrentLeaguePosition = () => {
    if (!club || !fixtureData[club.league]) return club.lig || 1;
    
    const leagueFixtures = fixtureData[club.league];
    const leagueTeams = turkishLeagues[club.league];
    
    // Henüz hiç maç oynanmamışsa başlangıç pozisyonunu göster
    const hasPlayedMatches = leagueFixtures.some(fixture => fixture.played);
    if (!hasPlayedMatches) {
      return club.lig || 1;
    }
    
    const calculateTeamStats = (teamName) => {
      let played = 0, wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;
      
      leagueFixtures.forEach(fixture => {
        if (fixture.played && (fixture.homeTeam === teamName || fixture.awayTeam === teamName)) {
          played++;
          const [homeScore, awayScore] = fixture.result.split('-').map(Number);
          
          if (fixture.homeTeam === teamName) {
            goalsFor += homeScore;
            goalsAgainst += awayScore;
            if (homeScore > awayScore) wins++;
            else if (homeScore < awayScore) losses++;
            else draws++;
          } else {
            goalsFor += awayScore;
            goalsAgainst += homeScore;
            if (awayScore > homeScore) wins++;
            else if (awayScore < homeScore) losses++;
            else draws++;
          }
        }
      });
      
      return {
        played,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        points: wins * 3 + draws
      };
    };
    
    // Takımları sırala
    const sortedTeams = leagueTeams.map(team => {
      const stats = calculateTeamStats(team.name);
      return {
        ...team,
        ...stats
      };
    }).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const aAvg = a.goalsFor - a.goalsAgainst;
      const bAvg = b.goalsFor - b.goalsAgainst;
      if (bAvg !== aAvg) return bAvg - aAvg;
      return b.goalsFor - a.goalsFor;
    });
    
    // Kullanıcının takımının pozisyonunu bul
    const userTeamIndex = sortedTeams.findIndex(team => team.name === club.name);
    return userTeamIndex !== -1 ? userTeamIndex + 1 : club.lig || 1;
  };
  
  // OtherMatchesModal açıldığında diğer maçları oyna
  useEffect(() => {
    if (showOtherMatches && club) {
      generateOtherTeamResults();
    }
  }, [showOtherMatches, club]);

  const [technicalStaff, setTechnicalStaff] = useState({
    assistant: [
      { name: 'Boş', avatar: '', filled: false, available: true },
      { name: 'Boş', avatar: '', filled: false, available: false }
    ],
    physio: [
      { name: 'Boş', avatar: '', filled: false, available: true },
      { name: 'Boş', avatar: '', filled: false, available: false }
    ],
    coach: [
      { name: 'Boş', avatar: '', filled: false, available: true },
      { name: 'Boş', avatar: '', filled: false, available: true },
      { name: 'Boş', avatar: '', filled: false, available: false },
      { name: 'Boş', avatar: '', filled: false, available: false }
    ],
    scout: [
      { name: 'Boş', avatar: '', filled: false, available: true },
      { name: 'Boş', avatar: '', filled: false, available: true },
      { name: 'Boş', avatar: '', filled: false, available: false },
      { name: 'Boş', avatar: '', filled: false, available: false }
    ]
  });

  const handleTeamSelect = async (selectedTeam, selectedLeague) => {
    const newClubData = await createClubData(selectedTeam, selectedLeague);
    setClub(newClubData);
    setShowTeamSelection(false);
    setShowManagerSelection(true); // Menajer seçim ekranını göster
    setFixturesCreated(false); // Yeni takım için flag'i sıfırla
  };

  const handleManagerSelect = (manager) => {
    setSelectedManager(manager);
    setShowManagerSelection(false);
  };



  // Hazırlık maçları - global state olarak tut
  const [preSeasonFixtures, setPreSeasonFixtures] = useState([]);

  // Bu eski useEffect kaldırıldı - artık yeni useEffect kullanılıyor

  const generateRandomMatch = () => {
    // Bu hafta için hazırlık maçını bul
    const currentWeek = gameTime.week;
    console.log('Hafta', currentWeek, 'için hazırlık maçı aranıyor...');
    console.log('Mevcut preSeasonFixtures:', preSeasonFixtures);
    
    // Önce bu hafta için oynanmamış maç ara
    let currentFixture = preSeasonFixtures.find(fixture => Math.abs(fixture.matchday) === currentWeek && !fixture.played);
    
    // Eğer bulunamazsa, herhangi bir oynanmamış maç ara
    if (!currentFixture) {
      currentFixture = preSeasonFixtures.find(fixture => !fixture.played);
      console.log('Bu hafta için maç bulunamadı, oynanmamış maç arandı:', currentFixture);
    }
    
    if (currentFixture) {
      console.log('Mevcut hazırlık maçı bulundu:', currentFixture);
      return {
        awayTeam: currentFixture.awayTeam,
        type: 'friendly',
        fixture: currentFixture
      };
    }
    
    console.log('Hiç oynanmamış hazırlık maçı bulunamadı, yeni maç oluşturuluyor...');
    
    // Eğer fikstürde yoksa, bu hafta için yeni hazırlık maçı oluştur
    const allTeams = [];
    Object.values(turkishLeagues).forEach(league => {
      league.forEach(team => {
        if (team !== club.name) {
          allTeams.push(team);
        }
      });
    });
    
    const randomTeam = allTeams[Math.floor(Math.random() * allTeams.length)];
    
    // Yeni hazırlık maçını fikstüre ekle
    const newFixture = {
      homeTeam: club.name,
      awayTeam: randomTeam,
      matchday: -currentWeek,
      isPreSeason: true,
      result: null,
      played: false,
      week: null
    };
    
    console.log('Yeni hazırlık maçı oluşturuldu:', newFixture);
    
    // State'i güncelle ve yeni fixture'ı döndür
    const updatedFixtures = [...preSeasonFixtures, newFixture];
    setPreSeasonFixtures(updatedFixtures);
    
    return {
      awayTeam: randomTeam,
      type: 'friendly',
      fixture: newFixture
    };
  };

  const generateOtherTeamResults = () => {
    if (!club) return;
    
    const currentWeek = gameTime.week - 3; // İlk 3 hafta hazırlık, 4. haftadan itibaren lig maçları
    const leagueFixtures = fixtureData[club.league] || [];
    
    console.log(`Lig haftası ${currentWeek} için diğer maçlar oynanıyor...`);
    
    // Tüm geçmiş haftaları da kontrol et (1'den currentWeek'e kadar)
    let totalPlayedCount = 0;
    const updatedFixtures = { ...fixtureData };
    const updatedLeagueFixtures = [...leagueFixtures];
    
    // 1. haftadan mevcut haftaya kadar tüm haftaları kontrol et
    for (let week = 1; week <= currentWeek; week++) {
      const weekFixtures = updatedLeagueFixtures.filter(fixture => fixture.week === week);
      
      // Bu hafta kullanıcının maçı oynanmış mı?
      const userMatchPlayed = weekFixtures.some(fixture => 
        (fixture.homeTeam === club.name || fixture.awayTeam === club.name) && fixture.played
      );
      
      console.log(`Hafta ${week}: ${weekFixtures.length} maç, kullanıcı maçı oynanmış: ${userMatchPlayed}`);
      
      // Eğer kullanıcının maçı oynanmışsa, diğer maçları da oyna
      if (userMatchPlayed) {
        let weekPlayedCount = 0;
        weekFixtures.forEach(fixture => {
          if (!fixture.played && fixture.homeTeam !== club.name && fixture.awayTeam !== club.name) {
            // Rastgele skor üret (0-4 arası)
            const homeScore = Math.floor(Math.random() * 5);
            const awayScore = Math.floor(Math.random() * 5);
            
            fixture.result = `${homeScore}-${awayScore}`;
            fixture.played = true;
            weekPlayedCount++;
            totalPlayedCount++;
            
            console.log(`Hafta ${week} - Diğer maç: ${fixture.homeTeam} ${homeScore}-${awayScore} ${fixture.awayTeam}`);
          }
        });
        console.log(`Hafta ${week}: ${weekPlayedCount} diğer maç oynandı`);
      }
    }
    
    // Güncellenmiş fikstürü state'e kaydet
    updatedFixtures[club.league] = updatedLeagueFixtures;
    setFixtureData(updatedFixtures);
    
    console.log(`Toplam ${totalPlayedCount} diğer maç oynandı`);
  };

  // Lig tablosu artık fikstürden otomatik hesaplanıyor, ayrı state'e gerek yok

  const getCurrentFixture = () => {
    // Fikstürden mevcut haftanın maçını al
    const currentWeek = gameTime.week - 3; // İlk 3 hafta hazırlık, 4. haftadan itibaren lig maçları
    const leagueFixtures = fixtureData[club.league] || [];
    
    console.log(`Lig maçı aranıyor: Hafta ${currentWeek}, ${club.league}, ${club.name}`);
    
    // Eğer bu hafta için maç varsa ve henüz oynanmamışsa
    const currentFixture = leagueFixtures.find(fixture => 
      fixture.week === currentWeek && 
      (fixture.homeTeam === club.name || fixture.awayTeam === club.name) &&
      !fixture.played
    );
    
    if (currentFixture) {
      return {
        awayTeam: currentFixture.homeTeam === club.name ? currentFixture.awayTeam : currentFixture.homeTeam,
        type: 'league',
        fixture: currentFixture,
        isHome: currentFixture.homeTeam === club.name
      };
    }
    
    // Eğer bu hafta için maç yoksa, gelecek haftaya bak
    const nextWeek = currentWeek + 1;
    const nextFixture = leagueFixtures.find(fixture => 
      fixture.week === nextWeek && 
      (fixture.homeTeam === club.name || fixture.awayTeam === club.name) &&
      !fixture.played
    );
    
    if (nextFixture) {
      return {
        awayTeam: nextFixture.homeTeam === club.name ? nextFixture.awayTeam : nextFixture.homeTeam,
        type: 'league',
        fixture: nextFixture,
        isHome: nextFixture.homeTeam === club.name
      };
    }
    
    return null;
  };

  // Hafta sonu maç kontrolü
  useEffect(() => {
    if (gameTime.day === 'Hafta Sonu' && !currentMatch) {
      // İlk 3 hafta hazırlık maçları
      if (gameTime.week <= 3) {
        const newMatch = generateRandomMatch();
        setCurrentMatch(newMatch);
      } else {
        // 4. haftadan itibaren lig maçları
        const fixtureMatch = getCurrentFixture();
        if (fixtureMatch) {
          setCurrentMatch(fixtureMatch);
        } else {
          // Lig maçı bulunamadıysa maç yok
          console.log('Bu hafta için lig maçı bulunamadı');
        }
      }
    }
  }, [gameTime.day]);

  // HF SONU güncelleme
  useEffect(() => {
    if (club) {
      let newHfSonu;
      if (gameTime.day === 'Hafta Başı') {
        newHfSonu = `Hafta ${gameTime.week} Başı`;
      } else if (gameTime.day === 'Hafta İçi') {
        newHfSonu = `Hafta ${gameTime.week} İçi`;
      } else if (gameTime.day === 'Hafta Sonu') {
        newHfSonu = `Hafta ${gameTime.week} Sonu`;
      }
      
      if (newHfSonu && newHfSonu !== club.hfSonu) {
        setClub(prevClub => ({
          ...prevClub,
          hfSonu: newHfSonu
        }));
      }
    }
  }, [gameTime, club]);

  // Hazırlık maçlarını sadece sezon başında oluştur (hafta 1'de)
  const [fixturesCreated, setFixturesCreated] = useState(false);
  
  useEffect(() => {
    if (club && !fixturesCreated && preSeasonFixtures.length === 0 && gameTime.week === 1 && Object.keys(turkishLeagues).length > 0) {
      console.log('Hazırlık maçları oluşturuluyor...');
      // Rastgele takımlar seç
      const allTeams = [];
      Object.values(turkishLeagues).forEach(league => {
        league.forEach(team => {
          if (team.name !== club.name) {
            allTeams.push(team.name);
          }
        });
      });
      
      // 3 rastgele takım seç
      const randomTeams = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * allTeams.length);
        randomTeams.push(allTeams[randomIndex]);
        allTeams.splice(randomIndex, 1);
      }
      
      const newFixtures = [
        { homeTeam: club.name, awayTeam: randomTeams[0], matchday: -1, isPreSeason: true, result: null, played: false, week: null },
        { homeTeam: club.name, awayTeam: randomTeams[1], matchday: -2, isPreSeason: true, result: null, played: false, week: null },
        { homeTeam: club.name, awayTeam: randomTeams[2], matchday: -3, isPreSeason: true, result: null, played: false, week: null }
      ];
      
      console.log('Oluşturulan hazırlık maçları:', newFixtures);
      setPreSeasonFixtures(newFixtures);
      setFixturesCreated(true); // Flag'i set et
    }
  }, [club, turkishLeagues, fixturesCreated]); // Sadece club ve turkishLeagues değiştiğinde çalışsın

  const handleStaffHire = (staffType, index, staffName) => {
    // Teknik kadroyu güncelle
    const newStaff = { ...technicalStaff };
    newStaff[staffType][index] = {
      name: staffName,
      avatar: staffName.split(' ')[0][0],
      filled: true,
      available: true
    };
    setTechnicalStaff(newStaff);

    // Menajer puanlarını güncelle
    const updatedManager = { ...selectedManager };
    if (staffType === 'assistant' || staffType === 'physio') {
      updatedManager.management = Math.min(100, updatedManager.management + 1);
    } else if (staffType === 'coach') {
      updatedManager.attacking = Math.min(100, updatedManager.attacking + 1);
    } else if (staffType === 'scout') {
      updatedManager.tactical = Math.min(100, updatedManager.tactical + 1);
    }
    setSelectedManager(updatedManager);
  };

  const handleTrainingUpgrade = (expense, newLevel) => {
    // Ana paradan masrafı düş
    const updatedClub = { ...club };
    updatedClub.money -= expense;
    updatedClub.antrenman = newLevel;
    setClub(updatedClub);
  };

  const handleYouthUpgrade = (expense, newLevel) => {
    // Ana paradan masrafı düş
    const updatedClub = { ...club };
    updatedClub.money -= expense;
    updatedClub.altyapi = newLevel;
    setClub(updatedClub);
  };

  // Takım seçilmemişse seçim ekranını göster
  if (showTeamSelection || !club) {
    return <TeamSelection onTeamSelect={handleTeamSelect} />;
  }

  if (showManagerSelection) {
    return (
      <ManagerSelectionModal 
        setShowManagerSelection={setShowManagerSelection}
        onManagerSelect={handleManagerSelect}
        leagueName={club.league}
        teamValue={club.kadro}
      />
    );
  }

  return (
    <div className="fc-container">
      <div className="fc-header">
        <div className="fc-title">FOOTBALL CHAIRMAN</div>
        <div className="fc-ribbon">{club.name}</div>
        <div className="fc-sub">{club.season} &nbsp;|&nbsp; {club.league} &nbsp;|&nbsp; {club.date}</div>
      </div>

      <div className="fc-grid">
        <button className="fc-card white" onClick={() => setShowFixture(true)}>
          HF SONU<span className="big">{club.hfSonu}</span>
        </button>
        <button className="fc-card white" onClick={() => setShowStandings(true)}>
          LİG<span className="big">{calculateCurrentLeaguePosition()}.</span>
        </button>
        <button className="fc-card white" onClick={() => setShowFinance(true)}>
          PARA<span className="big" style={{ color: 'var(--win)' }}>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(club.money)}</span>
        </button>
      </div>

      {showFixture && <FixtureModal 
        setShowFixture={setShowFixture} 
        club={club} 
        preSeasonFixtures={preSeasonFixtures}
        fixtureData={fixtureData}
        onShowSquad={(teamName) => {
          setSelectedTeamForSquad(teamName);
          setShowSquad(true);
        }}
      />}
      {showStandings && <StandingsModal 
        setShowStandings={setShowStandings} 
        club={club} 
        fixtureData={fixtureData}
        turkishLeagues={turkishLeagues}
        onShowSquad={(teamName) => {
          setSelectedTeamForSquad(teamName);
          setShowSquad(true);
        }}
      />}
      {showFinance && <FinanceModal setShowFinance={setShowFinance} club={club} />}
      {showSquad && <SquadModal 
        setShowSquad={setShowSquad} 
        club={club} 
        selectedTeam={selectedTeamForSquad}
        playerStats={playerStats}
      />}
      {showManagerDetail && <ManagerDetailModal 
        setShowManagerDetail={setShowManagerDetail} 
        selectedManager={selectedManager}
        technicalStaff={technicalStaff}
        onStaffHire={handleStaffHire}
      />}
      {showTrainingFacilities && <TrainingFacilitiesModal 
        setShowTrainingFacilities={setShowTrainingFacilities}
        club={club}
        onUpgrade={handleTrainingUpgrade}
      />}
      {showYouthFacilities && <YouthFacilitiesModal 
        setShowYouthFacilities={setShowYouthFacilities}
        club={club}
        onUpgrade={handleYouthUpgrade}
        onShowYouthSquad={() => setShowYouthSquad(true)}
      />}
      {showYouthSquad && <YouthSquadModal 
        setShowYouthSquad={setShowYouthSquad}
        club={club}
      />}
      {showFanSatisfaction && <FanSatisfactionModal 
        setShowFanSatisfaction={setShowFanSatisfaction}
        club={club}
        turkishLeagues={turkishLeagues}
      />}
      {showStadium && <StadiumModal 
        setShowStadium={setShowStadium}
        onShowFacilities={() => setShowStadiumFacilities(true)}
        onShowTribuneUpgrade={(tribune) => {
          setSelectedTribune(tribune);
          setShowTribuneUpgrade(true);
        }}
        onShowPitchImprovement={() => setShowPitchImprovement(true)}
      />}
      {showPitchImprovement && <PitchImprovementModal 
        setShowPitchImprovement={setShowPitchImprovement}
        club={club}
        onShowStadium={() => setShowStadium(true)}
      />}
      {showStadiumFacilities && <StadiumFacilitiesModal 
        setShowStadiumFacilities={setShowStadiumFacilities}
        onShowStadium={() => setShowStadium(true)}
      />}
      {showTribuneUpgrade && selectedTribune && <TribuneUpgradeModal 
        setShowTribuneUpgrade={setShowTribuneUpgrade}
        selectedTribune={selectedTribune}
        club={club}
      />}
      {showMatchPlay && currentMatch && <MatchPlayModal 
        setShowMatchPlay={setShowMatchPlay}
        club={club}
        matchData={currentMatch}
                  onMatchEnd={(result) => {
            console.log('Maç sonucu:', result);
            
            // Oyuncu istatistiklerini güncelle (hem lig hem hazırlık maçları için)
            if (result.events) {
              const newPlayerStats = { ...playerStats };
              
              result.events.forEach(event => {
                if (event.player) {
                  if (!newPlayerStats[event.player]) {
                    newPlayerStats[event.player] = {
                      goals: 0,
                      assists: 0,
                      yellowCards: 0,
                      redCards: 0,
                      injuries: []
                    };
                  }
                  
                  // Hazırlık maçlarında sadece sakatlıkları kaydet
                  if (currentMatch.type === 'friendly') {
                    if (event.type === 'injury') {
                      const matchesOut = Math.floor(Math.random() * 10) + 1; // 1-10 maç
                      newPlayerStats[event.player].injuries.push({
                        type: event.injuryType || 'Sakatlık',
                        matchesOut: matchesOut,
                        week: gameTime.week
                      });
                    }
                  } else {
                    // Lig maçlarında tüm istatistikleri kaydet
                    switch (event.type) {
                      case 'goal':
                        newPlayerStats[event.player].goals++;
                        break;
                      case 'assist':
                        newPlayerStats[event.player].assists++;
                        break;
                      case 'yellow':
                        newPlayerStats[event.player].yellowCards++;
                        break;
                      case 'red':
                        newPlayerStats[event.player].redCards++;
                        break;
                      case 'injury': {
                        const matchesOut = Math.floor(Math.random() * 10) + 1; // 1-10 maç
                        newPlayerStats[event.player].injuries.push({
                          type: event.injuryType || 'Sakatlık',
                          matchesOut: matchesOut,
                          week: gameTime.week
                        });
                        break;
                      }
                    }
                  }
                }
              });
              
              setPlayerStats(newPlayerStats);
            }
            
            // Maç sonucunu fikstüre ekle
            if (currentMatch.type === 'league' && currentMatch.fixture) {
              // Lig fikstüründen doğru maçı bul ve güncelle
              const currentWeek = gameTime.week - 3;
              const leagueFixtures = fixtureData[club.league] || [];
              const fixtureToUpdate = leagueFixtures.find(f => 
                f.week === currentWeek && 
                ((f.homeTeam === club.name && f.awayTeam === currentMatch.awayTeam) ||
                 (f.awayTeam === club.name && f.homeTeam === currentMatch.awayTeam))
              );
              
              if (fixtureToUpdate) {
                // Ev sahibi/deplasman durumuna göre doğru skoru kaydet
                if (currentMatch.isHome) {
                  // Kullanıcı ev sahibi, skor doğru
                  fixtureToUpdate.result = `${result.homeScore}-${result.awayScore}`;
                } else {
                  // Kullanıcı deplasman, skoru ters çevir
                  fixtureToUpdate.result = `${result.awayScore}-${result.homeScore}`;
                }
                fixtureToUpdate.played = true;
                console.log('Lig maçı sonucu fikstüre kaydedildi:', fixtureToUpdate);
              }
              
              // Maç sonucu fikstüre kaydedildi, lig tablosu otomatik güncellenecek
              
              // Diğer takımların maçlarını da çalıştır
              generateOtherTeamResults();
            } else if (currentMatch.type === 'friendly' && currentMatch.fixture) {
              // Hazırlık maçı sonucunu fikstüre ekle
              const currentWeek = gameTime.week;
              
              // Bu hafta için hazırlık maçını bul ve güncelle
              let fixtureToUpdate = null;
              
              console.log('Hazırlık maçı güncelleniyor:', { currentWeek, awayTeam: currentMatch.awayTeam });
              console.log('currentMatch.fixture:', currentMatch.fixture);
              
              // Önce currentMatch.fixture varsa onu kullan (en güvenilir yöntem)
              if (currentMatch.fixture) {
                fixtureToUpdate = preSeasonFixtures.find(fixture => 
                  fixture === currentMatch.fixture
                );
                console.log('Fixture referansı ile bulundu:', fixtureToUpdate);
              }
              
              // Eğer bulunamazsa, hafta ve takım adına göre ara
              if (!fixtureToUpdate) {
                fixtureToUpdate = preSeasonFixtures.find(fixture => 
                  Math.abs(fixture.matchday) === currentWeek && fixture.awayTeam === currentMatch.awayTeam
                );
                console.log('Hafta ve takım adı ile bulundu:', fixtureToUpdate);
              }
              
              // Hala bulunamazsa, sadece takım adına göre ara (son çare)
              if (!fixtureToUpdate) {
                fixtureToUpdate = preSeasonFixtures.find(fixture => 
                  fixture.awayTeam === currentMatch.awayTeam && !fixture.played
                );
                console.log('Sadece takım adı ile bulundu:', fixtureToUpdate);
              }
              
              if (fixtureToUpdate) {
                fixtureToUpdate.result = `${result.homeScore}-${result.awayScore}`;
                fixtureToUpdate.played = true;
                // State'i güncellemeye gerek yok, doğrudan obje güncellendi
                console.log('Hazırlık maçı sonucu fikstüre kaydedildi:', fixtureToUpdate);
              } else {
                console.log('Hazırlık maçı bulunamadı:', { currentWeek, awayTeam: currentMatch.awayTeam });
                console.log('Mevcut hazırlık maçları:', preSeasonFixtures);
              }
            } else if (currentMatch.type === 'friendly') {
              // Rastgele hazırlık maçı sonucunu sadece kulüp geçmişine ekle
              console.log('Rastgele hazırlık maçı sonucu kaydedildi');
            }
            
            // Maç sonucunu kulüp geçmişine ekle
            const matchResult = {
              homeTeam: club.name,
              awayTeam: currentMatch.awayTeam,
              homeScore: result.homeScore,
              awayScore: result.awayScore,
              type: currentMatch.type,
              week: gameTime.week
            };
            
            club.matchResults.push(matchResult);
            
            // Maç tipini sakla
            const matchType = currentMatch.type;
            setCurrentMatch(null);
            
            // Sadece lig maçlarından sonra diğer maç sonuçlarını göster
            if (matchType === 'league') {
              // Önce diğer maçları oyna, sonra modalı aç
              setTimeout(() => {
                // Hangi haftanın maç sonuçlarını göstereceğini belirt
                const matchWeek = gameTime.week - 3; // Lig haftası
                setShowOtherMatches(true);
                // Modal'a hangi haftayı göstereceğini geçmek için state ekleyelim
                setCurrentMatchWeek(matchWeek);
              }, 100);
            }
            
            // Eğer hafta sonu ise gelir-gider raporu göster
            if (gameTime.day === 'Hafta Sonu') {
              // Hafta geçişi yap
              const updatedClub = advanceWeek(club);
              setClub(updatedClub);
              setGameTime({ week: updatedClub.gameTime.week, day: 'Hafta Başı' });
              
              // Gelir-gider raporu göster
              setShowWeeklyReport(true);
            }
          }}
      />}
      {showOtherMatches && <OtherMatchesModal 
        setShowOtherMatches={setShowOtherMatches}
        club={club}
        fixtureData={fixtureData}
        gameTime={gameTime}
        currentMatchWeek={currentMatchWeek}
      />}
      {showPlayerStats && <PlayerStatsModal 
        setShowPlayerStats={setShowPlayerStats}
        club={club}
        playerStats={playerStats}
      />}
      {showWeeklyReport && <WeeklyReportModal 
        setShowWeeklyReport={setShowWeeklyReport}
        club={club}
      />}

      <div className="fc-grid" style={{ marginTop: '10px' }}>
        <button className="fc-card navy" onClick={() => setShowSquad(true)} style={{ cursor: 'pointer' }}>
          KADRO<br/>{(() => {
            const allPlayers = [...club.squad.firstTeam, ...club.squad.substitutes];
            const totalRating = allPlayers.reduce((sum, player) => sum + player.rating, 0);
            return Math.round(totalRating / allPlayers.length);
          })()}
        </button>
        <button className="fc-card navy" onClick={() => setShowPlayerStats(true)} style={{ cursor: 'pointer' }}>
          İSTATİSTİK<br/>📊
        </button>
        <button 
          className="fc-card navy" 
          onClick={() => setShowManagerDetail(true)}
          style={{ cursor: 'pointer' }}
        >
          MENAJER<br/>{selectedManager ? selectedManager.name : club.menajer}
        </button>
        <button 
          className="fc-card navy" 
          onClick={() => setShowTrainingFacilities(true)}
          style={{ cursor: 'pointer' }}
        >
          ANTRENMAN<br/>{club.antrenman}
        </button>
        <button 
          className="fc-card navy" 
          onClick={() => setShowYouthFacilities(true)}
          style={{ cursor: 'pointer' }}
        >
          ALTYAPI<br/>{club.altyapi}
        </button>
      </div>



                      <div className="fc-grid" style={{ marginTop: '10px' }}>
                  <button
                    className="fc-card light"
                    onClick={() => setShowFanSatisfaction(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    TARAFTARLAR MUTLU MU?<br/><span style={{fontSize: '1.2em'}}>{club.taraftarMutlu}% MENAJER<br/>{club.baskanMutlu}% BAŞKAN</span>
                  </button>
                  <button
                    className="fc-card light"
                    onClick={() => setShowStadium(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    STADYUM<br/><span style={{fontSize: '1.2em'}}>🏟️</span>
                  </button>
                </div>

                {/* Zaman İlerletme Butonu */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button
                    className="fc-card light"
                    onClick={() => {
                      if (currentMatch) {
                        setShowMatchPlay(true);
                      } else {
                        // Zaman ilerlet - advanceWeek fonksiyonunu kullan
                        const updatedClub = advanceWeek(club);
                        setClub(updatedClub);
                        setGameTime(updatedClub.gameTime);
                      }
                    }}
                    style={{ 
                      cursor: 'pointer',
                      background: currentMatch ? 'var(--win)' : 'var(--green)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      padding: '15px 30px',
                      borderRadius: '8px',
                      border: 'none'
                    }}
                  >
                    {currentMatch ? `${currentMatch.awayTeam}` : 'Devam Et'}
                  </button>
                </div>

      <div className="fc-dots">
        {club.matchResults.length > 0 ? (
          club.matchResults.map((result, idx) => (
            <div key={idx} className="fc-dot" style={{ background: getResultColor(result) }}>
              {typeof result === 'string' ? result : `${result.homeScore}-${result.awayScore}`}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#ccc', fontSize: '14px' }}>
            Henüz maç oynanmadı
          </div>
        )}
      </div>





      {showTrainingMenu && (
        <div className="fc-modal-backdrop">
          <TrainingMenu setShowTrainingMenu={setShowTrainingMenu} />
          <button
            className="fc-btn"
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'red' }}
            onClick={() => setShowTrainingMenu(false)}
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
}

export default App;