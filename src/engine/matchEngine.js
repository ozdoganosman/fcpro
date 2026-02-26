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
  stats: {
    homeShots: 0, awayShots: 0,
    homeShotsOnTarget: 0, awayShotsOnTarget: 0,
    homeCorners: 0, awayCorners: 0,
    homeFouls: 0, awayFouls: 0,
    homePossession: 0, awayPossession: 0
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

  for (let minute = 1; minute <= 90; minute++) {
    // Yarı zaman
    if (minute === 45) {
      events.push({ minute: 45, type: 'half', description: '⏸️ İlk Yarı Sonu' });
      continue;
    }

    // Pozisyon başlatma olasılığı (%15)
    if (Math.random() < 0.15) {
      const homeStrength = calculateTeamStrength(homeSquad, homeManager, [], [], true);
      const awayStrength = calculateTeamStrength(awaySquad, awayManager, [], [], false);

      const totalStrength = homeStrength + awayStrength;
      const homeChance = homeStrength / totalStrength;
      const attackingTeam = Math.random() < homeChance ? 'home' : 'away';
      const defendingTeam = attackingTeam === 'home' ? 'away' : 'home';

      // Ağırlıklı senaryo seç
      const scenario = selectWeightedScenario();

      const attackingSquad = attackingTeam === 'home' ? homeSquad : awaySquad;
      const defendingSquad = defendingTeam === 'home' ? homeSquad : awaySquad;

      if (attackingSquad && defendingSquad) {
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
            description, step: step + 1, totalSteps: scenario.steps.length
          });
        }

        // Pozisyon sonucu
        const attackingStrength = calculateTeamStrength(
          attackingTeam === 'home' ? homeSquad : awaySquad,
          attackingTeam === 'home' ? homeManager : awayManager,
          [], [], attackingTeam === 'home'
        );
        const defendingStrength = calculateTeamStrength(
          defendingTeam === 'home' ? homeSquad : awaySquad,
          defendingTeam === 'home' ? homeManager : awayManager,
          [], [], defendingTeam === 'home'
        );

        const successChance = attackingStrength / (attackingStrength + defendingStrength);
        const random = Math.random();

        if (random < successChance * 0.3) {
          const scorer = attackingSquad.firstTeam[Math.floor(Math.random() * attackingSquad.firstTeam.length)];
          events.push({
            minute, type: 'goal', team: attackingTeam,
            description: `⚽ GOL! ${attackingTeam === 'home' ? homeTeamName : awayTeamName}li ${scorer ? scorer.name : 'Oyuncu'} gol attı!`,
            player: scorer ? scorer.name : 'Oyuncu'
          });
          if (attackingTeam === 'home') simHomeScore++;
          else simAwayScore++;
        } else if (random < successChance * 0.6) {
          events.push({
            minute, type: 'corner', team: attackingTeam,
            description: `Korner vuruşu ${attackingTeam === 'home' ? homeTeamName : awayTeamName} için`
          });
        } else {
          events.push({
            minute, type: 'position_lost', team: defendingTeam,
            description: `Pozisyon ${defendingTeam === 'home' ? homeTeamName : awayTeamName} tarafından temizlendi`
          });
        }
      }
    }

    // Diğer olaylar (kart, sakatlık)
    const random = Math.random();

    if (random < 0.015) {
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const teamName = team === 'home' ? homeTeamName : awayTeamName;
      const squad = team === 'home' ? homeSquad : awaySquad;
      const player = squad ? squad.firstTeam[Math.floor(Math.random() * squad.firstTeam.length)] : null;

      events.push({
        minute, type: 'yellow', team,
        description: `🟨 ${teamName}li ${player ? player.name : 'Oyuncu'} sert müdahalesi nedeniyle sarı kart gördü!`,
        player
      });
    } else if (random < 0.016) {
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const teamName = team === 'home' ? homeTeamName : awayTeamName;
      const squad = team === 'home' ? homeSquad : awaySquad;
      const player = squad ? squad.firstTeam[Math.floor(Math.random() * squad.firstTeam.length)] : null;

      events.push({
        minute, type: 'red', team,
        description: `🟥 ${teamName}li ${player ? player.name : 'Oyuncu'} çok sert müdahalesi nedeniyle kırmızı kart gördü!`,
        player
      });
    } else if (random < 0.035) {
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
