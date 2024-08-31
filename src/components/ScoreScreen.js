import React from "react";

const ScoreScreen = ({ score, onRestart, onLevelSelect }) => {
  return (
    <div className="ScoreScreen">
      <h1>ゲーム終了</h1>
      <h2>スコア:{score}</h2>
      <div className="ScoreScreen">
        <div className="button-container">
          <button className="restart-button" onClick={onRestart}>
            もう一度遊ぶ
          </button>
          <button className="level-select-button" onClick={onLevelSelect}>
            レベル選択に戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreScreen;
