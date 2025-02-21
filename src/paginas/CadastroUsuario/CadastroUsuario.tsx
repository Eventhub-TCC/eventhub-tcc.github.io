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
    const [ dataNascimento, setDataNascimento ] = useState(new Date());
    const [ tipoUsuario, setTipoUsuario ] = useState<number[]>([])

    const cadastrarUsuario = async(e:FormEvent<HTMLFormElement>, email:string, senha:string, confirmarSenha:string, telefone:string, nome:string, sobrenome:string, nomeEmpresa:string, cpf:string, cnpj:string, localizacao:string, dataNascimento:Date, tipoUsuario:number[])=>{
        e.preventDefault()
        if(senha === confirmarSenha){
            try{
                await axios.post('http://localhost:3000/users/signup',{
                    emailUsu: email,
                    senhaUsu: senha,
                    telUsu: telefone,
                    nomeUsu: nome,
                    sobrenomeUsu: sobrenome,
                    nomeEmpresa: nomeEmpresa,
                    cpfUsu: cpf,
                    cnpjEmpresa: cnpj,
                    localizacaoEmpresa: localizacao,
                    dtNasUsu: dataNascimento,
                    idTipo: tipoUsuario
                })
                console.log('Usuário cadastrado com sucesso!')
            }
            catch(erro){
                console.log('Erro ao cadastrar usuário')
            }
        }
        else{
            console.log('As senhas não coincidem')
        }
    }

  
    return (
      <div className="container-fundo">
        <div className='container container-cadastro'>
          <form className='form' onSubmit={(e:FormEvent<HTMLFormElement>)=>cadastrarUsuario(e, email, senha, confirmarSenha, telefone, nome, sobrenome, nomeEmpresa, cpf, cnpj, localizacao, dataNascimento, tipoUsuario)}>
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
                            funcao={(e:ChangeEvent<HTMLInputElement>) => setTipoUsuario([Number(e.target.value)])}
                            value="1"
                        /> 
                    </div>
                    <div>
                        <InputRadio 
                            nome='cadastro'
                            id='prestador-radio'
                            textoLabel='Prestador de Serviço'
                            funcao={(e:ChangeEvent<HTMLInputElement>) => setTipoUsuario([Number(e.target.value)])}
                            value={2}
                        /> 
                    </div>
                    <div>
                        <InputRadio 
                            nome='cadastro'
                            id='ambos-radio'
                            textoLabel='Ambos'
                            funcao={() => setTipoUsuario([1,2])}
                            
                        
                            value={[1,2]}
                        /> 
                    </div>
            </div>
                <div className={tipoUsuario.includes(1) ? 'd-block' : 'd-none'}>
                    <div>
                    <Input 
                        tipo='text'
                        dica='Insira seu nome' 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setNome(event.target.value)} 
                        name='nome'
                    />
                </div>
                <div>
                    <Input 
                        tipo="text"
                        dica="Insira seu sobrenome"
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setSobrenome(event.target.value)} 
                        name='sobrenome'
                    />
                </div>
                <div>
                    <Input 
                        tipo="number"
                        dica="Insira seu CPF"
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setCpf(event.target.value)}
                        name='cpf'
                    /> 
                </div>
                <div>
                    <Input 
                        tipo='date'
                        dica='Insira sua data de nascimento' 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setDataNascimento(new Date(event.target.value))} 
                        name='dataNascimento'
                    />
                    </div>
                </div>
            <div className={ tipoUsuario.includes(2) ? 'd-block' : 'd-none'}>
                    <div>
                        <Input 
                            tipo="text"
                            dica="Insira o nome da sua empresa"
                            onChange={(event:ChangeEvent<HTMLInputElement>) => setNomeEmpresa(event.target.value)}
                            name='nomeEmpresa'
                        />
                    </div>
                    <div>
                        <Input 
                            tipo="number"
                            dica="Insira seu CNPJ"
                            onChange={(event:ChangeEvent<HTMLInputElement>) => setCnpj(event.target.value)}
                            name='cnpj'
                        />
                        <div>
                        <div>
                    <Input 
                        tipo="text"
                        dica="Insira sua localização"
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setLocalizacao(event.target.value)}
                        name='localizacao'
                     />
                     </div>
                        </div>
                    </div>
                
            </div>
            <div className={tipoUsuario.length>0  ? 'd-block' : 'd-none'}>
            <div>
                    <Input 
                        dica='Insira seu email' 
                        tipo='email' 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} 
                        name='email'
                    />
                </div>
                <div>
                    <Input 
                        dica='Insira sua senha' tipo={senhaOculta ? 'password' : 'text'} 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setSenha(event.target.value)} 
                        icone={`fa-solid ${senhaOculta ? 'fa-eye-slash' : 'fa-eye'}`} 
                        funcaoIcone={() => setSenhaOculta(!senhaOculta)} 
                        name='senha'
                    />
                </div>
                <div>
                    <Input 
                        dica='Confirme sua senha' tipo={confirmarSenhaOculta ? 'password' : 'text'} 
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setConfirmarSenha(event.target.value)} 
                        icone={`fa-solid ${confirmarSenhaOculta ? 'fa-eye-slash' : 'fa-eye'}`} 
                        funcaoIcone={() => setConfirmarSenhaOculta(!confirmarSenhaOculta)} 
                        name='confirmarSenha'
                    />
                </div>
                    <div>
                        <Input 
                            tipo="number"
                            dica="Insira seu telefone"
                            onChange={(event:ChangeEvent<HTMLInputElement>) => setTelefone(event.target.value)} 
                            name='telefone'
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