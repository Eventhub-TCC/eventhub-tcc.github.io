import React, { useEffect, useRef } from 'react'
import './Modal.css'

import Botao from '../Botao/Botao'

export const Modal = ({titulo, enviaModal, botoes=true, funcaoSalvar, textoBotao = 'Salvar', prestador = false, centralizarBotoes = false, children}:any) => {
    const dialogRef = useRef<HTMLDialogElement>(null)

    const corSecundaria = prestador ? 'var(--yellow-800)' : 'var(--purple-800)'

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
    
        dialog.showModal();
    
        const handleClose = () => {
            enviaModal();
        };
    
        dialog.addEventListener("close", handleClose);
    
        return () => {
            dialog.removeEventListener("close", handleClose);
        };
    }, []);

    const fecharModal = () => {
        dialogRef.current?.close()
        enviaModal()
    }

    useEffect(()=>{
        dialogRef.current?.showModal()
    },[])

  return (
    <dialog ref={dialogRef}  className='modall' style={{'--cor-secundaria':corSecundaria} as React.CSSProperties} >
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
            <div className={`modal__container-botoes ${centralizarBotoes ? 'modal__container-botoes--centro' : 'modal__container-botoes--direita'}`}>
                <div className='modal__container-botao'>
                    <Botao funcao={fecharModal} texto='Cancelar' tamanho = 'min' className='modal__botao-cancelar' vazado cor={prestador?'var(--yellow-700':'var(--purple-700'}/>
                </div>
                <div className='modal__container-botao'>
                    <Botao funcao={funcaoSalvar} texto={textoBotao} tamanho = 'min' className='modal__botao-comfirmar' cor={prestador?'var(--yellow-700':'var(--purple-700)'}/>
                </div>
            </div>
        }
    </dialog>

  )
}
