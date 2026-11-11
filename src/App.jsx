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

function App() {
  const [garrafas, setGarrafas] = useState(gerarNivel(1));

  return (
    <div className="container">
      <h1>Magic Sort</h1>

      <div className="garrafas">
        {garrafas.map((g, i) => (
          <Garrafa key={i} garrafa={g} />
        ))}
      </div>
    </div>
  );
}

export default App;
