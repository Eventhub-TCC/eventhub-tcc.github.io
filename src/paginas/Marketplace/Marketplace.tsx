import './Marketplace.css'
import banner1 from '../../assets/banner-1-marketplace.png'
import { useEffect, useState } from 'react'
import api from '../../axios'
import CardMarketplace from '../../componentes/CardMarketplace/CardMarketplace';
import FeedbackFormulario from '../../componentes/FeedbackFormulario/FeedbackFormulario';

interface Prestador{
  codigoUsu: string;
  nomeEmpresa: string;
  fotoEmpresa: string | null;
}

interface TipoServico{
  idTipoServico: number;
  descricaoTipoServico: string;
}

interface Servico{
  idServico: number;
  nomeServico: string;
  descricaoServico: string;
  unidadeCobranca: string;
  valorServico: number;
  valorPromoServico: number | null;
  qntMinima: number;
  qntMaxima: number;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  imagem6: string;
  anunciado: boolean;
  dataInicioAnuncio: Date | null;
  dataFimAnuncio: Date | null;
  tipoServico: TipoServico;
  usuario: Prestador;
}

const Marketplace = () => {
  const [alimentacao, setAlimentacao] = useState<Servico[]>([]);
  const [decoracao, setDecoracao] = useState<Servico[]>([]);
  const [musica, setMusica] = useState<Servico[]>([]);
  const [fotografia, setFotografia] = useState<Servico[]>([]);
  const [locacaoEspaco, setLocacaoEspaco] = useState<Servico[]>([]);
  const [outros, setOutros] = useState<Servico[]>([]);

  useEffect(() => {
    try{
      (async () => {
        const { data: servicos } = await api.get('users/services/obter-anuncios');
        setAlimentacao(servicos.filter((servico: Servico) => servico.tipoServico.descricaoTipoServico === 'Alimentação'));
        setDecoracao(servicos.filter((servico: Servico) => servico.tipoServico.descricaoTipoServico === 'Decoração'));
        setMusica(servicos.filter((servico: Servico) => servico.tipoServico.descricaoTipoServico === 'Música'));
        setFotografia(servicos.filter((servico: Servico) => servico.tipoServico.descricaoTipoServico === 'Fotografia'));
        setLocacaoEspaco(servicos.filter((servico: Servico) => servico.tipoServico.descricaoTipoServico === 'Locação de Espaço'));
        setOutros(servicos.filter((servico: Servico) => !['Alimentação', 'Decoração', 'Música', 'Fotografia', 'Locação de Espaço'].includes(servico.tipoServico.descricaoTipoServico)));
      })();
    }
    catch(erro){
      console.error('Erro ao obter serviços: ', erro);
    }
  }, []);

  const unidadeValor = [
    { id:1 ,nome:"Unidade" },
    { id:2 ,nome:"Hora" },
    { id:3 ,nome:"Turno" },
    { id:4 ,nome:"Diária" },
    { id:5 ,nome:"Aluguel" },
    { id:6 ,nome:"Sessão" },
    { id:7 ,nome:"Pessoa" },
  ]

  return (
    <div className='marketplace'>
      <h1 className='layout-titulo'>Marketplace</h1>
      {
        (alimentacao.length > 0 ||
         decoracao.length > 0 ||
         musica.length > 0 ||
         fotografia.length > 0 ||
         locacaoEspaco.length > 0 ||
         outros.length > 0
        ) ?
         <>
          <div className='marketplace__banner'>
            <img className='marketplace__imagem-banner' src={banner1} alt="Banner" />
          </div>
          {
            alimentacao.length > 0 &&
            <section className='marketplace__categorias'>
              <div className='marketplace__container-titulo-categoria'>
                <i className="fa-solid fa-utensils marketplace__categoria-icone"></i>
                <h2 className="marketplace__categoria-titulo">Alimentação</h2>
              </div>
              <div className='marketplace__container-cards'>
                <div className='marketplace__cards'>
                  {
                    alimentacao.map((servico: Servico) => (
                      <CardMarketplace 
                        key={servico.idServico}
                        idServico={servico.idServico}
                        fotoServico={servico.imagem1}
                        nomeServico={servico.nomeServico}
                        nomePrestador={servico.usuario.nomeEmpresa}
                        preco={Number(servico.valorServico)}
                        precoPromo={Number(servico.valorPromoServico)}
                        unidade={unidadeValor.find((unidade) => unidade.id === Number(servico.unidadeCobranca))?.nome.toLowerCase()}
                      />
                    ))
                  }
                </div>
              </div>
            </section>
          }
          {
            decoracao.length > 0 &&
            <section className='marketplace__categorias'>
              <div className='marketplace__container-titulo-categoria'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="32" viewBox="0 0 18 32" fill="none">
                  <path d="M8.02824 0.0322189C7.73935 0.0569801 6.89395 0.224125 6.76927 0.276743C6.73582 0.289124 6.62026 0.323172 6.51991 0.35103C6.41651 0.375792 6.29487 0.419125 6.24622 0.443888C6.19756 0.468649 6.14282 0.490316 6.12458 0.490316C6.04247 0.490316 5.40386 0.784365 5.03894 0.988651C4.23003 1.44366 3.60663 1.92342 2.91632 2.62295C1.81548 3.74343 1.03698 5.02486 0.541298 6.53225C0.337551 7.1544 0.142927 8.07988 0.09123 8.66179C0.072984 8.87536 0.045615 9.1756 0.03041 9.33346C0.012164 9.48822 0 9.75441 0 9.92155C0 10.2001 0.0973121 11.4073 0.139886 11.6642C0.228075 12.1904 0.407494 12.9982 0.523052 13.3666C0.687266 13.9021 0.854522 14.3818 0.973121 14.6511C1.53266 15.948 1.98577 16.7652 2.77035 17.9011C3.37855 18.7833 4.38512 19.8604 5.24573 20.5507C5.87826 21.0583 6.34353 21.3616 7.03992 21.7176C7.33794 21.8692 7.80929 22.0642 7.97655 22.1076C8.02216 22.1169 8.05865 22.1385 8.05865 22.1509C8.05865 22.1633 7.85491 22.5966 7.6025 23.1104C7.10682 24.1288 7.08249 24.2031 7.20717 24.4104C7.31361 24.5869 7.46262 24.6333 7.94614 24.6333C8.17421 24.6333 8.36275 24.6457 8.36275 24.6581C8.36275 24.915 8.52697 25.664 8.65165 25.9797C8.81282 26.3883 8.86148 26.4997 9.25377 27.2797C9.5974 27.97 9.68863 28.3383 9.66126 28.9171C9.63998 29.3628 9.56699 29.6476 9.37541 30.0283C9.24769 30.2821 8.91926 30.7495 8.71247 30.9755C8.52089 31.1798 8.42357 31.3562 8.42357 31.4955C8.42357 31.5357 8.45703 31.6379 8.4996 31.7214C8.59083 31.9071 8.74592 32 8.95575 32C9.15037 32 9.29938 31.9102 9.49097 31.6843C9.57916 31.576 9.716 31.4181 9.79507 31.3283C10.2208 30.8455 10.6222 29.9943 10.7226 29.369C10.8047 28.8583 10.7621 28.2516 10.6131 27.775C10.5006 27.4159 10.3577 27.0909 10.0079 26.379C9.82548 26.0045 9.66126 25.6516 9.64302 25.5928C9.53658 25.24 9.51529 25.1502 9.49097 24.9273C9.4788 24.7912 9.47272 24.6704 9.4788 24.655C9.48488 24.6426 9.71296 24.6333 9.98057 24.6333C10.4154 24.6333 10.4884 24.6271 10.6009 24.5683C10.7651 24.4909 10.8746 24.2866 10.8442 24.1226C10.832 24.0638 10.6709 23.7078 10.4854 23.3271C10.1022 22.5378 9.94408 22.1942 9.94408 22.1447C9.94408 22.1261 10.0505 22.0704 10.1813 22.0209C10.309 21.9714 10.4915 21.8909 10.5857 21.8414C10.68 21.7949 10.7651 21.7547 10.7743 21.7547C10.8016 21.7547 11.6288 21.2811 11.8447 21.1418C12.6354 20.628 13.5203 19.8511 14.2836 18.9999C14.6728 18.5666 14.837 18.3623 15.1594 17.9321C16.5218 16.0904 17.3672 14.258 17.7716 12.2492C17.8446 11.8932 17.875 11.6487 17.9693 10.7108C18.0666 9.77298 17.9267 8.33678 17.6348 7.25344C17.3276 6.1082 16.9445 5.23844 16.3059 4.23557C15.6186 3.15533 14.6151 2.11842 13.5477 1.38794C13.4656 1.33223 13.3591 1.25794 13.3135 1.23008C13.1706 1.13103 12.4742 0.765793 12.2157 0.654364C11.4707 0.332458 10.5675 0.0972195 9.82244 0.0260277C9.41494 -0.011116 8.44182 -0.00801849 8.02824 0.0322189ZM5.95124 2.86128C6.10025 2.97581 6.17323 3.112 6.17323 3.27295C6.17323 3.51438 6.082 3.64438 5.58632 4.10867C4.79566 4.84843 4.44594 5.26629 3.90769 6.09582C3.54277 6.65916 3.15656 7.60011 3.04404 8.1975C2.94369 8.74845 2.88287 8.96203 2.8038 9.07965C2.65479 9.29631 2.35982 9.33655 2.12566 9.16941C1.99794 9.07965 1.88542 8.84131 1.88542 8.66488C1.88542 8.51321 2.01923 7.75797 2.08309 7.54749C2.32028 6.7613 2.67 5.95034 3.00451 5.42725C3.33294 4.91034 3.47586 4.71224 3.85599 4.24176C4.3091 3.69081 5.02374 3.05628 5.42819 2.85509C5.67451 2.72818 5.78399 2.73128 5.95124 2.86128Z" fill="#6A40C3"/>
                </svg>
                <h2 className="marketplace__categoria-titulo">Decoração</h2>
              </div>
              <div className='marketplace__container-cards'>
                <div className='marketplace__cards'>
                  {
                    decoracao.map((servico: Servico) => (
                      <CardMarketplace 
                        key={servico.idServico}
                        idServico={servico.idServico}
                        fotoServico={servico.imagem1}
                        nomeServico={servico.nomeServico}
                        nomePrestador={servico.usuario.nomeEmpresa}
                        preco={Number(servico.valorServico)}
                        precoPromo={Number(servico.valorPromoServico)}
                        unidade={unidadeValor.find((unidade) => unidade.id === Number(servico.unidadeCobranca))?.nome}
                      />
                    ))
                  }
                </div>
              </div>
            </section>
          }
          {
            musica.length > 0 &&
            <section className='marketplace__categorias'>
              <div className='marketplace__container-titulo-categoria'>
                <i className="fa-solid fa-music marketplace__categoria-icone"></i>
                <h2 className="marketplace__categoria-titulo">Música</h2>
              </div>
              <div className='marketplace__container-cards'>
                <div className='marketplace__cards'>
                  {
                    musica.map((servico: Servico) => (
                      <CardMarketplace 
                        key={servico.idServico}
                        idServico={servico.idServico}
                        fotoServico={servico.imagem1}
                        nomeServico={servico.nomeServico}
                        nomePrestador={servico.usuario.nomeEmpresa}
                        preco={Number(servico.valorServico)}
                        precoPromo={Number(servico.valorPromoServico)}
                        unidade={unidadeValor.find((unidade) => unidade.id === Number(servico.unidadeCobranca))?.nome}
                      />
                    ))
                  }
                </div>
              </div>
            </section>
          }
          {
            fotografia.length > 0 &&
            <section className='marketplace__categorias'>
              <div className='marketplace__container-titulo-categoria'>
                <i className="fa-solid fa-camera marketplace__categoria-icone"></i>
                <h2 className="marketplace__categoria-titulo">Fotografia</h2>
              </div>
              <div className='marketplace__container-cards'>
                <div className='marketplace__cards'>
                  {
                    fotografia.map((servico: Servico) => (
                      <CardMarketplace 
                        key={servico.idServico}
                        idServico={servico.idServico}
                        fotoServico={servico.imagem1}
                        nomeServico={servico.nomeServico}
                        nomePrestador={servico.usuario.nomeEmpresa}
                        preco={Number(servico.valorServico)}
                        precoPromo={Number(servico.valorPromoServico)}
                        unidade={unidadeValor.find((unidade) => unidade.id === Number(servico.unidadeCobranca))?.nome}
                      />
                    ))
                  }
                </div>
              </div>
            </section>
          }
          {
            locacaoEspaco.length > 0 &&
            <section className='marketplace__categorias'>
              <div className='marketplace__container-titulo-categoria'>
                <i className="fa-solid fa-location-dot marketplace__categoria-icone"></i>
                <h2 className="marketplace__categoria-titulo">Locação de Espaço</h2>
              </div>
              <div className='marketplace__container-cards'>
                <div className='marketplace__cards'>
                  {
                    locacaoEspaco.map((servico: Servico) => (
                      <CardMarketplace 
                        key={servico.idServico}
                        idServico={servico.idServico}
                        fotoServico={servico.imagem1}
                        nomeServico={servico.nomeServico}
                        nomePrestador={servico.usuario.nomeEmpresa}
                        preco={Number(servico.valorServico)}
                        precoPromo={Number(servico.valorPromoServico)}
                        unidade={unidadeValor.find((unidade) => unidade.id === Number(servico.unidadeCobranca))?.nome}
                      />
                    ))
                  }
                </div>
              </div>
            </section>
          }
          {
            outros.length > 0 &&
            <section className='marketplace__categorias'>
              <div className='marketplace__container-titulo-categoria'>
                <i className="fa-solid fa-bag-shopping marketplace__categoria-icone"></i>
                <h2 className="marketplace__categoria-titulo">Outros</h2>
              </div>
              <div className='marketplace__container-cards'>
                <div className='marketplace__cards'>
                  {
                    outros.map((servico: Servico) => (
                      <CardMarketplace 
                        key={servico.idServico}
                        idServico={servico.idServico}
                        fotoServico={servico.imagem1}
                        nomeServico={servico.nomeServico}
                        nomePrestador={servico.usuario.nomeEmpresa}
                        preco={Number(servico.valorServico)}
                        precoPromo={Number(servico.valorPromoServico)}
                        unidade={unidadeValor.find((unidade) => unidade.id === Number(servico.unidadeCobranca))?.nome}
                      />
                    ))
                  }
                </div>
              </div>
            </section>
          }
         </>
        :
        <div className='marketplace__sem-servicos'>
          <FeedbackFormulario 
              caminhoBotao="/organizador/meus-eventos"
              titulo="Oops! Nada por aqui ainda."
              texto="Ainda não há produtos ou serviços disponíveis no momento. Volte em breve para novidades!"
              textoBotao="Ir para Meus eventos"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="102" viewBox="0 0 96 102" fill="none">
              <path d="M87.228 3.59082C88.8238 1.90639 91.4838 1.835 93.1684 3.43066C94.8526 5.0265 94.9242 7.6856 93.3286 9.37012L7.51413 99.96C5.91829 101.644 3.25926 101.717 1.57468 100.121C-0.10967 98.5254 -0.181739 95.8663 1.41355 94.1816L87.228 3.59082ZM86.7046 20.1387C88.4215 22.2304 89.4737 24.881 89.5219 27.79L95.7153 78.1172C95.7302 78.2386 95.7378 78.361 95.7378 78.4834C95.7377 85.4488 89.9993 90.9997 83.0405 91H22.435C21.5441 91 20.673 90.9077 19.8315 90.7344L25.2641 85H83.0405C86.739 84.9997 89.6509 82.113 89.7329 78.6338L83.5483 28.3662C83.5334 28.2447 83.5259 28.1224 83.5258 28C83.5258 26.7468 83.1564 25.5662 82.5151 24.5625L86.7046 20.1387ZM53.2026 0.00585938C61.5379 0.217375 68.4634 6.09559 70.2739 13.9316L63.1206 21.4834H40.7378V30.5C40.7378 32.1567 39.3944 33.4997 37.7378 33.5C36.0809 33.5 34.7378 32.1569 34.7378 30.5V21.4834H27.435C23.6831 21.4834 20.7378 24.4537 20.7378 28C20.7378 28.0987 20.7328 28.1977 20.7231 28.2959L16.5259 70.6719L9.79245 77.7803L14.7397 27.8311C14.8315 20.9448 20.5323 15.4834 27.435 15.4834H34.9135C36.1377 6.73376 43.6508 -7.94409e-07 52.7378 0L53.2026 0.00585938ZM52.4282 6.00391C46.802 6.14637 42.1403 10.1618 41.0044 15.4834H64.4712C63.3145 10.0646 58.5016 6.00023 52.7378 6L52.4282 6.00391Z" fill="#8C5DFF"/>
            </svg>
          </FeedbackFormulario>
        </div>
      }
    </div>
  )
}

export default Marketplace