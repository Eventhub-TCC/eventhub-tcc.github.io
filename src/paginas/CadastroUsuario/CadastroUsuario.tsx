import "./CadastroUsuario.css"
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from 'react'
import { Link } from 'react-router'
import Botao from '../../componentes/Botao/Botao'
import Formulario from '../../componentes/Formulario/Formulario'
import IndicadorDePassos from '../../componentes/IndicadorDePassos/IndicadorDePassos'
import Input from "../../componentes/Input/Input"
import ErroCampoForm from "../../componentes/ErroCampoForm/ErroCampoForm"
import FeedbackFormulario from "../../componentes/FeedbackFormulario/FeedbackFormulario"
import { PatternFormat } from "react-number-format"
import Instrucoes from "../../componentes/Instrucao/Instrucao"
import api from "../../axios"
import ToolTip from "../../componentes/ToolTip/ToolTip"
import { Helmet } from "react-helmet-async"
import CheckBox from "../../componentes/CheckBox/CheckBox"

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
    const [ termosAceitos, setTermosAceitos] = useState(false);
    const [ lido, setLido] = useState(false)
    const [ mobile, setMobile] = useState(false)

      useEffect(() => {
        const verificarMobile = () => {
        setMobile(window.innerWidth <= 768); // ou 600, 1024 etc.
        };
        verificarMobile()
      }, []);

    const [ erros, setErros ] = useState<Erro[]>([
        {ativo: false, tipo: 'funcao', mensagem: 'Selecione pelo menos uma função'},
        {ativo: false, tipo: 'confirmar-senha', mensagem: 'A confirmação da senha não confere'},
        {ativo: false, tipo: 'cpf', mensagem: 'CPF inválido'},
        {ativo: false, tipo: 'cnpj', mensagem: 'CNPJ inválido'},
        {ativo: false, tipo: 'email', mensagem: 'E-mail inválido'},
        {ativo: false, tipo: 'telefone-pessoal', mensagem: 'Telefone inválido'},
        {ativo: false, tipo: 'telefone-empresa', mensagem: 'Telefone inválido'},
        {ativo: false, tipo: 'termos-nao-lidos', mensagem:'Leia os termos e políticas antes de confirmar'},
        {ativo: false, tipo: 'termos-e-politicas', mensagem: 'É necessário estar de acordo com os termos e políticas da plataforma'}
    ]);

    const [ carregando, setCarregando ] = useState(false);
    const [ formSucesso, setFormSucesso ] = useState<boolean | null>(null);

    const dataLimiteMaiorIdade = new Date();
    dataLimiteMaiorIdade.setFullYear(dataLimiteMaiorIdade.getFullYear() - 18);
    dataLimiteMaiorIdade.setHours(0, 0, 0, 0);

    const validarCampo = async (campo: string, nomeCampo: string, campoBackend: string, tamanho: number | null = null) => {
        const erroAtivado = erros.find(({tipo}) => tipo === nomeCampo)?.ativo;
        if((erroAtivado && !tamanho) || erroAtivado){
            return false;
        }
        if(tamanho && campo.length !== tamanho){
            setErros(erros => erros.map(erro => {
                if(erro.tipo === nomeCampo){
                    erro.ativo = true;
                }
                return erro;
            }));
            return false;
        }
        try{
            setCarregando(true);
            await api.post(`/users/validate-${nomeCampo}`, {
                [campoBackend]: campo
            });
            return true;
        }
        catch(e: any){
            if(e.code === 'ERR_NETWORK'){
                setCarregando((prevCarregando) => {
                    if(prevCarregando){
                        setPassoAtual(prevPassoAtual => prevPassoAtual + 1);
                    }
                    return prevCarregando;
                });
                return;
            }
            setErros(erros => erros.map(erro => 
                erro.tipo === nomeCampo ? { ...erro, ativo: true } : erro
            ));
            return false;
        }
        finally{
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
                    pattern="([A-Za-zÀ-ÖØ-öø-ÿ]+(\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*)+"
                    title="Nome deve conter apenas letras"
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
                    pattern="([A-Za-zÀ-ÖØ-öø-ÿ]+(\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*)+"
                    title="Sobrenome deve conter apenas letras"
                />,
                <PatternFormat 
                    format="###.###.###-##"
                    mask="_"
                    value={cpf}
                    onValueChange={(values) => {
                        setCpf(values.value);
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'cpf'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    customInput={Input}
                    cabecalho
                    cabecalhoTexto='CPF'
                    dica='Digite seu CPF'
                    obrigatorio
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
                <PatternFormat 
                    format="##.###.###/####-##"
                    mask="_"
                    value={cnpj}
                    onValueChange={(values) => {
                        setCnpj(values.value);
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'cnpj'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    customInput={Input}
                    cabecalho
                    cabecalhoTexto='CNPJ'
                    dica='Digite seu CNPJ'
                    obrigatorio
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
                    pattern="([A-Za-zÀ-ÖØ-öø-ÿ0-9&'\-]+(\s[A-Za-zÀ-ÖØ-öø-ÿ0-9&'\-]+)*)+"
                    title="Nome da empresa deve conter somente letras e números"
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
                />,
                <PatternFormat 
                    format={"(##) #####-####"}
                    mask="_"
                    value={telefonePessoal}
                    onValueChange={(values) => {
                        setTelefonePessoal(values.value);
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'telefone-pessoal'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    type="tel"
                    customInput={Input}
                    cabecalho
                    cabecalhoTexto='Telefone'
                    dica='Digite seu telefone'
                    obrigatorio
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
                <PatternFormat 
                    format="(##) #####-####"
                    mask="_"
                    value={telefoneEmpresa}
                    onValueChange={(values) => {
                        setTelefoneEmpresa(values.value)
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'telefone-empresa'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    type="tel"
                    customInput={Input}
                    cabecalho
                    cabecalhoTexto='Telefone da empresa'
                    dica='Digite o telefone da empresa'
                    obrigatorio
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
                <PatternFormat 
                    format="(##) #####-####"
                    mask="_"
                    value={telefonePessoal}
                    onValueChange={(values) => {
                        setTelefonePessoal(values.value);
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'telefone-pessoal'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    type="tel"
                    customInput={Input}
                    cabecalho
                    cabecalhoTexto='Telefone pessoal'
                    dica='Digite seu telefone pessoal'
                    obrigatorio
                    name='telefone-pessoal'
                    autoComplete='tel'
                />,
                <PatternFormat 
                    format="(##) #####-####"
                    mask="_"
                    value={telefoneEmpresa}
                    onValueChange={(values) => {
                        setTelefoneEmpresa(values.value);
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'telefone-empresa'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    type="tel"
                    customInput={Input}
                    cabecalho
                    cabecalhoTexto='Telefone da empresa'
                    dica='Digite o telefone da empresa'
                    obrigatorio
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
                />,
                <button 
                style={{background: 'none', border: 'none', padding: 0, margin: 0, width: '100%', textAlign: 'left', cursor: 'pointer'}}
                onClick={() => {
                    lido ? 
                     setErros(erros=> erros.map(erro => {
                        if(erro.tipo === 'termos-nao-lidos'){
                            erro.ativo = false;
                        } 
                        return erro;
                     }))
                     
                    :
                     setErros(erros => erros.map(erro => {
                        if(erro.tipo === 'termos-nao-lidos'){
                            erro.ativo = true;
                        }
                        return erro; 
                    }))
                }}>
                    <CheckBox
                    ativado={termosAceitos}
                    name='termos-e-politicas'
                    texto='Li e estou de acordo com as '
                    funcao={()=>{
                        setTermosAceitos(!termosAceitos)
                        setErros(erros => erros.map(erro => {
                            if(erro.tipo === 'termos-e-politicas'){
                                erro.ativo = false;
                            }
                            return erro;
                        }));
                    }}
                    disabled = {!lido}
                    >
                    <a onClick={() => setLido(true)} style={{color:'var(--purple-700)'}} href="/#/politicas-e-termos" target="_blank">politicas e termos da plataforma
                    </a>
                    </CheckBox>
                        {
                            erros.find(({tipo}) => tipo === 'termos-nao-lidos')?.ativo && !lido ?
                            <ErroCampoForm mensagem={erros.find(({tipo}) => tipo === 'termos-nao-lidos')?.mensagem}/>
                            : ''
                        }
                        {
                            erros.find(({tipo}) => tipo === 'termos-e-politicas')?.ativo ?
                            <ErroCampoForm mensagem={erros.find(({tipo}) => tipo === 'termos-e-politicas')?.mensagem}/>
                            : ''
                        }
                </button>
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

    const avancarPasso = async (e: FormEvent<HTMLFormElement>) => {
        let erroValidacao = false;
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
            setEmail('');
            setSenha('');
            setSenhaOculta(true);
            setConfirmarSenhaOculta(true);
            setConfirmarSenha('');
            setCnpj('');
            setNomeEmpresa('');
            setLocalizacao('');
            setTelefoneEmpresa('');
            setNome('');
            setSobrenome('');
            setCpf('');
            setDataNascimento(null);
            setTelefonePessoal('');
            setErros(erros => erros.map(erro => {
                erro.ativo = false;
                return erro;
            }));
            setQtdPassos(instrucoesFiltradas.length - 1);
        }
        else{
            e.preventDefault();
            if(erros.some(erro => erro.ativo && instrucoesFiltradas[passoAtual].campos?.some(input => input.props.name === erro.tipo))){
                erroValidacao = true;
            }
            if(instrucoesFiltradas[passoAtual].campos?.some(input => input.props.name === 'cpf')){
                if(!await validarCampo(cpf, 'cpf', 'cpfUsu', 11)){
                    erroValidacao = true;
                }
            }
            if(instrucoesFiltradas[passoAtual].campos?.some(input => input.props.name === 'cnpj')){
                if(!await validarCampo(cnpj, 'cnpj', 'cnpjEmpresa', 14)){
                    erroValidacao = true;
                }
            }
            if(instrucoesFiltradas[passoAtual].campos?.some(input => input.props.name === 'email')){
                if(!await validarCampo(email, 'email', 'emailUsu')){
                    erroValidacao = true;
                }
            }
            if(instrucoesFiltradas[passoAtual].campos?.some(input => input.props.name === 'telefone-pessoal')){
                if(telefonePessoal.length < 10){
                    setErros(erros => erros.map(erro => {
                        if(erro.tipo === 'telefone-pessoal'){
                            erro.ativo = true;
                        }
                        return erro;
                    }));
                    erroValidacao = true;
                }
            }
            if(instrucoesFiltradas[passoAtual].campos?.some(input => input.props.name === 'telefone-empresa')){
                if(telefoneEmpresa.length < 10){
                    setErros(erros => erros.map(erro => {
                        if(erro.tipo === 'telefone-empresa'){
                            erro.ativo = true;
                        }
                        return erro;
                    }));
                    erroValidacao = true;
                }
            }
        }
        if(erroValidacao){
            return;
        }
        setPassoAtual(prevPassoAtual => prevPassoAtual + 1);
    }

    const voltarPasso = () => {
        setPassoAtual(prevPassoAtual => prevPassoAtual - 1);
    }

    const cadastrarUsuario = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!termosAceitos){
            setErros(erros => erros.map(erro=> {
                if(erro.tipo === 'termos-e-politicas'){
                    erro.ativo = true;
                }
                return erro;
            }))
            return;
        }
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
            await api.post('/users/signup', {
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
            setFormSucesso(true);
        }
        catch(e){
            setFormSucesso(false);
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
        <>
            <Helmet>
                <title>Cadastro | EventHub</title>
            </Helmet>
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
                        <Instrucoes
                            titulo={instrucoesFiltradas[passoAtual]?.titulo}
                            texto={instrucoesFiltradas[passoAtual]?.texto}
                        />
                    : ''
                }
                {
                    passoAtual === 0 ? 
                        <>
                            <div className='cadastro-usuario__opcoes-container'>
                                <div className='cadastro-usuario__opcoes'>
                                    <button
                                        style={{background: 'none', border: 'none', padding: 0, margin: 0, width: '100%', textAlign: 'left', cursor: 'pointer'}}
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
                                        <div 
                                            className={`cadastro-usuario__opcao ${organizador ? 'cadastro-usuario__opcao--selecionada' : ''}`} >
                                            <span>Organizar eventos</span>
                                            {!organizador &&
                                                <div className="cadastro-usuario__tooltip">
                                                    <ToolTip direcao={mobile ? 'esquerda' : 'cima'} mensagem='Você deseja organizar festas, shows, casamentos ou outros eventos? Essa opção de cadastro vai permitir que você crie e gerencie seus eventos aqui, distribua convites, gere listas de presenças e conecte-se em um marketplace com os melhores prestadores de serviços e fornecedores!'/>
                                                </div>
                                            }
                                        </div>
                                    </button>
                                    <button
                                        style={{background: 'none', border: 'none', padding: 0, margin: 0, width: '100%', textAlign: 'left', cursor: 'pointer'}}
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
                                            <div 
                                                className={`cadastro-usuario__opcao ${prestador ? 'cadastro-usuario__opcao--selecionada' : ''}`} 
                                            >
                                                <span>Prestar serviços</span>
                                                {!prestador &&
                                                    <div className="cadastro-usuario__tooltip">
                                                        <ToolTip direcao={mobile ? 'esquerda' : 'cima'} mensagem='Você deseja oferecer serviços ou produtos para eventos, como por exemplo, buffet, som, decoração, fotografia ou entrega de doces, salgados ou outros produtos? Essa opção de cadastro vai permitir que você anuncie seus serviços ou produtos para ser encontrado por organizadores que precisam do seu trabalho!'/>
                                                    </div>
                                                }
                                            </div>
                                        </button>
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
                    formSucesso ?
                        <FeedbackFormulario 
                            icone='fa-regular fa-circle-check'
                            titulo='Tudo certo!'
                            texto='Seu cadastro foi concluído com sucesso! Agora você já pode fazer login e explorar todos os recursos da nossa plataforma.'
                            textoBotao='Fazer login'
                            caminhoBotao='/login'
                        />
                    :
                    formSucesso === false ?
                        <FeedbackFormulario 
                            erro
                            icone='fa-regular fa-circle-xmark'
                            titulo='Oops...'
                            texto='Um problema inesperado ocorreu e não foi possível concluir o seu cadastro. Por favor, tente novamente mais tarde.'
                            textoBotao='Voltar ao início'
                            caminhoBotao='/'
                        />
                    : ""
                        
                }
            </Formulario>
        </>
    )
}

export default CadastroUsuario