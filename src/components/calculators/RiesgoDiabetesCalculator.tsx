import { useState } from 'react';
import { calcularFINDRISC, type RespuestasFINDRISC } from '../../lib/calculators';
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

export default function RiesgoDiabetesCalculator() {
  const [sexo, setSexo]           = useState<Sexo>('hombre');
  const [resp, setResp]           = useState<RespuestasFINDRISC>({
    edad:             'menos45',
    imc:              'menos25',
    cintura:          'normal',
    actividadFisica:  true,
    frutasVerduras:   true,
    medicacionTA:     false,
    glucosaAlta:      false,
    familiarDiabetes: 'no',
  });
  const [result, setResult] = useState<ReturnType<typeof calcularFINDRISC> | null>(null);

  const set = <K extends keyof RespuestasFINDRISC>(key: K, val: RespuestasFINDRISC[K]) =>
    setResp(r => ({ ...r, [key]: val }));

  const calcular = () => setResult(calcularFINDRISC(resp, sexo));

  const cinturaLabel = sexo === 'hombre'
    ? { normal: '< 94 cm', elevada: '94–102 cm', muy_elevada: '> 102 cm' }
    : { normal: '< 80 cm', elevada: '80–88 cm', muy_elevada: '> 88 cm' };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        El FINDRISC es el cuestionario validado por la OMS para estimar el riesgo de desarrollar diabetes tipo 2 en los próximos 10 años. No requiere análisis de sangre.
      </div>

      {/* Sexo */}
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

      {/* Edad */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Edad</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {([['menos45', '< 45 años'], ['45a54', '45–54 años'], ['55a64', '55–64 años'], ['mas65', '≥ 65 años']] as [RespuestasFINDRISC['edad'], string][]).map(([val, label]) => (
            <button key={val} onClick={() => set('edad', val)} style={pillStyle(resp.edad === val)}>{label}</button>
          ))}
        </div>
      </div>

      {/* IMC */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Índice de Masa Corporal (IMC)</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {([['menos25', '< 25 (Normal)'], ['25a30', '25–30 (Sobrepeso)'], ['mas30', '> 30 (Obesidad)']] as [RespuestasFINDRISC['imc'], string][]).map(([val, label]) => (
            <button key={val} onClick={() => set('imc', val)} style={pillStyle(resp.imc === val)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Cintura */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Perímetro de cintura</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['normal', 'elevada', 'muy_elevada'] as RespuestasFINDRISC['cintura'][]).map(val => (
            <button key={val} onClick={() => set('cintura', val)} style={pillStyle(resp.cintura === val)}>
              {cinturaLabel[val]}
            </button>
          ))}
        </div>
      </div>

      {/* Actividad física */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Actividad física</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>¿Realizas al menos 30 min de actividad moderada la mayoría de días?</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => set('actividadFisica', true)}  style={pillStyle(resp.actividadFisica)}>Sí</button>
          <button onClick={() => set('actividadFisica', false)} style={pillStyle(!resp.actividadFisica)}>No</button>
        </div>
      </div>

      {/* Frutas y verduras */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Frutas y verduras</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>¿Comes frutas o verduras todos los días?</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => set('frutasVerduras', true)}  style={pillStyle(resp.frutasVerduras)}>Sí</button>
          <button onClick={() => set('frutasVerduras', false)} style={pillStyle(!resp.frutasVerduras)}>No</button>
        </div>
      </div>

      {/* Medicación TA */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Medicación para hipertensión</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>¿Tomas medicación para la tensión arterial?</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => set('medicacionTA', true)}  style={pillStyle(resp.medicacionTA)}>Sí</button>
          <button onClick={() => set('medicacionTA', false)} style={pillStyle(!resp.medicacionTA)}>No</button>
        </div>
      </div>

      {/* Glucosa alta */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Glucosa alta previa</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>¿Te han detectado glucosa alta en alguna revisión (aunque sea sin diagnóstico)?</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => set('glucosaAlta', true)}  style={pillStyle(resp.glucosaAlta)}>Sí</button>
          <button onClick={() => set('glucosaAlta', false)} style={pillStyle(!resp.glucosaAlta)}>No</button>
        </div>
      </div>

      {/* Antecedentes familiares */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Antecedentes familiares de diabetes</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {([['no', 'Ninguno'], ['segundo_grado', 'Abuelo/tío/primo'], ['primer_grado', 'Padre/madre/hermano/hijo']] as [RespuestasFINDRISC['familiarDiabetes'], string][]).map(([val, label]) => (
            <button key={val} onClick={() => set('familiarDiabetes', val)} style={pillStyle(resp.familiarDiabetes === val)}>{label}</button>
          ))}
        </div>
      </div>

      <Button onClick={calcular}>Evaluar riesgo</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Puntuación FINDRISC</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: 'var(--acid)', lineHeight: 1 }}>{result.puntuacion}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>puntos / 26</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>Riesgo a 10 años</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: result.color, lineHeight: 1.1 }}>{result.categoria}</div>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>{result.probabilidad}</div>
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: result.color + '22', borderLeft: `3px solid ${result.color}`, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.recomendacion}
          </div>

          <ShareButtons
            text={`Mi puntuación FINDRISC es ${result.puntuacion} (riesgo ${result.categoria.toLowerCase()} de diabetes tipo 2). Evalúa el tuyo en CalcFit:`}
            url="https://www.calcfit.com/riesgo-diabetes"
          />
        </div>
      )}
    </div>
  );
}
