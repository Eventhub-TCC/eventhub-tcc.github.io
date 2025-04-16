import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento'
import { jwtDecode } from "jwt-decode";
import './Convites.css';
import Botao from "../../componentes/Botao/Botao";
import { link } from "framer-motion/client";
import { Modal } from "../../componentes/Modal/Modal";



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
    const [modoApagarEvento, setModoApagarvento] = useState(false);
    const [convites, setConvites] = useState<Convite[]>([]);
    const [linkConvite, setLinkConvite] = useState<string | null>(null);
    const [idUsuario, setIdUsuario] = useState<any>(null);

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

      const AbrirModalApagarEvento = () => {
        setModoApagarvento(!modoApagarEvento)
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
                    <div className="titulo-convidados">Convidados</div>
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
                                    <div className="excluir-convite" onClick={() => deletarConvite(convite.idConvite)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                            <path d="M12.3828 2.58853C12.8711 2.12466 12.8711 1.37134 12.3828 0.907471C11.8945 0.443604 11.1016 0.443604 10.6133 0.907471L6.5 4.8188L2.38281 0.911182C1.89453 0.447314 1.10156 0.447314 0.613281 0.911182C0.125 1.37505 0.125 2.12837 0.613281 2.59224L4.73047 6.49985L0.617188 10.4112C0.128906 10.875 0.128906 11.6284 0.617188 12.0922C1.10547 12.5561 1.89844 12.5561 2.38672 12.0922L6.5 8.18091L10.6172 12.0885C11.1055 12.5524 11.8984 12.5524 12.3867 12.0885C12.875 11.6247 12.875 10.8713 12.3867 10.4075L8.26953 6.49985L12.3828 2.58853Z" fill="#CED4DA"/>
                                        </svg>
                                    </div>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
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
                    </div>
                </div>
            </div>
    )
    }

export default Convites