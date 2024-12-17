import './InputRadio'

const InputRadio = ({nome, textoLabel, id, funcao}: any) => {
  return (
    <label htmlFor={id}>
      <input className='radio' type="radio" name={nome} id={id} onChange={funcao}/> {textoLabel}
    </label>
  )
}

export default InputRadio