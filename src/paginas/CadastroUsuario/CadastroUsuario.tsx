import "./CadastroUsuario.css"
import { useState } from 'react'
import Botao from '../../componentes/Botao/Botao'
import Formulario from '../../componentes/Formulario/Formulario'
import { Link } from 'react-router'
import IndicadorDePassos from '../../componentes/IndicadorDePassos/IndicadorDePassos'
interface Instrucao{
    titulo: string;
    texto: string;
}

const CadastroUsuario = () => {
    const [ organizador, setOrganizador ] = useState(false);
    const [ prestador, setPrestador ] = useState(false);

    const [ passoAtual, setPassoAtual ] = useState(0);
    const [ qtdPassos, setQtdPassos ] = useState(0);
    const [ erro, setErro ] = useState(false);

    const avancarPasso = () => {
        if(passoAtual === 0){
            if(!organizador && !prestador){
                setErro(true);
                return;
            }
            setQtdPassos(organizador && prestador ? 4 : 3);
        }
        setPassoAtual(passoAtual + 1);
    }

    const instrucoes: Instrucao[] = [
        {
            titulo: 'Função na Plataforma',
            texto: 'Escolha uma ou mais funções que deseja realizar na plataforma. Caso selecione apenas uma, não se preocupe. Você poderá acessar a outra mais tarde.'
        },
        {
            titulo: 'Informações Pessoais',
            texto: 'Preencha os campos com as suas informações pessoais.'
        },
        {
            titulo: 'Informações da Empresa',
            texto: 'Preencha os campos com as informações da sua empresa.'
        },
        {
            titulo: 'Contato',
            texto: 'Preencha os campos com as suas informações de contato.'
        },
        {
            titulo: 'Segurança',
            texto: 'Preencha os campos com uma senha segura que será utilizada junto ao seu e-mail para acessar sua conta.'
        }
    ]
  
    return (
        <Formulario titulo="Cadastro">
            {
                passoAtual !== 0 ?
                    <IndicadorDePassos 
                        passoAtual={passoAtual}
                        qtdPassos={qtdPassos}
                    />
                : ''
            }
            <div>
                <h3 className='cadastro-usuario__titulo-instrucao'>
                    {instrucoes[passoAtual].titulo}
                </h3>
                <p className='cadastro-usuario__texto-instrucao'>
                    {instrucoes[passoAtual].texto}
                </p>
            </div>
            {
                passoAtual === 0 ? 
                    <div className='cadastro-usuario__opcoes-container'>
                        <div className='cadastro-usuario__opcoes'>
                            <div 
                                className={`cadastro-usuario__opcao ${organizador ? 'cadastro-usuario__opcao--selecionada' : ''}`} 
                                onClick={() => {
                                    setOrganizador(!organizador);
                                    setErro(false);
                                }}
                            >
                                <span>Organizar eventos</span>
                            </div>
                            <div 
                                className={`cadastro-usuario__opcao ${prestador ? 'cadastro-usuario__opcao--selecionada' : ''}`} 
                                onClick={() => {
                                    setPrestador(!prestador);
                                    setErro(false);
                                }}
                            >
                                <span>Prestar serviços</span>
                            </div>
                        </div>
                        {
                            erro ?
                                <div className='cadastro-usuario__opcoes-erro'>
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <p>Selecione pelo menos uma função</p>
                                </div>
                            : ''
                        }
                    </div>
                : ''
            }
            <div className='cadastro-usuario__botao-conta'>
                <div className='cadastro-usuario__container-botao'>
                    <Botao 
                        tamanho='max'
                        texto='Próximo'
                        funcao={avancarPasso}
                    />
                </div>
                {
                    passoAtual === 0 ? 
                        <p className='cadastro-usuario__texto-login'>
                            Já possui uma conta? <Link to='/login' className='cadastro-usuario__faca-login'>Faça login</Link>
                        </p> 
                    : ''
                }
            </div>
        </Formulario>
    )
}

export default CadastroUsuario