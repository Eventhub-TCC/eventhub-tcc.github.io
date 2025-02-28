import { useNavigate } from "react-router"
import Botao from "../Botao/Botao"
import './FeedbackFormulario.css'

const FeedbackFormulario = ({erro = false, icone, children, titulo, texto, textoBotao, caminhoBotao}: any) => {
    const navigate = useNavigate();

    return (
        <div className="feedback-form">
            {
                children ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="95" viewBox="0 0 100 95" fill="none">
                        {children}
                    </svg> 
                : ''
            }
            {
                icone ? 
                    <i className={`${icone} feedback-form__icone ${!erro ? 'feedback-form__icone--padrao' : 'feedback-form__icone--erro'}`}></i> 
                : ''
            }
            <h2 className={`feedback-form__titulo ${!erro ? 'feedback-form__titulo--padrao' : 'feedback-form__titulo--erro'}`}>{titulo}</h2>
            <p className="feedback-form__texto">
                {texto}
            </p>
            <div className="feedback-form__container-botao">
                <Botao tamanho='max' texto={textoBotao} funcao={() => navigate(caminhoBotao)}/>
            </div>
        </div>
    )
}

export default FeedbackFormulario