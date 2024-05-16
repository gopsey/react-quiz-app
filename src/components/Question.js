import { useContext } from "react";
import { QuizContext } from "../contexts/QuizContext";
import Answer from "./Answer";

const Question = () => {
   const [quizState, setQuizState] = useContext(QuizContext);
   const currentQuestion = quizState.questions[quizState.questionNumber].question;
   const correctAnswer = quizState.questions[quizState.questionNumber].correctAnswer;
   const answers = quizState.answers;
   const dispatchOnAnswerSelected = (selectedAnswer) => {
      setQuizState({ type: 'SELECT_ANSWER', payload: selectedAnswer })
   }
   return (
      <>
         <div className="question">{currentQuestion}</div>
         <div className="answers">
            {
               answers.map((answerText, index) => (
                  <Answer answerText={answerText}
                  key={index}
                  index={index}
                  currentAnswer={quizState.currentAnswer}
                  correctAnswer={correctAnswer}
                  onSelectedAnswer={(selectedAnswer) => dispatchOnAnswerSelected(selectedAnswer)} />
               ))
            }
         </div>
      </>
   )
}

export default Question;