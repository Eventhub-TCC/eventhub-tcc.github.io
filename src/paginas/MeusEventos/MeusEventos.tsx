import Select from "../../componentes/Select/Select";
import CardEvento from "../../componentes/CardEvento/CardEvento";
import FeedbackFormulario from "../../componentes/FeedbackFormulario/FeedbackFormulario";
import "./MeusEventos.css";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../../axios";
import Input from "../../componentes/Input/Input";
import Botao from "../../componentes/Botao/Botao";
import { Helmet } from "react-helmet-async";

interface Evento {
  idEvento: number;
  nomeEvento: string;
  status?: string;
  dataEvento: string;
  horaInicio: string;
  horaFim: string;
  imagem?: string;
  cepLocal: string;
  enderecoLocal: string;
  numeroLocal: string;
  complementoLocal: string;
  bairroLocal: string;
  cidadeLocal: string;
  ufLocal: string;
  imagemEvento?: string;
  idTipoEvento?: string;
}

interface categoria {
  idTipoEvento: number;
  descricaoTipoEvento: string;
}

const MeusEventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ordemCrescente, setOrdemCrescente] = useState<boolean>(true);
  const [criterioOrdenacao, setCriterioOrdenacao] = useState<string>("");
  const [eventosClassificados, setEventosClassificados] = useState<{
    concluidos: Evento[];
    emAndamento: Evento[];
    confirmados: Evento[];
  }>({
    concluidos: [],
    emAndamento: [],
    confirmados: [],
  });

  const [categorias, setCategorias] = useState<categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(0);
  const [datasFiltradas, setDatasFiltradas] = useState<string[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horaInicioFiltrada, setHoraInicioFiltrada] = useState<string[]>([]);
  const [horaInicioSelecionada, setHoraInicioSelecionada] = useState("");
  const [horaFimFiltrada, setHoraFimFiltrada] = useState<string[]>([]);
  const [horaFimSelecionada, setHoraFimSelecionada] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [eventosFiltrados, setEventosFiltrados] = useState<Evento[]>([]);
  const [buscaEvento, setBuscaEvento] = useState("");

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const formatarDados = {
    data: (data: string) => {
        let [ano, mes, dia] = data.split('-').map(Number);
        mes -= 1;

        const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

        return diasDaSemana[new Date(ano, mes, dia).getDay()] + ', ' + dia + ' de ' + meses[mes] + ' de ' + ano;
    },
    hora: (hora: string) => {
        return hora.slice(0, 5);
    },
    cep: (cep: string) => {
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
}

  useEffect(() => {
    const obterCategorias = async () => {
      try {
        const response = await api.get("/users/tipo-evento");
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao obter categoria", error);
      }
    };
    obterCategorias();
  }, []);

  useEffect(() => {
    if (categoriaSelecionada) {
      const eventosFiltrados = eventos.filter(
        (e) => Number(e.idTipoEvento) === categoriaSelecionada
      );
      const dataFiltradaPorCategoria = [
        ...new Set(eventosFiltrados.map((e) => e.dataEvento)),
      ];
      setDatasFiltradas(dataFiltradaPorCategoria);
      const horasInicioFiltradaPorCategoria = [
        ...new Set(eventosFiltrados.map((e) => e.horaInicio)),
      ];
      setHoraInicioFiltrada(horasInicioFiltradaPorCategoria);
      const horasFimFiltradaPorCategoria = [
        ...new Set(eventosFiltrados.map((e) => e.horaFim)),
      ];
      setHoraFimFiltrada(horasFimFiltradaPorCategoria);
    } else {
      setDatasFiltradas([]);
    }
  }, [categoriaSelecionada]);

  function BuscaNomeEvento(padrao: string, texto: string): boolean {
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
    const buscaValida = buscaEvento.length > 1;

    const resultado = eventos.filter((evento) => {
      const correspondeBusca = buscaValida
        ? BuscaNomeEvento(buscaEvento, evento.nomeEvento)
        : true;

      const correspondeFiltros =
        (!categoriaSelecionada ||
          Number(evento.idTipoEvento) === categoriaSelecionada) &&
        (!dataSelecionada || evento.dataEvento === dataSelecionada) &&
        (!horaInicioSelecionada ||
          evento.horaInicio === horaInicioSelecionada) &&
        (!horaFimSelecionada || evento.horaFim === horaFimSelecionada) &&
        (!statusSelecionado || evento.status === statusSelecionado);

      return correspondeBusca && correspondeFiltros;
    });

    setEventosFiltrados(resultado);
  }, [
    buscaEvento,
    categoriaSelecionada,
    dataSelecionada,
    horaInicioSelecionada,
    horaFimSelecionada,
    statusSelecionado,
    eventos,
  ]);

  const navigate = useNavigate();

  const obterEventos = async () => {
    try {
      const response = await api.get<Evento[]>(`/users/events`);
      setEventos(response.data);
    } catch (error) {
      console.error("Erro ao obter eventos", error);
    }
  };

  const ordenarEventos = (
    eventos: Evento[],
    criterio: string,
    crescente: boolean
  ): Evento[] => {
    const eventosOrdenados = [...eventos];

    eventosOrdenados.sort((a, b) => {
      if (criterio === "data") {
        const dataA = new Date(`${a.dataEvento}T${a.horaInicio}`);
        const dataB = new Date(`${b.dataEvento}T${b.horaInicio}`);
        return crescente
          ? dataA.getTime() - dataB.getTime()
          : dataB.getTime() - dataA.getTime();
      } else if (criterio === "nome") {
        return crescente
          ? a.nomeEvento.localeCompare(b.nomeEvento)
          : b.nomeEvento.localeCompare(a.nomeEvento);
      }
      return 0;
    });

    return eventosOrdenados;
  };

  useEffect(() => {
    obterEventos();
  }, []);

  useEffect(() => {
    const hoje = new Date();

    const classificados = {
      concluidos: [] as Evento[],
      emAndamento: [] as Evento[],
      confirmados: [] as Evento[],
    };

    const eventosOrdenados = ordenarEventos(
      eventos,
      criterioOrdenacao,
      ordemCrescente
    );

    const eventosFiltradosOrdenados = ordenarEventos(
      eventosFiltrados,
      criterioOrdenacao,
      ordemCrescente
    );

    setEventosFiltrados(eventosFiltradosOrdenados);

    eventosOrdenados.forEach((evento) => {
      const [ano, mes, dia] = evento.dataEvento.split("-").map(Number);
      const [horaInicio, minutoInicio] = evento.horaInicio
        .split(":")
        .map(Number);
      const [horaFim, minutoFim] = evento.horaFim.split(":").map(Number);

      const inicioEvento = new Date(
        ano,
        mes - 1,
        dia,
        horaInicio,
        minutoInicio
      );
      const fimEvento = new Date(ano, mes - 1, dia, horaFim, minutoFim);

      if (hoje >= inicioEvento && hoje <= fimEvento) {
        evento.status = "em andamento";
        classificados.emAndamento.push(evento);
      } else if (fimEvento < hoje) {
        evento.status = "concluido";
        classificados.concluidos.push(evento);
      } else {
        evento.status = "confirmado";
        classificados.confirmados.push(evento);
      }
    });

    setEventosClassificados(classificados);
  }, [eventos, criterioOrdenacao, ordemCrescente]);

  const formatarData = (dataISO: string): string => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}-${mes}-${ano}`;
  };

  const LimparFiltros = () => {
    setBuscaEvento("");
    setCategoriaSelecionada(0);
    setDataSelecionada("");
    setHoraInicioSelecionada("");
    setHoraFimSelecionada("");
    setStatusSelecionado("");
    setHoraInicioFiltrada([]);
    setHoraFimFiltrada([]);
    setDatasFiltradas([]);
  };

  return (
    <>
      <Helmet>
        <title>Meus Eventos | EventHub</title>
      </Helmet>
      <div className="conteudo-principal-meus-eventos">
        <div className="layout-titulo">Meus eventos</div>    
        <div className="meus-eventos-container">
          {eventos.length > 0 ? (
            <div className="ordenacao-meus-eventos">
                    <div className="conteudo-principal-meus-eventos__pesquisa-filtros">
          <div className="conteudo-principal-meus-eventos__pesquisa">
            <div className="conteudo-principal-meus-eventos__pesquisa__input">
              <Input
                valor={buscaEvento}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setBuscaEvento(event.target.value)
                }
                icone="fa-solid fa-magnifying-glass"
                posicaoIcone="esquerda"
                dica="Buscar evento..."
                name="busca-evento"
              />
            </div>
            <div className="conteudo-principal-meus-eventos__botao">
              <Botao
                tamanho="max"
                texto="Filtros"
                funcao={() => setMostrarFiltros(!mostrarFiltros)}
              />
            </div>
          </div>
            <div className={`conteudo-principal-meus-eventos__filtros ${mostrarFiltros ? 'conteudo-principal-meus-eventos__filtros--mostrar' : ''}`}>
              <div className="conteudo-principal-meus-eventos__filtros__selects">
                <Select
                  textoPadrao="Categoria"
                  valor={categoriaSelecionada}
                  funcao={(e: ChangeEvent<HTMLSelectElement>) =>
                    setCategoriaSelecionada(Number(e.target.value))
                  }
                  name="categoria-filtro"
                >
                  {categorias.map((categoria) => (
                    <option
                      key={categoria.idTipoEvento}
                      value={categoria.idTipoEvento}
                    >
                      {categoria.descricaoTipoEvento}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="conteudo-principal-meus-eventos__filtros__selects">
                <Select
                  textoPadrao="Data"
                  valor={dataSelecionada}
                  funcao={(e: ChangeEvent<HTMLSelectElement>) =>
                    setDataSelecionada(e.target.value)
                  }
                  name="data-filtro"
                >
                  {datasFiltradas.map((data) => (
                    <option key={data} value={data}>
                      {formatarData(data)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="conteudo-principal-meus-eventos__filtros__selects">
                <Select
                  textoPadrao="Hora inicio"
                  valor={horaInicioSelecionada}
                  funcao={(e: ChangeEvent<HTMLSelectElement>) =>
                    setHoraInicioSelecionada(e.target.value)
                  }
                  name="HoraInicio-filtro"
                >
                  {horaInicioFiltrada.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="conteudo-principal-meus-eventos__filtros__selects">
                <Select
                  textoPadrao="Hora fim"
                  valor={horaFimSelecionada}
                  funcao={(e: ChangeEvent<HTMLSelectElement>) =>
                    setHoraFimSelecionada(e.target.value)
                  }
                  name="HoraFim-filtro"
                >
                  {horaFimFiltrada.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
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
                >
                  <option value="confirmado">Próximos eventos</option>
                  <option value="em andamento">Em andamento</option>
                  <option value="concluido">Concluído</option>
                </Select>
              </div>
              <div
                className="conteudo-principal-meus-eventos__limpar-filtros"
                onClick={LimparFiltros}
              >
                Limpar filtros
              </div>
            </div>
          
        </div>
              <div className="ordenacao-ordem-exibicao">
                <div
                  className={`botao-ordernar-eventos ${
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
                  esconderValorPadrao={false}
                >
                  <option value="data">Data</option>
                  <option value="nome">Nome</option>
                </Select>
              </div>
              <div className="meus-eventos">
                {eventosFiltrados.length > 0 &&
                (buscaEvento.length > 1 ||
                  categoriaSelecionada ||
                  dataSelecionada ||
                  statusSelecionado) ? (
                  <details open className="exibicao-eventos">
                    <summary className="sumario-eventos">
                      <i className={`fa-solid fa-chevron-right exibicao-eventos__seta`}/>
                      <span className="exibicao-eventos__titulo">Eventos encontrados <span className="quantidade-eventos">({eventosFiltrados.length})</span></span>
                    </summary>
                    <div className="container">
                      <div className="row g-5">
                        {eventosFiltrados.map((evento) => (
                          <div
                            className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4"
                            key={evento.idEvento}
                          >
                            <CardEvento
                              key={evento.idEvento}
                              titulo={evento.nomeEvento}
                              status={evento.status}
                              dataEvento={formatarDados.data(evento.dataEvento)}
                              horaInicio={formatarDados.hora(evento.horaInicio)}
                              horaFim={formatarDados.hora(evento.horaFim)}
                              endereco={evento.enderecoLocal ? `${evento.enderecoLocal}, ${evento.numeroLocal}` : 'Sem local definido.'}
                              imagem={evento.imagemEvento}
                              id={evento.idEvento}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                ) : eventosFiltrados.length === 0 &&
                  (buscaEvento.length > 1 ||
                    categoriaSelecionada ||
                    dataSelecionada ||
                    statusSelecionado) ? (
                  <div className="eventos-nao-encontrados">
                    Nenhum evento encontrado.
                    <div className="sem-eventos-encontrados"></div>
                  </div>
                ) : (
                  <>
                    {eventosClassificados.emAndamento.length > 0 && (
                    <details open className="exibicao-eventos">
                      <summary className="sumario-eventos">
                        <i className={`fa-solid fa-chevron-right exibicao-eventos__seta`}/>
                        <span className="exibicao-eventos__titulo">Eventos em andamento <span className="quantidade-eventos">({eventosClassificados.emAndamento.length})</span></span>
                      </summary>
                        <div className="container">
                          <div className="row g-5">
                            {eventosClassificados.emAndamento.map((evento) => (
                              <div
                                className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4"
                                key={evento.idEvento}
                              >
                                <CardEvento
                                  titulo={evento.nomeEvento}
                                  status={evento.status}
                                  dataEvento={formatarDados.data(evento.dataEvento)}
                                  horaInicio={formatarDados.hora(evento.horaInicio)}
                                  horaFim={formatarDados.hora(evento.horaFim)}
                                  endereco={evento.enderecoLocal ? `${evento.enderecoLocal}, ${evento.numeroLocal}` : 'Sem local definido.'}
                                  imagem={evento.imagemEvento}
                                  id={evento.idEvento}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
                    )}

                    {eventosClassificados.confirmados.length > 0 && (
                      <details open className="exibicao-eventos">
                        <summary className="sumario-eventos">
                          <i className={`fa-solid fa-chevron-right exibicao-eventos__seta`}/>
                          <span className="exibicao-eventos__titulo">Próximos Eventos <span className="quantidade-eventos">({eventosClassificados.confirmados.length})</span></span>
                        </summary>
                        <div className="container">
                          <div className="row g-5">
                            {eventosClassificados.confirmados.map((evento) => (
                              <div
                                className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4"
                                key={evento.idEvento}
                              >
                                <CardEvento
                                  titulo={evento.nomeEvento}
                                  status={evento.status}
                                  dataEvento={formatarDados.data(evento.dataEvento)}
                                  horaInicio={formatarDados.hora(evento.horaInicio)}
                                  horaFim={formatarDados.hora(evento.horaFim)}
                                  endereco={evento.enderecoLocal ? `${evento.enderecoLocal}, ${evento.numeroLocal}` : <i>Sem local definido.</i>}
                                  imagem={evento.imagemEvento}
                                  id={evento.idEvento}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
                    )}

                    {eventosClassificados.concluidos.length > 0 && (
                      <details open className="exibicao-eventos">
                        <summary className="sumario-eventos">
                          <i className={`fa-solid fa-chevron-right exibicao-eventos__seta`}/>
                          <span className="exibicao-eventos__titulo">Eventos Concluidos <span className="quantidade-eventos">({eventosClassificados.concluidos.length})</span></span>
                        </summary>
                        <div className="container">
                          <div className="row g-5">
                            {eventosClassificados.concluidos.map((evento) => (
                              <div
                                className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4"
                                key={evento.idEvento}
                              >
                                <CardEvento
                                  titulo={evento.nomeEvento}
                                  status={evento.status}
                                  dataEvento={formatarDados.data(evento.dataEvento)}
                                  horaInicio={formatarDados.hora(evento.horaInicio)}
                                  horaFim={formatarDados.hora(evento.horaFim)}
                                  endereco={evento.enderecoLocal ? `${evento.enderecoLocal}, ${evento.numeroLocal}` : 'Sem local definido.'}
                                  imagem={evento.imagemEvento}
                                  id={evento.idEvento}
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
                onClick={() => navigate("/organizador/criar-evento")}
                className="botao-criar-eventos"
              >
                <div
                  className="botao-criar-eventos-meus-eventos"
                  title="Criar evento"
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
          ) : (
            <div className="formulario-sem-eventos">
              <FeedbackFormulario
                caminhoBotao="/organizador/criar-evento"
                titulo="Sem eventos por aqui ainda..."
                texto="Está pronto para organizar algo incrível? Crie um evento e comece a planejar agora mesmo!"
                textoBotao="Criar evento"
              >
                <path
                  d="M7.09118 1.15133C5.40653 -0.444511 2.74716 -0.372514 1.15133 1.31214C-0.444511 2.99679 -0.372514 5.65615 1.31214 7.25199L91.9023 93.0663C93.5869 94.6622 96.2463 94.5902 97.8421 92.9055C99.438 91.2209 99.366 88.5615 97.6813 86.9657L7.09118 1.15133ZM100 66.0863C100 71.163 98.1288 75.8027 95.0384 79.3533L88.9284 73.5653C90.5961 71.5283 91.5967 68.9242 91.5967 66.0863V26.3516C91.5967 19.8269 86.3074 14.5375 79.7827 14.5375H75.9997C74.0749 20.7447 68.2892 25.2517 61.4499 25.2517C54.6106 25.2517 48.8249 20.7447 46.9001 14.5375H26.6174L17.9908 6.36549C18.9911 6.21321 20.0156 6.13425 21.0585 6.13425H50.425C52.6996 6.13425 54.5612 7.94434 54.625 10.2181C54.7282 13.8964 57.745 16.8484 61.4499 16.8484C65.1548 16.8484 68.1716 13.8964 68.2748 10.2181C68.3386 7.94434 70.2002 6.13425 72.4748 6.13425H79.7827C90.9484 6.13425 100 15.1859 100 26.3516V66.0863ZM64.7041 46.796C64.7041 47.8739 64.2982 48.857 63.6309 49.6008L57.1443 43.4559C57.9111 42.438 59.1299 41.7799 60.5025 41.7799C62.823 41.7799 64.7041 43.6611 64.7041 45.9816V46.796ZM4.61312 14.5892C2.23879 17.903 0.84116 21.9641 0.84116 26.3516L0.841215 66.0863C0.841215 77.252 9.89282 86.3036 21.0585 86.3036H50.425C52.6996 86.3036 54.5612 84.4935 54.625 82.2198C54.7282 78.5415 57.745 75.5894 61.4499 75.5894C65.1548 75.5894 68.1716 78.5415 68.2748 82.2198C68.3386 84.4935 70.2002 86.3036 72.4748 86.3036H79.7827C79.9588 86.3036 80.1344 86.3013 80.3094 86.2969L60.1899 67.2375C53.9076 67.7519 48.7055 72.0783 46.9001 77.9003H21.0585C14.5338 77.9003 9.24451 72.611 9.24451 66.0863L9.24445 26.3516C9.24445 24.2075 9.81561 22.1968 10.8141 20.4634L4.61312 14.5892ZM60.5025 29.2165C62.823 29.2165 64.7041 31.0976 64.7041 33.4181V34.2325C64.7041 36.5531 62.823 38.4342 60.5025 38.4342C58.1819 38.4342 56.3008 36.5531 56.3008 34.2325V33.4181C56.3008 31.0976 58.1819 29.2165 60.5025 29.2165Z"
                  fill="#8C5DFF"
                />
              </FeedbackFormulario>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MeusEventos;
