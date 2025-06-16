import React, { useState } from 'react';
import './CardPergunta.css';

const CardPergunta = ({ pergunta, resposta }: any) => {
  const [aberto, setAberto] = useState(false);

  return (
    <div className={`card-pergunta__container ${aberto ? 'aberto' : ''}`}>
      <div className="card-pergunta__topo" onClick={() => setAberto(!aberto)}>
        <p className="card-pergunta__texto">{pergunta}</p>
    
        <div className={`card-pergunta__icone ${aberto ? 'rotacionado' : ''}`}>
            <i className='fa-solid fa-chevron-down'></i>
        </div>
      </div>
      {aberto && (
        <div className="card-pergunta__resposta">
          <p>{resposta}</p>
        </div>
      )}
    </div>
  );
};

export default CardPergunta;