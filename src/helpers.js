export const shuffleAnswers = (questionData) => {
   const unshuffledAnswers = [...questionData.incorrectAnswers, questionData.correctAnswer];
   const shuffledAnswers = unshuffledAnswers
      .map(unshuffledAnswer => {
         return { sortId: Math.random(), value: unshuffledAnswer, }
      })
      .sort((a, b) => a.sortId - b.sortId)
      .map((element) => element.value)
   return shuffledAnswers;
}
