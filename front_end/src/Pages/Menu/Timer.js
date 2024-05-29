import React, { useState, useEffect } from "react";

const Timer = ({ isActive, onTimeUpdate, totalTime }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          onTimeUpdate(totalTime - newTime); 
          return newTime;
        });
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time, totalTime, onTimeUpdate]);

  return (
    <div>
      <p>Time taken: {time} seconds</p>
    </div>
  );
};

export default Timer;
