import React from 'react'
import './InputRadio'

interface InputRadioProps{
    nome: string;
    textoLabel: string;
    id: string;
}

const InputRadio = (props:InputRadioProps) => {
  return (
    <label htmlFor={props.id}>
        <input className='radio' type="radio" name={props.nome} id={props.id}/> {props.textoLabel}
    </label>
    
  )
}

export default InputRadio