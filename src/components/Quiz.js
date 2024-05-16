import { useContext } from "react";
import { QuizContext } from "../contexts/QuizContext";
import Question from "./Question";

const Quiz = () => {
   const [questionsData, setQuestionsData] = useContext(QuizContext);
   const currentQuestionNumber = questionsData.questionNumber;
   const totalQuestionsCount = questionsData.questions.length;
   const goToNextQuestion = () => {
      setQuestionsData({ 'type': 'NEXT_QUESTION' }); // dispatch()
   }
   const restartQuiz = () => {
      setQuestionsData({ 'type': 'RESTART' }); // dispatch()
   }
   return (
      <>
         <div className="quiz">
            {questionsData.showResults && (
               <div className="results">
                  <div className="congratulations">Congratulations</div>
                  <div className="results-info">
                     <div>You've completed the quiz</div>
                     <div>You've got {questionsData.correctAnswersCount} of {totalQuestionsCount} right</div>
                  </div>
                  <div className="next-button" onClick={restartQuiz}>Restart Quiz</div>
               </div>
            )}
            {!questionsData.showResults && (
               <div>
                  <div className="score">Question {currentQuestionNumber + 1}/{totalQuestionsCount}</div>
                  <Question />
                  <div className="next-button" onClick={goToNextQuestion}>Next</div>
               </div>
            )}
         </div>
      </>
   )
}

export default Quiz;