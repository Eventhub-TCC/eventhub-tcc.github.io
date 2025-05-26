import './Input.css'

const Input = ({cabecalho = false, cabecalhoTexto = '' , tipo = 'text', dica, obrigatorio = true, onChange, onBlur, icone = null, posicaoIcone = 'sem-icone', funcaoIcone = null, name, min, max, tamanhoMin, tamanhoMax, autoComplete, valor,cor = 'var(--purple-700)', alinharTexto = 'left', ...props}: any) => {
  return (
    <div>
      <div className={cabecalho === true? 'd-block' : 'd-none'}>
        <label className='label-input' htmlFor={name}>{cabecalhoTexto}</label>
      </div>
      <div className="container-input">
      <input 
        style={{'--cor-principal': cor} as React.CSSProperties}
        type={tipo}
        className={
          `input ${alinharTexto === 'center' ? 'input-centro' : 'input-esquerda'} ${!icone && posicaoIcone === 'sem-icone' ? 
            'input-padding-sem-icone' 
          : (icone && posicaoIcone === 'sem-icone') || posicaoIcone === 'direita' ? 
            'input-padding-direita' : 'input-padding-esquerda'}`
        } 
        placeholder={dica}
        required={obrigatorio}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        id={name}
        min={min}
        max={max}
        minLength={tamanhoMin}
        maxLength={tamanhoMax}
        autoComplete={autoComplete}
        value={valor}
        {...props}
      />
      {
        !icone && posicaoIcone === 'sem-icone' ?
          ''
        :
          !funcaoIcone ?
            <i className={`${icone} icone-input ${(icone && posicaoIcone === 'sem-icone') || posicaoIcone === 'direita' ? `icone-input-direita` : `icone-input-esquerda`}`}></i>
          :
            <button type='button' className={`icone-botao icone-input-botao ${(icone && posicaoIcone === 'sem-icone') || posicaoIcone === 'direita' ? `icone-input-botao-direita` : `icone-input-botao-esquerda`}`} onClick={funcaoIcone}>
              <i className={`${icone} icone-estilo`}></i>
            </button>
      }
    </div>
    </div>
    
  )
}

export default Input
