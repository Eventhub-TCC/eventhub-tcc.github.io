import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento'
import { jwtDecode } from "jwt-decode";
import './Convidados.css';
import Botao from "../../componentes/Botao/Botao";
import { Modal } from "../../componentes/Modal/Modal";
import Input from "../../componentes/Input/Input";
import { desc } from "framer-motion/client";



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

  export interface Convidado {
    idConvidado: string;
    nome: string;
    email: string;
    dataNascimento: string;
    rg: string;
    status: 'Confirmado' | 'Recusado' | 'Pendente';
  }

const Convidados = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [modoEdicaoEvento, setModoEdicaoEvento] = useState(false);
    const [eventoEditado, setEventoEditado] = useState<Evento | null>(null);
    const [modoApagarEvento, setModoApagarvento] = useState(false);
    const [convidados, setConvidados] = useState<Convidado[]>([]);
    const [modalConfirmarPresencas, setModalConfirmarPresencas] = useState(false);
    const [indiceConvidadoPendente, setIndiceConvidadoPendente] = useState(0);
    const [idUsuario, setIdUsuario] = useState<any>(null);


    const convidadosPendentes = convidados.filter(convidado => convidado.status === 'Pendente');
    const convidadoPendenteAtual = convidadosPendentes[indiceConvidadoPendente];

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

        const irParaProximoConvidado = () => {
        if (indiceConvidadoPendente < convidadosPendentes.length - 1) {
            setIndiceConvidadoPendente(indiceConvidadoPendente + 1);
        }
        };

        const irParaConvidadoAnterior = () => {
        if (indiceConvidadoPendente > 0) {
            setIndiceConvidadoPendente(indiceConvidadoPendente - 1);
        }
        };

    const buscarConvidados = async (idEvento: string, setConvidados: Function) => {
        try {
          const response = await axios.get(`http://localhost:3000/users/obter-convidados/${idEvento}`);
          setConvidados(response.data);
        } catch (error) {
          console.error('Erro ao buscar convidados:', error);
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
                    await buscarConvidados(idEvento, setConvidados);
                } else {
                    console.error('idEvento está indefinido.');
                }
              } catch (error) {
                console.error('Erro ao carregar dados:', error);
              }
            }
            ObterEventoeUsuario();
        }, [idEvento]);

        const atualizarStatusConvidado = async (idConvidado: string, novoStatus: 'Confirmado' | 'Recusado') => {
            try {
              await axios.put(`http://localhost:3000/users/atualizar-status-convidado/${idConvidado}`, {
                status: novoStatus
              });

              setConvidados(prevConvidados =>
                prevConvidados.map(convidado =>
                  convidado.idConvidado === idConvidado ? { ...convidado, status: novoStatus } : convidado
                )
              );
          

              if (indiceConvidadoPendente < convidadosPendentes.length - 1) {
                setIndiceConvidadoPendente(indiceConvidadoPendente);
              } else {
                setModalConfirmarPresencas(false);
              }
          
            } catch (error) {
              console.error('Erro ao atualizar status do convidado:', error);
            }
          };
    

    function guardarModo(setState: React.Dispatch<React.SetStateAction<boolean>>, valor: boolean) {
        setState(valor);
      }

      if (!evento) return <p>Carregando evento...</p>;

      const AbrirModalApagarEvento = () => {
        setModoApagarvento(!modoApagarEvento)
    }

    const AbrirModalEditarEvento = () => {
        setEventoEditado(evento);
       setModoEdicaoEvento(!modoEdicaoEvento)
   }

   const editarEvento = async () => {
    if (!eventoEditado) return alert("Evento não carregado corretamente!");
  
    try {
      await axios.put(`http://localhost:3000/users/events/${evento.idEvento}`, {
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

    const ApagarEvento = () => {
        axios.delete(`http://localhost:3000/users/${idUsuario}/events/${idEvento}`)
            .then((res) => {
                window.location.href = '/meus-eventos';
            })
            .catch((err) => {
                console.error("Erro ao apagar evento", err);
            });
        setModoApagarvento(!modoApagarEvento)
    }

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
                <div className="titulo-convidados">Convidados</div>
                    <div className="botoes-convidados">
                        <div className="atualizar-lista-convidados">
                            <div className='texto-atualizar-convidados'>Atualizar convidados </div>
                            <button className="botao-atualizar" onClick={() => idEvento && buscarConvidados(idEvento, setConvidados)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M18.1055 8.74955H18.4375C18.957 8.74955 19.375 8.33158 19.375 7.81205V2.81205C19.375 2.43314 19.1484 2.08939 18.7969 1.94486C18.4453 1.80033 18.043 1.87845 17.7734 2.14798L16.1484 3.77298C12.7266 0.394079 7.21484 0.405797 3.8125 3.81205C0.394531 7.23002 0.394531 12.7691 3.8125 16.187C7.23047 19.605 12.7695 19.605 16.1875 16.187C16.6758 15.6988 16.6758 14.9058 16.1875 14.4175C15.6992 13.9292 14.9062 13.9292 14.418 14.4175C11.9766 16.8589 8.01953 16.8589 5.57812 14.4175C3.13672 11.9761 3.13672 8.01908 5.57812 5.57767C8.00781 3.14798 11.9336 3.13627 14.3789 5.53861L12.7734 7.14798C12.5039 7.41752 12.4258 7.81986 12.5703 8.17142C12.7148 8.52298 13.0586 8.74955 13.4375 8.74955H18.1055Z" fill="white"/>
                                </svg>
                            </button>
                        </div>
                        <div className="confirmar-presencas">
                            <Botao funcao={() => setModalConfirmarPresencas(true)} texto='Confirmar Presenças'/>
                        </div>
                    </div>
                    <table className="tabela-convidados">
                        <thead>
                            <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Data de nascimento</th>
                            <th>RG</th>
                            <th>Status</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {convidados.map(convidado => (
                            <tr key={convidado.idConvidado}>
                                <td>{convidado.nome}</td>
                                <td>{convidado.email}</td>
                                <td>{new Date(convidado.dataNascimento).toLocaleDateString()}</td>
                                <td>{convidado.rg}</td>
                                <td>
                                <span className={`status-convidado ${convidado.status.toLowerCase()}`}>
                                    {convidado.status}
                                </span>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        { modalConfirmarPresencas ? 
                        <Modal botoes={false} textoBotao='Confirmar' funcaoSalvar={() => setModalConfirmarPresencas(false)} enviaModal={() => setModalConfirmarPresencas(false)} titulo="Confirmar Presenças">
                        <div className="modal-confirmar-presenca">
                            <div className="caixa-convidados-pendentes-botoes">
                                <div className="convidados-pendentes-botoes">
                                <div className="numero-pendentes">{convidadosPendentes.length}</div>
                                <div className="texto-convidados-pendentes">Convidados pendentes</div>
                                <div className="botoes-convidados-pendentes">
                                    {
                                        convidadosPendentes.length >= 1 &&
                                        <div className="botoes-anterior-proximo">
                                            {
                                                indiceConvidadoPendente > 0 &&
                                                <Botao texto="Anterior" funcao={irParaConvidadoAnterior} />
                                            }
                                            {
                                                indiceConvidadoPendente < convidadosPendentes.length - 1 &&
                                                <Botao texto="Próximo" funcao={irParaProximoConvidado} />
                                            }
                                        </div>
                                    }
                                </div>
                                </div>
                            </div>

                            {convidadoPendenteAtual && (
                                <>
                                <div className="inputs-dados">
                                    <div className="titulo-campos">Nome do convidado</div>
                                    <div className="dados-convidado">{convidadoPendenteAtual.nome}</div>
                                </div>
                                <div className="inputs-dados">
                                    <div className="titulo-campos">E-mail</div>
                                    <div className="dados-convidado">{convidadoPendenteAtual.email}</div>
                                </div>
                                <div className="inputs-dados">
                                    <div className="titulo-campos">Data de Nascimento</div>
                                    <div className="dados-convidado">
                                    {new Date(convidadoPendenteAtual.dataNascimento).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="inputs-dados">
                                    <div className="titulo-campos">RG</div>
                                    <div className="dados-convidado">{convidadoPendenteAtual.rg}</div>
                                </div>
                                </>
                            )}
                            {
                                convidadosPendentes.length > 0 &&
                                <div className="botoes-acoes-convidado">
                                    <Botao
                                        texto="Recusar"
                                        funcao={() => {
                                        if (convidadoPendenteAtual) {
                                            atualizarStatusConvidado(convidadoPendenteAtual.idConvidado, 'Recusado');
                                        }
                                        }}
                                    />
                                    <Botao
                                        texto="Confirmar"
                                        funcao={() => {
                                        if (convidadoPendenteAtual) {
                                            atualizarStatusConvidado(convidadoPendenteAtual.idConvidado, 'Confirmado');
                                        }
                                        }}
                                    />
                                </div>
                            }
                        </div>
                    </Modal>:
                    ''}
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

export default Convidados