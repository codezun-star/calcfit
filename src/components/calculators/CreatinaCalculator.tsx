import { useState } from 'react';
import { calcularCreatina, type ProtocoloCreatina } from '../../lib/calculators';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';

const PROTOCOLOS: { key: ProtocoloCreatina; label: string; desc: string }[] = [
  { key: 'carga',   label: 'Protocolo de carga',  desc: 'Saturación rápida en 5–7 días. Ideal si quieres resultados rápidos.' },
  { key: 'directo', label: 'Protocolo directo',   desc: 'Dosis fija de 5 g/día. Saturación en ~28 días. Más cómodo y económico.' },
];

export default function CreatinaCalculator() {
  const [protocolo, setProtocolo] = useState<ProtocoloCreatina>('directo');
  const [peso, setPeso]           = useState('');
  const [result, setResult]       = useState<ReturnType<typeof calcularCreatina> | null>(null);
  const [error, setError]         = useState('');

  const calcular = () => {
    const p = parseFloat(peso);
    if (isNaN(p) || p < 30 || p > 300) {
      setError('Introduce un peso entre 30 y 300 kg');
      return;
    }
    setError('');
    setResult(calcularCreatina(p, protocolo));
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '12px 16px', background: 'var(--cream)', borderLeft: '3px solid var(--border)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
        La creatina monohidrato es el suplemento más estudiado y seguro en deportes de fuerza. Calcula tu dosis personalizada según tu peso corporal.
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Protocolo</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {PROTOCOLOS.map(p => (
            <button
              key={p.key}
              onClick={() => setProtocolo(p.key)}
              style={{
                textAlign: 'left', padding: '12px 14px', border: '1px solid', cursor: 'pointer',
                borderColor: protocolo === p.key ? 'var(--ink)' : 'var(--border)',
                background:  protocolo === p.key ? 'var(--ink)' : 'transparent',
              }}
            >
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: protocolo === p.key ? 'var(--acid)' : 'var(--ink)', marginBottom: '2px' }}>{p.label}</div>
              <div style={{ fontSize: '12px', color: protocolo === p.key ? '#aaa' : 'var(--muted)' }}>{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <Input label="Peso corporal" value={peso} onChange={setPeso} suffix="kg" error={error} />

      <Button onClick={calcular}>Calcular dosis</Button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {result.faseCarga && (
            <div style={{ background: 'var(--ink)', padding: '20px 24px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Fase de carga (5 días)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--acid)', lineHeight: 1 }}>{result.faseCarga.dosisGDia}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>g/día total</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: '#ccc', lineHeight: 1 }}>{result.faseCarga.dosisPorToma}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>g × {result.faseCarga.tomas} tomas</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: '#ccc', lineHeight: 1 }}>{result.pesoCreatinaTotal}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>g totales carga</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ background: 'var(--ink)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              {result.faseCarga ? 'Mantenimiento (indefinido)' : 'Dosis diaria'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: 'var(--acid)', lineHeight: 1 }}>{result.mantenimiento.dosisGDia}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>g/día</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: '#ccc', lineHeight: 1 }}>{result.diasSaturacion}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#aaa' }}>días para saturar</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '14px 16px', background: '#CAFF0015', borderLeft: '3px solid var(--acid)', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
            {result.recomendacion}
          </div>

          <ShareButtons
            text={`Mi dosis de creatina es ${result.mantenimiento.dosisGDia} g/día de mantenimiento. Calculada con CalcFit:`}
            url="https://www.calcfit.com/creatina"
          />
        </div>
      )}
    </div>
  );
}
