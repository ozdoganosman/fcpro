import React from 'react';
import PropTypes from 'prop-types';
import { SCENARIO_MOVEMENTS, DEFAULT_MOVEMENT } from '../../engine/matchEngine';

// ========== SAHA SABİTLERİ ==========

// Zone → mutlak top pozisyonu (ev sahibi perspektifi)
const ZONE_BALL = {
  'defense-left':    { x: 18, y: 14 },
  'defense-center':  { x: 18, y: 32.5 },
  'defense-right':   { x: 18, y: 51 },
  'midfield-left':   { x: 50, y: 14 },
  'midfield-center': { x: 50, y: 32.5 },
  'midfield-right':  { x: 50, y: 51 },
  'attack-left':     { x: 82, y: 14 },
  'attack-center':   { x: 82, y: 32.5 },
  'attack-right':    { x: 82, y: 51 },
};

// Formasyon temel çizgileri (X koordinatı)
const X_LINES = {
  home: { K: 6, D: 22, O: 42, F: 62 },
  away: { K: 94, D: 78, O: 58, F: 38 }
};

// ========== POZİSYON HESAPLAMA ==========

/** Top pozisyonunu zone ve hücum eden takıma göre hesapla */
const getBallPosition = (zone, attackingTeam) => {
  const pos = ZONE_BALL[zone] || ZONE_BALL['midfield-center'];
  if (attackingTeam === 'away') {
    return { x: 100 - pos.x, y: 65 - pos.y };
  }
  return { ...pos };
};

/** Oyuncu listesinden formasyon pozisyonları üret */
const getPlayerPositions = (players, isHome) => {
  const lines = isHome ? X_LINES.home : X_LINES.away;
  const groups = { K: [], D: [], O: [], F: [] };

  players.forEach(p => {
    const pos = ['K', 'D', 'O', 'F'].includes(p.position) ? p.position : 'O';
    groups[pos].push(p);
  });

  const result = [];
  ['K', 'D', 'O', 'F'].forEach(pos => {
    const group = groups[pos];
    if (!group || group.length === 0) return;
    group.forEach((player, i) => {
      const y = group.length === 1
        ? 32.5
        : 5 + ((i + 0.5) / group.length) * 55;
      result.push({ x: lines[pos], y, pos, player });
    });
  });

  return result;
};

/** Senaryo hareket haritasından offset uygula */
const applyScenarioOffsets = (positions, scenarioName, step, isHome, isAttacking) => {
  if (!scenarioName || !step) return positions;

  const movement = SCENARIO_MOVEMENTS[scenarioName] || DEFAULT_MOVEMENT;
  const stepData = movement[step];
  if (!stepData) return positions;

  const side = isAttacking ? 'atk' : 'def';
  const offsets = stepData[side];
  if (!offsets) return positions;

  return positions.map(p => {
    const off = offsets[p.pos];
    if (!off) return p;

    // Ev sahibi: offset pozitif → sağa (rakip kaleye doğru)
    // Deplasman: offset pozitif → sola (rakip kaleye doğru) → ters çevir
    const xOff = isHome ? off.x : -off.x;
    const yOff = isHome ? off.y : -off.y;

    return {
      ...p,
      x: p.x + xOff,
      y: p.y + yOff
    };
  });
};

/** Zone bazlı formasyon kayması — senaryo yokken takımları topa doğru kaydır */
const applyZoneShift = (positions, ballPos, isHome, isAttacking) => {
  // Topun sahada nerede olduğuna göre takımı kaydır
  const centerX = isHome ? 50 : 50;
  const ballOffsetX = (ballPos.x - centerX) / 100; // -0.5 ile +0.5 arası
  const ballOffsetY = (ballPos.y - 32.5) / 65;

  // Hücum eden takım topa doğru ileri itilir, savunma geriye çekilir
  const pushFactor = isAttacking ? 1.0 : -0.6;

  return positions.map(p => {
    // Pozisyon grubuna göre farklı duyarlılık
    const sensitivity = { K: 0.5, D: 4, O: 8, F: 10 }[p.pos] || 5;

    const xShift = ballOffsetX * sensitivity * pushFactor;
    const yShift = ballOffsetY * sensitivity * 0.4;

    return {
      ...p,
      x: p.x + xShift,
      y: p.y + yShift
    };
  });
};

/** Aktif oyuncuları (ballCarrier, primary, secondary) topa doğru çek */
const applyActivePlayerOffsets = (positions, activePlayers, ballPos) => {
  if (!activePlayers) return positions;

  return positions.map(p => {
    const name = p.player?.name;
    if (!name) return p;

    let pullStrength = 0;
    if (name === activePlayers.ballCarrier) pullStrength = 0.6;
    else if (name === activePlayers.primary) pullStrength = 0.3;
    else if (name === activePlayers.secondary) pullStrength = 0.2;

    if (pullStrength === 0) return p;

    return {
      ...p,
      x: p.x + (ballPos.x - p.x) * pullStrength,
      y: p.y + (ballPos.y - p.y) * pullStrength
    };
  });
};

/** Pozisyonları saha sınırlarına kısıtla */
const clampPositions = (positions) => {
  return positions.map(p => ({
    ...p,
    x: Math.max(2, Math.min(98, p.x)),
    y: Math.max(3, Math.min(62, p.y))
  }));
};

/** Gol anında hücum eden takımın forvetlerini kutlama pozisyonuna taşı */
const applyGoalCelebration = (positions, isAttacking, isHome) => {
  if (!isAttacking) return positions;
  const celebX = isHome ? 85 : 15;
  const celebY = 32.5;

  return positions.map(p => {
    if (p.pos === 'F') {
      return {
        ...p,
        x: celebX + (Math.random() - 0.5) * 6,
        y: celebY + (Math.random() - 0.5) * 8
      };
    }
    if (p.pos === 'O') {
      return {
        ...p,
        x: p.x + (celebX - p.x) * 0.3,
        y: p.y + (celebY - p.y) * 0.2
      };
    }
    return p;
  });
};

// ========== SVG SAHA BİLEŞENİ ==========

const PitchMarkings = () => (
  <g>
    {/* Çim zemin */}
    <rect width="100" height="65" fill="#2d8a2d"/>
    {[0,2,4,6].map(i => (
      <rect key={i} x={i * 14.3} y="0" width="14.3" height="65" fill="rgba(255,255,255,0.025)"/>
    ))}

    {/* Saha çizgileri */}
    <rect x="3" y="3" width="94" height="59" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.25"/>
    <line x1="50" y1="3" x2="50" y2="62" stroke="rgba(255,255,255,0.5)" strokeWidth="0.25"/>
    <circle cx="50" cy="32.5" r="9" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.25"/>
    <circle cx="50" cy="32.5" r="0.4" fill="rgba(255,255,255,0.5)"/>

    {/* Sol ceza sahası + kale */}
    <rect x="3" y="13.5" width="16" height="38" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.25"/>
    <rect x="3" y="21" width="6" height="23" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.25"/>
    <rect x="0.5" y="27" width="2.5" height="11" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.25"/>
    <circle cx="14" cy="32.5" r="0.3" fill="rgba(255,255,255,0.4)"/>

    {/* Sağ ceza sahası + kale */}
    <rect x="81" y="13.5" width="16" height="38" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.25"/>
    <rect x="91" y="21" width="6" height="23" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.25"/>
    <rect x="97" y="27" width="2.5" height="11" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.25"/>
    <circle cx="86" cy="32.5" r="0.3" fill="rgba(255,255,255,0.4)"/>

    {/* Takım etiketleri */}
    <text x="4" y="63.5" fill="rgba(255,255,255,0.35)" fontSize="2.2" fontFamily="Arial, sans-serif" fontWeight="bold">EV</text>
    <text x="96" y="63.5" fill="rgba(255,255,255,0.35)" fontSize="2.2" textAnchor="end" fontFamily="Arial, sans-serif" fontWeight="bold">DEP</text>
  </g>
);

// ========== OYUNCU NOKTA BİLEŞENİ ==========

/* eslint-disable react/prop-types */
const PlayerDot = ({ pos, isHome, activePlayers }) => {
  const name = pos.player?.name;
  const isBallCarrier = name && activePlayers?.ballCarrier === name;
  const isPrimary = name && activePlayers?.primary === name;

  const baseColor = isHome ? '#2563eb' : '#dc2626';
  const strokeColor = isBallCarrier ? '#FFD700' : (isPrimary ? '#ffffff' : 'rgba(255,255,255,0.6)');
  const strokeW = isBallCarrier ? 0.5 : 0.3;
  const radius = isBallCarrier ? 2.0 : 1.6;

  return (
    <g
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.7s ease-out'
      }}
    >
      {isBallCarrier && (
        <circle cx="0" cy="0" r="3" fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth="0.3"/>
      )}
      <circle cx="0" cy="0" r={radius} fill={baseColor} stroke={strokeColor} strokeWidth={strokeW}/>
      <text
        x="0" y="3.2" textAnchor="middle"
        fill="rgba(255,255,255,0.85)" fontSize="1.5"
        fontWeight="bold" fontFamily="Arial, sans-serif"
        style={{ pointerEvents: 'none' }}
      >
        {name?.split(' ').pop()?.substring(0, 7) || ''}
      </text>
    </g>
  );
};

// ========== ANA BİLEŞEN ==========

const Match2DPitch = ({
  currentZone, currentAttackingTeam, homeSquad, awaySquad,
  scenarioName, step, activePlayers, eventType
}) => {
  const homePlayers = homeSquad?.firstTeam || [];
  const awayPlayers = awaySquad?.firstTeam || [];

  const isHomeAttacking = currentAttackingTeam === 'home';
  const ball = getBallPosition(currentZone, currentAttackingTeam);

  // Pipeline: base → senaryo offset → aktif oyuncu çekimi → sınır
  let homePositions = getPlayerPositions(homePlayers, true);
  let awayPositions = getPlayerPositions(awayPlayers, false);

  // Senaryo offset'leri veya zone kayması uygula
  if (scenarioName && step) {
    homePositions = applyScenarioOffsets(homePositions, scenarioName, step, true, isHomeAttacking);
    awayPositions = applyScenarioOffsets(awayPositions, scenarioName, step, false, !isHomeAttacking);
  } else {
    // Senaryo yokken zone'a göre takımları kaydır
    homePositions = applyZoneShift(homePositions, ball, true, isHomeAttacking);
    awayPositions = applyZoneShift(awayPositions, ball, false, !isHomeAttacking);
  }

  // Gol kutlama pozisyonu
  if (eventType === 'goal') {
    homePositions = applyGoalCelebration(homePositions, isHomeAttacking, true);
    awayPositions = applyGoalCelebration(awayPositions, !isHomeAttacking, false);
  }

  // Aktif oyuncuları topa doğru çek
  homePositions = applyActivePlayerOffsets(homePositions, activePlayers, ball);
  awayPositions = applyActivePlayerOffsets(awayPositions, activePlayers, ball);

  // Sınırla
  homePositions = clampPositions(homePositions);
  awayPositions = clampPositions(awayPositions);

  // Top pozisyonu: ballCarrier varsa oyuncuya yakınlaştır
  let finalBall = { ...ball };
  if (activePlayers?.ballCarrier) {
    const allPositions = [...homePositions, ...awayPositions];
    const carrier = allPositions.find(p => p.player?.name === activePlayers.ballCarrier);
    if (carrier) {
      finalBall = {
        x: carrier.x * 0.7 + ball.x * 0.3,
        y: carrier.y * 0.7 + ball.y * 0.3
      };
    }
  }

  return (
    <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', background: '#1a472a' }}>
      <svg viewBox="0 0 100 65" style={{ width: '100%', display: 'block' }}>
        <defs>
          <radialGradient id="ballGlow">
            <stop offset="0%" stopColor="#FFD700"/>
            <stop offset="100%" stopColor="#FFA000"/>
          </radialGradient>
        </defs>

        <PitchMarkings />

        {/* Ev sahibi oyuncular (mavi) */}
        {homePositions.map((pos) => (
          <PlayerDot key={`h-${pos.player.name}`} pos={pos} isHome={true} activePlayers={activePlayers} />
        ))}

        {/* Deplasman oyuncular (kırmızı) */}
        {awayPositions.map((pos) => (
          <PlayerDot key={`a-${pos.player.name}`} pos={pos} isHome={false} activePlayers={activePlayers} />
        ))}

        {/* Top */}
        <circle
          cx="0" cy="0" r="1.1"
          fill="url(#ballGlow)" stroke="white" strokeWidth="0.25"
          style={{
            transform: `translate(${finalBall.x}px, ${finalBall.y}px)`,
            transition: 'transform 0.6s ease-out'
          }}
        />
      </svg>
    </div>
  );
};

Match2DPitch.propTypes = {
  currentZone: PropTypes.string,
  currentAttackingTeam: PropTypes.string,
  homeSquad: PropTypes.object,
  awaySquad: PropTypes.object,
  scenarioName: PropTypes.string,
  step: PropTypes.number,
  activePlayers: PropTypes.object,
  eventType: PropTypes.string
};

export default Match2DPitch;
