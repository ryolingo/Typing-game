import React from "react";

const HomeScreen = ({ onTransition }) => {
  return (
    <div className="HomeScreen">
      <h1>TOEIC Vocaburaly Game</h1>
      <button className="level-select-button" onClick={onTransition}>
        レベル選択へ
      </button>
    </div>
  );
};
export default HomeScreen;
