import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { allSquads, allManagers } from '../data';
import {
  deepCopySquad,
  selectBestFirstTeam,
  simulateMatch,
  createMatchState,
  processEvent
} from '../engine/matchEngine';
import MatchScoreboard from './match/MatchScoreboard';
import MatchControls from './match/MatchControls';
import Match2DPitch from './match/Match2DPitch';
import MatchEventLog from './match/MatchEventLog';
import TeamSquadPanel from './match/TeamSquadPanel';
import MatchStatsPanel from './match/MatchStatsPanel';

const MatchPlayModal = ({ setShowMatchPlay, club, matchData, onMatchEnd, playerEnergies, setPlayerEnergies }) => {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [matchEvents, setMatchEvents] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFastForward, setIsFastForward] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);
  const [preCalculatedMatch, setPreCalculatedMatch] = useState(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showGoalOverlay, setShowGoalOverlay] = useState(null);
  // Re-render trigger for mutable matchState
  const [, setRenderTick] = useState(0);

  const homeTeam = club.name;
  const awayTeam = matchData.awayTeam;

  // Mutable engine state (React state yerine — performans için)
  const matchStateRef = useRef(null);
  const overlayTimerRef = useRef(null);

  // Manager referansları
  const homeManagerRef = useRef(null);
  const awayManagerRef = useRef(null);

  // Cleanup overlay timer on unmount
  useEffect(() => {
    return () => {
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    };
  }, []);

  // Global allSquads'dan takım kadrosunu bul
  const findSquad = useCallback((teamName) => {
    let squad = null;
    Object.keys(allSquads).forEach(league => {
      if (allSquads[league][teamName]) {
        squad = allSquads[league][teamName];
      }
    });
    return squad;
  }, []);

  // Manager bul
  const findManager = useCallback((teamName) => {
    let manager = null;
    Object.keys(allManagers).forEach(league => {
      if (allManagers[league][teamName]) {
        manager = allManagers[league][teamName];
      }
    });
    return manager;
  }, []);

  // Maç öncesi enerji ve kadro hazırlığı
  const prepareSquad = useCallback((teamName, manager) => {
    const originalSquad = findSquad(teamName);
    const squad = deepCopySquad(originalSquad);
    if (!squad) return null;

    const teamKey = `${club.league}_${teamName}`;

    if (playerEnergies[teamKey]) {
      const savedEnergies = playerEnergies[teamKey];
      [...squad.firstTeam, ...squad.substitutes].forEach(player => {
        const saved = savedEnergies.find(s => s.name === player.name);
        if (saved) player.energy = saved.energy;
      });
    } else {
      [...squad.firstTeam, ...squad.substitutes].forEach(p => { p.energy = 100; });
      setPlayerEnergies(prev => ({
        ...prev,
        [teamKey]: [...squad.firstTeam, ...squad.substitutes].map(p => ({ ...p }))
      }));
    }

    const { firstTeam, substitutes } = selectBestFirstTeam(squad, manager);
    squad.firstTeam = firstTeam;
    squad.substitutes = substitutes;

    return squad;
  }, [findSquad, club.league, playerEnergies, setPlayerEnergies]);

  // Başlatma
  useEffect(() => {
    if (preCalculatedMatch) return;

    const homeMgr = findManager(homeTeam);
    const awayMgr = findManager(awayTeam);
    homeManagerRef.current = homeMgr;
    awayManagerRef.current = awayMgr;

    const homeSquad = prepareSquad(homeTeam, homeMgr);
    const awaySquad = prepareSquad(awayTeam, awayMgr);

    if (!homeSquad || !awaySquad) return;

    const result = simulateMatch(homeSquad, awaySquad, homeMgr, awayMgr, homeTeam, awayTeam);
    setPreCalculatedMatch(result);

    matchStateRef.current = createMatchState(homeSquad, awaySquad);
  }, []); // eslint-disable-line

  // advanceTime — tek olay işle
  const advanceTime = useCallback(() => {
    if (!preCalculatedMatch || !matchStateRef.current) return;

    if (currentEventIndex < preCalculatedMatch.events.length) {
      const event = preCalculatedMatch.events[currentEventIndex];

      setCurrentMinute(event.minute);

      const additionalEvents = processEvent(event, matchStateRef.current, homeTeam, awayTeam);

      setMatchEvents(prev => [...prev, event, ...additionalEvents]);
      setCurrentEventIndex(prev => prev + 1);
      setRenderTick(prev => prev + 1);

      // Gol kutlama overlay
      if (event.type === 'goal') {
        setShowGoalOverlay({ team: event.team, player: event.player, minute: event.minute });
        if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
        overlayTimerRef.current = setTimeout(() => setShowGoalOverlay(null), Math.max(800, 2500 / playbackSpeed));
      }
    } else {
      setIsPlaying(false);
      setMatchEnded(true);
    }
  }, [preCalculatedMatch, currentEventIndex, homeTeam, awayTeam, playbackSpeed]);

  // fastForwardToEnd — tüm kalan olayları tek seferde işle
  const fastForwardToEnd = useCallback(() => {
    if (!preCalculatedMatch || !matchStateRef.current) return;

    setIsFastForward(true);

    const allNewEvents = [];
    for (let i = currentEventIndex; i < preCalculatedMatch.events.length; i++) {
      const event = preCalculatedMatch.events[i];
      const additional = processEvent(event, matchStateRef.current, homeTeam, awayTeam);
      allNewEvents.push(event, ...additional);
    }

    setMatchEvents(prev => [...prev, ...allNewEvents]);
    setCurrentEventIndex(preCalculatedMatch.events.length);
    setCurrentMinute(90);
    setRenderTick(prev => prev + 1);

    setIsFastForward(false);
    setIsPlaying(false);
    setMatchEnded(true);
  }, [preCalculatedMatch, currentEventIndex, homeTeam, awayTeam]);

  // Oynatma interval'i — hıza göre ayarlanır
  useEffect(() => {
    if (isPlaying && !isFastForward && preCalculatedMatch) {
      const intervalMs = Math.max(100, 800 / playbackSpeed);
      const interval = setInterval(() => {
        advanceTime();
      }, intervalMs);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isFastForward, preCalculatedMatch, advanceTime, playbackSpeed]);

  // "Devam Et" butonu — enerjileri kaydet ve maçı bitir
  const handleContinue = useCallback(() => {
    const ms = matchStateRef.current;
    if (!ms) return;

    const homeTeamKey = `${club.league}_${homeTeam}`;
    const awayTeamKey = `${club.league}_${awayTeam}`;

    if (ms.homeSquad) {
      setPlayerEnergies(prev => ({
        ...prev,
        [homeTeamKey]: [...ms.homeSquad.firstTeam, ...ms.homeSquad.substitutes]
      }));
    }
    if (ms.awaySquad) {
      setPlayerEnergies(prev => ({
        ...prev,
        [awayTeamKey]: [...ms.awaySquad.firstTeam, ...ms.awaySquad.substitutes]
      }));
    }

    const homeSquadGlobal = findSquad(homeTeam);
    const awaySquadGlobal = findSquad(awayTeam);
    if (homeSquadGlobal && ms.homeSquad) {
      homeSquadGlobal.firstTeam = ms.homeSquad.firstTeam.map(p => ({ ...p }));
      homeSquadGlobal.substitutes = ms.homeSquad.substitutes.map(p => ({ ...p }));
    }
    if (awaySquadGlobal && ms.awaySquad) {
      awaySquadGlobal.firstTeam = ms.awaySquad.firstTeam.map(p => ({ ...p }));
      awaySquadGlobal.substitutes = ms.awaySquad.substitutes.map(p => ({ ...p }));
    }

    onMatchEnd({
      homeScore: ms.homeScore,
      awayScore: ms.awayScore,
      events: matchEvents
    });
    setShowMatchPlay(false);
  }, [club.league, homeTeam, awayTeam, findSquad, matchEvents, onMatchEnd, setPlayerEnergies, setShowMatchPlay]);

  const ms = matchStateRef.current;

  return (
    <div className="fc-modal-backdrop">
      <div className="fc-modal" style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'hidden', position: 'relative' }}>
        <MatchScoreboard
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeScore={ms?.homeScore || 0}
          awayScore={ms?.awayScore || 0}
          currentMinute={currentMinute}
          matchType={matchData.type}
          league={club.league}
          allEvents={matchEvents}
          showGoalOverlay={!!showGoalOverlay}
        />

        <div className="fc-panel" style={{ padding: '15px 20px', overflowY: 'auto', maxHeight: 'calc(90vh - 100px)' }}>
          <MatchControls
            isPlaying={isPlaying}
            matchEnded={matchEnded}
            playbackSpeed={playbackSpeed}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onFastForward={fastForwardToEnd}
            onContinue={handleContinue}
            onSpeedChange={setPlaybackSpeed}
          />

          <div style={{ marginBottom: '10px' }}>
            {ms && (
              <>
                {/* 2D Saha */}
                <Match2DPitch
                  currentZone={ms.currentZone}
                  currentAttackingTeam={ms.currentAttackingTeam}
                  homeSquad={ms.homeSquad}
                  awaySquad={ms.awaySquad}
                  scenarioName={ms.currentScenarioName}
                  step={ms.currentStep}
                  activePlayers={ms.activePlayers}
                  eventType={matchEvents.length > 0 ? matchEvents[matchEvents.length - 1].type : null}
                />

                {/* Olay altyazısı */}
                {matchEvents.length > 0 && (
                  <div style={{
                    background: 'rgba(0,0,0,0.75)', color: '#fff',
                    padding: '6px 14px', borderRadius: '0 0 8px 8px',
                    fontSize: '13px', textAlign: 'center',
                    minHeight: '28px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    marginTop: '-8px', position: 'relative', zIndex: 1
                  }}>
                    <span style={{ color: '#FFD700', fontWeight: 'bold', marginRight: '8px', fontSize: '12px' }}>
                      {matchEvents[matchEvents.length - 1].minute}&apos;
                    </span>
                    <span>{matchEvents[matchEvents.length - 1].description}</span>
                  </div>
                )}

                {/* Alt grid: Kadro | Olay Log | Kadro */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr',
                  gap: '8px',
                  marginTop: '8px',
                  height: '180px'
                }}>
                  <TeamSquadPanel
                    teamName={homeTeam}
                    matchState={ms}
                    isHome={true}
                    manager={homeManagerRef.current}
                  />
                  <MatchEventLog events={matchEvents.filter(e => e.type !== 'idle')} />
                  <TeamSquadPanel
                    teamName={awayTeam}
                    matchState={ms}
                    isHome={false}
                    manager={awayManagerRef.current}
                  />
                </div>

                <MatchStatsPanel
                  stats={ms.stats}
                  matchEnded={matchEnded}
                />
              </>
            )}
          </div>
        </div>

        {/* Gol kutlama overlay */}
        {showGoalOverlay && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 100, borderRadius: '14px',
            pointerEvents: 'none'
          }}>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚽</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700', marginBottom: '4px' }}>
                GOOOL!
              </div>
              <div style={{ fontSize: '18px' }}>
                {showGoalOverlay.player}
              </div>
              <div style={{ fontSize: '14px', color: '#ccc', marginTop: '4px' }}>
                {showGoalOverlay.minute}&apos;
              </div>
            </div>
          </div>
        )}
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
