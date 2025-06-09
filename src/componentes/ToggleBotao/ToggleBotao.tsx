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
        <span className={`botao-toggle__texto ${ativo ? 'botao-toggle__texto--on': 'botao-toggle__texto--off'}`}>{texto}</span>  
    </label>
  );
}

export default ToggleBotao


