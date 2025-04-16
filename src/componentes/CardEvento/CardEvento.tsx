import React from 'react'
import './CardEvento.css'
import { Link } from 'react-router'

const CardEvento = ({titulo, status='confirmado', dataEvento = 'Sem data definida', horaInicio, horaFim, endereco = 'Sem endereço definido', imagem, tipoEvento, id}:any) => {
  const corStatus = status === 'confirmado' ? 'var(--purple-700)' : status === 'em andamento' ? '#C8B757' : '#52AD58'

  return (
    <Link to={`${id}/convidados`}><div className="card-evento" style={{'--cor-status': corStatus}as React.CSSProperties}>
      <div className="card-evento__centro">
        <div className="card-evento__frente">
          <div className="card-evento__imagem" style={imagem?{backgroundImage:`url(http://localhost:3000/files/${imagem})`}:{}}>
            {!imagem ? <i className="fa-solid fa-image card-evento__sem-imagem"></i>:''} 
          </div>
          <div className="card-evento__container-titulo">
            <div className="card-evento__titulo">{titulo}</div>
          </div>
        </div>
        <div className="card-evento__verso">
          <div className="card-evento__container-info">
            <div className="card-evento__info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path className='card-evento__icone-calendario' d="M7.75 17.7202V17.6428M12.25 17.7202V17.6428M12.25 13.5286V13.4512M16.25 13.5286V13.4512M4.75 9.41425H18.75M6.55952 3.5V5.04304M16.75 3.5V5.04285M16.75 5.04285H6.75C5.09315 5.04285 3.75 6.42436 3.75 8.12855V18.4143C3.75 20.1185 5.09315 21.5 6.75 21.5H16.75C18.4069 21.5 19.75 20.1185 19.75 18.4143L19.75 8.12855C19.75 6.42436 18.4069 5.04285 16.75 5.04285Z"/>
              </svg>
              <div className="card-evento__info-texto">{dataEvento}</div>
            </div>
            <div className="card-evento__info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path className='card-evento__icone-relogio' d="M15.5588 15.6987C16.0827 15.8733 16.649 15.5902 16.8237 15.0662C16.9983 14.5423 16.7152 13.976 16.1912 13.8013L15.5588 15.6987ZM12.5 13.625H11.5C11.5 14.0554 11.7754 14.4376 12.1838 14.5737L12.5 13.625ZM13.5 8.92087C13.5 8.36858 13.0523 7.92087 12.5 7.92087C11.9477 7.92087 11.5 8.36858 11.5 8.92087H13.5ZM16.1912 13.8013L12.8162 12.6763L12.1838 14.5737L15.5588 15.6987L16.1912 13.8013ZM13.5 13.625V8.92087H11.5V13.625H13.5ZM20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5V22.5C18.0228 22.5 22.5 18.0228 22.5 12.5H20.5ZM12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5H2.5C2.5 18.0228 6.97715 22.5 12.5 22.5V20.5ZM4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5V2.5C6.97715 2.5 2.5 6.97715 2.5 12.5H4.5ZM12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5H22.5C22.5 6.97715 18.0228 2.5 12.5 2.5V4.5Z"/>
              </svg>
              <div className="card-evento__info-texto">{horaInicio ? horaInicio +' - '+horaFim : 'Sem duração definida'}</div>
            </div>
            <div className="card-evento__info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path className='card-evento__icone-pin' d="M12 22.1C12 22.1 19.5131 15.4217 19.5131 10.413C19.5131 6.2637 16.1494 2.89999 12 2.89999C7.85067 2.89999 4.48697 6.2637 4.48697 10.413C4.48697 15.4217 12 22.1 12 22.1Z" />
                <path className='card-evento__icone-pin' d="M14.4003 10.1001C14.4003 11.4256 13.3258 12.5001 12.0003 12.5001C10.6748 12.5001 9.60032 11.4256 9.60032 10.1001C9.60032 8.77466 10.6748 7.70015 12.0003 7.70015C13.3258 7.70015 14.4003 8.77466 14.4003 10.1001Z" />
              </svg> 
              <div className="card-evento__info-endereco">{endereco}</div>
            </div>
          </div>
          <div className="card-evento__verso-branco"></div>
        </div>
      </div>
    </div>
  </Link>
    
  )
}

export default CardEvento