import './CabecalhoLogado.css'
import { useEffect, useState } from 'react';
import ModalPerfil from '../ModalPerfil/ModalPerfil';
import ItemModal from '../ItemModalPerfil/ItemModalPerfil';
import logoOrganizador from '../../assets/logo_eventhub-sem-fundo.png';
import logoPrestador from '../../assets/eventhub_logo_prestador.png';
import logoMarketplace from '../../assets/eventhub_logo_marketplace.png';
import { Link, useNavigate } from 'react-router';
import api from '../../axios';
import {jwtDecode} from 'jwt-decode';
import Input from '../Input/Input';


const CabecalhoLogado = ({minimizada, enviaMinimizada, tipo}: any) => {
    const [ModalAberto, setModalAberto] = useState(false);
    const [barraLateralMobileAberta, setBarraLateralMobileAberta] = useState(minimizada);
    const [larguraTela, setLarguraTela] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [preView, setPreview] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState({
        organizador: false,
        prestador: false,
    });

    const [ pesquisa, setPesquisa ] = useState('');

    const AbrirModal = () => {
        setModalAberto(!ModalAberto);  
    }

    const alterarMinimizada = () => {
        setBarraLateralMobileAberta(!barraLateralMobileAberta);
        enviaMinimizada(!barraLateralMobileAberta);
    }

    useEffect(() => {
        const redimensionarTela = () => setLarguraTela(window.innerWidth);

        window.addEventListener('resize', redimensionarTela);

        return () => window.removeEventListener('resize', redimensionarTela);
    }, []);

    useEffect(() => {
        setBarraLateralMobileAberta(minimizada);
    }, [minimizada]);

    useEffect(() => {
      const obterFoto = async () => {
        try {
          const response = await api.get(`/users/get-user`);
          setPreview(tipo === 'organizador' || tipo === 'marketplace' ? response.data.fotoUsu ? `http://localhost:3000/files/${response.data.fotoUsu}` : '' : response.data.fotoEmpresa ? `http://localhost:3000/files/${response.data.fotoEmpresa}` : '');
          } catch (error) {
            console.error('Erro ao obter foto do usuário:', error);
            console.error(error);
          }
        }
        obterFoto();
    },[]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenDecodificado:any = jwtDecode(token!);
        if (tokenDecodificado?.tipo?.includes("organizador")) {
            setTipoUsuario(prev => ({ ...prev, organizador: true }));
          }
          
          if (tokenDecodificado?.tipo?.includes("prestador")) {
            setTipoUsuario(prev => ({ ...prev, prestador: true }));
          }
    }, []);


    return(
        <header>
            <div className={`CabecalhoLogado ${tipo === 'marketplace' ? 'CabecalhoLogado--marketplace' : 'CabecalhoLogado--usuario'}`}>
                <div className='cabecalho-logado__container'>
                    
                    <Link to={tipo === 'organizador' ? '/organizador/meus-eventos' : tipo === 'marketplace' ? '/marketplace' : '/prestador/meus-servicos'}>
                        <div className='cabecalho-logado__logo-container'>
                            {tipo === 'organizador' ? <img className='cabecalho-logado__logo' src={logoOrganizador} alt="Logo" /> : tipo === 'marketplace' ? <img className='cabecalho-logado__logo' src={logoMarketplace} alt="Logo" /> : <img className='cabecalho-logado__logo' src={logoPrestador} alt="Logo" />}
                        </div>
                    </Link>
                </div>
                {
                    tipo === 'marketplace' &&
                    <div className='cabecalho-logado__container-pesquisa'>
                        <Input 
                            placeholder='Buscar produtos e serviços...' 
                            tipo='text' 
                            valor={pesquisa}
                            name='pesquisa-marketplace'
                            icone="fa-solid fa-magnifying-glass"
                            posicaoIcone="esquerda"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPesquisa(e.target.value)} 
                        />
                    </div>
                }
                <div className='cabecalho-logado__container-opcoes'>
                    {
                        tipo === 'marketplace' &&
                        <button title="Carrinho de compras" className='cabecalho-logado__botao-carrinho' type='button' onClick={() => navigate('/marketplace/carrinho')}>
                            <i className="fa-solid fa-cart-shopping"></i>
                        </button>
                    }
                    {
                        larguraTela > 1024 ?
                            preView ?
                            <img className='imagem-perfil-modal' src={preView} alt="Imagem de perfil" onClick={AbrirModal} />
                            :
                            <svg className='icone-perfil' onClick={AbrirModal} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <circle cx="24" cy="24" r="23.5" fill="#D9D9D9" stroke="#D9D9D9"/>
                                <path d="M39 41.5448C34.9557 44.9475 29.7196 47 24 47C18.2804 47 13.0443 44.9475 9 41.5448C11.0159 37.0763 15.4989 33.9688 20.7078 33.9688H27.2922C32.5011 33.9688 36.9841 37.0763 39 41.5448ZM30.5202 27.7907C28.791 29.5254 26.4456 30.5 24 30.5C21.5544 30.5 19.209 29.5254 17.4798 27.7907C15.7505 26.056 14.779 23.7033 14.779 21.25C14.779 18.7967 15.7505 16.444 17.4798 14.7093C19.209 12.9746 21.5544 12 24 12C26.4456 12 28.791 12.9746 30.5202 14.7093C32.2495 16.444 33.221 18.7967 33.221 21.25C33.221 23.7033 32.2495 26.056 30.5202 27.7907Z" fill="white"/>
                            </svg>
                        :
                            <button type='button' className={`cabecalho-logado__menu-mobile ${tipo === 'marketplace' ? 'cabecalho-logado__menu-mobile--marketplace' : 'cabecalho-logado__menu-mobile--usuario'} ${!barraLateralMobileAberta ? 'cabecalho-logado__menu-mobile--ativo' : ''}`} onClick={alterarMinimizada}>
                                <div className='cabecalho-logado__menu-linha1'></div>
                                <div className='cabecalho-logado__menu-linha2'></div>
                                <div className='cabecalho-logado__menu-linha3'></div>
                            </button>
                    }
                </div>
            </div>  
            {
                ModalAberto && 
                <div className='modal1'>
                    <ModalPerfil fecharModal={AbrirModal}> 
                        <ItemModal texto='Perfil' icone="fa fa-user" funcao={() => navigate( tipo === 'organizador' || tipo === 'marketplace' ? '/organizador/meu-perfil' : '/prestador/meu-perfil')} /> 
                        { tipoUsuario.organizador && tipoUsuario.prestador ? <ItemModal icone="fa fa-refresh" texto='Alterar Função' funcao={() => navigate( tipo === 'organizador' || tipo === 'marketplace' ? '/prestador/meus-servicos' : '/organizador/meus-eventos')} organizador={tipo === 'organizador' || tipo === 'marketplace'} prestador={!(tipo === 'organizador' || tipo === 'marketplace')}/> : '' }

                        <ItemModal texto='Sair' icone="fa fa-sign-out" funcao={() => {navigate('/login'); localStorage.removeItem("token") }}/> 
                    </ModalPerfil>
                </div>
            }
        </header>
    ); 
}

export default CabecalhoLogado;

