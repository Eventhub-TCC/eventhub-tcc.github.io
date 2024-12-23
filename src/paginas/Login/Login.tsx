import axios from 'axios'
import { ChangeEvent, FormEvent, useState } from 'react'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import './Login.css'

const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ senha, setSenha ] = useState('');
  const [ senhaOculta, setSenhaOculta ] = useState(true);

  const logar = async (event: FormEvent<HTMLFormElement>, email:string, senha:string)=>{
    try{
      event.preventDefault()
      const { data } = await axios.post('http://localhost:3000/users/signin', {
        email,
        senha
      })
      console.log(`Usuário autenticado! Token: ${data.token}`)
    }
    catch(erro){
      console.log('Usuário ou senha inválido')
    }
  }

  return (
    <div className="container-fundo">
      <div className='container container-login'>
        <form className='form'>
          <h1 className='titulo-login'>Login</h1>
          <div>
            <Input 
              dica='Insira seu email' 
              tipo='email' 
              onChange={(event:ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} 
            />
          </div>
          <div>
            <Input 
              dica='Insira sua senha' tipo={senhaOculta ? 'password' : 'text'} 
              onChange={(event:ChangeEvent<HTMLInputElement>) => setSenha(event.target.value)} 
              icone={`fa-solid ${senhaOculta ? 'fa-eye-slash' : 'fa-eye'}`} 
              funcaoIcone={() => setSenhaOculta(!senhaOculta)} 
            />
          </div>
          <div>
            <Botao 
              texto='Entrar' 
              tamanho='med' 
              funcao={(e: FormEvent<HTMLFormElement>)=>logar(e, email, senha)}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
