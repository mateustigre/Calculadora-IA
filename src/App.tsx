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
    const newErrors: { [key: string]: boolean } = {};

    const custoFinal = formData.custo === 'Outro' ? formData.custoOutro : formData.custo;

    if (!formData.funcionarios) newErrors.funcionarios = true;
    if (!custoFinal || custoFinal === 'R$ 0,00') newErrors.custo = true;
    if (formData.funcoes.length === 0) newErrors.funcoes = true;
    if (showOutraFuncao && !formData.outraFuncao) newErrors.outraFuncao = true;
    if (!formData.tempo) newErrors.tempo = true;
    if (!formData.ticketMedio) newErrors.ticketMedio = true;
    if (formData.telefone.replace(/\D/g, '').length !== 11) newErrors.telefone = true;
    if (!formData.custo ||(formData.custo === 'Outro' && (!formData.custoOutro || formData.custoOutro === 'R$ 0,00'))) 
      { newErrors.custoOutro = true;}

    if (Object.keys(newErrors).length > 0) {
      console.log('Campos com erro:', newErrors);
      setErrors(newErrors);
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

      if (!response.ok) throw new Error('Erro ao enviar o formulário');

      navigate('/result');
    } catch (error) {
      console.error(error);
      console.log(formData);
    }
  };

  const getInputClass = (field: string) =>
    `w-full p-3 rounded-full border ${
      errors[field] ? 'border-red-500 animate-shake' : 'border-green-500'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-300 text-white flex flex-col items-center justify-center p-4">

      <div className="md:w-1/2 max-w-lg">
        <h1 className="text-3xl font-bold leading-tight mb-4">
          <strong>Preencha o formulário em menos de 1 minuto</strong> e tenha acesso a um diagnóstico estratégico{' '}
          <span className="text-green-400">totalmente gratuito</span> e 100% personalizado para sua empresa.
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-black rounded-lg p-6 md:w-1/2 max-w-md w-full shadow-md space-y-4 mt-8 md:mt-0"
      >
        <h2 className="text-lg font-semibold text-center mb-2 text-gray-800">
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
          <label className="block font-medium">Qual o custo médio mensal de cada funcionário?</label>
          {['R$ 2.222,62', 'R$ 3.460,80', 'R$ 4.377,60', 'Outro'].map((opcao) => (
            <label key={opcao} className="flex items-center">
              <input
                type="radio"
                name="custo"
                value={opcao}
                checked={formData.custo === opcao}
                onChange={handleChange}
                className={`mr-2 ${errors.custo ? 'border-red-500 animate-shake' : ''}`}
              />
              {opcao === 'Outro' ? 'Outro:' : opcao}
            </label>
          ))}
          {formData.custo === 'Outro' && (
           <input
              type="text"
              name="custoOutro"
              placeholder="Digite o valor"
              className={`w-full p-3 rounded-full border ${
                errors.custoOutro ? 'border-red-500 animate-shake' : 'border-green-500'
              }`}
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
                className={`mr-2 ${errors.funcoes ? 'border-red-500 animate-shake' : ''}`}
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
              className={`mr-2 ${errors.funcoes ? 'border-red-500 animate-shake' : ''}`}
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
                className={`mr-2 ${errors.tempo ? 'border-red-500 animate-shake' : ''}`}
              />
              {op}
            </label>
          ))}
        </div>

        <div className="font-medium flex flex-col gap-2">
          <h1>Qual seu ticket médio por cliente?</h1>
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
            className={`w-full p-2 rounded border ${
              errors.telefone ? 'border-red-500 animate-shake' : 'border-gray-300'
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

        <p className="text-xs text-gray-600 text-center mt-2">
          Prometemos não usar suas informações para enviar SPAM. Os dados são tratados conforme a LGPD.
        </p>
      </form>
    </div>
  );
}