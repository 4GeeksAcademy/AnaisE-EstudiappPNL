import React, { useContext, useEffect, useState } from 'react'; // Asegúrate de importar useContext
import VAKQuestionCard from './VAKQuestionCard.jsx';
import VAKResults from './VAKResults.jsx';
import { Context } from '../../store/appContext.js'; // Importa Context correctamente
import { useNavigate } from 'react-router-dom'; // Si VAKTest va a usar navigate, impórtalo aquí


const VAKTest = () => {
  // TODOS LOS HOOKS DEBEN IR AL PRINCIPIO DEL COMPONENTE, SIN CONDICIONES
  const { store, actions } = useContext(Context); // Descomenta y úsalo si necesitas store/actions aquí
  const navigate = useNavigate(); // Si VAKTest usará navigate, ponlo aquí
  const [vakQuestions, setVakQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Cambiado a objeto para guardar {question_id: selected_option_char}
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null); // Resultados locales del cálculo VAK
  const [dominantChannelForBackend, setDominantChannelForBackend] = useState(null); // Para el resultado final a enviar al backend

  const getAllQuestions = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + '/api/questions');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  };

  // useEffect para cargar las preguntas una vez
  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await getAllQuestions();
      setVakQuestions(questions);
    };
    fetchQuestions();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  const handleAnswer = (questionId, optionIndex) => {
    const currentQuestion = vakQuestions.find(q => q.id === questionId);
    if (!currentQuestion) return;

    let selected_option_char;
    // Mapear la opción seleccionada a 'V', 'A', 'K'
    if (optionIndex === 0) selected_option_char = 'V';
    else if (optionIndex === 1) selected_option_char = 'A';
    else if (optionIndex === 2) selected_option_char = 'K';
    else return; // Manejar opción inválida

    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: selected_option_char
    }));

    if (currentQuestionIndex < vakQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Cuando todas las preguntas han sido respondidas
      const calculatedResults = calculateResults(answers); // Pasa las respuestas acumuladas
      setResults(calculatedResults);
      setShowResults(true);
      // Aquí se llamaría a la función para enviar al backend
      handleSubmitTest(answers); // Pasa las respuestas finales al manejador de envío
    }
  };

  const calculateResults = (userAnswers) => {
    const tempScores = {
      V: 0,
      A: 0,
      K: 0
    };

    // userAnswers es ahora un objeto {question_id: 'V'|'A'|'K'}
    Object.values(userAnswers).forEach((selectedChar) => {
      if (selectedChar in tempScores) {
        tempScores[selectedChar]++;
      }
    });

    // Determinar el canal dominante
    let dominant = '';
    let maxScore = -1;
    for (const channel in tempScores) {
      if (tempScores[channel] > maxScore) {
        maxScore = tempScores[channel];
        dominant = channel;
      }
    }
    setDominantChannelForBackend(dominant); // Guarda el canal dominante para el backend

    localStorage.setItem('vakResults', JSON.stringify(tempScores)); // Guardar scores raw
    return tempScores; // Retorna los scores para VAKResults
  };

  const handleSubmitTest = async (finalAnswers) => {
    try {
      const result = await actions.submitTestAnswers(finalAnswers);
      if (result.success) {
        alert("¡Test completado! Tu canal dominante es: " + result.data.dominant_channel);
        navigate('/dashboard'); // Redirige después de enviar
      } else {
        alert("Hubo un error al enviar tu test: " + result.message);
      }
    } catch (error) {
      console.error("Error al enviar el test al backend:", error);
      alert("Error de conexión al enviar el test.");
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers({}); // Reinicia a objeto vacío
    setShowResults(false);
    setResults(null);
    setDominantChannelForBackend(null);
  };


  // ESTAS RENDERIZACIONES CONDICIONALES DEBEN IR DESPUÉS DE LA DECLARACIÓN DE TODOS LOS HOOKS
  if (vakQuestions.length === 0) {
    return <div>Cargando preguntas...</div>;
  }

  // Después de cargar las preguntas, si no hay más preguntas disponibles (esto podría pasar si el índice se va de rango)
  if (currentQuestionIndex >= vakQuestions.length) {
    return <div>No hay más preguntas disponibles.</div>;
  }

  // Si showResults es true, muestra los resultados
  if (showResults && results) {
    return <VAKResults results={results} onRetake={resetTest} />;
  }

  // console.log(vakQuestions[currentQuestionIndex]); // Mueve este log aquí o donde vakQuestions ya esté garantizado

  // Si no hay resultados y hay preguntas, muestra la tarjeta de la pregunta actual
  return (
    <VAKQuestionCard
      question={vakQuestions[currentQuestionIndex]}
      onAnswer={(optionIndex) => handleAnswer(vakQuestions[currentQuestionIndex].id, optionIndex)}
      currentQuestion={currentQuestionIndex + 1}
      totalQuestions={vakQuestions.length}
    />
  );
};



export default VAKTest;