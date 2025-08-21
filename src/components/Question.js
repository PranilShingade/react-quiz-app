import Options from "./Options";
export default function Question({ question, answer, dispatch }) {
  return (
    <div>
      <h2>{question.question}</h2>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}
