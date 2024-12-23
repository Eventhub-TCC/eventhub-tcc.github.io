import React from 'react'
import './Botao.css'

const Botao = ({tamanho = 'med', cor = 'var(--purple-700)', funcao, texto,submit=false}: any) => {
  return (
    <button 
      className={`botao ${tamanho}`}
      style={{'--cor-principal': cor} as React.CSSProperties}
      onClick={funcao}
      type={submit ? "submit" : 'button'}
    >
      {texto}
    </button>
  )
}

export default Botao