import axios from 'axios'
import { ChangeEvent, FormEvent, useState } from 'react'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import CheckBox from '../../componentes/CheckBox/CheckBox'
import './Login.css'
import Formulario from '../../componentes/Formulario/Formulario'
import { useNavigate } from 'react-router'

const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ senha, setSenha ] = useState('');
  const [ senhaOculta, setSenhaOculta ] = useState(true);
  const [ lembrar, setLembrar ] = useState(false);
  const navigate = useNavigate();



  const logar = async (event: FormEvent<HTMLFormElement>, email:string, senha:string)=>{
    try{
      event.preventDefault()
      console.log('Logando...')
      const { data } = await axios.post('http://localhost:3000/users/signin', {
        email,
        senha
      })
      console.log(`Usuário autenticado! Token: ${data.token}`)
      localStorage.setItem('token', data.token);
      navigate('/');
    }
    catch(erro){
      console.log('Usuário ou senha inválido')
    }
  }

  return (
    <div className="container-fundo">
      <div className='container container-login'>
        <Formulario titulo='Login'>
          <div className='Conteudo'>
            <div className='Inputs'>
              <Input 
                cabecalho={true}
                cabecalhoTexto='Email'
                dica='Digite seu e-mail' 
                tipo='email' 
                onChange={(event:ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}></Input>
                <Input 
                  cabecalho={true}
                  cabecalhoTexto='Senha'
                  dica='Digite sua senha' tipo={senhaOculta ? 'password' : 'text'} 
                  onChange={(event:ChangeEvent<HTMLInputElement>) => setSenha(event.target.value)} 
                  icone={`fa-solid ${senhaOculta ? 'fa-eye-slash' : 'fa-eye'}`} 
                  funcaoIcone={() => setSenhaOculta(!senhaOculta)} 
                />
            </div>
            <div className='Opcoes'> 
              <CheckBox 
                checked={senhaOculta} 
                funcao={() => setLembrar(!lembrar)} 
                texto='Lembrar-me'></CheckBox>
              <a className='links' href=''>Esqueceu a senha?</a>
            </div>
          </div>
          <div className="Botoes">
            <div className="Botao">
              <Botao 
                tamanho='max'
                texto='Entrar' 
                funcao={(event: FormEvent<HTMLFormElement>) => logar(event, email, senha)}></Botao>
            </div>
            <div>
              <span>Não possui uma conta? <a className='links' href='/cadastro'>Cadastre-se</a></span>
            </div>
          </div>
        </Formulario>
      </div>
    </div>
  )
}

export default Login;
