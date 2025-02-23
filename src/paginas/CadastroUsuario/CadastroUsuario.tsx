import "./CadastroUsuario.css"
import { ChangeEvent, FormEvent, ReactElement, useState } from 'react'
import Botao from '../../componentes/Botao/Botao'
import Formulario from '../../componentes/Formulario/Formulario'
import { Link } from 'react-router'
import IndicadorDePassos from '../../componentes/IndicadorDePassos/IndicadorDePassos'
import Input from "../../componentes/Input/Input"
interface Instrucao{
    titulo: string;
    texto: string;
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
    const [ erro, setErro ] = useState(false);

    const avancarPasso = (e: FormEvent<HTMLFormElement>) => {
        if(passoAtual === 0){
            if(!organizador && !prestador){
                setErro(true);
                return;
            }
            setQtdPassos(organizador && prestador ? 4 : 3);
        }
        else{
            e.preventDefault();
        }
        setPassoAtual(passoAtual + 1);
    }

    const voltarPasso = () => {
        setPassoAtual(passoAtual - 1);
    }

    const instrucoes: Instrucao[] = [
        {
            titulo: 'Função na Plataforma',
            texto: 'Escolha uma ou mais funções que deseja realizar na plataforma. Caso selecione apenas uma, não se preocupe. Você poderá acessar a outra mais tarde.'
        },
        {
            titulo: 'Informações Pessoais',
            texto: 'Preencha os campos com as suas informações pessoais.',
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
            texto: 'Preencha os campos com as informações da sua empresa.',
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
                    dica='Digite o endereço completo da empresa'
                    obrigatorio
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalizacao(e.target.value)}
                    valor={localizacao}
                    name='localizacao'
                />
            ]
        },
        {
            titulo: 'Contato',
            texto: 'Preencha os campos com as suas informações de contato.',
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
            texto: 'Preencha os campos com uma senha segura que será utilizada junto ao seu e-mail para acessar sua conta.',
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmarSenha(e.target.value)}
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
                    {instrucoes[passoAtual]?.titulo}
                </h3>
                <p className='cadastro-usuario__texto-instrucao'>
                    {instrucoes[passoAtual]?.texto}
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
            {
                passoAtual > 0 ?
                    <form onSubmit={avancarPasso} className="cadastro-usuario__formulario">
                        <div className="row g-4">
                            {
                                instrucoes[passoAtual].campos?.map((input, index) => {
                                    const qtdInputs = instrucoes[passoAtual].campos!.length;
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
                                            {input}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='cadastro-usuario__botoes'>
                            {
                                passoAtual > 0 ?
                                    <div className='cadastro-usuario__container-botao'>
                                        <Botao 
                                            tamanho='max'
                                            texto='Anterior'
                                            funcao={voltarPasso}
                                        />
                                    </div>
                                : ''
                            }
                            <div className='cadastro-usuario__container-botao'>
                                <Botao 
                                    tamanho='max'
                                    texto={passoAtual !== 4 ? 'Próximo' : 'Enviar'}
                                    submit
                                />
                            </div>
                        </div>
                    </form>
                : ''
            }
            {
                passoAtual === 0 ? 
                    <div className='cadastro-usuario__botao-conta'>
                        <div className='cadastro-usuario__container-botao'>
                            <Botao 
                                tamanho='max'
                                texto='Próximo'
                                funcao={avancarPasso}
                            />
                        </div>
                        <p className='cadastro-usuario__texto-login'>
                            Já possui uma conta? <Link to='/login' className='cadastro-usuario__faca-login'>Faça login</Link>
                        </p> 
                    </div>
                : ''
            }
        </Formulario>
    )
}

export default CadastroUsuario