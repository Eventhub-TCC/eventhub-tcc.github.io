import React from 'react'

const Select = ({cabecalho=false,cabecalhoTexto='cabeçalho:',dica='Escolha uma opção', opcoes, funcao}:any) => {
    const defineOpcoes = opcoes.map((el:any,id:any)=>{
        return <option key={id} value={el}>{el}</option>
    })
  return (
    <div>
        <label className={cabecalho===true? 'd-block' : 'd-none'}>{cabecalhoTexto}</label>
        <div>
            <select onChange={funcao}>
                <option>{dica}</option>
            {defineOpcoes}
            </select>
        </div>
    </div>
  )
}

export default Select