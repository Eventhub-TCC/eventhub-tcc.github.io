import './InformacoesMeusEventos.css';
import { useEffect, useState } from 'react';
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento';
import { useNavigate, useParams } from 'react-router';
import api from '../../axios';
import Secao from '../../componentes/Secao/Secao';
import { Helmet } from 'react-helmet-async';

const apiUrl = import.meta.env.VITE_API_URL;

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
    tipoEvento: TipoEvento;
    descricaoEvento?: string;
}

interface TipoEvento {
    idTipoEvento: string;
    descricaoTipoEvento: string;
}

interface Cronometro{
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
}

const InformacoesMeusEventos = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [idUsuario, setIdUsuario] = useState<any>(null);
    const [preView, setPreview] = useState('')
    const [tamanhoTela, setTamanhoTela] = useState(window.innerWidth);
    const [tempoRestante, setTempoRestante] = useState<Cronometro>({dias: 0, horas: 0, minutos: 0, segundos: 0 });
    const [convidados, setConvidados] = useState({confirmados: 0, pendentes: 0, recusados: 0});
    const navigate = useNavigate();
    
    useEffect(() => {
        try {
            api.get(`/users/get-user`)
            .then((res) => {
                setIdUsuario(res.data.idUsuario);
                api.get(`/users/${idUsuario}/events/${idEvento}`)
                    .then((res) => {
                        setEvento(res.data);
                        const urlPreview = res.data.imagemEvento
                        ? `${apiUrl}/files/${res.data.imagemEvento}`
                        : '';
                        setPreview(urlPreview);
                        const status = definirStatusEvento(res.data);
                        setEvento({ ...res.data, status });
                        api.get(`/users/obter-convidados/${idEvento}`)
                            .then((res) => {
                                let confirmados = 0;
                                let pendentes = 0;
                                let recusados = 0;

                                res.data.map((convidado: any) => {
                                    switch (convidado.status) {
                                        case 'Confirmado':
                                            confirmados++;
                                            break;
                                        case 'Pendente':
                                            pendentes++;
                                            break;
                                        case 'Recusado':
                                            recusados++;
                                            break;
                                        default:
                                            break;
                                    }
                                    setConvidados({confirmados, pendentes, recusados});
                                })
                            })
                            .catch((err) => {
                                console.error("Erro ao buscar os convidados", err);
                            });
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

    useEffect(() => {
        if (!evento) return;
      
        const obterTempoRestante = () => {
            const [ano, mes, dia] = evento.dataEvento.split('-').map(Number);
            const [hora, minuto] = evento.horaInicio.split(':').map(Number);
            
            const agora = new Date();
            const diferenca = new Date(ano, mes - 1, dia, hora, minuto, 0).getTime() - agora.getTime();
        
            if (diferenca <= 0){
                const status = definirStatusEvento(evento);
                setEvento({ ...evento, status });
                return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
            }
        
            const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
            const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
            const segundos = Math.floor((diferenca / 1000) % 60);
        
            return { dias, horas, minutos, segundos };
        };
      
        const intervalo = setInterval(() => {
            setTempoRestante(obterTempoRestante());
        }, 1000);
  
        return () => clearInterval(intervalo);
    }, [evento]);

    useEffect(() => {
        const redimensionar = () => {
            setTamanhoTela(window.innerWidth);
        };

        window.addEventListener('resize', redimensionar);

        return () => {
            window.removeEventListener('resize', redimensionar);
        };
    }, [tamanhoTela]);

    function definirStatusEvento(evento: Evento): string {
        const hoje = new Date();
    
        const [ano, mes, dia] = evento.dataEvento.split('-').map(Number);
        const [horaInicio, minutoInicio] = evento.horaInicio.split(':').map(Number);
        const [horaFim, minutoFim] = evento.horaFim.split(':').map(Number);
    
        const inicioEvento = new Date(ano, mes - 1, dia, horaInicio, minutoInicio);
        const fimEvento = new Date(ano, mes - 1, dia, horaFim, minutoFim);
    
        if (hoje >= inicioEvento && hoje <= fimEvento) {
           return "Em andamento";
        } 
        else if (fimEvento < hoje) {
            return "Finalizado";
        } 
        else {
            return "Próximos eventos";
        }
    }

    const formatarDados = {
        data: (data: string) => {
            let [ano, mes, dia] = data.split('-').map(Number);
            mes -= 1;

            const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
            const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

            return diasDaSemana[new Date(ano, mes, dia).getDay()] + ', ' + dia + ' de ' + meses[mes] + ' de ' + ano;
        },
        hora: (hora: string) => {
            return hora.slice(0, 5);
        },
        cep: (cep: string) => {
            return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
    }

    if (!evento) return;

    return (
        <>
            <Helmet>
                <title>{evento.nomeEvento} | Informações Gerais | EventHub</title>
            </Helmet>
            <div>
                <div className='informacoes-evento__cabecalho'>
                    <CabecalhoEvento
                        idEvento={idEvento} 
                        evento={evento}
                        preViewEv={preView}
                        setEvento={setEvento}
                        idUsuario={idUsuario}
                    />
                </div>
                <div className='informacoes-evento__container'>
                    {
                        (tempoRestante.dias !== 0 || tempoRestante.horas !== 0 || tempoRestante.minutos !== 0 || tempoRestante.segundos !== 0) &&
                        <div className='informacoes-evento__cronometro'>
                            <div className='informacoes-evento__cronometro-texto'>
                                <p>O evento começa em</p>
                            </div>
                            <div className={`informacoes-evento__cronometro-tempo ${tempoRestante.dias === 0 && tempoRestante.horas === 0 && tempoRestante.minutos === 0 ? 'informacoes-evento__cronometro-tempo--segundos' : ''}`}>
                                {
                                    tempoRestante.dias > 0 && 
                                    <>
                                        <div className='informacoes-evento__cronometro-tempo-container'>
                                            <span className='informacoes-evento__cronometro-numero'>{tempoRestante.dias}</span>
                                            <span className='informacoes-evento__cronometro-unidade'>{tempoRestante.dias !== Number(1) ? 'dias' : 'dia'}</span>
                                        </div>
                                        <span className='informacoes-evento__cronometro-divisor'>:</span>
                                    </>
                                }
                                {
                                    (tempoRestante.dias > 0 || tempoRestante.horas > 0) && 
                                    <>
                                        <div className='informacoes-evento__cronometro-tempo-container'>
                                            <span className='informacoes-evento__cronometro-numero'>{tempoRestante.horas}</span>
                                            <span className='informacoes-evento__cronometro-unidade'>{tempoRestante.horas !== Number(1) ? 'horas' : 'hora'}</span>
                                        </div>
                                        {
                                            (tamanhoTela > 400 || (tamanhoTela <= 400 && tempoRestante.dias === 0)) &&
                                            <span className='informacoes-evento__cronometro-divisor'>:</span>
                                        }
                                    </>
                                }
                                {
                                    ((tempoRestante.dias > 0 || tempoRestante.horas > 0 || tempoRestante.minutos > 0) &&
                                    (tamanhoTela > 400 || (tamanhoTela <= 400 && tempoRestante.dias === 0))) && 
                                    <>
                                        <div className='informacoes-evento__cronometro-tempo-container'>
                                            <span className='informacoes-evento__cronometro-numero'>{tempoRestante.minutos}</span>
                                            <span className='informacoes-evento__cronometro-unidade'>{tempoRestante.minutos !== Number(1) ? 'minutos' : 'minuto'}</span>
                                        </div>
                                        {
                                            (tamanhoTela > 1200 || (tempoRestante.dias === 0 && tempoRestante.horas === 0)) &&
                                            <span className='informacoes-evento__cronometro-divisor'>:</span>
                                        }
                                    </>
                                }
                                {
                                    (tamanhoTela > 1200 || (tempoRestante.dias === 0 && tempoRestante.horas === 0)) &&
                                    <div className='informacoes-evento__cronometro-tempo-container'>
                                        <span className='informacoes-evento__cronometro-numero'>{tempoRestante.segundos}</span>
                                        <span className='informacoes-evento__cronometro-unidade'>{tempoRestante.segundos !== Number(1) ? 'segundos' : 'segundo'}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    <Secao titulo='Detalhes do evento'>
                        <div className='informacoes-evento__detalhes'>
                            <div className='row g-4'>
                                <div className='col-12 col-sm-6'>
                                    <p className='informacoes-evento__titulo-detalhes'>Status</p>
                                    <div className={`informacoes-evento__container-status`}>
                                        <span className={`informacoes-evento__cor-status ${evento.status === 'Em andamento' ? 'informacoes-evento__cor-status--andamento' : evento.status === 'Finalizado' ? 'informacoes-evento__cor-status--finalizado' : 'informacoes-evento__cor-status--proximos'}`}/>
                                        <p className={`informacoes-evento__texto-status ${evento.status === 'Em andamento' ? 'informacoes-evento__texto-status--andamento' : evento.status === 'Finalizado' ? 'informacoes-evento__texto-status--finalizado' : 'informacoes-evento__texto-status--proximos'}`}>{evento.status}</p>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-6'>
                                    <p className='informacoes-evento__titulo-detalhes'>Categoria</p>
                                    <p className='informacoes-evento__texto-detalhes'>{evento.tipoEvento.descricaoTipoEvento}</p>
                                </div>
                            </div>
                            <div className='row g-4'>
                                <div className='col-12 col-sm-6'>
                                    <p className='informacoes-evento__titulo-detalhes'>Data</p>
                                    <p className='informacoes-evento__texto-detalhes'>{formatarDados['data'](evento.dataEvento)}</p>
                                </div>
                                <div className='col-12 col-sm-6'>
                                    <p className='informacoes-evento__titulo-detalhes'>Horário</p>
                                    <p className='informacoes-evento__texto-detalhes'>{formatarDados['hora'](evento.horaInicio)} - {formatarDados['hora'](evento.horaFim)}</p>
                                </div>
                            </div>
                            <div className='row g-4'>
                                <div className='col-12'>
                                    <p className='informacoes-evento__titulo-detalhes'>Endereço completo</p>
                                    <p className={`informacoes-evento__texto-detalhes ${evento.enderecoLocal || evento.numeroLocal ? '' : 'informacoes-evento__texto-detalhes--sem-endereco'}`}>
                                        {
                                            evento.enderecoLocal || evento.numeroLocal ?
                                                evento.complementoLocal ?
                                                    evento.enderecoLocal +', '+ evento.numeroLocal + ' - ' + evento.complementoLocal + ', ' + evento.bairroLocal + ', ' + evento.cidadeLocal + ' - ' + evento.ufLocal + ', ' + formatarDados['cep'](evento.cepLocal)
                                                : 
                                                    evento.enderecoLocal +', '+ evento.numeroLocal + ' - ' + evento.bairroLocal + ', ' + evento.cidadeLocal + ' - ' + evento.ufLocal + ', ' + formatarDados['cep'](evento.cepLocal)
                                            : 'Não definido'
                                        }
                                    </p>
                                </div>        
                            </div>
                        </div>
                    </Secao>
                    <Secao titulo='Resumo dos convidados'>
                        <div className='row g-4'>
                            <div className='col-12 col-xxl-4'>
                                <div className='informacoes-evento__resumo-convites-container'>
                                    <div className='informacoes-evento__resumo-convites-nome-icone'>
                                        <svg className='informacoes-evento__resumo-convites-icone' xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                            <path d="M16.8 17.6633V17.4372M16.7994 14.16V13.9338M16.7994 10.6715V10.4454M5.84708 4.03613H14.0012C14.0476 5.68704 15.4004 7.01113 17.0625 7.01113C18.7246 7.01113 20.0775 5.68704 20.1238 4.03613H22.153C24.609 4.03613 26.6 6.02715 26.6 8.48319V19.5163C26.6 21.9723 24.609 23.9633 22.153 23.9633H20.1238C20.0775 22.3124 18.7246 20.9883 17.0625 20.9883C15.4004 20.9883 14.0476 22.3124 14.0012 23.9633H5.8471C3.39106 23.9633 1.40004 21.9723 1.40004 19.5163L1.40002 8.48319C1.40002 6.02715 3.39104 4.03613 5.84708 4.03613Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <p className='informacoes-evento__texto-resumo-convite'>Convidados confirmados</p>
                                    </div>
                                    <span className='informacoes-evento__numero-resumo-convite'>{convidados.confirmados}</span>    
                                </div>
                            </div>
                            <div className='col-12 col-xxl-4'>
                                <div className='informacoes-evento__resumo-convites-container'>
                                    <div className='informacoes-evento__resumo-convites-nome-icone'>
                                        <svg className='informacoes-evento__resumo-convites-icone' xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                            <path d="M16.8 17.6633V17.4372M16.7994 14.16V13.9338M16.7994 10.6715V10.4454M5.84708 4.03613H14.0012C14.0476 5.68704 15.4004 7.01113 17.0625 7.01113C18.7246 7.01113 20.0775 5.68704 20.1238 4.03613H22.153C24.609 4.03613 26.6 6.02715 26.6 8.48319V19.5163C26.6 21.9723 24.609 23.9633 22.153 23.9633H20.1238C20.0775 22.3124 18.7246 20.9883 17.0625 20.9883C15.4004 20.9883 14.0476 22.3124 14.0012 23.9633H5.8471C3.39106 23.9633 1.40004 21.9723 1.40004 19.5163L1.40002 8.48319C1.40002 6.02715 3.39104 4.03613 5.84708 4.03613Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <p className='informacoes-evento__texto-resumo-convite'>Convidados pendentes</p>
                                    </div>
                                    <span className='informacoes-evento__numero-resumo-convite'>{convidados.pendentes}</span>    
                                </div>
                            </div>
                                <div className='col-12 col-xxl-4'><div className='informacoes-evento__resumo-convites-container'>
                                    <div className='informacoes-evento__resumo-convites-nome-icone'>
                                        <svg className='informacoes-evento__resumo-convites-icone' xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                            <path d="M16.8 17.6633V17.4372M16.7994 14.16V13.9338M16.7994 10.6715V10.4454M5.84708 4.03613H14.0012C14.0476 5.68704 15.4004 7.01113 17.0625 7.01113C18.7246 7.01113 20.0775 5.68704 20.1238 4.03613H22.153C24.609 4.03613 26.6 6.02715 26.6 8.48319V19.5163C26.6 21.9723 24.609 23.9633 22.153 23.9633H20.1238C20.0775 22.3124 18.7246 20.9883 17.0625 20.9883C15.4004 20.9883 14.0476 22.3124 14.0012 23.9633H5.8471C3.39106 23.9633 1.40004 21.9723 1.40004 19.5163L1.40002 8.48319C1.40002 6.02715 3.39104 4.03613 5.84708 4.03613Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <p className='informacoes-evento__texto-resumo-convite'>Convidados recusados</p>
                                    </div>
                                    <span className='informacoes-evento__numero-resumo-convite'>{convidados.recusados}</span>    
                                </div>
                            </div>
                        </div>
                    </Secao>
                </div>
            </div>
        </>
    )
}

export default InformacoesMeusEventos;