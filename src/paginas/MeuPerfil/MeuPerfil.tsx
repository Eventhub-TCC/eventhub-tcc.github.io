import './MeuPerfil.css'
import Botao from '../../componentes/Botao/Botao'
import Input from '../../componentes/Input/Input'
import axios from 'axios'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { PatternFormat } from 'react-number-format'
import { motion } from 'framer-motion'
import { Modal } from '../../componentes/Modal/Modal'
import ErroCampoForm from '../../componentes/ErroCampoForm/ErroCampoForm'
import api from '../../axios'
import { useLocation, useNavigate } from 'react-router'
import logoOrganizador from '../../assets/logo_eventhub-sem-fundo.png';
import logoPrestador from '../../assets/eventhub_logo_prestador.png';
import { jwtDecode } from 'jwt-decode'
import { Helmet } from 'react-helmet-async'

interface Usuario { 
  nomeUsu: string;
  sobrenomeUsu: string;
  cpfUsu: string;
  dtNasUsu: string;
  emailUsu: string;
  telUsu: string;
  senhaUsu: string;
  fotoUsu: string | null;
  nomeEmpresa: string;
  cnpjEmpresa: string;
  fotoEmpresa: string | null;
  telEmpresa: string;
  localizacaoEmpresa: string; 
}

interface Erro{
  ativo: boolean;
  tipo: string;
  mensagem: string;
}

const MeuPerfil = () => {
  const [usuario, setUsuario] = useState<Usuario | null> ({
    nomeUsu: '',
    sobrenomeUsu: '',
    cpfUsu: '',
    dtNasUsu: '',
    emailUsu: '',
    telUsu: '',
    senhaUsu: '',
    fotoUsu: null,
    nomeEmpresa: '',
    cnpjEmpresa: '',
    fotoEmpresa: null,
    telEmpresa: '',
    localizacaoEmpresa: '',
  });
  const [nomeExibido, setNomeExibido] = useState<string>('');
  const [nomeEmpresaExibido, setNomeEmpresaExibido] = useState<string>('');
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);
  const [senhaAtual, setSenhaAtual] = useState<string>('');
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [ senhaAtualOculta, setSenhaAtualOculta ] = useState(true);
  const [ novaSenhaOculta, setNovaSenhaOculta ] = useState(true);
  const [ confirmarSenhaOculta, setConfirmarSenhaOculta ] = useState(true);
  const [excluir, setExcluir] = useState<boolean>(false);
  const [cpfOriginal, setCpfOriginal] = useState<string>('');
  const [cnpjOriginal, setCnpjOriginal] = useState<string>('');
  const [ erros, setErros ] = useState<Erro[]>([
  {ativo: false, tipo: 'confirmar-senha', mensagem: 'A confirmação da senha não confere'},
  {ativo: false, tipo: 'cpf', mensagem: 'CPF inválido'},
  {ativo: false, tipo: 'nome', mensagem: 'Preencha o nome'},
  {ativo: false, tipo: 'sobrenome', mensagem: 'Preencha o sobrenome'},
  {ativo: false, tipo: 'dataNascimento', mensagem: 'Preencha a data de nascimento'},
  {ativo: false, tipo: 'telefone', mensagem: 'Telefone inválido'},
  {ativo: false, tipo: 'NomeEmpresa', mensagem: 'Preencha o nome da empresa'},
  {ativo: false, tipo: 'CNPJ', mensagem: 'Preencha o CNPJ'},
  {ativo: false, tipo: 'telefoneEmpresa', mensagem: 'Preencha o telefone da empresa'},
  {ativo: false, tipo: 'localizacaoEmpresa', mensagem: 'Preencha a localização da empresa'},
]);

const navigate = useNavigate();
const [preView, setPreview] = useState('')
const inputImagemref = useRef<HTMLInputElement>(null)
const [modalCompletarCadastro, setModalCompletarCadastro] = useState(false)
const [modalCompletarCadastroDados, setModalCompletarCadastroDados] = useState(false)
  const [tipoUsuario, setTipoUsuario] = useState({
    prestador: false,
    organizador: false
  });
const [carregando, setCarregando] = useState(true);
const [modalExcluirFoto, setModalExcluirFoto] = useState(false);

const transicao = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

const location = useLocation()

const isOrganizador = location.pathname.includes('organizador')
const isPrestador = location.pathname.includes('prestador')

useEffect(() => {
  const obterUsuario = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken: any = jwtDecode(token!);
      const tipo: string[] = decodedToken.tipo;
      const response = await api.get<Usuario>(`/users/get-user`);
      setUsuario(response.data);
      setNomeExibido(`${response.data.nomeUsu} ${response.data.sobrenomeUsu}`);
      setNomeEmpresaExibido(response.data.nomeEmpresa);
      setCpfOriginal(response.data.cpfUsu);
      setCnpjOriginal(response.data.cnpjEmpresa);
      setPreview(isOrganizador ? response.data.fotoUsu ? `http://localhost:3000/files/${response.data.fotoUsu}` : '' : isPrestador? response.data.fotoEmpresa ? `http://localhost:3000/files/${response.data.fotoEmpresa}` : '' : '');
      if (tipo.find((value) => value === 'prestador')) {
        setTipoUsuario(prestador => ({ ...prestador, prestador: true }));
      } 
      if (tipo.find((value) => value === 'organizador')) {
        setTipoUsuario(organizador => ({ ...organizador, organizador: true }));
      }  
    } catch (error) {
        console.error('Erro ao obter usuário');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }
    obterUsuario();
},[]);

const validarCampos = async (): Promise<boolean> => {
  const errosFiltrados = erros.filter((erro) => {
    if(modalCompletarCadastroDados && isPrestador){
      return [
        'cpf', 'nome', 'sobrenome', 'dataNascimento', 'telefone'
      ].includes(erro.tipo);
    }
    if(modalCompletarCadastroDados && isOrganizador){
      return [
        'NomeEmpresa', 'CNPJ', 'telefoneEmpresa', 'localizacaoEmpresa'
      ].includes(erro.tipo);
    }
    if (isOrganizador) {
      return [
        'cpf', 'nome', 'sobrenome', 'dataNascimento', 'telefone', 'confirmar-senha'
      ].includes(erro.tipo);
    }

    if (isPrestador) {
      return [
        'confirmar-senha', 'NomeEmpresa', 'CNPJ', 'telefoneEmpresa', 'localizacaoEmpresa'
      ].includes(erro.tipo);
    }

    return false;
  });

  const novosErros = await Promise.all(errosFiltrados.map(async (erro) => {
    switch (erro.tipo) {
      case 'cpf':
        if (!usuario?.cpfUsu?.trim()) {
          return { ...erro, ativo: true };
        }
        if (usuario.cpfUsu === cpfOriginal) {
          return { ...erro, ativo: false };
        }
        try {
          const response = await api.post(`/users/validate-cpf`, {
            cpfUsu: usuario.cpfUsu,
          });
          const cpfValido = response.data;
          return { ...erro, ativo: !cpfValido };
        } catch (err: any) {
          if (err.response?.status === 409) {
            return {
              ...erro,
              ativo: true,
              mensagem: ' CPF já cadastrado',
            };
          }
          return { ...erro, ativo: true, mensagem: 'CPF inválido' };
        }

      case 'confirmar-senha':
        if (novaSenha?.length < 8 && novaSenha) {
          return {
            ...erro,
            ativo: true,
            mensagem: 'A senha deve ter pelo menos 8 caracteres',
          };
        }
        return {
          ...erro,
          ativo: !!novaSenha && novaSenha !== confirmarSenha,
          mensagem: 'A confirmação da senha não confere',
        };

      case 'telefone':
        const telefone = usuario?.telUsu?.trim() || '';
        const telefoneValido = /^\d{10,11}$/.test(telefone);
        return { ...erro, ativo: !telefoneValido };

      case 'nome':
        return { ...erro, ativo: !usuario?.nomeUsu?.trim() };

      case 'sobrenome':
        return { ...erro, ativo: !usuario?.sobrenomeUsu?.trim() };

      case 'dataNascimento': {
        const dataNascimento = new Date(usuario?.dtNasUsu || '');
        const hoje = new Date();
        const idade =
          hoje.getFullYear() - dataNascimento.getFullYear() -
          (hoje.getMonth() < dataNascimento.getMonth() ||
            (hoje.getMonth() === dataNascimento.getMonth() &&
              hoje.getDate() < dataNascimento.getDate())
            ? 1
            : 0);
        if (!usuario?.dtNasUsu?.trim()) {
          return { ...erro, ativo: true };
        }
        if (isNaN(dataNascimento.getTime()) || idade > 130) {
          return { ...erro, ativo: true, mensagem: 'Data de nascimento inválida' };
        }
        if (idade < 18) {
          return { ...erro, ativo: true, mensagem: 'Você deve ter pelo menos 18 anos' };
        }
        return { ...erro, ativo: false };
      }

      case 'NomeEmpresa':
        return { ...erro, ativo: !usuario?.nomeEmpresa?.trim() };

      case 'CNPJ':
        if (!usuario?.cnpjEmpresa?.trim()) {
          return { ...erro, ativo: true };
        }
        if (usuario.cnpjEmpresa === cnpjOriginal) {
          return { ...erro, ativo: false };
        }
        try {
          const response = await api.post(`/users/validate-cnpj`, {
            cnpjEmpresa: usuario.cnpjEmpresa,
          });
          const cnpjValido = response.data;
          return { ...erro, ativo: !cnpjValido };
        } catch (err: any) {
          if (err.response?.status === 409) {
            return {
              ...erro,
              ativo: true,
              mensagem: ' CNPJ já cadastrado',
            };
          }
          return { ...erro, ativo: true, mensagem: 'CNPJ inválido' };
        }

      case 'telefoneEmpresa':
        return { ...erro, ativo: !usuario?.telEmpresa?.trim() };

      case 'localizacaoEmpresa':
        return { ...erro, ativo: !usuario?.localizacaoEmpresa?.trim() };

      default:
        return erro;
    }
  }));

  setErros(novosErros);
  return novosErros.every((erro) => !erro.ativo);
};

const setarExcluir = () => {
  setExcluir(false);
}

const deletarPerfil = async () => {
  try{
    await api.delete(`/users/delete-user`);
    localStorage.removeItem('token');
    navigate('/');
    } catch (error) {
      console.error('Erro ao deletar usuário');
  }
}

const alterarImagemPerfil = async ( imagem : any ) => {
  try {
    isOrganizador ?
    await api.put(`/users/update-image`,{
      file: imagem
    }, {
      headers: {
        'content-type': 'multipart/form-data',
  }}) : 
  await api.put(`/users/update-image-empresa`,{
    file: imagem
  }, {
    headers: {
      'content-type': 'multipart/form-data',
}}) 
     
  window.location.reload();;
  }
  catch (error) {
    console.error('Erro ao alterar imagem de perfil', error);
  }
}

const editarPerfil = async () => {
    try {
      const valido = await validarCampos();
      if (!valido) return;
      await api.put(`/users/update-user`, {
        ...usuario, 
        senhaAtual, 
        novaSenha, 
        confirmarSenha
      });
      setModoEdicao(false);
      setErros(erros.map(erro => ({ ...erro, ativo: false })));
      setNomeExibido(`${usuario?.nomeUsu} ${usuario?.sobrenomeUsu}`);
      setNomeEmpresaExibido(usuario?.nomeEmpresa || '');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setSenhaAtualOculta(true);
      setNovaSenhaOculta(true);
      setConfirmarSenhaOculta(true);
    }
    catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErros(erros.map(erro => {
          if (erro.tipo === 'confirmar-senha') {
            erro.ativo = true;
            erro.mensagem = 'Senha atual inválida';
          }
          return erro;
        }));
      } 
      console.error('Erro ao editar usuário');
      console.error(error); 
    }
  }

  const continuarCompletaCadastro = () => {
    setModalCompletarCadastro(false);
    setModalCompletarCadastroDados(true);
  }


  const completarCadastro = async () => {
    try {
      const valido = await validarCampos();
      if (!valido) return;
      const novoTipo = tipoUsuario.prestador ? { organizador: true } :
                      tipoUsuario.organizador ? { prestador: true } : null;
      if (novoTipo) {
        setTipoUsuario(anterior => ({ ...anterior, ...novoTipo }));

        const response = await api.put(`/users/update-user`, {
          ...usuario,
          ...novoTipo,
        });

        const token = response.data.token;
        if (token) {
          localStorage.setItem('token', token);
        }
      }
      setModalCompletarCadastroDados(false);
      novoTipo!.organizador ? navigate('/organizador/meus-eventos') : navigate('/prestador/meus-servicos');
    } catch (error) {
      console.error('Erro ao editar usuário');
      console.error(error); 
    }
  }

  if (carregando) return null; 

return (
  <>
    <Helmet>
      <title>Perfil | EventHub</title>
    </Helmet>
    <div>
        { isOrganizador ? <div className='perfil'>
          <div className="perfil--titulo-botao">
            <h1 className='layout-titulo'>Perfil</h1>
            {
              tipoUsuario.prestador && tipoUsuario.organizador ?
              ''
              :
              <div className="perfil--botao-notificacao" onClick={() => {setModalCompletarCadastro(!modalCompletarCadastro)}}>
                <i className="fa-regular fa-bell"></i>
              </div>

            }

          </div>
            <div className='caixa-perfil'>
              <div className='formulario-perfil'>
                <div className='perfil-foto-nome-email-organizador'>
                  <div className='foto-perfil'> 
                    {preView ? 
                      <img className='imagem-perfil' src={preView} alt="Imagem de perfil" />
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
                        <circle cx="38" cy="38" r="37.5" fill="#D9D9D9" stroke="#D9D9D9"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M62.1304 66.2249C55.6243 71.6988 47.201 75.0006 37.9999 75.0006C28.7988 75.0006 20.3755 71.6988 13.8695 66.2249C17.1125 59.0364 24.3242 54.0373 32.7038 54.0373H43.2961C51.6756 54.0373 58.8874 59.0364 62.1304 66.2249ZM48.489 44.0988C45.7072 46.8894 41.9341 48.4572 37.9999 48.4572C34.0658 48.4572 30.2927 46.8894 27.5108 44.0988C24.729 41.3082 23.1661 37.5233 23.1661 33.5767C23.1661 29.6302 24.729 25.8453 27.5108 23.0547C30.2927 20.264 34.0658 18.6963 37.9999 18.6963C41.9341 18.6963 45.7072 20.264 48.489 23.0547C51.2709 25.8453 52.8338 29.6302 52.8338 33.5767C52.8338 37.5233 51.2709 41.3082 48.489 44.0988Z" fill="white"/>
                      </svg>}
                      <input 
                        type='file' 
                        className='cadastro-evento__input_imagem'
                        accept='image/*'
                        ref={ inputImagemref }
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          if (e.target.files && e.target.files.length > 0 && e.target.files[0]) {
                            setPreview(URL.createObjectURL(e.target.files[0]))
                            alterarImagemPerfil(e.target.files[0])
                          }
                        }}
                      />
                    <div className='nome-email-organizador'>
                      <h2 className='nome-perfil-organizador'>{nomeExibido}</h2>
                      <h2 className='email-perfil-organizador'>{usuario?.emailUsu}</h2>
                    </div>
                  </div>
                  <div className='botoes-foto-perfil'>
                    <div className='botao-alterar-foto-perfil'>
                      <Botao 
                        tamanho='med' 
                        texto='Alterar foto' 
                        funcao={()=>{inputImagemref.current?.click()}}
                      />       
                    </div>
                    <div className='botao-remover-foto-perfil'>
                      <Botao 
                        tamanho='med' 
                        texto='Remover foto' 
                        funcao={()=>{setModalExcluirFoto(true)}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='caixa-input-perfil'>
              <div className='informacoes-pessoais-perfil-organizador'>
                <p className='texto-informacoes-pessoal'>Informações Pessoais</p>
              </div>
              <div className='row g-4'>
                <div className='col-12 col-md-6'>
                  <div>
                    <Input 
                      value={usuario?.nomeUsu}              
                      dica='Digite seu nome'
                      obrigatorio
                      name='nome'
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, nomeUsu: event.target.value})}
                      cabecalho
                      cabecalhoTexto='Nome'
                      disabled={!modoEdicao}
                    />
                  </div>
                  {erros.find((e) => e.tipo === 'nome' && e.ativo) && (
                      <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'nome')?.mensagem}/>
                    )}
                </div>
                <div className='col-12 col-md-6'>
                  <div>
                    <Input
                      value={usuario?.sobrenomeUsu}                      
                      dica='Digite seu sobrenome'
                      obrigatorio
                      name='sobrenome'
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, sobrenomeUsu: event.target.value})}
                      cabecalho
                      cabecalhoTexto='Sobrenome'
                      disabled={!modoEdicao}/>
                  </div>
                  {erros.find((e) => e.tipo === 'sobrenome' && e.ativo) && (
                    <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'sobrenome')?.mensagem}/>
                  )}
                </div>
                <div className='col-12 col-md-6'>
                  <div>
                    <PatternFormat 
                      format="###.###.###-##"
                      mask="_"
                      value={usuario?.cpfUsu}
                      customInput={Input}
                      onValueChange={(values) => {setUsuario({...usuario!, cpfUsu:values.value})}}
                      dica='Digite seu CPF'
                      obrigatorio
                      name='cpf'
                      cabecalho 
                      cabecalhoTexto='CPF'
                      disabled={!modoEdicao}
                    />
                    {erros.find((e) => e.tipo === 'cpf' && e.ativo) && (
                      <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'cpf')?.mensagem}/>
                    )}
                  </div>
                </div>
                <div className='col-12 col-md-6'>
                  <div>
                    <Input 
                      value={usuario?.dtNasUsu}
                      dica='Digite sua data de nascimento'
                      obrigatorio
                      name='dataNascimento'
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, dtNasUsu: event.target.value})}
                      cabecalho
                      cabecalhoTexto='Data de Nascimento'
                      disabled={!modoEdicao}
                      type="date"/>
                  </div>
                  {erros.find((e) => e.tipo === 'dataNascimento' && e.ativo) && (
                    <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'dataNascimento')?.mensagem}/>
                  )}
                </div>
            </div>
          </div>

          <div className='caixa-input-perfil'>
            <div className='informacoes-pessoais-perfil-organizador'>
              <p className='texto-informacoes-pessoal'>Contato</p>
            </div>
            <div className='row g-4'>
              <div className='col-12 col-md-6'>
                <div>
                  <Input  
                    value={usuario?.emailUsu}                
                    dica='Digite seu email'
                    obrigatorio
                    name='email'
                    cabecalho
                    cabecalhoTexto='Email'
                    autoComplete='email'
                    disabled
                  />
                </div>
              </div>
              <div className='col-12 col-md-6'>
                <div>
                  <PatternFormat 
                    format="(##) #####-####"
                    mask="_"
                    customInput={Input} 
                    value={usuario?.telUsu}           
                    dica='Digite seu telefone'
                    onValueChange={(values) => {setUsuario({...usuario!, telUsu:values.value});}}
                    obrigatorio
                    name='telefone'
                    cabecalho
                    cabecalhoTexto='Telefone'
                    disabled={!modoEdicao}
                    type="tel"
                  />
                  {erros.find((e) => e.tipo === 'telefone' && e.ativo) && (
                    <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'telefone')?.mensagem}/>
                  )}
                </div>
              </div>
            </div>
          </div>
          {
            modalExcluirFoto ?
            <Modal titulo="Excluir foto" enviaModal={setModalExcluirFoto} textoBotao="Excluir" funcaoSalvar={()=>{
                        URL.revokeObjectURL(preView)
                        setPreview('')
                        if(inputImagemref.current)
                          inputImagemref.current.value = ""
                        alterarImagemPerfil(null)
                        }}> Tem certeza que deseja excluir sua foto? </Modal>
            : ''
          }

          {modoEdicao ? 
            (
              <motion.div key="modoEdicao" {...transicao} className='perfil-modo-edicao'>
                <div className='caixa-input-perfil'>
                  <div className='informacoes-pessoais-perfil-organizador'>
                    <p className='texto-informacoes-pessoal'>Segurança</p>
                  </div>
                  <div className='row g-4'>
                    <div className='col-12'>
                      <div>
                        <Input 
                          tipo={senhaAtualOculta ? 'password' : 'text'}
                          dica='Digite sua senha atual'
                          cabecalho 
                          cabecalhoTexto='Senha atual' 
                          name='senha-atual'
                          value={senhaAtual}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => setSenhaAtual(event.target.value)}
                          icone={
                            senhaAtual !== '' ? 
                              `fa-solid ${senhaAtualOculta ? 'fa-eye-slash' : 'fa-eye'}` 
                            : ''
                          }
                          funcaoIcone={() => setSenhaAtualOculta(!senhaAtualOculta)}
                        />
                      </div>
                    </div>
                      <div className='col-12 col-md-6'>
                        <div>
                          <Input
                            tipo={novaSenhaOculta ? 'password' : 'text'}           
                            dica='Digite sua nova senha'
                            obrigatorio
                            name='nova-senha'
                            value={novaSenha}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setNovaSenha(event.target.value)}
                            cabecalho
                            cabecalhoTexto='Nova senha'
                            icone={
                              novaSenha !== '' ? 
                                `fa-solid ${novaSenhaOculta ? 'fa-eye-slash' : 'fa-eye'}` 
                              : ''
                            }
                            funcaoIcone={() => setNovaSenhaOculta(!novaSenhaOculta)}
                          />
                        </div>
                      </div>
                      <div className='col-12 col-md-6'>
                        <div>
                          <Input   
                            tipo={confirmarSenhaOculta ? 'password' : 'text'}                 
                            dica='Confirme sua nova senha'
                            obrigatorio
                            name='Confirme'
                            value={confirmarSenha}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmarSenha(event.target.value)}
                            cabecalho
                            cabecalhoTexto='Confirme sua nova senha'
                            icone={
                              confirmarSenha !== '' ? 
                                `fa-solid ${confirmarSenhaOculta ? 'fa-eye-slash' : 'fa-eye'}` 
                              : ''
                            }
                            funcaoIcone={() => setConfirmarSenhaOculta(!confirmarSenhaOculta)}
                          />
                        </div>
                      </div>
                  
                    {erros.find((e) => e.tipo === 'confirmar-senha' && e.ativo) && (
                      <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'confirmar-senha')?.mensagem}/>
                    )}
                </div>
              </div>
              <div className='botoes-alterar-perfil-edicao'>
                <div className='botao-editar'>
                  <Botao 
                    tamanho='max' 
                    funcao={() => {
                      setModoEdicao(false);
                      api.get<Usuario>(`/users/get-user`)
                      .then(response => {
                        setUsuario(response.data);
                      })
                      .catch(error => {
                        console.error('Erro ao obter usuário', error);
                      });   
                      setErros(erros => erros.map(erro => {
                        erro.ativo = false;
                        return erro;
                      }));
                      setSenhaAtual('');
                      setNovaSenha('');
                      setConfirmarSenha('');
                      setSenhaAtualOculta(true);
                      setNovaSenhaOculta(true);
                      setConfirmarSenhaOculta(true);
                    }} 
                    texto='Cancelar' 
                  />
                </div>
                <div className='botao-editar'>
                  <Botao tamanho='max' funcao={editarPerfil} texto='Salvar' />
                </div>
              </div>
              </motion.div>
                ) 
                : 
                (
                  <motion.div key="foraModoEdicao" {...transicao} className='perfil-fora-modo-edicao'>
                    <div className='caixa-input-perfil'>
                      <div className='informacoes-pessoais-perfil-organizador'>
                        <p className='texto-informacoes-pessoal'>Segurança</p>
                      </div>
                      <div>
                        <Input 
                          cabecalho 
                          cabecalhoTexto='Senha atual' 
                          disabled={true}
                          dica="••••••••••"
                          name='senha-atual-desabilitado'
                        />
                      </div>
                  </div>
                  <div className='botoes-alterar-perfil'>
                    <div className='botao-editar'>
                      <Botao tamanho='max' funcao={() => setModoEdicao(true)} texto='Editar' />
                    </div>
                    <div className='botao-deletar'>
                      <Botao tamanho='max' funcao={() => setExcluir(true)} texto='Excluir conta' />
                    </div>
                    {excluir ? 
                      <Modal titulo="Excluir conta" enviaModal={setarExcluir} textoBotao="Excluir" funcaoSalvar={deletarPerfil}> Tem certeza que deseja excluir sua conta? </Modal>
                    : ""}
                  </div>
                </motion.div>  
              )}
              {
                modalCompletarCadastro ?
                <Modal titulo='Completar Cadastro' prestador enviaModal={() => {setModalCompletarCadastro(!modalCompletarCadastro)}} textoBotao="Continuar" funcaoSalvar={continuarCompletaCadastro}>
                  <div className="completar-cadastro--imagem">
                    <img className='completar-cadastro--imagem--tamanho'src={logoPrestador} alt="Imagem de completar cadastro" />
                  </div>
                  <div className="completar-cadastro--titulo">
                    <div className="completar-cadastro--titulo-texto">
                      Descubra novas oportunidades na plataforma!
                    </div>
                    <div className="completar-cadastro--descricao">
                      Você pode também oferecer seus serviços como prestador e ampliar sua atuação.
                    </div>
                  </div>
                  <div className="completar-cadastro--texto">
                  {
                    `Ao ativar o perfil de prestador de serviços, você poderá:

                      - Gerenciar seus próprios serviços;
                      - Oferecer seus serviços para milhares de organizadores;
                      - Gerenciar pedidos recebidos diretamente pelo app;
                      - Controlar tudo em um só lugar, de forma simples e rápida.

                    Tudo isso com o mesmo login e sem custos extras. Falta só completar seu cadastro para começar!`
                  }
                  </div>
                </Modal>
                :
                ''
              }
              {
                modalCompletarCadastroDados ?
                <Modal titulo='Completar Cadastro' funcaoSalvar={completarCadastro} enviaModal={() => {setModalCompletarCadastroDados(false)}} textoBotao="Salvar">
                  <div className='modal-completar-cadastro--texto'>
                    <div>Para alterar seu tipo de usuário é necessário completar seu cadastro!</div>
                  </div>
                  <div className="modal-completar-cadastro--campos">
                    <div className="modal-completar-cadastro--nome-cnpj">
                        <div className='col-12 col-md-5'>
                            <Input 
                                    value={usuario?.nomeEmpresa}              
                                    dica='Digite o nome de sua empresa'
                                    obrigatorio
                                    name='nome_empresa'
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, nomeEmpresa: event.target.value})}
                                    cabecalho
                                    cabecalhoTexto='Nome da Empresa'
                            />
                            {erros.find((e) => e.tipo === 'NomeEmpresa' && e.ativo) && (
                              <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'NomeEmpresa')?.mensagem}/>
                            )}
                        </div>
                        <div className='col-12 col-md-5'>
                          <PatternFormat 
                                format="##.###.###/####-##"
                                mask="_"
                                value={usuario?.cnpjEmpresa}
                                customInput={Input}
                                onValueChange={(values) => {setUsuario({...usuario!, cnpjEmpresa:values.value})}}
                                dica='Digite seu CNPJ'
                                obrigatorio
                                name='cnpj'
                                cabecalho 
                                cabecalhoTexto='CNPJ'
                              />
                            {erros.find((e) => e.tipo === 'CNPJ' && e.ativo) && (
                              <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'CNPJ')?.mensagem}/>
                            )}
                        </div>
                    </div>
                      <div className='col-12 col-md-12'>
                        <div>
                        <Input 
                              value={usuario?.localizacaoEmpresa}
                              dica='Digite a localização de sua empresa'
                              obrigatorio
                              name='localizacaoEmpresa'
                              onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, localizacaoEmpresa: event.target.value})}
                              cabecalho
                              cabecalhoTexto='Localização da Empresa'
                              type="local"/>
                              {erros.find((e) => e.tipo === 'localizacaoEmpresa' && e.ativo) && (
                                <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'localizacaoEmpresa')?.mensagem}/>
                              )}
                        </div>
                      </div>
                      <div className='col-12 col-md-12'>
                        <div>
                        <PatternFormat 
                            format="(##) #####-####"
                            mask="_"
                            customInput={Input} 
                            value={usuario?.telEmpresa}           
                            dica='Digite o telefone de sua empresa'
                            onValueChange={(values) => {setUsuario({...usuario!, telEmpresa:values.value});}}
                            obrigatorio
                            name='telefoneEmpresa'
                            cabecalho
                            cabecalhoTexto='Telefone da Empresa'
                            type="tel"
                          />
                          {erros.find((e) => e.tipo === 'telefoneEmpresa' && e.ativo) && (
                            <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'telefoneEmpresa')?.mensagem}/>
                          )}
                        </div>
                    </div>
                  </div>

                    

                </Modal>
                :
                ''
              }
      </div> : ''}

  {/* pagina prestador */}
      { isPrestador ? <div className='perfil'>
          <div className="perfil--titulo-botao">
            <h1 className='layout-titulo'>Perfil</h1>
            {
              tipoUsuario.prestador && tipoUsuario.organizador ?
              ''
              :
              <div className="perfil--botao-notificacao-prestador" onClick={() => {setModalCompletarCadastro(!modalCompletarCadastro)}}>
                <i className="fa-regular fa-bell"></i>
              </div>

            }
        </div>
        
            <div className='caixa-perfil'>
              <div className='formulario-perfil-prestador'>
                <div className='perfil-foto-nome-email-organizador'>
                  <div className='foto-perfil'> 
                    {preView ? 
                      <img className='imagem-perfil' src={preView} alt="Imagem de perfil" />
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
                        <circle cx="38" cy="38" r="37.5" fill="#D9D9D9" stroke="#D9D9D9"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M62.1304 66.2249C55.6243 71.6988 47.201 75.0006 37.9999 75.0006C28.7988 75.0006 20.3755 71.6988 13.8695 66.2249C17.1125 59.0364 24.3242 54.0373 32.7038 54.0373H43.2961C51.6756 54.0373 58.8874 59.0364 62.1304 66.2249ZM48.489 44.0988C45.7072 46.8894 41.9341 48.4572 37.9999 48.4572C34.0658 48.4572 30.2927 46.8894 27.5108 44.0988C24.729 41.3082 23.1661 37.5233 23.1661 33.5767C23.1661 29.6302 24.729 25.8453 27.5108 23.0547C30.2927 20.264 34.0658 18.6963 37.9999 18.6963C41.9341 18.6963 45.7072 20.264 48.489 23.0547C51.2709 25.8453 52.8338 29.6302 52.8338 33.5767C52.8338 37.5233 51.2709 41.3082 48.489 44.0988Z" fill="white"/>
                      </svg>}
                      <input 
                        type='file' 
                        className='cadastro-evento__input_imagem'
                        accept='image/*'
                        ref={ inputImagemref }
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          if (e.target.files && e.target.files.length > 0 && e.target.files[0]) {
                            setPreview(URL.createObjectURL(e.target.files[0]))
                            alterarImagemPerfil(e.target.files[0])
                          }
                        }}
                      />
                    <div className='nome-email-organizador'>
                      <h2 className='nome-perfil-organizador'>{nomeEmpresaExibido}</h2>
                      <h2 className='email-perfil-organizador'>{usuario?.emailUsu}</h2>
                    </div>
                  </div>
                  <div className='botoes-foto-perfil'>
                    <div className='botao-alterar-foto-perfil'>
                      <Botao 
                        tamanho='med' 
                        texto='Alterar foto' 
                        funcao={()=>{inputImagemref.current?.click()}}
                        cor='var(--yellow-700)'
                      />       
                    </div>
                    <div className='botao-remover-foto-perfil'>
                      <Botao 
                        tamanho='med' 
                        texto='Remover foto' 
                        funcao={()=>{setModalExcluirFoto(true)}}
                        cor='var(--yellow-700)'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='caixa-input-perfil-prestador'>
              <div className='informacoes-pessoais-perfil-organizador'>
                <p className='texto-informacoes-empresa'>Informações da Empresa</p>
              </div>
              <div className='row g-4'>
                <div className='col-12 col-md-6'>
                  <div>
                    <Input 
                      value={usuario?.nomeEmpresa}              
                      dica='Digite o nome de sua empresa'
                      obrigatorio
                      name='nome empresa'
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, nomeEmpresa: event.target.value})}
                      cabecalho
                      cabecalhoTexto='Nome da empresa'
                      disabled={!modoEdicao}
                      cor="var(--yellow-700)"
                    />
                  </div>
                  {erros.find((e) => e.tipo === 'NomeEmpresa' && e.ativo) && (
                      <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'NomeEmpresa')?.mensagem}/>
                    )}
                </div>
                <div className='col-12 col-md-6'>
                <div>
                    <PatternFormat 
                      format="##.###.###/####-##"
                      mask="_"
                      value={usuario?.cnpjEmpresa}
                      customInput={Input}
                      onValueChange={(values) => {setUsuario({...usuario!, cnpjEmpresa:values.value})}}
                      dica='Digite seu CNPJ'
                      obrigatorio
                      name='cnpj'
                      cabecalho 
                      cabecalhoTexto='CNPJ'
                      disabled={!modoEdicao}
                      cor="var(--yellow-700)"
                    />
                    {erros.find((e) => e.tipo === 'CNPJ' && e.ativo) && (
                      <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'CNPJ')?.mensagem}/>
                    )}
                  </div>

                </div>
                <div className='col-12 col-md-12'>
                <div>
                    <Input
                      value={usuario?.localizacaoEmpresa}                      
                      dica='Digite a Localização da sua empresa'
                      obrigatorio
                      name='localizacao'
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, localizacaoEmpresa: event.target.value})}
                      cabecalho
                      cabecalhoTexto='Localização'
                      disabled={!modoEdicao}
                      cor="var(--yellow-700)"/>
                  </div>
                  {erros.find((e) => e.tipo === 'localizacaoEmpresa' && e.ativo) && (
                    <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'localizacaoEmpresa')?.mensagem}/>
                  )}
                </div>
            </div>
          </div>

          <div className='caixa-input-perfil-prestador'>
            <div className='informacoes-pessoais-perfil-organizador'>
              <p className='texto-informacoes-empresa'>Contato</p>
            </div>
            <div className='row g-4'>
              <div className='col-12 col-md-6'>
                <div>
                  <Input  
                    value={usuario?.emailUsu}                
                    dica='Digite seu email'
                    obrigatorio
                    name='email'
                    cabecalho
                    cabecalhoTexto='Email'
                    autoComplete='email'
                    disabled
                    cor="var(--yellow-700)"
                  />
                </div>
              </div>
              <div className='col-12 col-md-6'>
                <div>
                  <PatternFormat 
                    format="(##) #####-####"
                    mask="_"
                    customInput={Input} 
                    value={usuario?.telEmpresa}           
                    dica='Digite o telefone da sua empresa'
                    onValueChange={(values) => {setUsuario({...usuario!, telEmpresa:values.value});}}
                    obrigatorio
                    name='telefone empresa'
                    cabecalho
                    cabecalhoTexto='Telefone da Empresa'
                    disabled={!modoEdicao}
                    type="tel"
                    cor="var(--yellow-700)"
                  />
                  {erros.find((e) => e.tipo === 'telefoneEmpresa' && e.ativo) && (
                    <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'telefoneEmpresa')?.mensagem}/>
                  )}
                </div>
              </div>
            </div>
          </div>

          {modoEdicao ? 
            (
              <motion.div key="modoEdicao" {...transicao} className='perfil-modo-edicao'>
                <div className='caixa-input-perfil-prestador'>
                  <div className='informacoes-pessoais-perfil-organizador'>
                    <p className='texto-informacoes-empresa'>Segurança</p>
                  </div>
                  <div className='row g-4'>
                    <div className='col-12'>
                      <div>
                        <Input 
                          tipo={senhaAtualOculta ? 'password' : 'text'}
                          dica='Digite sua senha atual'
                          cabecalho 
                          cabecalhoTexto='Senha atual' 
                          name='senha-atual'
                          value={senhaAtual}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => setSenhaAtual(event.target.value)}
                          icone={
                            senhaAtual !== '' ? 
                              `fa-solid ${senhaAtualOculta ? 'fa-eye-slash' : 'fa-eye'}` 
                            : ''
                          }
                          funcaoIcone={() => setSenhaAtualOculta(!senhaAtualOculta)}
                          cor="var(--yellow-700)"
                        />
                      </div>
                    </div>
                      <div className='col-12 col-md-6'>
                        <div>
                          <Input
                            tipo={novaSenhaOculta ? 'password' : 'text'}           
                            dica='Digite sua nova senha'
                            obrigatorio
                            name='nova-senha'
                            value={novaSenha}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setNovaSenha(event.target.value)}
                            cabecalho
                            cabecalhoTexto='Nova senha'
                            icone={
                              novaSenha !== '' ? 
                                `fa-solid ${novaSenhaOculta ? 'fa-eye-slash' : 'fa-eye'}` 
                              : ''
                            }
                            funcaoIcone={() => setNovaSenhaOculta(!novaSenhaOculta)}
                            cor="var(--yellow-700)"
                          />
                        </div>
                      </div>
                      <div className='col-12 col-md-6'>
                        <div>
                          <Input   
                            tipo={confirmarSenhaOculta ? 'password' : 'text'}                 
                            dica='Confirme sua nova senha'
                            obrigatorio
                            name='Confirme'
                            value={confirmarSenha}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmarSenha(event.target.value)}
                            cabecalho
                            cabecalhoTexto='Confirme sua nova senha'
                            icone={
                              confirmarSenha !== '' ? 
                                `fa-solid ${confirmarSenhaOculta ? 'fa-eye-slash' : 'fa-eye'}` 
                              : ''
                            }
                            funcaoIcone={() => setConfirmarSenhaOculta(!confirmarSenhaOculta)}
                            cor="var(--yellow-700)"
                          />
                        </div>
                      </div>
                  
                    {erros.find((e) => e.tipo === 'confirmar-senha' && e.ativo) && (
                      <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'confirmar-senha')?.mensagem}/>
                    )}
                </div>
              </div>
              <div className='botoes-alterar-perfil-edicao'>
                <div className='botao-editar'>
                  <Botao 
                    tamanho='max' 
                    funcao={() => {
                      setModoEdicao(false);
                      api.get<Usuario>(`/users/get-user`)
                      .then(response => {
                        setUsuario(response.data);
                      })
                      .catch(error => {
                        console.error('Erro ao obter usuário', error);
                      });   
                      setErros(erros => erros.map(erro => {
                        erro.ativo = false;
                        return erro;
                      }));
                      setSenhaAtual('');
                      setNovaSenha('');
                      setConfirmarSenha('');
                      setSenhaAtualOculta(true);
                      setNovaSenhaOculta(true);
                      setConfirmarSenhaOculta(true);
                    }} 
                    texto='Cancelar' 
                    cor='var(--yellow-700)'
                  />
                </div>
                <div className='botao-editar'>
                  <Botao tamanho='max' funcao={editarPerfil} texto='Salvar' cor='var(--yellow-700)' />
                </div>
              </div>
              </motion.div>
                ) 
                : 
                (
                  <motion.div key="foraModoEdicao" {...transicao} className='perfil-fora-modo-edicao'>
                    <div className='caixa-input-perfil-prestador'>
                      <div className='informacoes-pessoais-perfil-organizador'>
                        <p className='texto-informacoes-empresa'>Segurança</p>
                      </div>
                      <div>
                        <Input 
                          cabecalho 
                          cabecalhoTexto='Senha atual' 
                          disabled={true}
                          dica="••••••••••"
                          name='senha-atual-desabilitado'
                        />
                      </div>
                  </div>
                  <div className='botoes-alterar-perfil'>
                    <div className='botao-editar'>
                      <Botao tamanho='max' funcao={() => setModoEdicao(true)} texto='Editar' cor='var(--yellow-700)' />
                    </div>
                    <div className='botao-deletar'>
                      <Botao tamanho='max' funcao={() => setExcluir(true)} texto='Excluir conta' cor='var(--yellow-700)' />
                    </div>
                    {excluir ? 
                      <Modal titulo="Excluir conta" enviaModal={setarExcluir} textoBotao="Excluir" funcaoSalvar={deletarPerfil}> Tem certeza que deseja excluir sua conta? </Modal>
                    : ""}
                  </div>
                </motion.div>  
              )}
              {
                modalExcluirFoto ?
                <Modal titulo="Excluir foto" prestador enviaModal={setModalExcluirFoto} textoBotao="Excluir" funcaoSalvar={()=>{
                            URL.revokeObjectURL(preView)
                            setPreview('')
                            if(inputImagemref.current)
                              inputImagemref.current.value = ""
                            alterarImagemPerfil(null)
                            }}> Tem certeza que deseja excluir sua foto? </Modal>
                : ''
              }
                  {
                modalCompletarCadastro ?
                <Modal titulo='Completar Cadastro' enviaModal={() => {setModalCompletarCadastro(!modalCompletarCadastro)}} textoBotao="Continuar" funcaoSalvar={continuarCompletaCadastro}>
                  <div className="completar-cadastro--imagem">
                    <img className='completar-cadastro--imagem--tamanho'src={logoOrganizador} alt="Imagem de completar cadastro" />
                  </div>
                  <div className="completar-cadastro--titulo">
                    <div className="completar-cadastro-prestador--titulo-texto">
                      Pronto para organizar seu próprio evento?
                    </div>
                    <div className="completar-cadastro--descricao">
                      Que tal realizar seus próprios eventos? Como um organizador torne essa experiência algo possível.
                    </div>
                  </div>
                  <div className="completar-cadastro--texto">
                  {
                    `Ao ativar o perfil de organizador de eventos, você poderá:

                    Gerenciar seus próprios eventos;
                    Enviar convites e gerenciar sua lista de convidados;
                    Contratar prestadores de forma rápida e segura diretamente pelo app;
                    Acompanhar os pedidos feitos;
                    Centralizar toda a organização em um só lugar.

                    Tudo isso com o mesmo login e sem custos extras. Falta só completar seu cadastro para começar!`
                  }
                  </div>
                </Modal>
                :
                ''
              }
              {
                modalCompletarCadastroDados ?
                <Modal titulo='Completar Cadastro' funcaoSalvar={completarCadastro} enviaModal={() => {setModalCompletarCadastroDados(false)}} textoBotao="Salvar">
                  <div className='modal-completar-cadastro--texto'>
                    <div>Para alterar seu tipo de usuário é necessário completar seu cadastro!</div>
                  </div>
                  <div className="modal-completar-cadastro--campos">
                    <div className="modal-completar-cadastro--nome-cnpj">
                        <div className='col-12 col-md-6'>
                          <Input 
                                  value={usuario?.nomeUsu}              
                                  dica='Digite seu nome'
                                  obrigatorio
                                  name='nome'
                                  onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, nomeUsu: event.target.value})}
                                  cabecalho
                                  cabecalhoTexto='Nome'
                          />
                          {erros.find((e) => e.tipo === 'nome' && e.ativo) && (
                            <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'nome')?.mensagem}/>
                          )}
                        </div>
                        <div className='col-12 col-md-5'>
                          <Input
                                value={usuario?.sobrenomeUsu}                      
                                dica='Digite seu sobrenome'
                                obrigatorio
                                name='sobrenome'
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, sobrenomeUsu: event.target.value})}
                                cabecalho
                                cabecalhoTexto='Sobrenome'/>
                          {erros.find((e) => e.tipo === 'sobrenome' && e.ativo) && (
                            <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'sobrenome')?.mensagem}/>
                          )}
                        </div>
                    </div>
                    <div className="modal-completar-cadastro--nome-cnpj">

                        <div className='col-12 col-md-6'>
                          <div>
                            <PatternFormat 
                                  format="###.###.###-##"
                                  mask="_"
                                  value={usuario?.cpfUsu}
                                  customInput={Input}
                                  onValueChange={(values) => {setUsuario({...usuario!, cpfUsu:values.value})}}
                                  dica='Digite seu CPF'
                                  obrigatorio
                                  name='cpf'
                                  cabecalho 
                                  cabecalhoTexto='CPF'
                                />  
                            {erros.find((e) => e.tipo === 'cpf' && e.ativo) && (
                              <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'cpf')?.mensagem}/>
                            )}
                          </div>
                        </div>
                        <div className='col-12 col-md-5'>
                          <div>
                            <Input 
                                  value={usuario?.dtNasUsu}
                                  dica='Digite sua data de nascimento'
                                  obrigatorio
                                  name='dataNascimento'
                                  onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, dtNasUsu: event.target.value})}
                                  cabecalho
                                  cabecalhoTexto='Data de Nascimento'
                                  type="date"/>
                            {erros.find((e) => e.tipo === 'dataNascimento' && e.ativo) && (
                              <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'dataNascimento')?.mensagem}/>
                            )}
                          </div>
                      </div>
                    </div>
                    <div className='col-12 col-md-12'>
                      <div>
                        <PatternFormat 
                          format="(##) #####-####"
                          mask="_"
                          customInput={Input} 
                          value={usuario?.telUsu}           
                          dica='Digite seu telefone'
                          onValueChange={(values) => {setUsuario({...usuario!, telUsu:values.value});}}
                          obrigatorio
                          name='telefone'
                          cabecalho
                          cabecalhoTexto='Telefone'
                          type="tel"
                          />
                          {erros.find((e) => e.tipo === 'telefone' && e.ativo) && (
                            <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'telefone')?.mensagem}/>
                          )}
                        </div>
                      </div>
                  </div>

                    

                </Modal>
                :
                ''
              }
      </div> 
      : ''
      }

    </div>
  </>
  )
}

export default MeuPerfil


