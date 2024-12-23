import { ChangeEvent, FormEvent, useState } from 'react'
import './CadastroEvento.css'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import Select from '../../componentes/Select/Select'
import axios from 'axios'


const CadastroEvento = () => {
  const [tipoEvento, setTipoEvento] = useState(0)
  const [nomeEvento, setNomeEvento] = useState('')
  const [localEvento, setLocalEvento] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFim, setHoraFim] = useState('')
  const [dataEvento, setDataEvento] = useState(new Date())

  
  const criarEvento = async(e:FormEvent<HTMLFormElement>,nomeEvento: string,localEvento: string,dataEvento: Date,horaInicio:string,horaFim:string,idTipoEvento:number)=>{
    e.preventDefault()
    await axios.post('http://localhost:3000/users/ca5f6e79-2373-40fa-a550-7ce58d7da19a/events',{
      nomeEvento,
      localEvento,
      dataEvento,
      horaInicio,
      horaFim,
      idTipoEvento,
      idUsuario: 'ca5f6e79-2373-40fa-a550-7ce58d7da19a'
    } )
  }

  return (
    <form>
      <h1>Novo evento</h1>
        <div>
          <Select cabecalho={true} cabecalhoTexto='Tipos de Eventos:' opcoes={[1,2,3]} funcao={(e:ChangeEvent<HTMLSelectElement>)=>{setTipoEvento(Number(e.target.value))}}/>
        </div>
        <div>
          <Input cabecalho={true} cabecalhoTexto='Nome do evento:' tipo='text' dica='Insira o nome do evento' onChange={(e:ChangeEvent<HTMLInputElement>)=>{setNomeEvento(e.target.value)}}/>
        </div>
        <div>
          <Input cabecalho={true} cabecalhoTexto='Local do evento:' dica='Insira o endereço do evento' tipo='text' obrigatorio={false} onChange={(e:ChangeEvent<HTMLInputElement>)=>{setLocalEvento(e.target.value)}}/>
        </div>
        <div>
          <Input cabecalho={true} cabecalhoTexto='Data do evento:' dica='Insira a data do evento' tipo='date' onChange={(e:ChangeEvent<HTMLInputElement>)=>{setDataEvento(new Date(e.target.value))}}/>
        </div>
        <div>
          <Input cabecalho={true} cabecalhoTexto='Hora de início:' dica='Insira a hora de início' tipo='time'  onChange={(e:ChangeEvent<HTMLInputElement>)=>{setHoraInicio(e.target.value);console.log(horaInicio)}}/>
        </div>
        <div>
          <Input cabecalho={true} cabecalhoTexto='Hora de término:' dica='Insira a hora de término' tipo='time'  onChange={(e:ChangeEvent<HTMLInputElement>)=>{setHoraFim(e.target.value)}}/>
        </div>
        <div>
          <Botao texto='Criar evento' tamanho='max' funcao={(e:FormEvent<HTMLFormElement>)=>{criarEvento(e,nomeEvento,localEvento,dataEvento,horaInicio,horaFim,tipoEvento)}}/>
        </div>
    </form>
  )
}

export default CadastroEvento