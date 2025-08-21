export default function FinishScreen({
  points,
  TOTAL_POINTS,
  highscore,
  dispatch,
}) {
  let emoji;
  const percentage = (points / TOTAL_POINTS) * 100;
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
