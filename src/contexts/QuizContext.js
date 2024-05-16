import { createContext, useReducer } from "react";
import { shuffleAnswers } from "../helpers.js";
import questions from "../data.js";

const initialState = {
   questionNumber: 0,
   questions,
   showResults: false,
   answers: shuffleAnswers(questions[0]),
   currentAnswer: '',
   correctAnswersCount: 0,
};

const reducer = (state, action) => {
   switch (action?.type) {
      case 'NEXT_QUESTION':
         const showResults = state.questionNumber === state.questions.length - 1;
         const questionNumber = showResults ? state.questionNumber : state.questionNumber + 1;
         const answers = showResults ? [] : shuffleAnswers(questions[state?.questionNumber + 1]);
         return {
            ...state,
            questionNumber,
            showResults,
            answers,
            currentAnswer: '',
         }
      case 'RESTART':
         return initialState;
      case 'SELECT_ANSWER':
         const correctAnswer = state.questions[state.questionNumber].correctAnswer;
         const correctAnswersCount = action.payload === correctAnswer ? state.correctAnswersCount + 1 : state.correctAnswersCount;
         return { ...state, currentAnswer: action.payload, correctAnswersCount }
      default:
         return state;
   }
}

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => { // children is Quiz.js
   const currentStateAndDispatch = useReducer(reducer, initialState);
   return (
      <QuizContext.Provider value={currentStateAndDispatch}>
         {children}
      </QuizContext.Provider>
   )
}