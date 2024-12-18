import { ChangeEvent, FormEvent, useState } from 'react'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import InputRadio from '../../componentes/InputRadio/InputRadio'
import './Login.css'
// import axios from 'axios'

const Login = () => {
  const [ tipoUsuario, setTipoUsuario ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ senha, setSenha ] = useState('');
  const [ senhaOculta, setSenhaOculta ] = useState(true);

  const onEmailAlterado = (event:ChangeEvent<HTMLInputElement>)=>{
    setEmail(event.target.value)
  }

  const onSenhaAlterada = (event:ChangeEvent<HTMLInputElement>)=>{
    setSenha(event.target.value)
  }

  const mostrarSenha = () => {
    setSenhaOculta(!senhaOculta)
  }

  const logar = (event: FormEvent<HTMLFormElement>, email:string, senha:string)=>{
    event.preventDefault()
    if(tipoUsuario === ''){
      alert('Selecione um tipo de usuario para logar.')
    }
    else if(tipoUsuario === 'organizador'){
      alert(email + ' logando como organizador')
    }
    else if(tipoUsuario === 'prestador'){
      alert(email + ' logando como prestador')
    }
  }

  return (
    <div className="container-fundo">
      <div className='container container-login'>
        <form className='form'>
          <h1 className='titulo-login'>Login</h1>
          <div className='container-radio'>
            <p>Logar como:</p>
            <InputRadio id='organizador-radio' nome='login' textoLabel='Organizador' funcao={()=>setTipoUsuario("organizador")}/>
            <InputRadio id='prestador-radio' nome='login' textoLabel='Prestador' funcao={()=>setTipoUsuario("prestador")}/>
          </div>
          <div>
            <Input dica='Insira seu email' tipo='email' onChange={onEmailAlterado} icone="fa fa-search" />
          </div>
          <div>
            <Input dica='Insira sua senha' tipo={senhaOculta ? 'password' : 'text'} onChange={onSenhaAlterada} icone={`fa-solid ${senhaOculta ? 'fa-eye-slash' : 'fa-eye'}`} funcaoIcone={mostrarSenha} />
          </div>
          <div>
            <Botao  texto='Entrar' tamanho='med' funcao={(e: FormEvent<HTMLFormElement>)=>logar(e, email, senha)}/>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
