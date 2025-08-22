import { useEffect } from "react";

/**
 * Timer component - Countdown timer for quiz duration
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.dispatch - Redux-style dispatch function
 * @param {number} props.secondsRemaining - Seconds left in the quiz
 * @returns {JSX.Element} Timer display in MM:SS format
 * @sideEffects Sets up interval to decrement timer every second
 */
export default function Timer({ dispatch, secondsRemaining }) {
  // Convert seconds to minutes and seconds for display
  const min = Math.floor(secondsRemaining / 60);
  const sec = secondsRemaining % 60;

  useEffect(
    function () {
      // Create interval to dispatch tick action every second
      const interval = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);

      // Cleanup interval on unmount or when dependencies change
      return () => clearInterval(interval);
    },
    [dispatch, secondsRemaining], // Re-run if dispatch or secondsRemaining changes
  );

  return (
    <div className="timer">
      <p>
        <span>
          {/* Format time with leading zeros for consistent display */}
          {min < 10 ? `0${min}` : min}:{sec < 10 ? `0${sec}` : sec}
        </span>
      </p>
    </div>
  );
}
