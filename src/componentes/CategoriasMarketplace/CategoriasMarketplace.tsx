import { Link } from 'react-router'
import './CategoriasMarketplace.css'

const CategoriasMarketplace = ({categoriasPrincipais, outrasCategorias}: any) => {
  return (
    <nav className="layout-categorias">
        <ul>
        {
            categoriasPrincipais.map((categoria: any) => (
            <li key={categoria}>
                <Link to={`/marketplace/categorias/${categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}`}>{categoria}</Link>
            </li>
            ))
        }
        <li>
            Mais 
            <svg className="layout-categorias-mais" xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
            <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <nav className="layout-categorias-mais-container">
                <ul>
                    {
                    outrasCategorias.map((categoria: any) => (
                        <li key={categoria.idTipoServico}>
                        <Link to={`/marketplace/categorias/${categoria.descricaoTipoServico.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}`}>{categoria.descricaoTipoServico}</Link>
                        </li>
                    ))
                    }
                </ul>
            </nav>
        </li>
        </ul>
    </nav>
  )
}

export default CategoriasMarketplace