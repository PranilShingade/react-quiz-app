/**
 * StartScreen component - Initial welcome screen before quiz begins
 * @component
 * @param {Object} props - Component props
 * @param {number} props.numQuestions - Total number of questions in the quiz
 * @param {Function} props.dispatch - Redux-style dispatch function
 * @returns {JSX.Element} Welcome message with start button
 */
export default function StartScreen({ numQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
}
