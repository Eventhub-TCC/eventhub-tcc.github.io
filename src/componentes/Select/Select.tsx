import './Select.css'
import { useState } from 'react'

const Select = ({cabecalho=false,cabecalhoTexto='cabeçalho:', funcao,valor, name, children,textoPadrao = 'Selecione uma opção',esconderValorPadrao = true, ...props}:any) => {

  const [focado, setFocado] = useState(false);

  return (
    <div>
        {
          cabecalho &&
          <label htmlFor={name} className={`select__label ${cabecalho===true? 'd-block' : 'd-none'}`}>{cabecalhoTexto}</label>
        }
        <div className='select__container'>
            <select 
            onFocus={() => setFocado(true)}
            onBlur={() => setFocado(false)}
            onChange={funcao} 
            className='select'
            value={valor}
            name={name}
            id={name}
            {...props}
            >
                <option hidden={esconderValorPadrao} value="">{textoPadrao}</option>
                {children}
            </select>
            <i className={`fa-solid fa-angle-up select__icone ${focado? 'select__icone-rotacionado':''}`}></i>
        </div>
    </div>
  )
}

export default Select