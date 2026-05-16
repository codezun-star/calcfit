import { useState } from 'react';
import { calcularTDEE, calcularDeficitCalorico, type ObjetivoDeficit } from '../../lib/calculators';
import { toKg, toCm } from '../../lib/units';
import Toggle from '../ui/Toggle';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import ShareButtons from '../ui/ShareButtons';

const ACTIVIDADES = [
  { key: 'sedentario',  label: 'Sedentario' },
  { key: 'ligero',      label: 'Ligero (1–3 días/sem)' },
  { key: 'moderado',    label: 'Moderado (3–5 días/sem)' },
  { key: 'activo',      label: 'Activo (6–7 días/sem)' },
  { key: 'muy_activo',  label: 'Muy activo (2× día)' },
] as const;

const OBJETIVOS: { key: ObjetivoDeficit; label: string }[] = [
  { key: '0.25', label: 'Perder 0.25 kg/semana (suave)' },
  { key: '0.5',  label: 'Perder 0.5 kg/semana (recomendado)' },
  { key: '0.75', label: 'Perder 0.75 kg/semana (moderado)' },
  { key: '1.0',  label: 'Perder 1 kg/semana (agresivo)' },
];

export default function DeficitCaloricoCalculator() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [sexo, setSexo] = useState<'hombre' | 'mujer'>('hombre');
  const [peso, setPeso] = useState('');
  const [pesoObj, setPesoObj] = useState('');
  const [altura, setAltura] = useState('');
  const [lb, setLb] = useState('');
  const [lbObj, setLbObj] = useState('');
  const [ft, setFt] = useState('');
  const [inches, setInches] = useState('');
  const [edad, setEdad] = useState('');
  const [actividad, setActividad] = useState<typeof ACTIVIDADES[number]['key']>('moderado');
  const [objetivo, setObjetivo] = useState<ObjetivoDeficit>('0.5');
  const [result, setResult] = useState<{ tdee: number; deficit: ReturnType<typeof calcularDeficitCalorico> } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calcular = () => {
    const errs: Record<string, string> = {};
    const pesoKg    = units === 'metric' ? parseFloat(peso)    : toKg(parseFloat(lb));
    const pesoObjKg = units === 'metric' ? parseFloat(pesoObj) : toKg(parseFloat(lbObj));
    const alturaCm  = units === 'metric' ? parseFloat(altura)  : toCm(parseFloat(ft), parseFloat(inches));
    const edadN     = parseInt(edad);
    if (isNaN(pesoKg)    || pesoKg < 20 || pesoKg > 300)       errs.peso    = 'Peso entre 20 y 300 kg';
    if (isNaN(pesoObjKg) || pesoObjKg < 20 || pesoObjKg > 300) errs.pesoObj = 'Peso objetivo entre 20 y 300 kg';
    if (isNaN(alturaCm)  || alturaCm < 100 || alturaCm > 250)  errs.altura  = 'Altura entre 100 y 250 cm';
    if (isNaN(edadN)     || edadN < 15 || edadN > 100)          errs.edad    = 'Edad entre 15 y 100 años';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const { tdee } = calcularTDEE({ pesoKg, alturaCm, edadAnios: edadN, sexo, actividad });
    setResult({ tdee, deficit: calcularDeficitCalorico(tdee, pesoKg, pesoObjKg, objetivo) });
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Toggle value={units} onChange={setUnits} />

      <div style={{ display: 'flex', gap: '8px' }}>
        {(['hombre', 'mujer'] as const).map(s => (
          <button key={s} onClick={() => setSexo(s)} style={{ flex: 1, padding: '10px', border: '1px solid', borderColor: sexo === s ? 'var(--ink)' : 'var(--border)', background: sexo === s ? 'var(--ink)' : 'transparent', color: sexo === s ? 'var(--acid)' : 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
            {s === 'hombre' ? 'Hombre' : 'Mujer'}
          </button>
        ))}
      </div>

      {units === 'metric' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '20px' }}>
          <Input label="Peso actual"    value={peso}    onChange={setPeso}    suffix="kg"   error={errors.peso} />
          <Input label="Peso objetivo"  value={pesoObj} onChange={setPesoObj} suffix="kg"   error={errors.pesoObj} />
          <Input label="Altura"         value={altura}  onChange={setAltura}  suffix="cm"   error={errors.altura} />
          <Input label="Edad"           value={edad}    onChange={setEdad}    suffix="años" error={errors.edad} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
          <Input label="Peso actual"   value={lb}     onChange={setLb}     suffix="lb"   error={errors.peso} />
          <Input label="Peso objetivo" value={lbObj}  onChange={setLbObj}  suffix="lb"   error={errors.pesoObj} />
          <Input label="Pies"          value={ft}     onChange={setFt}     suffix="pies" error={errors.altura} />
          <Input label="Pulgadas"      value={inches} onChange={setInches} suffix="pulg" />
          <Input label="Edad"          value={edad}   onChange={setEdad}   suffix="años" error={errors.edad} />
        </div>
      )}

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Nivel de actividad</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {ACTIVIDADES.map(a => (
            <button key={a.key} onClick={() => setActividad(a.key)} style={{ textAlign: 'left', padding: '10px 12px', border: '1px solid', borderColor: actividad === a.key ? 'var(--ink)' : 'var(--border)', background: actividad === a.key ? 'var(--ink)' : 'transparent', color: actividad === a.key ? 'var(--acid)' : 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer' }}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Ritmo de pérdida</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {OBJETIVOS.map(o => (
            <button key={o.key} onClick={() => setObjetivo(o.key)} style={{ textAlign: 'left', padding: '10px 12px', border: '1px solid', borderColor: objetivo === o.key ? 'var(--ink)' : 'var(--border)', background: objetivo === o.key ? 'var(--ink)' : 'transparent', color: objetivo === o.key ? 'var(--acid)' : 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer' }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={calcular}>Calcular déficit calórico</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ResultCard label="Calorías diarias objetivo" value={result.deficit.caloriasDiarias} unit="kcal/día" interpretation={result.deficit.esSeguaro ? 'Déficit seguro y sostenible' : 'Déficit alto — mínimo 1 200 kcal aplicado'} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { label: 'TDEE (mantener)',  val: result.tdee,                    suf: 'kcal/día' },
              { label: 'Déficit diario',   val: result.deficit.deficitDiario,   suf: 'kcal' },
              { label: 'Pérdida/semana',   val: result.deficit.perdidaSemanal,  suf: 'kg' },
              { label: 'Tiempo estimado',  val: result.deficit.tiempoMeses,     suf: 'meses' },
            ].map(({ label, val, suf }) => (
              <div key={label} style={{ background: 'var(--cream)', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)' }}>{val} <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)' }}>{suf}</span></div>
              </div>
            ))}
          </div>
          <ShareButtons text={`Mi objetivo: ${result.deficit.caloriasDiarias} kcal/día para alcanzar mi peso en ${result.deficit.tiempoMeses} meses. CalcFit:`} url="https://www.calcfit.com/deficit-calorico" />
        </div>
      )}
    </div>
  );
}
