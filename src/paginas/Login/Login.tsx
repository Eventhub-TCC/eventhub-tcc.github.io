import axios from 'axios'
import { ChangeEvent, FormEvent, useState } from 'react'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import CheckBox from '../../componentes/CheckBox/CheckBox'
import './Login.css'
import Formulario from '../../componentes/Formulario/Formulario'
import { Link, useNavigate } from 'react-router'
import Alerta from '../../componentes/Alerta/Alerta'
import ErroCampoForm from '../../componentes/ErroCampoForm/ErroCampoForm'

const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ senha, setSenha ] = useState('');
  const [ senhaOculta, setSenhaOculta ] = useState(true);
  const [ lembrar, setLembrar ] = useState(false);
  const [ carregando, setCarregando ] = useState(false);
  const [ erros, setErros ] = useState({emailSenha: false, conexao: false});
  const navigate = useNavigate();

  const logar = async (event: FormEvent<HTMLFormElement>, email:string, senha:string)=>{
    try{
      event.preventDefault();
      if(erros.emailSenha || erros.conexao) return;
      setCarregando(true);
      const { data } = await axios.post('http://localhost:3000/users/signin', {
        email,
        senha
      })
      console.log(`Usuário autenticado! Token: ${data.token}`)
      localStorage.setItem('token', data.token);
      navigate('/meu-perfil');
    }
    catch(erro: any){
      if(erro.code === 'ERR_NETWORK'){
        setErros({...erros, conexao: true});
        setTimeout(() => setErros({...erros, conexao: false}), 10000);
      }
      else{
        setErros({...erros, emailSenha: true});
      }
    }
    finally{
      setCarregando(false);
    }
  }

  return (
    <Formulario onSubmit={(event: FormEvent<HTMLFormElement>) => logar(event, email, senha)} titulo='Login'>
      <div className='Conteudo'>
        <div className='Inputs'>
          <Input 
            name='email'
            autoComplete='email'
            cabecalho={true}
            cabecalhoTexto='Email'
            dica='Digite seu e-mail' 
            tipo='email' 
            onChange={(event:ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value)
              setErros({...erros, emailSenha: false});
            }}>
          </Input>
            <Input 
              name='senha'
              cabecalho={true}
              cabecalhoTexto='Senha'
              dica='Digite sua senha' tipo={senhaOculta ? 'password' : 'text'} 
              onChange={(event:ChangeEvent<HTMLInputElement>) => {
                setSenha(event.target.value);
                setErros({...erros, emailSenha: false});
              }}
              icone={senha.length ?`fa-solid ${senhaOculta ? 'fa-eye-slash' : 'fa-eye'}` : '' } 
              funcaoIcone={() => setSenhaOculta(!senhaOculta)} 
            />
        </div>
        <div className='Opcoes'> 
          <CheckBox
            name='lembrar'
            checked={senhaOculta} 
            funcao={() => setLembrar(!lembrar)} 
            texto='Lembrar-me'></CheckBox>
          <Link className='links' to='/esqueci-senha'>Esqueceu a senha?</Link>
        </div>
        {
          erros.emailSenha &&
          <ErroCampoForm mensagem='E-mail ou senha inválidos'/>
        }
      </div>
      <div className="Botoes">
        <div className="Botao">
          <Botao 
            tamanho='max'
            texto={
              carregando ? 
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
              : 'Entrar'
            }
            submit></Botao>
        </div>
        <div>
          <span className='texto'>Não possui uma conta? <Link className='links' to='/cadastro'>Cadastre-se</Link></span>
        </div>
      </div>
      {
        erros.conexao &&
        <div className='login__alerta'>
          <Alerta texto="Ocorreu um erro interno. Tente novamente mais tarde." status="erro" ativado={true}/>
        </div>
      }
    </Formulario>
  )
}

export default Login;