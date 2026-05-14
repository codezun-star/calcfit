import { useState } from 'react';
import { calcularAlcoholemia } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

type Sexo = 'hombre' | 'mujer';

export default function AlcoholemiaCalculator() {
  const [sexo, setSexo] = useState<Sexo>('hombre');
  const [peso, setPeso] = useState('');
  const [cerveza, setCerveza] = useState('0');
  const [vino, setVino] = useState('0');
  const [copa, setCopa] = useState('0');
  const [horas, setHoras] = useState('0');
  const [result, setResult] = useState<ReturnType<typeof calcularAlcoholemia> | null>(null);
  const [errors, setErrors] = useState<{ peso?: string }>({});

  const calcular = () => {
    const errs: typeof errors = {};
    const pesoKg = parseFloat(peso);
    if (!peso || isNaN(pesoKg) || pesoKg < 20 || pesoKg > 300) errs.peso = 'Peso entre 20 y 300 kg';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularAlcoholemia({
      pesoKg,
      sexo,
      bebidasCerveza:      parseFloat(cerveza) || 0,
      bebidasVino:         parseFloat(vino)    || 0,
      bebidasCopa:         parseFloat(copa)    || 0,
      horasTranscurridas:  parseFloat(horas)   || 0,
    }));
  };

  const bacColor = result
    ? result.bac === 0 ? '#34D399'
    : result.bac < 0.5 ? '#CAFF00'
    : result.bac < 1.5 ? '#FB923C'
    : '#F87171'
    : '#34D399';

  const selStyle: React.CSSProperties = {
    width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid var(--border)',
    background: 'transparent', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none', cursor: 'pointer',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: '#F8711122', borderLeft: '3px solid #F87171', fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
        <strong>Aviso:</strong> Esta calculadora es orientativa. No conduzca si ha consumido alcohol. El alcohol afecta a cada persona de forma diferente.
      </div>

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>Sexo biológico</p>
        <select value={sexo} onChange={e => setSexo(e.target.value as Sexo)} style={selStyle}>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
        </select>
      </div>

      <Input label="Peso" value={peso} onChange={setPeso} suffix="kg" error={errors.peso} />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', marginBottom: '-12px' }}>Bebidas consumidas</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <Input label="Cervezas (330ml)"  value={cerveza} onChange={setCerveza} suffix="cant." />
        <Input label="Copas vino (150ml)" value={vino}   onChange={setVino}   suffix="cant." />
        <Input label="Shots/tragos (50ml)"   value={copa}    onChange={setCopa}    suffix="cant." />
      </div>

      <Input label="Horas transcurridas desde la primera bebida" value={horas} onChange={setHoras} suffix="h" />

      <Button onClick={calcular}>Calcular alcoholemia</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Tasa de alcoholemia" value={result.bac} unit="g/L" interpretation={result.estado} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>¿Puede conducir?</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: result.aptoConducir ? '#34D399' : '#F87171' }}>
                {result.aptoConducir ? 'Dentro del límite legal (< 0.5 g/L)' : 'NO — Supera el límite legal'}
              </div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Hasta alcohol en cero</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{result.horasHastaCero} <span style={{ fontSize: '13px', fontFamily: 'var(--font-body)' }}>horas</span></div>
            </div>
          </div>
          <div style={{ padding: '12px 16px', background: bacColor + '22', borderLeft: `3px solid ${bacColor}`, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>
            <strong>{result.estado}</strong> — El hígado elimina aproximadamente 0.15 g/L de alcohol por hora.
          </div>
          <ShareButtons text={`Calculé mi tasa de alcoholemia con CalcFit. Herramienta de concienciación:`} url="https://www.calcfit.com/alcoholemia" />
        </div>
      )}
    </div>
  );
}
