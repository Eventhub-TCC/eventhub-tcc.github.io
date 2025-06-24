import { CSSProperties, useEffect, useRef, useState } from 'react'
import './Secao.css'

const Secao = ({titulo, children, corBorda = 'var(--purple-700)', corTitulo = 'var(--purple-800)'}: any) => {
  const [aberto, setAberto] = useState(true);
  const conteudoRef = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState('auto');

  useEffect(() => {
    if (aberto && conteudoRef.current) {
      setAltura(`${conteudoRef.current.scrollHeight}px`);
    } 
    else {
      setAltura('0px');
    }
  }, [aberto, children]);

  return (
    <section style={{'--cor-borda-secao': corBorda} as CSSProperties} className="secao-organizador">
      <button
        style={{ background: 'none', border: 'none', padding: 0, margin: 0, width: '100%', textAlign: 'left', cursor: 'pointer' }}
        onClick={() => setAberto(!aberto)}
        >
          <div style={{'--cor-titulo-secao': corTitulo} as CSSProperties} className="secao-organizador__container-titulo">
            <i className={`fa-solid fa-chevron-right secao-organizador__seta ${aberto ? 'secao-organizador__seta-baixo' : ''}`}/>
            <span className="secao-organizador__titulo">{titulo}</span>
          </div>
        </button>
      <div 
        className='secao-organizador__conteudo' 
        ref={conteudoRef} 
        style={{ maxHeight: altura }}
      >
        <div className='secao-organizador__conteudo-interno'>
          {children}
        </div>
      </div>
    </section>
  )
}

export default Secao