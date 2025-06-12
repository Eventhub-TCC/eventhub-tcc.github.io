import CabecalhoUsuario from '../../componentes/CabecalhoUsuario/CabecalhoUsuario'
import './PoliticasTermos.css'

const PoliticasTermos = () => {
  return (
    <div className='politicas-termos__pagina'>
        <div>
            <CabecalhoUsuario/>
            <div className="politicas-termos__topo">
                <div className="politicas-termos">
                    POLITICAS E TERMOS DA PLATAFORMA
                </div>
            </div>
        </div>
        <div className="politicas-termos__conteudo">
            <div className='politicas-termos__container'>
                <div className="politicas-termos__cabecalho">
                    <div className="politicas-termos__atualizacoes">
                        Última atualização: 09 de junho de 2025
                    </div>
                    <div className="politicas-termos__titulo">
                        Termo de Consentimento Livre e Esclarecido (TCLE)
                    </div>
                </div>
                <div className="politicas-termos__topicos">
                    <div className="politicas-termos__textos">
                    {'Você está sendo convidado(a) a utilizar a plataforma EventHub, que tem como objetivo facilitar a organização de eventos e a contratação de serviços para esses eventos.\n\nA sua participação é voluntária, e sua privacidade e segurança são prioridades para nós.\n\nAo aceitar este termo, você declara estar ciente de que:\n\n'}
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">1. Finalidade da Coleta de Dados:</div>
                        <div className="politicas-termos__textos">
                            Seus dados pessoais (como nome, e-mail, CPF, telefone, entre outros) serão coletados para fins de autenticação, personalização de serviços, gestão de convites, contratos de serviço e geração de relatórios para os organizadores dos eventos.
                        </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">2. Uso e Compartilhamento:</div>
                        <div className="politicas-termos__textos">
                            Os dados fornecidos poderão ser acessados apenas pelos administradores da plataforma e pelos organizadores dos eventos nos quais você participar. Nenhum dado será comercializado ou compartilhado com terceiros sem seu consentimento.
                        </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">3. Segurança da Informação:</div>
                        <div className="politicas-termos__textos">
                            As senhas serão protegidas por meio de criptografia, autenticação segura e acesso restrito a usuários autorizados.                </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">4. Sigilo e Confidencialidade:</div>
                        <div className="politicas-termos__textos">
                            Todos os dados serão mantidos sob sigilo, sendo utilizados apenas para os fins descritos neste termo.                </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">5. Direito de Revogação:</div>
                        <div className="politicas-termos__textos">
                            Você pode, a qualquer momento, solicitar a exclusão de seus dados da plataforma ou revogar este consentimento, bastando entrar em contato com o suporte técnico da EventHub.                </div>
                    </div>
                </div>
            </div>
            <div className='politicas-termos__container'>
                <div className="politicas-termos__cabecalho">
                    <div className="politicas-termos__atualizacoes">
                        Última atualização: 09 de junho de 2025
                    </div>
                    <div className="politicas-termos__titulo">
                        POLITICAS DE PRIVACIDADE
                    </div>
                </div>
                <div className="politicas-termos__topicos">
                    <div className="politicas-termos__textos">
                        Na EventHub, levamos sua privacidade a sério.                
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">1. Coleta de Dados:</div>
                        <div className="politicas-termos__textos">
                            Coletamos apenas os dados estritamente necessários para oferecer os serviços da plataforma, como nome, e-mail, CPF, telefone e informações de eventos.                    </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">2. Uso dos Dados:</div>
                        <div className="politicas-termos__textos">
                            Seus dados são utilizados exclusivamente para a operação do sistema, envio de comunicações, confirmação de participação em eventos e geração de relatórios. Não comercializamos nem repassamos seus dados a terceiros.                    </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">3. Armazenamento e Segurança:</div>
                        <div className="politicas-termos__textos">
                            Utilizamos autenticação por token (JWT) e boas práticas de segurança para proteger suas informações. O acesso aos dados é restrito a usuários autorizados.                </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">4. Direitos do Usuário:</div>
                        <div className="politicas-termos__textos">
                            Você pode solicitar a exclusão física dos seus dados ou revogar o consentimento a qualquer momento, entrando em contato com o nosso suporte.                </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">5. Alterações:</div>
                        <div className="politicas-termos__textos">
                            Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre disponível na plataforma.                </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PoliticasTermos