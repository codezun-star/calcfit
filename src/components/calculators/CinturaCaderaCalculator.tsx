import { useState } from 'react';
import { calcularCinturaCadera } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

type Sexo = 'hombre' | 'mujer';

export default function CinturaCaderaCalculator() {
  const [sexo, setSexo] = useState<Sexo>('hombre');
  const [cintura, setCintura] = useState('');
  const [cadera, setCadera] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularCinturaCadera> | null>(null);
  const [errors, setErrors] = useState<{ cintura?: string; cadera?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const cinturaCm = parseFloat(cintura);
    const caderaCm = parseFloat(cadera);
    if (!cintura || isNaN(cinturaCm) || cinturaCm < 40 || cinturaCm > 200) errs.cintura = 'Cintura entre 40 y 200 cm';
    if (!cadera  || isNaN(caderaCm)  || caderaCm  < 50 || caderaCm  > 200) errs.cadera  = 'Cadera entre 50 y 200 cm';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularCinturaCadera({ sexo, cinturaCm, caderaCm }));
  };

  const riesgoColor: Record<string, string> = { bajo: '#34D399', moderado: '#CAFF00', alto: '#F87171' };

  const selStyle: React.CSSProperties = {
    width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)',
    background: 'transparent', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none', cursor: 'pointer',
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Sexo biológico</p>
        <select value={sexo} onChange={e => setSexo(e.target.value as Sexo)} style={selStyle}>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        <Input label="Cintura" value={cintura} onChange={setCintura} suffix="cm" error={errors.cintura} />
        <Input label="Cadera"  value={cadera}  onChange={setCadera}  suffix="cm" error={errors.cadera} />
      </div>

      <Button onClick={calcular}>Calcular relación</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Relación cintura-cadera" value={result.ratio} unit="" interpretation={result.categoria} />
          <div style={{ padding: '12px 16px', background: riesgoColor[result.riesgo] + '22', borderLeft: `3px solid ${riesgoColor[result.riesgo]}`, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
            <strong>{result.categoria}</strong>
            {result.riesgo === 'bajo'     && ' — Distribución de grasa saludable según la OMS.'}
            {result.riesgo === 'moderado' && ' — Se recomienda reducir el perímetro de cintura con ejercicio y dieta.'}
            {result.riesgo === 'alto'     && ' — Riesgo cardiovascular y metabólico elevado. Consulte a su médico.'}
          </div>
          <ShareButtons text={`Mi relación cintura-cadera es ${result.ratio} (${result.categoria}). Lo calculé en CalcFit:`} url="https://www.calcfit.com/cintura-cadera" />
        </div>
      )}
    </div>
  );
}
