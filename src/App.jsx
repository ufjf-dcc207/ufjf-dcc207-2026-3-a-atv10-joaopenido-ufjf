import { useState } from "react";
import Garrafa from "./Garrafa";
import "./App.css";

const cores = ["red", "blue", "green", "yellow", "purple", "orange"];

function completa(garrafa) {
  if (garrafa.length != 4) return false;
  for (let i = 1; i < 4; i++) {
    if (garrafa[i] != garrafa[0]) return false;
  }
  return true;
}

function gerarNivel(nivel) {
  let qtd = nivel + 2;
  let garrafas = [];
  let ok = false;

  while (!ok) {
    let liquidos = [];
    for (let i = 0; i < qtd; i++) {
      for (let j = 0; j < 4; j++) {
        liquidos.push(cores[i]);
      }
    }

    for (let i = 0; i < liquidos.length; i++) {
      let r = Math.floor(Math.random() * liquidos.length);
      let temp = liquidos[i];
      liquidos[i] = liquidos[r];
      liquidos[r] = temp;
    }

    garrafas = [];
    for (let i = 0; i < qtd; i++) {
      garrafas.push(liquidos.slice(i * 4, i * 4 + 4));
    }
    garrafas.push([]);
    garrafas.push([]);

    ok = true;
    for (let i = 0; i < garrafas.length; i++) {
      if (completa(garrafas[i])) ok = false;
    }
  }

  return garrafas;
}

function podeMover(origem, destino) {
  if (origem.length == 0 || completa(origem)) return false;
  if (destino.length == 4) return false;
  if (destino.length == 0) return true;
  return origem[origem.length - 1] == destino[destino.length - 1];
}

function mover(origem, destino) {
  let o = [...origem];
  let d = [...destino];
  let cor = o[o.length - 1];
  while (o.length > 0 && o[o.length - 1] == cor && d.length < 4) {
    d.push(o.pop());
  }
  return [o, d];
}

function App() {
  const [nivel, setNivel] = useState(1);
  const [garrafas, setGarrafas] = useState(gerarNivel(1));
  const [inicio, setInicio] = useState(garrafas);
  const [selecionada, setSelecionada] = useState(-1);
  const [historico, setHistorico] = useState([]);
  const [movimentos, setMovimentos] = useState(0);

  let ganhou = true;
  for (let i = 0; i < garrafas.length; i++) {
    if (garrafas[i].length > 0 && !completa(garrafas[i])) ganhou = false;
  }

  function clicar(i) {
    if (ganhou) return;

    if (selecionada == -1) {
      if (garrafas[i].length > 0 && !completa(garrafas[i])) {
        setSelecionada(i);
      }
      return;
    }

    if (selecionada == i) {
      setSelecionada(-1);
      return;
    }

    if (podeMover(garrafas[selecionada], garrafas[i])) {
      let resultado = mover(garrafas[selecionada], garrafas[i]);
      let novas = [...garrafas];
      novas[selecionada] = resultado[0];
      novas[i] = resultado[1];
      setHistorico([...historico, garrafas]);
      setGarrafas(novas);
      setMovimentos(movimentos + 1);
      setSelecionada(-1);
    } else if (garrafas[i].length > 0 && !completa(garrafas[i])) {
      setSelecionada(i);
    } else {
      setSelecionada(-1);
    }
  }

  function desfazer() {
    if (historico.length == 0) return;
    setGarrafas(historico[historico.length - 1]);
    setHistorico(historico.slice(0, historico.length - 1));
    setMovimentos(movimentos - 1);
    setSelecionada(-1);
  }

  function reiniciar() {
    setGarrafas(inicio);
    setHistorico([]);
    setMovimentos(0);
    setSelecionada(-1);
  }

  function novoJogo(n) {
    let novas = gerarNivel(n);
    setNivel(n);
    setGarrafas(novas);
    setInicio(novas);
    setHistorico([]);
    setMovimentos(0);
    setSelecionada(-1);
  }

  return (
    <div className="container">
      <h1>Magic Sort</h1>
      <p className="info">
        Nível {nivel} de 4 | Movimentos: {movimentos}
      </p>

      <div className="garrafas">
        {garrafas.map((g, i) => (
          <Garrafa
            key={i}
            garrafa={g}
            selecionada={selecionada == i}
            completa={completa(g)}
            onClick={() => clicar(i)}
          />
        ))}
      </div>

      {ganhou && nivel < 4 && (
        <div className="ganhou">
          <p>
            Você passou do nível {nivel} com {movimentos}{" "}
            {movimentos == 1 ? "movimento" : "movimentos"}!
          </p>
          <button onClick={() => novoJogo(nivel + 1)}>Próximo nível</button>
        </div>
      )}

      {ganhou && nivel == 4 && (
        <div className="ganhou">
          <p>Parabéns, você zerou o jogo!</p>
          <button onClick={() => novoJogo(1)}>Jogar de novo</button>
        </div>
      )}

      <div className="botoes">
        <button onClick={desfazer} disabled={historico.length == 0 || ganhou}>
          Desfazer
        </button>
        <button onClick={reiniciar}>Reiniciar</button>
        <button onClick={() => novoJogo(nivel)}>Novo jogo</button>
      </div>
    </div>
  );
}

export default App;
