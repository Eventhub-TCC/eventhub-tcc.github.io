import React from 'react'
import './InputRadio'

interface InputRadioProps{
    nome: string;
    textoLabel: string;
    id: string;
    funcao: (...args:any) => void
}

const InputRadio = (props:InputRadioProps) => {
  return (
    <label htmlFor={props.id}>
        <input className='radio' type="radio" name={props.nome} id={props.id} onChange={props.funcao}/> {props.textoLabel}
    </label>
    
  )
}

export default InputRadio