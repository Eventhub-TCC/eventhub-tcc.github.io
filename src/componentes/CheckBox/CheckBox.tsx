import './CheckBox.css'
import { useState } from 'react'


const CheckBox = ({texto, id, funcao ,ativado=false,cor='var(--purple-700)'}: any) => { 

  const [ativa, setAtiva] = useState(ativado);

  const alterar = ()=>{
    if(funcao) funcao();
    setAtiva(!ativa);
  }
  return (
    <label htmlFor={id} className='label_checkbox'>
      <input checked={ativa} className='checkbox' type="checkbox" id={id} onChange={alterar}/>
      <span 
        className='checkbox_span'
        style={{'--cor-principal': cor} as React.CSSProperties}
      >
        {ativa? <i className='icone-checkbox fa-solid fa-check'/>:''}
      </span> {texto}
    </label>
      

  )
}

export default CheckBox