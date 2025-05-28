import React, { useState } from 'react';
import VAKQuestionCard from './VAKQuestionCard.jsx';
import VAKResults from './VAKResults.jsx';
import vakQuestions from "../../../../api/json/questions.json";
      
const VAKTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  
  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < vakQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const calculatedResults = calculateResults(newAnswers);
      setResults(calculatedResults);
      setShowResults(true);
    }
  };
  
  const calculateResults = (userAnswers) => {
    const results = {
      visual: 0,
      auditivo: 0,
      kinestesico: 0
    };
    
    userAnswers.forEach((answer) => {
      if (answer === 0) results.visual++;
      if (answer === 1) results.auditivo++;
      if (answer === 2) results.kinestesico++;
    });
    
    localStorage.setItem('vakResults', JSON.stringify(results));
    return results;
  };
  
  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
    setResults(null);
  };
  
  if (showResults && results) {
    return <VAKResults results={results} onRetake={resetTest} />;
  }
  console.log(vakQuestions[currentQuestionIndex]);
  
  return (
    <VAKQuestionCard
      question={vakQuestions[currentQuestionIndex]}
      onAnswer={handleAnswer}
      currentQuestion={currentQuestionIndex + 1}
      totalQuestions={vakQuestions.length}
    />
  );
};


export default VAKTest;
