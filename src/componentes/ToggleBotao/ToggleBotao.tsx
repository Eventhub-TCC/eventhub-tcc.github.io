import './ToggleBotao.css';

const ToggleBotao = ({ ativo = false, aoAlternar, texto } : any) => {
    return (
    <label className={`botao-toggle ${ativo ? 'on': ''}`}>
        <input
            type="checkbox"
            checked={ativo}
            onChange={() => aoAlternar()}
        />
        <span className="slider"/>
        <span className="texto">{texto}</span>  
    </label>
  );
}

export default ToggleBotao


