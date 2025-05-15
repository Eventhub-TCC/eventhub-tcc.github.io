import './InformacoesServico.css'
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import api from '../../axios';
import CabecalhoServico from '../../componentes/CabecalhoServico/CabecalhoServico';
import Secao from '../../componentes/Secao/Secao';

interface Servico{
    idServico: number;
    nomeServico: string;
    descricaoServico: string;
    unidadeCobranca: string;
    valorServico: number;
    qntMinima: number;
    qntMaxima: number;
    imagem1: string;
    imagem2?: string;
    imagem3?: string;
    imagem4?: string;
    imagem5?: string;
    imagem6?: string;
    tipoServico: TipoServico;
}

interface TipoServico {
    idTipoServico: string;
    descricaoTipoServico: string;
}

const InformacoesServico = () => {
    const { idServico } = useParams();
    const [servico, setServico] = useState<Servico | null>(null);
    const [idUsuario, setIdUsuario] = useState<any>(null);
    const [preView, setPreview] = useState<any>([]);
    
    useEffect(() => {
        try {
            api.get(`/users/get-user`)
            .then((res) => {
                setIdUsuario(res.data.idUsuario);
                api.get(`/users/${idUsuario}/services/${idServico}`)
                    .then((res) => {
                        console.log(res.data);
                        setServico(res.data);
                        const imagens = [res.data.imagem1, res.data.imagem2, res.data.imagem3, res.data.imagem4, res.data.imagem5, res.data.imagem6];
                        setPreview(imagens.map((imagem) => imagem !== null ? `http://localhost:3000/files/${imagem}` : null));
                    })
                    .catch((err) => {
                        console.error("Erro ao buscar o serviço", err);
                    });
            }) 
            .catch((err) => {
                console.error("Erro obter usuário", err);
            });
        } 
        catch(error){
            console.error('Erro ao obter serviços', error);
        }
    }, [idServico]);

    if (!servico) return;

    const formatarValor = (valor: number) => {
        const valorFormatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return valorFormatado;
    }

    return (
        <div>
            <div className='informacoes-servico__cabecalho'>
                {/* <CabecalhoServico
                    idServico={idServico} 
                    servico={servico}
                    preViewSv={preView}
                    setServico={setServico}
                    idUsuario={idUsuario}
                /> */}
            </div>
            <div className='informacoes-servico__container'>
                <Secao titulo='Detalhes do serviço' corBorda='var(--yellow-700)' corTitulo='var(--yellow-800)'>
                    <div className='informacoes-servico__detalhes'>
                        <div className='row g-4'>
                            <div className='col-12'>
                                <p className='informacoes-servico__titulo-detalhes'>Categoria</p>
                                <p className='informacoes-servico__texto-detalhes'>{servico.tipoServico.descricaoTipoServico}</p>
                            </div>
                        </div>
                        <div className='row g-4'>
                            <div className='col-12'>
                                <p className='informacoes-servico__titulo-detalhes'>Descrição</p>
                                <p className={`informacoes-servico__texto-detalhes`}>
                                    {servico.descricaoServico}
                                </p>
                            </div>        
                        </div>
                    </div>
                </Secao>
                <Secao titulo='Valor e condições de contratação' corBorda='var(--yellow-700)' corTitulo='var(--yellow-800)'>
                    <div className='informacoes-servico__detalhes'>
                        <div className='row g-4'>
                            <div className='col-12 col-sm-6'>
                                <p className='informacoes-servico__titulo-detalhes'>Valor</p>
                                <p className='informacoes-servico__texto-detalhes'>{formatarValor(servico.valorServico)}</p>
                            </div>
                            <div className='col-12 col-sm-6'>
                                <p className='informacoes-servico__titulo-detalhes'>Unidade de cobrança</p>
                                <p className={`informacoes-servico__texto-detalhes`}>
                                    {servico.unidadeCobranca}
                                </p>
                            </div>    
                        </div>
                        <div className='row g-4'>
                            <div className='col-12 col-sm-6'>
                                <p className='informacoes-servico__titulo-detalhes'>Quantidade mínima</p>
                                <p className='informacoes-servico__texto-detalhes'>{servico.qntMinima}</p>
                            </div>
                            <div className='col-12 col-sm-6'>
                                <p className='informacoes-servico__titulo-detalhes'>Quantidade máxima</p>
                                <p className={`informacoes-servico__texto-detalhes`}>
                                    {servico.qntMaxima}
                                </p>
                            </div>  
                        </div>
                    </div>
                </Secao>
                <Secao titulo='Imagens do serviço' corBorda='var(--yellow-700)' corTitulo='var(--yellow-800)'>
                    <div className='row g-4 informacoes-servico__imagens'>
                        {
                            preView.map((imagem: string, index: number) => {
                                if (imagem !== null) {
                                    return (
                                        <div key={index} className='col-12 col-md-6 col-lg-4'>
                                            <img src={imagem} alt="Imagem do serviço" className='informacoes-servico__imagem'/>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </Secao>
            </div>
        </div>
    )
}

export default InformacoesServico