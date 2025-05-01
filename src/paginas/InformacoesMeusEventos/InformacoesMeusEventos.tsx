import './InformacoesMeusEventos.css';
import { useEffect, useState } from 'react';
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento';
import { useParams } from 'react-router';
import api from '../../axios';



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
    idTipoEvento?: string;
    descricaoEvento?: string;
  }

  interface TipoEvento {
    idTipoEvento: string;
    descricaoTipoEvento: string;
  }
  


const InformacoesMeusEventos = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [idUsuario, setIdUsuario] = useState<any>(null);
    const [preView, setPreview] = useState('')
    const [tipoEvento, setTipoEvento] = useState(0)
    const [tipoEventoDisponiveis, setTipoEventoDisponiveis] = useState<TipoEvento[]>([])
 
    useEffect(()=>{
        const buscarTiposDeEventos = async () => {
          try{
            const tipoEvento = await api.get('/users/tipo-evento')
            setTipoEventoDisponiveis(tipoEvento.data)
          }
          catch (error) {
            console.log('ocorreu algum erro: ',error)
            return
          }
        }
        buscarTiposDeEventos()
       },[])
    
     
    useEffect(() => {
        try {
            api.get(`/users/get-user`)
            .then((res) => {
                setIdUsuario(res.data.idUsuario);
                api.get(`/users/${idUsuario}/events/${idEvento}`)
                    .then((res) => {
                        setEvento(res.data);
                        setTipoEvento(res.data.idTipoEvento);
                        const urlPreview = res.data.imagemEvento
                        ? `http://localhost:3000/files/${res.data.imagemEvento}`
                        : '';
                        setPreview(urlPreview);
                        console.log('preview', urlPreview);
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


  return (
    <div>
        <div className='informacoes-evento__cabecalho'>
            <CabecalhoEvento
                preViewEv={preView}
                evento={evento}
                setEvento={setEvento}
                tipoDoEvento={tipoEvento}
                idUsuario={idUsuario}
                idEvento={idEvento} 
                localEvento={evento.enderecoLocal +', '+ evento.numeroLocal + ', ' + evento.cidadeLocal + ' - ' + evento.ufLocal}
            />
        </div>
    <div className='informacoes-meus-eventos'>
        <div className='detalhes-eventos'>
            <p className='texto-detalhes-eventos'>Detalhes do evento</p>
            <div className='linhas'>
                <div className='status'>
                    <div className='texto-status-categoria-data-horario-endereco'>Status</div>
                    <div className='nome-cor-status'>
                        <svg className='bolinha' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="7" fill="#8C5DFF"/>
                        </svg>
                        <div className='texto-proximos-eventos'>{evento.status}</div>
                    </div>
                </div>
                <div className='categoria'>
                    <div className='texto-status-categoria-data-horario-endereco'>Categoria</div>
                    <div>
                        {tipoEventoDisponiveis.find(tipo => tipo.idTipoEvento === evento.idTipoEvento)?.descricaoTipoEvento}</div>
                </div>
            </div>
            <div className='linhas'>
                <div className='data'>
                    <div className='texto-status-categoria-data-horario-endereco'>Data</div>
                    <div>{evento.dataEvento}</div>
                </div>
                <div className='horario'>
                    <div className='texto-status-categoria-data-horario-endereco'>Horário</div>
                    <div>{evento.horaInicio} - {evento.horaFim}</div>
                </div>
            </div>
            <div className='linhas'>
                <div className='endereco'>
                    <div className='texto-status-categoria-data-horario-endereco'>Endereço</div>
                    <div>{evento.enderecoLocal +', '+ evento.numeroLocal + ', ' + evento.cidadeLocal + ' - ' + evento.ufLocal}</div>
                </div>        
            </div>
        </div>

        {/* <div className='resumo-convites'>
            <div className='texto-resumo-convite'>Resumo Convites</div>
            <div className='botoes-convites'>
                <div className='convites-confirmados-pendentes-recusados'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M16.8 17.6633V17.4372M16.7994 14.16V13.9338M16.7994 10.6715V10.4454M5.84708 4.03613H14.0012C14.0476 5.68704 15.4004 7.01113 17.0625 7.01113C18.7246 7.01113 20.0775 5.68704 20.1238 4.03613H22.153C24.609 4.03613 26.6 6.02715 26.6 8.48319V19.5163C26.6 21.9723 24.609 23.9633 22.153 23.9633H20.1238C20.0775 22.3124 18.7246 20.9883 17.0625 20.9883C15.4004 20.9883 14.0476 22.3124 14.0012 23.9633H5.8471C3.39106 23.9633 1.40004 21.9723 1.40004 19.5163L1.40002 8.48319C1.40002 6.02715 3.39104 4.03613 5.84708 4.03613Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div className='texto-confirmar-pendente-recusado'>Convites Confirmados</div>
                    <div className='numero'>5</div>    
                </div>
                <div className='convites-confirmados-pendentes-recusados'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M16.8 17.6633V17.4372M16.7994 14.16V13.9338M16.7994 10.6715V10.4454M5.84708 4.03613H14.0012C14.0476 5.68704 15.4004 7.01113 17.0625 7.01113C18.7246 7.01113 20.0775 5.68704 20.1238 4.03613H22.153C24.609 4.03613 26.6 6.02715 26.6 8.48319V19.5163C26.6 21.9723 24.609 23.9633 22.153 23.9633H20.1238C20.0775 22.3124 18.7246 20.9883 17.0625 20.9883C15.4004 20.9883 14.0476 22.3124 14.0012 23.9633H5.8471C3.39106 23.9633 1.40004 21.9723 1.40004 19.5163L1.40002 8.48319C1.40002 6.02715 3.39104 4.03613 5.84708 4.03613Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div className='texto-confirmar-pendente-recusado'>Convites Pendentes</div>
                    <div className='numero'>5</div>    
                </div>
                <div className='convites-confirmados-pendentes-recusados'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M16.8 17.6633V17.4372M16.7994 14.16V13.9338M16.7994 10.6715V10.4454M5.84708 4.03613H14.0012C14.0476 5.68704 15.4004 7.01113 17.0625 7.01113C18.7246 7.01113 20.0775 5.68704 20.1238 4.03613H22.153C24.609 4.03613 26.6 6.02715 26.6 8.48319V19.5163C26.6 21.9723 24.609 23.9633 22.153 23.9633H20.1238C20.0775 22.3124 18.7246 20.9883 17.0625 20.9883C15.4004 20.9883 14.0476 22.3124 14.0012 23.9633H5.8471C3.39106 23.9633 1.40004 21.9723 1.40004 19.5163L1.40002 8.48319C1.40002 6.02715 3.39104 4.03613 5.84708 4.03613Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div className='texto-confirmar-pendente-recusado'>Convites Recusados</div>
                    <div className='numero'>5</div>    
                </div>
            </div>
        </div> */}
           
    </div>
</div>
  )
}

export default InformacoesMeusEventos