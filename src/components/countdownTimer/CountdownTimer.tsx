import React, { useState, useEffect, useCallback } from "react";

interface TimeLeft {
  d?: number;
  h?: number;
  m?: number;
  s?: number;
}

interface CountdownTimerProps {
  initialTimestamp: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialTimestamp,
}) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = Date.now();
    const difference = initialTimestamp * 1000 + 10 * 24 * 60 * 60 * 1000 - now;

    let timeLeft: TimeLeft = {};
    if (difference > 0) {
      timeLeft = {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }

    return timeLeft;
  }, [initialTimestamp]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, initialTimestamp]);

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof TimeLeft]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval as keyof TimeLeft]} {interval}{" "}
      </span>
    );
  });

  return (
    <div className="flex justify-between p-5">
      <div>Next epoch in</div>
      <div>{timerComponents}</div>
    </div>
  );
};

export default CountdownTimer;
