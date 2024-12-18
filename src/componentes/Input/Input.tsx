import './Input.css'

const Input = ({tipo = 'text', dica, obrigatorio = true, onChange, icone = null, posicaoIcone = 'sem-icone', funcaoIcone = null}: any) => {
  return (
    <div className="container-input">
      <input type={tipo}
        className={`input ${!icone && posicaoIcone === 'sem-icone' ? 'input-padding-sem-icone' : (icone && posicaoIcone === 'sem-icone') || posicaoIcone === 'direita' ? 'input-padding-direita' : 'input-padding-esquerda'}`} 
        placeholder={dica}
        required={obrigatorio}
        onChange={onChange}
        name='input'
      />
      {
        !icone && posicaoIcone === 'sem-icone' ?
          ''
        :
          !funcaoIcone ?
            <i className={`${icone} icone-input ${(icone && posicaoIcone === 'sem-icone') || posicaoIcone === 'direita' ? `icone-input-direita` : `icone-input-esquerda`}`}></i>
          :
            <button type='button' className={`icone-botao icone-input-botao ${(icone && posicaoIcone === 'sem-icone') || posicaoIcone === 'direita' ? `icone-input-botao-direita` : `icone-input-botao-esquerda`}`} onClick={funcaoIcone}>
              <i className={`${icone}`}></i>
            </button>
      }
    </div>
  )
}

export default Input
