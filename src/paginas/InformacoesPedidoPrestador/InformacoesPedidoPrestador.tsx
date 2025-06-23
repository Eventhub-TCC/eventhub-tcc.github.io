import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router';
import api from '../../axios';
import './InformacoesPedidoPrestador.css';
import TextArea from '../../componentes/TextArea/TextArea';

const apiUrl = import.meta.env.VITE_API_URL;

interface itens {
  Servico: {
    imagem1: string;
  }
  idItemPedido: number;
  idServico: number;
  instrucao: string;
  nomeItem: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}


interface Pedido {
  itens: itens[];
  pedido: {
    codigoUsu: string;
    idPedido: number;
    dataPedido: string;
    dataEntrega: string;
    localEntrega: string;
    nomeCliente: string;
    nomeEvento: string;
    telefoneCliente: string;
  }



}

const InformacoesPedidoPrestador = () => {
        const {idPedido} = useParams();
    const [pedido, setPedido] = useState<Pedido>();

    useEffect(() => {
        api.get(`/users/listar-itens-pedido-prestador/${idPedido}`)
        .then((res) => {
            console.log(res.data);
            setPedido(res.data);
            console.log('PEDIDO',pedido);
        })
        .catch((err) => {
            console.error("Erro ao buscar itens do pedido", err);
        });
    }
    , [idPedido]);
  return (
    <>
     <Helmet>
       <title>Informações do Pedido | EventHub</title>
     </Helmet>
     <div className="info-pedido-prestador__container">
      <h1 className="info-pedido-prestador__titulo">Informações do Pedido #{pedido?.pedido.idPedido}</h1>
      <div className="info-pedido-prestador__caixa">
        <div className="info-pedido-prestador__topo-titulo-img">
          <i className="fa-solid fa-clipboard-user fa-lg" style={{ color: 'var(--yellow-800)' }}></i>
          <div className="info-pedido-prestador__topo-titulo">Informações do Cliente</div>
        </div>
        <div className="info-pedido-prestador__topo-dados">
          <div className="info-pedido-prestador__ordenacao-itens">
            <p><strong>Nome:</strong> {pedido?.pedido.nomeCliente}</p>
            <p><strong>Telefone:</strong> {pedido?.pedido.telefoneCliente}</p>
          </div>
          <div className="info-pedido-prestador__ordenacao-itens">
            <p><strong>Evento:</strong> {pedido?.pedido.nomeEvento}</p>
            <p><strong>Data do Pedido:</strong> {pedido?.pedido.dataPedido ? new Date(pedido.pedido.dataPedido).toLocaleDateString() : '-'}</p>
          </div>
        </div>
      </div>
      <div className="info-pedido-prestador__caixa">
          <div className="info-pedido-prestador__topo-titulo-img">
            <i className="fa-solid fa-truck fa-lg" style={{ color: 'var(--yellow-800)' }}></i>
            <div className="info-pedido-prestador__topo-titulo">Informações da Entrega</div>
          </div>
        <div className="info-pedido-prestador__topo-dados">
          <div className="info-pedido-prestador__ordenacao-itens">
            <p><strong>Data de Entrega:</strong> {pedido?.pedido.dataEntrega ? new Date(pedido.pedido.dataEntrega).toLocaleDateString() : '-'}</p>
            <p><strong>Local de Entrega:</strong> {pedido?.pedido.localEntrega}</p>
          </div>
        </div>

      </div>
      <div className="info-pedido-prestador__caixa">
        <div className="info-pedido-prestador__topo-titulo-img">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
              <g clip-path="url(#clip0_40606_8097)">
                <path d="M10.5542 2.00813C10.8083 1.50109 10.6167 0.878048 10.1292 0.615938C9.64167 0.353829 9.03333 0.551485 8.77917 1.05422L4.9 8.74992H1.33333C0.595833 8.74992 0 9.36438 0 10.1249C0 10.8855 0.595833 11.4999 1.33333 11.4999L3.49583 20.4159C3.79167 21.6405 4.85833 22.4999 6.08333 22.4999H17.9167C19.1417 22.4999 20.2083 21.6405 20.5042 20.4159L22.6667 11.4999C23.4042 11.4999 24 10.8855 24 10.1249C24 9.36438 23.4042 8.74992 22.6667 8.74992H19.1L15.2208 1.05422C14.9667 0.551485 14.3625 0.353829 13.8708 0.615938C13.3792 0.878048 13.1917 1.50109 13.4458 2.00813L16.8458 8.74992H7.15417L10.5542 2.00813ZM8 13.5624V17.6874C8 18.0655 7.7 18.3749 7.33333 18.3749C6.96667 18.3749 6.66667 18.0655 6.66667 17.6874V13.5624C6.66667 13.1843 6.96667 12.8749 7.33333 12.8749C7.7 12.8749 8 13.1843 8 13.5624ZM12 12.8749C12.3667 12.8749 12.6667 13.1843 12.6667 13.5624V17.6874C12.6667 18.0655 12.3667 18.3749 12 18.3749C11.6333 18.3749 11.3333 18.0655 11.3333 17.6874V13.5624C11.3333 13.1843 11.6333 12.8749 12 12.8749ZM17.3333 13.5624V17.6874C17.3333 18.0655 17.0333 18.3749 16.6667 18.3749C16.3 18.3749 16 18.0655 16 17.6874V13.5624C16 13.1843 16.3 12.8749 16.6667 12.8749C17.0333 12.8749 17.3333 13.1843 17.3333 13.5624Z" fill="var(--yellow-800)"/>
              </g>
              <defs>
                <clipPath id="clip0_40606_8097">
                  <rect width="24" height="22" fill="white" transform="translate(0 0.5)"/>
                </clipPath>
              </defs>
            </svg>
            </div>
            <div className="info-pedido-prestador__topo-titulo">
              Itens do Pedido
            </div>
           </div>
        <div className="info-pedido-prestador__itens">
          {pedido?.itens.map((item, index) => (
            <div key={index} className="info-pedido-prestador__item">
              <div className="info-pedido-prestador__item-img-qtd-preco">
                <div className="info-pedido-prestador__item-img-informacoes">
                  <div className="info-pedido-prestador__item-imagem">
                    <img src={`${apiUrl}/files/${item.Servico.imagem1}`} alt={item.nomeItem} />
                  </div>
                  <div className="info-pedido-prestador__item-nome-preco">
                    <div className="info-pedido-prestador__item-nome">{item.nomeItem}</div>
                    <div className="info-pedido-prestador__item-preco">
                      <span className="info-pedido-prestador__item-preco-valor">R$ {item.valorUnitario}</span>
                      <span className="info-pedido-prestador__item-preco-unidade">/unidade</span>
                      </div>
                  </div>
                  <div className="info-pedido-prestador__item-quantidade">
                    <div className="info-pedido-prestador__item-quantidade-texto">Quantidade</div>
                    <div className="info-pedido-prestador__item-quantidade-numero">
                      <div className="info-pedido-prestador__item-quantidade-caixa-numero">{item.quantidade}</div>
                    </div>

                  </div>

                </div>
                <div className="info-pedido-prestador__item-preco">
                  <div className="info-pedido-prestador__item-preco-texto">Preço Total</div>
                  <div className="info-pedido-prestador__item-preco-valor">R$ {item.valorTotal}</div>
                </div>

              </div>
              <div className="informacoes-pedido-item__instrucoes">
                <details open className="informacoes-pedido-item__detalhes">
                  <summary className="informacoes-pedido-item__sumario">
                    instruções
                  </summary>
                  <div className="informacoes-pedido-item__input-instrucoes">
                  <TextArea
                    titulo=''
                    placeholder='Descreva o serviço que você deseja criar'
                    name='descricao-servico'
                    cor='#F3C623'
                    maximo={4000}
                    obrigatorio
                    valor={item.instrucao ? item.instrucao : 'Sem Instruções de Serviço'}
                    disabled
                    />       
                    </div>
                  </details>
                </div>
            </div>
          ))}
          </div>
      </div>
      <div className="info-pedido-prestador__caixa">
        <div className="info-pedido-prestador__preco-titulo">
          <div className="info-pedido-prestador__topo-titulo-img">
            <i className="fa-solid fa-dollar-sign fa-lg" style={{ color: 'var(--yellow-800)' }}></i>
            <div className="info-pedido-prestador__topo-titulo">Valor Total</div>
          </div>
          <div className="info-pedido-prestador__item-preco-valor">
            R$ {pedido?.itens.reduce((acc, item) => acc + Number(item.valorTotal), 0).toFixed(2)}
          </div>

        </div>

      </div>
     </div>
     
    
    </>
  )
}

export default InformacoesPedidoPrestador