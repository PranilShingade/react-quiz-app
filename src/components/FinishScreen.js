/**
 * FinishScreen component - Displays quiz results and restart option
 * @component
 * @param {Object} props - Component props
 * @param {number} props.points - Points earned in the quiz
 * @param {number} props.TOTAL_POINTS - Maximum possible points
 * @param {number} props.highscore - Best score achieved across all attempts
 * @param {Function} props.dispatch - Redux-style dispatch function
 * @returns {JSX.Element} Quiz results screen with score, emoji feedback, and restart button
 */
export default function FinishScreen({
  points,
  TOTAL_POINTS,
  highscore,
  dispatch,
}) {
  let emoji;
  const percentage = (points / TOTAL_POINTS) * 100;

  // Display emoji based on performance brackets
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "😊";
  if (percentage >= 30 && percentage < 50) emoji = "😐";
  if (percentage > 0 && percentage < 30) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You got <strong>{points}</strong>/ out of{" "}
        {TOTAL_POINTS} ({percentage.toFixed(2)}%)
      </p>

      <p className="highscore">
        <span>🏆</span> Highscore: {highscore} points
      </p>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}
