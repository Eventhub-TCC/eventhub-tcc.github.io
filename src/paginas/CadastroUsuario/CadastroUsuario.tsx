import { useState } from 'react'
import Botao from '../../componentes/Botao/Botao'
import Formulario from '../../componentes/Formulario/Formulario'
import { Link } from 'react-router'
import "./CadastroUsuario.css"

const CadastroUsuario = () => {
    const [ organizador, setOrganizador ] = useState(false);
    const [ prestador, setPrestador ] = useState(false);
  
    return (
        <Formulario titulo="Cadastro">
            <div className='cadastro-usuario__instrucao'>
                <h3 className='cadastro-usuario__titulo-instrucao'>Função na Plataforma</h3>
                <p className='cadastro-usuario__texto-instrucao'>
                    Escolha uma ou mais funções que deseja realizar na plataforma. Caso selecione apenas uma, não se preocupe. Você poderá acessar a outra mais tarde.
                </p>
            </div>
            <div className='cadastro-usuario__opcoes'>
                <div className={`cadastro-usuario__opcao ${organizador ? 'cadastro-usuario__opcao--selecionada' : ''}`} onClick={() => setOrganizador(!organizador)}>
                    <span>Organizar eventos</span>
                </div>
                <div className={`cadastro-usuario__opcao ${prestador ? 'cadastro-usuario__opcao--selecionada' : ''}`} onClick={() => setPrestador(!prestador)}>
                    <span>Prestar serviços</span>
                </div>
            </div>
            <div className='cadastro-usuario__botao-conta'>
                <div className='cadastro-usuario__container-botao'>
                    <Botao 
                        tamanho='max'
                        texto='Próximo'
                    />
                </div>
                <p className='cadastro-usuario__texto-login'>
                    Já possui uma conta? <Link to='/login' className='cadastro-usuario__faca-login'>Faça login</Link>
                </p>
            </div>
        </Formulario>
    )
}

export default CadastroUsuario