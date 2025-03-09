import CabecalhoLogado from "../CabecalhoLogado/CabecalhoLogado";
import BarraLateral from "../BarraLateral/BarraLateral";
import "./OrganizadorLayout.css";
import { useState } from "react";
import ItemBarraLateral from "../ItemBarraLateral/ItemBarraLateral";

const OrganizadorLayout = ({ children }: any) => {
  const [minimizada, setMinimizada] = useState(false);

    function guardarMinimizada(dado:boolean){
        setMinimizada(dado);
    }
    console.log(minimizada);

  return (
    <div className="layout">
      <div className="cabecalho-layout">
        <CabecalhoLogado />
      </div>
      <div className="layout-conteudo">
        <div className="barra-layout">
          <BarraLateral enviaMinimizada={guardarMinimizada}>
            <ItemBarraLateral texto="Home" caminho="/">
              <path d="M9 21V14.1528C9 13.5226 9.53726 13.0116 10.2 13.0116H13.8C14.4627 13.0116 15 13.5226 15 14.1528V21M11.3046 3.21117L3.50457 8.48603C3.18802 8.7001 3 9.04665 3 9.41605V19.2882C3 20.2336 3.80589 21 4.8 21H19.2C20.1941 21 21 20.2336 21 19.2882V9.41605C21 9.04665 20.812 8.70011 20.4954 8.48603L12.6954 3.21117C12.2791 2.92961 11.7209 2.92961 11.3046 3.21117Z"/>
            </ItemBarraLateral>
            <ItemBarraLateral texto="Eventos" caminho="/eventos">
              <path d="M14.4002 15.1404V14.9466M14.3997 12.1375V11.9437M14.3997 9.14741V8.95358M5.01196 3.45996H12.0012C12.0409 4.87503 13.2005 6.00996 14.6252 6.00996C16.0499 6.00996 17.2094 4.87503 17.2491 3.45996H18.9884C21.0936 3.45996 22.8002 5.16655 22.8002 7.27173V16.7287C22.8002 18.8338 21.0936 20.5404 18.9884 20.5404H17.2491C17.2094 19.1254 16.0499 17.9904 14.6252 17.9904C13.2005 17.9904 12.0409 19.1254 12.0012 20.5404H5.01197C2.90679 20.5404 1.20021 18.8338 1.20021 16.7287L1.2002 7.27173C1.2002 5.16655 2.90678 3.45996 5.01196 3.45996Z"/>
            </ItemBarraLateral>
            <ItemBarraLateral texto="Agenda" caminho="/agenda">
              <path d="M7.75 17.2202V17.1428M12.25 17.2202V17.1428M12.25 13.0286V12.9512M16.25 13.0286V12.9512M4.75 8.91425H18.75M6.55952 3V4.54304M16.75 3V4.54285M16.75 4.54285H6.75C5.09315 4.54285 3.75 5.92436 3.75 7.62855V17.9143C3.75 19.6185 5.09315 21 6.75 21H16.75C18.4069 21 19.75 19.6185 19.75 17.9143L19.75 7.62855C19.75 5.92436 18.4069 4.54285 16.75 4.54285Z"/>
            </ItemBarraLateral>
            <ItemBarraLateral texto="MarketPlace" caminho="/marketplace">
              <path d="M15.5999 8.3998V5.39981C15.5999 3.41158 13.9881 1.7998 11.9999 1.7998C10.0117 1.7998 8.3999 3.41158 8.3999 5.3998V8.3998M4.72717 22.1998H19.2726C20.5579 22.1998 21.5999 21.1772 21.5999 19.9158L20.109 7.79977C20.109 6.53835 19.067 5.51576 17.7817 5.51576H5.92717C4.64186 5.51576 3.5999 6.53835 3.5999 7.79977L2.3999 19.9158C2.3999 21.1772 3.44186 22.1998 4.72717 22.1998Z"/>
            </ItemBarraLateral>
            <ItemBarraLateral texto="Pedidos" caminho="/pedidos"> 
              <path d="M7.8002 7.8H16.2002M7.8002 12.6H16.2002M5.7602 3H18.2402C19.1018 3 19.8002 3.80589 19.8002 4.8V21L17.2002 19.2L14.6002 21L12.0002 19.2L9.4002 21L6.8002 19.2L4.2002 21V4.8C4.2002 3.80589 4.89863 3 5.7602 3Z"/>
            </ItemBarraLateral>
            <ItemBarraLateral texto="Perfil" caminho="/perfil">
            <path d="M2.3999 20.5123C2.3999 16.7368 5.55419 13.6761 11.9999 13.6761C18.4456 13.6761 21.5999 16.7368 21.5999 20.5123C21.5999 21.113 21.1617 21.5999 20.6211 21.5999H3.37873C2.83814 21.5999 2.3999 21.113 2.3999 20.5123Z"/>
            <path d="M15.5999 5.9999C15.5999 7.98813 13.9881 9.5999 11.9999 9.5999C10.0117 9.5999 8.3999 7.98813 8.3999 5.9999C8.3999 4.01168 10.0117 2.3999 11.9999 2.3999C13.9881 2.3999 15.5999 4.01168 15.5999 5.9999Z"/>
            </ItemBarraLateral>
          </BarraLateral>
        </div>
        <div className={`layout-info ${minimizada ? 'layout-info-minimizada' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default OrganizadorLayout;