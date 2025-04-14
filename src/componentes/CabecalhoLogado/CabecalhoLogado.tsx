import './CabecalhoLogado.css'
import { useState } from 'react';
import ModalPerfil from '../ModalPerfil/ModalPerfil';
import ItemModal from '../ItemModalPerfil/ItemModalPerfil';
import logo from '../../assets/logo_eventhub-sem-fundo.png';


const CabecalhoLogado = () => {
    const [ModalAberto, setModalAberto] = useState(false);

    const AbrirModal = () => {
        setModalAberto(!ModalAberto);  
    }

    return(
        <div>
            <div className='CabecalhoLogado'>
                <img className='logo_fundo_branco' src={logo} alt="Logo" />
                <svg className='icone-perfil' onClick={AbrirModal} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23.5" fill="#D9D9D9" stroke="#D9D9D9"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M39 41.5448C34.9557 44.9475 29.7196 47 24 47C18.2804 47 13.0443 44.9475 9 41.5448C11.0159 37.0763 15.4989 33.9688 20.7078 33.9688H27.2922C32.5011 33.9688 36.9841 37.0763 39 41.5448ZM30.5202 27.7907C28.791 29.5254 26.4456 30.5 24 30.5C21.5544 30.5 19.209 29.5254 17.4798 27.7907C15.7505 26.056 14.779 23.7033 14.779 21.25C14.779 18.7967 15.7505 16.444 17.4798 14.7093C19.209 12.9746 21.5544 12 24 12C26.4456 12 28.791 12.9746 30.5202 14.7093C32.2495 16.444 33.221 18.7967 33.221 21.25C33.221 23.7033 32.2495 26.056 30.5202 27.7907Z" fill="white"/>
                </svg>
            </div>  
                {ModalAberto && <div className='modal1'>
                    <ModalPerfil fecharModal={AbrirModal}> <ItemModal texto='Perfil' icone="fa fa-user"/> <ItemModal texto='Sair' icone="fa fa-sign-out"/> </ModalPerfil>
                </div>}
        </div>
    ); 
}

export default CabecalhoLogado;

