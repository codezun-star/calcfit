import { useState } from 'react';
import { calcularSindromeMetabolico } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

type Sexo = 'hombre' | 'mujer';

const pillStyle = (active: boolean) => ({
  padding: '8px 14px', fontSize: '12px', fontFamily: 'var(--font-mono)',
  border: '1px solid', borderRadius: '2px', cursor: 'pointer',
  background: active ? 'var(--ink)' : 'transparent',
  color:      active ? 'var(--acid)' : 'var(--muted)',
  borderColor: active ? 'var(--ink)' : 'var(--border)',
});

export default function SindromeMetabolicoCalculator() {
  const [sexo, setSexo]               = useState<Sexo>('hombre');
  const [cintura, setCintura]         = useState('');
  const [trigliceridos, setTrigli]    = useState('');
  const [hdl, setHdl]                 = useState('');
  const [sistolica, setSistolica]     = useState('');
  const [diastolica, setDiastolica]   = useState('');
  const [glucosa, setGlucosa]         = useState('');
  const [medicTA, setMedicTA]         = useState(false);
  const [medicGlucosa, setMedicGlucosa] = useState(false);
  const [result, setResult]           = useState<ReturnType<typeof calcularSindromeMetabolico> | null>(null);
  const [errors, setErrors]           = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const c  = parseFloat(cintura);
    const tg = parseFloat(trigliceridos);
    const h  = parseFloat(hdl);
    const s  = parseFloat(sistolica);
    const d  = parseFloat(diastolica);
    const g  = parseFloat(glucosa);

    if (isNaN(c) || c < 40 || c > 200)   errs.cintura      = 'Entre 40 y 200 cm';
    if (isNaN(tg) || tg < 10 || tg > 2000) errs.trigli      = 'Entre 10 y 2000 mg/dL';
    if (isNaN(h) || h < 10 || h > 200)   errs.hdl          = 'Entre 10 y 200 mg/dL';
    if (isNaN(s) || s < 70 || s > 250)   errs.sistolica    = 'Entre 70 y 250 mmHg';
    if (isNaN(d) || d < 40 || d > 150)   errs.diastolica   = 'Entre 40 y 150 mmHg';
    if (isNaN(g) || g < 50 || g > 600)   errs.glucosa      = 'Entre 50 y 600 mg/dL';

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setResult(calcularSindromeMetabolico(c, sexo, tg, h, s, d, g, medicTA, medicGlucosa));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Diagnóstico según los criterios IDF 2006. Requiere los valores de tu última analítica de sangre y mediciones corporales.
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sexo biológico</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['hombre', 'mujer'] as Sexo[]).map(s => (
            <button key={s} onClick={() => setSexo(s)} style={pillStyle(sexo === s)}>
              {s === 'hombre' ? 'Hombre' : 'Mujer'}
            </button>
          ))}
        </div>
      </div>

      <Input label="Perímetro de cintura" value={cintura} onChange={setCintura} suffix="cm" error={errors.cintura} />
      <Input label="Triglicéridos" value={trigliceridos} onChange={setTrigli} suffix="mg/dL" error={errors.trigli} />
      <Input label="HDL colesterol" value={hdl} onChange={setHdl} suffix="mg/dL" error={errors.hdl} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Input label="Presión sistólica" value={sistolica} onChange={setSistolica} suffix="mmHg" error={errors.sistolica} />
        <Input label="Presión diastólica" value={diastolica} onChange={setDiastolica} suffix="mmHg" error={errors.diastolica} />
      </div>

      <Input label="Glucosa en ayunas" value={glucosa} onChange={setGlucosa} suffix="mg/dL" error={errors.glucosa} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>¿Tomas medicación para la tensión arterial?</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setMedicTA(true)}  style={pillStyle(medicTA)}>Sí</button>
            <button onClick={() => setMedicTA(false)} style={pillStyle(!medicTA)}>No</button>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>¿Tomas medicación para la glucosa/diabetes?</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setMedicGlucosa(true)}  style={pillStyle(medicGlucosa)}>Sí</button>
            <button onClick={() => setMedicGlucosa(false)} style={pillStyle(!medicGlucosa)}>No</button>
          </div>
        </div>
      </div>

      <Button onClick={calcular}>Evaluar criterios</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Criterios cumplidos</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{result.criteriosCumplidos}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>de 5</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Diagnóstico</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: result.color, lineHeight: 1.1 }}>
                {result.tiene ? 'Síndrome metabólico' : 'Sin síndrome metabólico'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {result.criterios.map((c, i) => (
              <div key={c.nombre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: c.cumple ? 'var(--ink)' : 'var(--cream)', borderLeft: `3px solid ${c.cumple ? result.color : 'var(--border)'}` }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: c.cumple ? '#fff' : 'var(--ink)' }}>
                    {i === 0 && '⬤ '}{c.nombre}
                  </div>
                  <div style={{ fontSize: '11px', color: c.cumple ? '#aaa' : 'var(--muted)' }}>Umbral: {c.umbral}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: c.cumple ? 'var(--acid)' : 'var(--muted)' }}>{c.valor}</div>
                  <div style={{ fontSize: '11px', color: c.cumple ? result.color : '#34D399', fontWeight: 600 }}>{c.cumple ? 'Cumple' : 'No cumple'}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.recomendacion}
          </div>

          <ShareButtons
            text={`He evaluado mis criterios de síndrome metabólico (IDF 2006): ${result.criteriosCumplidos}/5 criterios. Evalúa los tuyos en CalcFit:`}
            url="https://www.calcfit.com/sindrome-metabolico"
          />
        </div>
      )}
    </div>
  );
}
