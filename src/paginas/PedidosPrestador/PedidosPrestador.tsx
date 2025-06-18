import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import './PedidosPrestador.css'
import PedidosComponente from '../../componentes/PedidosComponente/PedidosComponente'
import api from '../../axios';

interface Pedido {
  idPedido: number;
  nomeCliente: string;
  nomeEvento: string;
  dataEntrega: string;
  quantidadeItens: number;
  valorTotal: number;
  status: string;
}

const PedidosPrestador = () => {
    const [pedidos, setPedidos] = React.useState<Pedido[]>([]);

    const obterPedidos = async () => {
        try {
            const response = await api.get(`/users/listar-pedidos-prestador`);
            const data = response.data;
            console.log('Pedidos obtidos:', data);
            setPedidos(data);
        } catch (error) {
            console.error('Erro ao obter pedidos:', error);
        }
    }

    useEffect(() => {
        obterPedidos();
    }
, []);


  return (
    <>
      <Helmet>
        <title>Meus Pedidos | EventHub</title>
      </Helmet>
      <div className="pedidos-prestador__titulo">
        <div className="pedidos-prestador__titulo-texto"> Pedidos </div>
      </div>
      <div className="pedidos-prestador">
          <PedidosComponente pedidos={pedidos}/>
      </div>
    
    </>
  )
}

export default PedidosPrestador