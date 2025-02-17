import "./ItemModalPerfil.css";

const ItemModal = ({ texto, icone, funcao }: any) => {
    return (
        <div className="item-modal-perfil" onClick={funcao}>
        <i className={icone}></i>
        <span>{texto}</span>
        </div>
    );

    }
    export default ItemModal