const Answer = ({ answerText, onSelectedAnswer, index, currentAnswer, correctAnswer }) => {
   const optionMapping = [ 'A', 'B', 'C', 'D' ];
   const isCorrectAnswer = currentAnswer && answerText === correctAnswer;
   const isWrongAnswer = currentAnswer === answerText && currentAnswer !== correctAnswer;
   const correctAnswerClass = isCorrectAnswer ? 'correct-answer' : '';
   const wrongAnswerClass = isWrongAnswer ? 'wrong-answer' : '';
   const disableClass = currentAnswer ? 'disabled-answer' : '';
   return (
      <>
         <div className={`answer ${correctAnswerClass} ${wrongAnswerClass} ${disableClass}`} onClick={() => onSelectedAnswer(answerText)}>
            <div className="answer-letter">{optionMapping[index]}</div>
            <div className="answer-text">{answerText}</div>
         </div>
      </>
   )
}

export default Answer;