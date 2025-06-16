import { Helmet } from 'react-helmet-async'
import CabecalhoUsuario from '../../componentes/CabecalhoUsuario/CabecalhoUsuario'
import './FAQ.css'
import CardPergunta from '../../componentes/CardPergunta/CardPergunta'

const FAQ = () => {
  return (
        <>
            <Helmet>
                <title>FAQ | EventHub</title>
            </Helmet>
            <div className='FAQ-pagina'>
                <div>
                    <CabecalhoUsuario/>
                    <div className="FAQ__topo">
                        <div className="FAQ__titulo-pagina">
                            PRINCIPAIS DÚVIDAS
                        </div>
                    </div>
                </div>
                <div className="FAQ__conteudo">
                    <CardPergunta 
                    pergunta="O que é o EventHub?" 
                    resposta="O EventHub é uma plataforma digital desenvolvida para facilitar a organização de eventos, permitindo gestão de convidados e convites, confirmar presença dos convidados, baixar lista de convidados, agendar seus eventos, além de possuir uma aba MarketPlace, conectando organizadores a prestadores de serviços como buffet, som, decoração, fotografia e demais serviços ou produtos, como salgados, doces, bolos, entre outros." 
                    />

                    <CardPergunta 
                    pergunta="Quem pode usar a plataforma?" 
                    resposta="Qualquer pessoa pode usar nossa plataforma. Nela, você pode exercer duas funções: organizar seus eventos — mesmo sem experiência na área, pois a plataforma auxilia na criação, gestão de convites e contratação de serviços; ou prestar serviços — anunciando seus produtos ou serviços no marketplace, tornando-os visíveis para os organizadores de eventos." 
                    />

                    <CardPergunta 
                    pergunta='O que é um "Organizador de Eventos" na plataforma?' 
                    resposta='“Organizador de Eventos” é como chamamos qualquer usuário (com ou sem experiência na área) que se cadastrou com a função de "Organizar Eventos". Na plataforma, esse usuário pode criar eventos, gerar e gerenciar convites, confirmar presenças, baixar listas de presença, contratar serviços no marketplace e administrar seus pedidos.' 
                    />

                    <CardPergunta 
                    pergunta='O que é um "Prestador de Serviços" na plataforma?' 
                    resposta='“Prestador de Serviços” é qualquer usuário que se cadastrou com a função de "Prestar Serviços". Ele pode criar e anunciar não apenas serviços relacionados a eventos, mas também produtos, como doces, salgados, bolos, entre outros. Além disso, pode gerenciar os pedidos recebidos por seus anúncios.' 
                    />

                    <CardPergunta 
                    pergunta="Quais tipos de eventos podem ser criados no EventHub?" 
                    resposta="É possível cadastrar eventos corporativos, sociais, acadêmicos, aniversários, casamentos, feiras, entre outros. A plataforma é flexível para atender a diferentes tipos de eventos." 
                    />

                    <CardPergunta 
                    pergunta="Quais tipos de serviços podem ser anunciados no EventHub?" 
                    resposta='Apesar da denominação "Serviço", no EventHub é possível anunciar tanto serviços quanto produtos relacionados a eventos — como alimentação, decoração, fotografia, espaços para eventos, DJs e outras categorias associadas.' 
                    />

                    <CardPergunta 
                    pergunta="É possível, com apenas uma conta, organizar eventos e prestar serviços?" 
                    resposta='Sim. Na nossa plataforma, um usuário pode exercer ambas as funções simultaneamente. Ao efetuar login com uma conta que tenha sido cadastrada para as duas funções, será exibido no modal de perfil o botão "Alternar Função". Ao clicar, o usuário será direcionado para a interface de prestador de serviços ou de organizador de eventos, conforme a função ativa no momento da troca.' 
                    />

                    <CardPergunta 
                    pergunta="Como faço para completar meu cadastro para exercer ambas as funções na plataforma (após já ter me cadastrado)?" 
                    resposta='No EventHub, na página "Meu Perfil", é possível visualizar uma notificação (ícone de sino com fundo amarelo ou roxo, dependendo da sua função). Ao clicar nesse botão, um modal de complementação de cadastro será exibido. Após preencher os dados faltantes, sua conta estará habilitada para atuar tanto como organizador quanto como prestador de serviços na plataforma.' 
                    />

                </div>
            </div>
    
        </>
  )
}

export default FAQ