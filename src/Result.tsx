import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


export default function Result() {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const duration = 7000;

  const results = [
    {
      title: '💰 Economia estimada',
      text: 'Sua empresa pode economizar até R$14.600 por ano substituindo apenas tarefas repetitivas por IA.'
    },
    {
      title: '📈 Simulação de ROI',
      text: 'Para cada R$1 investido em automação, você pode economizar R$6,20.'
    },
    {
      title: '🤖 Ação recomendada',
      text: 'Comece com o MindBot, seu novo agente invisível que faz atendimento, vendas e marcação de consultas.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, duration);

    let frame: number;
    let start: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);
      if (pct < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(frame);
    };
  }, [carouselIndex]);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % results.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + results.length) % results.length);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-xl p-6">
        <div className="relative bg-white text-black rounded-2xl p-8 shadow-2xl text-center min-h-[260px] border border-gray-200 transition-all duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-4">{results[carouselIndex].title}</h2>
              <p className="text-lg leading-relaxed">{results[carouselIndex].text}</p>
              {carouselIndex === results.length - 1 && (
                <motion.a
                  href="https://wa.me/5599999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-lg transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Falar com um especialista
                </motion.a>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-200 rounded mt-6 overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'linear' }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
              onClick={prevSlide}
            >
              ⬅️ Anterior
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              onClick={nextSlide}
            >
              Próximo ➡️
            </button>
          </div>

          <div className="mt-8 flex justify-center">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-white bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-full shadow-lg transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            ⬅ Voltar para o início
          </motion.button>
        </div>



          {/* Dots */}
          <div className="flex justify-center mt-4 gap-2">
            {results.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === carouselIndex ? 'bg-green-500 scale-110' : 'bg-gray-400'
                } transition-transform duration-300`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
