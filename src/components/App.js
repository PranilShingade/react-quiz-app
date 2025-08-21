import { useEffect, useState } from "react";
import { useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";
import QuestionPanel from "./QuestionPanel";

const SECOND_PER_QUESTION = 30;

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const initialState = {
  questions: [],
  answer: null,
  points: 0,
  highscore: 0,
  answeredQuestions: new Set(),
  secondsRemaining: null,
  // 1. loading, 2. ready, 3. error, 4. finished, 5. active
  status: "loading",
  index: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      const shuffledQuestions = shuffleArray(action.payload).map((question) => {
        const shuffledOptions = shuffleArray([...question.options]); // Create shuffled copy
        return {
          ...question,
          shuffledOptions: shuffledOptions,
          correctAnswerIndex: shuffledOptions.findIndex(
            (option) => option === question.correctOption,
          ),
        };
      });
      return {
        ...state,
        questions: shuffledQuestions, //action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECOND_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      const isCorrect = question.correctAnswerIndex === action.payload;
      const newAnsweredQuestions = new Set(state.answeredQuestions);
      newAnsweredQuestions.add(state.index);
      return {
        ...state,
        answer: action.payload,
        points: isCorrect ? state.points + question.points : state.points,
        answeredQuestions: newAnsweredQuestions,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "jumpToQuestion":
      return {
        ...state,
        index: action.payload,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        highscore: state.highscore,
        questions: state.questions,
        status: "ready",
      };
    // return {
    //   ...state,
    //   status: "ready",
    //   index: 0,
    //   answer: null,
    //   points: 0,
    // };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      index,
      answer,
      points,
      highscore,
      status,
      secondsRemaining,
      answeredQuestions,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const numQuestions = questions.length;
  const TOTAL_POINTS = questions.reduce((prev, curr) => prev + curr.points, 0);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <QuestionPanel
              numQuestions={numQuestions}
              currentIndex={index}
              dispatch={dispatch}
              answeredQuestions={answeredQuestions}
              isOpen={isPanelOpen}
              onToggle={() => setIsPanelOpen(!isPanelOpen)}
            />
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              TOTAL_POINTS={TOTAL_POINTS}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer className="footer">
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />

              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            TOTAL_POINTS={TOTAL_POINTS}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
