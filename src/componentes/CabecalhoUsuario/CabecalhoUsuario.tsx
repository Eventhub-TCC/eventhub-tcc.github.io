import { Link } from 'react-router'
import './CabecalhoUsuario.css'

const CabecalhoUsuario = () => {
  return (
    <header className='cabecalho-usuario'>
        <div className='container'>
            <Link to={'/'}>
                <h1 className='cabecalho-usuario__logo'>EventHub</h1>
            </Link>
        </div>
    </header>
  )
}

export default CabecalhoUsuario