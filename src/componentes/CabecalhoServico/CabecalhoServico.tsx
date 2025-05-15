import './CabecalhoServico.css'
import Botao from '../../componentes/Botao/Botao'
import { NavLink, useNavigate } from 'react-router'
import { Modal } from '../Modal/Modal'
import Input from '../Input/Input'
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import api from '../../axios'
import Select from '../../componentes/Select/Select';
import ErroCampoForm from '../../componentes/ErroCampoForm/ErroCampoForm';
import sweetAlert from 'sweetalert2'
import Alerta from '../Alerta/Alerta'

interface TipoServico {
  idTipoServico: string;
  descricaoTipoServico: string;
}

const CabecalhoServico = ({idServico, servico, preViewSv, setServico, idUsuario}: any) => {
  const [abrirEdicaoServico, setAbrirEdicaoServico] = useState(false)
  const [abrirApagarServico, setAbrirApagarServico] = useState(false)
  const [servicoEditado, setServicoEditado] = useState({...servico, tipoServico: servico.idTipoServico})
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [tipoServicoDisponiveis, setTipoServicoDisponiveis] = useState<TipoServico[]>([])
  const inputImagemref = useRef<HTMLInputElement>(null)
  const [imagemServico, setImagemServico] = useState<[File|null]>([null])
  const [preView, setPreview] = useState(preViewSv)
  const [imagemEditada, setImagemEditada] = useState(false)
  const [editadoOk, setEditadoOk] = useState(false)

  const navigate = useNavigate();
  
  const AbrirModalEditarServico = () => {
    setServicoEditado({...servico, tipoServico: servico.tipoServico.idTipoServico});
    setAbrirEdicaoServico(!abrirEdicaoServico)
  }

  const AbrirModalApagarServico = () => {
    setAbrirApagarServico(!abrirApagarServico)
  }


  const validarFormulario = async () => {
    const novosErros: { [key: string]: string } = {};

    if (!servicoEditado?.nomeServico) novosErros.nomeServico = "O nome do Servico é obrigatório.";


    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };


  
  useEffect(()=>{
    const buscarTiposDeServicos = async () => {
      try{
        const tipoServico = await api.get('/users/tipo-servico')
        setTipoServicoDisponiveis(tipoServico.data)
      }
      catch (error) {
        console.log('ocorreu algum erro: ',error)
        return
      }
    }
    buscarTiposDeServicos()
  },[])

  useEffect(() => {
    if (servico) {
      setServicoEditado({...servico, tipoServico: servico.tipoServico.idTipoServico});
    }
  }, [servico]);

  const editarServico = async () => {
    if (!await validarFormulario()) return;
    if (!servicoEditado) return alert("Serviço não carregado corretamente!");    
    try {
      const formData = new FormData();
            
      formData.append("nomeServico", servicoEditado.nomeServico);
      formData.append("descricaoServico", servicoEditado.descricaoServico || '');
      formData.append("idTipoServico", servicoEditado.tipoServico);
      formData.append("unidadeCobranca", servicoEditado.unidadeCobranca);
      formData.append("qntMinima", servicoEditado.qntMinima);
      formData.append("qntMaxima", servicoEditado.qntMaxima);
      formData.append("valorServico", servicoEditado.valorServico);

    //   if (imagemEditada) {
    //     if (imagemEvento) {
    //       formData.append("file", imagemEvento);
    //       formData.append("imagemEditada", "true");
    //     } else if (imagemEvento === null) {
    //       formData.append("imagemEditada", "true");
    //     }
    //   } else {
    //     formData.append("imagemEditada", "false");
    //   }

      await api.put(`/users/services/${servico.idEvento}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });    
      setEditadoOk(true);
      setTimeout(() => {
        setEditadoOk(false);
      }
      , 10000)

      AbrirModalEditarServico();
      setServico({
        ...servico,
        ...servicoEditado,
        tipoServico: {
          idTipoServico: servicoEditado.tipoEvento,
          descricaoTipoServico: tipoServicoDisponiveis.find((tipo) => tipo.idTipoServico.toString() === servicoEditado.tipoServico)?.descricaoTipoServico 
        },
        imagemServico: imagemServico instanceof File ? URL.createObjectURL(imagemServico) : servico.imagemServico,
      })
    } 
    catch (err) {
      console.error("Erro ao editar evento:", err);
      sweetAlert.fire({
        title: "Erro!",
        text: "Erro ao editar evento.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  const ApagarServico = () => { //FAZER NO BACK FUNÇÃO APAGAR SERVIÇO
    api.delete(`/users/${idUsuario}/services/${servico.idServico}`)
    .then(() => {
      navigate('/prestador/meus-servicos');
    })
    .catch((err) => {
      console.error("Erro ao apagar servico", err);
    });
    setAbrirApagarServico(!abrirApagarServico)
  }

  return (
    <div className="cabecalho-servicos">
      <div className='container'>
        <div className="titulo-infos-eventos">
          <div className="titulo-informacoes">
            <div className="titulo-do-evento">
              <h1 className='cabecalho-evento__titulo' title={servico.nomeServico}>{servico.nomeServico}</h1>
            </div>
            <div className="informacoes-evento">
              <div className='alinhamento-info-icone-servico'>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
                  <path d="M16.625 3.125C17.5915 3.125 18.375 3.89777 18.375 4.85102L18.375 7.79743C18.375 8.75069 17.5915 9.52346 16.625 9.52346H14C13.0335 9.52346 12.25 8.75069 12.25 7.79743L12.25 4.85102C12.25 3.89777 13.0335 3.125 14 3.125L16.625 3.125Z" stroke="#FA812F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.375 3.125C3.4085 3.125 2.625 3.89777 2.625 4.85102L2.62501 7.79743C2.62501 8.75069 3.40851 9.52346 4.37501 9.52346H7.00001C7.9665 9.52346 8.75001 8.75069 8.75001 7.79743L8.75 4.85102C8.75 3.89777 7.9665 3.125 7 3.125L4.375 3.125Z" stroke="#FA812F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.625 12.4766C17.5915 12.4766 18.375 13.2493 18.375 14.2026V17.149C18.375 18.1022 17.5915 18.875 16.625 18.875H14C13.0335 18.875 12.25 18.1022 12.25 17.149L12.25 14.2026C12.25 13.2493 13.0335 12.4766 14 12.4766H16.625Z" stroke="#FA812F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.37501 12.4766C3.40851 12.4766 2.62501 13.2493 2.62501 14.2026L2.62501 17.149C2.62501 18.1022 3.40851 18.875 4.37501 18.875H7.00001C7.96651 18.875 8.75001 18.1022 8.75001 17.149L8.75001 14.2026C8.75001 13.2493 7.9665 12.4766 7.00001 12.4766H4.37501Z" stroke="#FA812F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                    {servico.tipoServico.descricaoTipoServico}
              </div>
              <div className='alinhamento-info-icone-servico'>
                <span className='icone-preco-servico'>R$</span>
                <div>
                  {Number(servico.valorServico).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()}<span className='cor-unidade-servico'>{`/${servico.unidadeCobranca}`}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="botoes-evento">
              <div className='botao-evento'>
                <Botao
                  texto="Editar serviço"
                  tamanho="med"
                  tipo="botao"
                  cor='var(--yellow-700)'
                  funcao={() => setAbrirEdicaoServico(true)}
                />
              </div>
              <div className='botao-evento'>
                <Botao
                  texto="Apagar serviço"
                  tamanho="med"
                  tipo="botao"
                  cor='var(--yellow-700)'
                  funcao={() => setAbrirApagarServico(true)}
                />
              </div>
            </div>
        </div>
        <div className="abas-evento">
          <NavLink 
            to={`/prestador/meus-servicos/${idServico}/informacoes-meus-servicos`} 
            className={({isActive}: any) => (`aba-servico ${isActive ? "aba-servico--ativo" : ''}`)}
          >
            Informações Gerais
          </NavLink>
        </div>
      </div>
      {
        abrirEdicaoServico ? 
          <Modal funcaoSalvar={editarServico} titulo='Editar serviço' enviaModal={AbrirModalEditarServico}>
            <div className='modal-editar-evento'>
              <div className='campos-editar-evento'>
                <div className='nome-categoria-evento'>
                  <div className='nome-input-evento'>
                    <div className='textos'>Nome do serviço</div>
                    <div className="input-tamanho">
                      <Input 
                        value={servicoEditado?.nomeServico|| ""}  
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, nomeEvento: e.target.value } : null
                        )} 
                        type='text' 
                        dica='Digite um nome para o servico'
                      />
                      {erros.nomeServico && <ErroCampoForm mensagem={erros.nomeServico}/>}   
                    </div>  
                  </div>
                  <div className='categoria-input-evento'>
                    <div className='input-tamanho'>   
                      <Select 
                        cabecalho 
                        cabecalhoTexto='Tipo de Servico'  
                        textoPadrao='Selecione o tipo de servico'
                        valor={servicoEditado?.tipoServico}
                        funcao={(e: ChangeEvent<HTMLSelectElement>) => setServicoEditado((prev:any) => prev ? { ...prev, tipoServico: e.target.value } : null)}
                        required={true}
                      >
                        {tipoServicoDisponiveis.map(tipo => <option value={tipo.idTipoServico}>{tipo.descricaoTipoServico}</option>)}
                      </Select>
                      {/* {erros.tipoEvento && <ErroCampoForm mensagem={erros.tipoEvento}/>} */}
                    </div>
                  </div>
                </div>
                <div className='descricao-input-evento'>
                  <div>Descrição do servico(Opcional)</div>
                  <div className='input-tamanho-descricao'>
                    <Input 
                      value={servicoEditado?.descricaoServico || ""}  
                      onChange={(e:any) => setServicoEditado((prev:any) =>
                        prev ? { ...prev, descricaoEvento: e.target.value } : null
                      )} 
                      type='text' 
                      dica='Digite uma descrição para o seu servico...'
                    />
                  </div>
                </div>
                {/* <div className='imagem-evento'>
                  <div className='imagem-evento-texto-botao'>
                    <div className='texto-imagem-evento'>Imagem do servico(Opcional)</div>
                    <div className='input-imagem-evento'>
                      <div className='cadastro-evento__container-imagem'>
                        <input 
                          type='file' 
                          className='cadastro-evento__input_imagem'
                          accept='image/*'
                          ref={ inputImagemref }
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setImagemServico(e.target.files[0])
                              setPreview(URL.createObjectURL(e.target.files[0]))
                              setImagemEditada(true)
                            }
                            else {
                              setImagemServico(null)
                              setPreview('')
                            }
                          }}
                        />
                        {preView?<img src={preView} className='cadastro-evento__imagem'/>:<div className='cadastro-evento__sem-imagem'> <i className='fa-solid fa-image cadastro-evento__sem-imagem-icone'/></div>}
                      </div>
                      <div className='botoes-imagem'>
                        <Botao 
                          tamanho='min' 
                          texto='Selecionar arquivo' 
                          funcao={()=>inputImagemref.current?.click()}
                        />
                        <Botao 
                          tamanho='min' 
                          texto='Remover' 
                          funcao={()=>{
                            setImagemServico(null)
                            URL.revokeObjectURL(preView)
                            setPreview('')
                            setImagemEditada(true)
                            console.log('imagemEditada', imagemEditada)
                            if(inputImagemref.current)
                              inputImagemref.current.value = ""
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className='novos-dados-eventos'>
                <div className='texto-input-data'>
                  <div className='textos'>Unidade de cobrança</div>
                  <div className='input-data-evento'>
                    <Input 
                      value={servicoEditado?.dataEvento || ""}  
                      onChange={(e:any) => setServicoEditado((prev:any) =>
                        prev ? { ...prev, unidadeCobranca: e.target.value } : null
                      )} 
                      dica=''
                    />
                    {/* {erros.dataEvento && <ErroCampoForm mensagem={erros.dataEvento}/>} */}
                  </div>
                </div>
                <div className='texto-input-hora-inicio-evento'>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Valor do serviço por unidade</div>
                    <div className='input-tamanho'>
                      <Input 
                        value={servicoEditado?.valorServico || ""}  
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, valorServico: e.target.value } : null
                        )} 
                        dica='R$'
                      />
                      {/* {erros.horaInicio && <ErroCampoForm mensagem={erros.horaInicio}/>} */}
                    </div>
                  </div>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Quantidade mínima</div>
                    <div className='input-tamanho'>
                      <Input 
                        value={servicoEditado?.qntMinima || ""}
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, qntMinima: e.target.value } : null
                        )} 
                        dica='--:--'
                      />
                      {/* {erros.horaFim && <ErroCampoForm mensagem={erros.horaFim}/>} */}
                    </div>
                  </div>
                </div>
                <div className='texto-input-cep-endereco'>
                  <div className='input-texto-cep-numero'>
                    <div className='textos'>Quantidade máxima</div>
                    <div className='input-tamanho-cep-numero'>
                        <Input 
                            value={servicoEditado?.qntMaxima || ""}
                            onChange={(e:any) => setServicoEditado((prev:any) =>
                            prev ? { ...prev, qntMaxima: e.target.value } : null
                        )} 
                        dica='--:--'
                      />
                      {/* {erros.cepLocal && <ErroCampoForm mensagem={erros.cepLocal}/>} */}
                    </div>
                  </div>
                </div>
              </div>  
            </div>
          </Modal>
        : ''
      }
      { 
        abrirApagarServico ?
          <Modal titulo='Apagar Serviço' textoBotao="Apagar" funcaoSalvar={ApagarServico} enviaModal={AbrirModalApagarServico}>
            <div className='modal-apagar-evento'>
              <div className='texto-apagar-evento'>Você tem certeza que deseja apagar o serviço "{servico.nomeServico}"?</div>
            </div>
          </Modal>
        : ''
      }
      {
        editadoOk &&
        <div className='editar-evento__alerta'>
          <Alerta texto="Evento editado com sucesso!" status="sucesso" ativado={true}/>
        </div>
      }
    </div>
  )
}

export default CabecalhoServico;