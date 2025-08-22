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

/** Time allocated per question in seconds */
const SECOND_PER_QUESTION = 30;

/**
 * Shuffles array elements using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array (original array is not mutated)
 */
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Initial state for the quiz application
 * @type {Object}
 * @property {Array} questions - Array of quiz questions
 * @property {number|null} answer - Index of selected answer for current question
 * @property {number} points - Total points earned
 * @property {number} highscore - Highest score achieved
 * @property {Set} answeredQuestions - Set of question indices that have been answered
 * @property {number|null} secondsRemaining - Time left in seconds
 * @property {string} status - Current app state: 'loading' | 'ready' | 'error' | 'finished' | 'active'
 * @property {number} index - Current question index
 */
const initialState = {
  questions: [],
  answer: null,
  points: 0,
  highscore: 0,
  answeredQuestions: new Set(),
  secondsRemaining: null,
  // Application states: 1. loading, 2. ready, 3. error, 4. finished, 5. active
  status: "loading",
  index: 0,
};

/**
 * Reducer function to manage quiz state transitions
 * @param {Object} state - Current state
 * @param {Object} action - Action object with type and optional payload
 * @returns {Object} New state
 */
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      // Shuffle questions and their options when data is received
      const shuffledQuestions = shuffleArray(action.payload).map((question) => {
        const shuffledOptions = shuffleArray([...question.options]); // Create shuffled copy
        return {
          ...question,
          shuffledOptions: shuffledOptions,
          // Track new index of correct answer after shuffling
          correctAnswerIndex: shuffledOptions.findIndex(
            (option) => option === question.correctOption,
          ),
        };
      });
      return {
        ...state,
        questions: shuffledQuestions,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      // Initialize timer based on total questions
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECOND_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      const isCorrect = question.correctAnswerIndex === action.payload;
      // Track which questions have been answered for navigation panel
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
        answer: null, // Reset answer for new question
      };
    case "jumpToQuestion":
      // Allow jumping to any question from the panel
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
      // Preserve highscore and questions across restarts
      return {
        ...initialState,
        highscore: state.highscore,
        questions: state.questions,
        status: "ready",
      };
    case "tick":
      // Countdown timer - finish quiz when time runs out
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

/**
 * Main App component - Manages the entire quiz application state and flow
 * @component
 * @returns {JSX.Element} The complete quiz application
 */
export default function App() {
  // Main state management using reducer pattern
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

  // Local state for question navigation panel visibility
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const numQuestions = questions.length;
  // Calculate maximum possible points for percentage calculations
  const TOTAL_POINTS = questions.reduce((prev, curr) => prev + curr.points, 0);

  // Fetch questions data on component mount
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
        {/* Conditional rendering based on application status */}
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
