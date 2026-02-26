import { generateAllSquads } from './data/squadGenerator';
import { generateAllYouthSquads } from './data/youthSquadGenerator';
import { generateManager as generateManagerCSV } from './data/managerData';
import { fetchCSV } from './data/csvCache';

// CSV'den takım verilerini dinamik olarak yükle
export const loadTurkishLeaguesFromCSV = async () => {
  try {
    const csvText = await fetchCSV('turkish_leagues_with_values.csv');
    const lines = csvText.split('\n').slice(1); // İlk satırı atla (başlık)
    
    const leagues = {
      'Süper Lig': [],
      '1. Lig': [],
      '2. Lig Beyaz': [],
      '2. Lig Kırmızı': []
    };
    
    let position = 1;
    let currentLeague = '';
    
    for (const line of lines) {
      if (line.trim()) {
        const [takim, lig, deger] = line.split(',').map(item => item.trim());
        
        if (lig && leagues[lig]) {
          // Yeni lig başladığında pozisyonu sıfırla
          if (currentLeague !== lig) {
            currentLeague = lig;
            position = 1;
          }
          
          leagues[lig].push({
            name: takim,
            value: parseFloat(deger),
            position: position++
          });
        }
      }
    }
    
    console.log('CSV\'den takım verileri yüklendi:', leagues);
    return leagues;
  } catch (error) {
    console.error('CSV okuma hatası:', error);
    throw error; // Hatayı fırlat, varsayılan veri döndürme
  }
};

// Turkish leagues objesi - CSV'den yüklenecek
export let turkishLeagues = {};

// Yükleme durumunu takip etmek için promise
let leaguesLoadPromise = null;

// CSV'den verileri yükle ve turkishLeagues'i güncelle
const initializeTurkishLeagues = async () => {
  if (leaguesLoadPromise) {
    return leaguesLoadPromise;
  }
  
  leaguesLoadPromise = (async () => {
    try {
      turkishLeagues = await loadTurkishLeaguesFromCSV();
      console.log('Turkish leagues başarıyla yüklendi');
      return turkishLeagues;
    } catch (error) {
      console.error('Turkish leagues yüklenemedi:', error);
      turkishLeagues = {};
      throw error;
    }
  })();
  
  return leaguesLoadPromise;
};

// Başlangıçta yükle
initializeTurkishLeagues();

// Tüm takımların kadrolarını oluştur
export let allSquads = {};

// Kadroları async olarak yükle
const initializeSquads = async () => {
  try {
    // Turkish leagues yüklenene kadar bekle
    await initializeTurkishLeagues();
    
    allSquads = await generateAllSquads(turkishLeagues);
    console.log('Kadrolar yüklendi:', Object.keys(allSquads).map(league => ({
      league,
      teams: Object.keys(allSquads[league] || {}),
      totalTeams: Object.keys(allSquads[league] || {}).length
    })));
  } catch (error) {
    console.error('Kadrolar yüklenemedi:', error);
  }
};

// Kadroları başlangıçta yükle
initializeSquads();

// Tüm takımların altyapı kadrolarını oluştur
export let allYouthSquads = {};

// Altyapı kadrolarını async olarak yükle
const initializeYouthSquads = async () => {
  try {
    // Turkish leagues yüklenene kadar bekle
    await initializeTurkishLeagues();
    
    allYouthSquads = generateAllYouthSquads(turkishLeagues);
    console.log('Altyapı kadroları yüklendi');
  } catch (error) {
    console.error('Altyapı kadroları yüklenemedi:', error);
  }
};

// Altyapı kadrolarını başlangıçta yükle
initializeYouthSquads();

// Hazırlık maçları oluşturma fonksiyonu
export const generatePreSeasonFixtures = (selectedTeam) => {
  // Rastgele takımlar seç
  const allTeams = [];
  Object.values(turkishLeagues).forEach(league => {
    league.forEach(team => {
      if (team.name !== selectedTeam) {
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
  
  return [
    { homeTeam: selectedTeam, awayTeam: randomTeams[0], matchday: -1, isPreSeason: true, result: null, played: false, week: null },
    { homeTeam: selectedTeam, awayTeam: randomTeams[1], matchday: -2, isPreSeason: true, result: null, played: false, week: null },
    { homeTeam: selectedTeam, awayTeam: randomTeams[2], matchday: -3, isPreSeason: true, result: null, played: false, week: null }
  ];
};

// Gerçekçi fikstür oluşturma fonksiyonu (çift sayılı takım için)
export const generateRealisticFixtures = (teams) => {
  const fixtures = [];
  const teamNames = teams.map(team => team.name);
  const numTeams = teamNames.length;
  
  // Tek sayılı takım varsa "BYE" ekle
  if (numTeams % 2 !== 0) {
    teamNames.push('BYE');
  }
  
  const totalWeeks = numTeams - 1;
  const teamsCopy = [...teamNames];
  
  // Berger Table algoritması ile fikstür oluştur
  for (let round = 0; round < totalWeeks; round++) {
    const roundFixtures = [];
    
    // Her hafta için maçları oluştur
    for (let i = 0; i < Math.floor(numTeams / 2); i++) {
      const homeIndex = i;
      const awayIndex = numTeams - 1 - i;
      
      const homeTeam = teamsCopy[homeIndex];
      const awayTeam = teamsCopy[awayIndex];
      
      // BYE maçlarını atla
      if (homeTeam !== 'BYE' && awayTeam !== 'BYE') {
        roundFixtures.push({
          homeTeam: homeTeam,
          awayTeam: awayTeam,
          week: round + 1,
          result: null,
          played: false
        });
      }
    }
    
    fixtures.push(...roundFixtures);
    
    // Takımları döndür (Berger Table)
    const lastTeam = teamsCopy.pop();
    teamsCopy.splice(1, 0, lastTeam);
  }
  
  // İkinci yarı için roller değişti
  const teamsCopy2 = [...teamNames];
  for (let round = 0; round < totalWeeks; round++) {
    const roundFixtures = [];
    
    for (let i = 0; i < Math.floor(numTeams / 2); i++) {
      const homeIndex = i;
      const awayIndex = numTeams - 1 - i;
      
      // Roller değişti - ikinci yarıda
      const homeTeam = teamsCopy2[awayIndex];
      const awayTeam = teamsCopy2[homeIndex];
      
      // BYE maçlarını atla
      if (homeTeam !== 'BYE' && awayTeam !== 'BYE') {
        roundFixtures.push({
          homeTeam: homeTeam,
          awayTeam: awayTeam,
          week: round + totalWeeks + 1,
          result: null,
          played: false
        });
      }
    }
    
    fixtures.push(...roundFixtures);
    
    // Takımları döndür
    const lastTeam = teamsCopy2.pop();
    teamsCopy2.splice(1, 0, lastTeam);
  }
  
  // Maçları haftaya göre sırala
  const sortedFixtures = fixtures.sort((a, b) => a.week - b.week);
  
  // 3 hafta üst üste aynı yerde oynamama kuralını uygula
  const balancedFixtures = balanceHomeAwayFixtures(sortedFixtures);
  
  return balancedFixtures;
};

// 3 hafta üst üste aynı yerde oynamama kuralını uygulayan fonksiyon
const balanceHomeAwayFixtures = (fixtures) => {
  const teamHomeAwayCount = {};
  const balancedFixtures = [...fixtures];
  
  // Her takım için ev sahibi/deplasman sayısını takip et
  fixtures.forEach(fixture => {
    if (!teamHomeAwayCount[fixture.homeTeam]) {
      teamHomeAwayCount[fixture.homeTeam] = { home: 0, away: 0, lastMatches: [] };
    }
    if (!teamHomeAwayCount[fixture.awayTeam]) {
      teamHomeAwayCount[fixture.awayTeam] = { home: 0, away: 0, lastMatches: [] };
    }
  });
  
  // Her hafta için kontrol et ve gerekirse düzelt
  for (let week = 1; week <= Math.max(...fixtures.map(f => f.week)); week++) {
    const weekFixtures = balancedFixtures.filter(f => f.week === week);
    
    weekFixtures.forEach(fixture => {
      const homeTeam = fixture.homeTeam;
      const awayTeam = fixture.awayTeam;
      
      // Her takımın son 3 maçını kontrol et
      const homeLastMatches = teamHomeAwayCount[homeTeam].lastMatches.slice(-2); // Son 2 maç
      const awayLastMatches = teamHomeAwayCount[awayTeam].lastMatches.slice(-2); // Son 2 maç
      
      // Eğer takım son 2 maçını ev sahibi olarak oynadıysa ve bu da 3. ev sahibi maçı olacaksa
      if (homeLastMatches.filter(match => match === 'home').length >= 2) {
        // Bu maçı değiştir
        const temp = fixture.homeTeam;
        fixture.homeTeam = fixture.awayTeam;
        fixture.awayTeam = temp;
      }
      
      // Eğer takım son 2 maçını deplasman olarak oynadıysa ve bu da 3. deplasman maçı olacaksa
      if (awayLastMatches.filter(match => match === 'away').length >= 2) {
        // Bu maçı değiştir
        const temp = fixture.homeTeam;
        fixture.homeTeam = fixture.awayTeam;
        fixture.awayTeam = temp;
      }
      
      // Maç sonuçlarını güncelle
      teamHomeAwayCount[fixture.homeTeam].home++;
      teamHomeAwayCount[fixture.homeTeam].lastMatches.push('home');
      teamHomeAwayCount[fixture.awayTeam].away++;
      teamHomeAwayCount[fixture.awayTeam].lastMatches.push('away');
      
      // Son 3 maçtan fazlasını tutma
      if (teamHomeAwayCount[fixture.homeTeam].lastMatches.length > 3) {
        teamHomeAwayCount[fixture.homeTeam].lastMatches.shift();
      }
      if (teamHomeAwayCount[fixture.awayTeam].lastMatches.length > 3) {
        teamHomeAwayCount[fixture.awayTeam].lastMatches.shift();
      }
    });
  }
  
  return balancedFixtures;
};

// Seçilen takım için varsayılan kulüp verisi
export const createClubData = async (selectedTeam, leagueName) => {
  const team = turkishLeagues[leagueName].find(t => t.name === selectedTeam);
  const squad = allSquads[leagueName]?.[selectedTeam];
  const youthData = allYouthSquads[leagueName]?.[selectedTeam];
  
  // Kadro değerini turkish_leagues_with_values.csv'den al
  const getTeamValue = (teamName) => {
    // Önce turkishLeagues'den takım değerini bul
    for (const leagueName of Object.keys(turkishLeagues)) {
      const team = turkishLeagues[leagueName].find(t => t.name === teamName);
      if (team) {
        return team.value;
      }
    }
    
    // İsim uyumsuzluklarını kontrol et
    const nameMappings = {
      'Sarıyer Spor': 'Sarıyerspor',
      'Sarıyer': 'Sarıyerspor'
    };
    
    const mappedName = nameMappings[teamName] || teamName;
    
    // Eğer bulunamazsa, CSV'den takım değerini bul
    const teamValueData = {
      'Galatasaray': 300.73, 'Fenerbahçe': 262.25, 'Beşiktaş': 155.05, 'Trabzonspor': 84.85,
      'İstanbul Başakşehir': 61.13, 'Samsunspor': 36.93, 'Çaykur Rizespor': 34.5, 'Antalyaspor': 30.65,
      'Göztepe': 40.85, 'Eyüpspor': 25.15, 'Konyaspor': 24.35, 'Kocaelispor': 23.05, 'Alanyaspor': 24.2,
      'Gaziantep FK': 20.85, 'Kayserispor': 19.85, 'Gençlerbirliği': 14.4, 'Kasımpaşa': 17.08,
      'Adana Demirspor': 25.0, 'Hatayspor': 18.0, 'İstanbulspor': 10.0, 'Bodrum FK': 15.05, 'Amedspor': 11.87,
      'Sivasspor': 11.35, 'Çorum FK': 8.95, 'Manisa FK': 8.58, 'Iğdır FK': 7.88, 'Erzurumspor FK': 7.43,
      'Sakaryaspor': 9.0, 'Ümraniyespor': 7.0, 'Altay': 5.0, 'Adanaspor': 5.5,
      'Ankara Keçiörengücü': 6.0, 'Afyonspor': 2.54, 'Altınordu': 3.02, 'Ankara Demirspor': 2.35,
      'Ankaraspor': 2.57, 'Beyoğlu Yeni Çarşıspor': 2.57, 'Bucaspor 1928': 3.77, 'Bursaspor': 2.87,
      'Diyarbekirspor': 2.99, 'Ergene Velimeşe': 2.37, 'Esenler Erokspor': 3.36, 'Hes İlaç Afyonspor': 3.84,
      'İnegölspor': 3.37, 'Boluspor': 6.5, 'Bandırmaspor': 7.0, 'Tuzlaspor': 4.5, 'Giresunspor': 6.5,
      'Vanspor': 5.5, 'Pendikspor': 8.0, '24 Erzincanspor': 2.91,
      'Adıyaman FK': 2.29, 'Arnavutköy Belediyespor': 3.33, 'Balıkesirspor': 3.66, 'Bayburt Özel İdarespor': 2.64,
      'Denizlispor': 3.9, 'Düzcespor': 2.53, 'Etimesgut Belediyespor': 2.45, 'Fethiyespor': 2.97,
      'Isparta 32 Spor': 2.52, 'Karacabey Belediyespor': 3.51, 'Nazilli Belediyespor': 2.32, 'Serik Belediyespor': 3.75,
      'Somaspor': 2.4, 'Şanlıurfaspor': 3.61, 'Tarsus İdman Yurdu': 2.1, 'Zonguldak Kömürspor': 2.82,
      'Sarıyerspor': 2.13
    };
    
    return teamValueData[mappedName] || 20; // Varsayılan değer
  };
  
  // CSV'den tesis seviyesi hesaplama fonksiyonu
  const getFacilityLevel = async (teamName) => {
    try {
      // turkish_leagues_with_values.csv'den takım değerini al
      const csvText2 = await fetchCSV('turkish_leagues_with_values.csv');
      const lines = csvText2.split('\n').slice(1); // İlk satırı atla (başlık)

      let teamValue = null;
      for (const line of lines) {
        const [takim, , deger] = line.split(','); // 'lig' değişkenini atla
        if (takim === teamName) {
          teamValue = parseFloat(deger);
          break;
        }
      }

      if (!teamValue) {
        console.warn(`Takım değeri bulunamadı: ${teamName}`);
        return Math.floor(Math.random() * 11) + 25; // Varsayılan değer
      }

      // Kadro_Yetenek_Listesi.csv'den interpolasyon yap
      const kadroText = await fetchCSV('Kadro_Yetenek_Listesi__Vmin_2__Vmax_350__Ymin_20__Ymax_92_.csv');
      const kadroLines = kadroText.split('\n').slice(1); // İlk satırı atla
      
      const kadroData = kadroLines.map(line => {
        const [kadroDegeri, yetenek] = line.split(',');
        return {
          kadro: parseFloat(kadroDegeri),
          yetenek: parseFloat(yetenek)
        };
      });
      
      // Yetenek değerini direkt tesis seviyesi olarak kullan (20-92 -> 20-92)
      let baseYetenek = 20; // Initialize with min level
      
      const exactMatch = kadroData.find(item => item.kadro === teamValue);
      if (exactMatch) {
        baseYetenek = exactMatch.yetenek;
      } else {
        // İnterpolasyon yap
        for (let i = 0; i < kadroData.length - 1; i++) {
          const current = kadroData[i];
          const next = kadroData[i + 1];
          
          if (teamValue >= current.kadro && teamValue <= next.kadro) {
            const ratio = (teamValue - current.kadro) / (next.kadro - current.kadro);
            baseYetenek = current.yetenek + ratio * (next.yetenek - current.yetenek);
            break;
          }
        }
      }
      // Yetenek değerini 20-92 arasına sınırla
      const variation = Math.floor(Math.random() * 11) - 5; // Rastgele ±5 varyasyon ekle
      return Math.max(20, Math.min(92, Math.round(baseYetenek + variation)));
      
    } catch (error) {
      console.error('CSV okuma hatası:', error);
      return Math.floor(Math.random() * 11) + 25; // Hata durumunda varsayılan değer
    }
  };
  
      return {
      name: selectedTeam,
      season: '2024/25',
      league: leagueName,
      date: 'Ağu 2024',
      hfSonu: 'Hazırlık 1', // Sezon başlangıcı - hazırlık 1'deyiz
      lig: team ? team.position : Math.floor(Math.random() * 20) + 1,
      money: 50000, // Sabit başlangıç parası
             kadro: getTeamValue(selectedTeam), // Doğru kadro değeri
       menajer: (await generateManager(getTeamValue(selectedTeam), leagueName)).averageSkill,
      antrenman: await getFacilityLevel(selectedTeam),
      altyapi: await getFacilityLevel(selectedTeam),
      kupalar: 0,
      basarildi: 0,
      taraftarMutlu: 50,
      baskanMutlu: 50,
      stadium: 'Stadyum',
      baskan: 'Başkan',
      matchResults: [], // Henüz hiç maç oynanmamış
      nextMatch: `${leagueName}: ${turkishLeagues[leagueName][Math.floor(Math.random() * turkishLeagues[leagueName].length)].name} (D)`,
      squad: squad, // Kadro bilgisi
      youthSquad: youthData ? youthData.squad : [], // Altyapı kadrosu bilgisi
      manager: await generateManager(getTeamValue(selectedTeam), leagueName), // Menajer bilgisi
             gameTime: { week: 1, day: 'Hafta Başı' } // Oyun zamanı - hafta başı ile başlar
    };
};

// Eski veri yapısı (geriye uyumluluk için)
export const club = {
  name: 'BENIDORM',
  season: '2025/26',
  league: 'Tercera C',
  date: 'Ağu 2025',
  hfSonu: 5,
  lig: 5,
  money: 50000,
  kadro: 36,
  menajer: 37,
  antrenman: 37,
  altyapi: 35,
  kupalar: 0,
  basarildi: 1,
  taraftarMutlu: 97,
  baskanMutlu: 52,
  stadium: 'Stadyum',
  baskan: 'Başkan',
  matchResults: ['M', 'G', 'G', 'G', 'B', 'B'],
  nextMatch: 'Tercera C: Guijuelo (D)',
};

// Fikstür verilerini oluştur
export const fixtureData = {};

// Her lig için gerçekçi fikstür oluştur
const initializeFixtures = async () => {
  try {
    // Turkish leagues yüklenene kadar bekle
    await initializeTurkishLeagues();
    
    Object.keys(turkishLeagues).forEach(leagueName => {
      const teams = turkishLeagues[leagueName];
      const fixtures = generateRealisticFixtures(teams);
      
      fixtureData[leagueName] = fixtures;
      
      console.log(`${leagueName} fikstürü: ${fixtures.length} maç, ${Math.max(...fixtures.map(f => f.week))} hafta`);
    });
  } catch (error) {
    console.error('Fikstürler oluşturulamadı:', error);
  }
};

// Fikstürleri başlangıçta oluştur
initializeFixtures();

export const standingsData = [
  { pos: 1, team: 'JAEN', O: 5, G: 4, B: 0, M: 1, A: 12, Y: 6, AV: 6, PN: 12, color: '#b88c2c' },
  { pos: 2, team: 'CONQUENSE', O: 5, G: 4, B: 0, M: 1, A: 10, Y: 5, AV: 5, PN: 12, color: '#2c7b2c' },
  { pos: 3, team: 'LAGUN ONAK', O: 5, G: 4, B: 0, M: 1, A: 7, Y: 3, AV: 4, PN: 12 },
  { pos: 4, team: 'SAGUNTINO', O: 5, G: 2, B: 3, M: 0, A: 4, Y: 2, AV: 2, PN: 9 },
  { pos: 5, team: 'CIUDAD REAL', O: 5, G: 3, B: 0, M: 2, A: 5, Y: 5, AV: 0, PN: 9 },
  { pos: 6, team: 'LLOSETENSE', O: 5, G: 2, B: 2, M: 1, A: 6, Y: 4, AV: 2, PN: 8 },
  { pos: 7, team: 'BENIDORM', O: 5, G: 2, B: 2, M: 1, A: 6, Y: 5, AV: 1, PN: 8, color: '#fff', textColor: '#2c466b' },
  { pos: 8, team: 'OLOT', O: 5, G: 2, B: 2, M: 1, A: 4, Y: 3, AV: 1, PN: 8 },
  { pos: 9, team: 'VILLARROBLED', O: 5, G: 2, B: 1, M: 2, A: 6, Y: 6, AV: 0, PN: 7 },
];

// Menajer ismi oluşturma
const generateManagerName = () => {
  const firstNames = ['Ahmet', 'Mehmet', 'Mustafa', 'Ali', 'Hasan', 'İbrahim', 'Yusuf', 'Murat', 'Kemal', 'Fatih', 'Halil', 'Cem', 'Burak', 'Eren', 'Emre', 'Levent', 'Uğur', 'Okan', 'Koray', 'Sinan'];
  const lastNames = ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aydın', 'Özkan', 'Erdoğan', 'Koç', 'Kurt', 'Aslan', 'Çetin', 'Güneş', 'Yalçın', 'Özkan'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
};

// Menajer oluşturma fonksiyonu (CSV tabanlı)
const generateManager = async (teamValue, leagueName = 'Süper Lig') => {
  return await generateManagerCSV(generateManagerName(), leagueName, teamValue);
};

// Tüm takımların menajerlerini oluştur
export const allManagers = {};

// Menajerleri async olarak yükle
const initializeManagers = async () => {
  try {
    // Turkish leagues yüklenene kadar bekle
    await initializeTurkishLeagues();
    
    for (const leagueName of Object.keys(turkishLeagues)) {
      allManagers[leagueName] = {};
      for (const team of turkishLeagues[leagueName]) {
        allManagers[leagueName][team.name] = await generateManager(team.value, leagueName);
      }
    }
    console.log('Menajerler yüklendi');
  } catch (error) {
    console.error('Menajerler yüklenemedi:', error);
  }
};

// Menajerleri başlangıçta yükle
initializeManagers();

// Haftalık gider hesaplama fonksiyonu
export const calculateWeeklyExpenses = (club) => {
  let totalExpenses = 0;
  
  // Menajer maaşı
  if (club.manager && club.manager.salary) {
    totalExpenses += club.manager.salary;
  }
  
  // Oyuncu maaşları
  if (club.squad) {
    // İlk takım oyuncuları
    if (club.squad.firstTeam) {
      club.squad.firstTeam.forEach(player => {
        if (player.salary) {
          totalExpenses += player.salary;
        }
      });
    }
    
    // Yedek oyuncular
    if (club.squad.substitutes) {
      club.squad.substitutes.forEach(player => {
        if (player.salary) {
          totalExpenses += player.salary;
        }
      });
    }
  }
  
  // Tesis giderleri - haftalık maliyetler (doğru formül)
  const antrenmanWeeklyFee = Math.round(Math.pow((club.antrenman || 37) / 10, 2.5) * 10);
  const altyapiWeeklyFee = Math.round(Math.pow((club.altyapi || 35) / 10, 2.5) * 10);
  const facilityCosts = antrenmanWeeklyFee + altyapiWeeklyFee;
  totalExpenses += facilityCosts;
  
  return totalExpenses;
};

// Hafta geçişi fonksiyonu
export const advanceWeek = (club) => {
  // Hafta döngüsü: Hafta Başı → Hafta İçi → Hafta Sonu → Hafta Başı
  const currentDay = club.gameTime.day;
  let newDay;
  let newWeek = club.gameTime.week;
  let newMoney = club.money;
  
  switch (currentDay) {
    case 'Hafta Başı':
      newDay = 'Hafta İçi';
      break;
    case 'Hafta İçi':
      newDay = 'Hafta Sonu';
      break;
    case 'Hafta Sonu': {
      newDay = 'Hafta Başı';
      newWeek = club.gameTime.week + 1; // Sadece hafta sonundan hafta başına geçerken hafta artar
      // Sadece hafta sonundan hafta başına geçerken bütçe hesabı yap
      const weeklyExpenses = calculateWeeklyExpenses(club);
      newMoney = Math.max(0, club.money - weeklyExpenses);
      break;
    }
    default:
      newDay = 'Hafta Başı';
  }
  
  return {
    ...club,
    money: newMoney,
    gameTime: {
      week: newWeek,
      day: newDay
    }
  };
};
