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
      title: '💰 Projeção de Economia Inteligente',
      text: (
        <>
          Substituindo apenas tarefas repetitivas por IA, sua empresa pode reduzir, em média,{' '}
          <span className="text-green-500 font-semibold">30% com custos operacionais</span> — sem demitir ninguém.
          Só otimizando o que já está travando o seu crescimento.
        </>
      ),
    },
    {
      title: '📊 Simulação de Retorno (ROI)',
      text: (
        <>
          Para cada R$1 investido em automação, o retorno projetado em economia é de até R$6,20. <br />
          <br />
          É mais eficiente que contratar mais funcionários. <br />
          E mais confiável que esperar pelo “melhor vendedor”.
        </>
      ),
    },
    {
      title: '🤖 Recomendação Tática',
      text: (
        <>
          Comece com o <strong>MindBot</strong> — seu agente invisível. <br />
          Atende, vende, agenda. Tudo sem salário, sem folga e sem erro.
          <br />
          <br />
          Você pode ter quantos funcionários quiser em tempo integral... gastando muito menos e com menos dor de cabeça.
        </>
      ),
    },
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
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1a1a] to-[#3e0f52] text-white flex items-center justify-center font-artegra">
      <div className="w-full max-w-xl p-6">
        <div className="relative bg-[#0e0e0e] text-white rounded-2xl p-8 shadow-xl text-center min-h-[300px] border border-purple-800 transition-all duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-400">
                {results[carouselIndex].title}
              </h2>
              <p className="text-base md:text-lg whitespace-pre-line leading-relaxed text-white">
                {results[carouselIndex].text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-700 rounded mt-6 overflow-hidden">
            <motion.div
              className="h-full bg-green-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'linear' }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
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

          {/* Voltar para Início */}
          <div className="mt-8 flex justify-center">
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-white bg-purple-800 hover:bg-purple-700 px-5 py-2 rounded-full shadow-lg transition-colors duration-300"
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
                  index === carouselIndex ? 'bg-green-500 scale-110' : 'bg-gray-500'
                } transition-transform duration-300`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
