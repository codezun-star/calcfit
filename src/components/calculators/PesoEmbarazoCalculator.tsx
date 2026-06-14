import { useState } from 'react';
import { calcularPesoEmbarazo } from '../../lib/calculators';
import { toKg, toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

export default function PesoEmbarazoCalculator() {
  const [units,       setUnits]       = useState<'metric' | 'imperial'>('metric');
  const [pesoPreKg,   setPesoPreKg]   = useState('');
  const [presoPreLb,  setPresoPreLb]  = useState('');
  const [alturaCm,    setAlturaCm]    = useState('');
  const [alturaFt,    setAlturaFt]    = useState('');
  const [alturaIn,    setAlturaIn]    = useState('');
  const [semana,      setSemana]      = useState('');
  const [pesoActual,  setPesoActual]  = useState('');
  const [pesoActLb,   setPesoActLb]   = useState('');
  const [result,      setResult]      = useState<ReturnType<typeof calcularPesoEmbarazo> | null>(null);
  const [errors,      setErrors]      = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const pesoKg = units === 'metric' ? parseFloat(pesoPreKg) : toKg(parseFloat(presoPreLb));
    const altCm  = units === 'metric' ? parseFloat(alturaCm)  : toCm(parseFloat(alturaFt), parseFloat(alturaIn));
    const sem    = parseFloat(semana);
    if (isNaN(pesoKg) || pesoKg < 30 || pesoKg > 200) errs.peso    = 'Peso entre 30 y 200 kg';
    if (isNaN(altCm)  || altCm < 120 || altCm > 220)  errs.altura  = 'Altura entre 120 y 220 cm';
    if (isNaN(sem)    || sem < 1     || sem > 42)      errs.semana  = 'Semana entre 1 y 42';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const pesoActKg = (() => {
      if (units === 'metric') {
        const v = parseFloat(pesoActual);
        return isNaN(v) ? undefined : v;
      }
      const v = parseFloat(pesoActLb);
      return isNaN(v) ? undefined : toKg(v);
    })();

    setResult(calcularPesoEmbarazo(pesoKg, altCm, sem, pesoActKg));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
        {units === 'metric' ? (
          <>
            <Input label="Peso pre-embarazo" value={pesoPreKg}  onChange={setPesoPreKg}  suffix="kg"  error={errors.peso} />
            <Input label="Altura"             value={alturaCm}   onChange={setAlturaCm}   suffix="cm"  error={errors.altura} />
          </>
        ) : (
          <>
            <Input label="Peso pre-embarazo" value={presoPreLb} onChange={setPresoPreLb} suffix="lb"  error={errors.peso} />
            <Input label="Altura (pies)"     value={alturaFt}   onChange={setAlturaFt}   suffix="pies" error={errors.altura} />
            <Input label="Pulgadas"          value={alturaIn}   onChange={setAlturaIn}   suffix="pulg" />
          </>
        )}
        <Input label="Semana de gestación" value={semana} onChange={setSemana} suffix="sem." error={errors.semana} />
        {units === 'metric'
          ? <Input label="Peso actual (opcional)" value={pesoActual} onChange={setPesoActual} suffix="kg" />
          : <Input label="Peso actual (opcional)" value={pesoActLb}  onChange={setPesoActLb}  suffix="lb" />
        }
      </div>

      <Button onClick={calcular}>Calcular ganancia recomendada</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ background: 'var(--ink)', padding: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>IMC pre-embarazo · {result.categoriaImc}</p>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'var(--acid)', lineHeight: 1 }}>{result.imc}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#999', marginTop: '4px' }}>kg/m²</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ganancia total</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.gananciaTotalMin}–{result.gananciaTotalMax} <span style={{ fontSize: '12px' }}>kg</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Ganancia semanal</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.gananciaSemanaMin}–{result.gananciaSemanaMax} <span style={{ fontSize: '12px' }}>kg/sem</span></div>
            </div>
            <div style={{ background: 'var(--cream)', padding: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Acumulado sem. {semana}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{result.gananciaAcumuladaMin}–{result.gananciaAcumuladaMax} <span style={{ fontSize: '12px' }}>kg</span></div>
            </div>
          </div>

          {result.dentroRango !== null && (
            <div style={{ background: 'var(--cream)', padding: '14px', borderTop: `3px solid ${result.dentroRango ? '#34D399' : '#F87171'}` }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: result.dentroRango ? '#34D399' : '#F87171', marginBottom: '4px' }}>
                {result.dentroRango ? 'Ganancia dentro del rango IOM' : 'Ganancia fuera del rango IOM'}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {result.dentroRango ? 'Tu progreso de peso actual está dentro de las guías.' : 'Consulta con tu médico o matrona sobre tu progreso de peso.'}
              </p>
            </div>
          )}

          <ShareButtons
            text={`Mi ganancia de peso recomendada en el embarazo es ${result.gananciaTotalMin}–${result.gananciaTotalMax} kg. Calculado con CalcFit:`}
            url="https://www.calcfit.com/peso-embarazo"
          />
        </div>
      )}
    </div>
  );
}
