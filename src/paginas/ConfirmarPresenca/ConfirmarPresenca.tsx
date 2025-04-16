// import React from 'react'
import './ConfirmarPresenca.css'
// import logo from '../../assets/logo_eventhub_fonte_branca.png'
// import imagemFundo from '../../assets/imagem_fundo.png'
// import { div } from 'framer-motion/client'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import { data, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ConfirmarPresenca = () => {
    const { idConvite } = useParams();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [rg, setRg] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");


    const [tituloEvento, setTituloEvento] = useState("")
    const [dataEvento, setDataEvento] = useState("")
    const [horaInicio, setHoraInicio] = useState("")
    const [horaFim, setHoraFim] = useState("")
    const [cepLocal, setCepLocal] = useState("")
    const [enderecoLocal, setEnderecoLocal] = useState("")
    const [numeroLocal, setNumeroLocal] = useState("")
    const [complementoLocal, setComplementoLocal] = useState("")
    const [bairroLocal, setBairroLocal] = useState("")
    const [cidadeLocal, setCidadeLocal] = useState("")
    const [ufLocal, setUfLocal] = useState("")



    useEffect(() => {
        const buscarConvite = async () => {
          try {
            console.log ('idConvite', idConvite)
            const response = await axios.get(`http://localhost:3000/users/convites/${idConvite}`)

            const evento = response.data
            console.log('evento', evento)
    
            setTituloEvento(evento.nomeEvento)
            setDataEvento(evento.dataEvento)
            setHoraInicio(evento.horaInicio)
            setHoraFim(evento.horaFim)
            setCepLocal(evento.cepLocal)
            setEnderecoLocal(evento.enderecoLocal)
            setNumeroLocal(evento.numeroLocal)
            setComplementoLocal(evento.complementoLocal)
            setBairroLocal(evento.bairroLocal)
            setCidadeLocal(evento.cidadeLocal)
            setUfLocal(evento.ufLocal)
          } catch (err) {
            console.error('Erro ao buscar convite:', err)
            alert("Erro ao carregar dados do evento.")
          }
        }
    
        if (idConvite) {
          buscarConvite()
        }
      }, [idConvite])
  
    const confirmarPresenca = async () => {
        try {
          await axios.post(`http://localhost:3000/users/confirmar-convite/${idConvite}`, {
            nome,
            email,
            rg,
            dataNascimento,
          });
          alert("Presença confirmada! Aguarde aprovação.");
        } catch (err) {
          console.error(err);
          alert("Erro ao confirmar presença.");
        }
      };


  return (
    <div className='container-convite'>
        <div className="imagem-fundo">
            <div className='cabecalho-roxo'>
                <div className='logo-eventhub'></div>
            </div>
        </div>
        <div className='informacoes-evento-convite'>
            <div className='mensagem-titulo'>
                <div className='mensagem'>Você foi convidado(a) para o evento</div>
                <div className='titulo'>{tituloEvento || "Carregando..."}</div>
            </div>
            <div className='caixa-texto-evento'>
                Preencha seus dados para confirmar sua presenca            
                </div>
            <div className='dados-evento'>
                <div className='data-evento'>
                    <div className='imagem-calendario'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M6.78125 15.0677V15M10.7188 15.0677V15M10.7188 11.4V11.3323M14.2188 11.4V11.3323M4.15625 7.79997H16.4063M5.73958 2.625V3.97516M14.6563 2.625V3.97499M14.6563 3.97499H5.90625C4.4565 3.97499 3.28125 5.18382 3.28125 6.67498V15.675C3.28125 17.1662 4.4565 18.375 5.90625 18.375H14.6562C16.106 18.375 17.2812 17.1662 17.2812 15.675L17.2813 6.67498C17.2813 5.18382 16.106 3.97499 14.6563 3.97499Z" stroke="#55379D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div className='texto-data-evento'>{dataEvento}</div>
                </div>
                <div className='horario-evento'>
                    <div className='imagem-relogio'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M13.5744 13.4174C14.0983 13.5921 14.6647 13.3089 14.8393 12.785C15.014 12.261 14.7308 11.6947 14.2069 11.5201L13.5744 13.4174ZM10.9375 11.4844H9.9375C9.9375 11.9148 10.2129 12.2969 10.6213 12.4331L10.9375 11.4844ZM11.9375 7.36826C11.9375 6.81598 11.4898 6.36826 10.9375 6.36826C10.3852 6.36826 9.9375 6.81598 9.9375 7.36826H11.9375ZM14.2069 11.5201L11.2537 10.5357L10.6213 12.4331L13.5744 13.4174L14.2069 11.5201ZM11.9375 11.4844V7.36826H9.9375V11.4844H11.9375ZM17.8125 10.5C17.8125 14.297 14.7345 17.375 10.9375 17.375V19.375C15.839 19.375 19.8125 15.4015 19.8125 10.5H17.8125ZM10.9375 17.375C7.14054 17.375 4.0625 14.297 4.0625 10.5H2.0625C2.0625 15.4015 6.03597 19.375 10.9375 19.375V17.375ZM4.0625 10.5C4.0625 6.70304 7.14054 3.625 10.9375 3.625V1.625C6.03597 1.625 2.0625 5.59847 2.0625 10.5H4.0625ZM10.9375 3.625C14.7345 3.625 17.8125 6.70304 17.8125 10.5H19.8125C19.8125 5.59847 15.839 1.625 10.9375 1.625V3.625Z" fill="#55379D"/>
                        </svg>
                    </div>
                    <div className='texto-horario-evento'>{horaInicio} - {horaFim}</div>
                </div>
                <div className='local-evento'>
                    <div className='imagem-local'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M10.5002 18.8996C10.5002 18.8996 17.0741 13.0561 17.0741 8.67352C17.0741 5.04285 14.1309 2.09961 10.5002 2.09961C6.86951 2.09961 3.92627 5.04285 3.92627 8.67352C3.92627 13.0561 10.5002 18.8996 10.5002 18.8996Z" stroke="#55379D" stroke-width="2"/>
                        <path d="M12.6005 8.39974C12.6005 9.55954 11.6602 10.4997 10.5005 10.4997C9.34065 10.4997 8.40045 9.55954 8.40045 8.39974C8.40045 7.23994 9.34065 6.29974 10.5005 6.29974C11.6602 6.29974 12.6005 7.23994 12.6005 8.39974Z" stroke="#55379D" stroke-width="2"/>
                    </svg>
                    </div>
                    <div className='texto-local-evento'> {enderecoLocal +', '+ numeroLocal + ', ' + cidadeLocal + ' - ' + ufLocal} </div>
                </div>
            </div>
        </div>
        <div className='campos-dados-convidado'>
            <div className='inputs-dados-convidado'>
                <div className='titulo-dados'>
                    Preencha os campos abaixo
                </div>
                <div className='instrucao-dados'>
                    As informações fornecidas serão compartilhadas com o organizador do evento e utilizados para garantir sua identificação e uma melhor experiência durante o evento.
                </div>
                <div className='input-texto-dados'>
                    <div>Nome</div>
                    <div className='tamanho-input-convidado'>
                        <Input value={nome} onChange={(e:any) => setNome(e.target.value)} text='' dica='Digite seu nome'/>
                    </div>
                </div>
                <div className='input-texto-dados'>
                    <div>Email</div>
                    <div className='tamanho-input-convidado'>
                        <Input value={email} onChange={(e:any) => setEmail(e.target.value)} type='email' dica='Digite seu email'/>
                    </div>
                </div>
                <div className='input-texto-dados'>
                    <div>Data de nascimento</div>
                    <div className='tamanho-input-convidado'>
                        <Input value={dataNascimento} onChange={(e:any) => setDataNascimento(e.target.value)} type='date' dica='Digite sua data de nascimento'/>
                    </div>
                </div>
                <div className='input-texto-dados'>
                    <div>RG</div>
                    <div className='tamanho-input-convidado'>
                        <Input value={rg} onChange={(e:any) => setRg(e.target.value)} nome='rg' obrigatorio dica='Digite seu RG'/>
                    </div>
                </div>
                <div>
                    <Botao texto='Enviar' funcao={confirmarPresenca}></Botao>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ConfirmarPresenca