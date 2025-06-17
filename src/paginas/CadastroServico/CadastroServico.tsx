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
import { Helmet } from "react-helmet-async"
import Seta from "../../componentes/Seta/Seta"
import axios from "axios"
import { use } from "framer-motion/client"


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
  const [localizacaoServico, setLocalizacaoServico] = useState({
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  })

  const [erro, setErro] = useState({
    imagemObrigatoria:{status:false, mensagem:'Selecione pelo menos uma imagem'},
    CepInvalido:{status:false, mensagem:'CEP inválido'}
  })

  const [aviso, setAviso] = useState<Avisos>({
    limiteImagem:{status:false, mensagem:'Limite de 6 imagens atingido'},
    valorServico:{status:false, mensagem:'Valor do serviço deve ser maior que 0'},
    qntMinima:{status:false, mensagem:'Quantidade mínima deve ser maior que 0'},
    cepNaoEncontrado:{status:false, mensagem:'CEP não encontrado'}
  })

  const [qntFixa, setQntFixa] = useState(false)
  const [categoriaServico, setCategoriaServico] = useState<tipoServico[]>([])
  const [passoAtual, setPassoAtual] = useState(0)
  const [travado, setTravado] = useState(false)

  const inputImagemRef = useRef<HTMLInputElement>(null)

  const qntPassos = tipoServico === '5'? 4 : 3

  const maxImagensServico = 6

  const navigate = useNavigate()

   const buscarCep = async (cep: string) => {
    try { await axios.get(`https://viacep.com.br/ws/${cep}/json/`).then(res => {
      const local = res.data
      if(local.erro) 
        setAviso(prevState => ({...prevState, cepNaoEncontrado:{...prevState.cepNaoEncontrado, status: true}}))
      else {
      setLocalizacaoServico( prevState => ({...prevState, endereco: local.logradouro, bairro: local.bairro, cidade: local.localidade, estado: local.uf}))
      setTravado(true)
      setErro(prevState => ({...prevState, CepInvalido:{...prevState.CepInvalido, status: false}}))
      }
    })}
    catch (error) { console.log('ocorreu algum erro: ',error) }
  }

  useEffect(() => {
    if(localizacaoServico.cep.length===8) 
      buscarCep(localizacaoServico.cep)
    if(localizacaoServico.cep.length===0) 
      setErro(prevState => ({...prevState, CepInvalido:{...prevState.CepInvalido, status: false}}))
    else
      setTravado(false)
  }, [localizacaoServico.cep])

  useEffect(() => {
    if(tipoServico !=='5'){
      setLocalizacaoServico({
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      })
    }
  },[tipoServico])

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
  
   const estadosBrasil = [
    "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", 
    "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", 
    "RO", "RR", "RS", "SC", "SE", "SP", "TO"
  ];

  const instrucao = [
    {
      titulo:'Detalhes do Serviço',
      texto:'Preencha os campos com os detalhes do serviço que você deseja criar. Um serviço pode representar tanto a prestação de um serviço tradicional — como DJ, buffet, fotografia, segurança, decoração, etc. — quanto a entrega de um produto físico relacionado ao evento, como lembrancinhas, arranjos florais, bolos ou doces e salgados personalizados.',
      campos: [
        <Input
        cabecalho
        cabecalhoTexto='Nome do serviço'
        tipo='text'
        dica='Digite um nome para o serviço'
        valor={nomeServico}
        cor='#F3C623'
        onChange={(e: ChangeEvent<HTMLInputElement>)=>{setNomeServico(e.target.value)}}
        name='nome-servico'
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
        name='categoria-servico'
        >
          {categoriaServico.map((categoria)=>{
            return <option key={categoria.idTipoServico} value={categoria.idTipoServico}>{categoria.descricaoTipoServico}</option>
          })}
        </Select>,
        <TextArea
        titulo='Descrição do serviço'
        placeholder='Digite uma descrição para o seu serviço...'
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
        textoPadrao = 'Selecione a unidade'
        cor='#F3C623'
        esconderValorPadrao
        required
        value={unidadeCobranca}
        onChange = {(e: ChangeEvent<HTMLSelectElement>)=>{
            setUnidadeCobranca(Number(e.target.value))
          }}
        name='unidade-cobranca'
        >
          {unidadeValor.map((unidade)=>{
            return <option id={unidade.id.toString()} key={unidade.id} value={unidade.id}>{unidade.nome}</option>
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
        cabecalhoTexto='Preço do serviço por unidade'
        dica='Digite o valor do serviço'
        cor='#F3C623'
        name='valor-servico'
        />,
        <PatternFormat
        format='#########'
        value={qntMinima}
        onValueChange={(values) => {setQntMinima(Number(values.value))}}
        customInput={Input}
        cabecalho
        cabecalhoTexto='Quantidade mínima'
        dica='Digite a quantidade mínima do serviço'
        cor='#F3C623'
        name='qnt-minima'
        />,
          <PatternFormat
        format='#########'
        value={qntMaxima}
        onValueChange={(values) => {setQntMaxima(Number(values.value))}}
        customInput={Input}
        cabecalho
        cabecalhoTexto='Quantidade máxima'
        dica='Digite a quantidade máxima do serviço'
        cor='#F3C623'
        name='qnt-maxima'
        />,
         <PatternFormat
        format='#########'
        value={qntMinima}
        onValueChange={(values) => {setQntMinima(Number(values.value));setQntMaxima(Number(values.value))}}
        customInput={Input}
        cabecalho
        cabecalhoTexto='Quantidade'
        dica='Digite a quantidade do serviço'
        cor='#F3C623'
        name='qnt'
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
          name='qnt-fixa'
          />

      ]
    },
    {
      titulo:'Localização do Serviço',
            texto:'Preencha os campos com a localização do espaço que será realizado seu serviço.',
            campos:[
              <PatternFormat
                format={'#####-###'}
                mask={'_'}
                value={localizacaoServico.cep}
                onValueChange={(values) => {
                  setLocalizacaoServico({...localizacaoServico, cep: values.value });
                }}
                customInput={Input}
                cabecalho
                cabecalhoTexto={`CEP`} 
                placeholder='Digite o CEP do local' 
                name='cep'
                cor='#F3C623'
              />,
              <Input 
                cabecalho 
                cabecalhoTexto={`Endereço`}
                placeholder='Digite o endereço do local' 
                tipo='text' 
                valor={localizacaoServico.endereco} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => {}} 
                disabled={travado} 
                name='endereco'
                cor='#F3C623'
              />,
              <PatternFormat   
                format={'#####'}                
                value={localizacaoServico.numero}
                onValueChange={(values) => {
                  setLocalizacaoServico({...localizacaoServico, numero: values.value });
                } }
                customInput={Input}
                cabecalho 
                cabecalhoTexto={`Número`}
                placeholder='Digite o número do local'     
                name='numero-endereco'  
                cor='#F3C623'
              />,
              <Input 
                cabecalho 
                cabecalhoTexto={'Complemento (opcional)'} 
                placeholder='Digite o complemento do local' 
                tipo='text' 
                valor={localizacaoServico.complemento} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setLocalizacaoServico({...localizacaoServico, complemento: e.target.value });
                }} 
                obrigatorio={false}
                name='complemento'
                cor='#F3C623'
              />,
              <Input 
                cabecalho 
                cabecalhoTexto={`Bairro`} 
                placeholder='Digite o bairro do local do evento' 
                tipo='text' 
                valor={localizacaoServico.bairro} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setLocalizacaoServico({...localizacaoServico, bairro: e.target.value });
                }} 
                disabled={travado} 
                name='bairro'
                cor='#F3C623'
              />,
              <Input 
                cabecalho 
                cabecalhoTexto={`Cidade`} 
                placeholder='Digite a cidade do local do evento' 
                tipo='text' 
                valor={localizacaoServico.cidade} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setLocalizacaoServico({...localizacaoServico, cidade: e.target.value });
                }} 
                disabled={travado} 
                name='cidade'
                cor='#F3C623'
              />,
              <Select 
                cabecalho 
                cabecalhoTexto={`UF`} 
                textoPadrao='Selecione a UF'
                dica='Selecione a UF'
                valor={localizacaoServico.estado} 
                funcao={(e: ChangeEvent<HTMLSelectElement>) => {
                  setLocalizacaoServico({...localizacaoServico, estado: e.target.value });
                }} 
                disabled={travado}
                required
                esconderValorPadrao={false}
                name='estado'
                cor='#F3C623'
              >
                  {estadosBrasil.map((estado, index) => <option key={index} value={estado}>{estado}</option>)}
              </Select>
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
            <div className="cadastro-servico__imagem-info-titulo">Nenhuma imagem selecionada</div>
            <div className="cadastro-servico__imagem-info-subtitulo">Clique no botão abaixo para adicionar</div>
          </div>
        <div className="cadastro-servico__imagem-botao">
          <Botao
            texto='Selecionar Imagens'
            funcao={()=>{inputImagemRef.current?.click()}}
            cor='#F3C623'
            tamanho='min'
          />
        </div>
        {erro.imagemObrigatoria.status ? <ErroCampoForm mensagem={erro.imagemObrigatoria.mensagem} /> : ''}
    </div>
    :
    <div className='d-flex row g-4 justify-content-center cadastro-servico__etapa-imagem-com-imagem'>
       {
       imagemPreview.map((preView,index)=>{
        return <div className="col-12 col-sm-6 cadastro-servico__container-imagem" key={index}>
          <img key={preView} src={preView} alt="imagem do serviço" className="cadastro-servico__imagem-preview"/>
          <button className='cadastro-servico__remover-image' type="button" onClick={()=>{
            inputImagemRef.current!.value = ''
            setImagensServico(imagensServico.filter((_,i)=>i !== index))
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
    </div>,

    <div className='row g-4'>
      <div className='col-lg-3'>
        {instrucao[passoAtual].campos && instrucao[passoAtual].campos[0]}
        {erro.CepInvalido.status?<ErroCampoForm mensagem='CEP inválido'/>:''}
      </div>
      <div className='col-lg-9'>
        {instrucao[passoAtual].campos && instrucao[passoAtual].campos[1]}
      </div>
      <div className='col-lg-3'>
        {instrucao[passoAtual].campos && instrucao[passoAtual].campos[2]}
      </div>
      <div className='col-lg-9'>
        {instrucao[passoAtual].campos && instrucao[passoAtual].campos[3]}
      </div>
      <div>
        {instrucao[passoAtual].campos && instrucao[passoAtual].campos[4]}
      </div>
      <div className='col-lg-9'>
        {instrucao[passoAtual].campos && instrucao[passoAtual].campos[5]}
      </div>
      <div className='col-lg-3'>
        {instrucao[passoAtual].campos && instrucao[passoAtual].campos[6]}
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
      formData.append('servicoCep', localizacaoServico.cep)
      formData.append('servicoEndereco', localizacaoServico.endereco)
      formData.append('servicoNumero', localizacaoServico.numero)
      formData.append('servicoComplemento', localizacaoServico.complemento)
      formData.append('servicoBairro', localizacaoServico.bairro)
      formData.append('servicoCidade', localizacaoServico.cidade)
      formData.append('servicoEstado', localizacaoServico.estado)
 
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
      if(localizacaoServico.cep.length !== 8 && qntPassos === 4){
        setErro(prevState=>({...prevState, CepInvalido:{...prevState.CepInvalido,status:true}}))
        return
      }
      CadastroServico()
    }
  }

  return (
    <>
      <Helmet>
        <title>Criar Serviço | EventHub</title>
      </Helmet>
      <div className="cadastro-servico">
        <div className='cadastro-servico__seta'>
          <Seta tipo='prestador' caminho='/prestador/meus-servicos'/>
        </div>
        <h1 className="layout-titulo">Criar serviço</h1>
        <form onSubmit={onSubimit} className="cadastro-servico__formulario" encType="multipart/form-data">
          <IndicadorDePassos qtdPassos = {qntPassos} passoAtual={passoAtual+1} cor = '#F3C623'/>
          <Instrucao texto={instrucao[passoAtual].texto} titulo={instrucao[passoAtual].titulo} cor='#FFB22C'/>
          <div>
            {etapa[passoAtual]}
          </div>
          <div className="cadastro-servico__botoes d-flex justify-content-center gap-2">
            {passoAtual !== 0 ? 
            <div>
              <Botao 
              texto='Anterior'
              funcao={()=>{setPassoAtual(passoAtual-1)}}
              cor='#F3C623'
              tamanho='max'
              />
            </div> : ''}
            <div>
              <Botao 
              texto={passoAtual+1 < qntPassos ?'Próximo':'Cadastrar'}
              submit
              cor='#F3C623'
              tamanho='max'
              />
            </div>
          </div>
        </form>
        { aviso.limiteImagem.status ? <div className="cadastro-servico__alerta"><Alerta ativado={aviso.limiteImagem.status} status='aviso' texto={aviso.limiteImagem.mensagem}/> </div>: ''}
        { aviso.valorServico.status ? <div className="cadastro-servico__alerta"><Alerta ativado={aviso.valorServico.status} status='aviso' texto={aviso.valorServico.mensagem}/> </div>: ''}
        { aviso.qntMinima.status ? <div className="cadastro-servico__alerta"><Alerta ativado={aviso.qntMinima.status} status='aviso' texto={aviso.qntMinima.mensagem}/> </div>: ''}
        { aviso.cepNaoEncontrado.status ? <div className="cadastro-servico__alerta"><Alerta ativado={aviso.cepNaoEncontrado.status} status='aviso' texto={aviso.cepNaoEncontrado.mensagem}/> </div>: ''}
      </div>
    </>
  )
}
export default CadastroServico
