import React, { useState } from 'react';
import './QuickGuide.css';


interface Passo {
  titulo: string;
  detalhe: string;
  imagem: string;
}

const QuickGuide = ({ passos, corPrincipal = 'var(--purple-800)', onClose }: any) => {
  const [index, setIndex] = useState(0);

  const passoAtual = passos[index];
  const corTexto = { color: corPrincipal, borderColor: corPrincipal };

  return (
    <div className="quickguide-overlay">
      <div className="quickguide-container">
        <div className="quickguide-banner" style={{backgroundColor: corPrincipal}}>
          <span className="quickguide-banner-text">Quick guide</span>
        </div>

        <button className="quickguide-close" onClick={onClose}>×</button>

        <div className="quickguide-content">
          <h2>{passoAtual.titulo}</h2>
          <p>{passoAtual.detalhe}</p>
          <img src={passoAtual.imagem} alt="Passo" />
        </div>

        <div className="quickguide-footer">
          <button
            onClick={() => setIndex(index - 1)}
            disabled={index === 0}
            className="quickguide-btn"
            style={corTexto}
          >
            ◀ Voltar
          </button>

          <div className="quickguide-indicadores">
            {passos.map((_: any, i: React.Key | null | undefined) => (
              <span
                key={i}
                className={`quickguide-bolinha ${i === index ? 'ativa' : ''}`}
                style={{ '--corQuickGuideBolinhaAtiva': corPrincipal } as React.CSSProperties}
              />
            ))}
          </div>

          {
            index === passos.length - 1 ? (
            <button
                onClick={onClose}
                className="quickguide-btn"
                style={corTexto}>
                    Vamos Lá!
                </button>
            ) : (
                            <button
                onClick={() => setIndex(index + 1)}
                disabled={index === passos.length - 1}
                className="quickguide-btn"
                style={corTexto}
            >
                Próximo ▶
            </button>
            )
          }


        </div>
      </div>
    </div>
  );
};

export default QuickGuide;
