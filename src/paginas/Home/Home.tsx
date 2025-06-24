import { Helmet } from 'react-helmet-async';
import './Home.css';
import { Link, useNavigate } from 'react-router';
import logo from '../../assets/logo_eventhub_fonte_branca.png';
import banner from '../../assets/banner-home.png';
import logoOrganizador from '../../assets/logo_eventhub-sem-fundo.png';
import logoPrestador from '../../assets/eventhub_logo_prestador.png';
import desenhoOrganizador from '../../assets/home-imagem-organizador.png';
import desenhoPrestador from '../../assets/home-imagem-prestador.png';
import Botao from '../../componentes/Botao/Botao';
import { useEffect, useRef, useState } from 'react';

const Home = () => {
    const [cabecalhoFixo, setCabecalhoFixo] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);
    const [corBarraNavegador, setCorBarraNavegador] = useState('#F3C623');
    const [alturaCabecalho, setAlturaCabecalho] = useState(0);
    const navigate = useNavigate();
    const cabecalhoRef = useRef<HTMLDivElement>(null);
    const secoesRef: any = {
        inicio: useRef<HTMLElement>(null),
        oqueE: useRef<HTMLElement>(null),
        comoUsar: useRef<HTMLElement>(null),
        funcionalidades: useRef<HTMLElement>(null),
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            setAlturaCabecalho(cabecalhoRef.current!.offsetHeight);
        });

        if (cabecalhoRef.current) {
            resizeObserver.observe(cabecalhoRef.current);
        }

        const scroll = () => {
            if (secoesRef.oqueE.current) {
                const top = secoesRef.oqueE.current.getBoundingClientRect().top;
                if(top <= 0.5) {
                    setCabecalhoFixo(true);
                    setCorBarraNavegador('#8C5DFF');
                }
                else {
                    setCabecalhoFixo(false);
                    setCorBarraNavegador('#F3C623');
                }
            }
        };

        window.addEventListener("scroll", scroll);
        return () => {
            window.removeEventListener("scroll", scroll);
            resizeObserver.disconnect();
        }
    }, []);

    const rolarParaSecao = (secao: string) => {
        setMenuAberto(false);
        secoesRef[secao]?.current?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <>
            <Helmet>
                <title>EventHub - Transforme seus eventos em experiências inesquecíveis!</title>
                <meta name="theme-color" content={corBarraNavegador} />
                <meta name="apple-mobile-web-app-status-bar-style" content={corBarraNavegador} />
                <meta name="msapplication-navbutton-color" content={corBarraNavegador} />
            </Helmet>
            {cabecalhoFixo && <div style={{ height: alturaCabecalho }} ref={secoesRef.inicio}></div>} 
            <header className={`home__cabecalho ${cabecalhoFixo ? 'home__cabecalho-scroll' : ''}`} ref={cabecalhoRef}>
                <div className='container'>
                    <div className='home__cabecalho-container'>
                        <button className='home__cabecalho-botao' type='button' onClick={() => rolarParaSecao('inicio')}>
                            <div className='home__cabecalho-container-logo'>
                                <img src={logo} alt="Logotipo do EventHub" className='home__cabecalho-logo'/>
                            </div>
                        </button>
                        <div className={`home__cabecalho-secoes ${!menuAberto ? 'home__cabecalho-secoes--mobile-fechado' : ''}`}>
                            <button type='button' onClick={() => rolarParaSecao('inicio')}>Início</button>
                            <button type='button' onClick={() => rolarParaSecao('oqueE')}>O que é?</button>
                            <button type='button' onClick={() => rolarParaSecao('comoUsar')}>Como usar?</button>
                            <button type='button' onClick={() => rolarParaSecao('funcionalidades')}>Funcionalidades</button>
                            <div className='home__cabecalho-botoes-acoes-mobile'>
                                <div>
                                    <Botao
                                        texto="Criar conta"
                                        funcao={() => navigate('/cadastro')}
                                    />
                                </div>
                                <div>
                                    <Botao
                                        texto="Entrar"
                                        funcao={() => navigate('/login')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='home__cabecalho-botoes'>
                            <div className="home__cabecalho-botoes-acoes-pc">
                                <div>
                                    <Botao
                                        texto="Criar conta"
                                        funcao={() => navigate('/cadastro')}
                                    />
                                </div>
                                <div>
                                    <Botao
                                        texto="Entrar"
                                        funcao={() => navigate('/login')}
                                    />
                                </div>
                            </div>
                            <button type='button' className={`home__cabecalho-menu-mobile ${menuAberto ? 'home__cabecalho-menu-mobile--ativo' : ''}`} onClick={() => setMenuAberto(!menuAberto)}>
                                <div className='home__cabecalho-menu-linha1'></div>
                                <div className='home__cabecalho-menu-linha2'></div>
                                <div className='home__cabecalho-menu-linha3'></div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <section className='home__banner'>
                    <div className='home__banner-divisor-cabecalho home__banner-divisor-cabecalho--cima'></div>
                    <div className='container'>
                        <div className='home__banner-container'>
                            <div className='home__banner-container-info'>
                                <h1 className='home__banner-titulo'>Transforme seus eventos em experiências inesquecíveis!</h1>
                                <p className='home__banner-descricao'>
                                    De convites a serviços contratados, aqui você organiza cada detalhe do seu evento e encontra os melhores prestadores de serviço em um só lugar.
                                </p>
                                <div className='home__banner-botao'>
                                    <Botao
                                        tamanho="max"
                                        cor="var(--yellow-700)"
                                        texto="Começar agora"
                                        funcao={() => navigate('/cadastro')}
                                    />
                                </div>
                            </div>
                            <div className='home__banner-container-imagem'>
                                <img src={banner} alt="Organizadora de eventos e prestador de serviços conversando em frente à uma mesa com um bolo de aniversário" className='home__banner-imagem'/>
                            </div>
                        </div>
                    </div>
                    <div className='home__banner-divisor-cabecalho home__banner-divisor-cabecalho--baixo'></div>
                </section>
                <div className='home__banner-divisor-amarelo'></div>
                <section className='home__oquee' ref={secoesRef.oqueE}>
                    <div className='home__banner-divisor-cabecalho home__banner-divisor-cabecalho--cima'></div>
                    <div className='container'>
                        <div className='home__oquee-container'>
                            <h2 className='home__oquee-titulo'>O que é o EventHub?</h2>
                            <div className='home__oquee-container-texto'>
                                <div className='home__oquee-container-logo'>
                                    <img src={logoOrganizador} alt="Logotipo do EventHub roxo" className='home__oquee-logo'/>
                                </div>
                                <div className='home__oquee-textos'>
                                    <p className='home__oquee-texto'>
                                        O EventHub é uma plataforma criada para facilitar a vida de quem deseja organizar momentos especiais com amigos e família.
                                    </p>
                                    <p className='home__oquee-texto'>
                                        Nosso objetivo é tornar o planejamento de eventos algo simples, acessível e sem complicações — mesmo para quem nunca organizou nada antes.
                                    </p>
                                    <p className='home__oquee-texto'>
                                        Se você vai reunir pessoas para comemorar, celebrar ou apenas se encontrar, o EventHub está aqui para ajudar.
                                    </p>
                                    <p className='home__oquee-texto'>
                                        Acreditamos que qualquer pessoa pode ser um organizador e que boas experiências são feitas de conexões reais. Por isso, construímos um espaço digital onde todos possam se sentir à vontade para planejar com liberdade e praticidade.
                                    </p>
                                </div>
                            </div>
                            <div className='home__oquee-container-texto'>
                                <div className='home__oquee-textos'>
                                    <p className='home__oquee-texto'>
                                        Além disso, o EventHub também conecta prestadores de serviço — como quem faz doces, tira fotos, aluga equipamentos ou decora festas — com quem está organizando. Tudo em um único lugar, de forma integrada.
                                    </p>
                                    <p className='home__oquee-texto'>
                                        Nosso propósito é unir pessoas, ideias e serviços em torno de experiências que realmente importam. Seja para celebrar ou apenas reunir quem você gosta, o EventHub está aqui para ajudar.
                                    </p>
                                </div>
                                <div className='home__oquee-container-logo'>
                                    <img src={logoPrestador} alt="Logotipo do EventHub amarelo" className='home__oquee-logo'/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='home__como-usar-divisor--pc'>
                            <div className='home__como-usar-divisor home__como-usar-divisor--organizador home__como-usar-divisor--baixo'></div>
                            <div className='home__como-usar-divisor home__como-usar-divisor--prestador home__como-usar-divisor--baixo'></div>
                        </div>
                        <div className='home__como-usar-divisor--mobile'>
                            <div className='home__como-usar-divisor home__como-usar-divisor--organizador home__como-usar-divisor--baixo'></div>
                            <div className='home__como-usar-divisor home__como-usar-divisor--organizador home__como-usar-divisor--baixo'></div>
                        </div>
                    </div>
                </section>
                <section className='home__como-usar' ref={secoesRef.comoUsar}>
                    <h2 className='home__como-usar-titulo'>Como usar a plataforma?</h2>
                    <div className='home__como-usar-organizador home__como-usar-overlay'>
                        <div className="home__como-usar-container">
                            <div className='home__como-usar-card home__como-usar-card--organizador'>
                                <img src={desenhoOrganizador} alt="Desenho de uma mulher organizadora de eventos" />
                                <h3 className='home__como-usar-card-titulo'>Organizador de eventos</h3>
                                <div className='home__como-usar-container-texto'>
                                    <p className='home__como-usar-card-texto'>
                                        Você não precisa ser um profissional para organizar uma festa.
                                    </p>
                                    <p className='home__como-usar-card-texto'>
                                        Se vai fazer um aniversário, um chá de bebê, um churrasco ou qualquer comemoração, você já é um organizador!
                                    </p>
                                    <p className='home__como-usar-card-texto'>
                                        No EventHub, qualquer pessoa pode criar seu evento, enviar convites, acompanhar os confirmados e contratar serviços com facilidade.
                                    </p>
                                </div>
                                <div className='home__como-usar-frase-container'>
                                    <span className='home__como-usar-frase-detalhe home__como-usar-frase-detalhe--organizador'></span>
                                    <p className='home__como-usar-frase'>É simples, acessível e feito para todos.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='home__como-usar-prestador home__como-usar-overlay'>
                        <div className="home__como-usar-container">
                            <div className='home__como-usar-card home__como-usar-card--prestador'>
                                <img src={desenhoPrestador} alt="Desenho de uma mulher organizadora de eventos" />
                                <h3 className='home__como-usar-card-titulo'>Prestador de serviços</h3>
                                <div className='home__como-usar-container-texto'>
                                    <p className='home__como-usar-card-texto'>
                                        Você faz doces, tira fotos, aluga itens para festa, decora, cozinha ou ajuda de alguma forma em eventos?
                                    </p>
                                    <p className='home__como-usar-card-texto'>
                                        Então você pode ser um prestador de serviços no EventHub!
                                    </p>
                                    <p className='home__como-usar-card-texto'>
                                        Anuncie o que você oferece e seja encontrado por organizadores que precisam exatamente disso.
                                    </p>
                                </div>
                                <div className='home__como-usar-frase-container'>
                                    <span className='home__como-usar-frase-detalhe home__como-usar-frase-detalhe--prestador'></span>
                                    <p className='home__como-usar-frase'>Não importa o tamanho do serviço, o que importa é fazer parte.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='home__funcionalidades' ref={secoesRef.funcionalidades}>
                    <div>
                        <div className='home__como-usar-divisor--pc'>
                            <div className='home__como-usar-divisor home__como-usar-divisor--organizador home__como-usar-divisor--cima'></div>
                            <div className='home__como-usar-divisor home__como-usar-divisor--prestador home__como-usar-divisor--cima'></div>
                        </div>
                        <div className='home__como-usar-divisor--mobile'>
                            <div className='home__como-usar-divisor home__como-usar-divisor--prestador home__como-usar-divisor--cima'></div>
                            <div className='home__como-usar-divisor home__como-usar-divisor--prestador home__como-usar-divisor--cima'></div>
                        </div>
                    </div>
                    <div className="home__funcionalidades-organizador">
                        <div className="container">
                            <h2 className='home__funcionalidades-titulo'>Funcionalidades</h2>
                            <div className='home__funcionalidades-container'>
                                <div className="row g-5">
                                    <div className="col-12 col-md-6 home__funcionalidades-container-cards">
                                        <div className='home__funcionalidades-card home__funcionalidades-card--organizador'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                                <path d="M38.4 40.374V39.8571M38.3987 32.3663V31.8494M38.3987 24.3926V23.8757M13.3647 9.22607H32.0028C32.1087 12.9996 35.2009 16.0261 39 16.0261C42.7991 16.0261 45.8913 12.9996 45.9972 9.22607H50.6353C56.2491 9.22607 60.8 13.777 60.8 19.3908V44.6093C60.8 50.2231 56.2491 54.774 50.6353 54.774H45.9972C45.8913 51.0005 42.7991 47.974 39 47.974C35.2009 47.974 32.1087 51.0005 32.0028 54.774H13.3648C7.75094 54.774 3.20005 50.2231 3.20005 44.6093L3.20001 19.3908C3.20001 13.777 7.75091 9.22607 13.3647 9.22607Z" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <h3 className='home__funcionalidades-card-titulo'>Crie e gerencie eventos</h3>
                                            <p className='home__funcionalidades-card-texto'>
                                                Organize seus eventos com facilidade, do início ao fim.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 home__funcionalidades-container-cards">
                                        <div className='home__funcionalidades-card home__funcionalidades-card--organizador'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                                <g clipPath="url(#clip0_1_229)">
                                                    <path d="M2.01249 32.525C-0.812511 34.1375 -0.550011 38.4375 2.46249 39.6875L20 47V59.9125C20 62.175 21.825 64 24.0875 64C25.3 64 26.45 63.4625 27.225 62.525L34.975 53.2375L50.4625 59.6875C52.825 60.675 55.5625 59.125 55.95 56.6L63.95 4.59999C64.1875 3.08749 63.525 1.56249 62.2625 0.69999C61 -0.16251 59.35 -0.23751 58.0125 0.52499L2.01249 32.525ZM8.52499 35.7125L51.2125 11.325L23.7625 42L23.9125 42.125L8.52499 35.7125ZM50.4125 53.175L29.5875 44.4875L56.35 14.575L50.4125 53.175Z" fill="white"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1_229">
                                                    <rect width="64" height="64" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <h3 className='home__funcionalidades-card-titulo'>Envie convites por link</h3>
                                            <p className='home__funcionalidades-card-texto'>
                                                Crie e compartilhe convites com seus convidados de forma prática e digital.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-5">
                                    <div className="col-12 col-md-6 home__funcionalidades-container-cards">
                                        <div className='home__funcionalidades-card home__funcionalidades-card--organizador'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="64" viewBox="0 0 80 64" fill="none">
                                                <g clipPath="url(#clip0_1_236)">
                                                    <path d="M18 0C20.6522 0 23.1957 1.05357 25.0711 2.92893C26.9464 4.8043 28 7.34784 28 10C28 12.6522 26.9464 15.1957 25.0711 17.0711C23.1957 18.9464 20.6522 20 18 20C15.3478 20 12.8043 18.9464 10.9289 17.0711C9.05357 15.1957 8 12.6522 8 10C8 7.34784 9.05357 4.8043 10.9289 2.92893C12.8043 1.05357 15.3478 0 18 0ZM64 0C66.6522 0 69.1957 1.05357 71.0711 2.92893C72.9464 4.8043 74 7.34784 74 10C74 12.6522 72.9464 15.1957 71.0711 17.0711C69.1957 18.9464 66.6522 20 64 20C61.3478 20 58.8043 18.9464 56.9289 17.0711C55.0536 15.1957 54 12.6522 54 10C54 7.34784 55.0536 4.8043 56.9289 2.92893C58.8043 1.05357 61.3478 0 64 0ZM0 37.3375C0 29.975 5.975 24 13.3375 24H18.675C20.6625 24 22.55 24.4375 24.25 25.2125C24.0875 26.1125 24.0125 27.05 24.0125 28C24.0125 32.775 26.1125 37.0625 29.425 40C29.4 40 29.375 40 29.3375 40H2.6625C1.2 40 0 38.8 0 37.3375ZM50.6625 40C50.6375 40 50.6125 40 50.575 40C53.9 37.0625 55.9875 32.775 55.9875 28C55.9875 27.05 55.9 26.125 55.75 25.2125C57.45 24.425 59.3375 24 61.325 24H66.6625C74.025 24 80 29.975 80 37.3375C80 38.8125 78.8 40 77.3375 40H50.675H50.6625ZM28 28C28 24.8174 29.2643 21.7652 31.5147 19.5147C33.7652 17.2643 36.8174 16 40 16C43.1826 16 46.2348 17.2643 48.4853 19.5147C50.7357 21.7652 52 24.8174 52 28C52 31.1826 50.7357 34.2348 48.4853 36.4853C46.2348 38.7357 43.1826 40 40 40C36.8174 40 33.7652 38.7357 31.5147 36.4853C29.2643 34.2348 28 31.1826 28 28ZM16 60.6625C16 51.4625 23.4625 44 32.6625 44H47.325C56.5375 44 64 51.4625 64 60.6625C64 62.5 62.5125 64 60.6625 64H19.325C17.4875 64 15.9875 62.5125 15.9875 60.6625H16Z" fill="white"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1_236">
                                                    <rect width="80" height="64" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <h3 className='home__funcionalidades-card-titulo'>Lista de convidados</h3>
                                            <p className='home__funcionalidades-card-texto'>
                                                Confirme presenças, organize e gere sua lista de convidados com poucos cliques.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 home__funcionalidades-container-cards">
                                        <div className='home__funcionalidades-card home__funcionalidades-card--organizador'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="72" height="64" viewBox="0 0 72 64" fill="none">
                                                <path d="M68.45 12.975L61.2875 1.6375C60.65 0.625 59.5125 0 58.3 0H13.7C12.4875 0 11.35 0.625 10.7125 1.6375L3.53753 12.975C-0.162471 18.825 3.11253 26.9625 10.025 27.9C10.525 27.9625 11.0375 28 11.5375 28C14.8 28 17.7 26.575 19.6875 24.375C21.675 26.575 24.575 28 27.8375 28C31.1 28 34 26.575 35.9875 24.375C37.975 26.575 40.875 28 44.1375 28C47.4125 28 50.3 26.575 52.2875 24.375C54.2875 26.575 57.175 28 60.4375 28C60.95 28 61.45 27.9625 61.95 27.9C68.8875 26.975 72.175 18.8375 68.4625 12.975H68.45ZM62.4625 31.8625C62.4625 31.8625 62.4625 31.8625 62.45 31.8625C61.7875 31.95 61.1125 32 60.425 32C58.875 32 57.3875 31.7625 56 31.3375V48H16V31.325C14.6 31.7625 13.1 32 11.55 32C10.8625 32 10.175 31.95 9.51253 31.8625H9.50003C8.98753 31.7875 8.48753 31.7 8.00003 31.575V48V56C8.00003 60.4125 11.5875 64 16 64H56C60.4125 64 64 60.4125 64 56V48V31.575C63.5 31.7 63 31.8 62.4625 31.8625Z" fill="white"/>
                                            </svg>
                                            <h3 className='home__funcionalidades-card-titulo'>Marketplace de serviços</h3>
                                            <p className='home__funcionalidades-card-texto'>
                                                Encontre e contrate prestadores de forma simples, tudo dentro da plataforma.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="home__funcionalidades-prestador">
                        <div className='home__funcionalidades-divisor'></div>
                        <div className="container">
                            <div className='home__funcionalidades-container'>
                                <div className="row g-5">
                                    <div className="col-12 col-md-6 home__funcionalidades-container-cards">
                                        <div className='home__funcionalidades-card home__funcionalidades-card--prestador'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                                <g clipPath="url(#clip0_1_252)">
                                                    <path d="M9.825 0.625038C8.6375 -0.299962 6.95 -0.187462 5.875 0.875038L0.875002 5.87504C-0.187498 6.93754 -0.299998 8.62504 0.612502 9.82504L10.6125 22.825C11.175 23.5625 12.0625 24 12.9875 24H19.75L33.375 37.625C31.5375 41.25 32.125 45.8 35.1625 48.825L49.1625 62.825C50.725 64.3875 53.2625 64.3875 54.825 62.825L62.825 54.825C64.3875 53.2625 64.3875 50.725 62.825 49.1625L48.825 35.1625C45.8 32.1375 41.25 31.5375 37.625 33.375L24 19.75V12.9875C24 12.05 23.5625 11.175 22.825 10.6125L9.825 0.625038ZM2.4875 49.5125C0.900002 51.1 2.20095e-06 53.2625 2.20095e-06 55.5125C2.20095e-06 60.2 3.8 64 8.4875 64C10.7375 64 12.9 63.1 14.4875 61.5125L29.2125 46.7875C28.2375 44.175 28.0875 41.3375 28.7625 38.65L21.05 30.9375L2.4875 49.5125ZM64 18C64 16.6875 63.8625 15.4125 63.6 14.1875C63.3 12.7875 61.5875 12.425 60.575 13.4375L52.5875 21.425C52.2125 21.8 51.7 22.0125 51.175 22.0125L44 22C42.9 22 42 21.1 42 20V12.825C42 12.3 42.2125 11.7875 42.5875 11.4125L50.575 3.42504C51.5875 2.41254 51.225 0.700038 49.825 0.400038C48.5875 0.137538 47.3125 3.77987e-05 46 3.77987e-05C36.0625 3.77987e-05 28 8.06254 28 18V18.1L38.6625 28.7625C43.1625 27.625 48.1375 28.825 51.6625 32.35L53.625 34.3125C59.75 31.4375 64 25.2125 64 18ZM7 54C7 53.2044 7.31607 52.4413 7.87868 51.8787C8.44129 51.3161 9.20435 51 10 51C10.7957 51 11.5587 51.3161 12.1213 51.8787C12.6839 52.4413 13 53.2044 13 54C13 54.7957 12.6839 55.5587 12.1213 56.1214C11.5587 56.684 10.7957 57 10 57C9.20435 57 8.44129 56.684 7.87868 56.1214C7.31607 55.5587 7 54.7957 7 54Z" fill="white"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1_252">
                                                    <rect width="64" height="64" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <h3 className='home__funcionalidades-card-titulo'>Crie e gerencie serviços</h3>
                                            <p className='home__funcionalidades-card-texto'>
                                                Tenha controle total sobre seus serviços e mantenha tudo organizado.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 home__funcionalidades-container-cards">
                                        <div className='home__funcionalidades-card home__funcionalidades-card--prestador'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                                <g clipPath="url(#clip0_1_258)">
                                                    <path d="M60 4.00012C60 2.38762 59.025 0.925123 57.525 0.300123C56.025 -0.324877 54.3125 0.0251228 53.1625 1.16262L47.7125 6.62512C41.7125 12.6251 33.575 16.0001 25.0875 16.0001H24H20H8C3.5875 16.0001 0 19.5876 0 24.0001V36.0001C0 40.4126 3.5875 44.0001 8 44.0001V60.0001C8 62.2126 9.7875 64.0001 12 64.0001H20C22.2125 64.0001 24 62.2126 24 60.0001V44.0001H25.0875C33.575 44.0001 41.7125 47.3751 47.7125 53.3751L53.1625 58.8251C54.3125 59.9751 56.025 60.3126 57.525 59.6876C59.025 59.0626 60 57.6126 60 55.9876V37.5376C62.325 36.4376 64 33.4751 64 29.9876C64 26.5001 62.325 23.5376 60 22.4376V4.00012ZM52 13.5876V30.0001V46.4126C44.65 39.7251 35.0625 36.0001 25.0875 36.0001H24V24.0001H25.0875C35.0625 24.0001 44.65 20.2751 52 13.5876Z" fill="white"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1_258">
                                                    <rect width="64" height="64" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <h3 className='home__funcionalidades-card-titulo'>Anuncie seus serviços</h3>
                                            <p className='home__funcionalidades-card-texto'>
                                                Alcance organizadores que estão buscando exatamente o que você oferece.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="home__chamada">
                    <div className='home__chamada-divisor'></div>
                    <div className="container">
                        <div className="home__chamada-container">
                            <h2 className="home__chamada-titulo">O seu evento começa aqui.</h2>
                            <p className="home__chamada-texto">
                                Comece agora a planejar ou oferecer experiências inesquecíveis — com praticidade, criatividade e tudo que um evento precisa, em um só lugar.
                            </p>
                            <div className='home__chamada-botao'>
                                <Botao
                                    tamanho="max"
                                    texto="Começar agora"
                                    funcao={() => navigate('/cadastro')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='home__rodape-divisor'></div>
                </section>
            </main>
            <footer className='home__rodape'>
                <div className='home__rodape-infos'>
                    <div className="container">
                        <div className='home__rodape-infos-container'>
                            <div className='home__rodape-logo-links'>
                                <div className='home__rodape-logo'>
                                    <img src={logo} alt="Logotipo do EventHub" />
                                </div>
                                <nav className='home__rodape-links'>
                                    <ul>
                                        <li>
                                            <a href="mailto:eventhub25@gmail.com">E-mail de suporte</a>
                                        </li>
                                        <li>
                                            <Link to='/politicas-e-termos'>Políticas e termos</Link>
                                        </li>
                                        <li>
                                            <Link to='/faq'>FAQ</Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className='home__rodape-container-feito'>
                                <span className='home__rodape-feito-divisor'></span>
                                <p className='home__rodape-feito'>Feito com <span className='home__rodape-feito-coracao'>❤</span> por</p>
                                <span className='home__rodape-feito-divisor'></span>
                            </div>
                            <div className='home__rodape-autores'>
                                <ul>
                                    <li>
                                        <span className='home__rodape-autor-nome'>João Pedro Martins Forte</span>
                                        <div className='home__rodape-autores-links'>
                                            <a href="https://www.linkedin.com/in/joao-pedromf" target='_blank' title='LinkedIn do João Pedro'>
                                                <i className="fa-brands fa-linkedin"></i>
                                            </a>
                                            <a href="https://github.com/joaopedromf" target='_blank' title='GitHub do João Pedro'>
                                                <i className="fa-brands fa-github"></i>
                                            </a>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span className='home__rodape-autor-nome'>Matheus Alves de Paula</span>
                                            <div className='home__rodape-autores-links'>
                                                <a href="https://www.linkedin.com/in/matheus-alves-990922370" target='_blank' title='LinkedIn do Matheus Alves'>
                                                    <i className="fa-brands fa-linkedin"></i>
                                                </a>
                                                <a href="https://github.com/mapa-mundo" target='_blank' title='GitHub do Matheus Alves'>
                                                    <i className="fa-brands fa-github"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span className='home__rodape-autor-nome'>Matheus Valentim de Oliveira</span>
                                            <div className='home__rodape-autores-links'>
                                                <a href="https://www.linkedin.com/in/matheus-valentim-de-oliveira-57954b370" target='_blank' title='LinkedIn do Matheus Valentim'>
                                                    <i className="fa-brands fa-linkedin"></i>
                                                </a>
                                                <a href="https://github.com/Whitermirror72" target='_blank' title='GitHub do Matheus Valentim'>
                                                    <i className="fa-brands fa-github"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span className='home__rodape-autor-nome'>Vinícius Camargo Giacomelli</span>
                                            <div className='home__rodape-autores-links'>
                                                <a href="https://www.linkedin.com/in/vinicius-giacomelli-56580832a" target='_blank' title='LinkedIn do Vinícius Camargo'>
                                                    <i className="fa-brands fa-linkedin"></i>
                                                </a>
                                                <a href="https://github.com/Sdxvi" target='_blank' title='GitHub do Vinícius Camargo'>
                                                    <i className="fa-brands fa-github"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span className='home__rodape-autor-nome'>Vitória Helen Veloso</span>
                                            <div className='home__rodape-autores-links'>
                                                <a href="https://www.linkedin.com/in/vitoria-helen-94a18024a" target='_blank' title='LinkedIn da Vitória Helen'>
                                                    <i className="fa-brands fa-linkedin"></i>
                                                </a>
                                                <a href="https://github.com/vitoriahelen-git" target='_blank' title='GitHub da Vitória Helen'>
                                                    <i className="fa-brands fa-github"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='home__rodape-copy'>
                    <div className="container">
                        <p className='home__rodape-copy-texto'>&copy; {new Date().getFullYear()} EventHub</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Home;