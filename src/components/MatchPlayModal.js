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
  // Re-render trigger for mutable matchState
  const [, setRenderTick] = useState(0);

  const homeTeam = club.name;
  const awayTeam = matchData.awayTeam;

  // Mutable engine state (React state yerine — performans için)
  const matchStateRef = useRef(null);

  // Manager referansları
  const homeManagerRef = useRef(null);
  const awayManagerRef = useRef(null);

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
      // Mevcut enerjileri uygula
      const savedEnergies = playerEnergies[teamKey];
      [...squad.firstTeam, ...squad.substitutes].forEach(player => {
        const saved = savedEnergies.find(s => s.name === player.name);
        if (saved) player.energy = saved.energy;
      });
    } else {
      // İlk kez: %100 enerji
      [...squad.firstTeam, ...squad.substitutes].forEach(p => { p.energy = 100; });
      setPlayerEnergies(prev => ({
        ...prev,
        [teamKey]: [...squad.firstTeam, ...squad.substitutes].map(p => ({ ...p }))
      }));
    }

    // Dinamik İLK 11 seç
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

    // Maç simülasyonu
    const result = simulateMatch(homeSquad, awaySquad, homeMgr, awayMgr, homeTeam, awayTeam);
    setPreCalculatedMatch(result);

    // MatchState oluştur
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
      setRenderTick(prev => prev + 1); // matchState değişikliklerini yansıt
    } else {
      setIsPlaying(false);
      setMatchEnded(true);
    }
  }, [preCalculatedMatch, currentEventIndex, homeTeam, awayTeam]);

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

  // Oynatma interval'i
  useEffect(() => {
    if (isPlaying && !isFastForward && preCalculatedMatch) {
      const interval = setInterval(() => {
        advanceTime();
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isFastForward, preCalculatedMatch, advanceTime]);

  // "Devam Et" butonu — enerjileri kaydet ve maçı bitir
  const handleContinue = useCallback(() => {
    const ms = matchStateRef.current;
    if (!ms) return;

    const homeTeamKey = `${club.league}_${homeTeam}`;
    const awayTeamKey = `${club.league}_${awayTeam}`;

    // Enerjileri kaydet (firstTeam + substitutes)
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

    // Global state'e geri yaz (enerji sürekliliği)
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
      <div className="fc-modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden' }}>
        <MatchScoreboard
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeScore={ms?.homeScore || 0}
          awayScore={ms?.awayScore || 0}
          currentMinute={currentMinute}
          matchType={matchData.type}
          league={club.league}
        />

        <div className="fc-panel" style={{ padding: '20px' }}>
          <MatchControls
            isPlaying={isPlaying}
            matchEnded={matchEnded}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onFastForward={fastForwardToEnd}
            onContinue={handleContinue}
          />

          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr 1fr',
              gap: '15px',
              height: '450px'
            }}>
              {ms && (
                <>
                  <TeamSquadPanel
                    teamName={homeTeam}
                    matchState={ms}
                    isHome={true}
                    manager={homeManagerRef.current}
                  />
                  <MatchEventLog events={matchEvents} />
                  <TeamSquadPanel
                    teamName={awayTeam}
                    matchState={ms}
                    isHome={false}
                    manager={awayManagerRef.current}
                  />
                </>
              )}
            </div>

            {ms && (
              <MatchStatsPanel
                stats={ms.stats}
                matchEnded={matchEnded}
              />
            )}
          </div>
        </div>
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
