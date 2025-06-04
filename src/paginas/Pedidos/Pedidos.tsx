import { useEffect, useState } from 'react'
import './Pedidos.css'
import FeedbackFormulario from '../../componentes/FeedbackFormulario/FeedbackFormulario'
import TabelaPedido from '../../componentes/TabelaPedido/TabelaPedido'
import api from '../../axios';

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

const Pedidos = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [pedidosPorEvento, setPedidosPorEvento] = useState<{ [evento: string]: Pedido[] }>({});

  const obterPedidos = async () => {
    try {
      const response = await api.get(`/users/listar-pedidos`);
      const pedidos = response.data;

      const agrupados = pedidos.reduce((pedidosOrdenados: { [evento: string]: Pedido[] }, pedido: Pedido) => {
        const nomeEvento = pedido.Evento.nomeEvento;
        if (!pedidosOrdenados[nomeEvento]) {
          pedidosOrdenados[nomeEvento] = [];
        }
        pedidosOrdenados[nomeEvento].push(pedido);
        return pedidosOrdenados;
      }, {});

      setPedidosPorEvento(agrupados);
    } catch (error) {
      console.error('Erro ao obter pedidos', error);
    }
  };

  useEffect(() => {
    obterPedidos();
  }, []);





  return (
    <div className='pedidos-container'>
      <div className='pedidos-titulo'>Meus Pedidos</div>
      {Object.keys(pedidosPorEvento).length > 0 ? (
        Object.entries(pedidosPorEvento).map(([evento, pedidos]) => (
          <TabelaPedido
            key={evento}
            titulo={evento}
            cor='var(--purple-700)'
            pedidos={pedidos}
          />
        ))
      ) : (
        <div className='pedidos__sem-pedidos'>
          <FeedbackFormulario
            titulo='Pedidos'
            texto='Precisa de uma ajudinha para seus eventos? 
                    Acesse nosso marketplace e visualize o catálogo de serviços e produtos!'
            textoBotao='Ir para o marketplace'
            caminhoBotao='/marketplace'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='100'
              height='95'
              viewBox='0 0 100 95'
              fill='none'
            >
              <path
                d='M1.65499 1.31161C3.25086 -0.372704 5.9099 -0.444269 7.59443 1.15146L98.1841 86.9657C99.8688 88.5615 99.9411 91.2205 98.3453 92.9051C96.7495 94.5896 94.0905 94.6617 92.4058 93.0663L1.81515 7.25203C0.130551 5.65619 0.0591727 2.99624 1.65499 1.31161ZM18.5036 30.9014V79.4061L23.9079 75.7011L24.1686 75.537C25.4944 74.7702 27.1543 74.8247 28.4323 75.7011L37.8366 82.1493L47.2418 75.7011L47.5016 75.537C48.8273 74.7701 50.4872 74.8248 51.7653 75.7011L61.1695 82.1493L67.8023 77.6015L78.4908 87.7264L72.8365 83.8495L63.4322 90.2987C62.0691 91.2334 60.271 91.2332 58.9078 90.2987L49.5035 83.8495L40.0993 90.2987C38.7362 91.2334 36.938 91.2332 35.5749 90.2987L26.1696 83.8495L16.7653 90.2987C15.5411 91.138 13.9526 91.2306 12.6393 90.5389C11.326 89.847 10.5037 88.4843 10.5036 86.9999V23.3233L18.5036 30.9014ZM77.5035 3.00009C84.0635 3.00025 88.5035 8.89116 88.5035 15.0001V69.0575L80.5035 61.4794V15.0001C80.5035 12.2727 78.6753 11.0003 77.5035 11.0001H27.2135L19.068 3.28329C19.8409 3.09828 20.6547 3.00009 21.5036 3.00009H77.5035ZM42.5358 53.667H30.6579C28.4489 53.667 26.6582 51.8758 26.6579 49.667C26.6579 47.4578 28.4487 45.667 30.6579 45.667H34.0905L42.5358 53.667ZM68.5553 45.6719C70.6687 45.779 72.3492 47.5269 72.3492 49.667C72.349 50.8107 71.8679 51.8414 71.0982 52.5703L63.8102 45.667H68.3492L68.5553 45.6719ZM68.5553 24.3389C70.6686 24.4461 72.349 26.1931 72.3492 28.333C72.3491 30.473 70.6686 32.221 68.5553 32.3281L68.3492 32.333H49.734L41.2887 24.333H68.3492L68.5553 24.3389Z'
                fill='#8C5DFF'
              />
            </svg>
          </FeedbackFormulario>
        </div>
      )}
    </div>
  );
}

export default Pedidos