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

interface Unidade{
  id: number;
  nome: string;
}

const CabecalhoServico = ({idServico, servico, preViewSv, setServico, idUsuario, setPreviewSv}: any) => {
  const [abrirEdicaoServico, setAbrirEdicaoServico] = useState(false)
  const [abrirApagarServico, setAbrirApagarServico] = useState(false)
  const [servicoEditado, setServicoEditado] = useState({...servico, tipoServico: servico.idTipoServico})
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [tipoServicoDisponiveis, setTipoServicoDisponiveis] = useState<TipoServico[]>([])
  const inputImagemRef = useRef<HTMLInputElement>(null)
  const [imagemServico, setImagemServico] = useState<File[]>([])
  const [preView, setPreview] = useState(preViewSv.filter((imagem: string)=> imagem !== null))
  const [editadoOk, setEditadoOk] = useState(false);
  const [unidade, setUnidade] = useState('')

  const [imagemOriginal, setImagemOriginal] = useState<string[]>(preViewSv.filter((imagem: string) => imagem !== null));

  const navigate = useNavigate();

  const maxImagemServico = 6;
  
  const AbrirModalEditarServico = () => {
    setServicoEditado({...servico, tipoServico: servico.tipoServico.idTipoServico});
    setPreview(preViewSv.filter((imagem: string)=> imagem !== null))
    setAbrirEdicaoServico(!abrirEdicaoServico)
  }

  const AbrirModalApagarServico = () => {
    setAbrirApagarServico(!abrirApagarServico)
  }


  const validarFormulario = async () => {
    const novosErros: { [key: string]: string } = {};

    if (!servicoEditado?.nomeServico) novosErros.nomeServico = "O nome do Serviço é obrigatório.";
    if (!servicoEditado?.descricaoServico) novosErros.descricaoServico = "A descricao do Serviço é obrigatório.";
    if (!servicoEditado?.idTipoServico) novosErros.idTipoServico = "O Tipo do Serviço é obrigatório.";
    if (!servicoEditado?.unidadeCobranca) novosErros.unidadeCobranca = "A unidade de cobrança é obrigatória.";
    if (!servicoEditado?.valorServico) novosErros.valorServico = "O valor do serviço é obrigatório.";
    if (!servicoEditado?.qntMinima) novosErros.qntMinima = "A quantidade minima é obrigatória.";
    if (!servicoEditado?.qntMaxima) novosErros.qntMaxima = "A quantidade máxima é obrigatória.";

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  useEffect(() => {
    setPreview(preViewSv.filter((imagem: string) => imagem !== null));
  },[preViewSv])

  useEffect(()=>{
    setPreview(()=> [...imagemOriginal, ...imagemServico.map((imagem: File) => URL.createObjectURL(imagem))])
    console.log('imagens antigas: ', imagemOriginal.length);
    console.log('imagens novas: ', imagemServico.length);
  },[imagemServico,imagemOriginal])
  
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
    buscarTiposDeServicos();
    const unidade = unidadeValor.find(
      (item) => item.id === Number(servico?.unidadeCobranca)
    );
    setUnidade(unidade!.nome);
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
      imagemOriginal.map((imagem: string) => {
        const imagemSemLink = imagem.split('/')
        formData.append("imagensMantidas", imagemSemLink[imagemSemLink.length - 1]);
      })
      imagemServico.map((imagem: File)=>{
        formData.append("files", imagem);
      })

      const {data} = await api.put(`/users/services/${servico.idServico}`, formData, {
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
        idTipoServico: servicoEditado.tipoServico,
          descricaoTipoServico: tipoServicoDisponiveis.find((tipo) => tipo.idTipoServico.toString() === servicoEditado.tipoServico)?.descricaoTipoServico 
        },
        imagemServico: imagemServico instanceof File ? URL.createObjectURL(imagemServico) : servico.imagemServico,
      })
      const imagens = [data.servico.imagem1, data.servico.imagem2, data.servico.imagem3, data.servico.imagem4, data.servico.imagem5, data.servico.imagem6];
      setPreviewSv(imagens.map((imagem) => imagem !== null ? `http://localhost:3000/files/${imagem}` : null));
    } 
    catch (err) {
      console.error("Erro ao editar Servico:", err);
      sweetAlert.fire({
        title: "Erro!",
        text: "Erro ao editar Servico.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  const ApagarServico = () => {
    api.delete(`/users/${idUsuario}/services/${servico.idServico}`)
    .then(() => {
      navigate('/prestador/meus-servicos');
    })
    .catch((err) => {
      console.error("Erro ao apagar servico", err);
    });
    setAbrirApagarServico(!abrirApagarServico)
  }

const unidadeValor: Unidade[] = [
  { id: 1, nome: "Unidade" },
  { id: 2, nome: "Hora" },
  { id: 3, nome: "Turno" },
  { id: 4, nome: "Diaria" },
  { id: 5, nome: "Alugel" },
  { id: 6, nome: "sessão" },
  { id: 7, nome: "pessoa" },
];



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
                  {Number(servico.valorServico).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()}<span className='cor-unidade-servico'>{`/${unidade}`}</span>
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
          <Modal funcaoSalvar={editarServico} titulo='Editar serviço' enviaModal={AbrirModalEditarServico} prestador>
            <div className='modal-editar-evento'>
              <div className='campos-editar-evento'>
                <div className='nome-categoria-evento'>
                  <div className='nome-input-evento'>
                    <div className='textos'>Nome do serviço</div>
                    <div className="input-tamanho">
                      <Input 
                        cor='var(--yellow-700)'
                        value={servicoEditado?.nomeServico|| ""}  
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                           prev ? { ...prev, nomeServico: e.target.value } : null
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
                        cor='var(--yellow-700)'
                        valor={servicoEditado?.tipoServico}
                        funcao={(e: ChangeEvent<HTMLSelectElement>) => setServicoEditado((prev:any) => prev ? { ...prev, tipoServico: e.target.value } : null)}
                        required={true}
                      >
                        {tipoServicoDisponiveis.map(tipo => <option value={tipo.idTipoServico}>{tipo.descricaoTipoServico}</option>)}
                      </Select>
                      {erros.idTipoServico && <ErroCampoForm mensagem={erros.idTipoServico}/>}
                    </div>
                  </div>
                </div>
                <div className='descricao-input-evento'>
                  <div>Descrição do servico(Opcional)</div>
                  <div className='input-tamanho-descricao'>
                    <Input 
                      cor='var(--yellow-700)'
                      value={servicoEditado?.descricaoServico || ""}  
                      onChange={(e:any) => setServicoEditado((prev:any) =>
                      prev ? { ...prev, descricaoServico: e.target.value } : null
                      )} 
                      type='text' 
                      dica='Digite uma descrição para o seu servico...'
                    />
                    {erros.descricaoServico && <ErroCampoForm mensagem={erros.descricaoServico}/>} 
                  </div>
                </div>
                <div className='d-flex row g-4 justify-content-center cadastro-servico__etapa-imagem-com-imagem'>
                  <input
                  style={{ display: 'none' }}
                  ref={inputImagemRef} 
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if(e.target.files && e.target.files.length + preView.length <= maxImagemServico) {
                    setImagemServico((prevState:File[])=> [...prevState, ...Array.from(e.target.files || [])]);
                    // inputImagemRef.current!.value = '';
                    return
                    }
                    console.log('limite de imagens atingido',  preView.length + e.target.files!.length);
                  }}
                  />
                  {preView ? preView.map((imagem: string, index:number)=>{
                    if (preView[index] !== null)
                    return <div className="col-12 col-sm-6 cadastro-servico__container-imagem">
                      <img key={imagem} src={imagem} alt="imagem do serviço" className="cadastro-servico__imagem-preview"/>
                      <button className='cadastro-servico__remover-image' type="button" onClick={()=>{
                        inputImagemRef.current!.value = ''
                        setImagemOriginal((prevState: string[]) => prevState.filter((_, i) => i !== index));
                        setImagemServico((prevState: File[]) => prevState.filter((_, i) => imagemOriginal.length + i !== index));
                        }}>
                        <i className="fa-solid fa-xmark cadastro-servico__remover-image-icone"></i>
                      </button>
                    </div>
                  })
                  :''}
                  {preView.length < maxImagemServico ? 
                  <button 
                  type="button"
                  onClick={()=>{inputImagemRef.current?.click()}}
                  className="col-12 col-sm-6 cadastro-servico__adicionar-imagem">
                    <div className="cadastro-servico__adicionar-imagem-info">
                      <div><i className="fa-solid fa-plus cadastro-servico__adicionar-imagem-icone"></i></div>
                      <div>Adicionar mais imagens</div>
                    </div>
                  </button>:''}
                </div>    
              </div>
              <div className='novos-dados-eventos'>
                <div className='texto-input-hora-inicio-evento'>
                  <div className='texto-input-data'>
                    <div className='textos'>Unidade de cobrança</div>
                    <div className='input-tamanho'>
                      <Select 
                        textoPadrao = 'Selecione a Unidade'
                        esconderValorPadrao
                        cor='var(--yellow-700)'
                        value={servicoEditado?.unidadeCobranca || ""}
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, unidadeCobranca: e.target.value } : null
                        )}>
                        {unidadeValor.map((unidade)=>{
                        return <option id={unidade.id.toString()} value={unidade.id}>{unidade.nome}</option>
                        })}
                      </Select>
                      {erros.unidadeCobranca && <ErroCampoForm mensagem={erros.unidadeCobranca}/>}
                    </div>
                  </div>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Valor do serviço por unidade</div>
                    <div className='input-tamanho'>
                      <Input 
                        cor='var(--yellow-700)'
                        value={servicoEditado?.valorServico || ""}  
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, valorServico: e.target.value } : null
                        )} 
                        dica='R$'
                      />
                      {erros.valorServico && <ErroCampoForm mensagem={erros.valorServico}/>}
                    </div>
                  </div>
                </div>
                <div className='texto-input-hora-inicio-evento'>
                  <div className='horario-inicio-fim-evento'>
                    <div className='textos'>Quantidade mínima</div>
                    <div className='input-tamanho'>
                      <Input 
                        cor='var(--yellow-700)'
                        value={servicoEditado?.qntMinima || ""}
                        onChange={(e:any) => setServicoEditado((prev:any) =>
                          prev ? { ...prev, qntMinima: e.target.value } : null
                        )} 
                        dica='1'
                      />
                      {erros.qntMinima && <ErroCampoForm mensagem={erros.qntMinima}/>}
                    </div>
                  </div>
                  <div className='texto-input-cep-endereco'>
                    <div className='input-texto-cep-numero'>
                      <div className='textos'>Quantidade máxima</div>
                      <div className='input-tamanho'>
                          <Input 
                              cor='var(--yellow-700)'
                              value={servicoEditado?.qntMaxima || ""}
                              onChange={(e:any) => setServicoEditado((prev:any) =>
                              prev ? { ...prev, qntMaxima: e.target.value } : null
                          )} 
                          dica='10'
                        />
                        {erros.qntMaxima && <ErroCampoForm mensagem={erros.qntMaxima}/>}
                      </div>
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
          <Modal titulo='Apagar Serviço' textoBotao="Apagar" funcaoSalvar={ApagarServico} enviaModal={AbrirModalApagarServico} prestador>
            <div className='modal-apagar-evento'>
              <div className='texto-apagar-evento'>Você tem certeza que deseja apagar o serviço "{servico.nomeServico}"?</div>
            </div>
          </Modal>
        : ''
      }
      {
        editadoOk &&
        <div className='editar-evento__alerta'>
          <Alerta texto="Serviço editado com sucesso!" status="sucesso" ativado={true}/>
        </div>
      }
    </div>
  )
}

export default CabecalhoServico;