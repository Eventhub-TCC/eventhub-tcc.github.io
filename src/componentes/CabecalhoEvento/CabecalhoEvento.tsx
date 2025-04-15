import './CabecalhoEvento.css'
import Botao from '../../componentes/Botao/Botao'
import { NavLink } from 'react-router'

const CabecalhoEvento = ({
    EnviaModoEdicao,
    EnviaModoApagar,
    tituloEvento,
    dataEvento,
    horaInicio,
    horaFim,
    localEvento,
    idEvento
  }: any) => {
    return (
      <div className="cabecalho-eventos">
        <div className="titulo-infos-eventos">
          <div className="titulo-botoes">
            <div className="titulo-do-evento">
              <h1>{tituloEvento}</h1>
            </div>
            <div className="botoes-evento">
              <Botao
                texto="Editar evento"
                tamanho="med"
                tipo="botao"
                funcao={() => EnviaModoEdicao(true)}
              />
              <Botao
                texto="Apagar evento"
                tamanho="med"
                tipo="botao"
                funcao={() => EnviaModoApagar(true)}
              />
            </div>
            </div>
            <div className="informacoes-evento">
                <div className='alinhamento-info-icone'>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M6.78125 15.0677V15M10.7188 15.0677V15M10.7188 11.4V11.3323M14.2188 11.4V11.3323M4.15625 7.79997H16.4063M5.73958 2.625V3.97516M14.6563 2.625V3.97499M14.6563 3.97499H5.90625C4.4565 3.97499 3.28125 5.18382 3.28125 6.67498V15.675C3.28125 17.1662 4.4565 18.375 5.90625 18.375H14.6562C16.106 18.375 17.2812 17.1662 17.2812 15.675L17.2813 6.67498C17.2813 5.18382 16.106 3.97499 14.6563 3.97499Z" stroke="#55379D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                    {dataEvento}
                </div>
                <div className='alinhamento-info-icone'>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M13.5744 13.4174C14.0983 13.5921 14.6647 13.3089 14.8393 12.785C15.014 12.261 14.7308 11.6947 14.2069 11.5201L13.5744 13.4174ZM10.9375 11.4844H9.9375C9.9375 11.9148 10.2129 12.2969 10.6213 12.4331L10.9375 11.4844ZM11.9375 7.36826C11.9375 6.81598 11.4898 6.36826 10.9375 6.36826C10.3852 6.36826 9.9375 6.81598 9.9375 7.36826H11.9375ZM14.2069 11.5201L11.2537 10.5357L10.6213 12.4331L13.5744 13.4174L14.2069 11.5201ZM11.9375 11.4844V7.36826H9.9375V11.4844H11.9375ZM17.8125 10.5C17.8125 14.297 14.7345 17.375 10.9375 17.375V19.375C15.839 19.375 19.8125 15.4015 19.8125 10.5H17.8125ZM10.9375 17.375C7.14054 17.375 4.0625 14.297 4.0625 10.5H2.0625C2.0625 15.4015 6.03597 19.375 10.9375 19.375V17.375ZM4.0625 10.5C4.0625 6.70304 7.14054 3.625 10.9375 3.625V1.625C6.03597 1.625 2.0625 5.59847 2.0625 10.5H4.0625ZM10.9375 3.625C14.7345 3.625 17.8125 6.70304 17.8125 10.5H19.8125C19.8125 5.59847 15.839 1.625 10.9375 1.625V3.625Z" fill="#55379D"/>
                </svg>
                    {horaInicio} - {horaFim}
                </div>
                <div className='alinhamento-info-icone'>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M10.4999 18.8996C10.4999 18.8996 17.0739 13.0561 17.0739 8.67352C17.0739 5.04285 14.1306 2.09961 10.4999 2.09961C6.86927 2.09961 3.92603 5.04285 3.92603 8.67352C3.92603 13.0561 10.4999 18.8996 10.4999 18.8996Z" stroke="#55379D" stroke-width="2"/>
                    <path d="M12.6002 8.39974C12.6002 9.55954 11.66 10.4997 10.5002 10.4997C9.34041 10.4997 8.40021 9.55954 8.40021 8.39974C8.40021 7.23994 9.34041 6.29974 10.5002 6.29974C11.66 6.29974 12.6002 7.23994 12.6002 8.39974Z" stroke="#55379D" stroke-width="2"/>
                </svg>
                    {localEvento}
                </div>
            </div>
        </div>
        <div className="abas-evento">
            <NavLink 
                to={`/meus-eventos/${idEvento}/informacoes-meus-eventos`} 
                className={({isActive}: any) => (`aba-evento ${isActive ? "aba-evento--ativo" : ''}`)} >
                Informações Gerais
            </NavLink>
            <NavLink 
                to={`/meus-eventos/${idEvento}/convidados`} 
                className={({isActive}: any) => (`aba-evento ${isActive ? "aba-evento--ativo" : ''}`)} >
                Convidados
            </NavLink>
            <NavLink 
                to={`/meus-eventos/${idEvento}/pedidos`} 
                className={({isActive}: any) => (`aba-evento ${isActive ? "aba-evento--ativo" : ''}`)} >
                Pedidos
            </NavLink>
            

        </div>
    </div>
  )
}

export default CabecalhoEvento