import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento'
import { jwtDecode } from "jwt-decode";
import './Convidados.css';
import Botao from "../../componentes/Botao/Botao";
import { Modal } from "../../componentes/Modal/Modal";



interface Evento{
    idEvento: number;
    nomeEvento: string;
    status?: string;
    dataEvento: string;
    horaInicio: string;
    horaFim: string;
    localEvento: string;
    imagem?: string;
    tipoEvento?: string;
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
    const [modoApagarEvento, setModoApagarvento] = useState(false);
    const [convidados, setConvidados] = useState<Convidado[]>([]);
    const [modalConfirmarPresencas, setModalConfirmarPresencas] = useState(false);
    const [indiceConvidadoPendente, setIndiceConvidadoPendente] = useState(0);


    const convidadosPendentes = convidados.filter(convidado => convidado.status === 'Pendente');
    const convidadoPendenteAtual = convidadosPendentes[indiceConvidadoPendente];

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
            
                const usuario = await axios.get(`http://localhost:3000/users/get-user/${email}`);
                const idUsuario = usuario.data.idUsuario;
            
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
            localEvento={evento.localEvento}
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
                                    <div className="botoes-anterior-proximo">
                                    <Botao texto="Anterior" funcao={irParaConvidadoAnterior} />
                                    <Botao texto="Próximo" funcao={irParaProximoConvidado} />
                                    </div>
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
                            </div>
                    </Modal>:
                    ''}
                </div>
            </div>
        </div>
)
}

export default Convidados