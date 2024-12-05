import React, { Component } from 'react'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import InputRadio from '../../componentes/InputRadio/InputRadio'

export default class Login extends Component {
  teste = (texto:string)=>{
    alert(texto)
  }
  render() {
    return (
      <div>
        <div>
        <Input dica='insira seu email' tipo='email'/>
        </div>
        <div>
        <Input dica='insira sua senha' tipo='password'/>
        </div>
        <div>
          <Botao texto='entrar' cor='green' tamanho='med' funcao={()=>this.teste('testado!')}/>
        </div>
        <div>
          <p>logar como:</p>
          <InputRadio id='organizador-radio' nome='login' textoLabel='organizador'/>
          <InputRadio id='prestador-radio' nome='login' textoLabel='prestador'/>
        </div>
      </div>
    )
  }
}
