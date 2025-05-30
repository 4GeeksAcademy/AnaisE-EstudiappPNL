import React from 'react';

const VAKQuestionCard = ({ question, onAnswer, currentQuestion, totalQuestions }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 space-y-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">Pregunta {currentQuestion} de {totalQuestions}</span>
        <div className="w-full bg-gray-200 rounded-full h-2.5 ml-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800">{question.question}</h2>
      
      <div className="space-y-3">
         <button
          
            onClick={() => onAnswer(0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200 transform hover:scale-[1.01]"
          >
            {question.option_v}
          </button>
         <button
          
            onClick={() => onAnswer(1)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200 transform hover:scale-[1.01]"
          >
            {question.option_a}
          </button>
         <button
          
            onClick={() => onAnswer(2)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200 transform hover:scale-[1.01]"
          >
            {question.option_k}
          </button>
      </div>
    </div>
  );
};

export default VAKQuestionCard;
