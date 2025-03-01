import "./CadastroUsuario.css"
import { ChangeEvent, FormEvent, ReactElement, useState } from 'react'
import { Link } from 'react-router'
import Botao from '../../componentes/Botao/Botao'
import Formulario from '../../componentes/Formulario/Formulario'
import IndicadorDePassos from '../../componentes/IndicadorDePassos/IndicadorDePassos'
import Input from "../../componentes/Input/Input"
import ErroCampoForm from "../../componentes/ErroCampoForm/ErroCampoForm"
import axios from "axios"
import FeedbackFormulario from "../../componentes/FeedbackFormulario/FeedbackFormulario"

interface Usuarios{
    organizador: boolean;
    prestador: boolean;
    ambos: boolean;
}

interface Erro{
    ativo: boolean;
    tipo: string;
    mensagem: string;
}

interface Instrucao{
    titulo: string;
    texto: string;
    usuarios: Usuarios;
    campos?: ReactElement[]; 
}

const CadastroUsuario = () => {
    const [ organizador, setOrganizador ] = useState(false);
    const [ prestador, setPrestador ] = useState(false);
    const [ nome, setNome ] = useState('');
    const [ sobrenome, setSobrenome ] = useState('');
    const [ cpf, setCpf ] = useState('');
    const [ dataNascimento, setDataNascimento ] = useState<Date | null>(null);
    const [ cnpj, setCnpj ] = useState('');
    const [ nomeEmpresa, setNomeEmpresa ] = useState('');
    const [ localizacao, setLocalizacao ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ telefonePessoal, setTelefonePessoal ] = useState('');
    const [ telefoneEmpresa, setTelefoneEmpresa ] = useState('');
    const [ senha, setSenha ] = useState('');
    const [ confirmarSenha, setConfirmarSenha ] = useState('');
    
    const [ senhaOculta, setSenhaOculta ] = useState(true);
    const [ confirmarSenhaOculta, setConfirmarSenhaOculta ] = useState(true);

    const [ passoAtual, setPassoAtual ] = useState(0);
    const [ qtdPassos, setQtdPassos ] = useState(0);

    const [ erros, setErros ] = useState<Erro[]>([
        {ativo: false, tipo: 'funcao', mensagem: 'Selecione pelo menos uma função'},
        {ativo: false, tipo: 'confirmar-senha', mensagem: 'A confirmação da senha não confere'},
        {ativo: false, tipo: 'cpf', mensagem: ''},
        {ativo: false, tipo: 'cnpj', mensagem: ''},
        {ativo: false, tipo: 'email', mensagem: ''},
    ]);

    const [ requisicao, setRequisicao ] = useState(false);
    const [ carregando, setCarregando ] = useState(false);
    const [ falha , setFalha ] = useState(false);
    const [ sucesso, setSucesso ] = useState(false);

    const dataLimiteMaiorIdade = new Date();
    dataLimiteMaiorIdade.setFullYear(dataLimiteMaiorIdade.getFullYear() - 18);
    dataLimiteMaiorIdade.setHours(0, 0, 0, 0);

    const validarCampo = async (campo: string, nomeCampo: string, campoBackend: string, tamanho: number | null = null) => {
        if(!tamanho){
            if(erros.find(({tipo}) => tipo === nomeCampo)?.ativo){
                return;
            }
        }
        else{
            if(campo.length !== tamanho || erros.find(({tipo}) => tipo === nomeCampo)?.ativo){
                return;
            }
        }
        try{
            setRequisicao(true);
            await axios.post(`http://localhost:3000/users/validate-${nomeCampo}`, {
                [campoBackend]: campo
            });
            setCarregando((prevCarregando) => {
                if(prevCarregando){
                    setPassoAtual(passoAtual + 1);
                }
                return prevCarregando;
            });
        }
        catch(e: any){
            if(e.code === 'ERR_NETWORK'){
                setCarregando((prevCarregando) => {
                    if(prevCarregando){
                        setPassoAtual(passoAtual + 1);
                    }
                    return prevCarregando;
                });
                return;
            }
            setErros(erros => erros.map(erro => {
                if(erro.tipo === nomeCampo){
                    erro.mensagem = e.response.data.mensagem;
                    erro.ativo = true;
                }
                return erro;
            }));
        }
        finally{
            setRequisicao(false);
            setCarregando(false);
        }
    }

    const instrucoes: Instrucao[] = [
        {
            titulo: 'Função na Plataforma',
            texto: 'Selecione uma ou mais funções que deseja realizar na plataforma. Caso escolha apenas uma, não se preocupe, você poderá acessar a outra mais tarde.',
            usuarios: {
                organizador: true,
                prestador: true,
                ambos: true
            },
        },
        {
            titulo: 'Informações Pessoais',
            texto: 'Preencha os campos abaixo com as suas informações pessoais.',
            usuarios: {
                organizador: true,
                prestador: false,
                ambos: true
            },
            campos: [
                <Input 
                    cabecalho
                    cabecalhoTexto='Nome'
                    tipo='text'
                    dica='Digite seu nome'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                    valor={nome}
                    name='nome'
                    autoComplete='given-name'
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='Sobrenome'
                    tipo='text'
                    dica='Digite seu sobrenome'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSobrenome(e.target.value)}
                    valor={sobrenome}
                    name='sobrenome'
                    autoComplete='family-name'
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='CPF'
                    tipo='text'
                    dica='Digite seu CPF'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCpf(e.target.value);
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'cpf'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    onBlur={() => validarCampo(cpf, 'cpf', 'cpfUsu', 11)}
                    valor={cpf}
                    name='cpf'
                    tamanhoMin={11}
                    tamanhoMax={11}
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='Data de nascimento'
                    tipo='date'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDataNascimento(new Date(e.target.value))}
                    valor={dataNascimento && !isNaN(new Date(dataNascimento).getTime()) ? dataNascimento.toISOString().split('T')[0] : ''}
                    name='data-nascimento'
                    autoComplete='bday'
                    min='1900-01-01'
                    max={dataLimiteMaiorIdade.toISOString().split('T')[0]}
                /> 
            ]
        },
        {
            titulo: 'Informações da Empresa',
            texto: 'Preencha os campos abaixo com as informações da sua empresa.',
            usuarios: {
                organizador: false,
                prestador: true,
                ambos: true
            },
            campos: [
                <Input 
                    cabecalho
                    cabecalhoTexto='CNPJ'
                    tipo='text'
                    dica='Digite seu CNPJ'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCnpj(e.target.value)
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'cnpj'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    valor={cnpj}
                    name='cnpj'
                    onBlur={() => validarCampo(cnpj, 'cnpj', 'cnpjEmpresa', 14)}
                    tamanhoMin={14}
                    tamanhoMax={14}
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='Nome da empresa'
                    tipo='text'
                    dica='Digite o nome da empresa'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNomeEmpresa(e.target.value)}
                    valor={nomeEmpresa}
                    name='nome-empresa'
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='Localização'
                    tipo='text'
                    dica='Digite o endereço da empresa'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalizacao(e.target.value)}
                    valor={localizacao}
                    name='localizacao'
                />
            ]
        },
        {
            titulo: 'Contato',
            texto: 'Preencha os campos abaixo com as suas informações de contato.',
            usuarios: {
                organizador: true,
                prestador: false,
                ambos: false
            },
            campos: [
                <Input 
                    cabecalho
                    cabecalhoTexto='E-mail'
                    tipo='email'
                    dica='Digite seu e-mail'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setEmail(e.target.value);
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'email'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    valor={email}
                    name='email'
                    autoComplete='email'
                    onBlur={() => validarCampo(email, 'email', 'emailUsu')}
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='Telefone'
                    tipo='text'
                    dica='Digite seu telefone'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefonePessoal(e.target.value)}
                    valor={telefonePessoal}
                    name='telefone-pessoal'
                    autoComplete='tel'
                />
            ]
        },
        {
            titulo: 'Contato',
            texto: 'Preencha os campos abaixo com as suas informações de contato.',
            usuarios: {
                organizador: false,
                prestador: true,
                ambos: false
            },
            campos: [
                <Input 
                    cabecalho
                    cabecalhoTexto='E-mail'
                    tipo='email'
                    dica='Digite seu e-mail'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setEmail(e.target.value);
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'email'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    valor={email}
                    name='email'
                    autoComplete='email'
                    onBlur={() => validarCampo(email, 'email', 'emailUsu')}
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='Telefone da empresa'
                    tipo='text'
                    dica='Digite o telefone da empresa'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefoneEmpresa(e.target.value)}
                    valor={telefoneEmpresa}
                    name='telefone-empresa'
                    autoComplete='tel'
                />
            ]
        },
        {
            titulo: 'Contato',
            texto: 'Preencha os campos abaixo com as suas informações de contato.',
            usuarios: {
                organizador: false,
                prestador: false,
                ambos: true
            },
            campos: [
                <Input 
                    cabecalho
                    cabecalhoTexto='Telefone pessoal'
                    tipo='text'
                    dica='Digite seu telefone pessoal'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefonePessoal(e.target.value)}
                    valor={telefonePessoal}
                    name='telefone-pessoal'
                    autoComplete='tel'
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='Telefone da empresa'
                    tipo='text'
                    dica='Digite o telefone da empresa'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefoneEmpresa(e.target.value)}
                    valor={telefoneEmpresa}
                    name='telefone-empresa'
                    autoComplete='tel'
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='E-mail'
                    tipo='email'
                    dica='Digite seu e-mail'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setEmail(e.target.value);
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'email'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    valor={email}
                    name='email'
                    autoComplete='email'
                    onBlur={() => validarCampo(email, 'email', 'emailUsu')}
                />
            ]
        },
        {
            titulo: 'Segurança',
            texto: 'Preencha os campos abaixo com uma senha segura que será utilizada junto ao seu e-mail para acessar sua conta.',
            usuarios: {
                organizador: true,
                prestador: true,
                ambos: true
            },
            campos: [
                <Input 
                    cabecalho
                    cabecalhoTexto='Senha'
                    tipo={senhaOculta ? 'password' : 'text'}
                    dica='Digite sua senha'
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
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='Confirme sua senha'
                    tipo={confirmarSenhaOculta ? 'password' : 'text'}
                    dica='Confirme sua senha'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setConfirmarSenha(e.target.value);
                        if(senha === e.target.value){
                            setErros(erros => erros.map(erro => {
                                if(erro.tipo === 'confirmar-senha'){
                                    erro.ativo = false;
                                }
                                return erro;
                            }));
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
            ]
        }
    ]

    const definirInstrucoesFiltradas = () => {
        if(organizador && prestador){
            return instrucoes.filter(({usuarios}) => usuarios.ambos);
        }
        if(organizador){
            return instrucoes.filter(({usuarios}) => usuarios.organizador);
        }
        return instrucoes.filter(({usuarios}) => usuarios.prestador);
    }

    const instrucoesFiltradas: Instrucao[] = definirInstrucoesFiltradas();

    const avancarPasso = (e: FormEvent<HTMLFormElement>) => {
        if(passoAtual === 0){
            if(!organizador && !prestador){
                setErros(erros => erros.map(erro => {
                    if(erro.tipo === 'funcao'){
                        erro.ativo = true;
                    }
                    return erro;
                }));
                return;
            }
            setQtdPassos(instrucoesFiltradas.length - 1);
        }
        else{
            e.preventDefault();
            if(erros.some(erro => erro.ativo && instrucoesFiltradas[passoAtual].campos?.some(input => input.props.name === erro.tipo))){
                return;
            }
            if(requisicao){
                setCarregando(true);
                return;
            }
        }
        setPassoAtual(passoAtual + 1);
    }

    const voltarPasso = () => {
        setPassoAtual(passoAtual - 1);
    }

    const cadastrarUsuario = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(senha !== confirmarSenha){
            setErros(erros => erros.map(erro => {
                if(erro.tipo === 'confirmar-senha'){
                    erro.ativo = true;
                }
                return erro;
            }));
            return;
        }
        else{
            setErros(erros => erros.map(erro => {
                if(erro.tipo === 'confirmar-senha'){
                    erro.ativo = false;
                }
                return erro;
            }));
        }
        try{
            setCarregando(true);
            await axios.post('http://localhost:3000/users/signup', {
                organizador,
                prestador,
                emailUsu: email,
                senhaUsu: senha,
                nomeUsu: nome,
                sobrenomeUsu: sobrenome,
                dtNasUsu: dataNascimento?.toISOString().split('T')[0],
                telUsu: telefonePessoal,
                cpfUsu: cpf,
                nomeEmpresa: nomeEmpresa,
                telEmpresa: telefoneEmpresa,
                cnpjEmpresa: cnpj,
                localizacaoEmpresa: localizacao,
            });
            setSucesso(true);
        }
        catch(e){
            setFalha(true);
        }
        finally{
            setCarregando(false);
            setPassoAtual(passoAtual + 1);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
  
    return (
        <Formulario titulo={passoAtual <= qtdPassos ? 'Cadastro' : ''} tag='div'>
            {
                passoAtual > 0 && passoAtual <= qtdPassos ?
                    <IndicadorDePassos 
                        passoAtual={passoAtual}
                        qtdPassos={qtdPassos}
                    />
                : ''
            }
            {
                passoAtual <= qtdPassos ?
                    <div>
                        <h3 className='cadastro-usuario__titulo-instrucao'>
                            {instrucoesFiltradas[passoAtual]?.titulo}
                        </h3>
                        <p className='cadastro-usuario__texto-instrucao'>
                            {instrucoesFiltradas[passoAtual]?.texto}
                        </p>
                    </div>
                : ''
            }
            {
                passoAtual === 0 ? 
                    <>
                        <div className='cadastro-usuario__opcoes-container'>
                            <div className='cadastro-usuario__opcoes'>
                                <div 
                                    className={`cadastro-usuario__opcao ${organizador ? 'cadastro-usuario__opcao--selecionada' : ''}`} 
                                    onClick={() => {
                                        setOrganizador(!organizador);
                                        setErros(erros => erros.map(erro => {
                                            if(erro.tipo === 'funcao'){
                                                erro.ativo = false;
                                            }
                                            return erro;
                                        }))
                                    }}
                                >
                                    <span>Organizar eventos</span>
                                </div>
                                <div 
                                    className={`cadastro-usuario__opcao ${prestador ? 'cadastro-usuario__opcao--selecionada' : ''}`} 
                                    onClick={() => {
                                        setPrestador(!prestador);
                                        setErros(erros => erros.map(erro => {
                                            if(erro.tipo === 'funcao'){
                                                erro.ativo = false;
                                            }
                                            return erro;
                                        }))
                                    }}
                                >
                                    <span>Prestar serviços</span>
                                </div>
                            </div>
                            {
                                erros.find(({tipo}) => tipo === 'funcao')?.ativo ?
                                    <ErroCampoForm mensagem={erros.find(({tipo}) => tipo === 'funcao')?.mensagem}/>
                                : ''
                            }
                        </div>
                        <div className='cadastro-usuario__botao-conta'>
                            <div className='cadastro-usuario__container-botao'>
                                <div className='cadastro-usuario__container-botao-passo0'>
                                    <Botao 
                                        tamanho='max'
                                        texto='Próximo'
                                        funcao={avancarPasso}
                                    />
                                </div>
                            </div>
                            <p className='cadastro-usuario__texto-login'>
                                Já possui uma conta? <Link to='/login' className='cadastro-usuario__faca-login'>Faça login</Link>
                            </p> 
                        </div>
                    </>
                : 
                passoAtual > 0 && passoAtual <= qtdPassos ?
                    <form onSubmit={passoAtual !== qtdPassos ? avancarPasso : cadastrarUsuario} className="cadastro-usuario__formulario">
                        <div className="row g-4">
                            {
                                instrucoesFiltradas[passoAtual]?.campos?.map((input, index) => {
                                    const qtdInputs = instrucoesFiltradas[passoAtual].campos!.length;
                                    return (
                                        <div 
                                            key={index}
                                            className={`${ 
                                                qtdInputs === 1 || qtdInputs === 2 ? 'col-12' 
                                                : qtdInputs%2 === 0 ? 'col-md-6'
                                                : index === qtdInputs - 1 ? 'col-12'
                                                : 'col-md-6'
                                            }`}
                                        >
                                            <div>
                                                {input}
                                            </div>
                                            {
                                                erros.find(({tipo}) => tipo === input.props.name)?.ativo ?
                                                    <ErroCampoForm mensagem={erros.find(({tipo}) => tipo === input.props.name)?.mensagem}/>
                                                : ''
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='cadastro-usuario__botoes'>
                            <div className='cadastro-usuario__container-botao'>
                                <Botao 
                                    tamanho='max'
                                    texto='Anterior'
                                    funcao={voltarPasso}
                                />
                            </div>
                            <div className='cadastro-usuario__container-botao'>
                                <Botao 
                                    tamanho='max'
                                    texto={
                                        carregando ? 
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Carregando...</span>
                                            </div>
                                        :
                                        passoAtual !== qtdPassos ? 'Próximo' : 'Enviar'
                                    }
                                    submit
                                />
                            </div>
                        </div>
                    </form>
                : ''
            }
            {
                falha ?
                    <FeedbackFormulario 
                        erro
                        icone='fa-regular fa-circle-xmark'
                        titulo='Oops...'
                        texto='Um problema inesperado ocorreu e não foi possível concluir o seu cadastro. Por favor, tente novamente mais tarde.'
                        textoBotao='Voltar ao início'
                        caminhoBotao='/'
                    />
                :
                sucesso ?
                    <FeedbackFormulario 
                        icone='fa-regular fa-circle-check'
                        titulo='Tudo certo!'
                        texto='Seu cadastro foi concluído com sucesso! Agora você já pode fazer login e explorar todos os recursos da nossa plataforma.'
                        textoBotao='Fazer login'
                        caminhoBotao='/login'
                    />
                : ''
            }
        </Formulario>
    )
}

export default CadastroUsuario