import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    funcionarios: '',
    custo: '',
    custoOutro: '',
    funcoes: [] as string[],
    outraFuncao: '',
    tempo: '',
    ticketMedio: '',
    telefone: '',
  });

  const [showOutraFuncao, setShowOutraFuncao] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);


  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, '');
    if (!numeric) return 'R$ 0,00';
    const number = parseFloat(numeric) / 100;
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleKeyDownNumberOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidKeys = ['e', 'E', '+', '-', '.'];
    if (invalidKeys.includes(e.key)) e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    if (type === 'checkbox') {
      const checked = target.checked;
      if (name === 'funcoes') {
        if (value === 'outra') setShowOutraFuncao(checked);
        setFormData((prev) => {
          const funcoes = checked
            ? [...prev.funcoes, value]
            : prev.funcoes.filter((item) => item !== value);
          return { ...prev, funcoes };
        });
      }
    } else {
      if (name === 'telefone') {
        const raw = value.replace(/\D/g, '').slice(0, 11);
        let formatted = '';
        if (raw.length > 0) formatted = `(${raw.slice(0, 2)}`;
        if (raw.length >= 3) formatted += `) ${raw.slice(2, 7)}`;
        if (raw.length >= 8) formatted += `-${raw.slice(7, 11)}`;
        setFormData((prev) => ({ ...prev, telefone: formatted }));
      } else if (name === 'outraFuncao') {
        const allowed = /^[a-zA-ZÀ-ú\s.,()\/-]*$/;
        if (!allowed.test(value)) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
      } else if (name === 'ticketMedio' || name === 'custoOutro') {
        setFormData((prev) => ({ ...prev, [name]: formatCurrency(value) }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }

    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors: { [key: string]: boolean } = {};
    const custoFinal = formData.custo === 'Outro' ? formData.custoOutro : formData.custo;

    if (!formData.funcionarios) newErrors.funcionarios = true;
    if (!custoFinal || custoFinal === 'R$ 0,00') newErrors.custo = true;
    if (formData.funcoes.length === 0) newErrors.funcoes = true;
    if (showOutraFuncao && !formData.outraFuncao) newErrors.outraFuncao = true;
    if (!formData.tempo) newErrors.tempo = true;
    if (!formData.ticketMedio) newErrors.ticketMedio = true;
    if (formData.telefone.replace(/\D/g, '').length !== 11) newErrors.telefone = true;
    if (formData.custo === 'Outro' && (!formData.custoOutro || formData.custoOutro === 'R$ 0,00')) {
      newErrors.custoOutro = true;
    }

    if (Object.keys(newErrors).length > 0) {
      console.log('Campos com erro:', newErrors);
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      custo: custoFinal,
    };

    try {
      const response = await fetch('https://n8nwebhook.n8n-n8n-start.u81uve.easypanel.host/webhook/calculadora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      navigate('/result');
    } catch (error) {
      console.error(error);
      setIsLoading(false)
    }
  };

  const getInputClass = (field: string) =>
    `w-full p-3 text-black rounded-full border ${
      errors[field] ? 'border-red-500 animate-shake' : 'border-green-500'
    }`;


if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-artegra">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-10 w-10 text-green-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-lg text-green-400 animate-pulse">Enviando dados para análise...</p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-[#3e0f52] text-white flex flex-col items-center justify-center font-artegra px-4 pt-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-center text-3xl md:text-4xl font-bold leading-tight mb-8 max-w-3xl mx-auto">
          <strong>Descubra quanto sua empresa está perdendo sem automações.</strong>
        </h1>
        <h2 className="text-center text-2xl md:text-xl font-bold leading-tight mb-8 max-w-3xl mx-auto">
          <span className="text-green-400">Em 60 segundos</span>, um diagnóstico estratégico e preciso
          para quem quer escalar com inteligência.
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#111111] text-white rounded-lg p-6 md:w-1/2 max-w-md w-full shadow-xl border border-purple-800 space-y-4 mt-8 md:mt-0 mb-6"
      >
        <h2 className="text-lg font-semibold text-center mb-2 md:text-2xl text-green-400">
          Descubra quanto sua empresa pode economizar com IA e automações
        </h2>

        <input
          type="number"
          name="funcionarios"
          placeholder="Quantos funcionários sua empresa possui?"
          className={getInputClass('funcionarios')}
          onWheel={(e) => e.currentTarget.blur()}
          onKeyDown={handleKeyDownNumberOnly}
          onChange={handleChange}
        />

        <div className="space-y-2">
          <label className="block font-medium">Custo médio mensal de cada funcionário:</label>
          {['R$ 2.222,62', 'R$ 3.460,80', 'R$ 4.377,60', 'Outro'].map((opcao) => (
            <label key={opcao} className="flex items-center">
              <input
                type="radio"
                name="custo"
                value={opcao}
                checked={formData.custo === opcao}
                onChange={handleChange}
                className={`mr-2 ${errors.custo ? 'border-red-500 animate-shake' : 'border-green-500'}`}
              />
              {opcao === 'Outro' ? 'Outro:' : opcao}
            </label>
          ))}
          {formData.custo === 'Outro' && (
            <input
              type="text"
              name="custoOutro"
              placeholder="Digite o valor"
              className={getInputClass('custoOutro')}
              value={formData.custoOutro || ''}
              onChange={(e) => {
                const formatted = formatCurrency(e.target.value);
                setFormData((prev) => ({ ...prev, custoOutro: formatted }));
                setErrors((prev) => ({ ...prev, custoOutro: false }));
              }}
            />
          )}
        </div>

        <div className="space-y-1">
          <label className="block font-medium">Função dos funcionários:</label>
          {[
            'Atendimento ao cliente',
            'Prospecção de leads',
            'Agendamento / Suporte',
            'Pós-venda / Follow-up',
            'Operações (financeiro, administrativo)',
          ].map((func) => (
            <label key={func} className="flex items-center">
              <input
                type="checkbox"
                name="funcoes"
                value={func}
                onChange={handleChange}
                className={`mr-2 ${errors.funcoes ? 'border-red-500 animate-shake' : 'border-green-500'}`}
              />
              {func}
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="checkbox"
              name="funcoes"
              value="outra"
              onChange={handleChange}
              className={`mr-2 ${errors.funcoes ? 'border-red-500 animate-shake' : 'border-green-500'}`}
            />
            Outras
          </label>
          {showOutraFuncao && (
            <input
              type="text"
              name="outraFuncao"
              placeholder="Descreva outra função"
              className={getInputClass('outraFuncao')}
              value={formData.outraFuncao}
              onChange={handleChange}
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Tempo com tarefas repetitivas:</label>
          {['Quase nada', 'Entre 30% e 50%', 'Entre 50% e 80%', 'Quase tudo (>80%)'].map((op) => (
            <label key={op} className="flex items-center">
              <input
                type="radio"
                name="tempo"
                value={op}
                onChange={handleChange}
                className={`mr-2 ${errors.tempo ? 'border-red-500 animate-shake' : 'border-green-500'}`}
              />
              {op}
            </label>
          ))}
        </div>

        <div className="font-medium flex flex-col gap-2">
          <h1>Ticket médio por cliente</h1>
          <input
            type="text"
            name="ticketMedio"
            placeholder="R$ 0,00"
            className={getInputClass('ticketMedio')}
            value={formData.ticketMedio}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Telefone</label>
          <input
            type="tel"
            name="telefone"
            placeholder="(00) 00000-0000"
            className={`w-full p-2 text-black rounded border ${
              errors.telefone ? 'border-red-500 animate-shake' : 'border-green-500'
            }`}
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-600 transition"
        >
          QUERO CRESCER MINHA EMPRESA
        </button>

        <p className="text-xs text-gray-400 text-center mt-2">
          Prometemos não usar suas informações para enviar SPAM. Os dados são tratados conforme a LGPD.
        </p>
      </form>
    </div>
    
  );
}
