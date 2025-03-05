import './Instrucao.css'

const Instrucao = ({titulo, texto}: any) => {
    return (
        <div>
            <h3 className='instrucao__titulo'>
                {titulo}
            </h3>
            <p className='instrucao__texto'>
                {texto}
            </p>
        </div>
    )
}

export default Instrucao