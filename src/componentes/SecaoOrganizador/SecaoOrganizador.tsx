import { useEffect, useRef, useState } from 'react'
import './SecaoOrganizador.css'

const SecaoOrganizador = ({titulo, children}: any) => {
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
  }, [aberto]);

  return (
    <section className="secao-organizador">
      <div className="secao-organizador__container-titulo" onClick={() => setAberto(!aberto)}>
        <i className={`fa-solid fa-chevron-right secao-organizador__seta ${aberto ? 'secao-organizador__seta-baixo' : ''}`}/>
        <span className="secao-organizador__titulo">{titulo}</span>
      </div>
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

export default SecaoOrganizador