import './CardServico.css'
import { Link } from 'react-router'

const CardServico = ({titulo, imagem, id}:any) => {

  return (
  <Link to={`${id}/informacoes-meus-servicos`} style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="card-servico">
      <div className="card-servico__centro">
        <div className="card-servico__frente">
          <div className="card-servico__imagem" style={imagem?{backgroundImage:`url(http://localhost:3000/files/${imagem})`}:{}}>
            {!imagem ? <i className="fa-solid fa-image card-servico__sem-imagem"></i>:''} 
          </div>
          <div className="card-servico__container-titulo">
            <div className="card-servico__titulo">{titulo}</div>
          </div>
        </div>
      </div>
    </div>
  </Link>
    
  )
}

export default CardServico