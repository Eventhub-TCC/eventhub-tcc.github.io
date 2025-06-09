import './CabecalhoEvento.css'
import Botao from '../../componentes/Botao/Botao'
import { NavLink, useNavigate } from 'react-router'
import { Modal } from '../Modal/Modal'
import Input from '../Input/Input'
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import api from '../../axios'
import Select from '../../componentes/Select/Select';
import ErroCampoForm from '../../componentes/ErroCampoForm/ErroCampoForm';
import axios from 'axios';
import { PatternFormat } from 'react-number-format';
import sweetAlert from 'sweetalert2'
import Alerta from '../Alerta/Alerta'
import InputQuantidade from '../InputQuantidade/InputQuantidade'
import ToolTip from '../ToolTip/ToolTip'
import TextArea from '../TextArea/TextArea'

interface TipoEvento {
  idTipoEvento: string;
  descricaoTipoEvento: string;
}

const CabecalhoEvento = ({ idEvento, evento, preViewEv, setEvento, idUsuario }: any) => {
  const [abrirEdicaoEvento, setAbrirEdicaoEvento] = useState(false)
  const [abrirApagarEvento, setAbrirApagarEvento] = useState(false)
  const [abrirConfiguracoesEvento, setAbrirConfiguracoesEvento] = useState(false)
  const [eventoEditado, setEventoEditado] = useState({ ...evento, tipoEvento: evento.tipoEvento.idTipoEvento })
  const [qtdAcompanhantes, setQtdAcompanhantes] = useState(evento.qtdMaxAcompanhantes)
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [travado, setTravado] = useState(false)
  const [erroCep, setErroCep] = useState(false)
  const [tipoEventoDisponiveis, setTipoEventoDisponiveis] = useState<TipoEvento[]>([])
  const inputImagemref = useRef<HTMLInputElement>(null)
  const [imagemEvento, setImagemEvento] = useState<File | null>(null)
  const [preView, setPreview] = useState(preViewEv)
  const [imagemEditada, setImagemEditada] = useState(false)
  const [editadoOk, setEditadoOk] = useState(false)
  const [configOk, setConfigOk] = useState(false)

  const navigate = useNavigate();

  const AbrirModalEditarEvento = () => {
    setEventoEditado({...evento, tipoEvento: evento.tipoEvento.idTipoEvento});
    setAbrirEdicaoEvento(!abrirEdicaoEvento)
  }

  const AbrirModalApagarEvento = () => {
    setAbrirApagarEvento(!abrirApagarEvento)
  }

  const abrirModalConfiguracoes = () => {
    setQtdAcompanhantes(evento.qtdMaxAcompanhantes);
    setAbrirConfiguracoesEvento(!abrirConfiguracoesEvento)
  }

  const formatarDados = {
    data: (data: string) => {
      return new Date(data).toISOString().slice(0, 10).split('-').reverse().join('/');
    },
    hora: (hora: string) => {
      return hora.slice(0, 5);
    },
    endereco: (endereco: string, numeroEndereco: string) => {
      return endereco || numeroEndereco ? `${endereco}, ${numeroEndereco}` : 'Endereço não definido';
    }
  }

  const validarFormulario = async () => {
    const novosErros: { [key: string]: string } = {};

    if (!eventoEditado?.nomeEvento) novosErros.nomeEvento = "O nome do evento é obrigatório.";
    if (!eventoEditado?.tipoEvento) novosErros.tipoEvento = "Selecione um tipo de evento.";
    if (!eventoEditado?.dataEvento) novosErros.dataEvento = "A data do evento é obrigatória.";
    if (!eventoEditado?.horaInicio) novosErros.horaInicio = "Hora de início é obrigatória.";
    if (!eventoEditado?.horaFim) novosErros.horaFim = "Hora de término é obrigatória.";
    if (erroCep) novosErros.cepLocal = "CEP inválido.";

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  const buscarCep = async (cep: string) => {
    try {
      const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const local = res.data;
      if (local.erro) {
        setErroCep(true);
      }
      else {
        setEventoEditado((prevState: any) =>
          prevState ?
            {
              ...prevState,
              enderecoLocal: local.logradouro,
              bairroLocal: local.bairro,
              cidadeLocal: local.localidade,
              ufLocal: local.uf,
            }
            : null
        );
        setTravado(true);
        setErroCep(false);
      }
    }
    catch (error) {
      console.log('Ocorreu algum erro: ', error);
    }
  };

  useEffect(() => {
    if (eventoEditado && eventoEditado.cepLocal.length === 8) {
      buscarCep(eventoEditado.cepLocal);
      setErroCep(false);
    } else if ((eventoEditado?.cepLocal ?? "").length < 8 && eventoEditado?.cepLocal.length > 0) {
      setErroCep(true);
      setTravado(false)
    } else {
      setTravado(false);
    }
  }, [eventoEditado?.cepLocal]);

  useEffect(() => {
    validarFormulario();
  }, [erroCep]);

  useEffect(() => {
    const buscarTiposDeEventos = async () => {
      try {
        const tipoEvento = await api.get('/users/tipo-evento')
        setTipoEventoDisponiveis(tipoEvento.data)
      }
      catch (error) {
        console.log('ocorreu algum erro: ', error)
        return
      }
    }
    buscarTiposDeEventos()
  }, [])

  useEffect(() => {
    if (evento) {
      setEventoEditado({ ...evento, tipoEvento: evento.tipoEvento.idTipoEvento });
      setQtdAcompanhantes(evento.qtdMaxAcompanhantes);
    }
  }, [evento]);

  const editarEvento = async () => {
    if (!await validarFormulario()) return;
    if (!eventoEditado) return alert("Evento não carregado corretamente!");
    try {
      const formData = new FormData();

      formData.append("nomeEvento", eventoEditado.nomeEvento);
      formData.append("descricaoEvento", eventoEditado.descricaoEvento || '');
      formData.append("idTipoEvento", eventoEditado.tipoEvento);
      formData.append("dataEvento", eventoEditado.dataEvento);
      formData.append("horaInicio", eventoEditado.horaInicio);
      formData.append("horaFim", eventoEditado.horaFim);
      formData.append("cepLocal", eventoEditado.cepLocal);
      formData.append("enderecoLocal", eventoEditado.enderecoLocal);
      formData.append("numeroLocal", eventoEditado.numeroLocal);
      formData.append("complementoLocal", eventoEditado.complementoLocal ?? "");
      formData.append("bairroLocal", eventoEditado.bairroLocal);
      formData.append("cidadeLocal", eventoEditado.cidadeLocal);
      formData.append("ufLocal", eventoEditado.ufLocal);

      if (imagemEditada) {
        if (imagemEvento) {
          formData.append("file", imagemEvento);
          formData.append("imagemEditada", "true");
        } else if (imagemEvento === null) {
          formData.append("imagemEditada", "true");
        }
      } else {
        formData.append("imagemEditada", "false");
      }

      await api.put(`/users/events/${evento.idEvento}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditadoOk(true);
      setTimeout(() => {
        setEditadoOk(false);
      }
        , 10000)

      AbrirModalEditarEvento();
      setEvento({
        ...evento,
        ...eventoEditado,
        tipoEvento: {
          idTipoEvento: eventoEditado.tipoEvento,
          descricaoTipoEvento: tipoEventoDisponiveis.find((tipo) => tipo.idTipoEvento.toString() === eventoEditado.tipoEvento)?.descricaoTipoEvento
        },
        imagemEvento: imagemEvento instanceof File ? URL.createObjectURL(imagemEvento) : evento.imagemEvento,
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

  const ApagarEvento = () => {
    api.delete(`/users/${idUsuario}/events/${evento.idEvento}`)
      .then(() => {
        navigate('/organizador/meus-eventos');
      })
      .catch((err) => {
        console.error("Erro ao apagar evento", err);
      });
    setAbrirApagarEvento(!abrirApagarEvento)
  }

  const salvarConfiguracoes = async () => {
    if(qtdAcompanhantes === evento.qtdMaxAcompanhantes) {
      setAbrirConfiguracoesEvento(!abrirConfiguracoesEvento);
      return;
    }
    try{
      await api.put(`/users/events/${evento.idEvento}/atualizar-acompanhantes`, {
        qtdMaxAcompanhantes: qtdAcompanhantes
      })
      setEvento((prev: any) => ({
        ...prev,
        qtdMaxAcompanhantes: qtdAcompanhantes
      }));
      setConfigOk(true);
      setTimeout(() => {
        setConfigOk(false);
      }, 10000)
      setAbrirConfiguracoesEvento(!abrirConfiguracoesEvento);
    }
    catch(erro){
      console.error("Erro ao atualizar configurações do evento:", erro);
    }
  }

  return (
    <div className="cabecalho-eventos">
      <div className='container'>
        <div className="titulo-infos-eventos">
          <div className="titulo-informacoes">
            <div className="titulo-do-evento">
              <h1 className='cabecalho-evento__titulo' title={evento.nomeEvento}>{evento.nomeEvento}</h1>
            </div>
            <div className="informacoes-evento">
              <div className='alinhamento-info-icone'>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M6.78125 15.0677V15M10.7188 15.0677V15M10.7188 11.4V11.3323M14.2188 11.4V11.3323M4.15625 7.79997H16.4063M5.73958 2.625V3.97516M14.6563 2.625V3.97499M14.6563 3.97499H5.90625C4.4565 3.97499 3.28125 5.18382 3.28125 6.67498V15.675C3.28125 17.1662 4.4565 18.375 5.90625 18.375H14.6562C16.106 18.375 17.2812 17.1662 17.2812 15.675L17.2813 6.67498C17.2813 5.18382 16.106 3.97499 14.6563 3.97499Z" stroke="#55379D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {formatarDados['data'](evento.dataEvento)}
              </div>
              <div className='alinhamento-info-icone'>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M13.5744 13.4174C14.0983 13.5921 14.6647 13.3089 14.8393 12.785C15.014 12.261 14.7308 11.6947 14.2069 11.5201L13.5744 13.4174ZM10.9375 11.4844H9.9375C9.9375 11.9148 10.2129 12.2969 10.6213 12.4331L10.9375 11.4844ZM11.9375 7.36826C11.9375 6.81598 11.4898 6.36826 10.9375 6.36826C10.3852 6.36826 9.9375 6.81598 9.9375 7.36826H11.9375ZM14.2069 11.5201L11.2537 10.5357L10.6213 12.4331L13.5744 13.4174L14.2069 11.5201ZM11.9375 11.4844V7.36826H9.9375V11.4844H11.9375ZM17.8125 10.5C17.8125 14.297 14.7345 17.375 10.9375 17.375V19.375C15.839 19.375 19.8125 15.4015 19.8125 10.5H17.8125ZM10.9375 17.375C7.14054 17.375 4.0625 14.297 4.0625 10.5H2.0625C2.0625 15.4015 6.03597 19.375 10.9375 19.375V17.375ZM4.0625 10.5C4.0625 6.70304 7.14054 3.625 10.9375 3.625V1.625C6.03597 1.625 2.0625 5.59847 2.0625 10.5H4.0625ZM10.9375 3.625C14.7345 3.625 17.8125 6.70304 17.8125 10.5H19.8125C19.8125 5.59847 15.839 1.625 10.9375 1.625V3.625Z" fill="#55379D" />
                  </svg>
                </div>
                {formatarDados['hora'](evento.horaInicio)} - {formatarDados['hora'](evento.horaFim)}
              </div>
              <div className={`alinhamento-info-icone ${evento.enderecoLocal || evento.numeroLocal ? '' : 'cabecalho-evento--sem-endereco'}`}>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M10.4999 18.8996C10.4999 18.8996 17.0739 13.0561 17.0739 8.67352C17.0739 5.04285 14.1306 2.09961 10.4999 2.09961C6.86927 2.09961 3.92603 5.04285 3.92603 8.67352C3.92603 13.0561 10.4999 18.8996 10.4999 18.8996Z" stroke={`${evento.enderecoLocal || evento.numeroLocal ? '#55379D' : '#afafaf'}`} strokeWidth="2" />
                    <path d="M12.6002 8.39974C12.6002 9.55954 11.66 10.4997 10.5002 10.4997C9.34041 10.4997 8.40021 9.55954 8.40021 8.39974C8.40021 7.23994 9.34041 6.29974 10.5002 6.29974C11.66 6.29974 12.6002 7.23994 12.6002 8.39974Z" stroke={`${evento.enderecoLocal || evento.numeroLocal ? '#55379D' : '#afafaf'}`} strokeWidth="2" />
                  </svg>
                </div>
                {formatarDados['endereco'](evento.enderecoLocal, evento.numeroLocal)}
              </div>
            </div>
          </div>
          <div className="botoes-evento-container">
            <div className="botoes-evento">
              <div className='botao-evento'>
                <Botao
                  texto="Editar evento"
                  tamanho="med"
                  tipo="botao"
                  funcao={() => setAbrirEdicaoEvento(true)}
                />
              </div>
              <div className='botao-evento'>
                <Botao
                  texto="Apagar evento"
                  tamanho="med"
                  tipo="botao"
                  funcao={() => setAbrirApagarEvento(true)}
                />
              </div>
            </div>
            <div className='botao-configuracao-container'>
              <button type='button' className='botao-configuracao-evento' onClick={() => setAbrirConfiguracoesEvento(true)}>
                <i className="fa-solid fa-gear"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="abas-evento">
          <NavLink
            to={`/organizador/meus-eventos/${idEvento}/informacoes-meus-eventos`}
            className={({ isActive }: any) => (`aba-evento ${isActive ? "aba-evento--ativo" : ''}`)}
          >
            Informações Gerais
          </NavLink>
          <NavLink
            to={`/organizador/meus-eventos/${idEvento}/convidados`}
            className={({ isActive }: any) => (`aba-evento ${isActive ? "aba-evento--ativo" : ''}`)}
          >
            Convidados
          </NavLink>
          <NavLink
            to={`/organizador/meus-eventos/${idEvento}/convites`}
            className={({ isActive }: any) => (`aba-evento ${isActive ? "aba-evento--ativo" : ''}`)}
          >
            Convites
          </NavLink>
        </div>
      </div>
      {
        abrirEdicaoEvento ?
          <Modal funcaoSalvar={editarEvento} titulo='Editar evento' enviaModal={AbrirModalEditarEvento}>
            <div className='modal-editar-evento'>
              <div className='campos-editar-evento'>
                <div className='nome-categoria-evento'>
                  <div className='nome-input-evento'>
                    <div className='textos'>Nome do evento</div>
                    <div className="input-tamanho">
                      <Input
                        value={eventoEditado?.nomeEvento || ""}
                        onChange={(e: any) => setEventoEditado((prev: any) =>
                          prev ? { ...prev, nomeEvento: e.target.value } : null
                        )}
                        type='text'
                        dica='Digite um nome para o evento'
                      />
                      {erros.nomeEvento && <ErroCampoForm mensagem={erros.nomeEvento} />}
                    </div>
                  </div>
                  <div className='categoria-input-evento'>
                    <div className='input-tamanho'>
                      <Select
                        cabecalho
                        cabecalhoTexto='Tipo de Evento'
                        textoPadrao='Selecione o tipo de evento'
                        valor={eventoEditado?.tipoEvento}
                        funcao={(e: ChangeEvent<HTMLSelectElement>) => setEventoEditado((prev: any) => prev ? { ...prev, tipoEvento: e.target.value } : null)}
                        required={true}
                      >
                        {tipoEventoDisponiveis.map(tipo => <option value={tipo.idTipoEvento}>{tipo.descricaoTipoEvento}</option>)}
                      </Select>
                      {erros.tipoEvento && <ErroCampoForm mensagem={erros.tipoEvento} />}
                    </div>
                  </div>
                </div>
                <div className='descricao-input-evento'>
                  <div className='input-tamanho-descricao'>
                    <TextArea
                      titulo='Descrição do evento (opcional)'
                      placeholder='Digite uma descrição para o seu evento...'
                      name='descricao-evento'
                      valor={eventoEditado?.descricaoEvento || ""}
                      onChange={(e: any) => setEventoEditado((prev: any) =>
                        prev ? { ...prev, descricaoEvento: e.target.value } : null
                      )}
                      />
                  </div>
                </div>
                <div className='imagem-evento'>
                  <div className='imagem-evento-texto-botao'>
                    <div className='texto-imagem-evento'>Imagem do evento(Opcional)</div>
                    <div className='input-imagem-evento'>
                      <div className='cadastro-evento__container-imagem'>
                        <input
                          type='file'
                          className='cadastro-evento__input_imagem'
                          accept='image/*'
                          ref={inputImagemref}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setImagemEvento(e.target.files[0])
                              setPreview(URL.createObjectURL(e.target.files[0]))
                              setImagemEditada(true)
                            }
                            else {
                              setImagemEvento(null)
                              setPreview('')
                            }
                          }}
                        />
                        {preView ? <img src={preView} className='cadastro-evento__imagem' /> : <div className='cadastro-evento__sem-imagem'> <i className='fa-solid fa-image cadastro-evento__sem-imagem-icone' /></div>}
                      </div>
                      <div className='botoes-imagem'>
                        <Botao
                          tamanho='min'
                          texto='Selecionar arquivo'
                          funcao={() => inputImagemref.current?.click()}
                        />
                        <Botao
                          tamanho='min'
                          texto='Remover'
                          funcao={() => {
                            setImagemEvento(null)
                            URL.revokeObjectURL(preView)
                            setPreview('')
                            setImagemEditada(true)
                            console.log('imagemEditada', imagemEditada)
                            if (inputImagemref.current)
                              inputImagemref.current.value = ""
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='novos-dados-eventos'>
                <div className='texto-input-data'>
                  <div className='textos'>Data do evento</div>
                  <div className='input-data-evento'>
                    <Input
                      value={eventoEditado?.dataEvento || ""}
                      onChange={(e: any) => setEventoEditado((prev: any) =>
                        prev ? { ...prev, dataEvento: e.target.value } : null
                      )}
                      type='date'
                      dica='dd/mm/aaaa'
                    />
                    {erros.dataEvento && <ErroCampoForm mensagem={erros.dataEvento} />}
                  </div>
                </div>
                <div className='texto-input-hora-inicio-evento'>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Hora ínicio do evento</div>
                    <div className='input-tamanho'>
                      <Input
                        value={eventoEditado?.horaInicio || ""}
                        onChange={(e: any) => setEventoEditado((prev: any) =>
                          prev ? { ...prev, horaInicio: e.target.value } : null
                        )}
                        type='time'
                        dica='--:--'
                      />
                      {erros.horaInicio && <ErroCampoForm mensagem={erros.horaInicio} />}
                    </div>
                  </div>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Hora fim do evento</div>
                    <div className='input-tamanho'>
                      <Input
                        value={eventoEditado?.horaFim || ""}
                        onChange={(e: any) => setEventoEditado((prev: any) =>
                          prev ? { ...prev, horaFim: e.target.value } : null
                        )}
                        type='time'
                        dica='--:--'
                      />
                      {erros.horaFim && <ErroCampoForm mensagem={erros.horaFim} />}
                    </div>
                  </div>
                </div>
                <div className='texto-input-cep-endereco'>
                  <div className='input-texto-cep-numero'>
                    <div className='textos'>CEP</div>
                    <div className='input-tamanho-cep-numero'>
                      <PatternFormat
                        format={'#####-###'}
                        mask={'_'}
                        value={eventoEditado?.cepLocal || ""}
                        onValueChange={(values: any) => setEventoEditado((prev: any) =>
                          prev ? { ...prev, cepLocal: values.value } : null
                        )}
                        customInput={Input}
                        type='text' dica='Digite o CEP do local'
                      />
                      {erros.cepLocal && <ErroCampoForm mensagem={erros.cepLocal} />}
                    </div>
                  </div>
                  <div className='input-texto-endereco-complemento'>
                    <div className='textos'>Endereço</div>
                    <div className='input-tamanho-endereco-complemento'>
                      <Input
                        disabled={travado}
                        value={eventoEditado?.enderecoLocal || ""}
                        onChange={(e: any) => setEventoEditado((prev: any) =>
                          prev ? { ...prev, enderecoLocal: e.target.value } : null
                        )}
                        type='text'
                        dica='Digite o endereço do local'
                      />
                      {erros.enderecoLocal && <ErroCampoForm mensagem={erros.enderecoLocal} />}
                    </div>
                  </div>
                </div>
                <div className='input-texto-numero-complemento'>
                  <div className='input-texto-cep-numero'>
                    <div className='textos'>Número</div>
                    <div className='input-tamanho-cep-numero'>
                      <Input
                        value={eventoEditado?.numeroLocal || ""}
                        onChange={(e: any) => setEventoEditado((prev: any) =>
                          prev ? { ...prev, numeroLocal: e.target.value } : null
                        )}
                        type='text'
                        dica='Digite o número do local'
                      />
                      {erros.numeroLocal && <ErroCampoForm mensagem={erros.numeroLocal} />}
                    </div>
                  </div>
                  <div className='input-texto-endereco-complemento'>
                    <div className='textos'>Complemento(Opcional)</div>
                    <div className='input-tamanho-endereco-complemento'>
                      <Input
                        value={eventoEditado?.complementoLocal || ""}
                        onChange={(e: any) => setEventoEditado((prev: any) =>
                          prev ? { ...prev, complementoLocal: e.target.value } : null
                        )}
                        type='text'
                        dica='Digite o complemento'
                      />
                    </div>
                  </div>
                </div>
                <div className='input-texto-bairro'>
                  <div className='textos'>Bairro (Opcional)</div>
                  <div className='input-bairro'>
                    <Input
                      disabled={travado}
                      value={eventoEditado?.bairroLocal || ""}
                      onChange={(e: any) => setEventoEditado((prev: any) =>
                        prev ? { ...prev, bairroLocal: e.target.value } : null
                      )}
                      type='text'
                      dica='Digite o bairro do local do evento'
                    />
                  </div>
                </div>
                <div className='input-texto-cidade-uf'>
                  <div className='input-cidade'>
                    <div className='textos'>Cidade (Opcional)</div>
                    <div className='input-tamanho-cidade'>
                      <Input
                        disabled={travado}
                        value={eventoEditado?.cidadeLocal || ""}
                        onChange={(e: any) => setEventoEditado((prev: any) =>
                          prev ? { ...prev, cidadeLocal: e.target.value } : null
                        )}
                        type='text'
                        dica='Digite a cidade do local'
                      />
                    </div>
                  </div>
                  <div className='input-uf'>
                    <div className='textos'>UF (Opcional)</div>
                    <div className='input-tamanho-uf'>
                      <Input
                        disabled={travado}
                        value={eventoEditado?.ufLocal || ""}
                        onChange={(e: any) => setEventoEditado((prev: any) =>
                          prev ? { ...prev, ufLocal: e.target.value } : null
                        )}
                        type='text'
                        dica='Digite a UF'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          : ''
      }
      {
        abrirApagarEvento ?
          <Modal titulo='Apagar evento' textoBotao="Apagar" funcaoSalvar={ApagarEvento} enviaModal={AbrirModalApagarEvento}>
            <div className='modal-apagar-evento'>
              <div className='texto-apagar-evento'>Você tem certeza que deseja apagar o evento "{evento.nomeEvento}"?</div>
            </div>
          </Modal>
          : ''
      }
      {
        abrirConfiguracoesEvento &&
        <Modal titulo='Configurações do evento' enviaModal={abrirModalConfiguracoes} funcaoSalvar={salvarConfiguracoes} centralizarBotoes>
          <div className='modal-configuracoes-evento'>
            <div className='modal-configuracoes-evento__organizador'>
              <label htmlFor="qtd-acompanhantes" className='label-input-acompanhantes'>Máximo padrão de acompanhantes por convite</label>
              <ToolTip mensagem="Define o número máximo de acompanhantes que um convidado poderá levar ao preencher seu convite. Esse valor será aplicado como padrão, mas poderá ser ajustado individualmente para convites específicos, se necessário."></ToolTip>
            </div>
            <div className='d-flex align-itens-center'>
              <div className='cabecalho-evento__input-acompanhantes'>
              <InputQuantidade 
              qtdMaxima={99} 
              qtdAtual={qtdAcompanhantes} 
              setQtdAtual={setQtdAcompanhantes}
              name='qtd-acompanhantes'
              />
              </div>
            </div>
          </div>
        </Modal>
      }
      {
        editadoOk &&
        <div className='editar-evento__alerta'>
          <Alerta texto="Evento editado com sucesso!" status="sucesso" ativado={true} />
        </div>
      }
      {
        configOk &&
        <div className='editar-evento__alerta'>
          <Alerta texto="Configurações salvas com sucesso!" status="sucesso" ativado={true} />
        </div>
      }
    </div>
  )
}

export default CabecalhoEvento;