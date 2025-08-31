import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TrainingMenu({ setShowTrainingMenu }) {
  const [rating, setRating] = useState(37);
  const [weeklyCost] = useState(84);
  const [expense, setExpense] = useState(3808);
  const [newWeeklyCost, setNewWeeklyCost] = useState(95);
  const [bankBalance] = useState(10222);

  const increaseRating = (value) => {
    setRating((prev) => prev + value);
    setExpense((prev) => prev + value * 100);
    setNewWeeklyCost((prev) => prev + value);
  };

  const decreaseRating = (value) => {
    setRating((prev) => prev - value);
    setExpense((prev) => prev - value * 100);
    setNewWeeklyCost((prev) => prev - value);
  };

  return (
    <div className="training-menu">
      <h3>ANTRENMAN TESİSLERİ</h3>
      <div className="rating-section">
        <img src="/Figures/human_filled_1024.png" alt="Training" />
        <div>
          <div className="rating-value">REYTİNG {rating}</div>
          <div>Haftalık Ücret: ₺{weeklyCost}</div>
        </div>
      </div>
      <div className="controls">
        <button onClick={() => decreaseRating(5)}>«5</button>
        <button onClick={() => decreaseRating(1)}>«1</button>
        <div className="rating-display">{rating}</div>
        <button onClick={() => increaseRating(1)} className="increase">1»</button>
        <button onClick={() => increaseRating(5)} className="increase">5»</button>
      </div>
      <div className="costs">
        <div>Masraf: ₺{expense}</div>
        <div>Yeni Haftalık Maliyet: ₺{newWeeklyCost}</div>
        <div>Banka Bakiyesi: ₺{bankBalance}</div>
      </div>
      <div className="actions">
        <button onClick={() => setShowTrainingMenu(false)}>Geri</button>
        <button>Yükselt</button>
      </div>
    </div>
  );
}

TrainingMenu.propTypes = {
  setShowTrainingMenu: PropTypes.func.isRequired,
};

export default TrainingMenu;
