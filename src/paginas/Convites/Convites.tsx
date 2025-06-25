import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento'
import './Convites.css';
import Botao from "../../componentes/Botao/Botao";
import { Modal } from "../../componentes/Modal/Modal";
import api from "../../axios";
import InputQuantidade from "../../componentes/InputQuantidade/InputQuantidade";
import CheckBox from "../../componentes/CheckBox/CheckBox";
import Secao from "../../componentes/Secao/Secao";
import { Helmet } from "react-helmet-async";

const apiUrl = import.meta.env.VITE_API_URL;

interface Evento {
  idEvento: number;
  nomeEvento: string;
  status?: string;
  dataEvento: string;
  horaInicio: string;
  horaFim: string;
  cepLocal: string;
  enderecoLocal: string;
  numeroLocal: string;
  complementoLocal: string;
  bairroLocal: string;
  cidadeLocal: string;
  ufLocal: string;
  imagem?: string;
  tipoEvento?: string;
  descricaoEvento?: string;
  qtdMaxAcompanhantes: string;
}

export interface Convite {
  idConvite: string;
  dataConvite: string;
  status: 'Utilizado' | 'Pendente';
}

const Convites = () => {
  const { idEvento } = useParams();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [modoApagarConvite, setModoApagarConvite] = useState(false);
  const [convites, setConvites] = useState<Convite[]>([]);
  const [linkConvite, setLinkConvite] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<any>(null);
  const [idConviteApagado, setIdConviteApagado] = useState('');
  const [preView, setPreview] = useState('')
  const [abrirGerarConvite, setAbrirGerarConvite] = useState(false);
  const [gerarLink, setGerarLink] = useState(false);
  const [qtdAcompanhantes, setQtdAcompanhantes] = useState(0);
  const [qtdPadraoEvento, setQtdPadraoEvento] = useState(false);

  const abrirModalGerarConvite = () => {
    setQtdAcompanhantes(Number(evento?.qtdMaxAcompanhantes))
    setAbrirGerarConvite(!abrirGerarConvite);
  }

  useEffect(() => {
    try {
      api.get(`/users/get-user`)
        .then((res) => {
          setIdUsuario(res.data.idUsuario);
          api.get(`/users/${idUsuario}/events/${idEvento}`)
            .then((res) => {
              setEvento(res.data);
              setQtdAcompanhantes(res.data.qtdMaxAcompanhantes);
              const urlPreview = res.data.imagemEvento
                ? `${apiUrl}/files/${res.data.imagemEvento}`
                : '';
              setPreview(urlPreview);
              const status = definirStatusEvento(res.data);
              setEvento({ ...res.data, status });
            })
            .catch((err) => {
              console.error("Erro ao buscar o evento", err);
            });
        })
        .catch((err) => {
          console.error("Erro obter usuário", err);
        });
    }
    catch (error) {
      console.error('Erro ao obter eventos', error);
    }
  }, [idEvento]);

  useEffect(() => {
    if (Number(evento?.qtdMaxAcompanhantes) !== qtdAcompanhantes) {
      setQtdAcompanhantes(Number(evento?.qtdMaxAcompanhantes));
    }
  }, [evento])

  const gerarConvite = async () => {
    try {
      const response = await api.post(`/users/gerar-convite/${idEvento}`, {
        qtdMaxAcompanhantes: qtdAcompanhantes,
        qtdMaxAcompanhantesEvento: qtdPadraoEvento
      });
      setConvites(prevConvites => [...prevConvites, response.data.convite]);
      if(qtdPadraoEvento) {
        setEvento(prevEvento => prevEvento ? ({...prevEvento, qtdMaxAcompanhantes: qtdAcompanhantes.toString()}) : prevEvento)
      }
      setLinkConvite(`${window.location.origin}/#/confirmar-presenca/${response.data.convite.idConvite}`);
      setQtdPadraoEvento(false);
      setGerarLink(true);
    } catch (error) {
      console.error("Erro ao gerar convite:", error);
      alert("Erro ao gerar o link de convite.");
    }
  };

  const copiarLink = async () => {
    if (linkConvite) {
      await navigator.clipboard.writeText(linkConvite);
      setLinkConvite(null);
    }
    setAbrirGerarConvite(!abrirGerarConvite);
    setGerarLink(false);
  };

  const buscarConvites = async (idEvento: string, setConvites: Function) => {
    try {
      const response = await api.get(`/users/obter-convites/${idEvento}`);
      setConvites(response.data);
    } catch (error) {
      console.error('Erro ao buscar convites:', error);
    }
  };

  useEffect(() => {
    const ObterEventoeUsuario = async () => {
      try {
        const res = await api.get(`/users/get-user`);
        setIdUsuario(res.data.codigoUsu);

        const evento = await api.get(`/users/${idUsuario}/events/${idEvento}`);
        setEvento(evento.data);

        if (idEvento) {
          await buscarConvites(idEvento, setConvites);
        } else {
          console.error('idEvento está indefinido.');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
    ObterEventoeUsuario();
  }, [idEvento]);

  const deletarConvite = async (idConvite: any) => {
    try {
      await api.delete(`/users/deletar-convite/${idConvite}`);
      setConvites(prevConvites => prevConvites.filter(convite => convite.idConvite !== idConvite));
    } 
    catch (error) {
      console.error("Erro ao deletar convite:", error);
      alert("Erro ao deletar convite.");
    }
  };

  function definirStatusEvento(evento: Evento): string {
    const agora = new Date();

    const dataEvento = new Date(evento.dataEvento);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataEvento.setHours(0, 0, 0, 0);

    const dataEhHoje = dataEvento.getTime() === hoje.getTime();

    const [horaIni, minIni] = evento.horaInicio.split(':').map(Number);
    const [horaFim, minFim] = evento.horaFim.split(':').map(Number);

    const inicio = new Date(evento.dataEvento);
    inicio.setHours(horaIni, minIni, 0, 0);

    const fim = new Date(evento.dataEvento);
    fim.setHours(horaFim, minFim, 0, 0);

    if (dataEhHoje) {
      if (agora >= inicio && agora <= fim) return 'Em Progresso';
      else if (agora < inicio) return 'Proximos Eventos';
      else return 'Evento Finalizado';
    } 
    else if (dataEvento > hoje) {
      return 'Proximos Eventos';
    } 
    else {
      return 'Evento Finalizado';
    }
  }

  const abrirModalApagarConvite = (idConvite: string) => {
    setModoApagarConvite(!modoApagarConvite)
    setIdConviteApagado(idConvite)
  }

  if (!evento) return <p>Carregando evento...</p>;

  return (
    <>
      <Helmet>
        <title>{evento.nomeEvento} | Convites | EventHub</title>
      </Helmet>
      <div className="tela-convites-evento">
        <div className="informacoes-evento__cabecalho">
          <CabecalhoEvento
            idEvento={idEvento}
            evento={evento}
            preViewEv={preView}
            setEvento={setEvento}
            idUsuario={idUsuario}
          />
        </div>
        <div className="informacoes-evento__container">
          <Secao titulo='Convites'>
            <div className="convites">
              <div className="botoes-convites">
                <div className="confirmar-presencas">
                  <Botao funcao={abrirModalGerarConvite} texto='Gerar convite' />
                </div>
              </div>
              <table className="tabela-convites">
                <thead>
                  <tr>
                    <th>Convite</th>
                    <th>Gerado em</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    convites.map(convite => (
                      <tr key={convite.idConvite}>
                        <td><a href={`${window.location.origin}/#/confirmar-presenca/${convite.idConvite}`} target="_blank" className="link-convite">{convite.idConvite}</a></td>
                        <td>{convite.dataConvite.slice(0,10).split('-').reverse().join('/')}</td>
                        <td>
                          <span className={`status-convidado ${convite.status.toLowerCase()}`}>
                            <span>{convite.status}</span>
                          </span>
                        </td>
                        <td>
                          { convite.status === 'Pendente' &&
                          <button
                          style={{ background: 'none', border: 'none', padding: 0, margin: 0, width: '100%', textAlign: 'left', cursor: 'pointer' }}
                          onClick={() => abrirModalApagarConvite(convite.idConvite)}
                          >
                            <div className="excluir-convite">
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <path d="M12.3828 2.58853C12.8711 2.12466 12.8711 1.37134 12.3828 0.907471C11.8945 0.443604 11.1016 0.443604 10.6133 0.907471L6.5 4.8188L2.38281 0.911182C1.89453 0.447314 1.10156 0.447314 0.613281 0.911182C0.125 1.37505 0.125 2.12837 0.613281 2.59224L4.73047 6.49985L0.617188 10.4112C0.128906 10.875 0.128906 11.6284 0.617188 12.0922C1.10547 12.5561 1.89844 12.5561 2.38672 12.0922L6.5 8.18091L10.6172 12.0885C11.1055 12.5524 11.8984 12.5524 12.3867 12.0885C12.875 11.6247 12.875 10.8713 12.3867 10.4075L8.26953 6.49985L12.3828 2.58853Z" fill="#CED4DA" />
                              </svg>
                            </div>
                          </button>

                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              {
                modoApagarConvite &&
                <Modal 
                  titulo='Excluir convite' 
                  textoBotao="Excluir" 
                  funcaoSalvar={() => { 
                    deletarConvite(idConviteApagado); 
                    setModoApagarConvite(!modoApagarConvite) 
                  }} 
                  enviaModal={abrirModalApagarConvite}
                >
                  Tem certeza de que deseja excluir este convite?
                </Modal>
              }
              {
                abrirGerarConvite ?
                  <Modal 
                    enviaModal={abrirModalGerarConvite} 
                    titulo='Gerar convites' 
                    funcaoCancelar={() => {
                      setGerarLink(false)
                      setQtdPadraoEvento(false);
                    }}
                    funcaoSalvar={gerarLink ? copiarLink : gerarConvite} 
                    textoBotao={gerarLink ? 'Copiar Link' : 'Gerar'}
                    centralizarBotoes
                  > 
                    {
                      gerarLink ?
                        <p className="gerar-convite__nao-gerado">O convite foi gerado! Copie o link no botão abaixo e compartilhe com o seu convidado.</p>
                      :
                      <div className="gerar-convite">
                        <p className="gerar-convite__texto">Defina a quantidade máxima de acompanhantes para este convite.</p>
                        <div className="gerar-convite__container-input">
                          <div className="gerar-convite__input">
                          <InputQuantidade 
                            qtdMaxima={99}
                            qtdAtual={qtdAcompanhantes}
                            setQtdAtual={setQtdAcompanhantes}
                            nome='qtd-acompanhantes'
                          />
                        </div>
                        </div>
                        <div className="gerar-convite__checkbox">
                          <CheckBox 
                            name='maximo-acompanhantes'
                            ativado={qtdPadraoEvento}
                            funcao={() => setQtdPadraoEvento(!qtdPadraoEvento)}
                            texto='Definir quantidade como padrão para os próximos convites deste evento'
                          />
                        </div>
                      </div>
                    }
                  </Modal>
                :''
              }
            </div>
          </Secao>
        </div>
      </div>
    </>
  )
}

export default Convites