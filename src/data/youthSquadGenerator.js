import { turkishFirstNames, turkishLastNames, positions } from './turkishNames';

// Altyapı kadrosu oluşturma fonksiyonu
export const generateYouthSquad = (facilityLevel) => {
  const youthPlayers = [];
  const maxRating = Math.max(10, facilityLevel - 4); // Min 10, max (tesis seviyesi - 4)
  
  // 12 genç oyuncu oluştur (16-18 yaş arası)
  for (let i = 0; i < 12; i++) {
    const firstName = turkishFirstNames[Math.floor(Math.random() * turkishFirstNames.length)];
    const lastName = turkishLastNames[Math.floor(Math.random() * turkishLastNames.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const age = Math.floor(Math.random() * 3) + 16; // 16-18 yaş arası
    const rating = Math.floor(Math.random() * (maxRating - 10 + 1)) + 10; // 10 ile maxRating arası
    
    youthPlayers.push({
      id: `youth_${i}`,
      name: `${firstName} ${lastName}`,
      position: position,
      age: age,
      rating: rating
    });
  }
  
  return youthPlayers;
};

// Tüm takımların altyapı kadrolarını oluştur
export const generateAllYouthSquads = (turkishLeagues) => {
  const allYouthSquads = {};
  
  Object.keys(turkishLeagues).forEach(leagueName => {
    allYouthSquads[leagueName] = {};
    
    turkishLeagues[leagueName].forEach(team => {
      // Her takım için sabit bir altyapı seviyesi (30-50 arası)
      const facilityLevel = Math.floor(Math.random() * 21) + 30;
      allYouthSquads[leagueName][team.name] = {
        squad: generateYouthSquad(facilityLevel),
        facilityLevel: facilityLevel
      };
    });
  });
  
  return allYouthSquads;
};
