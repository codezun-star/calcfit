import { useState } from 'react';
import { calcularGananciaPesoEmbarazo } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function AumentoPesoEmbarazoCalculator() {
  const [pesoInicial, setPesoInicial] = useState('');
  const [altura, setAltura] = useState('');
  const [pesoActual, setPesoActual] = useState('');
  const [semanas, setSemanas] = useState('');
  const [gemelar, setGemelar] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof calcularGananciaPesoEmbarazo> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const pi = parseFloat(pesoInicial);
    const h  = parseFloat(altura);
    const pa = parseFloat(pesoActual);
    const s  = parseInt(semanas, 10);
    if (isNaN(pi) || pi < 30 || pi > 200) errs.pesoInicial = 'Peso entre 30 y 200 kg';
    if (isNaN(h)  || h < 120 || h > 220)  errs.altura = 'Altura entre 120 y 220 cm';
    if (isNaN(pa) || pa < 30 || pa > 220)  errs.pesoActual = 'Peso entre 30 y 220 kg';
    if (isNaN(s)  || s < 1   || s > 42)   errs.semanas = 'Semanas entre 1 y 42';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setResult(calcularGananciaPesoEmbarazo(pi, h, pa, s, gemelar));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
        <Input label="Peso pre-embarazo" value={pesoInicial} onChange={setPesoInicial} suffix="kg" error={errors.pesoInicial} />
        <Input label="Altura" value={altura} onChange={setAltura} suffix="cm" error={errors.altura} />
        <Input label="Peso actual" value={pesoActual} onChange={setPesoActual} suffix="kg" error={errors.pesoActual} />
        <Input label="Semana gestacional" value={semanas} onChange={setSemanas} suffix="sem." error={errors.semanas} />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink)' }}>
        <input type="checkbox" checked={gemelar} onChange={e => setGemelar(e.target.checked)} style={{ width: '16px', height: '16px' }} />
        Embarazo gemelar (gemelos)
      </label>

      <Button onClick={calcular}>Calcular ganancia recomendada</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>IMC pre-embarazo · {result.categoriaIMC}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'var(--acid)', lineHeight: 1 }}>{result.imcPreEmbarazo}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa', marginTop: '4px' }}>kg/m²</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Ganancia total recomendada</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.gananciaMinKg}–{result.gananciaMaxKg} <span style={{ fontSize: '12px' }}>kg</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Ganancia actual</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.gananciaActualKg} <span style={{ fontSize: '12px' }}>kg</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Esperada en sem. {semanas}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.gananciaEsperadaKg} <span style={{ fontSize: '12px' }}>kg</span></div>
            </div>
          </div>

          <div style={{ background: 'var(--cream)', padding: '14px', borderTop: `3px solid ${result.color}` }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: result.color, marginBottom: '4px' }}>{result.estado}</p>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{result.recomendacion}</p>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Ganancia esperada por trimestre (IOM 2009)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
              {result.porTrimestre.map(t => (
                <div key={t.trimestre} style={{ background: 'var(--cream)', padding: '12px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Trimestre {t.trimestre}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)' }}>{t.gananciaKg}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{t.ritmoSem}</div>
                </div>
              ))}
            </div>
          </div>

          <ShareButtons
            text={`Mi ganancia de peso recomendada en el embarazo es ${result.gananciaMinKg}–${result.gananciaMaxKg} kg. Calculado en CalcFit:`}
            url="https://www.calcfit.com/aumento-peso-embarazo"
          />
        </div>
      )}
    </div>
  );
}
