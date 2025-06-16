import { ChangeEvent, useEffect, useState } from 'react'
import api from '../../axios'
import './ServicoMarketplace.css'
import Botao from '../../componentes/Botao/Botao'
import { Modal } from '../../componentes/Modal/Modal'
import CheckBox from '../../componentes/CheckBox/CheckBox'
import TextArea from '../../componentes/TextArea/TextArea'
import InputQuantidade from '../../componentes/InputQuantidade/InputQuantidade'
import Select from '../../componentes/Select/Select'
import ErroCampoForm from '../../componentes/ErroCampoForm/ErroCampoForm'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import Alerta from '../../componentes/Alerta/Alerta'
import Seta from '../../componentes/Seta/Seta'

interface TipoServico {
    idTipoServico: string
    descricaoTipoServico: string
}

const ServicoMarketplace = () => {
    const [nomeServico, setNomeServico] = useState('')
    const [tipoServico, setTipoServico] = useState<TipoServico>({
        idTipoServico: '',
        descricaoTipoServico: ''
    })
    const [imagens, setImagens] = useState<string[]>([])
    const [valor, setValor] = useState(0)
    const [unidade, setUnidade] = useState('')
    const [descricao, setDescricao] = useState('')
    const [quantidade, setQuantidade] = useState(0)
    const [valorTotal, setValorTotal] = useState(0)
    const [evento, setEvento] = useState('')
    const [valorPromo, setValorPromo] = useState(0)

    const [qntMinima, setQntMinima] = useState(0)
    const [qntMaxima, setQntMaxima] = useState(0)
    const [nomePrestador, setNomePrestador] = useState('')
    const [modalFinalizar, setModalFinalizar] = useState(false)
    const [modalAdicionar, setModalAdicionar] = useState(false)
    const [instrucaoModal, setInstrucaoModal] = useState(false)
    const [instrucao, setInstrucao] = useState('')
    const [eventos, setEventos] = useState<any[]>([])
    const [compraOk, setCompraOk] = useState(false)
    const [carrinhoOk, setCarrinhoOk] = useState(false)

    const [erro, setErro] = useState({
        evento: {
            status: false,
            mensagem: 'Selecione um evento para finalizar a compra.'
        }
    })

    const idServico = useParams().idServico || '';




    useEffect(() => {
        const buscarServico = async () => {
            try {
                const servico = await (await api.get(`users/erro/services/${idServico}`)).data
                setNomeServico(servico.nomeServico)
                setTipoServico({ ...servico.tipoServico })
                setImagens([servico.imagem1, servico.imagem2, servico.imagem3, servico.imagem4, servico.imagem5, servico.imagem6].filter((img) => img !== null))
                setValor(servico.valorServico)
                setUnidade(servico.unidadeCobranca)
                setDescricao(servico.descricaoServico)
                setQuantidade(servico.qntMinima)
                setValorTotal(servico.valorPromoServico ? servico.valorPromoServico * servico.qntMinima : servico.valorServico * servico.qntMinima)
                setQntMinima(servico.qntMinima)
                setQntMaxima(servico.qntMaxima)
                setValorPromo(servico.valorPromoServico)

                const prestador = await (await api.get(`users/get-user/${servico.idUsuario}`)).data
                setNomePrestador(prestador.nomeEmpresa)

                const eventoslista = (await api.get(`users/events`)).data
                setEventos(eventoslista.map((evento: any) => { return { id: evento.idEvento, nome: evento.nomeEvento } }))


            }
            catch (error) {
                console.error("Erro ao buscar serviço:", error)
            }
        }
        buscarServico()
    }, [])

    useEffect(() => {
        setValorTotal((valorPromo || valor) * quantidade)
    }, [valor, quantidade])

    const unidadeValor = [
        { id: 1, nome: "Unidade" },
        { id: 2, nome: "Hora" },
        { id: 3, nome: "Turno" },
        { id: 4, nome: "Diaria" },
        { id: 5, nome: "Alugel" },
        { id: 6, nome: "sessão" },
        { id: 7, nome: "pessoa" },
    ]

    const abrirModal = () => {
        setModalAdicionar(!modalAdicionar)
    }


    const modals = {
        adicionarCarrinho:
            <Modal
                titulo='Adicionar ao Carrinho'
                textoBotao='Adicionar'
                enviaModal={abrirModal}
                funcaoSalvar={() => { adicionarCarrinho() }}
            >
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-column gap-3">
                        <div className='servico-marketplace__compra-info-texto'>Produto/Serviço</div>
                        <div>{nomeServico}</div>
                    </div>
                    <div className="d-flex flex-column gap-3">
                        <div className='servico-marketplace__compra-info-texto'>Prestador de serviços</div>
                        <div>{nomePrestador}</div>
                    </div>
                    <div className="d-flex flex-column gap-3">
                        <div className='servico-marketplace__compra-info-texto'>Quantidade</div>
                        <div>{quantidade}</div>
                    </div>
                    <div className="d-flex flex-column gap-3">
                        <div className='servico-marketplace__compra-info-texto'>Preço total</div>
                        <div>R${valorTotal}</div>
                    </div>
                    <div>
                        <CheckBox
                            texto='Incluir instrução para o Prestador de serviços'
                            funcao={() => { setInstrucaoModal(!instrucaoModal); }}
                            ativado={instrucaoModal}
                        />
                    </div>
                    {instrucaoModal ?
                        <div>
                            <TextArea
                                titulo='Instrução (opcional)'
                                placeholder='Digite as instruções...'
                                onChange={(e: ChangeEvent<HTMLInputElement>) => { setInstrucao(e.target.value) }}
                                valor={instrucao}
                                maximo={500}
                                contador
                            />
                        </div> : ''}
                </div>
            </Modal>,
        finalizarCompra:
            <Modal
                titulo='Finalizar Compra'
                textoBotao='Finalizar'
                enviaModal={() => { setModalFinalizar(false) }}
                funcaoSalvar={() => { finalizarCompra() }}
            >
                <div>
                    <p>Selecione o evento relacionado a essa compra.</p>
                    <Select
                        cabecalho
                        cabecalhoTexto='Evento'
                        textoPadrao='Selecione um evento'
                        esconderValorPadrao
                        valor={evento}
                        funcao={(e: ChangeEvent<HTMLSelectElement>) => {
                            setEvento(e.target.value)
                            if (erro.evento.status === true) {
                                setErro(prevState => ({ ...prevState, evento: { ...prevState.evento, status: false } }))
                            }
                        }
                        }
                    >
                        {eventos.map((evento) => {
                            return (
                                <option key={evento.id} value={evento.id}>
                                    {evento.nome}
                                </option>
                            )
                        })}
                    </Select>
                    {erro.evento.status ? <ErroCampoForm mensagem={erro.evento.mensagem} /> : ''}
                    <CheckBox
                        texto='Incluir instrução para o Prestador de serviços'
                        funcao={() => { setInstrucaoModal(!instrucaoModal); }}
                        ativado={instrucaoModal}
                    />
                </div>
                {instrucaoModal ?
                    <div>
                        <TextArea
                            titulo='Instrução (opcional)'
                            placeholder='Digite as instruções...'
                            onChange={(e: ChangeEvent<HTMLInputElement>) => { setInstrucao(e.target.value) }}
                            valor={instrucao}
                            maximo={500}
                            contador
                        />
                    </div> : ''}
            </Modal>
    }


    const formatarPreco = (valor: number) => {
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    const adicionarCarrinho = () => {
        const item = {
            idServico: idServico,
            nomeItem: nomeServico,
            valorUnitario: valor,
            valorPromo: valorPromo,
            quantidade: quantidade,
            instrucoes: instrucao,
            imagem: imagens[0]
        }

        const carrinho = localStorage.getItem('carrinho')
        localStorage.removeItem("carrinho");

        if (carrinho === null) {
            localStorage.setItem('carrinho', JSON.stringify([item]))
        } else {
            const carrinhoArray = JSON.parse(carrinho)
            carrinhoArray.push(item)
            localStorage.setItem('carrinho', JSON.stringify(carrinhoArray))
        }
        setModalAdicionar(false)
        setCarrinhoOk(true);
        setTimeout(() => {
            setCarrinhoOk(false);
        }
            , 10000)
    }

    const finalizarCompra = async () => {
        if (evento === '') {
            setErro(prevState => ({ ...prevState, evento: { ...prevState.evento, status: true } }))
            return
        }

        try {

            const itens = [{
                idServico: idServico,
                nomeItem: nomeServico,
                valorUnitario: valorPromo || valor,
                quantidade: quantidade,
                instrucao: instrucao,
                imagem: imagens[0]
            }]
            await api.post('users/pedidos', {
                idEvento: evento,
                itens: itens
            })
            console.log("Compra finalizada com sucesso")
            setModalFinalizar(false)
            setCompraOk(true);
        }
        catch (error) {
            console.error("Erro ao finalizar compra:", error)
        }
    }
    return (
    <>
            <Helmet>
                <title>{nomeServico} | Marketplace | EventHub</title>
            </Helmet>
            <div className='servico-marketplace'>
                <div>
                    <div className='servico-marketplace__seta'>
                        <Seta caminho='/marketplace' />
                    </div>
                    {compraOk ?
                        <div className="servico-marketplace__finalizado">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                                    <g clip-path="url(#clip0_40607_16373)">
                                        <path d="M50 9.375C60.7744 9.375 71.1076 13.6551 78.7262 21.2738C86.3449 28.8925 90.625 39.2256 90.625 50C90.625 60.7744 86.3449 71.1076 78.7262 78.7262C71.1076 86.3449 60.7744 90.625 50 90.625C39.2256 90.625 28.8925 86.3449 21.2738 78.7262C13.6551 71.1076 9.375 60.7744 9.375 50C9.375 39.2256 13.6551 28.8925 21.2738 21.2738C28.8925 13.6551 39.2256 9.375 50 9.375ZM50 100C63.2608 100 75.9785 94.7322 85.3553 85.3553C94.7322 75.9785 100 63.2608 100 50C100 36.7392 94.7322 24.0215 85.3553 14.6447C75.9785 5.26784 63.2608 0 50 0C36.7392 0 24.0215 5.26784 14.6447 14.6447C5.26784 24.0215 0 36.7392 0 50C0 63.2608 5.26784 75.9785 14.6447 85.3553C24.0215 94.7322 36.7392 100 50 100ZM72.0703 40.8203C73.9062 38.9844 73.9062 36.0156 72.0703 34.1992C70.2344 32.3828 67.2656 32.3633 65.4492 34.1992L43.7695 55.8789L34.5898 46.6992C32.7539 44.8633 29.7852 44.8633 27.9688 46.6992C26.1523 48.5352 26.1328 51.5039 27.9688 53.3203L40.4688 65.8203C42.3047 67.6562 45.2734 67.6562 47.0898 65.8203L72.0703 40.8203Z" fill="#1A7A56" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_40607_16373">
                                            <rect width="100" height="100" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className="servico-marketplace__finalizado-titulo">
                                Pedido realizado com sucesso!
                            </div>
                            <div className="servico-marketplace__finalizado-texto">
                                Seu pedido foi realizado com sucesso! Você pode acompanhar o status do seu pedido na seção "Meus Pedidos" do Marketplace, ou então acessar o marketplace para continuar comprando.
                            </div>
                            <div className='servico-marketplace__finalizado-botoes'>
                                <div style={{ width: '225px' }}>
                                    <Botao
                                        tamanho="max"
                                        texto="Continuar comprando"
                                        funcao={() => {
                                            window.location.href = "/marketplace";
                                        }}
                                        cor='#1A7A56'
                                    />
                                </div>
                                <div style={{ width: '225px' }}>
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
                        :
                        <div className='d-flex flex-column gap-5'>
                            <div>
                                <div>
                                    <div className='d-flex gap-1'>
                                        <a href="" className='hiperlink'>Marketplace</a>
                                        <p>&gt;</p>
                                        {/* <a href="" className='hiperlink'>{tipoServico.descricaoTipoServico}</a>
                            <p>&gt;</p> */}
                                        <a href="" className='hiperlink'>{nomeServico}</a>
                                    </div>
                                    <div className='traco-roxo' />
                                    <h1 className='layout-titulo'>
                                        {nomeServico}
                                    </h1>
                                </div>
                                <div className='d-flex gap-1'>
                                    <p>Oferecido por</p>
                                    <a href="" className='servico-marketplace__prestador'>{nomePrestador}</a>
                                </div>
                            </div>
                            <div className='d-flex gap-5'>
                                <div className='servico-marketplace__imagens-container'>
                                    <img className={'servico-marketplace__imagens'} src={`http://localhost:3000/files/${imagens[0]}`} />
                                </div>
                                <div className='servico-marketplace__compra-info'>
                                    <div className='servico-marketplace__compra-info-titulo'>Informações de compra</div>                                   
                                        <div className='d-flex gap-3'>
                                            <div className='d-flex flex-column gap-2'>
                                                <div className={'servico-marketplace__compra-info-texto'}>Preço</div>
                                                <div className='d-flex align-items-baseline'>
                                                    <div className={`servico-marketplace__compra-info-preco ${valorPromo ? 'servico-marketplace__preço-antigo' : ''}`}>{formatarPreco(valor)}</div>
                                                    <div className='servico-marketplace__compra-info-unidade'>/{unidadeValor[Number(unidade)].nome}</div>
                                                </div>
                                            </div>
                                            {valorPromo ? <div className='d-flex flex-column gap-2'>
                                                <div className='servico-marketplace__compra-info-texto'>Preço promocional</div>
                                                <div className='d-flex align-items-baseline'>
                                                    <div className='servico-marketplace__compra-info-preco'>{formatarPreco(valorPromo)}</div>
                                                    <div className='servico-marketplace__compra-info-unidade'>/{unidadeValor[Number(unidade)].nome}</div>
                                                </div>
                                            </div> : ''}
                                        </div>
                                        <div className='d-flex gap-5'>
                                            <div className='d-flex row flex-column gap-3 col-6'>
                                                <div className='servico-marketplace__compra-info-texto'>quantidade</div>
                                                <div className='d-flex gap-2'>
                                                    {qntMinima !== qntMaxima ?
                                                        <InputQuantidade
                                                            qtdMinima={qntMinima}
                                                            qtdMaxima={qntMaxima}
                                                            qtdAtual={quantidade}
                                                            setQtdAtual={setQuantidade}
                                                            name='quantidade'
                                                        />
                                                        :
                                                        <p>{qntMinima} {unidadeValor[Number(unidade)].nome}</p>}
                                                </div>
                                            </div>
                                            <div className='d-flex flex-column gap-3 col-6'>
                                                <div className='servico-marketplace__compra-info-texto'>Total</div>
                                                <div className='servico-marketplace__compra-info-total'>{formatarPreco(valorTotal)}</div>
                                            </div>
                                        </div>
                                        <div className='d-flex flex-column gap-2'>
                                            <div>
                                                <Botao tamanho='max' texto='Comprar' funcao={() => { setModalFinalizar(true) }} />
                                            </div>
                                            <div>
                                                <Botao texto='Adicionar Carrinho' tamanho='max' vazado funcao={() => { setModalAdicionar(true) }} />
                                            </div>
                                        </div>
                                </div>
                            </div>
                                <div className='servico-marketplace__descricao'>
                                    <div className='servico-marketplace__compra-info-titulo'>descrição</div>
                                    <div className='servico-marketplace__descricao-texto'>{descricao}</div>
                                </div>
                                {modalAdicionar ? modals.adicionarCarrinho : ''}
                                {modalFinalizar ? modals.finalizarCompra : ''}
                                <div className='comprar-servico__alertas'>
                                    {carrinhoOk && (
                                        <Alerta texto="Item adicionado ao carrinho com sucesso!" status="sucesso" ativado={true} />
                                    )}
                                </div>
                        </div>

           }
                        </div>
                </div>
            </>
            )
}

            export default ServicoMarketplace