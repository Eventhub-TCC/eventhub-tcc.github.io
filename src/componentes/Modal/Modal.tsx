import { useEffect, useRef } from 'react'
import './Modal.css'

import Botao from '../Botao/Botao'

export const Modal = ({titulo, enviaModal, botoes=true, funcaoSalvar, textoBotao = 'Salvar', children}:any) => {
    const dialogRef = useRef<HTMLDialogElement>(null)

    const fecharModal = () => {
        dialogRef.current?.close()
        enviaModal()
    }

    useEffect(()=>{
        console.log('modal')
        dialogRef.current?.showModal()
    },[])

  return (
    <dialog ref={dialogRef}  className='modall'>
        <div className='modal__cabecalho'>
           {titulo? <h1 className='modal__titulo'>{titulo}</h1>:''}
            <button onClick={fecharModal} className='modal__botao-fechar'>
                <i className='fa-solid fa-xmark modal__fechar'/>
            </button>
        </div>
        <div className='modal__conteudo'>
            {children}
        </div>
        {
            botoes && 
            <div className='modal__container-botoes'>
                <div className='modal__container-botao'>
                    <Botao funcao={fecharModal} texto='Cancelar' tamanho = 'min' className='modal__botao-cancelar' vazado/>
                </div>
                <div className='modal__container-botao'>
                    <Botao funcao={funcaoSalvar} texto={textoBotao} tamanho = 'min' className='modal__botao-comfirmar'/>
                </div>
            </div>
        }
    </dialog>

  )
}
