import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { calcularFTP, type ProtocoloFTP } from '../../lib/calculators';

export default function FTPCiclismoCalculator() {
  const [potencia, setPotencia] = useState('');
  const [protocolo, setProtocolo] = useState<ProtocoloFTP>('test20min');
  const [peso, setPeso] = useState('');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularFTP> | null>(null);
  const [error, setError] = useState('');

  function calcular() {
    const p = parseFloat(potencia);
    const kg = parseFloat(peso);
    if (!potencia || isNaN(p) || p <= 0) { setError('Introduce una potencia válida'); return; }
    if (!peso || isNaN(kg) || kg <= 0)   { setError('Introduce tu peso corporal');    return; }
    setError('');
    setResultado(calcularFTP(p, protocolo, kg));
  }

  const protocoloOpciones: { val: ProtocoloFTP; label: string; desc: string }[] = [
    { val: 'test20min', label: 'Test 20 min', desc: '× 0.95' },
    { val: 'test8min',  label: 'Test 8 min',  desc: '× 0.90' },
    { val: 'rampa',     label: 'Test rampa',  desc: '× 0.75' },
  ];

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto' }}>
      {/* Protocolo */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Protocolo de test
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {protocoloOpciones.map(({ val, label, desc }) => (
            <button key={val} onClick={() => setProtocolo(val)} style={{
              padding: '8px 16px', border: '1px solid',
              borderColor: protocolo === val ? 'var(--ink)' : 'var(--border)',
              background: protocolo === val ? 'var(--ink)' : 'transparent',
              color: protocolo === val ? 'var(--acid)' : 'var(--muted)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase',
              letterSpacing: '1px', cursor: 'pointer',
            }}>
              {label} <span style={{ opacity: 0.6 }}>({desc})</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Input label="Potencia media (W)" value={potencia} onChange={setPotencia} suffix="W" type="number" />
        <Input label="Peso corporal" value={peso} onChange={setPeso} suffix="kg" type="number" />
      </div>

      {error && <p style={{ color: '#F87171', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

      <Button onClick={calcular}>Calcular FTP</Button>

      {resultado && (
        <div style={{ marginTop: '32px' }}>
          {/* Resultado principal */}
          <div style={{ background: 'var(--ink)', padding: '24px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>FTP</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.ftpW}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>vatios</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>W/kg</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--acid)', lineHeight: 1 }}>{resultado.wPerKg}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>vatios/kg</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Nivel</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', lineHeight: 1, color: resultado.color }}>{resultado.nivelNombre}</div>
            </div>
          </div>

          {/* Zonas */}
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--ink)', marginBottom: '16px' }}>Zonas de entrenamiento</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {resultado.zonas.map((zona, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink)', fontWeight: 600 }}>{zona.nombre}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{zona.descripcion}</div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                  {zona.maxW === 9999 ? `>${zona.minW}` : `${zona.minW}–${zona.maxW}`} W
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
