import { useState } from 'react';
import Button from '../ui/Button';
import { calcularPesoBebeSemanaPorSemana } from '../../lib/calculators';
import ShareButtons from '../ui/ShareButtons';

export default function PesoBebeCalculator() {
  const [semana, setSemana]       = useState(20);
  const [resultado, setResultado] = useState<ReturnType<typeof calcularPesoBebeSemanaPorSemana> | null>(null);

  function calcular() {
    setResultado(calcularPesoBebeSemanaPorSemana(semana));
  }

  const formatPeso = (g: number) => g >= 1000 ? `${(g / 1000).toFixed(2)} kg` : `${g} g`;

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Semana de gestación: <strong style={{ color: 'var(--ink)', fontSize: '13px' }}>{semana}</strong>
        </div>
        <input
          type="range" min={8} max={40} step={1} value={semana}
          onChange={e => setSemana(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--acid)', height: '4px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', marginTop: '4px' }}>
          <span>Semana 8</span>
          <span>1er trim.</span>
          <span>2º trim.</span>
          <span>3er trim.</span>
          <span>Semana 40</span>
        </div>
      </div>

      <Button onClick={calcular}>Ver datos del bebé</Button>

      {resultado && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ background: 'var(--ink)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '1px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Peso medio</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--acid)', lineHeight: 1 }}>
                {resultado.pesoMedioG >= 1000
                  ? (resultado.pesoMedioG / 1000).toFixed(2)
                  : resultado.pesoMedioG}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>{resultado.pesoMedioG >= 1000 ? 'kg' : 'g'}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Rango de peso</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white', lineHeight: 1.3 }}>
                {formatPeso(resultado.pesoMinG)} – {formatPeso(resultado.pesoMaxG)}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Talla estimada</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'white', lineHeight: 1 }}>
                {resultado.tallaMinCm}–{resultado.tallaMaxCm}
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>cm</div>
            </div>
          </div>

          <div style={{ background: '#f9f6f0', border: '1px solid var(--border)', padding: '16px', marginBottom: '1px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Trimestre {resultado.trimestre} · Semana {resultado.semana}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{resultado.descripcion}</p>
          </div>

          <div style={{ border: '1px solid var(--border)', padding: '14px 16px', background: '#fffbeb' }}>
            <p style={{ fontSize: '12px', color: '#92400e', lineHeight: 1.7 }}>
              <strong>Nota:</strong> Estos datos son estimaciones basadas en tablas de la OMS para gestaciones normales. El peso real puede variar. Consulta siempre con tu médico o matrona.
            </p>
          </div>

          <ShareButtons
            text={`En la semana ${resultado.semana} de embarazo, el bebé pesa aproximadamente ${formatPeso(resultado.pesoMedioG)}. Calculado con CalcFit:`}
            url="https://www.calcfit.com/peso-bebe-semana"
          />
        </div>
      )}
    </div>
  );
}
