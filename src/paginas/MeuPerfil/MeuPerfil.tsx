// import React from 'react'
import './MeuPerfil.css'
import Botao from '../../componentes/Botao/Botao'
import Input from '../../componentes/Input/Input'

const MeuPerfil = () => {
  return (
    <div>
          <div className='perfil'>
            <h1 className='titulo-h1'>Perfil</h1>
            <div className='div-caixa'>
              <div className='formulario-perfil'>
                <div className='perfil-foto-nome-email-organizador'>
                  <div className='foto-perfil'> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
                      <circle cx="38" cy="38" r="37.5" fill="#D9D9D9" stroke="#D9D9D9"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M62.1304 66.2249C55.6243 71.6988 47.201 75.0006 37.9999 75.0006C28.7988 75.0006 20.3755 71.6988 13.8695 66.2249C17.1125 59.0364 24.3242 54.0373 32.7038 54.0373H43.2961C51.6756 54.0373 58.8874 59.0364 62.1304 66.2249ZM48.489 44.0988C45.7072 46.8894 41.9341 48.4572 37.9999 48.4572C34.0658 48.4572 30.2927 46.8894 27.5108 44.0988C24.729 41.3082 23.1661 37.5233 23.1661 33.5767C23.1661 29.6302 24.729 25.8453 27.5108 23.0547C30.2927 20.264 34.0658 18.6963 37.9999 18.6963C41.9341 18.6963 45.7072 20.264 48.489 23.0547C51.2709 25.8453 52.8338 29.6302 52.8338 33.5767C52.8338 37.5233 51.2709 41.3082 48.489 44.0988Z" fill="white"/>
                    </svg>
                    <div className='nome-email-organizador'>
                      <h2 className='nome-perfil-organizador'>Ana da Silva</h2>
                      ana.silva@email.com
                    </div>
                  </div>
                    <div className='botoes-foto-perfil'>
                      <div className='botao-alterar-foto-perfil'>
                        <Botao texto='Alterar foto' />
                      </div>
                      <div className='botao-remover-foto-perfil'>
                        <Botao texto='Remover foto' />
                      </div>
                    </div>
                </div>
              </div>
            </div>


            <div className='div-caixa2'>
              <div className='informacoes-pessoais-perfil-organizador'>
                <p className='texto-informacoes-pessoal'>Informações Pessoais</p>
                </div>
                  <div className='campos-informacoes-pessoais-perfil-organizador'>
                    <div className='alinhamento-campos'>
                      <div className='titulo-input-perfil'>
                        <h1 className='texto-input-perfil'>Nome</h1>
                      <div className='inputs-perfil'>
                       <Input disabled="true" dica='Vitória Helen'/>
                      </div>
                    </div>
                    <div className='titulo-input-perfil'>
                      <h1 className='texto-input-perfil'>Sobrenome</h1>
                      <div className='inputs-perfil'>
                        <Input disabled="true" dica='Veloso'/>
                    </div>
                  </div>
                </div>
                <div className='alinhamento-campos'>
                      <div className='titulo-input-perfil'>
                        <h1 className='texto-input-perfil'>CPF</h1>
                      <div className='inputs-perfil'>
                       <Input disabled="true" dica='000.000.000-00'/>
                      </div>
                    </div>
                    <div className='titulo-input-perfil'>
                      <h1 className='texto-input-perfil'>Data Nascimento</h1>
                      <div className='inputs-perfil'>
                        <Input disabled="true" dica='20/01/2024'/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='div-caixa2'>
              <div className='informacoes-pessoais-perfil-organizador'>
                <p className='texto-informacoes-pessoal'>Contato</p>
                </div>
                  <div className='campos-informacoes-pessoais-perfil-organizador'>
                    <div className='alinhamento-campos'>
                      <div className='titulo-input-perfil'>
                        <h1 className='texto-input-perfil'>E-mail</h1>
                      <div className='inputs-perfil'>
                       <Input disabled="true" dica='vitoria@gmail.com'/>
                      </div>
                    </div>
                    <div className='titulo-input-perfil'>
                      <h1 className='texto-input-perfil'>Telefone</h1>
                      <div className='inputs-perfil'>
                        <Input disabled="true" dica='(11) 11111-1111'/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='div-caixa2'>
              <div className='informacoes-pessoais-perfil-organizador'>
                <p className='texto-informacoes-pessoal'>Segurança</p>
                </div>
                  <div className='campos-informacoes-pessoais-perfil-organizador'>
                    <div className='alinhamento-campos'>
                      <div className='titulo-input-perfil'>
                        <h1 className='texto-input-perfil'>Senha atual</h1>
                      <div className='inputs-perfil'>
                       <Input disabled="true" dica='************'/>
                      </div>
                    </div>
                </div>
              </div>
            </div>

            <div className='botoes-alterar-perfil'>
              <div className='botao-editar'>
                <Botao tamanho='max' texto='Editar' />
              </div>
              <div className='botao-deletar'>
                <Botao tamanho='max' texto='Deletar' />
              </div>
            </div>
          </div>
    </div>
  )
}

export default MeuPerfil


