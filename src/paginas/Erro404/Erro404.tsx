import { Helmet } from 'react-helmet-async'
import './Erro404.css'

const Erro404 = () => {
  return (
    <>
      <Helmet>
        <title>Página não encontrada | EventHub</title>
      </Helmet>
      <div className='erro404'>
          <div className='erro404__imagem'></div>
      </div>
    </>
  )
}

export default Erro404