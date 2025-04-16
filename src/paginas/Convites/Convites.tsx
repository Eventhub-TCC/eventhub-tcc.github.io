import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento'
import { jwtDecode } from "jwt-decode";
import './Convites.css';
import Botao from "../../componentes/Botao/Botao";
import { link } from "framer-motion/client";
import { Modal } from "../../componentes/Modal/Modal";
import Input from "../../componentes/Input/Input";



interface Evento{
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
  }

  export interface Convite {
    idConvite: string;
    linkConvite: string;
    dataConvite: string;
    status: 'Utilizado' | 'Pendente';
  }

const Convites = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [modoEdicaoEvento, setModoEdicaoEvento] = useState(false);
    const [eventoEditado, setEventoEditado] = useState<Evento | null>(null);
    const [modoApagarEvento, setModoApagarvento] = useState(false);
    const [modoApagarConvite, setModoApagarConvite] = useState(false);
    const [convites, setConvites] = useState<Convite[]>([]);
    const [linkConvite, setLinkConvite] = useState<string | null>(null);
    const [idUsuario, setIdUsuario] = useState<any>(null);
    const [idConviteApagado, setIdConviteApagado] = useState('');

    useEffect(() => {
      try {
          const token = localStorage.getItem('token');
          if (!token) {
              throw new Error('Token não encontrado no localStorage');
          }
          const emailDecodificado: {email:string} = jwtDecode(token);
          axios.get(`http://localhost:3000/users/get-user/${emailDecodificado.email}`)
          .then((res) => {
              setIdUsuario(res.data.idUsuario);
              axios.get(`http://localhost:3000/users/${idUsuario}/events/${idEvento}`)
                  .then((res) => {
                      setEvento(res.data);
                      setEventoEditado(res.data);
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
      }}, [idEvento]);

    const gerarConvite = async () => {
        try {
          const response = await axios.post(`http://localhost:3000/users/gerar-convite/${idEvento}`);
          setLinkConvite(response.data.linkConvite);
          console.log("res data", response.data.linkConvite);
          console.log("linkConvite", linkConvite)
        } catch (error) {
          console.error("Erro ao gerar convite:", error);
          alert("Erro ao gerar o link de convite.");
        }
      };

      useEffect(() => {
        if (linkConvite) {
          console.log("linkConvite atualizado:", linkConvite);
        }
      }, [linkConvite]);


      const copiarLink = async () => {
        if (linkConvite) {
          await navigator.clipboard.writeText(linkConvite);
          setLinkConvite(null);
        }
      };


    const buscarConvites = async (idEvento: string, setConvites: Function) => {
        try {
          const response = await axios.get(`http://localhost:3000/users/obter-convites/${idEvento}`);
          setConvites(response.data);
        } catch (error) {
          console.error('Erro ao buscar convites:', error);
        }
      };

    useEffect(() => {
        const ObterEventoeUsuario = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token não encontrado no localStorage');
            
                const { email }: { email: string } = jwtDecode(token);
            
                const res = await axios.get(`http://localhost:3000/users/get-user/${email}`);
                setIdUsuario(res.data.codigoUsu);
            
                const evento = await axios.get(`http://localhost:3000/users/${idUsuario}/events/${idEvento}`);
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

        const deletarConvite = async (idConvite:any) => {
            try {
            console.log('idConvite', idConvite)
            console.log('deletarConvite', idConvite)
              await axios.delete(`http://localhost:3000/users/deletar-convite/${idConvite}`);
              setConvites(prevConvites => prevConvites.filter(convite => convite.idConvite !== idConvite));
            } catch (error) {
              console.error("Erro ao deletar convite:", error);
              alert("Erro ao deletar convite.");
            }
          };
    

    function guardarModo(setState: React.Dispatch<React.SetStateAction<boolean>>, valor: boolean) {
        setState(valor);
      }

      const AbrirModalEditarEvento = () => {
        setEventoEditado(evento);
       setModoEdicaoEvento(!modoEdicaoEvento)
   }

   const editarEvento = async () => {
    if (!eventoEditado) return alert("Evento não carregado corretamente!");
  
    try {
      await axios.put(`http://localhost:3000/users/events/${evento!.idEvento}`, {
        nomeEvento: eventoEditado.nomeEvento,
        tipoEvento: eventoEditado.tipoEvento,
        descricaoEvento: eventoEditado.descricaoEvento,
        dataEvento: eventoEditado.dataEvento,
        horaInicio: eventoEditado.horaInicio,
        horaFim: eventoEditado.horaFim,
        cepLocal: eventoEditado.cepLocal,
        enderecoLocal: eventoEditado.enderecoLocal,
        numeroLocal: eventoEditado.numeroLocal,
        complementoLocal: eventoEditado.complementoLocal,
        bairroLocal: eventoEditado.bairroLocal,
        cidadeLocal: eventoEditado.cidadeLocal,
        ufLocal: eventoEditado.ufLocal,
      });
  
      alert("Evento atualizado com sucesso!");
      AbrirModalEditarEvento();
      window.location.href = '/meus-eventos';
  
    } catch (err) {
      console.error("Erro ao editar evento:", err);
      alert("Erro ao atualizar evento.");
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
    } else if (dataEvento > hoje) {
        return 'Proximos Eventos';
    } else {
        return 'Evento Finalizado';
    }
}

      const AbrirModalApagarEvento = () => {
        setModoApagarvento(!modoApagarEvento)
    }

    const abrirModalApagarConvite = (idConvite: string) => {
      setModoApagarConvite(!modoApagarConvite)
      setIdConviteApagado(idConvite)
    }


    const ApagarEvento = () => {
        axios.delete(`http://localhost:3000/users/${idUsuario}/events/${idEvento}`)
            .then((res) => {
                console.log(res.data);
                window.location.href = '/meus-eventos';
            })
            .catch((err) => {
                console.error("Erro ao apagar evento", err);
            });
        setModoApagarvento(!modoApagarEvento)
    }

      if (!evento) return <p>Carregando evento...</p>;

      return (
        <div className="tela-convidados-evento">
                <CabecalhoEvento
                idEvento={idEvento} 
                EnviaModoEdicao={(valor: boolean) => guardarModo(setModoEdicaoEvento, valor)} 
                EnviaModoApagar={(valor: boolean) => guardarModo(setModoApagarvento, valor)}
                tituloEvento={evento.nomeEvento}
                dataEvento={evento.dataEvento}
                horaInicio={evento.horaInicio}
                horaFim={evento.horaFim}
                localEvento={evento.enderecoLocal +', '+ evento.numeroLocal + ', ' + evento.cidadeLocal + ' - ' + evento.ufLocal}
            />
            <div className="conteudo-convidados">
                <div className="convidados">
                    <div className="titulo-convidados">Convites</div>
                        <div className="botoes-convidados">
                            <div className="confirmar-presencas">
                                <Botao funcao={gerarConvite} texto='Gerar Convites'/>
                            </div>
                        </div>
                        <table className="tabela-convidados">
                            <thead>
                                <tr>
                                <th>Convite</th>
                                <th>Gerado em</th>
                                <th>Status</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {convites.map(convite => (
                                <tr key={convite.idConvite}>
                                    <td>{convite.linkConvite}</td>
                                    <td>{new Date(convite.dataConvite).toLocaleDateString()}</td>
                                    <td>
                                    <span className={`status-convidado ${convite.status.toLowerCase()}`}>
                                        {convite.status}
                                    </span>
                                    </td>
                                    <td>
                                    <div className="excluir-convite" onClick={() => abrirModalApagarConvite(convite.idConvite)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                            <path d="M12.3828 2.58853C12.8711 2.12466 12.8711 1.37134 12.3828 0.907471C11.8945 0.443604 11.1016 0.443604 10.6133 0.907471L6.5 4.8188L2.38281 0.911182C1.89453 0.447314 1.10156 0.447314 0.613281 0.911182C0.125 1.37505 0.125 2.12837 0.613281 2.59224L4.73047 6.49985L0.617188 10.4112C0.128906 10.875 0.128906 11.6284 0.617188 12.0922C1.10547 12.5561 1.89844 12.5561 2.38672 12.0922L6.5 8.18091L10.6172 12.0885C11.1055 12.5524 11.8984 12.5524 12.3867 12.0885C12.875 11.6247 12.875 10.8713 12.3867 10.4075L8.26953 6.49985L12.3828 2.58853Z" fill="#CED4DA"/>
                                        </svg>
                                    </div>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                            {
                              modoApagarConvite &&
                                <Modal titulo='Excluir convite' textoBotao="Excluir" funcaoSalvar={() => { deletarConvite(idConviteApagado); setModoApagarConvite(!modoApagarConvite)}} enviaModal={abrirModalApagarConvite}>
                                  Tem certeza de que deseja excluir este convite?
                                </Modal>
                            }
                            { linkConvite ? 
                            <Modal enviaModal={copiarLink} titulo='Gerar convites' funcaoSalvar={copiarLink} textoBotao='Copiar Link'> O convite foi gerado! Copie o link no botão abaixo e compartilhe com o seu convidado. </Modal>
                            : 
                            ''
                            }
                                    { modoApagarEvento ?
                                    <Modal titulo='Apagar evento' textoBotao="Apagar" funcaoSalvar={ApagarEvento} enviaModal={AbrirModalApagarEvento}>
                                        <div className='modal-apagar-evento'>
                                            <div className='texto-apagar-evento'>Você tem certeza que deseja apagar o evento "{evento.nomeEvento}"?</div>
                                        </div>
                                    </Modal>
                                    :
                                    ''
                                    }
                          
                          {
                    modoEdicaoEvento ? 
                    <Modal funcaoSalvar={editarEvento} titulo='Editar evento' enviaModal={AbrirModalEditarEvento}>
                    <div className='modal-editar-evento'>
                        <div className='campos-editar-evento'>
                            <div className='nome-categoria-evento'>
                                <div className='nome-input-evento'>
                                    <div className='textos'>Nome do evento</div>
                                    <div className="input-tamanho">
                                        <Input value={eventoEditado?.nomeEvento || ""}  onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, nomeEvento: e.target.value } : null
                                                    )
                                        } type='text' dica='Digite um nome para o evento'/>
                                    </div>                  
                                </div>
                                <div className='categoria-input-evento'>
                                    <div className='textos'>Categoria</div>
                                    <div className='input-tamanho'>   
                                        <Input value={eventoEditado?.tipoEvento || ""}  onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, tipoEvento: e.target.value } : null
                                                    )
                                        } type='text' dica='Digite uma categoria para o Evento'/>
                                    </div>
                                </div>
                            </div>
                            <div className='descricao-input-evento'>
                                <div>Descrição do evento(opciona)</div>
                                <div className='input-tamanho-descricao'>
                                    <Input value={eventoEditado?.descricaoEvento || ""}  onChange={(e:any) => setEventoEditado((prev) =>
                                            prev ? { ...prev, descricaoEvento: e.target.value } : null
                                            )
                                } type='text' dica='Digite uma descrição para o seu evento...'/>
                                </div>
                            </div>
                            <div className='imagem-evento'>
                                <div className='imagem-evento-texto-botao'>
                                    <div className='texto-imagem-evento'>Imagem do evento(opcional)</div>
                                    <div className='input-imagem-evento'>
                                        <div className='sem-imagem'></div>
                                        <div className='botoes-imagem'>
                                            <Botao texto='Selecionar arquivo'></Botao>
                                            <Botao texto='Remover'></Botao>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='novos-dados-eventos'>
                            <div className='texto-input-data'>
                                <div className='textos'>Data do evento</div>
                                <div className='data-evento'>
                                    <Input value={eventoEditado?.dataEvento || ""}  onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, dataEvento: e.target.value } : null
                                                    )
                                        } type='date' dica='dd/mm/aaaa'/>
                                </div>
                            </div>
                            <div className='texto-input-hora-inicio-evento'>
                                <div className='horario-inicio-fim-evento'>
                                    <div className='textos'>Hora ínicio do evento</div>
                                    <div className='input-tamanho'>
                                        <Input value={eventoEditado?.horaInicio || ""}  onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, horaInicio: e.target.value } : null
                                                    )
                                        } type='text' dica='--:--'/>
                                    </div>
                                </div>
                                <div className='horario-inicio-fim-evento'>
                                    <div className='textos'>Hora fim do evento</div>
                                    <div className='input-tamanho'>
                                        <Input value={eventoEditado?.horaFim || ""}
                                          onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, horaFim: e.target.value } : null
                                                    )
                                        } type='text' dica='--:--'/>
                                    </div>
                                </div>
                            </div>
                            <div className='texto-input-cep-endereco'>
                                <div className='input-texto-cep-numero'>
                                    <div className='textos'>CEP</div>
                                    <div className='input-tamanho-cep-numero'>
                                        <Input value={eventoEditado?.cepLocal || ""}
                                          onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, cepLocal: e.target.value } : null
                                                    )
                                        } type='text' dica='Digite o CEP do local'/>
                                    </div>
                                </div>
                                <div className='input-texto-endereco-complemento'>
                                    <div className='textos'>Endereço</div>
                                    <div className='input-tamanho-endereco-complemento'>
                                        <Input value={eventoEditado?.enderecoLocal || ""}
                                          onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, enderecoLocal: e.target.value } : null
                                                    )
                                        } type='text' dica='Digite o endereço do local'/>
                                    </div>
                                </div>
                            </div>
                            <div className='input-texto-numero-complemento'>
                                <div className='input-texto-cep-numero'>
                                    <div className='textos'>Número</div>
                                    <div className='input-tamanho-cep-numero'>
                                        <Input value={eventoEditado?.numeroLocal || ""} onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, numeroLocal: e.target.value } : null
                                                    )
                                        } type='text' dica='Digite o número do local'/>
                                    </div>
                                </div>
                                <div className='input-texto-endereco-complemento'>
                                    <div className='textos'>Complemento</div>
                                    <div className='input-tamanho-endereco-complemento'>
                                        <Input value={eventoEditado?.complementoLocal || ""}  onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, complementoLocal: e.target.value } : null
                                                    )
                                        } type='text' dica='Digite o complemento'/>
                                    </div>
                                </div>
                            </div>
                            <div className='input-texto-bairro'>
                                <div className='textos'>Bairro (opicional)</div>
                                <div className='input-bairro'>
                                    <Input value={eventoEditado?.bairroLocal || ""}  onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, bairroLocal: e.target.value } : null
                                                    )
                                        } type='text' dica='Digite o bairro do local do evento'/>
                                </div>
                            </div>
                            <div className='input-texto-cidade-uf'>
                                <div className='input-cidade'>
                                    <div className='textos'>Cidade (opicional)</div>
                                    <div className='input-tamanho-cidade'>
                                        <Input value={eventoEditado?.cidadeLocal || ""}  onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, cidadeLocal: e.target.value } : null
                                                    )
                                        } type='text' dica='Digite a cidade do local'/>
                                    </div>
                                </div>
                                <div className='input-uf'>
                                    <div className='textos'>UF (opicional)</div>
                                    <div className='input-tamanho-uf'>
                                        <Input value={eventoEditado?.ufLocal || ""}  onChange={(e:any) => setEventoEditado((prev) =>
                                                    prev ? { ...prev, ufLocal: e.target.value } : null
                                                    )
                                        } type='text' dica='Digite a UF'/>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>
                </Modal>
                :
                ''
        }
                        
                    </div>
                </div>
            </div>
    )
    }

export default Convites