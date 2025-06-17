import { ChangeEvent, useEffect, useState } from "react";
import "./CarrinhoDeCompras.css";
import FeedbackFormulario from "../../componentes/FeedbackFormulario/FeedbackFormulario";
import Checkbox from "../../componentes/CheckBox/CheckBox";
import TextArea from "../../componentes/TextArea/TextArea";
import Botao from "../../componentes/Botao/Botao";
import api from "../../axios";
import { Modal } from "../../componentes/Modal/Modal";
import Select from "../../componentes/Select/Select";
import ErroCampoForm from "../../componentes/ErroCampoForm/ErroCampoForm";
import { Helmet } from "react-helmet-async";
import Seta from "../../componentes/Seta/Seta";
import Input from "../../componentes/Input/Input";

interface ItemCarrinho {
  idServico: string;
  nomeItem: string;
  valorUnitario: number;
  quantidade: number;
  instrucoes: string;
  imagem?: string;
  valorPromo?: number| null;
}

const CarrinhoDeCompras = () => {
const [carrinho, setCarrinho] = useState<ItemCarrinho[]>(() => {
  const carrinhoSalvo = localStorage.getItem("carrinho");
  return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
});
const [exibirInstrucoes, setExibirInstrucoes] = useState(() =>
  carrinho.map(item => !!item.instrucoes)
);
  const [evento, setEvento] = useState("");
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [eventos, setEventos] = useState<{ id: string; nome: string; data: string; local: string }[]>([]);
  const [erro, setErro] = useState({
  evento: { status: false, mensagem: "Selecione um evento" },
  localEntrega: { status: false, mensagem: "Digite o local de entrega" },
  dataEntrega: { status: false, mensagem: "Selecione uma data de entrega" },
  });
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false);
  const [localEntrega, setLocalEntrega] = useState('')
  const [dataEntrega, setDataEntrega] = useState<Date | null>(new Date())
  const hoje = new Date();
    




      useEffect(() => {
        const buscarEventos = async() =>{
        try{
            const eventoslista = (await api.get(`users/events`)).data
            setEventos(eventoslista.map((evento:any)=>{return{id:evento.idEvento, nome:evento.nomeEvento, data:evento.dataEvento, local: evento.enderecoLocal ? evento.enderecoLocal + ' Nº ' + evento.numeroLocal : ''}}))
        }
        catch(error){
            console.error("Erro ao buscar eventos:", error)
        }
    } 
    buscarEventos()
    },[])

    useEffect(() => {
      const buscarServicosCarrinho = async()=>{
        try{
          const carrinho = localStorage.getItem("carrinho");
          if (carrinho) {
            const carrinhoDesconto =await Promise.all (JSON.parse(carrinho).map(async(item: ItemCarrinho) => {
              const servico = (await api.get(`users/erro/services/${item.idServico}`)).data;
              if (servico){
                item.valorPromo = servico.valorPromoServico;
                return item
              }
            }))
            setCarrinho(carrinhoDesconto.filter((item: ItemCarrinho) => item !== undefined));
          }
        }
        catch (error) {
          console.error("Erro ao carregar o carrinho:", error);
        }
      }
      buscarServicosCarrinho();
    },[])


const formatarPreco = (valor: number) => {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const limparCarrinho = () => {
    localStorage.removeItem("carrinho");
    setCarrinho([]);
  };

  const aumentarQuantidade = (index: number) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho[index].quantidade += 1;
    setCarrinho(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  };
  const diminuirQuantidade = (index: number) => {
    const novoCarrinho = [...carrinho];
    if (novoCarrinho[index].quantidade > 1) {
      novoCarrinho[index].quantidade -= 1;
      setCarrinho(novoCarrinho);
      localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    }
  };
  const removerItem = (index: number) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  };

  const finalizarPedido = async () => {
    if (evento === "") {
      setErro((prevState) => ({
        ...prevState,
        evento: { ...prevState.evento, status: true },
      }));
      return;
    }
      if (localEntrega === '') {
        setErro(prevState => ({ ...prevState, localEntrega: { ...prevState.localEntrega, status: true } }))
        return
    }
    if (dataEntrega === null || dataEntrega === undefined || isNaN(dataEntrega.getTime())) {
        setErro(prevState => ({ ...prevState, dataEntrega: { ...prevState.dataEntrega, status: true } }))
        return
    }

    try {
      const itens = carrinho.map((item) => ({
        idServico: item.idServico,
        nomeItem: item.nomeItem,
        valorUnitario: item.valorPromo || item.valorUnitario,
        quantidade: item.quantidade,
        instrucao: item.instrucoes,
        imagem: item.imagem,
      }));
      await api.post("users/pedidos", {
        idEvento: evento,
        localEntrega: localEntrega,
        dataEntrega: dataEntrega,
        itens: itens,
      });
      console.log("Compra finalizada com sucesso");
      setModalFinalizar(false);
    limparCarrinho();
    setPedidoFinalizado(true);
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Carrinho de Compras | Marketplace | EventHub</title>
      </Helmet>
      <div className="container-carrinho">
          <div className='servico-marketplace__seta'>
              <Seta caminho='/marketplace'/>
          </div>
        <div className="container-carrinho__titulo">Carrinho de Compras</div>
        {carrinho.length > 0 ? (
          <>
            <div className="container-carrinho-caixa">
              <div className="container-carrinho__titulo-icone">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="23"
                  viewBox="0 0 24 23"
                  fill="none"
                >
                  <g clip-path="url(#clip0_40564_3573)">
                    <path
                      d="M10.5542 2.00813C10.8083 1.50109 10.6167 0.878048 10.1292 0.615938C9.64167 0.353829 9.03333 0.551485 8.77917 1.05422L4.9 8.74992H1.33333C0.595833 8.74992 0 9.36438 0 10.1249C0 10.8855 0.595833 11.4999 1.33333 11.4999L3.49583 20.4159C3.79167 21.6405 4.85833 22.4999 6.08333 22.4999H17.9167C19.1417 22.4999 20.2083 21.6405 20.5042 20.4159L22.6667 11.4999C23.4042 11.4999 24 10.8855 24 10.1249C24 9.36438 23.4042 8.74992 22.6667 8.74992H19.1L15.2208 1.05422C14.9667 0.551485 14.3625 0.353829 13.8708 0.615938C13.3792 0.878048 13.1917 1.50109 13.4458 2.00813L16.8458 8.74992H7.15417L10.5542 2.00813ZM8 13.5624V17.6874C8 18.0655 7.7 18.3749 7.33333 18.3749C6.96667 18.3749 6.66667 18.0655 6.66667 17.6874V13.5624C6.66667 13.1843 6.96667 12.8749 7.33333 12.8749C7.7 12.8749 8 13.1843 8 13.5624ZM12 12.8749C12.3667 12.8749 12.6667 13.1843 12.6667 13.5624V17.6874C12.6667 18.0655 12.3667 18.3749 12 18.3749C11.6333 18.3749 11.3333 18.0655 11.3333 17.6874V13.5624C11.3333 13.1843 11.6333 12.8749 12 12.8749ZM17.3333 13.5624V17.6874C17.3333 18.0655 17.0333 18.3749 16.6667 18.3749C16.3 18.3749 16 18.0655 16 17.6874V13.5624C16 13.1843 16.3 12.8749 16.6667 12.8749C17.0333 12.8749 17.3333 13.1843 17.3333 13.5624Z"
                      fill="#6A40C3"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_40564_3573">
                      <rect
                        width="24"
                        height="22"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div className="container-carrinho__titulo-texto">
                  Produtos e serviços
                </div>
              </div>
              {carrinho.map((item, index) => (
                <div key={item.idServico + index} className="container-carrinho-item">
                  <div className="container-carrinho-item_info">
                    <div className="container-carrinho-item-info__produto">
                      <div className="container-carrinho-item-info__produto-imagem">
                        {item.imagem ? (
                          <img src={`http://localhost:3000/files/${item.imagem}`} alt={item.nomeItem} />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.5 16.5H7.5V15H16.5V16.5ZM16.5 13.5H7.5V12H16.5V13.5ZM16.5 10.5H7.5V9H16.5V10.5Z"
                              fill="#6A40C3"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="container-carrinho-item-info__produto-nome-preco">
                        <div className="container-carrinho-item-info__produto-nome">
                          {item.nomeItem}
                        </div>
                        <div className="container-carrinho-item-info__produto-preco">
                          {formatarPreco(item.valorUnitario)}
                          
                        </div>
                        {/* <div className='container-carrinho-item-info__produto-unidade'> / {item.unidade}</div> */}
                      </div>
                      <div className="container-carrinho-item-info__produto-quantidade">
                        <div className="container-carrinho-item-info__produto-quantidade-texto">
                          Quantidade
                        </div>
                        <div className="container-carrinho-item-info__produto-quantidade-mais-menos">
                          <div
                            onClick={() => diminuirQuantidade(index)}
                            className="container-carrinho-item-info__produto-quantidade-mais-menos-botoes"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="19"
                              viewBox="0 0 18 19"
                              fill="white"
                            >
                              <path
                                d="M14.3996 9.5L3.59961 9.5"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                              />
                            </svg>
                          </div>
                          <div className="container-carrinho-item-info__produto-quantidade-caixa">
                            <div className="container-carrinho-item-info__produto-quantidade-valor">
                              {item.quantidade}
                            </div>
                          </div>
                          <div
                            onClick={() => aumentarQuantidade(index)}
                            className="container-carrinho-item-info__produto-quantidade-mais-menos-botoes"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="19"
                              viewBox="0 0 18 19"
                              fill="none"
                            >
                              <path
                                d="M8.99961 4.09961L8.99961 14.8996M14.3996 9.49961L3.59961 9.49961"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                  <div className="container-carrinho-item-info__produto-preco-total">
                    <div className="container-carrinho-item-info__produto-preco-total-texto">
                      Preço total:
                    </div>
                    <div className="container-carrinho-item-info__produto-preco-total-desconto">
                      <div className="container-carrinho-item-info__produto-desconto-preco-sem-desconto">
                        {item.valorPromo?
                        <>
                          <div className="container-carrinho-item-info__produto-desconto">
                            {"-" +
                              (
                                item.valorPromo
                                  ? (
                                      ((item.valorUnitario - item.valorPromo) /
                                        item.valorUnitario) *
                                      100
                                    ).toFixed(0)
                                  : 0
                              )
                                .toString()
                                .padStart(2, "0")}
                            %
                          </div>
                          <div className="container-carrinho-item-info__produto-preco-sem-desconto">
                            {formatarPreco(item.valorUnitario*item.quantidade)}
                          </div>
                             </>:''}
                      </div>
                      <div className="container-carrinho-item-info__produto-preco-total-valor">
                        {formatarPreco(item.valorPromo? item.valorPromo * item.quantidade:item.valorUnitario*item.quantidade)}
                      </div>
                    </div>
                    </div>
                    <div
                      onClick={() => removerItem(index)}
                      className="container-carrinho-item-info__lixeira"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="19"
                        viewBox="0 0 16 19"
                        fill="none"
                      >
                        <g clip-path="url(#clip0_40739_1015)">
                          <path
                            d="M4.82857 1.12227C5.02143 0.739063 5.41786 0.5 5.85 0.5H10.15C10.5821 0.5 10.9786 0.739063 11.1714 1.12227L11.4286 1.625H14.8571C15.4893 1.625 16 2.12773 16 2.75C16 3.37227 15.4893 3.875 14.8571 3.875H1.14286C0.510714 3.875 0 3.37227 0 2.75C0 2.12773 0.510714 1.625 1.14286 1.625H4.57143L4.82857 1.12227ZM1.14286 5H14.8571V16.25C14.8571 17.491 13.8321 18.5 12.5714 18.5H3.42857C2.16786 18.5 1.14286 17.491 1.14286 16.25V5ZM4.57143 7.25C4.25714 7.25 4 7.50313 4 7.8125V15.6875C4 15.9969 4.25714 16.25 4.57143 16.25C4.88571 16.25 5.14286 15.9969 5.14286 15.6875V7.8125C5.14286 7.50313 4.88571 7.25 4.57143 7.25ZM8 7.25C7.68571 7.25 7.42857 7.50313 7.42857 7.8125V15.6875C7.42857 15.9969 7.68571 16.25 8 16.25C8.31429 16.25 8.57143 15.9969 8.57143 15.6875V7.8125C8.57143 7.50313 8.31429 7.25 8 7.25ZM11.4286 7.25C11.1143 7.25 10.8571 7.50313 10.8571 7.8125V15.6875C10.8571 15.9969 11.1143 16.25 11.4286 16.25C11.7429 16.25 12 15.9969 12 15.6875V7.8125C12 7.50313 11.7429 7.25 11.4286 7.25Z"
                            fill="#6A40C3"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_40739_1015">
                            <rect
                              width="16"
                              height="18"
                              fill="white"
                              transform="translate(0 0.5)"
                            />
                                                  </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="container-carrinho-item__checkbox">
                  <Checkbox
                    ativado={exibirInstrucoes[index]}
                    funcao={() => setExibirInstrucoes(prev => prev.map((val, i) => i === index ? !val : val))}
                    texto="Incluir instrução para o prestador de serviços"
                  ></Checkbox>
                </div>
                {exibirInstrucoes[index] ? (
                  <div className="container-carrinho-item__instrucoes">
                    <details open className="container-carrinho-item__detalhes">
                      <summary className="container-carrinho-item__sumario">
                        Instrução
                      </summary>
                      <div className="container-carrinho-item__input-instrucoes">
                        <TextArea
                          titulo=""
                          placeholder="Descreva o serviço que você deseja criar"
                          name="descricao-servico"
                          cor="#F3C623"
                          maximo={4000}
                          obrigatorio
                          valor={item.instrucoes}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            const novoCarrinho = [...carrinho];
                            novoCarrinho[index].instrucoes = e.target.value;
                            setCarrinho(novoCarrinho);
                          }}
                          
                        />
                      </div>
                    </details>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
          <div className="container-carrinho__total">
            TOTAL
            <div className="container-carrinho__total-valor">
              {" "}
              {carrinho
                .reduce(
                  (total, item) =>
                    total + (item.valorPromo||item.valorUnitario) * item.quantidade,
                  0
                )
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </div>
          </div>
          <div className="container-carrinho__botao-finalizar-limpar-carrinho">
            <div>
              <Botao
                tamanho="max"
                cor="var(--purple-700)"
                texto="Limpar carrinho"
                funcao={()=> {limparCarrinho()}}
              />
            </div>
            <div>
              <Botao
                tamanho="max"
                cor="var(--purple-700)"
                texto="Finalizar pedido"
                funcao={() =>setModalFinalizar(true)}
              />
            </div>
          </div>
             {modalFinalizar ? (
                <Modal
                        titulo='Finalizar Compra'
                        textoBotao='Finalizar'
                        enviaModal={()=>{setModalFinalizar(false)}}
                        funcaoSalvar={()=>{finalizarPedido()}}
                        >
                            <div style={{gap: '1rem'}} className='d-flex flex-column'>
                                <p>Selecione o evento relacionado a essa compra.</p>
                                <div>

                                    <Select
                                    cabecalho
                                    cabecalhoTexto='Evento'
                                    textoPadrao='Selecione um evento'
                                    esconderValorPadrao
                                    valor={evento}
                                    funcao={(e: ChangeEvent<HTMLSelectElement>) => {
                                        setEvento(e.target.value)
                                        setLocalEntrega(eventos.find((ev) => ev.id == e.target.value)?.local || '')
                                        const eventoSelecionado = eventos.find((ev) => ev.id == e.target.value);
                                        const data = eventoSelecionado?.data;
                                        setDataEntrega(data ? new Date(data) : null);
                                        if(erro.evento.status === true){
                                            setErro(prevState => ({ ...prevState, evento: {...prevState.evento, status:false} }))
                                        }}
                                    }
                                    >
                                    { eventos.map((evento) => {
                                        return (
                                            <option key={evento.id} value={evento.id}>
                                                {evento.nome}
                                            </option>
                                        )
                                    })}   
                                    </Select>
                                    {erro.evento.status ? <ErroCampoForm mensagem={erro.evento.mensagem}/> : ''}
                                </div>
                                <div>

                                    <Input
                                        cabecalho
                                        cabecalhoTexto='Local de entrega'
                                        type='text'
                                        titulo='Local de entrega'
                                        placeholder='Digite o local de entrega'
                                        valor={localEntrega}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {setLocalEntrega(e.target.value)
                                        if(erro.localEntrega.status === true){
                                            setErro(prevState => ({ ...prevState, localEntrega: {...prevState.localEntrega, status:false} }))
                                        }
                                        }}
                                    />
                                    {erro.localEntrega.status ? <ErroCampoForm mensagem={erro.localEntrega.mensagem}/> : ''}
                                </div>
                                <div>

                                    <Input
                                        cabecalho
                                        cabecalhoTexto='Data de entrega'
                                        type='date'
                                        titulo='Data de entrega'
                                        placeholder='Digite a data de entrega'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        const valor = e.target.value;

                                        if (!valor) {
                                            setDataEntrega(null);
                                            return;
                                        }
                                        if (erro.dataEntrega.status === true) {
                                            setErro(prevState => ({ ...prevState, dataEntrega: { ...prevState.dataEntrega, status: false } }))
                                        }
                                        const dataSelecionada = new Date(valor);
                                        if (dataSelecionada < hoje) {
                                            setDataEntrega(hoje);
                                        } else {
                                            setDataEntrega(dataSelecionada);
                                        }
                                        }}
                                        valor={
                                        dataEntrega instanceof Date && !isNaN(dataEntrega.getTime())
                                            ? dataEntrega.toISOString().split('T')[0]
                                            : ''
                                        }
                                        min={hoje.toISOString().split('T')[0]}
                                    />
                                </div>
                                {erro.dataEntrega.status ? <ErroCampoForm mensagem={erro.dataEntrega.mensagem}/> : ''}
                                </div>
                        </Modal>
            ) : (
              ""
            )}
          </>
        ) : pedidoFinalizado ?

      <div className="carrinho-finalizado">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
             <g clip-path="url(#clip0_40607_16373)">
                <path d="M50 9.375C60.7744 9.375 71.1076 13.6551 78.7262 21.2738C86.3449 28.8925 90.625 39.2256 90.625 50C90.625 60.7744 86.3449 71.1076 78.7262 78.7262C71.1076 86.3449 60.7744 90.625 50 90.625C39.2256 90.625 28.8925 86.3449 21.2738 78.7262C13.6551 71.1076 9.375 60.7744 9.375 50C9.375 39.2256 13.6551 28.8925 21.2738 21.2738C28.8925 13.6551 39.2256 9.375 50 9.375ZM50 100C63.2608 100 75.9785 94.7322 85.3553 85.3553C94.7322 75.9785 100 63.2608 100 50C100 36.7392 94.7322 24.0215 85.3553 14.6447C75.9785 5.26784 63.2608 0 50 0C36.7392 0 24.0215 5.26784 14.6447 14.6447C5.26784 24.0215 0 36.7392 0 50C0 63.2608 5.26784 75.9785 14.6447 85.3553C24.0215 94.7322 36.7392 100 50 100ZM72.0703 40.8203C73.9062 38.9844 73.9062 36.0156 72.0703 34.1992C70.2344 32.3828 67.2656 32.3633 65.4492 34.1992L43.7695 55.8789L34.5898 46.6992C32.7539 44.8633 29.7852 44.8633 27.9688 46.6992C26.1523 48.5352 26.1328 51.5039 27.9688 53.3203L40.4688 65.8203C42.3047 67.6562 45.2734 67.6562 47.0898 65.8203L72.0703 40.8203Z" fill="#1A7A56"/>
                </g>
                <defs>
                    <clipPath id="clip0_40607_16373">
                        <rect width="100" height="100" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        </div>
        <div className="carrinho-finalizado__titulo">
            Pedido realizado com sucesso!
        </div>
        <div className="carrinho-finalizado__texto">
            Seu pedido foi realizado com sucesso! Você pode acompanhar o status do seu pedido na seção "Meus Pedidos" do Marketplace, ou então acessar o marketplace para continuar comprando.
        </div>
        <div> 
          <div className='carrinho-finalizado__botoes'> 
            <div style={{width: '225px'}}>
              <Botao
                tamanho="max"
                texto="Continuar comprando"
                funcao={() => {
                window.location.href = "/marketplace";
                }}
                cor='#1A7A56'
              />
            </div> 
            <div style={{width: '225px'}}>
              <Botao
                tamanho="max"
                texto="Ver meus pedidos"
                funcao={() => {
                window.location.href = "/organizador/pedidos";
                }}
                cor='#1A7A56' />
              </div>
            </div>
        </div>


          

        </div>
        
        : (
          <div className="container-carrinho__vazio">
            <FeedbackFormulario
              titulo="Seu carrinho de compras está vazio..."
              texto="Você ainda não possui itens no seu carrinho de compras."
              textoBotao="Ir para o marketplace"
              caminhoBotao="/marketplace"
            >
              <path
                d="M92.3017 1.31176C93.8976 -0.372822 96.5575 -0.444211 98.2421 1.1516C99.9264 2.74747 99.998 5.40654 98.4023 7.09105L12.5879 97.6808C10.992 99.3652 8.33302 99.4377 6.64843 97.8419C4.96401 96.2463 4.89199 93.5871 6.4873 91.9025L92.3017 1.31176ZM35.7666 82.4298C35.9031 82.5504 36.0374 82.674 36.166 82.8039C36.9243 83.5698 37.5261 84.4798 37.9365 85.4806C38.3469 86.4815 38.5585 87.5545 38.5586 88.6378C38.5586 89.7212 38.3469 90.7942 37.9365 91.7951C37.5261 92.7959 36.9242 93.7058 36.166 94.4718C35.4078 95.2377 34.5072 95.8454 33.5166 96.2599C32.5259 96.6744 31.4639 96.8878 30.3916 96.8878C29.3192 96.8878 28.2573 96.6744 27.2666 96.2599C26.2759 95.8453 25.3754 95.2377 24.6172 94.4718C24.5735 94.4277 24.5318 94.3811 24.4892 94.3361L35.7666 82.4298ZM79.3916 80.3878C81.5573 80.3878 83.6345 81.257 85.166 82.8039C86.6975 84.351 87.5585 86.4499 87.5586 88.6378C87.5586 90.8258 86.6974 92.9246 85.166 94.4718C83.6345 96.0187 81.5573 96.8878 79.3916 96.8878C77.2258 96.8878 75.1486 96.0188 73.6171 94.4718C72.0857 92.9246 71.2246 90.8258 71.2246 88.6378C71.2246 86.4499 72.0857 84.351 73.6171 82.8039C75.1486 81.257 77.2259 80.3879 79.3916 80.3878ZM83.4746 66.6379C85.7373 66.6379 87.5584 68.477 87.5586 70.7628C87.5586 73.0488 85.7374 74.8878 83.4746 74.8878H42.9121L50.7275 66.6379H83.4746ZM12.2715 8.88792C16.0144 8.88792 19.3325 11.088 20.8808 14.3879H72.125L30.4453 58.3879H29.4902L29.6474 59.2287L22.8105 66.4474C22.6383 65.9253 22.4989 65.3864 22.3955 64.8332L13.6162 18.2551C13.497 17.6021 12.9349 17.1379 12.2715 17.1379H4.53027C2.26758 17.1377 0.447266 15.2987 0.447266 13.0129C0.447393 10.7272 2.26766 8.88809 4.53027 8.88792H12.2715ZM96.7988 18.0022C97.5897 19.4784 97.8567 21.2582 97.375 23.05L90.3994 49.2267C88.9532 54.6236 84.1046 58.3878 78.5752 58.3879H58.5429L96.7988 18.0022Z"
                fill="#8C5DFF"
              />
            </FeedbackFormulario>
          </div>
        )}
      </div>
    </>
  );
};

export default CarrinhoDeCompras;
