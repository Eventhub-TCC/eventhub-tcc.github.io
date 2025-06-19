import { Link } from 'react-router';
import './PedidosComponente.css';

interface Pedido {
  idPedido: number;
  nomeCliente: string;
  Evento: {
      Usuario:{
        nomeUsu: string;
      }
      nomeEvento: string;
  }
  dataEntrega: string;
  quantidadeItens: number;
  valorTotalDoPrestador: number;
  status: string;
}

const PedidosComponente = ({pedidos}: any) => {
  return (
    <>
      {pedidos.map((pedido: Pedido) => (
          <Link to={`/prestador/pedidos/${pedido.idPedido}/informacoes-pedido`} className="pedidos-componente__container" key={pedido.idPedido}>
            <div className="pedidos-componente__cliente">
              <div className="pedidos-componente__cliente-nome-pedido">
                <div className="pedidos-componente__cliente-nome">{pedido.Evento.Usuario.nomeUsu}</div>
                <div className="pedidos-componente__cliente-pedido">#0{pedido.idPedido}</div>
              </div>
              <div className="pedidos-componente__cliente-evento">{pedido.Evento.nomeEvento}</div>
              <div className="pedidos-componente__cliente-data-itens">
                <div className="pedidos-componente__cliente-data">{new Date(pedido.dataEntrega).toLocaleDateString('pt-BR')}</div>
                <div className="pedidos-componente__cliente-itens">{pedido.quantidadeItens} {pedido.quantidadeItens == 1 ? 'item' : 'itens'}</div>
              </div>
            </div>
            <div className="pedidos-componente__infos">
              <div className="pedidos-componente__infos-valor">R$ {pedido.valorTotalDoPrestador}</div>
              <div className="pedidos-componente__barra"></div>
              <div className="pedidos-componente__infos-status">{pedido.status}</div>
            </div>
        </Link>
      ))}
    </>
  )
}

export default PedidosComponente;