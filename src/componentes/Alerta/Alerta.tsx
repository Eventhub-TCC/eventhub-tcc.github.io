import './Alerta.css'
import { useEffect, useRef, useState } from 'react'

interface Tipo{
    border: string,
    backgroundColor: string,
    color: string,
    icone: string
}

export const Alerta = ({texto, status='informacao', ativado = true}:any) => {
    const [visivel, setVisivel] = useState(ativado);
    const alerta = useRef<HTMLDivElement>(null);

    const tipo: {[chave:string]:Tipo} = {
        aviso : {
            border: "1px solid #FFECB5",
            backgroundColor: "rgba(255, 243, 205, 0.7)",
            color: "#664D03",
            icone: 'fa-triangle-exclamation'
        },
        erro : {
            border: "1px solid #F5C2C7",
            backgroundColor: "rgba(248, 215, 218, 0.7)",
            color:"#842029",
            icone: 'fa-circle-xmark'
        },
        sucesso : {
            border: "1px solid #BADBCC",
            backgroundColor: "rgba(209, 231, 221, 0.7)",
            color:"#0F5132",
            icone: 'fa-circle-check'
        },
        informacao : {
            border: "1px solid #B6EFFB",
            backgroundColor: "rgba(207, 244, 252, 0.7)",
            color:"#055160",
            icone: 'fa-circle-info'
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisivel(false);
        }, 10000);
        return () => {
            setTimeout(() => alerta.current?.classList.add('alerta__fechando'), 9700);
            clearTimeout(timer);
        }; 
    });

    const fecharAlerta = () => {
        alerta.current?.classList.add('alerta__fechando'); 
        setTimeout(() => setVisivel(false), 300);
    }

  return (
    <div ref={alerta} style={{'--cor-alerta': tipo[status].color, backgroundColor: tipo[status].backgroundColor, border: tipo[status].border, color: tipo[status].color} as React.CSSProperties} className={`alerta ${visivel ? '' : 'alerta__invisivel'}`}>
        <i className={`fa-solid ${tipo[status].icone} alerta__icone`}/>
        <span className='alerta__texto'>{texto}</span>
        <button type='button' className='alerta__botao' onClick={fecharAlerta}>
            <i className='fa-solid fa-xmark alerta__fechar'/>
        </button>
    </div>
  )
}

export default Alerta
