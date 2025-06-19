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

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>EventHub - Transforme seus eventos em experiências inesquecíveis!</title>
            </Helmet>
            <header className='home__cabecalho'>
                <div className='container'>
                    <div className='home__cabecalho-container'>
                        <Link to='/' className='home__cabecalho-link'>
                            <div className='home__cabecalho-container-logo'>
                                <img src={logo} alt="Logotipo do EventHub" className='home__cabecalho-logo'/>
                            </div>
                        </Link>
                        {/* <div className='home__cabecalho-secoes'>
                            <Link to=''>Início</Link>
                            <Link to=''>O que é?</Link>
                            <Link to=''>Como usar?</Link>
                            <Link to=''>Funcionalidades</Link>
                        </div> */}
                        <div className='home__cabecalho-botoes'>
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
                            <div>
                                <img src={banner} alt="Organizadora de eventos e prestador de serviços conversando em frente à uma mesa com um bolo de aniversário" className='home__banner-imagem'/>
                            </div>
                        </div>
                    </div>
                    <div className='home__banner-divisor-cabecalho home__banner-divisor-cabecalho--baixo'></div>
                </section>
                <div className='home__banner-divisor-amarelo'></div>
                <section className='home__oquee'>
                    <div className='home__banner-divisor-cabecalho home__banner-divisor-cabecalho--cima'></div>
                    <div className='container'>
                        <div className='home__oquee-container'>
                            <h2 className='home__oquee-titulo'>O que é o EventHub?</h2>
                            <div className='home__oquee-container-texto'>
                                <img src={logoOrganizador} alt="Logotipo do EventHub roxo" className='home__oquee-logo'/>
                                <div>
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
                                <div>
                                    <p className='home__oquee-texto'>
                                        Além disso, o EventHub também conecta prestadores de serviço — como quem faz doces, tira fotos, aluga equipamentos ou decora festas — com quem está organizando. Tudo em um único lugar, de forma integrada.
                                    </p>
                                    <p className='home__oquee-texto'>
                                        Nosso propósito é unir pessoas, ideias e serviços em torno de experiências que realmente importam. Seja para celebrar ou apenas reunir quem você gosta, o EventHub está aqui para ajudar.
                                    </p>
                                </div>
                                <img src={logoPrestador} alt="Logotipo do EventHub amarelo" className='home__oquee-logo'/>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='home__como-usar'>
                    <h2 className='home__como-usar-titulo'>Como usar a plataforma?</h2>
                    <div className='home__como-usar-organizador home__como-usar-overlay'>
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
                    <div className='home__como-usar-prestador home__como-usar-overlay'>
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
                </section>
            </main>
        </>
    )
}

export default Home;