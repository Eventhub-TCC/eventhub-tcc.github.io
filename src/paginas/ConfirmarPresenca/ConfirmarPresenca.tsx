import './ConfirmarPresenca.css'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import { useParams } from 'react-router';
import { FormEvent, useEffect, useState } from 'react';
import { PatternFormat } from 'react-number-format';
import api from '../../axios';
import Alerta from '../../componentes/Alerta/Alerta';
import logo from '../../assets/logo_eventhub_fonte_branca.png'
import Select from '../../componentes/Select/Select';
import InputQuantidade from '../../componentes/InputQuantidade/InputQuantidade';

interface Acompanhante {
    nome: string;
    email: string;
    dataNascimento: string;
    rg: string;
    relacao: string;
}

const ConfirmarPresenca = () => {
    const { idConvite } = useParams();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [rg, setRg] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [tituloEvento, setTituloEvento] = useState("")
    const [descricaoEvento, setDescricaoEvento] = useState("")
    const [imagemEvento, setImagemEvento] = useState("")
    const [dataEvento, setDataEvento] = useState("")
    const [horaInicio, setHoraInicio] = useState("")
    const [horaFim, setHoraFim] = useState("")
    const [cepLocal, setCepLocal] = useState("")
    const [enderecoLocal, setEnderecoLocal] = useState("")
    const [numeroLocal, setNumeroLocal] = useState("")
    const [complementoLocal, setComplementoLocal] = useState("")
    const [bairroLocal, setBairroLocal] = useState("")
    const [cidadeLocal, setCidadeLocal] = useState("")
    const [ufLocal, setUfLocal] = useState("")
    const [qtdMaxAcompanhantes, setQtdMaxAcompanhantes] = useState(0);
    const [qtdAcompanhantes, setQtdAcompanhantes] = useState(0);
    const [acompanhantes, setAcompanhantes] = useState<Acompanhante[]>([]);
    const [conviteUtilizado, setConviteUtilizado] = useState(false)
    const [usadoAgora, setUsadoAgora] = useState(false)

    useEffect(() => {
        const conviteUsado = async () => {
            try {
                const response = await api.get(`/users/verificar-convite/${idConvite}`);
                const convite = response.data;
                if (convite.status === "Utilizado") {
                    setConviteUtilizado(true);
                }
                else{
                    setQtdMaxAcompanhantes(convite.qtdMaxAcompanhantes);
                }
            } catch (err) {
                console.error('Erro ao verificar convite:', err);
            }
        }
        conviteUsado();
    }, [idConvite])

    useEffect(() => {
        const buscarConvite = async () => {
            try {
                const response = await api.get(`/users/convites/${idConvite}`)
                const evento = response.data
                setTituloEvento(evento.nomeEvento)
                setDescricaoEvento(evento.descricaoEvento)
                setImagemEvento(evento.imagemEvento)
                setDataEvento(evento.dataEvento)
                setHoraInicio(evento.horaInicio)
                setHoraFim(evento.horaFim)
                setCepLocal(evento.cepLocal)
                setEnderecoLocal(evento.enderecoLocal)
                setNumeroLocal(evento.numeroLocal)
                setComplementoLocal(evento.complementoLocal)
                setBairroLocal(evento.bairroLocal)
                setCidadeLocal(evento.cidadeLocal)
                setUfLocal(evento.ufLocal)
            } catch (err) {
                console.error('Erro ao buscar convite:', err)
                alert("Erro ao carregar dados do evento.")
            }
        }

        if (idConvite) {
            buscarConvite()
        }
    }, [idConvite])

    useEffect(() => {
       setAcompanhantes(prev => {
            const novo = [...prev];
            if (qtdAcompanhantes > prev.length) {
                for (let i = prev.length; i < qtdAcompanhantes; i++) {
                    novo.push({ nome: '', email: '', dataNascimento: '', rg: '', relacao: '' });
                }
            } 
            else if (qtdAcompanhantes < prev.length) {
                novo.splice(qtdAcompanhantes);
            }
            return novo;
        });
    }, [qtdAcompanhantes]);

    const confirmarPresenca = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await api.post(`/users/confirmar-convite/${idConvite}`, {
                nome,
                email,
                rg,
                dataNascimento,
                acompanhantes: acompanhantes.map(acomp => ({
                    nome: acomp.nome,
                    email: acomp.email,
                    dataNascimento: acomp.dataNascimento,
                    rg: acomp.rg,
                    relacionamento: acomp.relacao
                }))
            });
            setUsadoAgora(true);
            setTimeout(() => {
                setUsadoAgora(false);
            }
                , 10000)
        } catch (err) {
            console.error(err);
            alert("Erro ao confirmar presença.");
        }
    };

    const formatarDados = {
        data: (data: string) => {
            return data.slice(0, 10).split('-').reverse().join('/');
        },
        hora: (hora: string) => {
            return hora.slice(0, 5);
        },
        cep: (cep: string) => {
            return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
    }

    const relacionamentos = ["Pai", "Mãe", "Filho(a)", "Irmão(ã)", "Avô", "Avó", "Neto(a)", "Tio(a)", "Primo(a)", "Sobrinho(a)", "Cunhado(a)", "Genro", "Nora", "Enteado(a)", "Padrasto", "Madrasta", "Marido", "Esposa", "Noivo(a)", "Namorado(a)", "Amigo(a)", "Parente", "Outro"];
    
    return (
        <div className='confirmar-presenca'>
            {
                <div className='container-convite'>
                    <div className='cabecalho-roxo'></div>
                    <div className='container-logo-eventhub'>
                        <img src={logo} alt="Logo EventHub" className='logo-eventhub'/>
                    </div>
                    {
                        !conviteUtilizado ?
                            <div className='convite__cards'>
                                <div className='informacoes-evento-container-principal'>
                                    {
                                        imagemEvento &&
                                        <div>
                                            <img className='confirmar-evento__imagem' src={`http://localhost:3000/files/${imagemEvento}`} />
                                        </div>
                                    }
                                    <div className={`informacoes-evento-convite ${!imagemEvento ? 'informacoes-evento-convite--sem-imagem' : ''}`}>
                                        <div className='mensagem-titulo'>
                                            <span className='mensagem'>Você foi convidado(a) para o evento</span>
                                            <h1 className='confirmar-presenca__titulo'>{tituloEvento}</h1>
                                        </div>
                                        {
                                            descricaoEvento &&
                                            <p className='caixa-texto-evento'>
                                                {descricaoEvento}
                                            </p>
                                        }
                                        <div className='dados-evento'>
                                            <div className='confirmar-presenca__dados-evento'>
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                        <path d="M6.78125 15.0677V15M10.7188 15.0677V15M10.7188 11.4V11.3323M14.2188 11.4V11.3323M4.15625 7.79997H16.4063M5.73958 2.625V3.97516M14.6563 2.625V3.97499M14.6563 3.97499H5.90625C4.4565 3.97499 3.28125 5.18382 3.28125 6.67498V15.675C3.28125 17.1662 4.4565 18.375 5.90625 18.375H14.6562C16.106 18.375 17.2812 17.1662 17.2812 15.675L17.2813 6.67498C17.2813 5.18382 16.106 3.97499 14.6563 3.97499Z" stroke="#55379D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <p className='confirmar-presenca__dados-texto'>{formatarDados['data'](dataEvento)}</p>
                                            </div>
                                            <div className='confirmar-presenca__dados-evento'>
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                        <path d="M13.5744 13.4174C14.0983 13.5921 14.6647 13.3089 14.8393 12.785C15.014 12.261 14.7308 11.6947 14.2069 11.5201L13.5744 13.4174ZM10.9375 11.4844H9.9375C9.9375 11.9148 10.2129 12.2969 10.6213 12.4331L10.9375 11.4844ZM11.9375 7.36826C11.9375 6.81598 11.4898 6.36826 10.9375 6.36826C10.3852 6.36826 9.9375 6.81598 9.9375 7.36826H11.9375ZM14.2069 11.5201L11.2537 10.5357L10.6213 12.4331L13.5744 13.4174L14.2069 11.5201ZM11.9375 11.4844V7.36826H9.9375V11.4844H11.9375ZM17.8125 10.5C17.8125 14.297 14.7345 17.375 10.9375 17.375V19.375C15.839 19.375 19.8125 15.4015 19.8125 10.5H17.8125ZM10.9375 17.375C7.14054 17.375 4.0625 14.297 4.0625 10.5H2.0625C2.0625 15.4015 6.03597 19.375 10.9375 19.375V17.375ZM4.0625 10.5C4.0625 6.70304 7.14054 3.625 10.9375 3.625V1.625C6.03597 1.625 2.0625 5.59847 2.0625 10.5H4.0625ZM10.9375 3.625C14.7345 3.625 17.8125 6.70304 17.8125 10.5H19.8125C19.8125 5.59847 15.839 1.625 10.9375 1.625V3.625Z" fill="#55379D" />
                                                    </svg>
                                                </div>
                                                <p className='confirmar-presenca__dados-texto'>{formatarDados['hora'](horaInicio)} - {formatarDados['hora'](horaFim)}</p>
                                            </div>
                                            <div className='confirmar-presenca__dados-evento'>
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                        <path d="M10.5002 18.8996C10.5002 18.8996 17.0741 13.0561 17.0741 8.67352C17.0741 5.04285 14.1309 2.09961 10.5002 2.09961C6.86951 2.09961 3.92627 5.04285 3.92627 8.67352C3.92627 13.0561 10.5002 18.8996 10.5002 18.8996Z" stroke="#55379D" strokeWidth="2" />
                                                        <path d="M12.6005 8.39974C12.6005 9.55954 11.6602 10.4997 10.5005 10.4997C9.34065 10.4997 8.40045 9.55954 8.40045 8.39974C8.40045 7.23994 9.34065 6.29974 10.5005 6.29974C11.6602 6.29974 12.6005 7.23994 12.6005 8.39974Z" stroke="#55379D" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                                <p className='confirmar-presenca__dados-texto'>
                                                    {
                                                        enderecoLocal || numeroLocal ?
                                                            complementoLocal ?
                                                                enderecoLocal +', '+ numeroLocal + ' - ' + complementoLocal + ', ' + bairroLocal + ', ' + cidadeLocal + ' - ' + ufLocal + ', ' + formatarDados['cep'](cepLocal)
                                                            : 
                                                                enderecoLocal +', '+ numeroLocal + ' - ' + bairroLocal + ', ' + cidadeLocal + ' - ' + ufLocal + ', ' + formatarDados['cep'](cepLocal)
                                                        : 'Endereço não definido'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <form className='confirmar-presenca__form' onSubmit={confirmarPresenca}>
                                    <div className='campos-dados-convidado'>
                                        <h2 className='titulo-dados'>Preencha os campos abaixo</h2>
                                        <p className='instrucao-dados'>
                                            As informações fornecidas serão compartilhadas com o organizador do evento e utilizados para garantir sua identificação e uma melhor experiência durante o evento.
                                        </p>
                                        <div className='confirmar-presenca__campos'>
                                            <div className='input-texto-dados'>
                                                <Input 
                                                    value={nome} 
                                                    onChange={(e: any) => setNome(e.target.value)} 
                                                    text='' 
                                                    dica='Digite seu nome' 
                                                    obrigatorio 
                                                    cabecalho 
                                                    cabecalhoTexto='Nome'
                                                    name='nome'
                                                    pattern="([A-Za-zÀ-ÖØ-öø-ÿ]+(\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*)+"
                                                    title="Nome deve conter apenas letras"
                                                />
                                            </div>
                                            <div className='input-texto-dados'>
                                                <Input 
                                                    value={email} 
                                                    onChange={(e: any) => setEmail(e.target.value)} 
                                                    type='email' 
                                                    dica='Digite seu email' 
                                                    obrigatorio 
                                                    cabecalho 
                                                    cabecalhoTexto='E-mail'
                                                    name='email'
                                                    autoComplete="email"
                                                />
                                            </div>
                                            <div className='input-texto-dados'>
                                                <Input 
                                                    value={dataNascimento} 
                                                    onChange={(e: any) => setDataNascimento(e.target.value)} 
                                                    type='date' 
                                                    dica='Digite sua data de nascimento' 
                                                    obrigatorio 
                                                    max={new Date().toISOString().split('T')[0]} 
                                                    cabecalho 
                                                    cabecalhoTexto='Data de nascimento'
                                                    name='data-nascimento'
                                                />
                                            </div>
                                            <div className='input-texto-dados'>
                                                <div className='tamanho-input-convidado'>
                                                    <PatternFormat
                                                        format="##.###.###-#"
                                                        mask="_"
                                                        value={rg}
                                                        onValueChange={(values) => {
                                                            setRg(values.value);
                                                        }}
                                                        customInput={Input}
                                                        dica='Digite seu RG'
                                                        obrigatorio
                                                        nome='rg'
                                                        cabecalho 
                                                        cabecalhoTexto='RG'
                                                        name='rg'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        qtdMaxAcompanhantes > 0 &&
                                        <>
                                            <div className='campos-dados-convidado'>
                                                <h2 className='titulo-dados'>Quantos acompanhantes? <span className='subtitulo-dados'>Limite para este convite: {qtdMaxAcompanhantes}</span></h2>
                                                <p className='instrucao-dados'>
                                                    Caso vá levar acompanhantes, informe a quantidade que estará com você no evento. Em seguida, preencha os dados de cada um nos campos que serão exibidos abaixo.
                                                </p>
                                                <div className='confirmar-presenca__acompanhantes'>
                                                    <label htmlFor='acompanhantes' className='confirmar-presenca__acompanhantes-texto'>Acompanhantes</label>
                                                    <InputQuantidade 
                                                        qtdMaxima={qtdMaxAcompanhantes} 
                                                        qtdAtual={qtdAcompanhantes} 
                                                        setQtdAtual={setQtdAcompanhantes}
                                                        name='acompanhantes'
                                                    />
                                                </div>
                                            </div>
                                            {
                                                Array.from({ length: qtdAcompanhantes }).map((_, index) => (
                                                    <div className='campos-dados-convidado' key={index}>
                                                        <h2 className='titulo-dados'>Acompanhante {qtdAcompanhantes > 1 && `${index+1}/${qtdAcompanhantes}`}</h2>
                                                        <div className='confirmar-presenca__campos'>
                                                            <div className='input-texto-dados'>
                                                                <Input 
                                                                    value={acompanhantes[index]?.nome || ''} 
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAcompanhantes(prev => prev.map((acomp, i) => i === index ? { ...acomp, nome: e.target.value } : acomp))}
                                                                    type='text'
                                                                    dica='Digite seu nome' 
                                                                    obrigatorio 
                                                                    cabecalho 
                                                                    cabecalhoTexto='Nome'
                                                                    name={`nome-acompanhante${index}`}
                                                                    pattern="([A-Za-zÀ-ÖØ-öø-ÿ]+(\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*)+"
                                                                    title="Nome deve conter apenas letras"
                                                                />
                                                            </div>
                                                            <div className='input-texto-dados'>
                                                                <Input 
                                                                    value={acompanhantes[index]?.email || ''} 
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAcompanhantes(prev => prev.map((acomp, i) => i === index ? { ...acomp, email: e.target.value } : acomp))}
                                                                    type='email' 
                                                                    dica='Digite seu email' 
                                                                    obrigatorio 
                                                                    cabecalho 
                                                                    cabecalhoTexto='E-mail'
                                                                    name={`email-acompanhante${index}`}
                                                                    autoComplete="email"
                                                                />
                                                            </div>
                                                            <div className='input-texto-dados'>
                                                                <Input 
                                                                    value={acompanhantes[index]?.dataNascimento || ''} 
                                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAcompanhantes(prev => prev.map((acomp, i) => i === index ? { ...acomp, dataNascimento: e.target.value } : acomp))}
                                                                    type='date' 
                                                                    dica='Digite sua data de nascimento' 
                                                                    obrigatorio 
                                                                    max={new Date().toISOString().split('T')[0]} 
                                                                    cabecalho 
                                                                    cabecalhoTexto='Data de nascimento'
                                                                    name={`data-nascimento-acompanhante${index}`}
                                                                />
                                                            </div>
                                                            <div className='input-texto-dados'>
                                                                <div className='tamanho-input-convidado'>
                                                                    <PatternFormat
                                                                        format="##.###.###-#"
                                                                        mask="_"
                                                                        value={acompanhantes[index]?.rg || ''} 
                                                                        onValueChange={(values) => {
                                                                            setAcompanhantes(prev => prev.map((acomp, i) => i === index ? { ...acomp, rg: values.value } : acomp))
                                                                        }}
                                                                        customInput={Input}
                                                                        dica='Digite seu RG'
                                                                        obrigatorio
                                                                        nome='rg'
                                                                        cabecalho 
                                                                        cabecalhoTexto='RG'
                                                                        name={`rg-acompanhante${index}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='input-texto-dados'>
                                                                <div className='tamanho-input-convidado'>
                                                                    <Select 
                                                                        cabecalho
                                                                        cabecalhoTexto = 'Relação'
                                                                        textoPadrao = 'Selecione a relação'
                                                                        esconderValorPadrao
                                                                        required
                                                                        value={acompanhantes[index]?.relacao || ''} 
                                                                        onChange = {(e: React.ChangeEvent<HTMLSelectElement>)=>{
                                                                            setAcompanhantes(prev => prev.map((acomp, i) => i === index ? { ...acomp, relacao: e.target.value } : acomp))
                                                                        }}
                                                                        name={`relacao-acompanhante${index}`}
                                                                    >
                                                                        {relacionamentos.map((relacao, index) => <option key={index.toString()} value={relacao}>{relacao}</option>)}
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </>
                                    }
                                    <div className='confirmar-presenca__botao-container'>
                                        <div className='confirmar-presenca__botao-enviar'>
                                            <Botao tamanho='max' texto='Enviar' submit></Botao>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        :
                        <>
                            <div className="convite-utilizado">
                                <h1>Convite já utilizado</h1>
                                <p>Infelizmente, o convite que você está tentando acessar já foi utilizado. Caso tenha dúvidas, entre em contato com o organizador do evento e solicite um novo convite.</p>
                            </div>
                        </>
                    }
                </div>        
            }
            {
                usadoAgora &&
                <div className='convite-usado__alerta'>
                    <Alerta texto="Presença confirmada! Aguarde aprovação do organizador!" status="sucesso" ativado={true} />
                </div>
            }
        </div>
    )
}

export default ConfirmarPresenca