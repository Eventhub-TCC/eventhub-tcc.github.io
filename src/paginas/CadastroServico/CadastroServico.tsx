import { ChangeEvent, useState, useRef, useEffect } from "react"
import IndicadorDePassos from "../../componentes/IndicadorDePassos/IndicadorDePassos"
import './CadastroServico.css'
import Instrucao from "../../componentes/Instrucao/Instrucao"
import Input from "../../componentes/Input/Input"
import Select from "../../componentes/Select/Select"
import TextArea from "../../componentes/TextArea/TextArea"
import Botao from "../../componentes/Botao/Botao"
import CheckBox from '../../componentes/CheckBox/CheckBox'
import { PatternFormat, NumericFormat } from "react-number-format"
import api from "../../axios"
import ErroCampoForm from "../../componentes/ErroCampoForm/ErroCampoForm"
import Alerta from "../../componentes/Alerta/Alerta"
import { useNavigate } from "react-router"


interface tipoServico{
  idTipoServico: number
  descricaoTipoServico: string
}

interface AvisoItem {
  status: boolean;
  mensagem: string;
}

interface Avisos {
  [key: string]: AvisoItem;
}


const CadastroServico = () => {

  const [nomeServico, setNomeServico] = useState('')
  const [tipoServico, setTipoServico] = useState('')
  const [descricaoServico, setDescricaoServico] = useState('')
  const [imagensServico, setImagensServico] = useState<File[]>([])
  const [imagemPreview, setImagemPreview] = useState<string[]>([])
  const [unidadeCobranca, setUnidadeCobranca] = useState(0)
  const [valorServico, setValorServico] = useState(NaN)
  const [qntMinima, setQntMinima] = useState(NaN)
  const [qntMaxima, setQntMaxima] = useState(NaN)

  const [erro, setErro] = useState({
    imagemObrigatoria:{status:false, mensagem:'Selecione pelo menos uma imagem'}
  })

  const [aviso, setAviso] = useState<Avisos>({
    limiteImagem:{status:false, mensagem:'Limite de 6 imagens atingido'},
    valorServico:{status:false, mensagem:'Valor do serviço deve ser maior que 0'},
    qntMinima:{status:false, mensagem:'Quantidade mínima deve ser maior que 0'}
  })

  const [qntFixa, setQntFixa] = useState(false)
  const [categoriaServico, setCategoriaServico] = useState<tipoServico[]>([])
  const [passoAtual, setPassoAtual] = useState(0)

  const inputImagemRef = useRef<HTMLInputElement>(null)

  const qntPassos = 3

  const maxImagensServico = 6

  const navigate = useNavigate()

  useEffect(()=>{
    const preview = imagensServico.map((imagem)=>{
      return URL.createObjectURL(imagem)
    })
    setImagemPreview(preview)
  },[imagensServico])

 useEffect(()=>{
  const buscarCategoriaServico = async () => {
    try{
      const resposta = await api.get('/users/tipo-servico')
      setCategoriaServico(resposta.data)
    }
    catch(erro){
      console.log(erro)
    }
  }
  buscarCategoriaServico()
 },[])

 useEffect(()=>{
  setTimeout(()=>{
    const newState = {...aviso}
    Object.entries(aviso).forEach(([key,value])=>{
      if(value.status){
      newState[key].status = false
      setAviso(newState)
      }
    })
},10000)
 },[aviso])

  const unidadeValor = [
    { id:1 ,nome:"Unidade" },
    { id:2 ,nome:"Hora" },
    { id:3 ,nome:"Turno" },
    { id:4 ,nome:"Diaria" },
    { id:5 ,nome:"Alugel" },
    { id:6 ,nome:"sessão" },
    { id:7 ,nome:"pessoa" },
  ]
  

  const instrucao = [
    {
      titulo:'Detalhes do Serviço',
      texto:'Preencha os campos com os detalhes do serviço que você deseja criar.',
      campos: [
        <Input
        cabecalho
        cabecalhoTexto='Nome do Serviço'
        tipo='text'
        dica='digite um nome para o serviço'
        valor={nomeServico}
        cor='#F3C623'
        onChange={(e: ChangeEvent<HTMLInputElement>)=>{setNomeServico(e.target.value)}}
        />,
        <Select
        cabecalho
        cabecalhoTexto='Categoria do serviço'
        textoPadrao='Selecione uma categoria'
        cor='#F3C623'
        esconderValorPadrao
        valor={tipoServico}
        required
        onChange={(e: ChangeEvent<HTMLSelectElement>)=>{setTipoServico(e.target.value)}}
        >
          {categoriaServico.map((categoria)=>{
            return <option key={categoria.idTipoServico} value={categoria.idTipoServico}>{categoria.descricaoTipoServico}</option>
          })}
        </Select>,
        <TextArea
        titulo='Descrição do Serviço'
        placeholder='Descreva o serviço que você deseja criar'
        name='descricao-servico'
        cor='#F3C623'
        valor={descricaoServico}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>)=>{setDescricaoServico(e.target.value)}}
        maximo={4000}
        obrigatorio
        />
      ]
    },
    {
      titulo:'Imagens do Serviço',
      texto:'Adicione imagens que ajudem a mostrar o que você oferece. Se você aluga um espaço, mostre fotos do local. Se for alimentação, inclua fotos dos pratos. Para outros tipos de serviço, escolha imagens que ajudem a transmitir sua proposta de forma clara e atrativa. Essas imagens ajudam organizadores a entenderem melhor o seu serviço. Dica: use fotos de boa qualidade e, se quiser, adicione mais de uma para mostrar diferentes aspectos do que você oferece.',
      campos: [
        <input
        type='file'
        ref={inputImagemRef}
        className='d-none'
        accept='image/*'
        multiple
        onChange={(e: ChangeEvent<HTMLInputElement>)=>{
          if(e.target.files!.length > maxImagensServico){
            inputImagemRef.current!.value = ''
            setAviso(prevState=>({...prevState, limiteImagem:{...prevState.limiteImagem,status:true}}))
            return
          }
          const newState = [...imagensServico,...Array.from(e.target.files || [])]
          if(newState.length > maxImagensServico){
            inputImagemRef.current!.value = ''
            setAviso(prevState=>({...prevState, limiteImagem:{...prevState.limiteImagem,status:true}}))
            return
          }
          setImagensServico(newState)
        }}
        />
      ]
    },
    {
      titulo:'Valor e Condições de Contratação',
      texto:'Informe o valor do seu serviço, como ele será cobrado e os limites de contratação. O preço pode ser definido por unidade, hora ou outro critério. A quantidade mínima e máxima ajuda a garantir que o serviço seja contratado dentro da sua capacidade, por exemplo, definir um mínimo de 50 unidades para doces ou um máximo de 100 cadeiras para aluguel.',
      campos: [
        <Select 
        cabecalho
        cabecalhoTexto = 'Unidade de cobrança'
        textoPadrao = 'Selecione a Unidade'
        cor='#F3C623'
        esconderValorPadrao
        required
        value={unidadeCobranca}
        onChange = {(e: ChangeEvent<HTMLSelectElement>)=>{
            setUnidadeCobranca(Number(e.target.value))
          }}
        >
          {unidadeValor.map((unidade)=>{
            return <option id={unidade.id.toString()} value={unidade.id}>{unidade.nome}</option>
          })}
        </Select>,
        <NumericFormat
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        thousandSeparator="."
        prefix="R$ "
        allowNegative={false}
        customInput={Input}
        value={valorServico}
        onValueChange={(values) => {
          setValorServico(values.floatValue || 0);
        }}
        cabecalho
        cabecalhoTexto='Valor do Serviço'
        dica='Digite o valor do Serviço'
        cor='#F3C623'
        />,
        <PatternFormat
        format='#########'
        value={qntMinima}
        onValueChange={(values) => {setQntMinima(Number(values.value))}}
        customInput={Input}
        cabecalho
        cabecalhoTexto='Quantidade mínima'
        dica='Digite a quantidade mínima do Serviço'
        cor='#F3C623'
        />,
          <PatternFormat
        format='#########'
        value={qntMaxima}
        onValueChange={(values) => {setQntMaxima(Number(values.value))}}
        customInput={Input}
        cabecalho
        cabecalhoTexto='Quantidade Máxima'
        dica='Digite a quantidade máxima do Serviço'
        cor='#F3C623'
        />,
         <PatternFormat
        format='#########'
        value={qntMinima}
        onValueChange={(values) => {setQntMinima(Number(values.value));setQntMaxima(Number(values.value))}}
        customInput={Input}
        cabecalho
        cabecalhoTexto='Quantidade'
        dica='Digite a quantidade do Serviço'
        cor='#F3C623'
        />,
          <CheckBox
          ativado={qntFixa}
          texto='Este serviço tem quantidade fixa'
          cor='#F3C623'
          funcao={()=>{
            setQntFixa(!qntFixa)
            if(!qntFixa){
              setQntMaxima(qntMinima)
            }
          }}
          />

      ]
    }
  ]
  const etapa = [
    <div className='row g-3'>
      <div className="col-lg-6">
        {instrucao[passoAtual].campos[0]}
      </div>
      <div className="col-lg-6">
        {instrucao[passoAtual].campos[1]}
      </div>
      <div>
        {instrucao[passoAtual].campos[2]}
      </div>
    </div>,

    <div className='cadastro-servico__etapa-imagem'>
      {imagensServico.length === 0 ?
      <div className="d-flex flex-column justify-content-center align-items-center cadastro-servico__etapa-imagem-sem-imagem">
          <div className="cadastro-servico__imagem-info">
            <div><i className="fa-solid fa-image cadastro-servico__imagem-icone"></i></div>
            <div>Nenhuma imagem selecionada</div>
            <div>clique no botão abaixo para adicionar</div>
          </div>
        <div className="cadastro-servico__imagem-botao">
          <Botao
            texto='Selecionar Imagens'
            funcao={()=>{inputImagemRef.current?.click()}}
            cor='#F3C623'
          />
        </div>
        {erro.imagemObrigatoria.status ? <ErroCampoForm mensagem={erro.imagemObrigatoria.mensagem} /> : ''}
    </div>
    :
    <div className='d-flex row g-4 justify-content-center cadastro-servico__etapa-imagem-com-imagem'>
       {
       imagemPreview.map((preView,index)=>{
        return <div className="col-12 col-sm-6 cadastro-servico__container-imagem">
          <img key={preView} src={preView} alt="imagem do serviço" className="cadastro-servico__imagem-preview"/>
          <button className='cadastro-servico__remover-image' type="button" onClick={()=>{
            inputImagemRef.current!.value = ''
            setImagensServico(imagensServico.filter((_,i)=>i !== index))
            console.log(imagensServico)
            }}>
            <i className="fa-solid fa-xmark cadastro-servico__remover-image-icone"></i>
          </button>
        </div>
      })
      }
      {imagensServico.length < maxImagensServico ? 
      <button 
      type="button"
      onClick={()=>{inputImagemRef.current?.click()}}
      className="col-12 col-sm-6 cadastro-servico__adicionar-imagem">
        <div className="cadastro-servico__adicionar-imagem-info">
          <div><i className="fa-solid fa-plus cadastro-servico__adicionar-imagem-icone"></i></div>
          <div>Adicionar mais imagens</div>
        </div>
      </button>:''}
    </div>
      }
      {instrucao[passoAtual].campos[0]}
    </div>,

    <div className='d-flex row g-3'>
      <div className='col-lg-6'>
        {instrucao[passoAtual].campos[0]}
      </div>
      <div className='col-lg-6'>
        {instrucao[passoAtual].campos[1]}
      </div>
      { qntFixa ?
          <div>
            {instrucao[passoAtual].campos[4]}
          </div>
          :
          <>
            <div className='col-lg-6'>
              {instrucao[passoAtual].campos[2]}
            </div>
            <div className='col-lg-6'>
              {instrucao[passoAtual].campos[3]}
            </div>
          </>
      }
      <div className='col-lg-6'>
        {instrucao[passoAtual].campos[5]}
      </div>
    </div>
  ]

  const CadastroServico = async () => {
    try{
      const formData = new FormData()
      imagensServico.forEach((imagem)=>{
        formData.append('files',imagem)
      })
      formData.append('nomeServico', nomeServico)
      formData.append('idTipoServico', tipoServico)
      formData.append('descricaoServico', descricaoServico)
      formData.append('unidadeCobranca', String(unidadeCobranca))
      formData.append('valorServico', String(valorServico))
      formData.append('qntMinima', String(qntMinima))
      formData.append('qntMaxima', String(qntMaxima))
 
    console.log('dados do serviço:')
    await api.post('/users/services', formData)
    console.log('Serviço cadastrado com sucesso!')
    navigate('/prestador/meus-servicos')
    }
    catch(erro){
      console.log('erro ao cadastrar Serviço: ',erro)
    }
  }

  const onSubimit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(passoAtual+1 < qntPassos){
      if(passoAtual === 1 && imagensServico.length === 0){
        setErro(prevState=>({...prevState, imagemObrigatoria:{...prevState.imagemObrigatoria,status:true}}))
        console.log(erro.imagemObrigatoria.status)
        return
      }
      setPassoAtual(passoAtual+1)
    }
    else{
      if(valorServico <= 0){
        setAviso(prevState=>({...prevState, valorServico:{...prevState.valorServico,status:true}}))
        return
      }
      if(qntMinima <= 0){
        setAviso(prevState=>({...prevState, qntMinima:{...prevState.qntMinima,status:true}}))
        return
      }
      CadastroServico()
    }
  }

  return (
    <div className="cadastro-servico">
      <h1 className="layout-titulo">Criar serviço</h1>
      <form onSubmit={onSubimit} className="cadastro-servico__formulario" encType="multipart/form-data">
        <IndicadorDePassos qntPassos = {qntPassos} passoAtual={passoAtual+1} cor = '#F3C623'/>
        <Instrucao texto={instrucao[passoAtual].texto} titulo={instrucao[passoAtual].titulo} cor='#FFB22C'/>
        <div>
          {etapa[passoAtual]}
        </div>
        <div className="d-flex justify-content-center gap-2">
          {passoAtual !== 0 ? 
          <div>
            <Botao 
            texto='Anterior'
            funcao={()=>{setPassoAtual(passoAtual-1)}}
            cor='#F3C623'
            />
          </div> : ''}
          <div>
            <Botao 
            texto={passoAtual+1 < qntPassos ?'Próximo':'Cadastrar'}
            submit
            cor='#F3C623'
            />
          </div>
        </div>
      </form>
      { aviso.limiteImagem.status ? <div className="cadastro-servico__alerta"><Alerta ativado={aviso.limiteImagem.status} status='aviso' texto={aviso.limiteImagem.mensagem}/> </div>: ''}
      { aviso.valorServico.status ? <div className="cadastro-servico__alerta"><Alerta ativado={aviso.valorServico.status} status='aviso' texto={aviso.valorServico.mensagem}/> </div>: ''}
      { aviso.qntMinima.status ? <div className="cadastro-servico__alerta"><Alerta ativado={aviso.qntMinima.status} status='aviso' texto={aviso.qntMinima.mensagem}/> </div>: ''}
    </div>
  )
}
export default CadastroServico
