import { Link } from 'react-router'
import './CardMarketplace.css'

const CardMarketplace = ({idServico, fotoServico, nomeServico, nomePrestador, preco, precoPromo, unidade}: any) => {
  
  const formatarPreco = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div style={{ width: 307 }}>
      <Link to={`servico/${idServico}`} style={{ textDecoration: 'none'}}>
        <div className="card-marketplace">
          <div className='card-marketplace__imagem'>
            <img src={`http://localhost:3000/files/${fotoServico}`} alt="Imagem do serviço" />
          </div>
          <div className='card-marketplace__descricao'>
            <span className='card-marketplace__nome-servico' title={nomeServico}>{nomeServico}</span>
            <span className='card-marketplace__container-prestador'>
              Por <span className='card-marketplace__prestador' title={nomePrestador}>{nomePrestador}</span>
            </span>
          </div>
          <div className='card-marketplace__container-preco'>
            <span className='card-marketplace__preco-inteiro'>
              {
                precoPromo ? `${formatarPreco(preco)}` : ''
              }
            </span>
            <div className='card-marketplace__container-preco-atual'>
              <div className='card-marketplace__preco-unidade'>
                <span className='card-marketplace__preco-atual'>{precoPromo ? formatarPreco(precoPromo) : formatarPreco(preco)}</span>
                <span className='card-marketplace__unidade'>/ {unidade}</span>
              </div>
              {
                precoPromo ? 
                  <span className='card-marketplace__porcentagem-desconto'>-{Math.round((1 - precoPromo / preco) * 100)}%</span>
                : ''
              }
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CardMarketplace