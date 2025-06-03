import CabecalhoLogado from "../CabecalhoLogado/CabecalhoLogado";
import BarraLateral from "../BarraLateral/BarraLateral";
import "./PrestadorLayout.css";
import { useEffect, useState } from "react";
import ItemBarraLateral from "../ItemBarraLateral/ItemBarraLateral";
import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";

const PrestadorLayout = () => {
  const [minimizada, setMinimizada] = useState(() => window.innerWidth <= 1024);
  const [ autenticado, setAutenticado ] = useState<null | boolean>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAutenticado(false);
      return;
    }
    (async () => {
      try{
        const tokenDecodificado:any = jwtDecode(token);
        console.log(tokenDecodificado);
        if(!tokenDecodificado.tipo.includes('prestador')){
          setAutenticado(false);
          return;
        } else {
          setAutenticado(true);
          return;
        }
      }
      catch(erro){
        localStorage.removeItem('token');
        setAutenticado(false);
      }
    })();
  }, []);

    if (autenticado === null) {
        return; 
    }

    
  
  function guardarMinimizada(dado:boolean){
    setMinimizada(dado);
  }

  return (
    autenticado ?
    <div className="layout">
      <div className="cabecalho-layout">
        <CabecalhoLogado minimizada={minimizada} enviaMinimizada={guardarMinimizada} tipo='prestador'/>
      </div>
      <div className="layout-conteudo">
        <div className={`barra-layout ${minimizada ? 'barra-layout--fechada-mobile' : 'barra-layout--aberta-mobile'}`}>
          <BarraLateral cor={'#FFB22C'} corHoverMinimizar={'#FFF4CF'} minimizada={minimizada} enviaMinimizada={guardarMinimizada}>
            {/* <ItemBarraLateral texto="Home" caminho="/" corSelecionado={"#FFF4CF"}>
              <path d="M9 21V14.1528C9 13.5226 9.53726 13.0116 10.2 13.0116H13.8C14.4627 13.0116 15 13.5226 15 14.1528V21M11.3046 3.21117L3.50457 8.48603C3.18802 8.7001 3 9.04665 3 9.41605V19.2882C3 20.2336 3.80589 21 4.8 21H19.2C20.1941 21 21 20.2336 21 19.2882V9.41605C21 9.04665 20.812 8.70011 20.4954 8.48603L12.6954 3.21117C12.2791 2.92961 11.7209 2.92961 11.3046 3.21117Z"/>
            </ItemBarraLateral> */}
            <ItemBarraLateral texto="Serviços" caminho="/prestador/meus-servicos" corSelecionado={"#FFF4CF"}>
              <path d="M20.9814 7.37503C20.9676 7.2148 20.61 6.90708 20.4586 6.85219C20.3069 6.79697 20.137 6.83456 20.0229 6.94809L17.7333 9.23769L14.7594 6.26374L17.0948 3.93712C17.2091 3.82337 17.2463 3.65413 17.1913 3.50324C17.1357 3.35205 16.769 3.03175 16.6078 3.01787C15.1895 2.89613 13.7998 3.40061 12.795 4.40174C11.4189 5.77278 11.0545 7.77488 11.6998 9.48143C11.6293 9.54063 11.5597 9.60336 11.491 9.671L3.69545 16.9993C3.6927 17.002 3.68999 17.0049 3.68701 17.0075C2.77022 17.9209 2.77022 19.407 3.68701 20.3206C4.60395 21.2339 6.08479 21.2228 7.00143 20.3094C7.00538 20.3057 7.009 20.302 7.01261 20.2979L14.3045 12.4712C14.3709 12.4047 14.4326 12.3351 14.4908 12.2637C16.2043 12.9077 18.2152 12.5455 19.5925 11.1736C20.5971 10.1724 21.1038 8.78782 20.9814 7.37503Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            </ItemBarraLateral>
            <ItemBarraLateral texto="Pedidos" caminho="/prestador/pedidos" corSelecionado={"#FFF4CF"}> 
              <path d="M7.8002 7.8H16.2002M7.8002 12.6H16.2002M5.7602 3H18.2402C19.1018 3 19.8002 3.80589 19.8002 4.8V21L17.2002 19.2L14.6002 21L12.0002 19.2L9.4002 21L6.8002 19.2L4.2002 21V4.8C4.2002 3.80589 4.89863 3 5.7602 3Z"/>
            </ItemBarraLateral>
            <ItemBarraLateral corSelecionado={"#FFF4CF"} texto="Perfil" caminho="/prestador/meu-perfil">
            <path d="M2.3999 20.5123C2.3999 16.7368 5.55419 13.6761 11.9999 13.6761C18.4456 13.6761 21.5999 16.7368 21.5999 20.5123C21.5999 21.113 21.1617 21.5999 20.6211 21.5999H3.37873C2.83814 21.5999 2.3999 21.113 2.3999 20.5123Z"/>
            <path d="M15.5999 5.9999C15.5999 7.98813 13.9881 9.5999 11.9999 9.5999C10.0117 9.5999 8.3999 7.98813 8.3999 5.9999C8.3999 4.01168 10.0117 2.3999 11.9999 2.3999C13.9881 2.3999 15.5999 4.01168 15.5999 5.9999Z"/>
            </ItemBarraLateral>
          </BarraLateral>
        </div>
        <main className={`layout-info-prestador ${minimizada ? 'layout-info-minimizada' : ''}`}>
          <div className="container">
            <Outlet/>
          </div>
        </main>
      </div>
    </div> : <Navigate to="/organizador/meu-perfil" />
  );
};

export default PrestadorLayout;