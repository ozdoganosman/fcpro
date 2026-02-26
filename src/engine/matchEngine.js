// Maç motoru — React bağımlılığı yok, saf fonksiyonlar

// ========== FORMASYON VERİLERİ ==========

export const TACTIC_FORMATIONS = {
  '4-4-2': { 'K': 1, 'D': 4, 'O': 4, 'F': 2 },
  '4-3-3': { 'K': 1, 'D': 4, 'O': 3, 'F': 3 },
  '4-2-3-1': { 'K': 1, 'D': 4, 'O': 5, 'F': 1 },
  '3-5-2': { 'K': 1, 'D': 3, 'O': 5, 'F': 2 },
  '3-4-3': { 'K': 1, 'D': 3, 'O': 4, 'F': 3 },
  '5-3-2': { 'K': 1, 'D': 5, 'O': 3, 'F': 2 },
  '4-5-1': { 'K': 1, 'D': 4, 'O': 5, 'F': 1 },
  '4-1-4-1': { 'K': 1, 'D': 4, 'O': 5, 'F': 1 },
  '4-3-2-1': { 'K': 1, 'D': 4, 'O': 5, 'F': 1 },
  '3-6-1': { 'K': 1, 'D': 3, 'O': 6, 'F': 1 },
  '5-4-1': { 'K': 1, 'D': 5, 'O': 4, 'F': 1 }
};

// ========== AĞIRLIKLI POZİSYON SENARYOLARI ==========

export const POSITION_SCENARIOS = [
  {
    name: "Orta Saha Kontrolü", weight: 20,
    steps: [
      "ortasahada {attackingPlayer} kaptı topu",
      "{attackingPlayer} {defendingPlayer}'ya uzun top attı",
      "top {defendingPlayer}'ya ulaştı, şimdi kaleye doğru sürüyor",
      "{defendingPlayer} {goalkeeper} ile karşı karşıya!"
    ]
  },
  {
    name: "Kontra Atak", weight: 15,
    steps: [
      "{goalkeeper} topu yakaladı",
      "hızlı kontra atağa çıktı",
      "{midfielder} topu aldı",
      "kaleye doğru koşuyor"
    ]
  },
  {
    name: "Kanat Oyunu", weight: 12,
    steps: [
      "{winger} sağ kanattan koşuyor",
      "çapraz pas verdi",
      "{striker} topu aldı",
      "kaleye doğru"
    ]
  },
  {
    name: "Pas Oyunu", weight: 10,
    steps: [
      "{passer1} {passer2}'ya pas verdi",
      "{passer2} {passer3}'ya pas verdi",
      "hızlı pas oyunu",
      "kaleye yaklaşıyorlar"
    ]
  },
  {
    name: "Korner Pozisyonu", weight: 8,
    steps: [
      "{attackingPlayer} sağ kanattan koşuyor",
      "{defendingPlayer} topu çizgi dışına çıkardı",
      "korner vuruşu {cornerTaker} tarafından",
      "top kaleye doğru gidiyor..."
    ]
  },
  {
    name: "Serbest Vuruş", weight: 7,
    steps: [
      "{attackingPlayer} faul yedi",
      "serbest vuruş {freeKickTaker} tarafından",
      "duvar kuruldu",
      "vuruş kaleye doğru..."
    ]
  },
  {
    name: "Dribling", weight: 6,
    steps: [
      "{attackingPlayer} topu aldı",
      "rakibi geçiyor",
      "bir tane daha geçti",
      "kaleye doğru sürüyor"
    ]
  },
  {
    name: "Uzun Pas", weight: 5,
    steps: [
      "{defendingPlayer} uzun pas attı",
      "top {attackingPlayer}'ya ulaştı",
      "{attackingPlayer} topu kontrol etti",
      "hücum bölgesinde"
    ]
  },
  {
    name: "Hızlı Atak", weight: 4,
    steps: [
      "{attackingPlayer} hızlı koşuyor",
      "rakibi geçti",
      "kaleye doğru sürüyor",
      "{goalkeeper} çıktı"
    ]
  },
  {
    name: "Uzun Şut", weight: 3,
    steps: [
      "{attackingPlayer} uzaktan şut çekti",
      "top kaleye doğru gidiyor",
      "{goalkeeper} pozisyon aldı",
      "top üst direğin üstünden"
    ]
  },
  {
    name: "Kafa Vuruşu", weight: 3,
    steps: [
      "{cornerTaker} korner vuruşu",
      "top kaleye doğru gidiyor",
      "{headerPlayer} kafa vuruşu yaptı",
      "top kaleye doğru..."
    ]
  },
  {
    name: "Savunma Müdahalesi", weight: 2,
    steps: [
      "{attackingPlayer} hücum bölgesinde topu aldı",
      "{defendingPlayer} mükemmel bir müdahale yaptı",
      "top {midfielder} kontrolüne geçti",
      "{midfielder} kontra atağa çıktı"
    ]
  },
  {
    name: "Savunma Bloku", weight: 2,
    steps: [
      "{attackingPlayer} şut çekti",
      "{defendingPlayer} blok yaptı",
      "top dışarı çıktı",
      "korner vuruşu"
    ]
  },
  {
    name: "Kısa Pas Oyunu", weight: 1,
    steps: [
      "{passer1} kısa pas verdi",
      "{passer2} topu aldı",
      "yavaş yavaş ilerliyorlar",
      "orta sahada kontrol"
    ]
  },
  {
    name: "Kaleci Kurtarışı", weight: 1,
    steps: [
      "{attackingPlayer} şut çekti",
      "top kaleye doğru gidiyor",
      "{goalkeeper} mükemmel kurtarış yaptı",
      "top güvenli bölgeye"
    ]
  },
  {
    name: "Savunma Hatası", weight: 0.5,
    steps: [
      "{defendingPlayer} topu kontrol etmeye çalıştı",
      "top ayağından kaydı",
      "{attackingPlayer} fırsatı yakaladı",
      "kaleye doğru koşuyor"
    ]
  },
  {
    name: "Ofsayt Pozisyonu", weight: 0.5,
    steps: [
      "{attackingPlayer} hücum bölgesinde",
      "{passer} pas verdi",
      "bayrak kalktı!",
      "ofsayt pozisyonu"
    ]
  },
  {
    name: "Kale Direği", weight: 0.3,
    steps: [
      "{attackingPlayer} şut çekti",
      "top kaleye doğru gidiyor",
      "kale direğinden döndü!",
      "fırsat kaçtı"
    ]
  },
  {
    name: "Penaltı Pozisyonu", weight: 0.15,
    steps: [
      "{attackingPlayer} ceza sahasına girdi",
      "{defendingPlayer} müdahale etti",
      "hakem düdük çaldı!",
      "penaltı kararı"
    ]
  },
  {
    name: "Kaleci Hatası", weight: 0.05,
    steps: [
      "{goalkeeper} topu yakaladı",
      "top elinden kaydı",
      "{attackingPlayer} fırsatı yakaladı",
      "boş kale!"
    ]
  }
];

// ========== TAKTİK SENARYO AĞIRLIKLARI ==========

export const TACTIC_SCENARIO_WEIGHTS = {
  'Dikine Oyun': {
    'Kontra Atak': 1.8, 'Hızlı Atak': 2.0, 'Uzun Pas': 1.5, 'Dribling': 1.3,
    'Pas Oyunu': 0.5, 'Kısa Pas Oyunu': 0.4, 'Orta Saha Kontrolü': 0.7
  },
  'Pas Oyunu': {
    'Pas Oyunu': 2.0, 'Kısa Pas Oyunu': 2.5, 'Orta Saha Kontrolü': 1.5, 'Kanat Oyunu': 1.3,
    'Kontra Atak': 0.5, 'Uzun Pas': 0.4, 'Hızlı Atak': 0.6
  }
};

// ========== DOLGU OLAYLARI (atmosfer) ==========

export const FILLER_EVENTS = [
  { type: 'save', templates: [
    '{goalkeeper} topu güvenle yakaladı',
    '{goalkeeper} yumrukla uzaklaştırdı',
    '{goalkeeper} refleksle kurtardı'
  ]},
  { type: 'offside', templates: [
    '{attackingPlayer} ofsayt pozisyonunda yakalandı',
    'Yan hakem bayrağı kaldırdı, ofsayt'
  ]},
  { type: 'foul', templates: [
    '{defendingPlayer} faul yaptı, serbest vuruş',
    '{attackingPlayer} rakibine faul yaptı'
  ]},
  { type: 'throw_in', templates: [
    'Top taç çizgisinden çıktı, taç atışı {attackingTeam} için',
    '{defendingPlayer} topu taça çıkardı'
  ]}
];

// ========== SENARYO SAHA BÖLGELERİ ==========

export const SCENARIO_ZONES = {
  'Orta Saha Kontrolü': ['midfield-center', 'midfield-center', 'attack-center', 'attack-center'],
  'Kontra Atak': ['defense-center', 'midfield-center', 'attack-center', 'attack-center'],
  'Kanat Oyunu': ['midfield-right', 'attack-right', 'attack-right', 'attack-center'],
  'Pas Oyunu': ['midfield-left', 'midfield-center', 'midfield-right', 'attack-center'],
  'Korner Pozisyonu': ['attack-right', 'attack-right', 'attack-center', 'attack-center'],
  'Serbest Vuruş': ['midfield-center', 'attack-center', 'attack-center', 'attack-center'],
  'Dribling': ['midfield-center', 'midfield-center', 'attack-center', 'attack-center'],
  'Uzun Pas': ['defense-center', 'midfield-center', 'attack-center', 'attack-center'],
  'Hızlı Atak': ['midfield-center', 'attack-center', 'attack-center', 'attack-center'],
  'Uzun Şut': ['midfield-center', 'midfield-center', 'attack-center', 'attack-center'],
  'Kafa Vuruşu': ['attack-left', 'attack-center', 'attack-center', 'attack-center'],
  'Savunma Müdahalesi': ['attack-center', 'defense-center', 'midfield-center', 'midfield-center'],
  'Savunma Bloku': ['attack-center', 'defense-center', 'defense-center', 'defense-center'],
  'Kısa Pas Oyunu': ['midfield-left', 'midfield-center', 'midfield-right', 'midfield-center'],
  'Kaleci Kurtarışı': ['attack-center', 'attack-center', 'defense-center', 'defense-center'],
  'Savunma Hatası': ['defense-center', 'defense-center', 'attack-center', 'attack-center'],
  'Ofsayt Pozisyonu': ['midfield-center', 'attack-center', 'attack-center', 'attack-center'],
  'Kale Direği': ['midfield-center', 'attack-center', 'attack-center', 'attack-center'],
  'Penaltı Pozisyonu': ['attack-center', 'attack-center', 'attack-center', 'attack-center'],
  'Kaleci Hatası': ['defense-center', 'defense-center', 'attack-center', 'attack-center']
};

// ========== YARDIMCI FONKSİYONLAR ==========

/** Form/fitness/morale değerini işaretli olarak döndür */
export const getFormValue = (formEntry) => {
  if (!formEntry || formEntry.type === 'neutral') return 0;
  const value = formEntry.value || 0;
  return formEntry.type === 'negative' ? -value : value;
};

/** Kadro derin kopyası oluştur */
export const deepCopySquad = (squad) => {
  if (!squad) return null;
  return {
    ...squad,
    firstTeam: squad.firstTeam.map(p => ({ ...p, form: p.form ? [...p.form] : [] })),
    substitutes: squad.substitutes.map(p => ({ ...p, form: p.form ? [...p.form] : [] }))
  };
};

/** Menajerin taktiğine göre formasyon belirleme */
export const getFormationFromTactic = (tactic) => {
  // Taktik stringinden formasyon kısmını çıkar (örn: "4-4-2 Dikine Oyun" → "4-4-2")
  const formationPart = tactic ? tactic.split(' ')[0] : '4-4-2';
  return TACTIC_FORMATIONS[formationPart] || TACTIC_FORMATIONS['4-4-2'];
};

/** Ağırlıklı rastgele senaryo seç */
export const selectWeightedScenario = () => {
  const totalWeight = POSITION_SCENARIOS.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  for (const scenario of POSITION_SCENARIOS) {
    random -= scenario.weight;
    if (random <= 0) return scenario;
  }
  return POSITION_SCENARIOS[0];
};

/** Taktik ağırlıklı senaryo seçimi */
export const selectWeightedScenarioWithTactic = (tacticStyle) => {
  const multipliers = TACTIC_SCENARIO_WEIGHTS[tacticStyle] || {};
  const adjustedScenarios = POSITION_SCENARIOS.map(s => ({
    ...s,
    weight: s.weight * (multipliers[s.name] || 1.0)
  }));
  const totalWeight = adjustedScenarios.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  for (const scenario of adjustedScenarios) {
    random -= scenario.weight;
    if (random <= 0) return scenario;
  }
  return adjustedScenarios[0];
};

/** Dakika bazlı olay olasılığı — gerçekçi kümelenme */
export const getMinuteEventProbability = (minute) => {
  if (minute >= 1 && minute <= 5) return 0.20;
  if (minute >= 20 && minute <= 35) return 0.10;
  if (minute >= 40 && minute <= 45) return 0.22;
  if (minute >= 46 && minute <= 50) return 0.18;
  if (minute >= 55 && minute <= 65) return 0.12;
  if (minute >= 85 && minute <= 90) return 0.25;
  return 0.15;
};

/** Momentum hesaplama (-1.0 ile +1.0 arası) */
export const calculateMomentum = (scoreDiff, minutesSinceLastGoal, isHome) => {
  let momentum = 0;
  if (minutesSinceLastGoal !== null && minutesSinceLastGoal < 10) {
    momentum += (10 - minutesSinceLastGoal) * 0.08;
  }
  if (scoreDiff < 0) momentum += Math.min(0.3, Math.abs(scoreDiff) * 0.15);
  if (scoreDiff > 0) momentum -= Math.min(0.2, scoreDiff * 0.1);
  if (isHome) momentum += 0.05;
  return Math.max(-1.0, Math.min(1.0, momentum));
};

/** Gerçekçi gol olasılığı eğrisi */
export const calculateGoalProbability = (attackingStrength, defendingStrength, momentum, minute) => {
  const ratio = attackingStrength / (attackingStrength + defendingStrength);
  let baseProb = 0.05 + ratio * 0.30;
  baseProb += momentum * 0.05;
  if (minute >= 80) baseProb += 0.03;
  if (minute > 60) baseProb += 0.02;
  return Math.max(0.03, Math.min(0.35, baseProb));
};

/** Dolgu olayı üret (save, offside, foul, throw_in) */
export const generateFillerEvent = (minute, team, squad, teamName, opponentSquad) => {
  const eventDef = FILLER_EVENTS[Math.floor(Math.random() * FILLER_EVENTS.length)];
  const templates = eventDef.templates;
  let description = templates[Math.floor(Math.random() * templates.length)];

  const attackingPlayer = squad.firstTeam[Math.floor(Math.random() * squad.firstTeam.length)];
  const defendingPlayer = opponentSquad.firstTeam[Math.floor(Math.random() * opponentSquad.firstTeam.length)];
  const goalkeeper = opponentSquad.firstTeam.find(p => p.position === 'K') || opponentSquad.firstTeam[0];

  description = description.replace('{attackingPlayer}', attackingPlayer?.name || 'Oyuncu');
  description = description.replace('{defendingPlayer}', defendingPlayer?.name || 'Oyuncu');
  description = description.replace('{goalkeeper}', goalkeeper?.name || 'Kaleci');
  description = description.replace('{attackingTeam}', teamName);

  return { minute, type: eventDef.type, team, description };
};

/** Dakika başına enerji kaybı hesapla */
export const calculateMinuteEnergyLoss = (player) => {
  const fitness = player.form[1];
  let baseEnergyLossPerMinute = 0.15;

  if (fitness && fitness.type === 'positive') {
    baseEnergyLossPerMinute = Math.max(0.05, baseEnergyLossPerMinute - (fitness.value * 0.03));
  } else if (fitness && fitness.type === 'negative') {
    baseEnergyLossPerMinute = baseEnergyLossPerMinute + (fitness.value * 0.05);
  }

  if (player.position === 'F') baseEnergyLossPerMinute += 0.05;
  if (player.position === 'O') baseEnergyLossPerMinute += 0.03;

  return baseEnergyLossPerMinute;
};

// ========== ANA MOTOR FONKSİYONLARI ==========

/** Dinamik İLK 11 seçim fonksiyonu */
export const selectBestFirstTeam = (squad, manager) => {
  if (!squad) return { firstTeam: [], substitutes: [] };

  const allPlayers = [...squad.firstTeam, ...squad.substitutes];
  const positionCounts = getFormationFromTactic(manager?.tactic || '4-4-2');

  const selectedFirstTeam = [];
  const remainingPlayers = [];

  Object.entries(positionCounts).forEach(([position, count]) => {
    const positionPlayers = allPlayers
      .filter(player => player.position === position)
      .sort((a, b) => {
        const energyDiff = (b.energy || 100) - (a.energy || 100);
        if (Math.abs(energyDiff) > 10) return energyDiff;
        return b.rating - a.rating;
      });

    const selected = positionPlayers.slice(0, count);
    selectedFirstTeam.push(...selected);
    remainingPlayers.push(...positionPlayers.slice(count));
  });

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

/** Takım reyting ortalamasını hesapla */
export const calculateTeamRating = (squad, suspendedPlayers, injuredPlayers) => {
  if (!squad) return 0;

  const availablePlayers = squad.firstTeam.filter(player =>
    !suspendedPlayers.some(s => s.name === player.name) &&
    !injuredPlayers.some(i => i.name === player.name)
  );

  if (availablePlayers.length === 0) return 0;
  const averageRating = availablePlayers.reduce((sum, player) => sum + player.rating, 0) / availablePlayers.length;
  return Math.round(averageRating * 10) / 10;
};

/** Takım gücünü hesapla — form işareti, menajer etkisi, ev avantajı dahil */
export const calculateTeamStrength = (squad, manager, suspendedPlayers, injuredPlayers, isHome) => {
  if (!squad) return 50;

  const availablePlayers = squad.firstTeam.filter(player =>
    !suspendedPlayers.some(s => s.name === player.name) &&
    !injuredPlayers.some(i => i.name === player.name)
  );

  if (availablePlayers.length === 0) return 30;

  const firstTeamStrength = availablePlayers.reduce((sum, player) => {
    const form = getFormValue(player.form[0]);
    const fitness = getFormValue(player.form[1]);
    const morale = getFormValue(player.form[2]);
    const energy = player.energy || 100;
    const playerStrength = player.rating + form + fitness + morale + (energy - 100) * 0.1;
    return sum + playerStrength;
  }, 0) / availablePlayers.length;

  const missingPlayers = 11 - availablePlayers.length;
  const missingPenalty = missingPlayers * 5;

  // Gerçekçi menajer etkisi
  const managerBonus = manager
    ? (manager.management * 0.1 + manager.attacking * 0.05 + manager.tactical * 0.05)
    : 5;

  let strength = Math.max(20, firstTeamStrength + managerBonus - missingPenalty);

  // Ev sahibi avantajı (%7)
  if (isHome) {
    strength *= 1.07;
  }

  return Math.round(strength);
};

/** Enerjileri bir dakika için güncelle */
export const updateEnergiesForMinute = (matchState) => {
  const updateSquad = (squad) => {
    if (!squad) return;
    squad.firstTeam.forEach(player => {
      if (player.energy !== undefined) {
        const energyLoss = calculateMinuteEnergyLoss(player);
        player.energy = Math.max(0, player.energy - energyLoss);
      }
    });
  };
  updateSquad(matchState.homeSquad);
  updateSquad(matchState.awaySquad);
};

/** Pozisyon bazlı oyuncu değişikliği */
export const makeSubstitution = (matchState, team, currentMinute) => {
  const squad = team === 'home' ? matchState.homeSquad : matchState.awaySquad;
  if (!squad) return null;

  const currentSubs = team === 'home' ? matchState.homeSubstitutions : matchState.awaySubstitutions;
  if (currentSubs >= 3) return null;

  const firstTeam = squad.firstTeam.filter(p => p.energy > 0);
  if (firstTeam.length === 0) return null;

  const lowestEnergyPlayer = firstTeam.reduce((lowest, player) =>
    player.energy < lowest.energy ? player : lowest, firstTeam[0]);

  const substitutes = squad.substitutes.filter(p => p.energy > 0);
  if (substitutes.length === 0) return null;

  // Pozisyon bazlı: aynı pozisyondan yedek varsa öncelik ver
  const samePositionSubs = substitutes.filter(p => p.position === lowestEnergyPlayer.position);
  const candidateSubs = samePositionSubs.length > 0 ? samePositionSubs : substitutes;
  const bestSubstitute = candidateSubs.reduce((best, player) =>
    player.energy > best.energy ? player : best, candidateSubs[0]);

  const playerIndex = squad.firstTeam.findIndex(p => p.name === lowestEnergyPlayer.name);
  const subIndex = squad.substitutes.findIndex(p => p.name === bestSubstitute.name);

  if (playerIndex !== -1 && subIndex !== -1) {
    const temp = squad.firstTeam[playerIndex];
    squad.firstTeam[playerIndex] = squad.substitutes[subIndex];
    squad.substitutes[subIndex] = temp;

    if (team === 'home') {
      matchState.homeSubstitutions++;
      matchState.homeSubstitutedPlayers.push(bestSubstitute.name);
    } else {
      matchState.awaySubstitutions++;
      matchState.awaySubstitutedPlayers.push(bestSubstitute.name);
    }

    return {
      outPlayer: lowestEnergyPlayer,
      inPlayer: bestSubstitute,
      description: `${currentMinute}' 🔄 ${lowestEnergyPlayer.name} çıktı, ${bestSubstitute.name} girdi`
    };
  }

  return null;
};

/** Mutable match state objesi oluştur */
export const createMatchState = (homeSquad, awaySquad) => ({
  homeScore: 0,
  awayScore: 0,
  homeSquad,
  awaySquad,
  homeSubstitutions: 0,
  awaySubstitutions: 0,
  homeSuspended: [],
  awaySuspended: [],
  homeInjured: [],
  awayInjured: [],
  homeYellowCards: {},
  awayYellowCards: {},
  homeSubstitutedPlayers: [],
  awaySubstitutedPlayers: [],
  events: [],
  currentZone: 'midfield-center',
  lastGoalMinute: null,
  lastGoalTeam: null,
  stats: {
    homeShots: 0, awayShots: 0,
    homeShotsOnTarget: 0, awayShotsOnTarget: 0,
    homeCorners: 0, awayCorners: 0,
    homeFouls: 0, awayFouls: 0,
    homePossession: 0, awayPossession: 0,
    homeSaves: 0, awaySaves: 0,
    homeOffsides: 0, awayOffsides: 0
  }
});

/**
 * Tek bir olayı işle, matchState'i mutate et.
 * advanceTime ve fastForward tarafından paylaşılır.
 * @returns {Object[]} Ek dinamik olaylar (değişiklikler, 2. sarı→kırmızı vb.)
 */
export const processEvent = (event, matchState, homeTeamName, awayTeamName) => {
  const additionalEvents = [];
  const isHome = event.team === 'home';

  // Gol
  if (event.type === 'goal') {
    if (isHome) matchState.homeScore++;
    else matchState.awayScore++;
    if (isHome) matchState.stats.homeShotsOnTarget++;
    else matchState.stats.awayShotsOnTarget++;
    if (isHome) matchState.stats.homeShots++;
    else matchState.stats.awayShots++;
    matchState.lastGoalMinute = event.minute;
    matchState.lastGoalTeam = event.team;
  }

  // Pozisyon (topla oynama takibi)
  if (event.type === 'position') {
    if (isHome) matchState.stats.homePossession++;
    else matchState.stats.awayPossession++;
  }

  // Korner
  if (event.type === 'corner') {
    if (isHome) matchState.stats.homeCorners++;
    else matchState.stats.awayCorners++;
  }

  // Pozisyon kayboldu (savunma temizleme = diğer takım şut denemesi sayılabilir)
  if (event.type === 'position_lost') {
    // Pozisyonu kaybeden takımın rakibi şut çekti sayılır
    const attackTeam = isHome ? 'away' : 'home';
    if (attackTeam === 'home') matchState.stats.homeShots++;
    else matchState.stats.awayShots++;
  }

  // Kurtarış
  if (event.type === 'save') {
    if (isHome) { matchState.stats.awayShotsOnTarget++; matchState.stats.homeSaves++; }
    else { matchState.stats.homeShotsOnTarget++; matchState.stats.awaySaves++; }
  }

  // Ofsayt
  if (event.type === 'offside') {
    if (isHome) matchState.stats.homeOffsides++;
    else matchState.stats.awayOffsides++;
  }

  // Faul (kartsız)
  if (event.type === 'foul') {
    if (isHome) matchState.stats.homeFouls++;
    else matchState.stats.awayFouls++;
  }

  // Top bölgesi güncelle
  if (event.zone) {
    matchState.currentZone = event.zone;
  }

  // Sarı kart
  if (event.type === 'yellow') {
    const playerName = event.player?.name || event.player;
    const yellowCards = isHome ? matchState.homeYellowCards : matchState.awayYellowCards;
    const currentCards = yellowCards[playerName] || 0;
    const newCards = currentCards + 1;

    if (isHome) matchState.stats.homeFouls++;
    else matchState.stats.awayFouls++;

    if (newCards >= 2) {
      // 2. sarı kart → kırmızı
      (isHome ? matchState.homeSuspended : matchState.awaySuspended).push(event.player);
      yellowCards[playerName] = 0;

      const squad = isHome ? matchState.homeSquad : matchState.awaySquad;
      if (squad) {
        const idx = squad.firstTeam.findIndex(p => p.name === playerName);
        if (idx !== -1) squad.firstTeam.splice(idx, 1);
      }

      additionalEvents.push({
        minute: event.minute,
        type: 'red',
        team: event.team,
        description: `🟥 ${playerName} ikinci sarı kart nedeniyle kırmızı kart gördü!`
      });

      // Otomatik değişiklik
      const localSubs = isHome ? matchState.homeSubstitutions : matchState.awaySubstitutions;
      if (localSubs < 3) {
        const substitution = makeSubstitution(matchState, event.team, event.minute);
        if (substitution) {
          additionalEvents.push({ minute: event.minute, type: 'substitution', team: event.team, description: substitution.description });
        }
      } else {
        additionalEvents.push({ minute: event.minute, type: 'card', team: event.team, description: `${event.minute}' ⚠️ ${isHome ? homeTeamName : awayTeamName} kırmızı kart nedeniyle eksik oyuncuyla devam ediyor` });
      }
    } else {
      yellowCards[playerName] = newCards;
    }
  }

  // Kırmızı kart
  if (event.type === 'red') {
    (isHome ? matchState.homeSuspended : matchState.awaySuspended).push(event.player);

    if (isHome) matchState.stats.homeFouls++;
    else matchState.stats.awayFouls++;

    const squad = isHome ? matchState.homeSquad : matchState.awaySquad;
    if (squad) {
      const idx = squad.firstTeam.findIndex(p => p.name === (event.player?.name || event.player));
      if (idx !== -1) squad.firstTeam.splice(idx, 1);
    }

    const localSubs = isHome ? matchState.homeSubstitutions : matchState.awaySubstitutions;
    if (localSubs < 3) {
      const substitution = makeSubstitution(matchState, event.team, event.minute);
      if (substitution) {
        additionalEvents.push({ minute: event.minute, type: 'substitution', team: event.team, description: substitution.description });
      }
    } else {
      additionalEvents.push({ minute: event.minute, type: 'card', team: event.team, description: `${event.minute}' ⚠️ ${isHome ? homeTeamName : awayTeamName} kırmızı kart nedeniyle eksik oyuncuyla devam ediyor` });
    }
  }

  // Sakatlık
  if (event.type === 'injury') {
    const injuredList = isHome ? matchState.homeInjured : matchState.awayInjured;
    const alreadyInjured = injuredList.some(inj => inj.name === event.player?.name);

    if (!alreadyInjured) {
      injuredList.push(event.player);

      const squad = isHome ? matchState.homeSquad : matchState.awaySquad;
      if (squad) {
        const idx = squad.firstTeam.findIndex(p => p.name === event.player.name);
        if (idx !== -1) squad.firstTeam.splice(idx, 1);
      }

      const localSubs = isHome ? matchState.homeSubstitutions : matchState.awaySubstitutions;
      if (localSubs < 3) {
        const substitution = makeSubstitution(matchState, event.team, event.minute);
        if (substitution) {
          additionalEvents.push({ minute: event.minute, type: 'substitution', team: event.team, description: substitution.description });
        }
      } else {
        additionalEvents.push({ minute: event.minute, type: 'injury', team: event.team, description: `${event.minute}' ⚠️ ${isHome ? homeTeamName : awayTeamName} değişiklik hakkı dolduğu için eksik oyuncuyla devam ediyor` });
      }
    }
  }

  // Enerjileri güncelle
  updateEnergiesForMinute(matchState);

  // Düşük enerjili oyuncu değişikliği
  ['home', 'away'].forEach(side => {
    const squad = side === 'home' ? matchState.homeSquad : matchState.awaySquad;
    const subs = side === 'home' ? matchState.homeSubstitutions : matchState.awaySubstitutions;
    if (squad && subs < 3) {
      const lowEnergy = squad.firstTeam.find(p => p.energy < 20 && p.energy > 0);
      if (lowEnergy) {
        const substitution = makeSubstitution(matchState, side, event.minute);
        if (substitution) {
          additionalEvents.push({ minute: event.minute, type: 'substitution', team: side, description: substitution.description });
        }
      }
    }
  });

  return additionalEvents;
};

/**
 * Maçı önceden hesapla — tüm 90 dakikalık olayları üret.
 * @returns {{ events: Object[], homeScore: number, awayScore: number }}
 */
export const simulateMatch = (homeSquad, awaySquad, homeManager, awayManager, homeTeamName, awayTeamName) => {
  const events = [];
  let simHomeScore = 0;
  let simAwayScore = 0;
  let lastGoalMinute = null;
  let lastGoalTeam = null;

  // Taktik stili çıkar
  const getStyle = (mgr) => mgr?.tactic?.includes('Dikine') ? 'Dikine Oyun' : 'Pas Oyunu';

  for (let minute = 1; minute <= 90; minute++) {
    // Yarı zaman
    if (minute === 45) {
      events.push({ minute: 45, type: 'half', description: '⏸️ İlk Yarı Sonu', zone: 'midfield-center' });
      continue;
    }

    // Dakika bazlı olay olasılığı
    const eventProb = getMinuteEventProbability(minute);

    if (Math.random() < eventProb) {
      const homeStrength = calculateTeamStrength(homeSquad, homeManager, [], [], true);
      const awayStrength = calculateTeamStrength(awaySquad, awayManager, [], [], false);

      const totalStrength = homeStrength + awayStrength;
      const homeChance = homeStrength / totalStrength;

      // Momentum etkisi
      const homeMomentum = calculateMomentum(
        simHomeScore - simAwayScore,
        lastGoalTeam === 'home' && lastGoalMinute ? minute - lastGoalMinute : null,
        true
      );
      const adjustedHomeChance = Math.max(0.2, Math.min(0.8, homeChance + homeMomentum * 0.1));
      const attackingTeam = Math.random() < adjustedHomeChance ? 'home' : 'away';
      const defendingTeam = attackingTeam === 'home' ? 'away' : 'home';

      // Taktik ağırlıklı senaryo seç
      const attackingManager = attackingTeam === 'home' ? homeManager : awayManager;
      const scenario = selectWeightedScenarioWithTactic(getStyle(attackingManager));

      const attackingSquad = attackingTeam === 'home' ? homeSquad : awaySquad;
      const defendingSquad = defendingTeam === 'home' ? homeSquad : awaySquad;

      if (attackingSquad && defendingSquad) {
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const byPos = (squad, pos) => squad.firstTeam.filter(p => p.position === pos);

        const players = {
          attackingPlayer: pick(attackingSquad.firstTeam),
          defendingPlayer: pick(defendingSquad.firstTeam),
          midfielder: pick(byPos(attackingSquad, 'O')) || attackingSquad.firstTeam[0],
          goalkeeper: byPos(defendingSquad, 'K')[0] || defendingSquad.firstTeam[0],
          cornerTaker: pick(attackingSquad.firstTeam),
          freeKickTaker: pick(attackingSquad.firstTeam),
          passer: pick(attackingSquad.firstTeam),
          headerPlayer: pick(byPos(attackingSquad, 'F')) || attackingSquad.firstTeam[0],
          winger: pick(byPos(attackingSquad, 'O')) || attackingSquad.firstTeam[0],
          striker: pick(byPos(attackingSquad, 'F')) || attackingSquad.firstTeam[0],
          passer1: pick(attackingSquad.firstTeam),
          passer2: pick(attackingSquad.firstTeam),
          passer3: pick(attackingSquad.firstTeam)
        };

        // Saha bölgesi haritası
        const zones = SCENARIO_ZONES[scenario.name] || ['midfield-center', 'midfield-center', 'attack-center', 'attack-center'];

        // Pozisyon adımlarını oluştur
        for (let step = 0; step < scenario.steps.length; step++) {
          let description = scenario.steps[step];
          Object.keys(players).forEach(key => {
            const player = players[key];
            if (player && player.name) {
              description = description.replace(`{${key}}`, player.name);
            }
          });
          description = description.replace('{attackingTeam}', attackingTeam === 'home' ? homeTeamName : awayTeamName);
          description = description.replace('{defendingTeam}', defendingTeam === 'home' ? homeTeamName : awayTeamName);

          events.push({
            minute, type: 'position', team: attackingTeam,
            description, step: step + 1, totalSteps: scenario.steps.length,
            zone: zones[step] || 'midfield-center',
            scenarioName: scenario.name
          });
        }

        // Pozisyon sonucu — momentum bazlı gol olasılığı
        const attackingStrength = calculateTeamStrength(
          attackingSquad, attackingManager, [], [], attackingTeam === 'home'
        );
        const defendingStrength = calculateTeamStrength(
          defendingSquad, defendingTeam === 'home' ? homeManager : awayManager, [], [], defendingTeam === 'home'
        );

        const attackMomentum = calculateMomentum(
          attackingTeam === 'home' ? simHomeScore - simAwayScore : simAwayScore - simHomeScore,
          lastGoalTeam === attackingTeam && lastGoalMinute ? minute - lastGoalMinute : null,
          attackingTeam === 'home'
        );
        const goalProb = calculateGoalProbability(attackingStrength, defendingStrength, attackMomentum, minute);
        const cornerProb = goalProb + 0.20;
        const random = Math.random();

        if (random < goalProb) {
          const scorer = pick(attackingSquad.firstTeam);
          events.push({
            minute, type: 'goal', team: attackingTeam,
            description: `⚽ GOL! ${attackingTeam === 'home' ? homeTeamName : awayTeamName}li ${scorer ? scorer.name : 'Oyuncu'} gol attı!`,
            player: scorer ? scorer.name : 'Oyuncu',
            zone: 'attack-center'
          });
          if (attackingTeam === 'home') simHomeScore++;
          else simAwayScore++;
          lastGoalMinute = minute;
          lastGoalTeam = attackingTeam;
        } else if (random < cornerProb) {
          events.push({
            minute, type: 'corner', team: attackingTeam,
            description: `Korner vuruşu ${attackingTeam === 'home' ? homeTeamName : awayTeamName} için`,
            zone: 'attack-right'
          });
        } else {
          events.push({
            minute, type: 'position_lost', team: defendingTeam,
            description: `Pozisyon ${defendingTeam === 'home' ? homeTeamName : awayTeamName} tarafından temizlendi`,
            zone: 'defense-center'
          });
        }
      }
    }
    // Dolgu olayları (atmosfer: save, offside, foul, throw_in)
    else if (Math.random() < 0.08) {
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const squad = team === 'home' ? homeSquad : awaySquad;
      const opponentSquad = team === 'home' ? awaySquad : homeSquad;
      const teamName = team === 'home' ? homeTeamName : awayTeamName;
      if (squad && opponentSquad && squad.firstTeam.length > 0 && opponentSquad.firstTeam.length > 0) {
        const fillerEvent = generateFillerEvent(minute, team, squad, teamName, opponentSquad);
        fillerEvent.zone = 'midfield-center';
        events.push(fillerEvent);
      }
    }

    // Diğer olaylar (kart, sakatlık)
    const cardRandom = Math.random();

    // İkinci yarı yorgunluk bölgesi: sakatlık ihtimali artar
    const injuryThreshold = (minute >= 60 && minute <= 80) ? 0.055 : 0.035;

    if (cardRandom < 0.015) {
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const teamName = team === 'home' ? homeTeamName : awayTeamName;
      const squad = team === 'home' ? homeSquad : awaySquad;
      const player = squad ? squad.firstTeam[Math.floor(Math.random() * squad.firstTeam.length)] : null;

      events.push({
        minute, type: 'yellow', team,
        description: `🟨 ${teamName}li ${player ? player.name : 'Oyuncu'} sert müdahalesi nedeniyle sarı kart gördü!`,
        player
      });
    } else if (cardRandom < 0.016) {
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const teamName = team === 'home' ? homeTeamName : awayTeamName;
      const squad = team === 'home' ? homeSquad : awaySquad;
      const player = squad ? squad.firstTeam[Math.floor(Math.random() * squad.firstTeam.length)] : null;

      events.push({
        minute, type: 'red', team,
        description: `🟥 ${teamName}li ${player ? player.name : 'Oyuncu'} çok sert müdahalesi nedeniyle kırmızı kart gördü!`,
        player
      });
    } else if (cardRandom < injuryThreshold) {
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const squad = team === 'home' ? homeSquad : awaySquad;

      if (squad && squad.firstTeam.length > 0) {
        const availablePlayers = squad.firstTeam.filter(player => {
          const alreadyInjured = events.some(event =>
            event.type === 'injury' && event.player && event.player.name === player.name
          );
          return !alreadyInjured;
        });

        if (availablePlayers.length > 0) {
          const player = availablePlayers.reduce((lowest, p) =>
            p.energy < lowest.energy ? p : lowest, availablePlayers[0]);

          const injuryChance = 0.5 / (player.energy / 100);

          if (Math.random() < injuryChance / 100) {
            const teamName = team === 'home' ? homeTeamName : awayTeamName;
            const injuries = ['ayak bileği burkulması', 'kas yırtığı', 'menisküs yırtığı', 'çapraz bağ kopması', 'kırık ayak'];
            const injury = injuries[Math.floor(Math.random() * injuries.length)];

            events.push({
              minute, type: 'injury', team,
              description: `🏥 ${teamName}li ${player.name} ${injury} nedeniyle sakatlandı! (Enerji: %${Math.round(player.energy)})`,
              player, injuryType: injury
            });
          }
        }
      }
    }
  }

  return { events, homeScore: simHomeScore, awayScore: simAwayScore };
};
