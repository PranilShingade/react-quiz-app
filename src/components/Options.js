export default function Options({ question, dispatch, answer }) {
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.shuffledOptions.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${hasAnswered ? (index === question.correctAnswerIndex ? "correct" : "wrong") : ""}`}
          key={index}
          disabled={hasAnswered}
          onClick={() =>
            dispatch({
              type: "newAnswer",
              payload: index,
            })
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}
