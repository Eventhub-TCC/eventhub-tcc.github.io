import './Formulario.css'

const Formulario = ({onSubmit, titulo, children}: any) => {
  return (
    <form onSubmit={onSubmit} className='formulario'>
      {titulo ? <h1 className='formulario__titulo'>{titulo}</h1> : ''}
      {children}
    </form>
  )
}

export default Formulario