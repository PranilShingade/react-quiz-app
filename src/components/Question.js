import Options from "./Options";

/**
 * Question component - Displays a quiz question with its answer options
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.question - Question object with text and options
 * @param {number|null} props.answer - Currently selected answer index
 * @param {Function} props.dispatch - Redux-style dispatch function
 * @returns {JSX.Element} Question text with answer options
 */
export default function Question({ question, answer, dispatch }) {
  return (
    <div>
      <h2>{question.question}</h2>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}
