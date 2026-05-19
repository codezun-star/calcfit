import { useState } from 'react';
import { calcularGrasaCorporal } from '../../lib/calculators';
import { useHistory } from '../../lib/useHistory';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import HistoryTable from '../ui/HistoryTable';
import ShareButtons from '../ui/ShareButtons';

type Sexo = 'hombre' | 'mujer';

export default function GrasaCalculator() {
  const [sexo, setSexo] = useState<Sexo>('hombre');
  const [altura, setAltura] = useState('');
  const [cuello, setCuello] = useState('');
  const [cintura, setCintura] = useState('');
  const [cadera, setCadera] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcularGrasaCorporal> | null>(null);
  const { addEntry } = useHistory('grasa-history');
  const [errors, setErrors] = useState<{ altura?: string; cuello?: string; cintura?: string; cadera?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const alturaN  = parseFloat(altura);
    const cuelloN  = parseFloat(cuello);
    const cinturaN = parseFloat(cintura);
    const caderaN  = parseFloat(cadera);
    if (isNaN(alturaN)  || alturaN < 130  || alturaN > 230)  errs.altura  = 'Altura entre 130 y 230 cm';
    if (isNaN(cuelloN)  || cuelloN < 20   || cuelloN > 80)   errs.cuello  = 'Cuello entre 20 y 80 cm';
    if (isNaN(cinturaN) || cinturaN < 50  || cinturaN > 200) errs.cintura = 'Cintura entre 50 y 200 cm';
    if (sexo === 'mujer' && (isNaN(caderaN) || caderaN < 60 || caderaN > 200)) errs.cadera = 'Cadera entre 60 y 200 cm';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const res = calcularGrasaCorporal({
      sexo,
      alturaCm:  alturaN,
      cuelloCm:  cuelloN,
      cinturaCm: cinturaN,
      caderaCm:  sexo === 'mujer' ? caderaN : undefined,
    });
    setResult(res);
    addEntry(res.porcentaje);
  };

  const btnBase: React.CSSProperties = { padding: '8px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)' };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--ink)', color: 'var(--acid)', border: '1px solid var(--ink)' };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Sexo</p>
        <div style={{ display: 'flex', gap: '1px' }}>
          <button style={sexo === 'hombre' ? btnActive : btnBase} onClick={() => setSexo('hombre')}>Hombre</button>
          <button style={sexo === 'mujer'  ? btnActive : btnBase} onClick={() => setSexo('mujer')}>Mujer</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: sexo === 'mujer' ? 'repeat(auto-fit, minmax(130px, 1fr))' : 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
        <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
        <Input label="Cuello" value={cuello} onChange={setCuello} suffix="cm" error={errors.cuello} />
        <Input label="Cintura" value={cintura} onChange={setCintura} suffix="cm" error={errors.cintura} />
        {sexo === 'mujer' && <Input label="Cadera" value={cadera} onChange={setCadera} suffix="cm" error={errors.cadera} />}
      </div>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', lineHeight: 1.5 }}>
        Mide el cuello en su punto más estrecho. La cintura a nivel del ombligo.{sexo === 'mujer' ? ' La cadera en su punto más ancho.' : ''}
      </p>

      <Button onClick={calcular}>Calcular grasa corporal</Button>

      {result && (
        <>
          <ResultCard label="Grasa corporal" value={result.porcentaje} unit="%" interpretation={result.categoria} />
          <ShareButtons text={`Mi % de grasa corporal es ${result.porcentaje}% (${result.categoria}).`} url="https://www.calcfit.com/grasa-corporal" />
          <HistoryTable storageKey="grasa-history" unit="%" />
        </>
      )}
    </div>
  );
}
