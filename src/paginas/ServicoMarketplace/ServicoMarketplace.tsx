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

    const [qntMinima, setQntMinima] = useState(0)
    const [qntMaxima, setQntMaxima] = useState(0)
    const [nomePrestador, setNomePrestador] = useState('')
    const [modalFinalizar, setModalFinalizar] = useState(false)
    const [modalAdicionar, setModalAdicionar] = useState(false)
    const [instrucaoModal, setInstrucaoModal] = useState(false)
    const [instrucao, setInstrucao] = useState('')
    const [eventos, setEventos] = useState<any[]>([])

    const [erro, setErro] = useState({
        evento:{
            status: false,
            mensagem: 'Selecione um evento para finalizar a compra.'
         }
    })

    const idServico = useParams().idServico || '';

    


    useEffect(() => {
        const buscarServico = async() =>{
        try{
            const servico = await (await api.get(`users/erro/services/${idServico}`)).data
            setNomeServico(servico.nomeServico)
            setTipoServico({...servico.tipoServico})
            setImagens([servico.imagem1,servico.imagem2,servico.imagem3,servico.imagem4,servico.imagem5,servico.imagem6].filter((img) => img !== null))
            setValor(servico.valorServico)
            setUnidade(servico.unidadeCobranca)
            setDescricao(servico.descricaoServico)
            setQuantidade(servico.qntMinima)
            setValorTotal(servico.valorServico * servico.qntMinima)
            setQntMinima(servico.qntMinima)
            setQntMaxima(servico.qntMaxima)

            const prestador = await (await api.get(`users/get-user/${servico.idUsuario}`)).data
            setNomePrestador(prestador.nomeEmpresa)

            const eventoslista = (await api.get(`users/events`)).data
            setEventos(eventoslista.map((evento:any)=>{return{id:evento.idEvento, nome:evento.nomeEvento}}))
            

        }
        catch(error){
            console.error("Erro ao buscar serviço:", error)
        }
    } 
    buscarServico()
    },[])

    useEffect(() => {
        setValorTotal(valor * quantidade)
    }, [valor, quantidade])

    const unidadeValor = [
    { id:1 ,nome:"Unidade" },
    { id:2 ,nome:"Hora" },
    { id:3 ,nome:"Turno" },
    { id:4 ,nome:"Diaria" },
    { id:5 ,nome:"Alugel" },
    { id:6 ,nome:"sessão" },
    { id:7 ,nome:"pessoa" },
  ]

  const abrirModal = ()=>{
        setModalAdicionar(!modalAdicionar)
    }


    const modals= {
        adicionarCarrinho:
        <Modal 
        titulo='Adicionar ao Carrinho'
        textoBotao='Adicionar'
        enviaModal={abrirModal}
        funcaoSalvar={()=>{adicionarCarrinho()}}
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
                    funcao={() => {setInstrucaoModal(!instrucaoModal);}}
                    ativado ={instrucaoModal}
                    />
                </div>
                {instrucaoModal?
                <div>
                    <TextArea
                    titulo='Instrução (opcional)'
                    placeholder='Digite as instruções...'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {setInstrucao(e.target.value)}} 
                    valor={instrucao}
                    maximo={500}
                    contador
                    />
                </div>:''}
            </div>
        </Modal>,
        finalizarCompra:
        <Modal
        titulo='Finalizar Compra'
        textoBotao='Finalizar'
        enviaModal={()=>{setModalFinalizar(false)}}
        funcaoSalvar={()=>{finalizarCompra()}}
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
                <CheckBox
                    texto='Incluir instrução para o Prestador de serviços'
                    funcao={() => {setInstrucaoModal(!instrucaoModal);}}
                    ativado ={instrucaoModal}
                    />
                </div>
                {instrucaoModal?
                <div>
                <TextArea
                    titulo='Instrução (opcional)'
                    placeholder='Digite as instruções...'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {setInstrucao(e.target.value)}} 
                    valor={instrucao}
                    maximo={500}
                    contador
                />
                </div>:''}
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
    }

    const finalizarCompra = async()=>{
        if (evento === ''){
            setErro(prevState => ({ ...prevState, evento: { ...prevState.evento, status: true}}))
            return
        }
            
        try{
          
            const itens = [{
                idServico:idServico,
                nomeItem: nomeServico,
                valorUnitario: valor,
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
        }
        catch(error){
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
                <div>
                    <div className='d-flex gap-1'>
                        <a href="" className='hiperlink'>Marketplace</a>
                        <p>&gt;</p>
                        {/* <a href="" className='hiperlink'>{tipoServico.descricaoTipoServico}</a>
                        <p>&gt;</p> */}
                        <a href="" className='hiperlink'>{nomeServico}</a>
                    </div>
                    <div className='traco-roxo'/>
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
                        <img className={'servico-marketplace__imagens'}src={`http://localhost:3000/files/${imagens[0]}`}/>
                </div>
                <div className='servico-marketplace__compra-info'>
                    <div className='servico-marketplace__compra-info-titulo'>Informações de compra</div>
                    <div className='d-flex flex-column gap-2'>
                        <div className='servico-marketplace__compra-info-texto'>Preço</div>
                        <div className='d-flex align-items-baseline'>
                            <div className='servico-marketplace__compra-info-preco'>{formatarPreco(valor)}</div>
                            <div className='servico-marketplace__compra-info-unidade'>/{unidadeValor[Number(unidade)].nome}</div>
                        </div>
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
                            <Botao tamanho='max' texto='Comprar' funcao={()=>{setModalFinalizar(true)}}/>
                        </div>
                        <div>
                            <Botao texto='Adicionar Carrinho' tamanho='max' vazado funcao={()=>{setModalAdicionar(true)}}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='servico-marketplace__descricao'>
                <div className='servico-marketplace__compra-info-titulo'>descrição</div>
                <div className='servico-marketplace__descricao-texto'>{descricao}</div>
            </div>
            {modalAdicionar ?  modals.adicionarCarrinho :''}
            {modalFinalizar ? modals.finalizarCompra :''}
        </div>
    </>
  )
}

export default ServicoMarketplace