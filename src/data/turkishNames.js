// Türk erkek isimleri
export const turkishFirstNames = [
  'Ahmet', 'Mehmet', 'Ali', 'Mustafa', 'Hasan', 'Hüseyin', 'İbrahim', 'Murat', 'Ömer', 'Yusuf',
  'Emre', 'Can', 'Burak', 'Deniz', 'Ege', 'Kaan', 'Mert', 'Ozan', 'Serkan', 'Tolga',
  'Uğur', 'Volkan', 'Yasin', 'Zeki', 'Arda', 'Berk', 'Cem', 'Derya', 'Eren', 'Furkan',
  'Gökhan', 'Hakan', 'İlker', 'Kemal', 'Levent', 'Mert', 'Necati', 'Onur', 'Polat', 'Rıza',
  'Sarp', 'Tamer', 'Umut', 'Vedat', 'Yavuz', 'Zafer', 'Alp', 'Barış', 'Cenk', 'Doğan',
  'Erkan', 'Fatih', 'Güven', 'Halil', 'İlhan', 'Koray', 'Mazhar', 'Nevzat', 'Orhan', 'Poyraz',
  'Ragıp', 'Savaş', 'Taylan', 'Ufuk', 'Veli', 'Yılmaz', 'Alper', 'Batuhan', 'Cihan', 'Doruk',
  'Erdem', 'Ferhat', 'Gürkan', 'Hamza', 'İrfan', 'Kutay', 'Mazlum', 'Niyazi', 'Oktay', 'Pamir',
  'Rasim', 'Selim', 'Taha', 'Ulaş', 'Vedat', 'Yücel', 'Altan', 'Berkay', 'Cemal', 'Dursun',
  'Ergin', 'Ferit', 'Güray', 'Hüsnü', 'İsmet', 'Kuzey', 'Mazhar', 'Nuri', 'Oğuz', 'Poyraz',
  'Rıdvan', 'Sercan', 'Tamer', 'Umut', 'Vedat', 'Yüksel', 'Alperen', 'Berke', 'Cemil', 'Dündar',
  'Erkan', 'Ferhat', 'Gürsel', 'Hüseyin', 'İlker', 'Kuzey', 'Mazhar', 'Necati', 'Oğuzhan', 'Poyraz',
  'Rıza', 'Serdar', 'Tamer', 'Uğur', 'Vedat', 'Yücel', 'Alp', 'Berkan', 'Cem', 'Dursun',
  'Erdem', 'Ferit', 'Gürkan', 'Hamza', 'İrfan', 'Kutay', 'Mazlum', 'Niyazi', 'Oktay', 'Pamir'
];

// Türk soyisimleri
export const turkishLastNames = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Özdemir', 'Arslan', 'Doğan',
  'Kılıç', 'Aydın', 'Özkan', 'Erdoğan', 'Koç', 'Aslan', 'Çetin', 'Kurt', 'Özkan', 'Şen',
  'Güneş', 'Yalçın', 'Polat', 'Taş', 'Korkmaz', 'Özer', 'Aktaş', 'Keskin', 'Türk', 'Güler',
  'Yavuz', 'Sarı', 'Kara', 'Öz', 'Aksoy', 'Korkmaz', 'Erkan', 'Yaman', 'Güzel', 'Tekin',
  'Bilgin', 'Çalışkan', 'Duman', 'Erol', 'Fidan', 'Gök', 'Hacı', 'Işık', 'Kaya', 'Lale',
  'Mert', 'Nal', 'Ozan', 'Peker', 'Rüzgar', 'Soylu', 'Turan', 'Uçar', 'Vural', 'Yalın',
  'Zengin', 'Akgül', 'Bakır', 'Ceylan', 'Dere', 'Esen', 'Fırat', 'Güven', 'Hakan', 'Irmak',
  'Kalkan', 'Lale', 'Mert', 'Nal', 'Ozan', 'Peker', 'Rüzgar', 'Soylu', 'Turan', 'Uçar',
  'Vural', 'Yalın', 'Zengin', 'Akgül', 'Bakır', 'Ceylan', 'Dere', 'Esen', 'Fırat', 'Güven',
  'Hakan', 'Irmak', 'Kalkan', 'Lale', 'Mert', 'Nal', 'Ozan', 'Peker', 'Rüzgar', 'Soylu',
  'Turan', 'Uçar', 'Vural', 'Yalın', 'Zengin', 'Akgül', 'Bakır', 'Ceylan', 'Dere', 'Esen',
  'Fırat', 'Güven', 'Hakan', 'Irmak', 'Kalkan', 'Lale', 'Mert', 'Nal', 'Ozan', 'Peker',
  'Rüzgar', 'Soylu', 'Turan', 'Uçar', 'Vural', 'Yalın', 'Zengin', 'Akgül', 'Bakır', 'Ceylan'
];

// Pozisyonlar
export const positions = ['K', 'D', 'O', 'F']; // Kaleci, Defans, Orta Saha, Forvet

// Rastgele isim oluşturma fonksiyonu
export const generateRandomName = () => {
  const firstName = turkishFirstNames[Math.floor(Math.random() * turkishFirstNames.length)];
  const lastName = turkishLastNames[Math.floor(Math.random() * turkishLastNames.length)];
  return `${firstName} ${lastName}`;
};

// Rastgele pozisyon oluşturma fonksiyonu
export const generateRandomPosition = () => {
  return positions[Math.floor(Math.random() * positions.length)];
};

// Yaş oluşturma fonksiyonu (18-35 arası)
export const generateRandomAge = () => {
  return Math.floor(Math.random() * 18) + 18; // 18-35 arası
};

// Sözleşme bitiş yılı oluşturma fonksiyonu
export const generateContractEnd = () => {
  const currentYear = 2024;
  return currentYear + Math.floor(Math.random() * 5) + 1; // 2025-2029 arası
};

// Form/Fitness/Morale oluşturma fonksiyonu
export const generateFormFitnessMorale = () => {
  const values = [];
  for (let i = 0; i < 3; i++) {
    const random = Math.random();
    if (random < 0.3) {
      values.push({ value: Math.floor(Math.random() * 3) + 1, type: 'positive' }); // +1, +2, +3
    } else if (random < 0.6) {
      values.push({ value: Math.floor(Math.random() * 3) + 1, type: 'negative' }); // -1, -2, -3
    } else {
      values.push({ value: 0, type: 'neutral' }); // Boş
    }
  }
  return values;
};

// Oyuncu maaşı hesaplama fonksiyonu
export const calculatePlayerSalary = (rating, age, position, leagueName) => {
  // Lig bazında maaş çarpanları
  const leagueMultipliers = {
    'Süper Lig': 1.0,
    '1. Lig': 0.4,
    '2. Lig Beyaz': 0.15,
    '2. Lig Kırmızı': 0.15
  };
  
  const leagueMultiplier = leagueMultipliers[leagueName] || 0.15;
  
  // Pozisyon bazında maaş çarpanları
  const positionMultipliers = {
    'K': 0.8,  // Kaleci
    'D': 0.9,  // Defans
    'O': 1.0,  // Orta Saha
    'F': 1.2   // Forvet (en yüksek)
  };
  
  const positionMultiplier = positionMultipliers[position] || 1.0;
  
  // Reyting bazında maaş (50-85 arası reyting için)
  let baseSalary = 0;
  if (rating >= 80) {
    baseSalary = 50000; // 80+ reyting: 50,000€
  } else if (rating >= 75) {
    baseSalary = 35000; // 75-79 reyting: 35,000€
  } else if (rating >= 70) {
    baseSalary = 25000; // 70-74 reyting: 25,000€
  } else if (rating >= 65) {
    baseSalary = 18000; // 65-69 reyting: 18,000€
  } else if (rating >= 60) {
    baseSalary = 12000; // 60-64 reyting: 12,000€
  } else if (rating >= 55) {
    baseSalary = 8000;  // 55-59 reyting: 8,000€
  } else if (rating >= 50) {
    baseSalary = 5000;  // 50-54 reyting: 5,000€
  } else if (rating >= 45) {
    baseSalary = 3000;  // 45-49 reyting: 3,000€
  } else if (rating >= 40) {
    baseSalary = 2000;  // 40-44 reyting: 2,000€
  } else if (rating >= 35) {
    baseSalary = 1500;  // 35-39 reyting: 1,500€
  } else if (rating >= 30) {
    baseSalary = 1000;  // 30-34 reyting: 1,000€
  } else {
    baseSalary = 500;   // 30 altı reyting: 500€
  }
  
  // Yaş bazında maaş ayarlaması
  let ageMultiplier = 1.0;
  if (age >= 30) {
    ageMultiplier = 0.8; // 30+ yaş: %20 azalma
  } else if (age >= 28) {
    ageMultiplier = 0.9; // 28-29 yaş: %10 azalma
  } else if (age >= 25) {
    ageMultiplier = 1.0; // 25-27 yaş: normal
  } else if (age >= 22) {
    ageMultiplier = 1.1; // 22-24 yaş: %10 artış
  } else {
    ageMultiplier = 1.2; // 18-21 yaş: %20 artış (genç yetenek)
  }
  
  // Toplam maaş hesaplama
  const totalSalary = Math.round(baseSalary * positionMultiplier * ageMultiplier * leagueMultiplier);
  
  return totalSalary;
};
