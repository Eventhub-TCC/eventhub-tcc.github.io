import './ErroCampoForm.css'

const ErroCampoForm = ({mensagem}: any) => {
  return (
    <div className='erro-campo-form'>
        <i className="fa-solid fa-circle-exclamation"></i>
        <p>{mensagem}</p>
    </div>
  )
}

export default ErroCampoForm