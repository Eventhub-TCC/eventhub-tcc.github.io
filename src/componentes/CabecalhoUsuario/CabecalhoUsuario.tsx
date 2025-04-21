import { Link } from 'react-router'
import './CabecalhoUsuario.css'
import logo from '../../assets/logo_eventhub_fonte_branca.png'

const CabecalhoUsuario = () => {
  return (
    <header className='cabecalho-usuario'>
        <div className='container'>
            <Link to='/' className='cabecalho-usuario__link'>
              <div className='cabecalho-usuario__logo-container'>
                <img src={logo} alt="Logotipo do EventHub" className='cabecalho-usuario__logotipo'/>
              </div>
            </Link>
        </div>
    </header>
  )
}

export default CabecalhoUsuario