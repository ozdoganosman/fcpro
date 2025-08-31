import React from 'react';
import PropTypes from 'prop-types';

const FinanceModal = ({ setShowFinance, club }) => {
    // Mali durum hesaplamaları
    const calculateCurrentExpenses = () => {
        // Menajer maaşı (varsayılan)
        const managerSalary = 1000; // TL
        
        // Teknik kadro maliyeti (varsayılan)
        const technicalStaffCost = 280; // 4 personel x 70 TL
        
        // Oyuncu maaşları toplamı
        const playerSalaries = club.squad ? 
            [...club.squad.firstTeam, ...club.squad.substitutes].reduce((total, player) => total + (player.salary || 0), 0) : 0;
        
        return managerSalary + technicalStaffCost + playerSalaries;
    };
    
    const calculateFacilityCosts = () => {
        // Antrenman tesisi maliyeti (seviyeye göre)
        const trainingCost = Math.round(Math.pow(club.antrenman / 10, 2) * 50);
        
        // Altyapı maliyeti (seviyeye göre)
        const youthCost = Math.round(Math.pow(club.altyapi / 10, 2) * 40);
        
        return trainingCost + youthCost;
    };
    
    const getHighestPlayerSalary = () => {
        if (!club.squad) return 0;
        const allPlayers = [...club.squad.firstTeam, ...club.squad.substitutes];
        return Math.max(...allPlayers.map(player => player.salary || 0));
    };
    
    const calculateProfitLoss = () => {
        // Şu anki para - yılın başındaki para (oyun başında verilen sermaye: 50000)
        const initialMoney = 50000;
        return club.money - initialMoney;
    };
    
    const currentExpenses = calculateCurrentExpenses();
    const facilityCosts = calculateFacilityCosts();
    const highestSalary = getHighestPlayerSalary();
    const profitLoss = calculateProfitLoss();
    
    return (
        <div className="fc-modal-backdrop">
            <div className="fc-modal">
                <h3>MALİ DURUM</h3>
                <div className="fc-panel">
                    <div className="fc-row">
                        <div className="fc-bank-icon">💰</div>
                        <div>
                            <div className="fc-bank-title">BANKA BAKİYESİ</div>
                            <div className="fc-badge-green">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(club.money)}</div>
                            <div className="fc-muted">Limit Aşımı: ₺4,000</div>
                        </div>
                    </div>
                </div>
                <div className="fc-fin-list">
                    <div className="item"><span>Mevcut Ücretler</span><span style={{fontWeight: 'bold'}}>₺{currentExpenses.toLocaleString()}</span></div>
                    <div className="item"><span>Tesisler</span><span style={{fontWeight: 'bold'}}>₺{facilityCosts.toLocaleString()}</span></div>
                    <div className="item"><span>Önerilen En Yüksek Ücret</span><span style={{fontWeight: 'bold'}}>₺{highestSalary.toLocaleString()}</span></div>
                    <div className="item"><span>Bu seneki kar/zarar</span><span style={{fontWeight: 'bold', color: profitLoss >= 0 ? 'var(--win)' : 'var(--loss)'}}>{profitLoss >= 0 ? '+' : ''}₺{profitLoss.toLocaleString()}</span></div>
                </div>
                <div className="fc-cta">Daha fazla para ister misin?</div>
                <button className="fc-btn" style={{width: '100%', background: 'var(--green-light)', color: '#222', marginTop: '10px'}}>Yatırım yaparak kulübünün mali durumunu iyileştir!</button>
                <div className="fc-footerbar">
                    <button className="fc-btn" onClick={() => setShowFinance(false)}>Geri</button>
                    <button className="fc-btn">Transferler</button>
                    <button className="fc-btn">Geçmiş</button>
                </div>
            </div>
        </div>
    );
};

FinanceModal.propTypes = {
    setShowFinance: PropTypes.func.isRequired,
    club: PropTypes.object.isRequired,
};

export default FinanceModal;