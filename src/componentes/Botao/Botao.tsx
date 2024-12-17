import React from 'react'
import './Botao.css'

const Botao = ({tamanho, cor, funcao, texto}: any) => {
  return (
    <button 
      className={`botao ${tamanho}`}
      style={{'--cor-principal': cor} as React.CSSProperties}
      onClick={funcao}
    >
      {texto}
    </button>
  )
}

Botao.defaultProps = {
    tamanho: 'med',
    cor: 'var(--purple-700)'
}

export default Botao