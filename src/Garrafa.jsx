function Garrafa(props) {
  let quadrados = [];
  for (let i = 3; i >= 0; i--) {
    quadrados.push(
      <div key={i} className="quadrado" style={{ background: props.garrafa[i] }}></div>
    );
  }

  let classe = "garrafa";
  if (props.selecionada) classe = classe + " selecionada";
  if (props.completa) classe = classe + " completa";

  return (
    <div className={classe} onClick={props.onClick}>
      {quadrados}
    </div>
  );
}

export default Garrafa;
