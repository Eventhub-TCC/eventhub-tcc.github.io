import { useState } from 'react';
import './TabelaPedido.css';
import { NavLink } from 'react-router';

interface ItemPedido {
  idItemPedido: number;
  idPedido: string;
  idServico: number;
  valorUnitario: number;
  nomeItem: string;
  quantidade: string;
  instrucao?: string;
  valorTotal?: number;
}

interface Pedido {
    Evento: {
        nomeEvento: string;
    }
    idPedido: number;
    codigoUsu: string;
    dataPedido: Date;
    valorTotal: number;
    quantidadeItens: number;
}


export default function TabelaPedido({ titulo, cor, pedidos }: any) {
  const [aberto, setAberto] = useState(false);

  const total = pedidos.reduce((total: number, pedido: Pedido) => total + Number(pedido.valorTotal), 0);

  return (
    <div className='tabela-pedido-container' style={{ border: `1px solid ${cor}`}}>
      <div
        className='tabela-pedido-titulo'
        onClick={() => setAberto(!aberto)}
        style={{
          background: `${cor}`,
          borderRadius: aberto ? '16px 16px 0 0' : '16px'
        }}
      >
        <div className='tabela-pedido-titulo__itens'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7.79995 7.8H16.2M7.79995 12.6H16.2M5.75995 3H18.24C19.1015 3 19.8 3.80589 19.8 4.8V21L17.2 19.2L14.6 21L12 19.2L9.39995 21L6.79995 19.2L4.19995 21V4.8C4.19995 3.80589 4.89839 3 5.75995 3Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{titulo}</span>
        </div>
        <div className="tabela-pedido-titulo__itens">
          <span>{!aberto && `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
          <svg className={`tabela-pedido__seta ${aberto ? 'tabela-pedido__seta-abrir' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 7L9.42 12.0008L14 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>


      {aberto && (
        <>
          <div style={{ backgroundColor: '#fff', padding: '1rem', width: '100%' }}>
            {pedidos.map((pedido:Pedido) => (
              <div key={pedido.idPedido} className="tabela-pedido__pedido">
                <div className="tabela-pedido__pedido-infos">
                  <div className="tabela-pedido__pedido-id">
                    <NavLink style={{color:` ${cor}`}} to={`/pedidos/${pedido.idPedido}/informacoes-pedido`}> Pedido#{pedido.idPedido} </NavLink>
                  </div>
                  <div className="tabela-pedido__pedidos-data-num">
                    <div className="tabela-pedido__pedidos-data">{new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</div>
                    <div className="tabela-pedido__pedidos-numero">{pedido.quantidadeItens} {pedido.quantidadeItens>1? 'itens' : 'item'}</div>
                  </div>
                </div>
                <div className="tabela-pedido__pedido-valor">
                  R$ {pedido.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
          <div className='tabela-pedido__total' style={{ backgroundColor: cor }}>
            <span>
              Total
            </span>
            <span>
              Total R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
