import './Formulario.css'

const Formulario = ({onSubmit, titulo, children}: any) => {
  return (
    <form onSubmit={onSubmit} className='formulario'>
      {titulo ? <h2 className='formulario__titulo'>{titulo}</h2> : ''}
      {children}
    </form>
  )
}

export default Formulario