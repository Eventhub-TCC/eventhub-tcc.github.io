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

interface TipoServico {
  idTipoServico: string;
  descricaoTipoServico: string;
}

const CabecalhoServico = ({idServico, servico, preViewEv, setServico, idUsuario}: any) => {
  const [abrirEdicaoServico, setAbrirEdicaoServico] = useState(false)
  const [abrirApagarServico, setAbrirApagarServico] = useState(false)
  const [servicoEditado, setServicoEditado] = useState({...servico, tipoServico: servico.idTipoServico})
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [tipoServicoDisponiveis, setTipoServicoDisponiveis] = useState<TipoServico[]>([])
  const inputImagemref = useRef<HTMLInputElement>(null)
  const [imagemServico, setImagemServico] = useState<[File|null]>([null])
  const [preView, setPreview] = useState(preViewEv)
  const [imagemEditada, setImagemEditada] = useState(false)
  const [editadoOk, setEditadoOk] = useState(false)

  const navigate = useNavigate();
  
  const AbrirModalEditarServico = () => {
    setServicoEditado({...servico, tipoServico: servico.tipoServico.idTipoServico});
    setAbrirEdicaoServico(!abrirEdicaoServico)
  }

  const AbrirModalApagarServico = () => {
    setAbrirApagarServico(!abrirApagarServico)
  }


  const validarFormulario = async () => {
    const novosErros: { [key: string]: string } = {};

    if (!servicoEditado?.nomeServico) novosErros.nomeServico = "O nome do Servico é obrigatório.";


    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };


  
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
    buscarTiposDeServicos()
  },[])

  useEffect(() => {
    if (servico) {
      setServicoEditado({...servico, tipoEvento: servico.tipoEvento.idTipoEvento});
    }
  }, [servico]);

  const editarServico = async () => {
    if (!await validarFormulario()) return;
    if (!servicoEditado) return alert("Serviço não carregado corretamente!");    
    try {
      const formData = new FormData();
            
      formData.append("nomeServico", servicoEditado.nomeServico);
      formData.append("descricaoServico", servicoEditado.descricaoServico || '');
      formData.append("idTipoServico", servicoEditado.tipoServico);
      formData.append("unidadeCobranca", servicoEditado.unidadeCobranca);
      formData.append("qntMinima", servicoEditado.qntMinima);
      formData.append("qntMaxima", servicoEditado.qntMaxima);
      formData.append("valorServico", servicoEditado.valorServico);

    //   if (imagemEditada) {
    //     if (imagemEvento) {
    //       formData.append("file", imagemEvento);
    //       formData.append("imagemEditada", "true");
    //     } else if (imagemEvento === null) {
    //       formData.append("imagemEditada", "true");
    //     }
    //   } else {
    //     formData.append("imagemEditada", "false");
    //   }

      await api.put(`/users/services/${servico.idEvento}`, formData, {
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
          idTipoServico: servicoEditado.tipoEvento,
          descricaoTipoServico: tipoServicoDisponiveis.find((tipo) => tipo.idTipoServico.toString() === servicoEditado.tipoServico)?.descricaoTipoServico 
        },
        imagemServico: imagemServico instanceof File ? URL.createObjectURL(imagemServico) : servico.imagemServico,
      })
    } 
    catch (err) {
      console.error("Erro ao editar evento:", err);
      sweetAlert.fire({
        title: "Erro!",
        text: "Erro ao editar evento.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  const ApagarServico = () => { //FAZER NO BACK FUNÇÃO APAGAR SERVIÇO
    api.delete(`/users/${idUsuario}/services/${servico.idServico}`)
    .then(() => {
      navigate('/prestador/meus-servicos');
    })
    .catch((err) => {
      console.error("Erro ao apagar servico", err);
    });
    setAbrirApagarServico(!abrirApagarServico)
  }

  return (
    <div className="cabecalho-eventos">
      <div className='container'>
        <div className="titulo-infos-eventos">
          <div className="titulo-informacoes">
            <div className="titulo-do-evento">
              <h1 className='cabecalho-evento__titulo' title={servico.nomeServico}>{servico.nomeServico}</h1>
            </div>
            <div className="informacoes-evento">
              <div className='alinhamento-info-icone'>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M6.78125 15.0677V15M10.7188 15.0677V15M10.7188 11.4V11.3323M14.2188 11.4V11.3323M4.15625 7.79997H16.4063M5.73958 2.625V3.97516M14.6563 2.625V3.97499M14.6563 3.97499H5.90625C4.4565 3.97499 3.28125 5.18382 3.28125 6.67498V15.675C3.28125 17.1662 4.4565 18.375 5.90625 18.375H14.6562C16.106 18.375 17.2812 17.1662 17.2812 15.675L17.2813 6.67498C17.2813 5.18382 16.106 3.97499 14.6563 3.97499Z" stroke="#55379D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                    {servico.tipoServico.descricaoServico}
              </div>
              <div className='alinhamento-info-icone'>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                  <path d="M13.5744 13.4174C14.0983 13.5921 14.6647 13.3089 14.8393 12.785C15.014 12.261 14.7308 11.6947 14.2069 11.5201L13.5744 13.4174ZM10.9375 11.4844H9.9375C9.9375 11.9148 10.2129 12.2969 10.6213 12.4331L10.9375 11.4844ZM11.9375 7.36826C11.9375 6.81598 11.4898 6.36826 10.9375 6.36826C10.3852 6.36826 9.9375 6.81598 9.9375 7.36826H11.9375ZM14.2069 11.5201L11.2537 10.5357L10.6213 12.4331L13.5744 13.4174L14.2069 11.5201ZM11.9375 11.4844V7.36826H9.9375V11.4844H11.9375ZM17.8125 10.5C17.8125 14.297 14.7345 17.375 10.9375 17.375V19.375C15.839 19.375 19.8125 15.4015 19.8125 10.5H17.8125ZM10.9375 17.375C7.14054 17.375 4.0625 14.297 4.0625 10.5H2.0625C2.0625 15.4015 6.03597 19.375 10.9375 19.375V17.375ZM4.0625 10.5C4.0625 6.70304 7.14054 3.625 10.9375 3.625V1.625C6.03597 1.625 2.0625 5.59847 2.0625 10.5H4.0625ZM10.9375 3.625C14.7345 3.625 17.8125 6.70304 17.8125 10.5H19.8125C19.8125 5.59847 15.839 1.625 10.9375 1.625V3.625Z" fill="#55379D"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="botoes-evento">
              <div className='botao-evento'>
                <Botao
                  texto="Editar evento"
                  tamanho="med"
                  tipo="botao"
                  funcao={() => setAbrirEdicaoServico(true)}
                />
              </div>
              <div className='botao-evento'>
                <Botao
                  texto="Apagar evento"
                  tamanho="med"
                  tipo="botao"
                  funcao={() => setAbrirApagarServico(true)}
                />
              </div>
            </div>
        </div>
        <div className="abas-evento">
          <NavLink 
            to={`/organizador/meus-eventos/${idServico}/informacoes-meus-eventos`} 
            className={({isActive}: any) => (`aba-evento ${isActive ? "aba-evento--ativo" : ''}`)}
          >
            Informações Gerais
          </NavLink>
          <NavLink 
            to={`/organizador/meus-eventos/${idServico}/convidados`} 
            className={({isActive}: any) => (`aba-evento ${isActive ? "aba-evento--ativo" : ''}`)} 
          >
            Convidados
          </NavLink>
          <NavLink 
            to={`/organizador/meus-eventos/${idServico}/convites`} 
            className={({isActive}: any) => (`aba-evento ${isActive ? "aba-evento--ativo" : ''}`)} 
          >
            Convites
          </NavLink>
        </div>
      </div>
      {
        abrirEdicaoServico ? 
          <Modal funcaoSalvar={editarServico} titulo='Editar evento' enviaModal={AbrirModalEditarServico}>
            <div className='modal-editar-evento'>
              <div className='campos-editar-evento'>
                <div className='nome-categoria-evento'>
                  <div className='nome-input-evento'>
                    <div className='textos'>Nome do serviço</div>
                    <div className="input-tamanho">
                      <Input 
                        value={servicoEditado?.nomeServico|| ""}  
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, nomeEvento: e.target.value } : null
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
                        valor={servicoEditado?.tipoServico}
                        funcao={(e: ChangeEvent<HTMLSelectElement>) => setServicoEditado((prev:any) => prev ? { ...prev, tipoServico: e.target.value } : null)}
                        required={true}
                      >
                        {tipoServicoDisponiveis.map(tipo => <option value={tipo.idTipoServico}>{tipo.descricaoTipoServico}</option>)}
                      </Select>
                      {/* {erros.tipoEvento && <ErroCampoForm mensagem={erros.tipoEvento}/>} */}
                    </div>
                  </div>
                </div>
                <div className='descricao-input-evento'>
                  <div>Descrição do servico(Opcional)</div>
                  <div className='input-tamanho-descricao'>
                    <Input 
                      value={servicoEditado?.descricaoServico || ""}  
                      onChange={(e:any) => setServicoEditado((prev:any) =>
                        prev ? { ...prev, descricaoEvento: e.target.value } : null
                      )} 
                      type='text' 
                      dica='Digite uma descrição para o seu servico...'
                    />
                  </div>
                </div>
                {/* <div className='imagem-evento'>
                  <div className='imagem-evento-texto-botao'>
                    <div className='texto-imagem-evento'>Imagem do servico(Opcional)</div>
                    <div className='input-imagem-evento'>
                      <div className='cadastro-evento__container-imagem'>
                        <input 
                          type='file' 
                          className='cadastro-evento__input_imagem'
                          accept='image/*'
                          ref={ inputImagemref }
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setImagemServico(e.target.files[0])
                              setPreview(URL.createObjectURL(e.target.files[0]))
                              setImagemEditada(true)
                            }
                            else {
                              setImagemServico(null)
                              setPreview('')
                            }
                          }}
                        />
                        {preView?<img src={preView} className='cadastro-evento__imagem'/>:<div className='cadastro-evento__sem-imagem'> <i className='fa-solid fa-image cadastro-evento__sem-imagem-icone'/></div>}
                      </div>
                      <div className='botoes-imagem'>
                        <Botao 
                          tamanho='min' 
                          texto='Selecionar arquivo' 
                          funcao={()=>inputImagemref.current?.click()}
                        />
                        <Botao 
                          tamanho='min' 
                          texto='Remover' 
                          funcao={()=>{
                            setImagemServico(null)
                            URL.revokeObjectURL(preView)
                            setPreview('')
                            setImagemEditada(true)
                            console.log('imagemEditada', imagemEditada)
                            if(inputImagemref.current)
                              inputImagemref.current.value = ""
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className='novos-dados-eventos'>
                <div className='texto-input-data'>
                  <div className='textos'>Unidade de cobrança</div>
                  <div className='input-data-evento'>
                    <Input 
                      value={servicoEditado?.dataEvento || ""}  
                      onChange={(e:any) => setServicoEditado((prev:any) =>
                        prev ? { ...prev, unidadeCobranca: e.target.value } : null
                      )} 
                      dica=''
                    />
                    {/* {erros.dataEvento && <ErroCampoForm mensagem={erros.dataEvento}/>} */}
                  </div>
                </div>
                <div className='texto-input-hora-inicio-evento'>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Valor do serviço por unidade</div>
                    <div className='input-tamanho'>
                      <Input 
                        value={servicoEditado?.valorServico || ""}  
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, valorServico: e.target.value } : null
                        )} 
                        dica='R$'
                      />
                      {/* {erros.horaInicio && <ErroCampoForm mensagem={erros.horaInicio}/>} */}
                    </div>
                  </div>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Quantidade mínima</div>
                    <div className='input-tamanho'>
                      <Input 
                        value={servicoEditado?.qntMinima || ""}
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, qntMinima: e.target.value } : null
                        )} 
                        dica='--:--'
                      />
                      {/* {erros.horaFim && <ErroCampoForm mensagem={erros.horaFim}/>} */}
                    </div>
                  </div>
                </div>
                <div className='texto-input-cep-endereco'>
                  <div className='input-texto-cep-numero'>
                    <div className='textos'>Quantidade máxima</div>
                    <div className='input-tamanho-cep-numero'>
                        <Input 
                            value={servicoEditado?.qntMaxima || ""}
                            onChange={(e:any) => setServicoEditado((prev:any) =>
                            prev ? { ...prev, qntMaxima: e.target.value } : null
                        )} 
                        dica='--:--'
                      />
                      {/* {erros.cepLocal && <ErroCampoForm mensagem={erros.cepLocal}/>} */}
                    </div>
                  </div>
                </div>
              </div>  
            </div>
          </Modal>
        : ''
      }
      { 
        abrirApagarServico ?
          <Modal titulo='Apagar Serviço' textoBotao="Apagar" funcaoSalvar={ApagarServico} enviaModal={AbrirModalApagarServico}>
            <div className='modal-apagar-evento'>
              <div className='texto-apagar-evento'>Você tem certeza que deseja apagar o servico "{servico.nomeServico}"?</div>
            </div>
          </Modal>
        : ''
      }
      {
        editadoOk &&
        <div className='editar-evento__alerta'>
          <Alerta texto="Evento editado com sucesso!" status="sucesso" ativado={true}/>
        </div>
      }
    </div>
  )
}

export default CabecalhoServico;