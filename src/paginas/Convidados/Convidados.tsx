import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento'
import './Convidados.css';
import Botao from "../../componentes/Botao/Botao";
import { Modal } from "../../componentes/Modal/Modal";
import api from "../../axios";
import Secao from "../../componentes/Secao/Secao";
import React from "react";

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
}

interface Acompanhante{
    idConvidado: string;
    nome: string;
    email: string;
    dataNascimento: string;
    rg: string;
    status: 'Confirmado' | 'Recusado' | 'Pendente';
    relacionamento: string;
}

export interface Convidado {
    idConvidado: string;
    nome: string;
    email: string;
    dataNascimento: string;
    rg: string;
    status: 'Confirmado' | 'Recusado' | 'Pendente';
    idConvite: string;
    acompanhantes: Acompanhante[];
}

interface AccordionAcompanhante{
    idConvidado: string;
    aberto: boolean;
}

const Convidados = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [convidados, setConvidados] = useState<Convidado[]>([]);
    const [modalConfirmarPresencas, setModalConfirmarPresencas] = useState(false);
    const [indiceConvidadoPendente, setIndiceConvidadoPendente] = useState(0);
    const [idUsuario, setIdUsuario] = useState<any>(null);
    const [preView, setPreview] = useState('')
    const [accordionAcompanhantes, setAccordionAcompanhantes] = useState<AccordionAcompanhante[]>([]);
    const [carregandoImprimir, setCarregandoImprimir] = useState(false);

    const convidadosPendentes = convidados.filter(convidado => convidado.status === 'Pendente');
    const convidadoPendenteAtual = convidadosPendentes[indiceConvidadoPendente];

    const [botaoImprimirDesabilitado, setBotaoImprimirDesabilitado] = useState(true);

    useEffect(() => {
        try {
            api.get(`/users/get-user`)
                .then((res) => {
                    setIdUsuario(res.data.idUsuario);
                    api.get(`/users/${idUsuario}/events/${idEvento}`)
                        .then((res) => {
                            setEvento(res.data);
                            const status = definirStatusEvento(res.data);
                            const urlPreview = res.data.imagemEvento
                                ? `http://localhost:3000/files/${res.data.imagemEvento}`
                                : '';
                            setPreview(urlPreview);
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
            const response = await api.get(`/users/obter-convidados/${idEvento}`);
            setConvidados(response.data);
            const convidadosComAcompanhantes = response.data.filter((convidado: Convidado) => convidado.acompanhantes.length > 0);
            setAccordionAcompanhantes(convidadosComAcompanhantes.map((convidado: Convidado) => ({
                idConvidado: convidado.idConvidado,
                aberto: false
            })));

        } catch (error) {
            setBotaoImprimirDesabilitado(true);
            console.error('Erro ao buscar convidados:', error);
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
            await api.put(`/users/atualizar-status-convidado/${idConvidado}`, {
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

    useEffect(() => {
        const confirmados = convidados.filter((convidado: Convidado) => convidado.status === 'Confirmado');
        setBotaoImprimirDesabilitado(!(confirmados.length > 0));
    }, [convidados]);

    if (!evento) return <p>Carregando evento...</p>;

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

    const gerarListaConvidados = async () => {
        try {
            if (carregandoImprimir) return;
            setCarregandoImprimir(true);
            const { data: pdf } = await api.get(`/users/gerar-lista-convidados/${idEvento}`, { responseType: 'blob' });
            const url = URL.createObjectURL(new Blob([pdf]));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'lista_de_convidados.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            setCarregandoImprimir(false);
        }
        catch (e: any) {
            console.error('Erro ao gerar lista de convidados:', e);
            setCarregandoImprimir(false);
        }
    }

    const alternarAccordionAcompanhantes = (idConvidado: string) => {
        setAccordionAcompanhantes(prev => 
            prev.map(accordion => 
                accordion.idConvidado === idConvidado ? { ...accordion, aberto: !accordion.aberto } : accordion
            )
        )
    }

    return (
        <div className="tela-convidados-evento">
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
                <Secao titulo="Convidados">
                    <div className="convidados">
                        <div className="botoes-convidados">
                            <div className="atualizar-lista-convidados">
                                <div className='texto-atualizar-convidados'>Atualizar convidados </div>
                                <button className="botao-atualizar" onClick={() => idEvento && buscarConvidados(idEvento, setConvidados)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M18.1055 8.74955H18.4375C18.957 8.74955 19.375 8.33158 19.375 7.81205V2.81205C19.375 2.43314 19.1484 2.08939 18.7969 1.94486C18.4453 1.80033 18.043 1.87845 17.7734 2.14798L16.1484 3.77298C12.7266 0.394079 7.21484 0.405797 3.8125 3.81205C0.394531 7.23002 0.394531 12.7691 3.8125 16.187C7.23047 19.605 12.7695 19.605 16.1875 16.187C16.6758 15.6988 16.6758 14.9058 16.1875 14.4175C15.6992 13.9292 14.9062 13.9292 14.418 14.4175C11.9766 16.8589 8.01953 16.8589 5.57812 14.4175C3.13672 11.9761 3.13672 8.01908 5.57812 5.57767C8.00781 3.14798 11.9336 3.13627 14.3789 5.53861L12.7734 7.14798C12.5039 7.41752 12.4258 7.81986 12.5703 8.17142C12.7148 8.52298 13.0586 8.74955 13.4375 8.74955H18.1055Z" fill="white" />
                                    </svg>
                                </button>
                            </div>
                            <div className="confirmar-presencas">
                                <Botao funcao={() => setModalConfirmarPresencas(true)} texto='Confirmar Presenças' />
                            </div>
                            <div className="imprimir-lista">
                                <Botao
                                    funcao={gerarListaConvidados}
                                    texto={
                                        carregandoImprimir ?
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Carregando...</span>
                                            </div>
                                            : 'Imprimir lista'
                                    }
                                    desabilitado={botaoImprimirDesabilitado}
                                />
                            </div>
                        </div>
                        <table className="tabela-convidados">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Data de nascimento</th>
                                    <th>RG</th>
                                    <th>Status</th>
                                    <th>Acompanhantes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    convidados.map(convidado => {
                                        const email = convidado.email.split('@');
                                        return (
                                            <React.Fragment key={convidado.idConvidado}>
                                                <tr key={convidado.idConvidado}>
                                                    <td>
                                                        {
                                                            convidado.acompanhantes.length > 0 &&
                                                            <button 
                                                                type="button" 
                                                                className="convidados__botao-exibir-acompanhantes" 
                                                                onClick={() => alternarAccordionAcompanhantes(convidado.idConvidado)}
                                                            >
                                                                <i className={`fa-solid fa-chevron-right ${accordionAcompanhantes.find(accordion => accordion.idConvidado === convidado.idConvidado)?.aberto ? 'convidados__botao-rotacionar' : ''}`}></i>
                                                            </button>
                                                        }
                                                    </td>
                                                    <td>{convidado.nome}</td>
                                                    <td>
                                                        <div>{email[0]}</div>
                                                        <div>@{email[1]}</div>
                                                    </td>
                                                    <td>{convidado.dataNascimento.slice(0,10).split('-').reverse().join('/')}</td>
                                                    <td>{convidado.rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')}</td>
                                                    <td>
                                                        <span className={`status-convidado ${convidado.status.toLowerCase()}`}>
                                                            <span>{convidado.status}</span>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {
                                                            convidado.acompanhantes.length === 0 ?
                                                              '—'
                                                            : 
                                                            <span className="nome-acompanhante" onClick={() => alternarAccordionAcompanhantes(convidado.idConvidado)}>
                                                                {
                                                                    convidado.acompanhantes.length === 1 ?
                                                                        convidado.acompanhantes[0].nome.split(' ')[0]
                                                                    : convidado.acompanhantes.length === 2 ?
                                                                        `${convidado.acompanhantes[0].nome.split(' ')[0]} e ${convidado.acompanhantes[1].nome.split(' ')[0]}`
                                                                        
                                                                    : `${convidado.acompanhantes[0].nome.split(' ')[0]}, ${convidado.acompanhantes[1].nome.split(' ')[0]} e +${convidado.acompanhantes.length - 2}`
                                                                }
                                                            </span>
                                                        }
                                                    </td>
                                                </tr>
                                                {
                                                    accordionAcompanhantes.find(accordion => accordion.idConvidado === convidado.idConvidado)?.aberto &&
                                                    <tr>
                                                        <td colSpan={7} className="coluna-acompanhante">
                                                            <table className="tabela-acompanhantes">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Acompanhante</th>
                                                                        <th>E-mail</th>
                                                                        <th>Data de nascimento</th>
                                                                        <th>RG</th>
                                                                        <th>Relação</th>
                                                                    </tr>
                                                                </thead>
                                                                {
                                                                    convidado.acompanhantes.map(acompanhante => {
                                                                        const emailAcompanhante = acompanhante.email.split('@');
                                                                        return (
                                                                            <tbody>
                                                                                <tr key={acompanhante.idConvidado}>
                                                                                    <td>{acompanhante.nome}</td>
                                                                                    <td>
                                                                                        <div>{emailAcompanhante[0]}</div>
                                                                                        <div>@{emailAcompanhante[1]}</div>
                                                                                    </td>
                                                                                    <td>{acompanhante.dataNascimento.slice(0,10).split('-').reverse().join('/')}</td>
                                                                                    <td>{acompanhante.rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')}</td>
                                                                                    <td>{acompanhante.relacionamento}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        )
                                                                    })
                                                                }
                                                            </table>
                                                        </td>
                                                    </tr>
                                                }
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            modalConfirmarPresencas ?
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
                                                        {convidadoPendenteAtual.dataNascimento.slice(0,10).split('-').reverse().join('/')}
                                                    </div>
                                                </div>
                                                <div className="inputs-dados">
                                                    <div className="titulo-campos">RG</div>
                                                    <div className="dados-convidado">{convidadoPendenteAtual.rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')}</div>
                                                </div>
                                                {
                                                    convidadoPendenteAtual.acompanhantes.length > 0 &&
                                                    convidadoPendenteAtual.acompanhantes.map((acompanhante, index) => (
                                                        <details key={index} className="detalhes-acompanhante">
                                                            <summary className="summary-acompanhante">
                                                                <svg className="icone-summary-acompanhante" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                    <path d="M12.7063 7.29365C13.0969 7.68428 13.0969 8.31865 12.7063 8.70928L6.7063 14.7093C6.31567 15.0999 5.6813 15.0999 5.29067 14.7093C4.90005 14.3187 4.90005 13.6843 5.29067 13.2937L10.5844 7.9999L5.2938 2.70615C4.90317 2.31553 4.90317 1.68115 5.2938 1.29053C5.68442 0.899902 6.3188 0.899902 6.70942 1.29053L12.7094 7.29053L12.7063 7.29365Z" fill="white"/>
                                                                </svg>
                                                                Acompanhante {index+1}
                                                            </summary>
                                                            <div className="detalhes-conteudo-acompanhante">
                                                                <div className="detalhes-campo-acompanhante">
                                                                    <p className="detalhes-titulo-acompanhante">Nome do acompanhante</p>
                                                                    <p className="detalhes-dado-acompanhante">{acompanhante.nome}</p>
                                                                </div>
                                                                <div className="detalhes-campo-acompanhante">
                                                                    <p className="detalhes-titulo-acompanhante">E-mail</p>
                                                                    <p className="detalhes-dado-acompanhante">{acompanhante.email}</p>
                                                                </div>
                                                                <div className="detalhes-campo-acompanhante">
                                                                    <p className="detalhes-titulo-acompanhante">Data de Nascimento</p>
                                                                    <p className="detalhes-dado-acompanhante">
                                                                        {acompanhante.dataNascimento.slice(0,10).split('-').reverse().join('/')}
                                                                    </p>
                                                                </div>
                                                                <div className="detalhes-campo-acompanhante">
                                                                    <p className="detalhes-titulo-acompanhante">RG</p>
                                                                    <p className="detalhes-dado-acompanhante">{acompanhante.rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')}</p>
                                                                </div>
                                                                <div className="detalhes-campo-acompanhante">
                                                                    <p className="detalhes-titulo-acompanhante">Relação</p>
                                                                    <p className="detalhes-dado-acompanhante">{acompanhante.relacionamento}</p>
                                                                </div>
                                                            </div>
                                                        </details>
                                                    ))
                                                }
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
                                </Modal>
                            : ''
                        }
                    </div>
                </Secao>
            </div>
        </div>
    )
}

export default Convidados