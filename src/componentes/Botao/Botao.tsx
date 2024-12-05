import React from 'react'
import './Botao.css'

interface BotaoProps {
    texto: string;
    cor: string & {};
    tamanho: 'min' | 'med' | 'max';
    funcao: (...args:any[])=>void;
}



const Botao = (props:BotaoProps) => {
  return (
    <button 
    className={`botao ${props.tamanho}`}
    style={{'--cor-principal': props.cor} as React.CSSProperties}
    onClick={props.funcao}
    >
        {props.texto}
    </button>
  )
}

Botao.defaultProps = {
    tamanho: 'med',
    cor: 'var(--purple-700)'
}

export default Botao