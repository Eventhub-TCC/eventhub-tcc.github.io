import './Seta.css'
import botaoSetaPrestador from '../../assets/botao-voltar_prestador.png';
import botaoSetaOrganizador from '../../assets/botao-voltar_organizador.png';
import { NavLink } from 'react-router';

const Seta = ({ tipo = 'organizador', direcao = 'esquerda', caminho }: any) => {
  return (
    <div>
      <NavLink to={caminho}>
        <img
          className={`seta seta--${direcao}`}
          src={tipo === 'organizador' ? botaoSetaOrganizador : botaoSetaPrestador}
          alt={`Seta apontando para ${direcao}`}
        />
      </NavLink>
    </div>
  );
};

export default Seta