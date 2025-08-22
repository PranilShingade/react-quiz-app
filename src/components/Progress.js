/**
 * Progress component - Shows quiz progress bar and score tracking
 * @component
 * @param {Object} props - Component props
 * @param {number} props.index - Current question index
 * @param {number} props.numQuestions - Total number of questions
 * @param {number} props.points - Current points earned
 * @param {number} props.TOTAL_POINTS - Maximum possible points
 * @param {number|null} props.answer - Current answer selection
 * @returns {JSX.Element} Progress bar with question count and score display
 */
export default function Progress({
  index,
  numQuestions,
  points,
  TOTAL_POINTS,
  answer,
}) {
  return (
    <header className="progress">
      {/* Progress bar fills based on questions completed (includes current if answered) */}
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
