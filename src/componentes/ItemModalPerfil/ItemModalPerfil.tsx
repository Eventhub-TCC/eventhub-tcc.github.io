import "./ItemModalPerfil.css";

const ItemModal = ({ texto, icone, funcao, organizador, prestador }: any) => {
    return (
        <button 
        onClick={funcao}
        style={{ background: 'none', border: 'none', padding: 0, margin: 0, width: '100%', textAlign: 'left', cursor: 'pointer' }}>
            <div className="item-modal-perfil">
                <i className={icone}></i>
                <div className="item-modal-perfil__texto">
                    <span>{texto}</span>
                    { organizador ? 
                            <div style={{color: 'var(--yellow-700)', fontSize: '11px'}}>
                                Prestador de Serviços
                            </div> : ''}
                        { prestador ? 
                        <div style={{color: 'var(--purple-700)', fontSize: '10px'}}>
                                Organizador de Eventos
                        </div> : ''}

                </div>
            </div>
        </button>
    );

    }
    export default ItemModal