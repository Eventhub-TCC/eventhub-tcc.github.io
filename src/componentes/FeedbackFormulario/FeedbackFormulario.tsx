import { useNavigate } from "react-router"
import Botao from "../Botao/Botao"
import './FeedbackFormulario.css'

const FeedbackFormulario = ({erro = false, icone, children, titulo, texto, textoBotao, caminhoBotao, prestador = false}: any) => {
    const navigate = useNavigate();

    return (
        <div className={prestador ? 'feedback-form-prestador':'feedback-form'}>
            {
                children ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="105" height="105" viewBox="0 0 105 105" fill={''}>
                        {children}
                    </svg> 
                : ''
            }
            {
                icone ? 
                    <i className={`${icone} feedback-form__icone ${!erro ? 'feedback-form__icone--padrao' : 'feedback-form__icone--erro'}`}></i> 
                : ''
            }
            <h2 className={`feedback-form__titulo ${!erro ? prestador ? 'feedback-form__titulo--prestador' : 'feedback-form__titulo--padrao' : 'feedback-form__titulo--erro'}`}>{titulo}</h2>
            <p className="feedback-form__texto">
                {texto}
            </p>
            <div className="feedback-form__container-botao">
                <Botao cor={prestador ? 'var(--yellow-700)' : 'var(--purple-700)'} tamanho='max' texto={textoBotao} funcao={() => navigate(caminhoBotao)}/>
            </div>
        </div>
    )
}

export default FeedbackFormulario