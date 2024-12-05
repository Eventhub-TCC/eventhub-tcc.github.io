import React, { ChangeEvent, Component } from 'react'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import InputRadio from '../../componentes/InputRadio/InputRadio'
import './Login.css'
// import axios from 'axios'

interface State{
  tipoUsuario: 'organizador' | 'prestador'| ''
  email: string
  senha: string
}

export default class Login extends Component {
  
  state:State={
    tipoUsuario:'',
    email:'',
    senha:''
  }

  teste = (texto:string)=>{
    alert(texto)
  }

  onEmailAlterado = (event:ChangeEvent<HTMLInputElement>)=>{
    this.setState({email:event.target.value})
  }

  onSenhaAlterada = (event:ChangeEvent<HTMLInputElement>)=>{
    this.setState({senha:event.target.value})
  }

  logar = (event:Event, email:string,senha:string)=>{
    event.preventDefault()
    if(this.state.tipoUsuario === ''){
      alert('Selecione um tipo de usuario para logar.')
    }
    else if(this.state.tipoUsuario === 'organizador'){
      alert(email + ' logando como organizador')
    }
    else if(this.state.tipoUsuario === 'prestador'){
      alert(email + ' logando como prestador')
    }
  }

  render() {
    return (
      <div className="container-fundo">
        <div className='container container-login'>
        <form className='form'>
          <h1 className='titulo-login'>Login</h1>
          <div className='container-radio'>
            <p>Logar como:</p>
            <InputRadio id='organizador-radio' nome='login' textoLabel='Organizador' funcao={()=>this.setState({tipoUsuario:'organizador'})}/>
            <InputRadio id='prestador-radio' nome='login' textoLabel='Prestador' funcao={()=>this.setState({tipoUsuario:'prestador'})}/>
          </div>
          <div></div>
          <div>
            <Input dica='Insira seu email' tipo='email' onChange={this.onEmailAlterado}/>
          </div>
          <div>
            <Input dica='Insira sua senha' tipo='password' onChange={this.onSenhaAlterada}/>
          </div>
          <div>
            <Botao  texto='Entrar' tamanho='med' funcao={(e)=>this.logar(e,this.state.email,this.state.senha)}/>
          </div>
        </form>
      </div>
      </div>
      
    )
  }
}
