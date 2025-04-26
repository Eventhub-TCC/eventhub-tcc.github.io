import './EsqueciSenha.css'
import { ChangeEvent, FormEvent, useState } from 'react';
import Formulario from '../../componentes/Formulario/Formulario'
import Input from '../../componentes/Input/Input';
import Botao from '../../componentes/Botao/Botao';
import Instrucao from '../../componentes/Instrucao/Instrucao';
import ErroCampoForm from '../../componentes/ErroCampoForm/ErroCampoForm';
import FeedbackFormulario from '../../componentes/FeedbackFormulario/FeedbackFormulario';
import api from '../../axios';

const EsqueciSenha = () => {
    const [email, setEmail] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(false);
    const [formSucesso, setFormSucesso] = useState<boolean | null>(null);

    const enviarLink = async (e: FormEvent) => {
        e.preventDefault();
        if(erro) return;
        try{
            setCarregando(true);
            await api.post('/users/forgot-password', {email});
            setFormSucesso(true);
        }
        catch(e: any){
            if(e.code === 'ERR_NETWORK'){
                setFormSucesso(false);
                return;
            }
            setErro(true);
        }
        finally{
            setCarregando(false);
        }
    }

    return (
        <Formulario titulo={formSucesso === null ? 'Esqueci minha senha' : ''} onSubmit={enviarLink}>
            {
                formSucesso === null ?
                    <>
                        <Instrucao 
                            titulo="Informe o seu e-mail" 
                            texto="Para redefinir sua senha de acesso, informe o e-mail associado à sua conta. Enviaremos um link para a criação de uma nova senha."
                        />
                        <div>
                            <Input 
                                cabecalho
                                cabecalhoTexto='E-mail'
                                tipo='email'
                                dica='Digite seu e-mail'
                                obrigatorio
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setEmail(e.target.value);
                                    setErro(false);
                                }}
                                valor={email}
                                name='email'
                                autoComplete='email'
                            />
                            {
                                erro &&
                                <ErroCampoForm 
                                    mensagem='E-mail não encontrado'
                                />
                            }
                        </div>
                        <div className='esqueci-senha__container-botao'>
                            <div className='esqueci-senha__botao'>
                                <Botao 
                                    tamanho='max'
                                    texto={
                                        carregando ?
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Carregando...</span>
                                            </div>
                                        : 'Enviar'
                                    }
                                    submit
                                />
                            </div>
                        </div>
                    </>
                : formSucesso ?
                    <FeedbackFormulario 
                        icone='fa-solid fa-envelope-circle-check'
                        titulo='E-mail enviado!'
                        texto='O e-mail de redefinição de senha foi enviado. Caso não encontre na caixa de entrada, verifique a caixa de spam.'
                        textoBotao='Voltar ao início'
                        caminhoBotao='/'
                    />
                : 
                <FeedbackFormulario 
                    erro
                    icone='fa-regular fa-circle-xmark'
                    titulo='Oops...'
                    texto='Um problema inesperado ocorreu e não foi possível enviar o e-mail de redefinição de senha. Por favor, tente novamente mais tarde.'
                    textoBotao='Voltar ao início'
                    caminhoBotao='/'
                />
            }
        </Formulario>
    )
}

export default EsqueciSenha