import React from 'react'
import './Input.css'

interface InputProps{
    dica: string;
    tipo: 'text' | 'number' | 'email' | 'password';
    obrigatorio: boolean;
}

const Input = (props: InputProps) => {
  return (
    <input type={props.tipo}
      className='input' 
      placeholder={props.dica}
      required={props.obrigatorio}
    />
  )
}

Input.defaultProps = {
    tipo:'text',
    obrigatorio: true
}

export default Input
