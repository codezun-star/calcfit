import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { calcularEdadBiologica, type RespuestasEdadBiologica } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

type ActFisica = RespuestasEdadBiologica['actividadFisica'];
type Tabaco    = RespuestasEdadBiologica['tabaco'];
type Alcohol   = RespuestasEdadBiologica['alcohol'];
type Sueno     = RespuestasEdadBiologica['sueno'];
type Estres    = RespuestasEdadBiologica['estres'];
type Dieta     = RespuestasEdadBiologica['dieta'];
type IMCCat    = RespuestasEdadBiologica['imc'];

const PickerRow = ({ label, options, value, onChange }: {
  label: string;
  options: { val: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
      {label}
    </div>
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button key={opt.val} onClick={() => onChange(opt.val)} style={{
          padding: '6px 14px', border: '1px solid',
          borderColor: value === opt.val ? 'var(--ink)' : 'var(--border)',
          background: value === opt.val ? 'var(--ink)' : 'transparent',
          color: value === opt.val ? 'var(--acid)' : 'var(--muted)',
          fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const,
          letterSpacing: '1px', cursor: 'pointer',
        }}>
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

export default function EdadBiologicaCalculator() {
  const [edad, setEdad]             = useState('');
  const [actFisica, setActFisica]   = useState<ActFisica>('moderado');
  const [tabaco, setTabaco]         = useState<Tabaco>('nunca');
  const [alcohol, setAlcohol]       = useState<Alcohol>('moderado');
  const [sueno, setSueno]           = useState<Sueno>('entre6_8');
  const [estres, setEstres]         = useState<Estres>('moderado');
  const [dieta, setDieta]           = useState<Dieta>('buena');
  const [imc, setIMC]               = useState<IMCCat>('normal');
  const [checkups, setCheckups]     = useState(true);
  const [resultado, setResultado]   = useState<ReturnType<typeof calcularEdadBiologica> | null>(null);
  const [error, setError]           = useState('');

  function calcular() {
    const e = parseInt(edad);
    if (!edad || isNaN(e) || e < 18 || e > 100) { setError('Introduce tu edad cronológica (18–100 años)'); return; }
    setError('');
    setResultado(calcularEdadBiologica(e, {
      actividadFisica: actFisica, tabaco, alcohol, sueno, estres, dieta, imc, checkups,
    }));
  }

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ maxWidth: '200px' }}>
        <Input label="Edad cronológica" value={edad} onChange={setEdad} suffix="años" type="number" />
      </div>

      <PickerRow label="Actividad física" value={actFisica} onChange={v => setActFisica(v as ActFisica)} options={[
        { val: 'sedentario',  label: 'Sedentario' },
        { val: 'moderado',    label: 'Moderado' },
        { val: 'activo',      label: 'Activo' },
        { val: 'muy_activo',  label: 'Muy activo' },
      ]} />

      <PickerRow label="Tabaco" value={tabaco} onChange={v => setTabaco(v as Tabaco)} options={[
        { val: 'nunca',      label: 'Nunca' },
        { val: 'exfumador',  label: 'Ex fumador' },
        { val: 'fumador',    label: 'Fumador activo' },
      ]} />

      <PickerRow label="Alcohol" value={alcohol} onChange={v => setAlcohol(v as Alcohol)} options={[
        { val: 'nunca',    label: 'No consumo' },
        { val: 'moderado', label: 'Moderado' },
        { val: 'exceso',   label: 'Exceso' },
      ]} />

      <PickerRow label="Sueño por noche" value={sueno} onChange={v => setSueno(v as Sueno)} options={[
        { val: 'menos6',   label: '<6 horas' },
        { val: 'entre6_8', label: '6–8 horas' },
        { val: 'mas8',     label: '>8 horas' },
      ]} />

      <PickerRow label="Nivel de estrés" value={estres} onChange={v => setEstres(v as Estres)} options={[
        { val: 'bajo',     label: 'Bajo' },
        { val: 'moderado', label: 'Moderado' },
        { val: 'alto',     label: 'Alto' },
        { val: 'muy_alto', label: 'Muy alto' },
      ]} />

      <PickerRow label="Calidad de dieta" value={dieta} onChange={v => setDieta(v as Dieta)} options={[
        { val: 'mala',      label: 'Mala' },
        { val: 'regular',   label: 'Regular' },
        { val: 'buena',     label: 'Buena' },
        { val: 'excelente', label: 'Excelente' },
      ]} />

      <PickerRow label="IMC" value={imc} onChange={v => setIMC(v as IMCCat)} options={[
        { val: 'bajo',       label: 'Bajo peso' },
        { val: 'normal',     label: 'Normal' },
        { val: 'sobrepeso',  label: 'Sobrepeso' },
        { val: 'obesidad',   label: 'Obesidad' },
      ]} />

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Chequeos médicos regulares
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {([true, false] as const).map(v => (
            <button key={String(v)} onClick={() => setCheckups(v)} style={{
              padding: '6px 14px', border: '1px solid',
              borderColor: checkups === v ? 'var(--ink)' : 'var(--border)',
              background: checkups === v ? 'var(--ink)' : 'transparent',
              color: checkups === v ? 'var(--acid)' : 'var(--muted)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase',
              letterSpacing: '1px', cursor: 'pointer',
            }}>
              {v ? 'Sí, al día' : 'No / Irregular'}
            </button>
          ))}
        </div>
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

      <Button onClick={calcular}>Calcular edad biológica</Button>

      {resultado && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Edad biológica</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.edadBiologica}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>años</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Diferencia</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', lineHeight: 1, color: resultado.color }}>
                {resultado.diferencia > 0 ? '+' : ''}{resultado.diferencia}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>años vs edad real</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Estado</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', lineHeight: 1.3, color: resultado.color }}>{resultado.categoria}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', marginBottom: '1px' }}>
            {resultado.factoresPositivos.length > 0 && (
              <div style={{ background: '#f0fdf4', border: '1px solid var(--border)', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#166534', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Factores positivos
                </div>
                {resultado.factoresPositivos.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ color: '#34D399', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '12px', color: '#166534' }}>{f}</span>
                  </div>
                ))}
              </div>
            )}
            {resultado.factoresNegativos.length > 0 && (
              <div style={{ background: '#fff5f5', border: '1px solid var(--border)', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Factores negativos
                </div>
                {resultado.factoresNegativos.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ color: '#F87171', flexShrink: 0 }}>×</span>
                    <span style={{ fontSize: '12px', color: '#991b1b' }}>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{resultado.recomendacion}</p>
          </div>
          <ShareButtons
            text={`Mi edad biológica es ${resultado.edadBiologica} años (${resultado.diferencia > 0 ? '+' : ''}${resultado.diferencia} vs mi edad real). Calcula la tuya en CalcFit:`}
            url="https://www.calcfit.com/edad-biologica"
          />
        </div>
      )}
    </div>
  );
}
