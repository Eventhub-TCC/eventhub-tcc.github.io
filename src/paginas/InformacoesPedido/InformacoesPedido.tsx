import { useEffect, useState } from 'react'
import './InformacoesPedido.css'
import TextArea from '../../componentes/TextArea/TextArea'
import { useParams } from 'react-router';
import api from '../../axios';
import { Helmet } from 'react-helmet-async';

const apiUrl = import.meta.env.VITE_API_URL;

const InformacoesPedido = () => {
    const {idPedido} = useParams();
    const [itensPedido, setItensPedido] = useState<any[]>([]);
    const [nomeEvento, setNomeEvento] = useState<string>('');

    useEffect(() => {
        api.get(`/users/listar-itens-pedido/${idPedido}`)
        .then((res) => {
            console.log(res.data);
            setItensPedido(res.data.itens);
            setNomeEvento(res.data.nomeEvento);
            console.log(itensPedido)
        })
        .catch((err) => {
            console.error("Erro ao buscar itens do pedido", err);
        });
    }
    , [idPedido]);


  return (
    <>
        <Helmet>
            <title>Pedido #{idPedido} | Pedidos | EventHub</title>
        </Helmet>
        <div className="informacoes-pedido-container">
            <div className="informacoes-pedido-titulo"> {nomeEvento} </div>
            <div className="informacoes-pedido-numero-pedido"> Pedido#{idPedido}</div>
            <div className="informacoes-pedido-caixa">
                <div className="informacoes-pedido-caixa__titulo-imagem">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
                            <g clipPath="url(#clip0_40606_8097)">
                                <path d="M10.5542 2.00813C10.8083 1.50109 10.6167 0.878048 10.1292 0.615938C9.64167 0.353829 9.03333 0.551485 8.77917 1.05422L4.9 8.74992H1.33333C0.595833 8.74992 0 9.36438 0 10.1249C0 10.8855 0.595833 11.4999 1.33333 11.4999L3.49583 20.4159C3.79167 21.6405 4.85833 22.4999 6.08333 22.4999H17.9167C19.1417 22.4999 20.2083 21.6405 20.5042 20.4159L22.6667 11.4999C23.4042 11.4999 24 10.8855 24 10.1249C24 9.36438 23.4042 8.74992 22.6667 8.74992H19.1L15.2208 1.05422C14.9667 0.551485 14.3625 0.353829 13.8708 0.615938C13.3792 0.878048 13.1917 1.50109 13.4458 2.00813L16.8458 8.74992H7.15417L10.5542 2.00813ZM8 13.5624V17.6874C8 18.0655 7.7 18.3749 7.33333 18.3749C6.96667 18.3749 6.66667 18.0655 6.66667 17.6874V13.5624C6.66667 13.1843 6.96667 12.8749 7.33333 12.8749C7.7 12.8749 8 13.1843 8 13.5624ZM12 12.8749C12.3667 12.8749 12.6667 13.1843 12.6667 13.5624V17.6874C12.6667 18.0655 12.3667 18.3749 12 18.3749C11.6333 18.3749 11.3333 18.0655 11.3333 17.6874V13.5624C11.3333 13.1843 11.6333 12.8749 12 12.8749ZM17.3333 13.5624V17.6874C17.3333 18.0655 17.0333 18.3749 16.6667 18.3749C16.3 18.3749 16 18.0655 16 17.6874V13.5624C16 13.1843 16.3 12.8749 16.6667 12.8749C17.0333 12.8749 17.3333 13.1843 17.3333 13.5624Z" fill="#6A40C3"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_40606_8097">
                                    <rect width="24" height="22" fill="white" transform="translate(0 0.5)"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className="informacoes-pedido-caixa__titulo-texto">
                        Produtos e Serviços
                    </div>
                </div>

                {itensPedido.map((item, index) => (
                    <div key={index} className="informacoes-pedido-caixa__item">
                        <div className="informacoes-pedido-item__ordenacao">
                            <div className="informacoes-pedido-item__infos">
                                <div className="informacoes-pedido-item__imagem">
                                    <img src={`${apiUrl}/files/${item.Servico.imagem1}`} alt={item.nome} className="informacoes-pedido-item__imagem" />
                                </div>
                                <div className="informacoes-pedido-item__nome-preco">
                                    <div className='informacoes-pedido-item__nome'>{item.nomeItem}</div>
                                    <div className='informacoes-pedido-item__preco-unidade'>
                                        <div className='informacoes-pedido-item__preco'>R$ {item.valorUnitario}</div>
                                        {/* <div className="informacoes-pedido-item__unidade"> /unidade</div> */}
                                    </div>
                                </div>
                                <div className='informacoes-pedido-item__quantidade'>
                                    <div className='informacoes-pedido-quantidade__texto'>Quantidade</div>
                                    <div className='informacoes-pedido-quantidade__numero'>
                                        <div className='informacoes-pedido-quantidade__caixa-numero'>{item.quantidade}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="informacoes-pedido-item__preco">
                                <div className='informacoes-pedido-item__preco-total'>Preço Total</div>
                                <div className='informacoes-pedido-item__valor'>R$ {(item.quantidade * item.valorUnitario).toFixed(2)} </div>
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
    </>
  )
}

export default InformacoesPedido