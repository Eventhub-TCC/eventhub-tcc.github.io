import './RedefinirSenha.css'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Formulario from '../../componentes/Formulario/Formulario'
import Input from '../../componentes/Input/Input';
import Botao from '../../componentes/Botao/Botao';
import ErroCampoForm from '../../componentes/ErroCampoForm/ErroCampoForm';
import FeedbackFormulario from '../../componentes/FeedbackFormulario/FeedbackFormulario';
import { useSearchParams } from 'react-router';
import Erro404 from '../Erro404/Erro404';

const RedefinirSenha = () => {
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [ tokenValido, setTokenValido ] = useState<boolean | null>(null);

    const [senhaOculta, setSenhaOculta] = useState(true);
    const [confirmarSenhaOculta, setConfirmarSenhaOculta] = useState(true);

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(false);
    const [formSucesso, setFormSucesso] = useState<boolean | null>(null);

    const [ searchParams ] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if(!token){
            setTokenValido(false);
            return;
        }
        const verificarToken = async () => {
            try{
                await axios.post('http://localhost:3000/users/reset-password/verify-token', {token});
                setTokenValido(true);
            }
            catch(e: any){
                setTokenValido(false);
            }
        }
        verificarToken();
    }, [token]);

    const redefinirSenha = async (e: FormEvent) => {
        e.preventDefault();
        if(senha !== confirmarSenha){
            setErro(true);
            return;
        }
        try{
            setCarregando(true);
            await axios.put('http://localhost:3000/users/reset-password', {
                token, 
                novaSenha: senha
            });
            setFormSucesso(true);
        }
        catch(e: any){
            setFormSucesso(false);
        }
        finally{
            setCarregando(false);
        }
    }

    return (
        <>
            {
                tokenValido === null ?
                    <div className='redefinir-senha__carregando-tela'>
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                :
                tokenValido === false ?
                    <Erro404 />
                :
                tokenValido === true &&
                <Formulario titulo={formSucesso === null ? 'Redefinição de Senha' : ''} onSubmit={redefinirSenha}>
                    {
                        formSucesso === null ?
                            <>
                                <div className='redefinir-senha__campos'>
                                    <div>
                                        <Input 
                                            cabecalho
                                            cabecalhoTexto='Nova senha'
                                            tipo={senhaOculta ? 'password' : 'text'}
                                            dica='Digite sua nova senha'
                                            obrigatorio
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                                            valor={senha}
                                            name='senha'
                                            autoComplete='new-password'
                                            tamanhoMin={8}
                                            icone={
                                                senha !== '' ? 
                                                    `fa-solid ${senhaOculta ? 'fa-eye-slash' : 'fa-eye'}` 
                                                : ''
                                            }
                                            funcaoIcone={() => setSenhaOculta(!senhaOculta)}
                                        />
                                    </div>
                                    <div>
                                        <Input 
                                            cabecalho
                                            cabecalhoTexto='Confirme a nova senha'
                                            tipo={confirmarSenhaOculta ? 'password' : 'text'}
                                            dica='Confirme sua nova senha'
                                            obrigatorio
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                setConfirmarSenha(e.target.value);
                                                if(senha === e.target.value){
                                                    setErro(false);
                                                }
                                            }}
                                            valor={confirmarSenha}
                                            name='confirmar-senha'
                                            icone={
                                                confirmarSenha !== '' ? 
                                                    `fa-solid ${confirmarSenhaOculta ? 'fa-eye-slash' : 'fa-eye'}` 
                                                : ''
                                            }
                                            funcaoIcone={() => setConfirmarSenhaOculta(!confirmarSenhaOculta)}
                                        />
                                        {
                                            erro &&
                                            <ErroCampoForm 
                                                mensagem='A confirmação da senha não confere'
                                            />
                                        }
                                    </div>
                                </div>
                                <div className='redefinir-senha__container-botao'>
                                    <div className='redefinir-senha__botao'>
                                        <Botao 
                                            tamanho='max'
                                            texto={
                                                carregando ?
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Carregando...</span>
                                                    </div>
                                                : 'Redefinir'
                                            }
                                            submit
                                        />
                                    </div>
                                </div>
                            </>
                        : formSucesso ?
                            <FeedbackFormulario 
                                icone='fa-regular fa-circle-check'
                                titulo='Senha alterada!'
                                texto='Sua senha foi alterada com sucesso. Agora você pode acessar sua conta.'
                                textoBotao='Fazer login'
                                caminhoBotao='/login'
                            />
                        : 
                        <FeedbackFormulario 
                            erro
                            icone='fa-regular fa-circle-xmark'
                            titulo='Oops...'
                            texto='Um problema inesperado ocorreu e não foi possível redefinir a senha. Por favor, tente novamente mais tarde.'
                            textoBotao='Voltar ao início'
                            caminhoBotao='/'
                        />
                    }
                </Formulario>
            }
        </>
    )
}

export default RedefinirSenha