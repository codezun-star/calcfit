import { useState } from 'react';
import { verificarCompatibilidadLactancia } from '../../lib/calculators';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

const SUGERENCIAS = [
  'paracetamol', 'ibuprofeno', 'amoxicilina', 'omeprazol', 'loratadina',
  'sertralina', 'metformina', 'levotiroxina', 'azitromicina', 'prednisona',
  'warfarina', 'enalapril', 'cetirizina', 'metronidazol', 'codeina',
];

export default function CompatibilidadLactanciaCalculator() {
  const [medicamento, setMedicamento] = useState('');
  const [result, setResult] = useState<ReturnType<typeof verificarCompatibilidadLactancia> | null>(null);

  const buscar = (nombre?: string) => {
    const nombre_ = nombre ?? medicamento;
    if (!nombre_.trim()) return;
    setResult(verificarCompatibilidadLactancia(nombre_));
    if (nombre) setMedicamento(nombre);
  };

  const nivelLabel: Record<string, string> = {
    L1: 'L1 — Compatible', L2: 'L2 — Compatible con precaución',
    L3: 'L3 — Precaución moderada', L4: 'L4 — Evitar si es posible', L5: 'L5 — CONTRAINDICADO',
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
          Nombre del medicamento
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={medicamento}
            onChange={e => setMedicamento(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscar()}
            placeholder="ej. ibuprofeno, amoxicilina..."
            style={{
              flex: 1, padding: '10px 12px', border: 'none', borderBottom: '2px solid var(--border)',
              background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <Button onClick={() => buscar()}>Consultar compatibilidad</Button>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Medicamentos comunes</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {SUGERENCIAS.map(s => (
            <button
              key={s}
              onClick={() => buscar(s)}
              style={{
                padding: '4px 10px', border: '1px solid var(--border)', cursor: 'pointer',
                background: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: '11px',
                color: 'var(--muted)',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--ink)', padding: '20px 24px', borderTop: `4px solid ${result.color}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
              {result.encontrado ? result.medicamento.toUpperCase() : 'Medicamento no encontrado'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: result.color, lineHeight: 1.3 }}>
              {result.nivel ? nivelLabel[result.nivel] : result.nivelTexto}
            </div>
          </div>

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Descripción</div>
            <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6 }}>{result.descripcion}</p>
          </div>

          <div style={{ background: 'var(--cream)', padding: '14px 16px', borderLeft: `3px solid ${result.color}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Recomendación</div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.6 }}>{result.recomendacion}</p>
          </div>

          {result.alternativa && (
            <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Alternativa más segura</div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#34D399' }}>{result.alternativa}</p>
            </div>
          )}

          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', padding: '12px 16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
              <strong>Nota:</strong> Esta información es orientativa basada en la escala de Hale (LactMed). Consulta siempre con tu médico o farmacéutico antes de tomar cualquier medicamento durante la lactancia.
            </p>
          </div>

          <ShareButtons
            text={`${result.medicamento}: ${result.nivelTexto}. Compatibilidad con lactancia en CalcFit:`}
            url="https://www.calcfit.com/compatibilidad-lactancia"
          />
        </div>
      )}
    </div>
  );
}
