import './Input.css'

const Input = ({tipo, dica, obrigatorio, onChange}: any) => {
  return (
    <input type={tipo}
      className='input' 
      placeholder={dica}
      required={obrigatorio}
      onChange={onChange}
    />
  )
}

Input.defaultProps = {
    tipo:'text',
    obrigatorio: true
}

export default Input
