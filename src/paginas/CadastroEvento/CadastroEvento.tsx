import { ChangeEvent, FormEvent, useState, useEffect, useRef, ReactElement } from 'react'
import './CadastroEvento.css'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import Select from '../../componentes/Select/Select'
import axios from 'axios'
import Instrucao from '../../componentes/Instrucao/Instrucao'
import IndicadorDePassos from '../../componentes/IndicadorDePassos/IndicadorDePassos'
import TextArea from '../../componentes/TextArea/TextArea'
import './CadastroEvento.css'
import ErroCampoForm from '../../componentes/ErroCampoForm/ErroCampoForm'

interface Instrucao {
    titulo: string;
    texto: string;
    campos?: ReactElement[];
}

const CadastroEvento = () => {
  const [tipoEvento, setTipoEvento] = useState(0)
  const [nomeEvento, setNomeEvento] = useState('')
  const [descricaoEvento, setDescricaoEvento] = useState('')
  const [imagemEvento, setImagemEvento] = useState<File|null>(null)
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFim, setHoraFim] = useState('')
  const [dataEvento, setDataEvento] = useState<Date|null>(null)
  const [localEvento, setLocalEvento] = useState({
    cep: '',
    endereco: '',
    numero: 0,
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  })

  const [preView, setPreview] = useState('')

  const [passoAtual, setPassoAtual] = useState(0)
  const [travado, setTravado] = useState(false)

  const [erroCampo, setErroCampo] = useState({
    nomeEvento : false,
    tipoEvento : false,
    descricaoEvento : false,
    dataEvento : false,
    horaInicio : false,
    horaFim : false,
    cep : false,
    endereco : false,
    numero : false,
    complemento : false,
    bairro : false,
    cidade : false,
    estado : false
  })

  const inputImagemref = useRef<HTMLInputElement>(null)

  const buscarCep = async (cep: string) => {
    try { await axios.get(`https://viacep.com.br/ws/${cep}/json/`).then(res => {
      const local = res.data
      if(local.erro) 
        setErroCampo(prevState => ({...prevState, cep: true}))
      else {
      setLocalEvento( prevState => ({...prevState, endereco: local.logradouro, bairro: local.bairro, cidade: local.localidade, estado: local.uf}))
      setTravado(true)
      setErroCampo(prevState => ({...prevState, cep: false}))
      }
    })}
    catch (error) { console.log('ocorreu algum erro: ',error) }
  }

  useEffect(() => {
    if(localEvento.cep.length===8) 
      buscarCep(localEvento.cep)
    else
      setTravado(false)
  }, [localEvento.cep])

  const qntPassos = 4

  const botaoProximo = <Botao texto='Próximo' tamanho='max' submit/>
  const botaoCadastrar = <Botao texto='Cadastrar' submit tamanho='max'/>

  const tiposDeEventos = [
    {id:'1', tipo:'Aniversario'},
    {id:'2', tipo:'Casamento'},
    {id:'3', tipo:'Corporativo'},
    {id:'4', tipo:'Cultural'}
  ]

  const estadosBrasil = [
    "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", 
    "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", 
    "RO", "RR", "RS", "SC", "SE", "SP", "TO"
  ];

  const instrucoes: Instrucao[] = [
    {
      titulo:'Detalhes do Evento',
      texto:'Preencha os campos com detalhes do evento que deseja criar.',
      campos:[
        <Input 
          cabecalho cabecalhoTexto='Nome do Evento' 
          placeholder='Digite o nome do seu evento' 
          tipo='text' 
          valor={nomeEvento} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNomeEvento(e.target.value)} 
        />,
        <Select 
          cabecalho 
          cabecalhoTexto='Tipo de Evento'  
          textoPadrao='Selecione o tipo de evento'
          valor={tipoEvento} 
          funcao={(e: ChangeEvent<HTMLSelectElement>) => setTipoEvento(Number(e.target.value))}
          required={true}
        >
              {tiposDeEventos.map(tipo => <option value={tipo.id}>{tipo.tipo}</option>)}
        </Select>,
        <TextArea 
          titulo='Descrição do evento (opcional)' 
          placeholder='Digite a descrição do seu evento' 
          onChange={(e:ChangeEvent<HTMLInputElement>)=>setDescricaoEvento(e.target.value)} 
          valor={descricaoEvento}
        />
      ]
    },
    {
      titulo:'Imagem do evento',
      texto:'Adicione uma imagem que represente o seu evento. Ela pode ser uma foto do local onde o evento acontecerá, uma imagem relacionada ao tema ou até mesmo a foto de uma pessoa que esteja envolvida. Fique à vontade para escolher a que melhor transmita a essência do seu evento.',
      campos:[
        <input 
          type='file' 
          className='cadastro-evento__input_imagem'
          accept='image/*'
          ref={ inputImagemref }
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
              setImagemEvento(e.target.files[0])
              setPreview(URL.createObjectURL(e.target.files[0]))
            }
            else {
              setImagemEvento(null)
              setPreview('')
            }
          }}
        />
      ]
    },
    {
      titulo:'Data e Hora do Evento',
      texto:'Preencha os campos com a data prevista e os horários de início e término do seu evento.',
      campos:[ 
        <Input
          cabecalho  
          cabecalhoTexto='Data do Evento'
          tipo='date'
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDataEvento(new Date(e.target.value))}
          valor={dataEvento && !isNaN(new Date(dataEvento).getTime()) ? dataEvento.toISOString().split('T')[0] : ''}
          obrigatorio={false}
        />,
        <Input 
          cabecalho cabecalhoTexto='Hora de Início' 
          tipo='time' 
          valor={horaInicio} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setHoraInicio(e.target.value)} 
        />,
        <Input 
          cabecalho 
          cabecalhoTexto='Hora de Término' 
          tipo='time' 
          valor={horaFim} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setHoraFim(e.target.value)} 
        />
      ]
    },
    {
      titulo:'Local do Evento',
      texto:'Preencha os campos com os detalhes do local onde o seu evento será realizado.',
      campos:[
        <Input 
          cabecalho
          cabecalhoTexto='CEP (opcional)' 
          placeholder='Digite o CEP do local' 
          tipo='number' 
          valor={localEvento.cep} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalEvento({ ...localEvento, cep: e.target.value })} 
        />,
        <Input 
          cabecalho 
          cabecalhoTexto='Endereço (opcional)' 
          placeholder='Digite o endereço do local' 
          tipo='text' valor={localEvento.endereco} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalEvento({ ...localEvento, endereco: e.target.value })} 
          disabled={travado} 
        />,
        <Input 
          cabecalho 
          cabecalhoTexto='Número (opcional)' 
          placeholder='Digite o número do local' 
          tipo='number' valor={localEvento.numero} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalEvento({ ...localEvento, numero: Number(e.target.value) })} 
        />,
        <Input 
          cabecalho 
          cabecalhoTexto='Complemento (opcional)' 
          placeholder='Digite o complemento do local' 
          tipo='text' valor={localEvento.complemento} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalEvento({ ...localEvento, complemento: e.target.value })} 
        />,
        <Input 
          cabecalho 
          cabecalhoTexto='Bairro (opcional)' 
          placeholder='Digite o bairro do local do evento' 
          tipo='text' valor={localEvento.bairro} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalEvento({ ...localEvento, bairro: e.target.value })} 
          disabled={travado} 
        />,
        <Input 
          cabecalho 
          cabecalhoTexto='Cidade (opcional)' 
          placeholder='Digite a cidade do local do evento' 
          tipo='text' 
          valor={localEvento.cidade} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalEvento({ ...localEvento, cidade: e.target.value })} 
          disabled={travado} 
        />,
        <Select 
          cabecalho 
          cabecalhoTexto='UF (opcional)' 
          textoPadrao='Selecione a UF'
          dica='Selecione a UF' valor={localEvento.estado} 
          funcao={(e: ChangeEvent<HTMLSelectElement>) => setLocalEvento(prevState => ({... prevState, estado:e.target.value}))} 
          disabled={travado}
        >
            {estadosBrasil.map(estado => <option value={estado}>{estado}</option>)}
        </Select>
      ]
    }
  ]



  const etapas = [
    <div className='row g-4'>
      
        <div className='col-lg-6'>
          {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[0]}
        </div>
        <div className='col-lg-6'>
          {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[1]}
        </div>
        <div className='col-lg-12'>
          {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[2]}
        </div>
    </div>,

    <div className='row'>
      <div className='d-flex gap-3 cadastro-evento__container-imagem-botoes'>
        <div className='cadastro-evento__container-imagem'>
        {imagemEvento?<img src={preView} alt='imagem kk' className='cadastro-evento__imagem'/>:<div className='cadastro-evento__sem-imagem'> <i className='fa-solid fa-image cadastro-evento__sem-imagem-icone'/></div>}
        </div>
        <div className='d-flex flex-column cadastro-evento__container-imagem-botoes'>
          {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[0]}
          <Botao 
          tamanho='min' 
          texto='Selecionar arquivo' 
          funcao={()=>inputImagemref.current?.click()}/>
          <Botao 
          tamanho='min' 
          texto='Remover' 
          funcao={()=>{
            setImagemEvento(null)
            URL.revokeObjectURL(preView)
            setPreview('')
            if(inputImagemref.current)
            inputImagemref.current.value = ""
          }}
          />
        </div>
      </div>
    </div>,

    <div className='row g-4'>
      <div className='col-lg-12'>
        {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[0]}
      </div>
      <div className='col-lg-6'>
        {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[1]}
      </div >
      <div className='col-lg-6'>
        {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[2]}
      </div>
    </div>,

    <div className='row g-4'>
      <div className='col-lg-3'>
        {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[0]}
        {erroCampo.cep?<ErroCampoForm mensagem='CEP inválido'/>:''}
      </div>
      <div className='col-lg-9'>
        {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[1]}
      </div>
      <div className='col-lg-3'>
        {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[2]}
      </div>
      <div className='col-lg-9'>
        {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[3]}
      </div>
      <div>
        {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[4]}
      </div>
      <div className='col-lg-9'>
        {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[5]}
      </div>
      <div className='col-lg-3'>
        {instrucoes[passoAtual].campos && instrucoes[passoAtual].campos[6]}
      </div>
    </div>
  ]

  const CadastrarEvento = (e: FormEvent) => {
    e.preventDefault()
    console.log(localEvento)
    alert('Cadastrando evento...')
  }
  const avancarPasso = (e: FormEvent) => {
    e.preventDefault()
    if (passoAtual + 1 < qntPassos) 
      setPassoAtual(passoAtual + 1)
  }
  return (
    <div className='cadastro-evento'>
      <h1 className='cadastro-evento__titulo'>Criar evento</h1>
      <form onSubmit={passoAtual+1===qntPassos?(e:FormEvent)=>CadastrarEvento(e):avancarPasso} className='cadastro-evento__form'>
        <IndicadorDePassos passoAtual={passoAtual + 1} qtdPassos={qntPassos}/>
        <Instrucao titulo={instrucoes[passoAtual].titulo} texto={instrucoes[passoAtual].texto}/>
        <div>
          {etapas[passoAtual]}
        </div>
        <div className='cadastro-evento__botoes'>
          
          {passoAtual!==0 ?
            <div className='cadastro-evento__botao-padrao'> 
              <Botao tamanho='max' funcao={()=>setPassoAtual(passoAtual-1)} texto='Anterior'/>
            </div>:''
          }
          
          <div className='cadastro-evento__botao-padrao'>
            {passoAtual+1<qntPassos? botaoProximo:botaoCadastrar}
          </div>
        </div>
      </form>
    </div>
  )
}

export default CadastroEvento