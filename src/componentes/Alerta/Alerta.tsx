import './Alerta.css'
import { useState } from 'react'

interface Tipo{
    border: string,
    backgroundColor: string,
    color: string,
    icone: string
}

export const Alerta = ({texto, status='informacao', ativado = true}:any) => {
    const [visivel, setVisivel] = useState(ativado)
    const tipo: {[chave:string]:Tipo} = {
        aviso : {
            border: "1px solid #FFECB5",
            backgroundColor: "#FFF3CD",
            color: "#664D03",
            icone: 'fa-triangle-exclamation'
        },
        erro : {
            border: "1px solid #F5C2C7",
            backgroundColor: "#F8D7DA",
            color:"#842029",
            icone: 'fa-circle-xmark'
        },
        sucesso : {
            border: "1px solid #BADBCC",
            backgroundColor: "#D1E7DD",
            color:"#0F5132",
            icone: 'fa-circle-check'
        },
        informacao : {
            border: "1px solid #B6EFFB",
            backgroundColor: "#CFF4FC",
            color:"#055160",
            icone: 'fa-circle-info'
        }
    }
  return (
    <div style={{backgroundColor: tipo[status].backgroundColor, border: tipo[status].border, color: tipo[status].color}} className={`alerta ${visivel ? '' : 'alerta__invisivel'}`}>
        <i className={`fa-solid ${tipo[status].icone} alerta__icone`}/>
        <span className='alerta__texto'>{texto}</span>
        <button className='alerta__botao' onClick={()=>setVisivel(false)}>
        <i className='fa-solid fa-xmark alerta__fechar'/>
        </button>
        
    </div>
  )
}

export default Alerta
