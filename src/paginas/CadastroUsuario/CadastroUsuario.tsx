import "./CadastroUsuario.css"
import { ChangeEvent, FormEvent, ReactElement, useState } from 'react'
import { Link } from 'react-router'
import Botao from '../../componentes/Botao/Botao'
import Formulario from '../../componentes/Formulario/Formulario'
import IndicadorDePassos from '../../componentes/IndicadorDePassos/IndicadorDePassos'
import Input from "../../componentes/Input/Input"
import ErroCampoForm from "../../componentes/ErroCampoForm/ErroCampoForm"

interface Usuarios{
    organizador: boolean;
    prestador: boolean;
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
    const [ telefone, setTelefone ] = useState('');
    const [ senha, setSenha ] = useState('');
    const [ senhaOculta, setSenhaOculta ] = useState(true);
    const [ confirmarSenha, setConfirmarSenha ] = useState('');
    const [ confirmarSenhaOculta, setConfirmarSenhaOculta ] = useState(true);

    const [ passoAtual, setPassoAtual ] = useState(0);
    const [ qtdPassos, setQtdPassos ] = useState(0);
    const [ erros, setErros ] = useState<Erro[]>([
        {ativo: false, tipo: 'funcao', mensagem: 'Selecione pelo menos uma função'},
        {ativo: false, tipo: 'confirmar-senha', mensagem: 'A confirmação da senha não confere'},
    ]);

    const instrucoes: Instrucao[] = [
        {
            titulo: 'Função na Plataforma',
            texto: 'Selecione uma ou mais funções que deseja realizar na plataforma. Caso escolha apenas uma, não se preocupe, você poderá acessar a outra mais tarde.',
            usuarios: {
                organizador: true,
                prestador: true,
            },
        },
        {
            titulo: 'Informações Pessoais',
            texto: 'Preencha os campos abaixo com as suas informações pessoais.',
            usuarios: {
                organizador: true,
                prestador: false,
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)}
                    valor={cpf}
                    name='cpf'
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
                /> 
            ]
        },
        {
            titulo: 'Informações da Empresa',
            texto: 'Preencha os campos abaixo com as informações da sua empresa.',
            usuarios: {
                organizador: false,
                prestador: true,
            },
            campos: [
                <Input 
                    cabecalho
                    cabecalhoTexto='CNPJ'
                    tipo='text'
                    dica='Digite seu CNPJ'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)}
                    valor={cnpj}
                    name='cnpj'
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
                prestador: true,
            },
            campos: [
                <Input 
                    cabecalho
                    cabecalhoTexto='E-mail'
                    tipo='email'
                    dica='Digite seu e-mail'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    valor={email}
                    name='email'
                    autoComplete='email'
                />,
                <Input 
                    cabecalho
                    cabecalhoTexto='Telefone'
                    tipo='text'
                    dica='Digite seu telefone'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)}
                    valor={telefone}
                    name='telefone'
                    autoComplete='tel'
                />
            ]
        },
        {
            titulo: 'Segurança',
            texto: 'Preencha os campos abaixo com uma senha segura que será utilizada junto ao seu e-mail para acessar sua conta.',
            usuarios: {
                organizador: true,
                prestador: true,
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
            return instrucoes;
        }
        if(organizador){
            return instrucoes.filter(({usuarios}) => usuarios.organizador);
        }
        return instrucoes.filter(({usuarios}) => usuarios.prestador);
    }

    const instrucoesFiltradas = definirInstrucoesFiltradas();

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
        }
        setPassoAtual(passoAtual + 1);
    }

    const voltarPasso = () => {
        setPassoAtual(passoAtual - 1);
    }

    const cadastrarUsuario = (e: FormEvent<HTMLFormElement>) => {
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
    }
  
    return (
        <Formulario titulo="Cadastro" tag='div'>
            {
                passoAtual > 0 ?
                    <IndicadorDePassos 
                        passoAtual={passoAtual}
                        qtdPassos={qtdPassos}
                    />
                : ''
            }
            <div>
                <h3 className='cadastro-usuario__titulo-instrucao'>
                    {instrucoesFiltradas[passoAtual]?.titulo}
                </h3>
                <p className='cadastro-usuario__texto-instrucao'>
                    {instrucoesFiltradas[passoAtual]?.texto}
                </p>
            </div>
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
                                    texto={passoAtual !== qtdPassos ? 'Próximo' : 'Enviar'}
                                    submit
                                />
                            </div>
                        </div>
                    </form>
            }
        </Formulario>
    )
}

export default CadastroUsuario