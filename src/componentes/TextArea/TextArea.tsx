import './TextArea.css'

export const TextArea = ({titulo = 'Digite seu Texto', onChange,valor, placeholder = 'digite aqui...',maximo = 2000, contador = true}:any) => {


    const atualizaContador = ()=>{
        return  <div className={`contador ${contador ? 'd-block' : 'd-none'}`}>{`${valor.length}/${maximo}`}</div>
    }

  return (
    <div>
        <label className={`textarea__label ${titulo? 'd-block':'d-none'}`}>{titulo}</label>
        <div className='textarea__container'>
            <textarea 
                className='textarea' 
                placeholder={placeholder}
                onChange={onChange}
                value={valor}
                maxLength={maximo}
            />
            {atualizaContador()}
        </div>
        
    </div>
    
  )
}
export default TextArea
