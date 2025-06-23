import './IndicadorDePassos.css'

const IndicadorDePassos = ({qtdPassos = 3, passoAtual = 0, cor = 'var(--purple-700)'}: any) => {
    return (
        <div className='indicador-passos'>
            {
                Array.from({length: qtdPassos}).map((_, index) => {
                    return(
                        <div key={index} className='indicador-passos__container' style={{'--cor-indicador': cor} as React.CSSProperties}>
                            {
                                index !== 0 ? (
                                    <span className={`indicador-passos__divisor ${index < passoAtual ? 'indicador-passos__divisor--concluido' : 'indicador-passos__divisor--pendente'}`}></span>
                                ) : ''
                            }
                            <div className={`indicador-passos__item ${index < passoAtual ? 'indicador-passos__item--concluido' : 'indicador-passos__item--pendente'}`}>
                                <span>{index+1}</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default IndicadorDePassos