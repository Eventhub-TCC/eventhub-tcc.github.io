import "./ItemModalPerfil.css";

const ItemModal = ({ texto, icone, funcao, organizador, prestador }: any) => {
    return (
        <div className="item-modal-perfil" onClick={funcao}>
            <i className={icone}></i>
            <div className="item-modal-perfil__texto">
                <span>{texto}</span>
                { organizador ? 
                        <div style={{color: 'var(--yellow-700)'}}>
                            Prestador
                        </div> : ''}
                    { prestador ? 
                    <div style={{color: 'var(--purple-700)'}}>
                            Organizador
                    </div> : ''}

            </div>
        </div>
    );

    }
    export default ItemModal