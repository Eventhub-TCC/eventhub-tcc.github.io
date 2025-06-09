import { useState, Children, cloneElement, useEffect } from 'react'
import './BarraLateral.css'
import ItemBarraLateral from '../ItemBarraLateral/ItemBarraLateral';
import { useNavigate } from 'react-router';

const BarraLateral = ({enviaMinimizada, minimizada, cor = 'var(--purple-800)', corHoverMinimizar = 'var(--purple-700)', corIconeHoverMinimizar='white', children}: any) => {
  const [ minimizado, setMinimizado ] = useState(minimizada);
  const [larguraTela, setLarguraTela] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const redimensionarTela = () => setLarguraTela(window.innerWidth);

    window.addEventListener('resize', redimensionarTela);

    return () => window.removeEventListener('resize', redimensionarTela);
  }, []);

  useEffect(() => {
    setMinimizado(minimizada);
  }, [minimizada]);

  const minimizarMobile = () => {
    if (larguraTela <= 1024) {
      setMinimizado(!minimizado);
      enviaMinimizada(!minimizado);
    }
  }
  
  return (
    <aside style={{'--cor-barra-lateral': cor} as React.CSSProperties} className={`barra-lateral ${minimizado ? 'barra-lateral--minimizada' : ''}`}>
      <ul className='barra-lateral__itens'>
        {
          Children.map(children, (child) => <div onClick={minimizarMobile}>{cloneElement(child, { minimizado })}</div>)
        }
      </ul>
      {
        larguraTela > 1024 ?
          <div className='barra-lateral__minimizar'>
            <button 
              style={{'--cor-minimizar': corHoverMinimizar, '--cor-icone-minimizar': corIconeHoverMinimizar} as React.CSSProperties} 
              className='barra-lateral__botao-minimizar' 
              onClick={() => {setMinimizado(!minimizado)
                enviaMinimizada(!minimizado)
              }}
            >
              <svg className={minimizado ? `barra-lateral__icone-gira` : ''} xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none">
                <path d="M11.5 17.2L5.5 11.6L11.5 6M20.5 17.2L14.5 11.6L20.5 6"/>
              </svg>
            </button>
          </div>
        :
        <div onClick={() => {
          navigate('/login'); 
          localStorage.removeItem("token");
        }}>
          <ItemBarraLateral texto="Sair" caminho="/login" icone="fa-solid fa-arrow-right-from-bracket" />
        </div>
      }
    </aside>
  )
}

export default BarraLateral