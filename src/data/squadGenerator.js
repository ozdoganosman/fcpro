import {
  generateRandomName,
  generateRandomAge,
  generateContractEnd,
  generateFormFitnessMorale,
  calculatePlayerSalary,
  calculateEnergyLevel
} from './turkishNames';
import { fetchCSV } from './csvCache';

// CSV'den takım değerini al ve oyuncu yeteneklerini hesapla
const getTeamValueFromCSV = async (teamName) => {
  try {
    const csvText = await fetchCSV('turkish_leagues_with_values.csv');
    const lines = csvText.split('\n').slice(1); // İlk satırı atla (başlık)
    
    for (const line of lines) {
      const [takim, , deger] = line.split(','); // 'lig' değişkenini atla
      if (takim === teamName) {
        return parseFloat(deger);
      }
    }
    
    console.warn(`Takım değeri bulunamadı: ${teamName}`);
    return 15; // Varsayılan değer
  } catch (error) {
    console.error('CSV okuma hatası:', error);
    return 15; // Hata durumunda varsayılan değer
  }
};

// CSV'den oyuncu yetenek seviyesini hesapla
const getPlayerSkillLevel = async (teamValue) => {
  try {
    const csvText = await fetchCSV('Kadro_Yetenek_Listesi__Vmin_2__Vmax_350__Ymin_20__Ymax_92_.csv');
    const lines = csvText.split('\n').slice(1); // İlk satırı atla
    
    const kadroData = lines.map(line => {
      const [kadroDegeri, yetenek] = line.split(',');
      return {
        kadro: parseFloat(kadroDegeri),
        yetenek: parseFloat(yetenek)
      };
    });
    
    // Tam eşleşme var mı kontrol et
    const exactMatch = kadroData.find(item => item.kadro === teamValue);
    if (exactMatch) {
      return exactMatch.yetenek;
    }
    
    // İnterpolasyon yap
    for (let i = 0; i < kadroData.length - 1; i++) {
      const current = kadroData[i];
      const next = kadroData[i + 1];
      
      if (teamValue >= current.kadro && teamValue <= next.kadro) {
        const ratio = (teamValue - current.kadro) / (next.kadro - current.kadro);
        const interpolatedYetenek = current.yetenek + ratio * (next.yetenek - current.yetenek);
        return interpolatedYetenek;
      }
    }
    
    return 50; // Varsayılan değer
  } catch (error) {
    console.error('CSV okuma hatası:', error);
    return 50; // Hata durumunda varsayılan değer
  }
};

// Kadro oluşturma fonksiyonu
export const generateSquad = async (teamName, leagueName) => {
  // CSV'den takım değerini al
  const actualTeamValue = await getTeamValueFromCSV(teamName);
  
  // CSV'den oyuncu yetenek seviyesini hesapla
  const skillLevel = await getPlayerSkillLevel(actualTeamValue);
  
  // Yetenek seviyesini oyuncu reytingine çevir (20-92 -> 20-80)
  const baseRating = Math.max(20, Math.min(80, skillLevel));
  
  // Lig bazında sapma değerleri
  const leagueSettings = {
    'Süper Lig': { deviation: 15 },
    '1. Lig': { deviation: 12 },
    '2. Lig Beyaz': { deviation: 10 },
    '2. Lig Kırmızı': { deviation: 10 }
  };

  const settings = leagueSettings[leagueName] || { deviation: 10 };
  
  // İlk takım (11 oyuncu)
  const firstTeam = [];
  const positions = ['K', 'D', 'D', 'D', 'D', 'O', 'O', 'O', 'O', 'F', 'F']; // 4-4-2 formasyonu
  
  for (let i = 0; i < 11; i++) {
    const position = positions[i];
    const rating = generatePlayerRating(baseRating, settings.deviation, position);
    
    const age = generateRandomAge();
    const salary = calculatePlayerSalary(rating, age, position, leagueName);
    const form = generateFormFitnessMorale();
    
    firstTeam.push({
      id: `ft_${i}`,
      name: generateRandomName(),
      position: position,
      rating: rating,
      form: form,
      energy: calculateEnergyLevel(), // Başlangıç enerjisi %100
      age: age,
      contractEnd: generateContractEnd(),
      salary: salary,
      isFirstTeam: true
    });
  }
  
  // Yedek oyuncular (9 oyuncu)
  const substitutes = [];
  const subPositions = ['K', 'D', 'D', 'D', 'O', 'O', 'F', 'F', 'F']; // Yedek pozisyonlar
  
  for (let i = 0; i < 9; i++) {
    const position = subPositions[i];
    const rating = generatePlayerRating(baseRating - 5, settings.deviation, position); // Yedekler biraz daha düşük
    
    const age = generateRandomAge();
    const salary = calculatePlayerSalary(rating, age, position, leagueName);
    const form = generateFormFitnessMorale();
    
    substitutes.push({
      id: `sub_${i}`,
      name: generateRandomName(),
      position: position,
      rating: rating,
      form: form,
      energy: calculateEnergyLevel(), // Başlangıç enerjisi %100
      age: age,
      contractEnd: generateContractEnd(),
      salary: salary,
      isFirstTeam: false
    });
  }
  
  return {
    teamName: teamName,
    league: leagueName,
    firstTeam: firstTeam,
    substitutes: substitutes,
    totalPlayers: 20,
    averageRating: Math.round(
      [...firstTeam, ...substitutes].reduce((sum, player) => sum + player.rating, 0) / 20
    )
  };
};

// Oyuncu reytingi oluşturma fonksiyonu
const generatePlayerRating = (baseRating, deviation, position) => {
  // Pozisyona göre reyting ayarlamaları
  const positionModifiers = {
    'K': { min: 25, max: 85 }, // Kaleci
    'D': { min: 20, max: 80 }, // Defans
    'O': { min: 20, max: 80 }, // Orta Saha
    'F': { min: 20, max: 80 }  // Forvet
  };
  
  const modifier = positionModifiers[position] || { min: 20, max: 80 };
  
  // CSV'den gelen yetenek seviyesine göre reyting oluştur
  let rating = baseRating + (Math.random() - 0.5) * deviation * 2;
  rating = Math.round(rating);
  
  // Pozisyon sınırlarına uygula
  rating = Math.max(modifier.min, Math.min(modifier.max, rating));
  
  return rating;
};

// Kadro istatistikleri hesaplama
export const calculateSquadStats = (squad) => {
  const allPlayers = [...squad.firstTeam, ...squad.substitutes];
  
  const stats = {
    totalPlayers: allPlayers.length,
    averageRating: Math.round(allPlayers.reduce((sum, p) => sum + p.rating, 0) / allPlayers.length),
    averageAge: Math.round(allPlayers.reduce((sum, p) => sum + p.age, 0) / allPlayers.length),
    positionCount: {
      K: allPlayers.filter(p => p.position === 'K').length,
      D: allPlayers.filter(p => p.position === 'D').length,
      O: allPlayers.filter(p => p.position === 'O').length,
      F: allPlayers.filter(p => p.position === 'F').length
    },
    bestPlayer: allPlayers.reduce((best, current) => current.rating > best.rating ? current : best),
    youngestPlayer: allPlayers.reduce((youngest, current) => current.age < youngest.age ? current : youngest),
    oldestPlayer: allPlayers.reduce((oldest, current) => current.age > oldest.age ? current : oldest)
  };
  
  return stats;
};

// Tüm takımlar için kadro oluşturma
export const generateAllSquads = async (turkishLeagues) => {
  const allSquads = {};
  
  for (const leagueName of Object.keys(turkishLeagues)) {
    allSquads[leagueName] = {};
    
    for (const team of turkishLeagues[leagueName]) {
      allSquads[leagueName][team.name] = await generateSquad(team.name, leagueName);
    }
  }
  
  return allSquads;
};
