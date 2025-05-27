import './InputQuantidade.css';
import { PatternFormat } from "react-number-format";
import Input from "../Input/Input";

const InputQuantidade = ({qtdMinima = 0, qtdMaxima, qtdAtual, setQtdAtual, name}: any) => {
  return (
    <div className='input-quantidade'>
        <button 
            className='input-quantidade__botao' 
            type='button' 
            onClick={() => setQtdAtual(qtdAtual > qtdMinima ? qtdAtual - 1 : qtdMinima)}
            disabled={qtdAtual <= qtdMinima}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M14.4001 9L3.6001 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        </button>
        <div className='input-quantidade__campo'>
            <PatternFormat   
                format={'##'}             
                value={qtdAtual}
                onValueChange={(values) => {
                    setQtdAtual(Number(values.value));
                }}
                isAllowed={(values) => (Number(values.value) <= qtdMaxima && Number(values.value) >= qtdMinima)}
                customInput={Input}
                placeholder=''
                name={name}
                alinharTexto='center'
            />
        </div>
        <button 
            className='input-quantidade__botao' 
            type='button' 
            onClick={() => setQtdAtual(qtdAtual < qtdMaxima ? qtdAtual + 1 : qtdMaxima)}
            disabled={qtdAtual >= qtdMaxima}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9.0001 3.59961L9.0001 14.3996M14.4001 8.99961L3.6001 8.99961" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        </button>
    </div>
  )
}

export default InputQuantidade;