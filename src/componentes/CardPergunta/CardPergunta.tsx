import { useState } from 'react';
import './CardPergunta.css';

const CardPergunta = ({ pergunta, resposta }: any) => {
  const [aberto, setAberto] = useState(false);

  return (
    <div className={`card-pergunta__container ${aberto ? 'aberto' : ''}`}>
      <button 
      style={{ background: 'none', border: 'none', padding: 0, margin: 0, width: '100%', textAlign: 'left', cursor: 'pointer' }} 
      onClick={() => setAberto(!aberto)}>
        <div className="card-pergunta__topo">
          <p className="card-pergunta__texto">{pergunta}</p>
      
          <div className={`card-pergunta__icone ${aberto ? 'rotacionado' : ''}`}>
              <i className='fa-solid fa-chevron-down'></i>
          </div>
        </div>
      </button>
      {aberto && (
        <div className="card-pergunta__resposta">
          <p>{resposta}</p>
        </div>
      )}
    </div>
  );
};

export default CardPergunta;