import "./Cadastro.css"
import axios from 'axios'
import { ChangeEvent, FormEvent, useState } from 'react'
import Input from '../../componentes/Input/Input'
import Botao from '../../componentes/Botao/Botao'
import InputRadio from '../../componentes/InputRadio/InputRadio'


const Cadastro = () => {
    const [ telefone, setTelefone ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ senha, setSenha ] = useState('');
    const [ senhaOculta, setSenhaOculta ] = useState(true);
    const [ confirmarSenha, setConfirmarSenha ] = useState('');
    const [ confirmarSenhaOculta, setConfirmarSenhaOculta ] = useState(true);
    const [ nome, setNome ] = useState('');
    const [ sobrenome, setSobrenome ] = useState('');
    const [ nomeEmpresa, setNomeEmpresa ] = useState('');
    const [ cpf, setCpf ] = useState('');
    const [ cnpj, setCnpj ] = useState('');
    const [ localizacao, setLocalizacao ] = useState('');
    const [ dataNascimento, setDataNascimento ] = useState('');
    const [ tipoUsuario, setTipoUsuario ] = useState('')

  
    return (
      <div className="container-fundo">
        <div className='container container-cadastro'>
          <form className='form'>
            <h1 className='titulo-cadastro'>Cadastro</h1>
            <div>
                <p className="text-center">
                    Quais funções gostaria de realizar na plataforma?
                </p>
                
                    <div>
                        <InputRadio 
                            nome='cadastro'
                            id='organizador-radio'
                            textoLabel='Organizador de Eventos'
                            funcao={() => setTipoUsuario('Organizador')}
                        /> 
                    </div>
                    <div>
                        <InputRadio 
                            nome='cadastro'
                            id='prestador-radio'
                            textoLabel='Prestador de Serviço'
                            funcao={() => setTipoUsuario('Prestador de Serviço')}
                        /> 
                    </div>
                    <div>
                        <InputRadio 
                            nome='cadastro'
                            id='ambos-radio'
                            textoLabel='Ambos'
                            funcao={() => setTipoUsuario('Ambos')}
                        /> 
                    </div>
            </div>
                <div className={tipoUsuario === 'Organizador' ||tipoUsuario ==='Ambos' ? 'd-block' : 'd-none'}>
                    <div>
                    <Input 
                        tipo='text'
                        dica='Insira seu nome' 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setNome(event.target.value)} 
                    />
                </div>
                <div>
                    <Input 
                        tipo="text"
                        dica="Insira seu sobrenome"
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setSobrenome(event.target.value)} 
                    />
                </div>
                <div>
                    <Input 
                        tipo="number"
                        dica="Insira seu CPF"
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setCpf(event.target.value)}
                    /> 
                </div>
                <div>
                    <Input 
                        tipo='date'
                        dica='Insira sua data de nascimento' 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setDataNascimento(event.target.value)} 
                    />
                    </div>
                </div>
            <div className={tipoUsuario === 'Prestador de Serviço'|| tipoUsuario ==='Ambos' ? 'd-block' : 'd-none'}>
                    <div>
                        <Input 
                            tipo="text"
                            dica="Insira o nome da sua empresa"
                            onChange={(event:ChangeEvent<HTMLInputElement>) => setNomeEmpresa(event.target.value)}
                        />
                    </div>
                    <div>
                        <Input 
                            tipo="number"
                            dica="Insira seu CNPJ"
                            onChange={(event:ChangeEvent<HTMLInputElement>) => setCnpj(event.target.value)}
                        />
                        <div>
                        <div>
                    <Input 
                        tipo="text"
                        dica="Insira sua localização"
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setLocalizacao(event.target.value)}
                     />
                     </div>
                        </div>
                    </div>
                
            </div>
            <div className={tipoUsuario  ? 'd-block' : 'd-none'}>
            <div>
                    <Input 
                        dica='Insira seu email' 
                        tipo='email' 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} 
                    />
                </div>
                <div>
                    <Input 
                        dica='Insira sua senha' tipo={senhaOculta ? 'password' : 'text'} 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setSenha(event.target.value)} 
                        icone={`fa-solid ${senhaOculta ? 'fa-eye-slash' : 'fa-eye'}`} 
                        funcaoIcone={() => setSenhaOculta(!senhaOculta)} 
                    />
                </div>
                <div>
                    <Input 
                        dica='Confirme sua senha' tipo={confirmarSenhaOculta ? 'password' : 'text'} 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setConfirmarSenha(event.target.value)} 
                        icone={`fa-solid ${confirmarSenhaOculta ? 'fa-eye-slash' : 'fa-eye'}`} 
                        funcaoIcone={() => setConfirmarSenhaOculta(!confirmarSenhaOculta)} 
                    />
                </div>
                    <div>
                        <Input 
                            tipo="number"
                            dica="Insira seu telefone"
                            onChange={(event:ChangeEvent<HTMLInputElement>) => setTelefone(event.target.value)} 
                        />
                        </div>
                    </div>
            <div>
              <Botao
                texto='Cadastrar'
                tamanho='med' 
              />
            </div>
          </form>
        </div>
      </div>
    )
}

export default Cadastro