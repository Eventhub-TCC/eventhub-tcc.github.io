import React from 'react'
import './Botao.css'

const Botao = ({tamanho = 'med', cor = 'var(--purple-700)', funcao, texto,submit=false,vazado=false, desabilitado = false}: any) => {
  return (
    <button 
      className={`botao ${tamanho} ${vazado ? 'botao--vazado' : 'botao--solido'}`}
      style={{'--cor-principal': cor} as React.CSSProperties}
      onClick={funcao}
      type={submit ? "submit" : 'button'}
      disabled={desabilitado}
    >
      {texto}
    </button>
  )
}

export default Botao