import './InformacoesMeusEventos.css';
// import React from 'react'
import { Modal } from '../../componentes/Modal/Modal';
import Input from '../../componentes/Input/Input';
import Botao from '../../componentes/Botao/Botao';
import React from 'react';
// import Select from '../../componentes/Select/Select';

const InformacoesMeusEventos = () => {

    const [ModalEditarEventoAberto, setModalEditarEventoAberto] = React.useState(false)

    const AbrirModalEditarEvento = () => {
        setModalEditarEventoAberto(!ModalEditarEventoAberto)
    }

    
  return (
    <div className='informacoes-meus-eventos'>
        <Botao texto='Editar evento' funcao={AbrirModalEditarEvento} tamanho='minimo' className='botao-editar-evento'/>
        <div className='detalhes-eventos'>
            <p className='texto-detalhes-eventos'>Detalhes do evento</p>
            <div className='linhas'>
                <div className='status'>
                    <div className='texto-status-categoria-data-horario-endereco'>Status</div>
                    <div className='nome-cor-status'>
                        <svg className='bolinha' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="7" fill="#8C5DFF"/>
                        </svg>
                        <div className='texto-proximos-eventos'>Próximos Eventos</div>
                    </div>
                </div>
                <div className='categoria'>
                    <div className='texto-status-categoria-data-horario-endereco'>Categoria</div>
                    <div>Apresentação educacional</div>
                </div>
            </div>
            <div className='linhas'>
                <div className='data'>
                    <div className='texto-status-categoria-data-horario-endereco'>Data</div>
                    <div>Sexta-feira, 27 de junho de 2025</div>
                </div>
                <div className='horario'>
                    <div className='texto-status-categoria-data-horario-endereco'>Horário</div>
                    <div>19:00 - 19:30</div>
                </div>
            </div>
            <div className='linhas'>
                <div className='endereco'>
                    <div className='texto-status-categoria-data-horario-endereco'>Endereço</div>
                    <div>Rua dos bobos, número 0</div>
                </div>        
            </div>
        </div>

        <div className='resumo-convites'>
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
        </div>

        {
            ModalEditarEventoAberto ? 
            <Modal titulo='Editar evento' enviaModal={AbrirModalEditarEvento}>
            <div className='modal-editar-evento'>
                <div className='campos-editar-evento'>
                    <div className='nome-categoria-evento'>
                        <div className='nome-input-evento'>
                            <div className='textos'>Nome do evento</div>
                            <div className="input-tamanho">
                                <Input type='text' dica='Digite um nome para o evento'/>
                            </div>                  
                        </div>
                        <div className='categoria-input-evento'>
                            <div className='textos'>Categoria</div>
                            <div className='input-tamanho'>   
                                <Input type='text' dica='Digite uma categoria para o Evento'/>
                            </div>
                        </div>
                    </div>
                    <div className='descricao-input-evento'>
                        <div>Descrição do evento(opciona)</div>
                        <div className='input-tamanho-descricao'>
                            <Input type='text' dica='Digite uma descrição para o seu evento... '/>
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
                            <Input type='text' dica='dd/mm/aaaa'/>
                        </div>
                    </div>
                    <div className='texto-input-hora-inicio-evento'>
                        <div className='horario-inicio-fim-evento'>
                            <div className='textos'>Hora ínicio do evento</div>
                            <div className='input-tamanho'>
                                <Input type='text' dica='--:--'/>
                            </div>
                        </div>
                        <div className='horario-inicio-fim-evento'>
                            <div className='textos'>Hora fim do evento</div>
                            <div className='input-tamanho'>
                                <Input type='text' dica='--:--'/>
                            </div>
                        </div>
                    </div>
                    <div className='texto-input-cep-endereco'>
                        <div className='input-texto-cep-numero'>
                            <div className='textos'>CEP</div>
                            <div className='input-tamanho-cep-numero'>
                                <Input type='text' dica='Digite o CEP do local'/>
                            </div>
                        </div>
                        <div className='input-texto-endereco-complemento'>
                            <div className='textos'>Endereço</div>
                            <div className='input-tamanho-endereco-complemento'>
                                <Input type='text' dica='Digite o endereço do local'/>
                            </div>
                        </div>
                    </div>
                    <div className='input-texto-numero-complemento'>
                        <div className='input-texto-cep-numero'>
                            <div className='textos'>Número</div>
                            <div className='input-tamanho-cep-numero'>
                                <Input type='text' dica='Digite o número do local'/>
                            </div>
                        </div>
                        <div className='input-texto-endereco-complemento'>
                            <div className='textos'>Complemento</div>
                            <div className='input-tamanho-endereco-complemento'>
                                <Input type='text' dica='Digite o complemento'/>
                            </div>
                        </div>
                    </div>
                    <div className='input-texto-bairro'>
                        <div className='textos'>Bairro (opicional)</div>
                        <div className='input-bairro'>
                            <Input type='text' dica='Digite o bairro do local do evento'/>
                        </div>
                    </div>
                    <div className='input-texto-cidade-uf'>
                        <div className='input-cidade'>
                            <div className='textos'>Cidade (opicional)</div>
                            <div className='input-tamanho-cidade'>
                                <Input type='text' dica='Digite a cidade do local'/>
                            </div>
                        </div>
                        <div className='input-uf'>
                            <div className='textos'>UF (opicional)</div>
                            <div className='input-tamanho-uf'>
                                <Input type='text' dica='Digite a UF'/>
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
  )
}

export default InformacoesMeusEventos