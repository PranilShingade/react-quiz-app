export default function Progress({
  index,
  numQuestions,
  points,
  TOTAL_POINTS,
  answer,
}) {
  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />

      <p>
        Question <strong>{index + 1}</strong> out of{" "}
        <strong>{numQuestions}</strong>
      </p>

      <p>
        <strong>{points}</strong>/{TOTAL_POINTS}
      </p>
    </header>
  );
}
