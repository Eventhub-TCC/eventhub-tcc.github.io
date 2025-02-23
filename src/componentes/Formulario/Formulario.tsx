import './Formulario.css'

const Formulario = ({onSubmit, titulo, children, tag = 'form'}: any) => {
  return (
    <>
      {
        tag === 'form' ?
          <form onSubmit={onSubmit} className='formulario'>
            {titulo ? <h2 className='formulario__titulo'>{titulo}</h2> : ''}
            {children}
          </form>
        : 
        tag === 'div' ?
          <div className='formulario'>
            {titulo ? <h2 className='formulario__titulo'>{titulo}</h2> : ''}
            {children}
          </div>
        : ''
      }
    </>
  )
}

export default Formulario