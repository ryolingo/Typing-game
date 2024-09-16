import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import HomeScreen from "./components/HomeScreen";
import LevelSelection from "./components/LevelSelection";
import WordDisplay from "./components/WordDisplay";
import Input from "./components/Input";
import Score from "./components/Score";
import ScoreScreen from "./components/ScoreScreen";
import useWord from "./components/useWord";
import CountdownScreen from "./CountdownScreen";

function App() {
  const [level, setLevel] = useState(1);
  const [word, generateWord] = useWord(level);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(2);
  const [gameActive, setGameActive] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showLevelSelection, setShowLevelSelection] = useState(false);
  const [showScoreScreen, setShowScoreScreen] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const inputRef = useRef(null);
  const timeRef = useRef(null);
  const [showStartAndLevelButtons, setShowStartAndLevelButtons] =
    useState(true);
  const [showCountdownScreen, setShowCountdownScreen] = useState(false);

  // Initialize high score from localStorage
  useEffect(() => {
    const savedHighScore = JSON.parse(localStorage.getItem("highScore")) || 0;
    setHighScore(savedHighScore);
  }, []);

  // Start the countdown
  const startCountdown = useCallback(() => {
    if (countdown !== null) return; // カウントダウンが既に開始されている場合は何もしない

    setCountdown(3);
    setShowCountdownScreen(true);
    setShowStartAndLevelButtons(false);
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          setShowCountdownScreen(false);
          generateWord(level);
          setScore(0);
          setInput("");
          setTimeLeft(60); // タイマーの初期値を60秒に設定
          setGameActive(true);
          setCountdown(null);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
        return prevCountdown - 1;
      });
    }, 1000);
  }, [countdown, generateWord, level]);

  useEffect(() => {
    if (gameActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameActive]);

  // Handle level selection
  const handleLevelSelect = (selectedLevel) => {
    setLevel(selectedLevel);
    setShowLevelSelection(false);
    setShowScoreScreen(false);
    setShowHome(false); // ホーム画面を非表示
    setCountdown(null); // カウントダウンリセット
    setTimeLeft(60);
    setGameActive(false);
  };

  // Transition to level selection
  const handleTransitionToLevelSelection = () => {
    setShowHome(false);
    setShowLevelSelection(true);
    setShowScoreScreen(false);
    setCountdown(null); // カウントダウンリセット
    setTimeLeft(60);
    setGameActive(false);
    stopTimer();
  };

  const stopTimer = () => {
    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const value = e.target.value;
    const lastChar = value[value.length - 1];

    if (/^[a-zA-Z]+$/.test(lastChar) || value === "") {
      if (gameActive) {
        setInput(value);
      }
    }
  };

  // Restart the game
  const handleRestart = () => {
    setShowScoreScreen(false);
    setGameActive(false);
    setInput("");
    setScore(0);
    setTimeLeft(60); // タイマーの初期値を60秒に設定
    setLevel(level);
    setCountdown(null); // カウントダウンリセット
    setShowStartAndLevelButtons(true);
    startCountdown();
  };

  // Check input and update score
  useEffect(() => {
    if (input === word) {
      setScore((prevScore) => prevScore + 1);
      setInput("");
      generateWord(level);
    } else if (input.length >= word.length) {
      setInput("");
    }
  }, [input, word, level, generateWord]);

  // Update high scores in local storage
  const updateHighScores = useCallback(
    (score) => {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", JSON.stringify(score));
      }
    },
    [highScore]
  );

  // Handle timer and game end
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameActive) {
      updateHighScores(score);
      setGameActive(false);
      setShowScoreScreen(true);
    }
  }, [timeLeft, gameActive, score, level, updateHighScores]);

  return (
    <div className="App">
      <header class="header">
        <h1>Vocaburaly Typing Game</h1>
      </header>
      <div class="container">
        {showHome ? (
          <HomeScreen onTransition={handleTransitionToLevelSelection} />
        ) : showLevelSelection ? (
          <LevelSelection onLevelSelect={handleLevelSelect} />
        ) : showCountdownScreen ? ( // 修正: カウントダウンページの表示
          <CountdownScreen
            countdown={countdown}
            onCountdownEnd={() => setShowCountdownScreen(false)}
          />
        ) : showScoreScreen ? (
          <ScoreScreen
            score={score}
            onRestart={handleRestart}
            onLevelSelect={handleTransitionToLevelSelection}
          />
        ) : (
          <>
            <h2>レベル: {level}</h2>
            {!gameActive && countdown === null ? (
              <>
                {countdown !== null && <h3>ゲーム開始まで: {countdown}</h3>}
                {showStartAndLevelButtons && (
                  <>
                    <button className="start-button" onClick={startCountdown}>
                      スタート
                    </button>
                    <button
                      className="level-select-button"
                      onClick={handleTransitionToLevelSelection}
                    >
                      レベル選択に戻る
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <WordDisplay word={word} />
                <Input value={input} onChange={handleChange} ref={inputRef} />
                <Score score={score} />
                <h3>残り時間: {timeLeft}秒</h3>
              </>
            )}
            <h3>最高得点: {highScore}</h3>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
