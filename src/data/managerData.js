import { fetchCSV } from './csvCache';

// CSV verilerini yükleme fonksiyonu
const loadCSVData = async () => {
  try {
    const skillText = await fetchCSV('Kadro_Yetenek_Listesi__Vmin_2__Vmax_350__Ymin_20__Ymax_92_.csv');
    const skillLines = skillText.split('\n').slice(1); // Header'ı atla

    const salaryText = await fetchCSV('Manager_Salary_Table__20_100__step_1_.csv');
    const salaryLines = salaryText.split('\n').slice(1); // Header'ı atla
    
    const skillData = {};
    const salaryData = {};
    
    skillLines.forEach(line => {
      if (line.trim()) {
        const [value, skill] = line.split(',');
        skillData[parseFloat(value)] = parseFloat(skill);
      }
    });
    
    salaryLines.forEach(line => {
      if (line.trim()) {
        const [skill, salary] = line.split(',');
        salaryData[parseFloat(skill)] = parseFloat(salary);
      }
    });
    
    return { skillData, salaryData };
  } catch (error) {
    console.error('CSV verileri yüklenirken hata:', error);
    return { skillData: {}, salaryData: {} };
  }
};

// Takım değerine göre önerilen menajer yeteneği
const getRecommendedManagerSkill = (teamValue, skillData) => {
  const values = Object.keys(skillData).map(Number).sort((a, b) => a - b);
  
  if (teamValue <= values[0]) return skillData[values[0]];
  if (teamValue >= values[values.length - 1]) return skillData[values[values.length - 1]];
  
  for (let i = 0; i < values.length - 1; i++) {
    if (teamValue >= values[i] && teamValue < values[i + 1]) {
      const lowerValue = values[i];
      const upperValue = values[i + 1];
      const lowerSkill = skillData[lowerValue];
      const upperSkill = skillData[upperValue];
      
      // Linear interpolation
      const ratio = (teamValue - lowerValue) / (upperValue - lowerValue);
      return lowerSkill + (upperSkill - lowerSkill) * ratio;
    }
  }
  
  return skillData[values[0]];
};

// Menajer yeteneğine göre maaş
const getManagerSalary = (skill, salaryData) => {
  const skills = Object.keys(salaryData).map(Number).sort((a, b) => a - b);
  
  if (skill <= skills[0]) return salaryData[skills[0]];
  if (skill >= skills[skills.length - 1]) return salaryData[skills[skills.length - 1]];
  
  for (let i = 0; i < skills.length - 1; i++) {
    if (skill >= skills[i] && skill < skills[i + 1]) {
      const lowerSkill = skills[i];
      const upperSkill = skills[i + 1];
      const lowerSalary = salaryData[lowerSkill];
      const upperSalary = salaryData[upperSkill];
      
      // Linear interpolation
      const ratio = (skill - lowerSkill) / (upperSkill - lowerSkill);
      return lowerSalary + (upperSalary - lowerSalary) * ratio;
    }
  }
  
  return salaryData[skills[0]];
};

// Türk menajer isimleri
export const turkishManagerNames = [
  'Ahmet Yılmaz', 'Mehmet Kaya', 'Ali Demir', 'Mustafa Çelik', 'Hasan Şahin',
  'Hüseyin Yıldız', 'İbrahim Yıldırım', 'Murat Özdemir', 'Ömer Arslan', 'Yusuf Doğan',
  'Emre Kılıç', 'Can Aydın', 'Burak Özkan', 'Deniz Erdoğan', 'Ege Koç',
  'Kaan Aslan', 'Mert Çetin', 'Ozan Kurt', 'Serkan Özkan', 'Tolga Şen',
  'Uğur Güneş', 'Volkan Yalçın', 'Yasin Polat', 'Zeki Taş', 'Arda Korkmaz',
  'Berk Özer', 'Cem Aktaş', 'Derya Keskin', 'Eren Türk', 'Furkan Güler'
];

// Menajer taktikleri
export const managerTactics = [
  '4-4-2 Dikine Oyun',
  '4-4-2 Pas Oyunu', 
  '3-4-3 Dikine Oyun',
  '3-4-3 Pas Oyunu',
  '4-3-3 Dikine Oyun',
  '4-3-3 Pas Oyunu',
  '3-5-2 Dikine Oyun',
  '3-5-2 Pas Oyunu',
  '4-2-3-1 Dikine Oyun',
  '4-2-3-1 Pas Oyunu',
  '5-3-2 Dikine Oyun',
  '5-3-2 Pas Oyunu'
];

// Menajer oluşturma fonksiyonu (CSV tabanlı)
export const generateManager = async (name, leagueName, teamValue = 50) => {
  const { skillData, salaryData } = await loadCSVData();
  
  // Takım değerine göre önerilen menajer ortalaması
  const recommendedSkill = getRecommendedManagerSkill(teamValue, skillData);
  
  // M-A-T seviyelerini oluştur (ortalaması recommendedSkill olacak)
  const variation = Math.floor(Math.random() * 10) - 5; // ±5 varyasyon
  const management = Math.max(20, Math.min(99, Math.round(recommendedSkill + variation)));
  const attacking = Math.max(20, Math.min(99, Math.round(recommendedSkill + Math.floor(Math.random() * 10) - 5)));
  const tactical = Math.max(20, Math.min(99, Math.round(recommendedSkill + Math.floor(Math.random() * 10) - 5)));
  
  // Ortalama yetenek
  const averageSkill = Math.round((management + attacking + tactical) / 3);
  
  // Maaş hesapla
  const salary = Math.round(getManagerSalary(averageSkill, salaryData));
  
  // Futbol anlayışını belirle
  const philosophies = ['Hücum Futbolu', 'Dengeli', 'Savunma Futbolu'];
  const philosophy = philosophies[Math.floor(Math.random() * philosophies.length)];
  
  // Anlayışa göre taktik seç
  let formation;
  switch (philosophy) {
    case 'Hücum Futbolu':
      formation = ['4-4-2', '3-4-3', '4-3-3'][Math.floor(Math.random() * 3)];
      break;
    case 'Dengeli':
      formation = ['4-5-1', '3-5-2'][Math.floor(Math.random() * 2)];
      break;
    case 'Savunma Futbolu':
      formation = ['5-4-1', '5-3-2'][Math.floor(Math.random() * 2)];
      break;
  }
  
  // Taktik seçimi
  const tactic = `${formation} ${Math.random() > 0.5 ? 'Dikine Oyun' : 'Pas Oyunu'}`;
  
  // Taraftar desteği
  const fanSupport = Math.random() > 0.3 ? 'TAMAM' : 'Kararsız';
  
  return {
    name: name,
    management: management,
    attacking: attacking,
    tactical: tactical,
    averageSkill: averageSkill,
    salary: salary,
    tactic: tactic,
    fanSupport: fanSupport,
    league: leagueName,
    philosophy: philosophy,
    formation: formation
  };
};

// 5 rastgele menajer oluşturma
export const generateManagerCandidates = async (leagueName, teamValue = 50) => {
  const candidates = [];
  const availableNames = [...turkishManagerNames];
  
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    const managerName = availableNames[randomIndex];
    availableNames.splice(randomIndex, 1); // İsmi listeden çıkar
    
    const manager = await generateManager(managerName, leagueName, teamValue);
    candidates.push(manager);
  }
  
  return candidates;
};
