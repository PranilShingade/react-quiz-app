import { useEffect } from "react";
export default function Timer({ dispatch, secondsRemaining }) {
  const min = Math.floor(secondsRemaining / 60);
  const sec = secondsRemaining % 60;
  useEffect(
    function () {
      const interval = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);
      return () => clearInterval(interval);
    },
    [dispatch, secondsRemaining],
  );
  return (
    <div className="timer">
      <p>
        <span>
          {min < 10 ? `0${min}` : min}:{sec < 10 ? `0${sec}` : sec}
        </span>
      </p>
    </div>
  );
}
