import { useState, Children, cloneElement } from 'react'
import './BarraLateral.css'

const BarraLateral = ({cor = 'var(--purple-800)', corHoverMinimizar = 'var(--purple-700)', children}: any) => {
  const [ minimizado, setMinimizado ] = useState(false);
  
  return (
    <aside style={{'--cor-barra-lateral': cor} as React.CSSProperties} className={`barra-lateral ${minimizado ? 'barra-lateral--minimizada' : ''}`}>
      <ul className='barra-lateral__itens'>
        {
          Children.map(children, (child) => cloneElement(child, { minimizado }))
        }
      </ul>
      <div className='barra-lateral__minimizar'>
        <button 
          style={{'--cor-minimizar': corHoverMinimizar} as React.CSSProperties} 
          className='barra-lateral__botao-minimizar' 
          onClick={() => setMinimizado(!minimizado)}
        >
          <svg className={minimizado ? `barra-lateral__icone-gira` : ''} xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none">
            <path d="M11.5 17.2L5.5 11.6L11.5 6M20.5 17.2L14.5 11.6L20.5 6"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}

export default BarraLateral