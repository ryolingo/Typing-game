import React, { useState } from "react";

const LevelSelection = ({ onLevelSelect }) => {
  const [selectedLevel, setSelectedLevel] = useState(1);

  const handleSelectClick = () => {
    onLevelSelect(selectedLevel);
  };

  return (
    <div className="LevelSelection">
      <h1>レベルを選択</h1>
      <label>
        レベル:
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </label>
      <button onClick={handleSelectClick}>ゲーム開始</button>
    </div>
  );
};
export default LevelSelection;
