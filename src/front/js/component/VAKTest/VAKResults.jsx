import React from 'react';

const VAKResults = ({ results, onRetake }) => {
  const maxScore = Math.max(...Object.values(results));
  const predominantStyle = Object.keys(results).find(key => results[key] === maxScore);
  
  const getStyleDescription = () => {
    switch(predominantStyle) {
      case 'visual':
        return "Eres una persona visual. Aprendes mejor cuando puedes ver la información en forma de imágenes, diagramas, gráficos, mapas o demostraciones. Probablemente tomas notas detalladas y te gusta organizar la información visualmente.";
      case 'auditivo':
        return "Eres una persona auditiva. Aprendes mejor escuchando información, discutiendo ideas y verbalizando conceptos. Probablemente recuerdas bien las explicaciones orales y disfrutas de las discusiones grupales.";
      case 'kinestesico':
        return "Eres una persona kinestésica. Aprendes mejor haciendo, moviéndote y experimentando físicamente con las cosas. Probablemente prefieres aprender mediante la práctica directa y recuerdas mejor lo que has experimentado.";
      default:
        return "Tienes un estilo de aprendizaje equilibrado entre varias modalidades.";
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800">Tus resultados del Test VAK</h2>
      
      <div className="space-y-4">
        {Object.entries(results).map(([type, score]) => (
          <div key={type} className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium capitalize">{type}:</span>
              <span>{score} puntos</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  score === maxScore ? 'bg-blue-600' : 'bg-blue-300'
                }`}
                style={{ width: `${(score / 24) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 space-y-4">
        <h3 className="font-semibold text-lg text-center">
          Tu estilo predominante es: <span className="text-blue-600 capitalize">{predominantStyle}</span>
        </h3>
        <p className="text-gray-600">{getStyleDescription()}</p>
        
        <button
          onClick={onRetake}
          className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Volver a hacer el test
        </button>
      </div>
    </div>
  );
};

export default VAKResults;