import './Instrucao.css'

const Instrucao = ({titulo, texto,cor ='var(--purple-800)'}: any) => {
    return (
        <div>
            <h3 className='instrucao__titulo' style={{'--cor-principal': cor} as React.CSSProperties}>
                {titulo}
            </h3>
            <p className='instrucao__texto'>
                {texto}
            </p>
        </div>
    )
}

export default Instrucao