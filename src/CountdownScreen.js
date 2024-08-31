import React, { useEffect } from "react";

const CountdownScreen = ({ countdown, onCountdownEnd }) => {
  useEffect(() => {
    if (countdown === 0) {
      onCountdownEnd();
    }
  }, [countdown, onCountdownEnd]);

  return (
    <div className="countdown-screen">
      <h3>ゲーム開始まで: {countdown}</h3>
    </div>
  );
};

export default CountdownScreen;
