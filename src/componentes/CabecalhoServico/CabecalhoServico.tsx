import './CabecalhoServico.css'
import Botao from '../../componentes/Botao/Botao'
import { NavLink, useNavigate } from 'react-router'
import { Modal } from '../Modal/Modal'
import Input from '../Input/Input'
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import api from '../../axios'
import Select from '../../componentes/Select/Select';
import ErroCampoForm from '../../componentes/ErroCampoForm/ErroCampoForm';
import sweetAlert from 'sweetalert2'
import Alerta from '../Alerta/Alerta'
import ToggleBotao from '../ToggleBotao/ToggleBotao'    
import InputRadio from '../InputRadio/InputRadio'
import TextArea from '../TextArea/TextArea'
import Seta from '../Seta/Seta'
import { PatternFormat } from 'react-number-format';
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL;


interface TipoServico {
  idTipoServico: string;
  descricaoTipoServico: string;
}

interface Unidade{
  id: number;
  nome: string;
}

const CabecalhoServico = ({idServico, servico, preViewSv, setServico, idUsuario, setPreviewSv}: any) => {
  const [abrirEdicaoServico, setAbrirEdicaoServico] = useState(false)
  const [abrirApagarServico, setAbrirApagarServico] = useState(false)
  const [servicoEditado, setServicoEditado] = useState({...servico, tipoServico: servico.idTipoServico})
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [tipoServicoDisponiveis, setTipoServicoDisponiveis] = useState<TipoServico[]>([])
  const inputImagemRef = useRef<HTMLInputElement>(null)
  const [imagemServico, setImagemServico] = useState<File[]>([])
  const [preView, setPreview] = useState(preViewSv.filter((imagem: string)=> imagem !== null))
  const [editadoOk, setEditadoOk] = useState(false);
  const [unidade, setUnidade] = useState('')
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('indefinida');
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const [dataInicioAnuncio, setDataInicioAnuncio] = useState<Date | null>(hoje);
  const [dataTerminoAnuncio, setDataTerminoAnuncio] = useState<Date | null>(null);
  const diferencaDatas = dataTerminoAnuncio && dataInicioAnuncio ? Math.max(
                      Math.ceil(
                        (dataTerminoAnuncio.getTime() - dataInicioAnuncio.getTime()) /
                          (1000 * 60 * 60 * 24)
                      ),
                      0
                    )
                  : 0;
  let dataFormatada = '';
  if (
    dataInicioAnuncio &&
    !isNaN(dataInicioAnuncio.getTime()) &&
    new Date(dataInicioAnuncio).setHours(0, 0, 0, 0) === hoje.getTime()
  ) {
    dataFormatada = 'hoje';
  } else if (dataInicioAnuncio) {
    dataFormatada = `${dataInicioAnuncio.toLocaleDateString('pt-BR')}`;
  }

  const [modalAnunciarServico, setModalAnunciarServico] = useState(false);
  const [erroDataInicio, setErroDataInicio] = useState<string | null>(null);
  const [erroDataTermino, setErroDataTermino] = useState<string | null>(null);
  const [erroCepInvalido, setErroCepInvalido] = useState(false);
  const [travado,setTravado] = useState(false);

  const AbrirModalAnunciarServico = () => {
    setModalAnunciarServico(!modalAnunciarServico);
  }
  const [anunciado, setAnunciado] = useState(servico.anunciado || false); 
  const [imagemOriginal, setImagemOriginal] = useState<string[]>(preViewSv.filter((imagem: string) => imagem !== null));
  const navigate = useNavigate();
  const maxImagemServico = 6;
  const AbrirModalEditarServico = () => {
    setServicoEditado({...servico, tipoServico: servico.tipoServico.idTipoServico});
    setPreview(preViewSv.filter((imagem: string)=> imagem !== null))
    setAbrirEdicaoServico(!abrirEdicaoServico)
  }

  const AbrirModalApagarServico = () => {
    setAbrirApagarServico(!abrirApagarServico)
  }

  const anunciarServico = async () => {
        if (!await validarAnuncio()) return;
        console.log(idServico);
        api.put(`users/services/${idServico}/anunciar`, {
            dataInicioAnuncio: dataInicioAnuncio,
            dataTerminoAnuncio: dataTerminoAnuncio
        })
        .then((res) => {
            console.log("Serviço anunciado com sucesso", res.data);
        })
        .catch((err) => {
            console.error("Erro ao anunciar serviço", err);
        });
        AbrirModalAnunciarServico();
        setAnunciado(true);
    }

    const encerrarAnuncioServico = async () => {
        api.put(`users/services/${idServico}/encerrar-anuncio`)
        .then((res) => {
            console.log("Anúncio encerrado com sucesso", res.data);
        })
        .catch((err) => {
            console.error("Erro ao encerrar anúncio", err);
        });
        setAnunciado(false);
    }

    const anunciarOuEncerrar = async () => {
      anunciado ?
      encerrarAnuncioServico() :
      setModalAnunciarServico(!modalAnunciarServico)}

  const validarAnuncio = async () => {
    let valido = true;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (!dataInicioAnuncio || dataInicioAnuncio < hoje) {
      setErroDataInicio('A data de início não pode ser anterior a hoje.');
      valido = false;
    } else {
      setErroDataInicio(null);
    }

    if (dataTerminoAnuncio) {
      if (dataTerminoAnuncio < dataInicioAnuncio!) {
        setErroDataTermino('A data de término não pode ser anterior à data de início.');
        valido = false;
      } else {
        setErroDataTermino(null);
      }
    } else {
      setErroDataTermino(null);
    }

    return valido;
  }


  const validarFormulario = async () => {
    const novosErros: { [key: string]: string } = {};

    if (!servicoEditado?.nomeServico) novosErros.nomeServico = "O nome do Serviço é obrigatório.";
    if (!servicoEditado?.descricaoServico) novosErros.descricaoServico = "A descricao do Serviço é obrigatório.";
    if (!servicoEditado?.idTipoServico) novosErros.idTipoServico = "O Tipo do Serviço é obrigatório.";
    if (!servicoEditado?.unidadeCobranca) novosErros.unidadeCobranca = "A unidade de cobrança é obrigatória.";
    if (!servicoEditado?.valorServico) novosErros.valorServico = "O valor do serviço é obrigatório.";
    if (!servicoEditado?.qntMinima) novosErros.qntMinima = "A quantidade minima é obrigatória.";
    if (!servicoEditado?.qntMaxima) novosErros.qntMaxima = "A quantidade máxima é obrigatória.";

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  const buscarCep = async (cep: string) => {
    try { await axios.get(`https://viacep.com.br/ws/${cep}/json/`).then(res => {
      const local = res.data
      if(local.erro) 
        // setAviso(prevState => ({...prevState, cepNaoEncontrado:{...prevState.cepNaoEncontrado, status: true}}))
      console.log(local.erro)
      else {
      setServicoEditado({...servicoEditado, endereco: local.logradouro, bairro: local.bairro, cidade: local.localidade, estado: local.uf})
      setTravado(true)
      setErroCepInvalido(false)
      }
    })}
    catch (error) { console.log('ocorreu algum erro: ',error) }
  }

  useEffect(() => {
    if(servicoEditado.cep?.length===8) 
      buscarCep(servicoEditado.cep)
    if(servicoEditado.cep?.length===0) 
      setErroCepInvalido(false)
    else
      setTravado(false)
  }, [servicoEditado.cep])

  useEffect(() => {
    if(servicoEditado.tipoServico !==5){
      setServicoEditado((prevState:any) =>({
        ...prevState,
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      }))
    }
  },[servicoEditado.tipoServico])

  useEffect(() => {
    setPreview(preViewSv.filter((imagem: string) => imagem !== null));
  },[preViewSv])

  useEffect(()=>{
    setPreview(()=> [...imagemOriginal, ...imagemServico.map((imagem: File) => URL.createObjectURL(imagem))])
  },[imagemServico,imagemOriginal])
  
  useEffect(()=>{
    const buscarTiposDeServicos = async () => {
      try{
        const tipoServico = await api.get('/users/tipo-servico')
        setTipoServicoDisponiveis(tipoServico.data)
      }
      catch (error) {
        console.log('ocorreu algum erro: ',error)
        return
      }
    }
    buscarTiposDeServicos();
    const unidade = unidadeValor.find(
      (item) => item.id === Number(servico?.unidadeCobranca)
    );
    setUnidade(unidade!.nome);
  },[])

  useEffect(() => {
    if (servico) {
      setServicoEditado({...servico, tipoServico: servico.tipoServico.idTipoServico});
    }
  }, [servico]);

  const validaCep = ()=>{
    if (servicoEditado.cep.lenght !==8 && servicoEditado.tipoServico===5)
      setErroCepInvalido(true)
  }

  const editarServico = async () => {
    if (!await validarFormulario()) return;
    validaCep()
    if(erroCepInvalido)return;
    if (!servicoEditado) return alert("Serviço não carregado corretamente!");    
    try {
      const formData = new FormData();
            
      formData.append("nomeServico", servicoEditado.nomeServico);
      formData.append("descricaoServico", servicoEditado.descricaoServico ?? '');
      formData.append("idTipoServico", servicoEditado.tipoServico);
      formData.append("unidadeCobranca", servicoEditado.unidadeCobranca);
      formData.append("qntMinima", servicoEditado.qntMinima);
      formData.append("qntMaxima", servicoEditado.qntMaxima);
      formData.append("valorServico", servicoEditado.valorServico);
      formData.append("valorPromoServico", servicoEditado.valorPromoServico??'');
      formData.append("servicoCep",servicoEditado.cep);
      formData.append("servicoEndereco",servicoEditado.endereco);
      formData.append("servicoNumero",servicoEditado.numero);
      formData.append("servicoComplemento",servicoEditado.complemento);
      formData.append("servicoBairro",servicoEditado.bairro);
      formData.append("servicoCidade",servicoEditado.cidade);
      formData.append("servicoEstado",servicoEditado.estado);
      
      imagemOriginal.forEach((imagem: string) => {
        const imagemSemLink = imagem.split('/')
        formData.append("imagensMantidas", imagemSemLink[imagemSemLink.length - 1]);
      })
      imagemServico.forEach((imagem: File) => {
        formData.append("files", imagem);
      })

      const {data} = await api.put(`/users/services/${servico.idServico}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });    
      setEditadoOk(true);
      setTimeout(() => {
        setEditadoOk(false);
      }
      , 10000)

      AbrirModalEditarServico();
      setServico({
        ...servico,
        ...servicoEditado,
        tipoServico: {
        idTipoServico: servicoEditado.tipoServico,
          descricaoTipoServico: tipoServicoDisponiveis.find((tipo) => tipo.idTipoServico.toString() === servicoEditado.tipoServico)?.descricaoTipoServico 
        },
        imagemServico: imagemServico instanceof File ? URL.createObjectURL(imagemServico) : servico.imagemServico,
      })
      const imagens = [data.servico.imagem1, data.servico.imagem2, data.servico.imagem3, data.servico.imagem4, data.servico.imagem5, data.servico.imagem6];
      setPreviewSv(imagens.map((imagem) => imagem !== null ? `${apiUrl}/files/${imagem}` : null));
    } 
    catch (err) {
      console.error("Erro ao editar Servico:", err);
      sweetAlert.fire({
        title: "Erro!",
        text: "Erro ao editar Servico.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  const ApagarServico = () => {
    api.delete(`/users/${idUsuario}/services/${servico.idServico}`)
    .then(() => {
      navigate('/prestador/meus-servicos');
    })
    .catch((err) => {
      console.error("Erro ao apagar servico", err);
    });
    setAbrirApagarServico(!abrirApagarServico)
  }

  const unidadeValor: Unidade[] = [
    { id: 1, nome: "Unidade" },
    { id: 2, nome: "Hora" },
    { id: 3, nome: "Turno" },
    { id: 4, nome: "Diaria" },
    { id: 5, nome: "Alugel" },
    { id: 6, nome: "sessão" },
    { id: 7, nome: "pessoa" },
  ];

  const estadosBrasil = [
      "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", 
      "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", 
      "RO", "RR", "RS", "SC", "SE", "SP", "TO"
    ];



  return (
    <div className="cabecalho-servicos">
      <div className='container'>
        <div className='cabecalho-servico__seta'>
          <Seta tipo='prestador' caminho='/prestador/meus-servicos'/>
        </div>
        <div className="titulo-infos-eventos">
          <div className="titulo-informacoes">
            <div className="titulo-do-evento">
              <h1 className='cabecalho-evento__titulo' title={servico.nomeServico}>{servico.nomeServico}</h1>
            </div>
            <div className="informacoes-evento">
              <div className='alinhamento-info-icone-servico'>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
                  <path d="M16.625 3.125C17.5915 3.125 18.375 3.89777 18.375 4.85102L18.375 7.79743C18.375 8.75069 17.5915 9.52346 16.625 9.52346H14C13.0335 9.52346 12.25 8.75069 12.25 7.79743L12.25 4.85102C12.25 3.89777 13.0335 3.125 14 3.125L16.625 3.125Z" stroke="#FA812F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.375 3.125C3.4085 3.125 2.625 3.89777 2.625 4.85102L2.62501 7.79743C2.62501 8.75069 3.40851 9.52346 4.37501 9.52346H7.00001C7.9665 9.52346 8.75001 8.75069 8.75001 7.79743L8.75 4.85102C8.75 3.89777 7.9665 3.125 7 3.125L4.375 3.125Z" stroke="#FA812F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.625 12.4766C17.5915 12.4766 18.375 13.2493 18.375 14.2026V17.149C18.375 18.1022 17.5915 18.875 16.625 18.875H14C13.0335 18.875 12.25 18.1022 12.25 17.149L12.25 14.2026C12.25 13.2493 13.0335 12.4766 14 12.4766H16.625Z" stroke="#FA812F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.37501 12.4766C3.40851 12.4766 2.62501 13.2493 2.62501 14.2026L2.62501 17.149C2.62501 18.1022 3.40851 18.875 4.37501 18.875H7.00001C7.96651 18.875 8.75001 18.1022 8.75001 17.149L8.75001 14.2026C8.75001 13.2493 7.9665 12.4766 7.00001 12.4766H4.37501Z" stroke="#FA812F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                    {servico.tipoServico.descricaoTipoServico}
              </div>
              <div className='alinhamento-info-icone-servico'>
                <span className='icone-preco-servico'>R$</span>
                <div>
                  {Number(servico.valorServico).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()}<span className='cor-unidade-servico'>{`/${unidade.toLowerCase()}`}</span>
                </div>
              </div>
            </div>
          </div>
            <div className="botoes-servico">
              <div className='botoes-evento_container'>
                <div className='botao-evento'>
                  <Botao
                    texto="Editar serviço"
                    tamanho="med"
                    tipo="botao"
                    cor='var(--yellow-700)'
                    funcao={() => setAbrirEdicaoServico(true)}
                  />
                </div>
                <div className='botao-evento'>
                  <Botao
                    texto="Apagar serviço"
                    tamanho="med"
                    tipo="botao"
                    cor='var(--yellow-700)'
                    funcao={() => setAbrirApagarServico(true)}
                  />
                </div>
              </div>
              <div className='botao-evento__anunciado'>
                <ToggleBotao   ativo={anunciado} aoAlternar={() => anunciarOuEncerrar()} texto = "Anunciado"/>
              </div>
            </div>
        </div>
        <div className="abas-evento">
          <NavLink 
            to={`/prestador/meus-servicos/${idServico}/informacoes-meus-servicos`} 
            className={({isActive}: any) => (`aba-servico ${isActive ? "aba-servico--ativo" : ''}`)}
          >
            Informações Gerais
          </NavLink>
        </div>
      </div>
      {
        modalAnunciarServico ?
        <Modal titulo='Anunciar Serviço' prestador textoBotao="Anunciar" funcaoSalvar={anunciarServico} enviaModal={AbrirModalAnunciarServico}>
        <div className='modal-anunciar-servico'>
          <div className='modal-anunciar-servico__input-data'>
            <Input 
              cabecalho = {true}
              cabecalhoTexto='Data de início'
              tipo = 'date'
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.value !== '') {
                  const [ano, mes, dia] = e.target.value.split('-').map(Number);
                  const dataLocal = new Date(ano, mes - 1, dia); 
                  setDataInicioAnuncio(dataLocal);
                } else {
                  setDataInicioAnuncio(null);
                }
              }}
              valor={
                dataInicioAnuncio ? dataInicioAnuncio.toISOString().split('T')[0] : ''
              }
              min={hoje.toISOString().split('T')[0]}
              >
            </Input>
                {erroDataInicio && <ErroCampoForm mensagem={erroDataInicio}/>
                }
          </div>
          <div className='modal-anunciar-servico__duracao'>
            <div className='modal-anunciar-servico__titulo-duracao'>
              Duração
            </div>
            <div className='teste'>
              <InputRadio
                nome = 'duracao'
                id = '1'
                textoLabel = 'Data de termino indefinida'
                value='indefinida'
                funcao={(e:any) => {setOpcaoSelecionada(e.target.value); setDataTerminoAnuncio(null)}}
                prestador>
              </InputRadio>  
            </div>
            <InputRadio
              nome = 'duracao'
              id = '2'
              textoLabel = 'Determinar uma data de término'
              value='determinar'
              funcao={(e:any) => setOpcaoSelecionada(e.target.value)}
              prestador>
            </InputRadio>
          </div>
          {
            opcaoSelecionada === 'determinar' ?
            <>
              <div className='modal-anunciar-servico__input-data'>
                <Input 
                  cabecalho = {true}
                  cabecalhoTexto='Data de término'
                  tipo = 'date'
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.value !== '') {
                      const [ano, mes, dia] = e.target.value.split('-').map(Number);
                      const dataLocal = new Date(ano, mes - 1, dia);
                      setDataTerminoAnuncio(dataLocal);
                    } else {
                      setDataTerminoAnuncio(null);
                    } 
                  }}>
                </Input>
                {erroDataTermino && <ErroCampoForm mensagem={erroDataTermino}/>
                }
              </div>
              <div>
                Exibição por {diferencaDatas} dias a partir de {dataFormatada}.
              </div>
            </>
           : '' 
           }
          </div>
      </Modal>
      : ''
      }
      {
        abrirEdicaoServico ? 
          <Modal funcaoSalvar={editarServico} titulo='Editar serviço' enviaModal={AbrirModalEditarServico} prestador>
            <div className='modal-editar-evento'>
              <div className='campos-editar-evento'>
                <div className='nome-categoria-evento'>
                  <div className='nome-input-evento'>
                    <div className='textos'>Nome do serviço</div>
                    <div className="input-tamanho">
                      <Input 
                        cor='var(--yellow-700)'
                        value={servicoEditado?.nomeServico|| ""}  
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                           prev ? { ...prev, nomeServico: e.target.value } : null
                        )} 
                        type='text' 
                        dica='Digite um nome para o servico'
                      />
                      {erros.nomeServico && <ErroCampoForm mensagem={erros.nomeServico}/>}   
                    </div>  
                  </div>
                  <div className='categoria-input-evento'>
                    <div className='input-tamanho'>   
                      <Select 
                        cabecalho 
                        cabecalhoTexto='Tipo de Servico'  
                        textoPadrao='Selecione o tipo de servico'
                        cor='var(--yellow-700)'
                        valor={servicoEditado?.tipoServico}
                        funcao={(e: ChangeEvent<HTMLSelectElement>) => setServicoEditado((prev:any) => prev ? { ...prev, tipoServico: Number(e.target.value) } : null)}
                        required={true}
                      >
                        {tipoServicoDisponiveis.map(tipo => <option value={tipo.idTipoServico} key={tipo.idTipoServico}>{tipo.descricaoTipoServico}</option>)}
                      </Select>
                      {erros.idTipoServico && <ErroCampoForm mensagem={erros.idTipoServico}/>}
                    </div>
                  </div>
                </div>
                <div className='descricao-input-evento'>
                  <div className='input-tamanho-descricao'>
                    <TextArea
                      titulo='Descrição do serviço'
                      placeholder='Digite uma descrição para o seu serviço...'
                      name='descricao-servico'
                      cor='var(--yellow-700)'
                      valor={servicoEditado?.descricaoServico || ""}
                      onChange={(e:any) => setServicoEditado((prev:any) =>
                        prev ? { ...prev, descricaoServico: e.target.value } : null
                      )} 
                      maximo={4000}
                      obrigatorio
                      />
                    {erros.descricaoServico && <ErroCampoForm mensagem={erros.descricaoServico}/>} 
                  </div>
                </div>
                <div className='d-flex row g-4 justify-content-center cadastro-servico__etapa-imagem-com-imagem'>
                  <input
                  style={{ display: 'none' }}
                  ref={inputImagemRef} 
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if(e.target.files && e.target.files.length + preView.length <= maxImagemServico) {
                    setImagemServico((prevState:File[])=> [...prevState, ...Array.from(e.target.files || [])]);
                    // inputImagemRef.current!.value = '';
                    return
                    }
                    console.log('limite de imagens atingido',  preView.length + e.target.files!.length);
                  }}
                  />
                  {preView ? preView.map((imagem: string, index:number)=>{
                    if (preView[index] !== null)
                    return <div className="col-12 col-sm-6 cadastro-servico__container-imagem" key={index}>
                      <img key={imagem} src={imagem} alt="imagem do serviço" className="cadastro-servico__imagem-preview"/>
                      <button className='cadastro-servico__remover-image' type="button" onClick={()=>{
                        inputImagemRef.current!.value = ''
                        setImagemOriginal((prevState: string[]) => prevState.filter((_, i) => i !== index));
                        setImagemServico((prevState: File[]) => prevState.filter((_, i) => imagemOriginal.length + i !== index));
                        }}>
                        <i className="fa-solid fa-xmark cadastro-servico__remover-image-icone"></i>
                      </button>
                    </div>
                  })
                  :''}
                  {preView.length < maxImagemServico ? 
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
              </div>
              <div className='novos-dados-eventos'>
                <div className='texto-input-data' style={{width: '100%'}}>
                  <div className='textos'>Unidade de cobrança</div>
                  <div className='input-tamanho' style={{width: '100%'}}>
                    <Select 
                      textoPadrao = 'Selecione a Unidade'
                      esconderValorPadrao
                      cor='var(--yellow-700)'
                      value={servicoEditado?.unidadeCobranca || ""}
                      onChange={(e:any) => setServicoEditado((prev:any) =>
                        prev ? { ...prev, unidadeCobranca: e.target.value } : null
                      )}>
                      {unidadeValor.map((unidade)=>{
                      return <option id={unidade.id.toString()} value={unidade.id} key={unidade.id}>{unidade.nome}</option>
                      })}
                    </Select>
                    {erros.unidadeCobranca && <ErroCampoForm mensagem={erros.unidadeCobranca}/>}
                  </div>
                </div>
                <div className='texto-input-hora-inicio-evento'>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Valor do serviço por unidade</div>
                    <div className='input-tamanho'>
                      <Input 
                        cor='var(--yellow-700)'
                        value={servicoEditado?.valorServico || ""}  
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, valorServico: e.target.value } : null
                        )} 
                        dica='R$'
                      />
                      {erros.valorServico && <ErroCampoForm mensagem={erros.valorServico}/>}
                    </div>
                  </div>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Valor promocional do serviço por unidade</div>
                    <div className='input-tamanho'>
                      <Input 
                        cor='var(--yellow-700)'
                        value={servicoEditado?.valorPromoServico || ""}  
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, valorPromoServico: e.target.value } : null
                        )} 
                        dica='Digite um valor promocional'
                      />
                      {erros.valorServico && <ErroCampoForm mensagem={erros.valorServico}/>}
                    </div>
                  </div>
                </div>
                <div className='texto-input-hora-inicio-evento'>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Quantidade mínima</div>
                    <div className='input-tamanho'>
                      <Input 
                        cor='var(--yellow-700)'
                        value={servicoEditado?.qntMinima || ""}
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, qntMinima: e.target.value } : null
                        )} 
                        dica='1'
                      />
                      {erros.qntMinima && <ErroCampoForm mensagem={erros.qntMinima}/>}
                    </div>
                  </div>
                  <div className='texto-input-cep-endereco'>
                    <div className='input-texto-cep-numero'>
                      <div className='textos'>Quantidade máxima</div>
                      <div className='input-tamanho'>
                          <Input 
                              cor='var(--yellow-700)'
                              value={servicoEditado?.qntMaxima || ""}
                              onChange={(e:any) => setServicoEditado((prev:any) =>
                              prev ? { ...prev, qntMaxima: e.target.value } : null
                          )} 
                          dica='10'
                        />
                        {erros.qntMaxima && <ErroCampoForm mensagem={erros.qntMaxima}/>}
                      </div>
                    </div>
                  </div>
                </div>
                {servicoEditado.tipoServico === 5?<div className='row g-4'>
                  <div className='col-lg-3'>
                    <PatternFormat
                            format={'#####-###'}
                            mask={'_'}
                            value={servicoEditado.cep}
                            onValueChange={(values) => {
                              setServicoEditado({...servicoEditado, cep: values.value });
                            }}
                            customInput={Input}
                            cabecalho
                            cabecalhoTexto={`CEP`} 
                            placeholder='Digite o CEP do local' 
                            name='cep'
                            cor='#F3C623'
                          />
                    {erroCepInvalido?<ErroCampoForm mensagem='CEP inválido'/>:''}
                  </div>
                  <div className='col-lg-9'>
                    <Input 
                            cabecalho 
                            cabecalhoTexto={`Endereço`}
                            placeholder='Digite o endereço do local' 
                            tipo='text' 
                            valor={servicoEditado.endereco} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setServicoEditado({...servicoEditado, endereco: e.target.value });
                            }} 
                            disabled={travado} 
                            name='endereco'
                            cor='#F3C623'
                          />
                  </div>
                  <div className='col-lg-3'>
                    <PatternFormat   
                            format={'#####'}                
                            value={servicoEditado.numero}
                            onValueChange={(values) => {
                              setServicoEditado({...servicoEditado, numero: values.value });
                            } }
                            customInput={Input}
                            cabecalho 
                            cabecalhoTexto={`Número`}
                            placeholder='Digite o número do local'     
                            name='numero-endereco'  
                            cor='#F3C623'
                          />
                  </div>
                  <div className='col-lg-9'>
                    <Input 
                            cabecalho 
                            cabecalhoTexto={'Complemento (opcional)'} 
                            placeholder='Digite o complemento do local' 
                            tipo='text' 
                            valor={servicoEditado.complemento} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setServicoEditado({...servicoEditado, complemento: e.target.value });
                            }} 
                            obrigatorio={false}
                            name='complemento'
                            cor='#F3C623'
                          />
                  </div>
                  <div>
                    <Input 
                            cabecalho 
                            cabecalhoTexto={`Bairro`} 
                            placeholder='Digite o bairro do local do evento' 
                            tipo='text' 
                            valor={servicoEditado.bairro} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setServicoEditado({...servicoEditado, bairro: e.target.value });
                            }} 
                            disabled={travado} 
                            name='bairro'
                            cor='#F3C623'
                          />
                  </div>
                  <div className='col-lg-9'>
                    <Input 
                            cabecalho 
                            cabecalhoTexto={`Cidade`} 
                            placeholder='Digite a cidade do local do evento' 
                            tipo='text' 
                            valor={servicoEditado.cidade} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setServicoEditado({...servicoEditado, cidade: e.target.value });
                            }} 
                            disabled={travado} 
                            name='cidade'
                            cor='#F3C623'
                          />
                  </div>
                  <div className='col-lg-3'>
                    <Select 
                            cabecalho 
                            cabecalhoTexto={`UF`} 
                            textoPadrao='Selecione a UF'
                            dica='Selecione a UF'
                            valor={servicoEditado.estado} 
                            funcao={(e: ChangeEvent<HTMLSelectElement>) => {
                              setServicoEditado({...servicoEditado, estado: e.target.value });
                            }} 
                            disabled={travado}
                            required
                            esconderValorPadrao={false}
                            name='estado'
                            cor='#F3C623'
                          >
                              {estadosBrasil.map((estado, index) => <option key={index} value={estado}>{estado}</option>)}
                          </Select>
                  </div>
                </div>:''}
              </div>  
            </div>
          </Modal>
        : ''
      }
      { 
        abrirApagarServico ?
          <Modal titulo='Apagar Serviço' textoBotao="Apagar" funcaoSalvar={ApagarServico} enviaModal={AbrirModalApagarServico} prestador>
            <div className='modal-apagar-evento'>
              <div className='texto-apagar-evento'>Você tem certeza que deseja apagar o serviço "{servico.nomeServico}"?</div>
            </div>
          </Modal>
        : ''
      }
      {
        editadoOk &&
        <div className='editar-evento__alerta'>
          <Alerta texto="Serviço editado com sucesso!" status="sucesso" ativado={true}/>
        </div>
      }
    </div>
  )
}

export default CabecalhoServico;