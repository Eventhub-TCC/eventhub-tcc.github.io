import './InformacoesMeusEventos.css';
// import React from 'react'
import { Modal } from '../../componentes/Modal/Modal';
import Input from '../../componentes/Input/Input';
import Botao from '../../componentes/Botao/Botao';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import CabecalhoEvento from '../../componentes/CabecalhoEvento/CabecalhoEvento';
import { useParams } from 'react-router';
import api from '../../axios';
// import Select from '../../componentes/Select/Select';
import Select from '../../componentes/Select/Select';


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
    tipoEvento?: string;
    descricaoEvento?: string;
  }

  interface TipoEvento {
    idTipoEvento: string;
    descricaoTipoEvento: string;
  }
  


const InformacoesMeusEventos = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState<Evento | null>(null);
    const [modoEdicaoEvento, setModoEdicaoEvento] = useState(false);
    const [modoApagarEvento, setModoApagarvento] = useState(false);
    const [idUsuario, setIdUsuario] = useState<any>(null);
    const [eventoEditado, setEventoEditado] = useState<Evento | null>(null);
    const [imagemEvento, setImagemEvento] = useState<File|null>(null)
    const [preView, setPreview] = useState('')
    const [tipoEvento, setTipoEvento] = useState(0)
    const inputImagemref = useRef<HTMLInputElement>(null)
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
                        setImagemEvento(res.data.imagemEvento);
                        setTipoEvento(res.data.tipoEvento);
                        setEventoEditado(res.data);
                        setPreview(res.data.imagemEvento ? `http://localhost:3000/files/${res.data.imagemEvento}` : '');
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
        
    
        function guardarModo(setState: React.Dispatch<React.SetStateAction<boolean>>, valor: boolean) {
            setState(valor);
          }
    
          if (!evento) return <p>Carregando evento...</p>;

          const editarEvento = async () => {
            if (!eventoEditado) return alert("Evento não carregado corretamente!");
    
          
            try {
              
              await api.put(
                `/users/events/${evento.idEvento}`, {
                    nomeEvento: eventoEditado.nomeEvento,
                    descricaoEvento: eventoEditado.descricaoEvento,
                    tipoEvento: eventoEditado.tipoEvento,
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
                    file: imagemEvento
                },
              { headers: { 'Content-Type': 'multipart/form-data' } });
          
              alert("Evento atualizado com sucesso!");
              AbrirModalEditarEvento();
            //   window.location.href = "/meus-eventos";
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



    const AbrirModalEditarEvento = () => {
         setEventoEditado(evento);
        setModoEdicaoEvento(!modoEdicaoEvento)
    }

    const AbrirModalApagarEvento = () => {
        setModoApagarvento(!modoApagarEvento)
    }

    const ApagarEvento = () => {
        api.delete(`/users/${idUsuario}/events/${idEvento}`)
            .then((res) => {
                console.log(res.data);
                window.location.href = '/meus-eventos';
            })
            .catch((err) => {
                console.error("Erro ao apagar evento", err);
            });
        setModoApagarvento(!modoApagarEvento)
    }



    
  return (
    <div>
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
                    <div>{evento.nomeEvento}</div>
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
                            <div className='input-tamanho'>   
                            <Select 
                                cabecalho 
                                cabecalhoTexto='Tipo de Evento'  
                                textoPadrao='Selecione o tipo de evento'
                                valor={tipoEvento}
                                funcao={(e: ChangeEvent<HTMLSelectElement>) => setTipoEvento(Number(e.target.value))}
                                required={true}
                            >
                                {tipoEventoDisponiveis.map(tipo => <option value={tipo.idTipoEvento}>{tipo.descricaoTipoEvento}</option>)}
                            </Select>

                            </div>
                        </div>
                    </div>
                    <div className='descricao-input-evento'>
                        <div>Descrição do evento(opcional)</div>
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
                            <div className='cadastro-evento__container-imagem'>
                                    <input 
                                        type='file' 
                                        className='cadastro-evento__input_imagem'
                                        accept='image/*'
                                        ref={ inputImagemref }
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                            setImagemEvento(e.target.files[0])
                                            setPreview(URL.createObjectURL(e.target.files[0]))
                                            }
                                            else {
                                            setImagemEvento(null)
                                            setPreview('')
                                            }
                                        }}
                                        />
                                        {imagemEvento?<img src={preView} className='cadastro-evento__imagem'/>:<div className='cadastro-evento__sem-imagem'> <i className='fa-solid fa-image cadastro-evento__sem-imagem-icone'/></div>}
                                    </div>
                                <div className='botoes-imagem'>
                                <Botao 
                                tamanho='min' 
                                texto='Selecionar arquivo' 
                                funcao={()=>inputImagemref.current?.click()}/>
                                <Botao 
                                tamanho='min' 
                                texto='Remover' 
                                funcao={()=>{
                                    setImagemEvento(null)
                                    URL.revokeObjectURL(preView)
                                    setPreview('')
                                    if(inputImagemref.current)
                                    inputImagemref.current.value = ""
                                }}/>
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
  )
}

export default InformacoesMeusEventos