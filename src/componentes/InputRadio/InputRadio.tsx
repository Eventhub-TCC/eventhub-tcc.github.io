import './InputRadio.css'

const InputRadio = ({nome, textoLabel, id, funcao, value}: any) => {
  return (
    <label htmlFor={id} className='label_radio'>
      <input className='radio' type="radio" name={nome} id={id} onChange={funcao} value={value}/> {textoLabel}
      <span className='radio_span'></span>
    </label>
  )
}

export default InputRadio