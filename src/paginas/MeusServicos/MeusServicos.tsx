import React, { ChangeEvent, useEffect, useState } from 'react'
import './MeusServicos.css'
import FeedbackFormulario from '../../componentes/FeedbackFormulario/FeedbackFormulario'
import CardServico from '../../componentes/CardServico/CardServico'
import api from "../../axios";
import Input from '../../componentes/Input/Input';
import Botao from '../../componentes/Botao/Botao';
import Select from '../../componentes/Select/Select';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';

interface Servico {
  idServico: number;
  nomeServico: string;
  idTipoServico: string;
  descricaoServico: string;
  unidadeCobranca: string;
  valorServico: number;
  qntMinima: number;
  qntMaxima: number;
  imagem1: string;
  imagem2: string | null;
  imagem3: string | null;
  imagem4: string | null;
  imagem5: string | null;
  imagem6: string | null;
  anunciado: boolean;
  dataInicioAnuncio: string | null;
  dataFimAnuncio: string | null;
}

interface categoria {
  idTipoServico: number;
  descricaoTipoServico: string;
}

const MeusServicos = () => {
const [ servicos, setServicos] = useState<Servico[]>([]);
const [ buscaServico, setBuscaServico] = useState<string>('');
const [loading, setLoading] = React.useState(true);
const [ordemCrescente, setOrdemCrescente] = useState<boolean>(true);
const [criterioOrdenacao, setCriterioOrdenacao] = useState<string>("");
const [ mostrarFiltros, setMostrarFiltros ] = useState<boolean>(false);
const [ categorias, setCategorias] = useState<categoria[]>([]);
const [servicosOrdenados, setServicosOrdenados] = useState<Servico[]>([]);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState(0);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  const [valorMinimoSelecionado, setValorMinimoSelecionado] = useState("");
  const [valorMaximoSelecionado, setValorMaximoSelecionado] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [servicosFiltrados, setServicosFiltrados] = useState<Servico[]>([]);
  const [servicosClassificados, setServicosClassificados] = useState<{
    anunciados: Servico[];
    naoAnunciados: Servico[];
  }>({
    anunciados: [],
    naoAnunciados: [],
  });

const obterServicos = async () => {
    try {
      const response = await api.get<Servico[]>(`/users/services`);
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao obter servicos", error);
    }
  };

    useEffect(() => {
        obterServicos();
    }, []);

      useEffect(() => {
    const obterCategorias = async () => {
      try {
        const response = await api.get("/users/tipo-servico");
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao obter categoria", error);
      }
    };
    obterCategorias();
  }, []);

    const LimparFiltros = () => {
    setBuscaServico("");
    setCategoriaSelecionada(0);
    setUnidadeSelecionada("");
    setValorMaximoSelecionado("");
    setValorMinimoSelecionado("");
    setStatusSelecionado("");
  };

  const navigate = useNavigate();

  const ordenarServicos = (
    servicos: Servico[],
    criterio: string,
    crescente: boolean
  ): Servico[] => {
    const servicosOrdenados = [...servicos];

    servicosOrdenados.sort((a, b) => {
    if (criterio === "nome") {
        return crescente
          ? a.nomeServico.localeCompare(b.nomeServico)
          : b.nomeServico.localeCompare(a.nomeServico);
      }
      return 0;
    });
    return servicosOrdenados;
  };

    useEffect(() => {
      const classificados = {
        anunciados: [] as Servico[],
        naoAnunciados: [] as Servico[],
      }
      
      const servicosOrdenados = ordenarServicos(
        servicos,
        criterioOrdenacao,
        ordemCrescente
      );
  
      const servicosFiltradosOrdenados = ordenarServicos(
        servicosFiltrados,
        criterioOrdenacao,
        ordemCrescente
      );

      servicosOrdenados.forEach((servico) => {
        if (servico.anunciado) {
            classificados.anunciados.push(servico);
          } else {
            classificados.naoAnunciados.push(servico);
          }
        } 
      );
  
      setServicosFiltrados(servicosFiltradosOrdenados);
      setServicosOrdenados(servicosOrdenados);
      setServicosClassificados(classificados);
    }, [servicos, criterioOrdenacao, ordemCrescente]);
    

      function BuscaNomeServico(padrao: string, texto: string): boolean {
        padrao = padrao.toLowerCase();
        texto = texto.toLowerCase();

        let i = 0;
        for (let char of texto) {
          if (char === padrao[i]) {
            i++;
          }
          if (i === padrao.length) {
            return true;
          }
        }
        return false;
      }

  useEffect(() => {
    const buscaValida = buscaServico.length > 1;

    const resultado = servicos.filter((servico) => {
      const correspondeBusca = buscaValida
        ? BuscaNomeServico(buscaServico, servico.nomeServico)
        : true;

      const correspondeFiltros =
        (!categoriaSelecionada ||
          Number(servico.idTipoServico) === categoriaSelecionada)

      return correspondeBusca && correspondeFiltros;
    });

    setServicosFiltrados(resultado);
  }, [
    buscaServico,
    categoriaSelecionada,
    servicos,
  ]);


  return (
    <>
      <Helmet>
          <title>Meus Serviços | EventHub</title>
      </Helmet>
      <div className='conteudo-principal-meus-servicos'>
          <div className="layout-titulo">Meus serviços</div>  
          {servicos.length > 0 ? 
  (
      <div className="ordenacao-meus-eventos">
          <div className="conteudo-principal-meus-eventos__pesquisa-filtros">
              <div className="conteudo-principal-meus-eventos__pesquisa">
                  <div className="conteudo-principal-meus-eventos__pesquisa__input">
              <Input
                valor={buscaServico}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setBuscaServico(event.target.value)
                }
                icone="fa-solid fa-magnifying-glass"
                posicaoIcone="esquerda"
                dica="Buscar serviço..."
                cor="var(--yellow-700)"
                name="busca-servico"
              />
            </div>
            <div className="conteudo-principal-meus-eventos__botao">
              <Botao
                tamanho="max"
                cor='var(--yellow-800)'
                texto="Filtros"
                funcao={() => setMostrarFiltros(!mostrarFiltros)}
              />
            </div>
          </div>
            <div className={`conteudo-principal-meus-eventos__filtros ${mostrarFiltros ? 'conteudo-principal-meus-eventos__filtros--mostrar' : 'oculto'}`}>
              <div className="conteudo-principal-meus-eventos__filtros__selects">
              <Select
              textoPadrao="Categoria"
              valor={categoriaSelecionada}
              funcao={(e: ChangeEvent<HTMLSelectElement>) =>
                  setCategoriaSelecionada(Number(e.target.value))
              }
              name="categoria-filtro"
              cor="var(--yellow-700)"
              >
              {categorias.map((categoria) => (
                  <option
                  key={categoria.idTipoServico}
                  value={categoria.idTipoServico} // aqui é o ID
                  >
                  {categoria.descricaoTipoServico}
                  </option>
              ))}
              </Select>
              </div>
              <div className="conteudo-principal-meus-eventos__filtros__selects">
                <Select
                  textoPadrao="Valor Minimo"
                  valor={valorMinimoSelecionado}
                  funcao={(e: ChangeEvent<HTMLSelectElement>) =>
                    setValorMinimoSelecionado(e.target.value)
                  }
                  name="valorMin-filtro"
                  cor="var(--yellow-700)"
                >
                </Select>
              </div>
              <div className="conteudo-principal-meus-eventos__filtros__selects">
                <Select
                  textoPadrao="Valor Maximo"
                  valor={valorMaximoSelecionado}
                  funcao={(e: ChangeEvent<HTMLSelectElement>) =>
                    setValorMaximoSelecionado(e.target.value)
                  }
                  name="valorMax-filtro"
                  cor="var(--yellow-700)"
                >
                </Select>
              </div>
              <div className="conteudo-principal-meus-eventos__filtros__selects">
                <Select
                  textoPadrao="Unidade"
                  valor={unidadeSelecionada}
                  funcao={(e: ChangeEvent<HTMLSelectElement>) =>
                    setUnidadeSelecionada(e.target.value)
                  }
                  name="unidade-filtro"
                  cor="var(--yellow-700)"
                >
                </Select>
              </div>
              <div className="conteudo-principal-meus-eventos__filtros__selects">
                <Select
                  textoPadrao="Status"
                  valor={statusSelecionado}
                  funcao={(e: ChangeEvent<HTMLSelectElement>) =>
                    setStatusSelecionado(e.target.value)
                  }
                  name="tipo-evento"
                  cor="var(--yellow-700)"
                >
                  {/* <option value="confirmado">Anunciados</option>
                  <option value="em andamento">Não Anunciados</option> */}
                </Select>
              </div>
              <div
                className="conteudo-principal-meus-servicos__limpar-filtros"
                onClick={LimparFiltros}
              >
                Limpar filtros
              </div>
            </div>
          
        </div>
              <div className="ordenacao-ordem-exibicao">
                <div
                  className={`botao-ordernar-servicos ${
                    ordemCrescente ? "crescente" : "decrescente"
                  }`}
                  title={
                    ordemCrescente
                      ? "Ordenar de forma crescente"
                      : "Ordenar de forma decrescente"
                  }
                  onClick={() => setOrdemCrescente(!ordemCrescente)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="seta-eventos"
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <path
                      d="M4.875 9.83333L11 4M11 4L17.125 9.83333M11 4V18"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Select
                  textoPadrao="Ordenar por"
                  value={criterioOrdenacao}
                  name="ordenacao"
                  onChange={(e: any) => setCriterioOrdenacao(e.target.value)}
                  cor="var(--yellow-700)"
                  esconderValorPadrao={false}
                >
                  <option value="nome">Nome</option>
                </Select>
              </div>
              <div className="meus-eventos">
                {servicosFiltrados.length > 0 &&
                (buscaServico.length > 1 ||
                  categoriaSelecionada ||
                  unidadeSelecionada ||
                  statusSelecionado) ? (
                  <details open className="exibicao-servicos">
                    <summary className="sumario-servicos">
                      <i className={`fa-solid fa-chevron-right exibicao-servicos__seta`}/>
                      <span className="exibicao-servicos__titulo">Servicos encontrados <span className="quantidade-servicos">({servicosFiltrados.length})</span></span>
                    </summary>
                    <div className="container">
                      <div className="row g-5">
                        {servicosFiltrados.map((servico) => (
                          <div
                            className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4"
                            key={servico.idServico}
                          >
                                <CardServico
                                  titulo={servico.nomeServico}
                                  imagem={servico.imagem1}
                                  id={servico.idServico}
                                />
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                ) : servicosFiltrados.length === 0 &&
                  (buscaServico.length > 1 ||
                    categoriaSelecionada ||
                    unidadeSelecionada ||
                    statusSelecionado) ? (
                  <div className="servicos-nao-encontrados">
                    Nenhum serviço encontrado.
                    <div className="sem-servicos-encontrados"></div>
                  </div>
                ) : (
                  <>
                    {servicosClassificados.anunciados.length > 0 && (
                    <details open className="exibicao-servicos">
                      <summary className="sumario-servicos">
                        <i className={`fa-solid fa-chevron-right exibicao-servicos__seta`}/>
                        <span className="exibicao-servicos__titulo">Servicos anunciados <span className="quantidade-servicos">({servicosClassificados.anunciados.length})</span></span>
                      </summary>
                        <div className="container">
                          <div className="row g-5">
                            {servicosClassificados.anunciados.map((servico) => (
                              <div
                                className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4"
                                key={servico.idServico}
                              >
                                <CardServico
                                  titulo={servico.nomeServico}
                                  imagem={servico.imagem1}
                                  id={servico.idServico}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
                    )}
                    {servicosClassificados.naoAnunciados.length > 0 && (
                    <details open className="exibicao-servicos">
                      <summary className="sumario-servicos">
                        <i className={`fa-solid fa-chevron-right exibicao-servicos__seta`}/>
                        <span className="exibicao-servicos__titulo">Servicos não anunciados <span className="quantidade-servicos">({servicosClassificados.naoAnunciados.length})</span></span>
                      </summary>
                        <div className="container">
                          <div className="row g-5">
                            {servicosClassificados.naoAnunciados.map((servico) => (
                              <div
                                className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4"
                                key={servico.idServico}
                              >
                                <CardServico
                                  titulo={servico.nomeServico}
                                  imagem={servico.imagem1}
                                  id={servico.idServico}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
                    )}
                  </>
                      
                )}
              </div>
              <div
                onClick={() => navigate("/prestador/criar-servico")}
                className="botao-criar-servicos"
              >
                <div
                  className="botao-criar-servicos-meus-servicos"
                  title="Criar servico"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                    fill="none"
                  >
                    <path
                      d="M16.5001 6.59961L16.5001 26.3996M26.4001 16.4996L6.6001 16.4996"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )
          :
          <div className="formulario-sem-eventos">
            <FeedbackFormulario 
                  caminhoBotao="/prestador/criar-servico"
                  titulo="Sem serviços por aqui ainda..."
                  texto="Pronto para começar algo incrível? 
                        Cadastre seu primeiro serviço e comece agora mesmo!"
                  textoBotao="Criar Serviço"    
                  prestador={true}
                >
                <path d="M39.831 52.7076L9.64056 82.939L9.63958 82.941C9.63408 82.9468 9.62431 82.9557 9.61322 82.9673L9.29876 83.3189C6.15231 87.0213 6.25681 92.8309 9.61322 96.3941L9.9306 96.7154C13.2715 99.9218 18.3573 99.8035 21.6279 96.3423L50.2763 63.5875L55.1435 68.6558L26.8779 100.974L26.8769 100.973C26.8286 101.029 26.7795 101.082 26.7314 101.132L26.7324 101.133C20.639 107.6 10.6598 107.709 4.51947 101.195H4.51849C-1.48643 94.821 -1.48683 84.54 4.51849 78.1666L4.59662 78.0875C4.62019 78.064 4.64465 78.0399 4.66888 78.0171C4.65685 78.0284 4.6442 78.0393 4.63372 78.0494C4.61979 78.0629 4.60651 78.0756 4.59564 78.0865L4.63275 78.0484L34.9814 47.6578L39.831 52.7076ZM4.11126 9.28481C5.62664 7.67589 8.15134 7.60719 9.75091 9.13149L95.7714 91.104C97.371 92.6283 97.4398 95.1686 95.9247 96.7779C94.4095 98.3869 91.8838 98.4562 90.2841 96.9322L57.6288 65.814L57.621 65.8238L57.4208 65.6158L4.26263 14.9586C2.6634 13.4342 2.5961 10.8939 4.11126 9.28481ZM52.123 8.23306C57.9795 2.35083 65.9532 -0.633866 74.122 0.112949H74.123L74.3232 0.136387C75.3093 0.275824 76.0943 0.744121 76.454 0.971347C76.9629 1.29279 77.4463 1.67852 77.8603 2.0524C78.2779 2.42964 78.695 2.85828 79.0546 3.29947C79.3151 3.6191 79.7265 4.16034 80.0117 4.83072L80.1249 5.12564L80.1279 5.13443L80.2441 5.51626C80.7593 7.43814 80.2795 9.55396 78.8642 11.0553L78.8652 11.0563L69.0605 21.4606L79.6161 32.7037L88.8906 22.8258L88.8974 22.819L89.0439 22.6696C90.5794 21.1586 92.871 20.6214 94.9579 21.4303H94.957C95.6115 21.6837 96.1831 22.0808 96.5458 22.3551C96.9681 22.6745 97.3973 23.0514 97.79 23.4459C98.1751 23.8329 98.5925 24.3043 98.9452 24.8229C99.2222 25.2301 99.7875 26.1284 99.8818 27.2867L99.9374 28.1041C100.405 36.5488 97.4734 44.8118 91.7675 50.8697H91.7665C84.7697 58.2936 74.9416 61.0321 65.8456 59.0318L59.7304 52.7848C59.8499 52.6425 59.9708 52.4956 60.0888 52.3414L60.2753 52.1168C61.2502 51.0404 62.8028 50.6701 64.1699 51.2174C71.7 54.2322 80.5567 52.5582 86.6728 46.0689C90.9686 41.5075 93.2581 35.2313 92.9579 28.7203L82.1679 40.2135C81.5064 40.918 80.5825 41.3179 79.6161 41.318C78.6498 41.3178 77.7258 40.918 77.0644 40.2135L61.704 23.8522C60.4382 22.5036 60.4405 20.4025 61.7089 19.0563L72.9824 7.09146C72.9614 7.07426 72.942 7.05559 72.9218 7.0397C67.0917 6.67079 61.3793 8.85595 57.082 13.1735L56.6572 13.612C50.5096 20.1363 48.8272 29.7526 51.7509 37.9889L51.83 38.2408C52.1761 39.5118 51.7791 40.881 50.7861 41.7691C50.6359 41.9034 50.4867 42.0404 50.3408 42.1813L49.9081 42.6168C49.8896 42.6363 49.8705 42.6564 49.8515 42.6754L49.8437 42.6822L44.1474 36.8609C41.9315 27.1552 44.3652 16.4496 51.5624 8.81118L52.123 8.23306ZM73.7665 6.2604L73.7714 6.25552L73.7724 6.25357C73.7706 6.2555 73.7683 6.2584 73.7665 6.2604Z" fill="#FFB22C"/>
            </FeedbackFormulario>
          </div>}
      </div>
    </>
  )
}

export default MeusServicos