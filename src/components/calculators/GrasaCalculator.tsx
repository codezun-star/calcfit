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

  const calcular = () => {
    const params = {
      sexo,
      alturaCm:  parseFloat(altura),
      cuelloCm:  parseFloat(cuello),
      cinturaCm: parseFloat(cintura),
      caderaCm:  sexo === 'mujer' ? parseFloat(cadera) : undefined,
    };
    if (Object.values(params).some((v) => v !== undefined && isNaN(v as number))) return;
    const res = calcularGrasaCorporal(params);
    setResult(res);
    addEntry(res.porcentaje);
  };

  const btnBase: React.CSSProperties = { padding: '8px 14px', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)' };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--ink)', color: 'var(--acid)', border: '1px solid var(--ink)' };

  return (
    <div style={{ padding: '32px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Sexo</p>
        <div style={{ display: 'flex', gap: '1px' }}>
          <button style={sexo === 'hombre' ? btnActive : btnBase} onClick={() => setSexo('hombre')}>Hombre</button>
          <button style={sexo === 'mujer'  ? btnActive : btnBase} onClick={() => setSexo('mujer')}>Mujer</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: sexo === 'mujer' ? '1fr 1fr' : '1fr 1fr 1fr', gap: '20px' }}>
        <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" />
        <Input label="Cuello" value={cuello} onChange={setCuello} suffix="cm" />
        <Input label="Cintura" value={cintura} onChange={setCintura} suffix="cm" />
        {sexo === 'mujer' && <Input label="Cadera" value={cadera} onChange={setCadera} suffix="cm" />}
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
