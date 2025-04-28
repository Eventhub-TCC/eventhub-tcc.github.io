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
import { useNavigate } from 'react-router'

interface Usuario { 
  nomeUsu: string;
  sobrenomeUsu: string;
  cpfUsu: string;
  dtNasUsu: string;
  emailUsu: string;
  telUsu: string;
  senhaUsu: string;
  fotoUsu: string | null;
}

interface Erro{
  ativo: boolean;
  tipo: string;
  mensagem: string;
}

const MeuPerfil = () => {
  const [usuario, setUsuario] = useState<Usuario | null> (null);
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);
  const [senhaAtual, setSenhaAtual] = useState<string>('');
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [excluir, setExcluir] = useState<boolean>(false);
  const [cpfOriginal, setCpfOriginal] = useState<string>('');
  const [ erros, setErros ] = useState<Erro[]>([
  {ativo: false, tipo: 'confirmar-senha', mensagem: 'A confirmação da senha não confere'},
  {ativo: false, tipo: 'cpf', mensagem: 'CPF inválido'},
  {ativo: false, tipo: 'nome', mensagem: 'Preencha o Nome'},
  {ativo: false, tipo: 'sobrenome', mensagem: 'Preencha o Sobrenome'},
  {ativo: false, tipo: 'dataNascimento', mensagem: 'Preencha a Data de Nascimento'},
  {ativo: false, tipo: 'telefone', mensagem: 'Telefone Invalido'},
]);

const navigate = useNavigate();
const [imagemPerfil, setImagemPerfil] = useState<File|null>(null)
const [preView, setPreview] = useState('')
const inputImagemref = useRef<HTMLInputElement>(null)

const transicao = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

useEffect(() => {
  const obterUsuario = async () => {
    try {
      const response = await api.get<Usuario>(`/users/get-user`);
      setUsuario(response.data);
      setCpfOriginal(response.data.cpfUsu);
      setPreview(response.data.fotoUsu ? `http://localhost:3000/files/${response.data.fotoUsu}` : '');
      } catch (error) {
        console.error('Erro ao obter usuário');
        console.error(error);
      }
    }
    obterUsuario();
},[]);

const validarCampos = async (): Promise<boolean> => {
  const novosErros = await Promise.all(erros.map(async (erro) => {
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
          return {
            ...erro,
            ativo: !cpfValido,
          };
        } catch (err: any) {
          if (err.response?.status === 409) {
            return {
              ...erro,
              ativo: true,
              mensagem: ' CPF já cadastrado', 
            };
          }
          return { ...erro, ativo: true, mensagem: 'CPF invalido' };
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
          const telefoneValido = /^\d{11}$/.test(telefone); 
        
          return {
            ...erro,
            ativo: !telefoneValido,
          };
      case 'nome':
        return {
          ...erro,
          ativo: !usuario?.nomeUsu?.trim(),
        };
      case 'sobrenome':
        return {
          ...erro,
          ativo: !usuario?.sobrenomeUsu?.trim(),
        };
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
    await api.put(`/users/update-image`,{
      file: imagem
    }, {
      headers: {
        'content-type': 'multipart/form-data',
  }});
  }
  catch (error) {
    console.error('Erro ao alterar imagem de perfil', error);
  }
}

const editarPerfil = async () => {
    try {
      const valido = await validarCampos();
      console.log('valido', valido);
      if (!valido) return;
      const res = await api.put(`/users/update-user`, {
        ...usuario, 
        senhaAtual, 
        novaSenha, 
        confirmarSenha
      });      
      console.log(res);
      setModoEdicao(false);
      setErros(erros.map(erro => ({ ...erro, ativo: false })));
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

return (
  <div>
      <div className='perfil'>
        <h1 className='layout-titulo'>Perfil</h1>
          <div className='caixa-perfil'>
            <div className='formulario-perfil'>
              <div className='perfil-foto-nome-email-organizador'>
                <div className='foto-perfil'> 
                  {preView ? 
                    <img className='imagem-perfil' src={preView} alt="Imagem de perfil" />
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
                      <circle cx="38" cy="38" r="37.5" fill="#D9D9D9" stroke="#D9D9D9"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M62.1304 66.2249C55.6243 71.6988 47.201 75.0006 37.9999 75.0006C28.7988 75.0006 20.3755 71.6988 13.8695 66.2249C17.1125 59.0364 24.3242 54.0373 32.7038 54.0373H43.2961C51.6756 54.0373 58.8874 59.0364 62.1304 66.2249ZM48.489 44.0988C45.7072 46.8894 41.9341 48.4572 37.9999 48.4572C34.0658 48.4572 30.2927 46.8894 27.5108 44.0988C24.729 41.3082 23.1661 37.5233 23.1661 33.5767C23.1661 29.6302 24.729 25.8453 27.5108 23.0547C30.2927 20.264 34.0658 18.6963 37.9999 18.6963C41.9341 18.6963 45.7072 20.264 48.489 23.0547C51.2709 25.8453 52.8338 29.6302 52.8338 33.5767C52.8338 37.5233 51.2709 41.3082 48.489 44.0988Z" fill="white"/>
                    </svg>}
                    <input 
                      type='file' 
                      className='cadastro-evento__input_imagem'
                      accept='image/*'
                      ref={ inputImagemref }
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setImagemPerfil(e.target.files[0])
                          setPreview(URL.createObjectURL(e.target.files[0]))
                          alterarImagemPerfil(e.target.files[0])
                        }
                        else {
                          setImagemPerfil(null)
                          setPreview('')
                        }
                      }}
                    />
                  <div className='nome-email-organizador'>
                    <h2 className='nome-perfil-organizador'>{usuario?.nomeUsu}</h2>
                      {usuario?.emailUsu}
                  </div>
                </div>
                <div className='botoes-foto-perfil'>
                  <div className='botao-alterar-foto-perfil'>
                    <Botao 
                      tamanho='min' 
                      texto='Alterar foto' 
                      funcao={()=>{inputImagemref.current?.click()
                      }}
                      />       
                  </div>
                <div className='botao-remover-foto-perfil'>
                <Botao 
                  tamanho='min' 
                  texto='Remover' 
                  funcao={()=>{
                  setImagemPerfil(null)
                  URL.revokeObjectURL(preView)
                  setPreview('')
                  if(inputImagemref.current)
                  inputImagemref.current.value = ""
                  alterarImagemPerfil(null)
                  }}
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
            <div className='campos-informacoes-pessoais-perfil-organizador'>
              <div className='alinhamento-campos'>
                <div className='titulo-input-perfil'>
                  <div className='inputs-perfil'>
                    <Input 
                    value={usuario?.nomeUsu}              
                    dica='Digite seu nome'
                    obrigatorio
                    name='nome'
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setUsuario({...usuario!, nomeUsu: event.target.value})}
                    cabecalho
                    cabecalhoTexto='Nome'
                    disabled={!modoEdicao}/>
                  </div>
                  {erros.find((e) => e.tipo === 'nome' && e.ativo) && (
                      <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'nome')?.mensagem}/>
                    )}
                </div>
                <div className='titulo-input-perfil'>
                <div className='inputs-perfil'>
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
            </div>
            <div className='alinhamento-campos'>
              <div className='titulo-input-perfil'>
                <div className='inputs-perfil'>
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
              <div className='titulo-input-perfil'>
                <div className='inputs-perfil'>
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
        </div>

        <div className='caixa-input-perfil'>
          <div className='informacoes-pessoais-perfil-organizador'>
            <p className='texto-informacoes-pessoal'>Contato</p>
          </div>
          <div className='campos-informacoes-pessoais-perfil-organizador'>
            <div className='alinhamento-campos'>
              <div className='titulo-input-perfil'>
                <div className='inputs-perfil'>
                  <Input  
                    value={usuario?.emailUsu}                
                    dica='Digite seu email'
                    obrigatorio
                    name='email'
                    cabecalho
                    cabecalhoTexto='Email'
                    disabled
                  />
                </div>
              </div>
              <div className='titulo-input-perfil'>
                <div className='inputs-perfil'>
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
                    pattern="[0-9]{2}-[0-9]{5}-[0-9]{4}"
                    />
                    {erros.find((e) => e.tipo === 'telefone' && e.ativo) && (
                      <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'telefone')?.mensagem}/>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {modoEdicao ? 
          (
            <motion.div key="modoEdicao" {...transicao} className='perfil-modo-edicao'>
              <div className='caixa-input-perfil'>
                <div className='informacoes-pessoais-perfil-organizador'>
                  <p className='texto-informacoes-pessoal'>Segurança</p>
                </div>
                <div className='campos-informacoes-pessoais-perfil-organizador'>
                  <div className='alinhamento-campos'>
                    <div className='titulo-input-perfil'>
                      <h1 className='texto-input-perfil'>Senha atual</h1>
                      <div className='inputs-perfil'>
                        <Input onChange={(event: ChangeEvent<HTMLInputElement>) => setSenhaAtual(event.target.value)}/>
                      </div>
                    </div>
                  </div>
                  <div className='alinhamento-campos'>
                    <div className='titulo-input-perfil'>
                      <div className='inputs-perfil'>
                       <Input           
                          dica='Digite sua nova senha'
                          obrigatorio
                          name='nova-senha'
                          onChange={(event: ChangeEvent<HTMLInputElement>) => setNovaSenha(event.target.value)}
                          cabecalho
                          cabecalhoTexto='Nova senha'
                        />
                      </div>
                    </div>
                    <div className='titulo-input-perfil'>
                    <div className='inputs-perfil'>
                      <Input                    
                        dica='Confirme sua nova senha'
                        obrigatorio
                        name='Confirme'
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmarSenha(event.target.value)}
                        cabecalho
                        cabecalhoTexto='Confirme sua nova senha'
                      />
                    </div>
                  </div>
                </div>
                {erros.find((e) => e.tipo === 'confirmar-senha' && e.ativo) && (
                      <ErroCampoForm mensagem={erros.find((e) => e.tipo === 'confirmar-senha')?.mensagem}/>
                    )}
              </div>
            </div>
            <div className='botoes-alterar-perfil'>
              <div className='botao-editar'>
                <Botao tamanho='max' funcao={() => {setModoEdicao(false);
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
                                                  }))}} texto='Cancelar' />
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
                    <div className='campos-informacoes-pessoais-perfil-organizador'>
                      <div className='alinhamento-campos'>
                        <div className='titulo-input-perfil'>
                          <h1 className='texto-input-perfil'>Senha atual</h1>
                        <div className='inputs-perfil'>
                          <Input disabled="true" dica='************'/>
                        </div>
                      </div>
                    </div>
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
    </div>
  </div>
  )
}

export default MeuPerfil


