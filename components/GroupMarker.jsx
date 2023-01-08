import { Marker, Popup } from "react-map-gl";
import { useState, useEffect } from "react";
import classes from "../styles/scss/components.module.scss";

export default function GroupMarker(props) {
  //----------------------------------------------VARIÁVEIS----------------------------------------------
  const [showPopup, setShowPopup] = useState(false);
  //--------------------------------------------------------------------------------------------

  //Alterar visibilidade do popup que mostra mais detalhes ao clicar num glifo
  function changePopupVisibility() {
    setShowPopup(true);
  }

  function countryValues(all_answers) {
    all_answers.forEach((answer, i) => {
      all_answers[i].motivo_termino = answer.motivo_termino
        .split("_")[0]
        .trim();
    });
    let answer = {};
    let contagem_sentimentos = {};

    for (const property of Object.keys(all_answers[0])) {
      contagem_sentimentos[property] = {};
    }

    all_answers.forEach((answer, i) => {
      for (const property of Object.keys(answer)) {
        let bool = !Object.keys(contagem_sentimentos[property]).includes(
          answer[property]
        );
        if (bool === true) {
          contagem_sentimentos[property][answer[property]] = 1;
        } else {
          contagem_sentimentos[property][answer[property]]++;
        }
      }
    });

    for (const property of Object.keys(contagem_sentimentos)) {
      let opcoes_ordenadas = Object.keys(contagem_sentimentos[property]).sort(
        function (a, b) {
          return (
            contagem_sentimentos[property][b] -
            contagem_sentimentos[property][a]
          );
        }
      );

      answer[property] = opcoes_ordenadas[0];
    }

    return answer;
  }

  let answer = countryValues(props.group);

  let checkboxesValues = props.checkboxesValues;

  //----------------------------------------------CÁLCULOS PARA DESENHO DO GLIFO----------------------------------------------
  let centerX = 61;
  let centerY = 61;
  let raio = centerX;

  //----------------------------------------------DURAÇÃO RELAÇÃO
  let duracao = answer.duracao.trim();
  let percentage;
  if (checkboxesValues.duracao === true) {
    if (duracao === "Menos de 3 meses") {
      percentage = 1 * (100 / 8);
    } else if (duracao === "Entre 3 meses e 1 ano") {
      percentage = 2 * (100 / 8);
    } else if (duracao === "Entre 1 e 2 anos") {
      percentage = 3 * (100 / 8);
    } else if (duracao === "Entre 2 e 5 anos") {
      percentage = 4 * (100 / 8);
    } else if (duracao === "Entre 5 e 10 anos") {
      percentage = 5 * (100 / 8);
    } else if (duracao === "Entre 10 e 20 anos") {
      percentage = 6 * (100 / 8);
    } else if (duracao === "Entre 20 e 40 anos") {
      percentage = 7 * (100 / 8);
    } else if (duracao === "Mais de 40 anos") {
      percentage = 8 * (100 / 8);
    }
  } else {
    percentage = 100;
  }

  let division = percentage / (100 / 8);

  //----------------------------------------------TEVE MAIS RELAÇÕES APÓS
  let teve_mais_relacoes = answer.teve_mais_relacoes.trim();
  let ring_color;
  if (checkboxesValues.relacoes_apos_termino === true) {
    if (teve_mais_relacoes === "Sim") {
      ring_color = "rgba(35,31,32,1)";
    } else if (teve_mais_relacoes === "Não") {
      ring_color = "rgba(193,193,193,1)";
    } else {
      ring_color = "#fbfbfb";
    }
  } else {
    ring_color = "rgba(35,31,32,1)";
  }

  //----------------------------------------------GÉNEROS E ORIENTAÇÃO
  let genero1 = answer.genero1.trim();
  let genero2 = answer.genero2.trim();
  let orientacao = answer.orientacao.trim();
  let arrow_directions = [];

  if (genero1 === "Mulher Cisgénero") {
    arrow_directions.push(0);
  } else if (genero1 === "Homem Cisgénero") {
    arrow_directions.push(1);
  } else if (genero1 === "Mulher Transgénero") {
    arrow_directions.push(2);
  } else if (genero1 === "Homem Transgénero") {
    arrow_directions.push(3);
  } else if (genero1 === "Não-binário") {
    arrow_directions.push(4);
  } else if (genero1 === "Prefiro não dizer") {
    arrow_directions.push(5);
  } else if (genero1 === "Não sei") {
    arrow_directions.push(6);
  }

  if (genero2 === "Mulher Cisgénero") {
    arrow_directions.push(0);
  } else if (genero2 === "Homem Cisgénero") {
    arrow_directions.push(1);
  } else if (genero2 === "Mulher Transgénero") {
    arrow_directions.push(2);
  } else if (genero2 === "Homem Transgénero") {
    arrow_directions.push(3);
  } else if (genero2 === "Não-binário") {
    arrow_directions.push(4);
  } else if (genero2 === "Prefiro não dizer") {
    arrow_directions.push(5);
  } else if (genero2 === "Não sei") {
    arrow_directions.push(6);
  }

  if (orientacao === "Heterossexual") {
    arrow_directions.push(0);
  } else if (orientacao === "Homossexual") {
    arrow_directions.push(1);
  } else if (orientacao === "Bissexual") {
    arrow_directions.push(2);
  } else if (orientacao === "Poliamoroso") {
    arrow_directions.push(3);
  } else if (orientacao === "Polissexual") {
    arrow_directions.push(4);
  } else if (orientacao === "Panssexual") {
    arrow_directions.push(5);
  } else if (orientacao === "Assexual") {
    arrow_directions.push(6);
  } else if (orientacao === "Androssexual") {
    arrow_directions.push(7);
  } else if (orientacao === "Ginessexual") {
    arrow_directions.push(8);
  } else if (orientacao === "Sexualmente Fluído") {
    arrow_directions.push(9);
  } else if (orientacao === "Skoliossexual") {
    arrow_directions.push(10);
  } else if (orientacao === "A questionar") {
    arrow_directions.push(11);
  } else if (orientacao === "Prefiro não dizer") {
    arrow_directions.push(12);
  } else {
    arrow_directions.push(13);
  }

  let rot_angle1 = arrow_directions[0] * (360 / 7);
  let rot_angle2 = arrow_directions[1] * (360 / 7);
  let rot_angle3 = arrow_directions[2] * (360 / 14);

  //----------------------------------------------DIFERENÇA DE IDADES
  let age_difference = Math.abs(answer.idade_inicio1 - answer.idade_inicio2);

  let raio2;
  if (checkboxesValues.diferenca_idades === true) {
    if (age_difference < 1) {
      raio2 = 12;
    } else if (age_difference >= 1 && age_difference < 2) {
      raio2 = 17;
    } else if (age_difference >= 2 && age_difference < 5) {
      raio2 = 22;
    } else if (age_difference >= 5) {
      raio2 = 27;
    }
  } else {
    raio2 = 27;
  }

  //----------------------------------------------MOTIVO DO TÉRMINO
  let motivo_termino = answer.motivo_termino.split("_")[0].trim();
  let color;
  if (motivo_termino === "Os sentimentos deixaram de ser os mesmos") {
    color = "rgba(242,187,13,1)";
  } else if (
    motivo_termino ===
    "Incompatibilidade (trabalho, localização, objetivos, ...)"
  ) {
    color = "rgba(11,207,201,1)";
  } else if (
    motivo_termino ===
    "Interferência de outras relações (amizades, família, ...)"
  ) {
    color = "rgba(134,93,64,1)";
  } else if (
    motivo_termino ===
    "Relação abusiva (falta de respeito, mentiras, violência, traição, vícios, ...)"
  ) {
    color = "rgba(255,131,0,1)";
  } else if (motivo_termino === "Medo de compromisso") {
    color = "rgba(158,100,247,1)";
  } else if (motivo_termino === "Perda de contacto") {
    color = "rgba(36,170,12,1)";
  } else if (
    motivo_termino === "Ainda havia sentimentos de uma relação anterior"
  ) {
    color = "rgba(13,155,242,1)";
  } else {
    color = "rgba(193,193,193,1)";
  }

  //----------------------------------------------MEIO CONHECIMENTO E NIVEL DA RELAÇÃO----------------------------------
  let meio_conhecimento = answer.meio_conhecimento.trim();
  let nivel = answer.nivel.trim();
  let stroke_width;

  if (checkboxesValues.nivel === true) {
    if (nivel === "Casamento") {
      stroke_width = 3;
    } else if (nivel === "Namoro") {
      stroke_width = 1.5;
    } else if (nivel === "Não rotulámos") {
      stroke_width = 0.25;
    }
  } else {
    checkboxesValues.motivo_termino === true
      ? (stroke_width = 0)
      : (stroke_width = 1);
  }

  let inc_raio = 1;

  //----------------------------------Degrees to Radians Function----------------------------------
  function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  //----------------------------------Radians to Degrees Function----------------------------------
  function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
  }

  //--------------------------------------------ESTRUTURA--------------------------------------------
  return (
    <>
      {/*----------------MARKER (GLIFO PARA AGLOMERAÇÃO DE RELAÇÕES DE UM PAÍS)----------------*/}
      <Marker
        longitude={props.coordinates.lat}
        latitude={props.coordinates.lng}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setShowPopup(true);
        }}
      >
        <svg
          //id={`glyph${i}`}
          className="glyph"
          width={centerX * 2}
          height={centerY * 2}
          style={{
            cursor: "pointer",
            fill: "#d00",
            stroke: "none",
            opacity: "100%",
            transform: `translate(-50%,-50%) scale(100%) translate(50%,50%)`,
          }}
        >
          <g className="global_group">
            <g className="group1">
              {(checkboxesValues.duracao === true ||
                checkboxesValues.relacoes_apos_termino === true ||
                checkboxesValues.genero1 === true ||
                checkboxesValues.genero2 === true ||
                checkboxesValues.orientacao === true) && (
                <g
                  className="ring_group"
                  style={{
                    transform: `translate(${centerX}px, ${centerY}px) rotate(-90deg) translate(-${centerX}px, -${centerY}px)`,
                  }}
                >
                  {(checkboxesValues.duracao === true ||
                    checkboxesValues.relacoes_apos_termino === true) && (
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={raio}
                      fill={
                        checkboxesValues.duracao === true ? "white" : ring_color
                      }
                      stroke="rgba(35,31,32,1)"
                      strokeWidth="1"
                    ></circle>
                  )}
                  {checkboxesValues.duracao === true && (
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={raio / 2}
                      fill="none"
                      stroke={ring_color}
                      strokeWidth={raio}
                      strokeDasharray={`${
                        (percentage * ((2 * Math.PI * raio) / 2)) / 100
                      } ${(2 * Math.PI * raio) / 2}`}
                    ></circle>
                  )}
                  {checkboxesValues.duracao === true &&
                    new Array(8).fill("").map((item, i) => {
                      return (
                        <circle
                          key={i}
                          cx={centerX}
                          cy={centerY}
                          r={raio / 2}
                          fill="none"
                          stroke={
                            checkboxesValues.relacoes_apos_termino !== true
                              ? i < division && i !== 0
                                ? "white"
                                : "rgba(35,31,32,1)"
                              : teve_mais_relacoes === "Sim" &&
                                i < division &&
                                i !== 0
                              ? "white"
                              : "rgba(35,31,32,1)"
                          }
                          strokeWidth={raio}
                          strokeDasharray={`1 ${(2 * Math.PI * raio) / 2}`}
                          style={{
                            transform: `translate(${centerX}px, ${centerY}px) rotate(${
                              i * 45
                            }deg) translate(-${centerX}px, -${centerY}px)`,
                          }}
                        ></circle>
                      );
                    })}
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={raio - 8}
                    fill="#fbfbfb"
                    stroke="rgba(35,31,32,1)"
                    strokeWidth="1"
                  ></circle>
                </g>
              )}
              {
                //----------------------------------Age Difference Concentric Circles----------------------------------
                checkboxesValues.diferenca_idades === true && (
                  <g className="concentric_circles_group">
                    {new Array(12, 17, 22, 27).map((item, i) => {
                      return (
                        <circle
                          key={i}
                          cx={centerX}
                          cy={centerY}
                          r={item}
                          fill="none"
                          stroke="rgba(193,193,193,0.5)"
                          strokeWidth="1"
                        ></circle>
                      );
                    })}
                  </g>
                )
              }
              {
                <g className="radial_lines_group">
                  {new Array(14).fill("").map((item, i) => {
                    let coincident = 0;
                    if (
                      (i === arrow_directions[0] * 2 &&
                        checkboxesValues.genero1 === true) ||
                      (i === arrow_directions[1] * 2 &&
                        checkboxesValues.genero2 === true)
                    ) {
                      coincident++;
                    }

                    if (coincident === 0) {
                      if (
                        checkboxesValues.genero1 === true ||
                        checkboxesValues.genero2 === true ||
                        checkboxesValues.orientacao === true
                      ) {
                        return (
                          <line
                            key={i}
                            x1={i % 2 === 0 ? centerX + 30 : centerX + 32}
                            y1={i % 2 === 0 ? centerY + 30 : centerY + 32}
                            x2={centerX + 35}
                            y2={centerY + 35}
                            stroke={
                              i % 2 === 0
                                ? "rgba(35,31,32,1)"
                                : "rgba(35,31,32,0.25)"
                            }
                            strokeWidth={1}
                            style={{
                              transform: `translate(${centerX}px, ${centerY}px) rotate(${
                                i * (360 / 14) - 135
                              }deg) translate(-${centerX}px, -${centerY}px)`,
                            }}
                          ></line>
                        );
                      }
                    }
                  })}
                </g>
              }
              {
                <g className="arrows_group">
                  {checkboxesValues.genero1 === true && (
                    <g
                      className="gender1"
                      style={{
                        transform: `translate(${centerX}px, ${centerY}px) rotate(${
                          rot_angle1 - 135
                        }deg) translate(-${centerX}px, -${centerY}px)`,
                      }}
                    >
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={centerX + 35}
                        y2={centerY + 35}
                        stroke="rgba(35,31,32,1)"
                        strokeWidth={1}
                      ></line>
                      <line
                        x1={centerX + 30}
                        y1={centerY + 35}
                        x2={centerX + 35}
                        y2={centerY + 35}
                        stroke="rgba(35,31,32,1)"
                        strokeWidth={1}
                      ></line>
                      <line
                        x1={centerX + 35}
                        y1={centerY + 30}
                        x2={centerX + 35}
                        y2={centerY + 35}
                        stroke="rgba(35,31,32,1)"
                        strokeWidth={1}
                      ></line>
                    </g>
                  )}
                  {checkboxesValues.genero2 === true && (
                    <g
                      className="gender2"
                      style={{
                        transform: `translate(${centerX}px, ${centerY}px) rotate(${
                          rot_angle2 - 135
                        }deg) translate(-${centerX}px, -${centerY}px)`,
                      }}
                    >
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={centerX + 32}
                        y2={centerY + 32}
                        stroke="rgba(35,31,32,1)"
                        strokeWidth={1}
                      ></line>
                      <line
                        x1={centerX + 27}
                        y1={centerY + 32}
                        x2={centerX + 32}
                        y2={centerY + 32}
                        stroke="rgba(35,31,32,1)"
                        strokeWidth={1}
                      ></line>
                      <line
                        x1={centerX + 32}
                        y1={centerY + 27}
                        x2={centerX + 32}
                        y2={centerY + 32}
                        stroke="rgba(35,31,32,1)"
                        strokeWidth={1}
                      ></line>
                      <line
                        x1={centerX + 24}
                        y1={centerY + 29}
                        x2={centerX + 29}
                        y2={centerY + 29}
                        stroke="rgba(35,31,32,1)"
                        strokeWidth={1}
                      ></line>
                      <line
                        x1={centerX + 29}
                        y1={centerY + 24}
                        x2={centerX + 29}
                        y2={centerY + 29}
                        stroke="rgba(35,31,32,1)"
                        strokeWidth={1}
                      ></line>
                    </g>
                  )}
                  {checkboxesValues.orientacao === true && (
                    <g
                      className="orientation"
                      style={{
                        transform: `translate(${centerX}px, ${centerY}px) rotate(${
                          rot_angle3 - 135
                        }deg) translate(-${centerX}px, -${centerY}px)`,
                      }}
                    >
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={centerX + 26}
                        y2={centerY + 26}
                        stroke="rgba(35,31,32,1)"
                        strokeWidth={1}
                      ></line>
                      <polygon
                        points={`${centerX + 19},${centerY + 26} ${
                          centerX + 26
                        },${centerY + 26} ${centerX + 26},${centerY + 19}`}
                        fill="rgba(35,31,32,1)"
                      ></polygon>
                    </g>
                  )}
                </g>
              }
              {checkboxesValues.como_conheceram === true &&
                new Array(1).fill("").map((item, i) => {
                  if (meio_conhecimento === "Rede social") {
                    return (
                      <>
                        <circle
                          cx={centerX}
                          cy={centerY}
                          r={raio2}
                          fill={
                            checkboxesValues.motivo_termino === true
                              ? color
                              : "#fbfbfb"
                          }
                          stroke="rgba(35,31,32,1)"
                          strokeWidth={stroke_width}
                        ></circle>
                        <circle
                          cx={centerX}
                          cy={centerY}
                          r={raio2}
                          fill="none"
                          stroke="rgba(35,31,32,1)"
                          strokeWidth={stroke_width}
                        ></circle>
                      </>
                    );
                  } else if (
                    meio_conhecimento === "Site/aplicação de namoro" ||
                    meio_conhecimento === "Cara-a-cara em contexto normal" ||
                    meio_conhecimento === "Cara-a-cara numa festa"
                  ) {
                    let n_lados;
                    if (meio_conhecimento === "Site/aplicação de namoro") {
                      n_lados = 5;
                    } else if (
                      meio_conhecimento === "Cara-a-cara em contexto normal"
                    ) {
                      n_lados = 3;
                    } else if (meio_conhecimento === "Cara-a-cara numa festa") {
                      n_lados = 4;
                    }

                    let angle = degrees_to_radians(360 / n_lados);

                    let points = "";
                    for (let i = 0; i < n_lados; i++) {
                      let x;
                      let y;
                      if (
                        meio_conhecimento === "Site/aplicação de namoro" ||
                        meio_conhecimento === "Cara-a-cara em contexto normal"
                      ) {
                        x =
                          centerX +
                          (raio2 + inc_raio) *
                            Math.cos(i * angle - Math.PI / 2);
                        y =
                          centerY +
                          (raio2 + inc_raio) *
                            Math.sin(i * angle - Math.PI / 2);
                      } else if (
                        meio_conhecimento === "Cara-a-cara numa festa"
                      ) {
                        x =
                          centerX +
                          (raio2 + inc_raio) *
                            Math.cos(i * angle - Math.PI / 4);
                        y =
                          centerY +
                          (raio2 + inc_raio) *
                            Math.sin(i * angle - Math.PI / 4);
                      }
                      points = points + `${x},${y} `;
                    }

                    return (
                      <>
                        <polygon
                          points={points.trim()}
                          fill={
                            checkboxesValues.motivo_termino === true
                              ? color
                              : "#fbfbfb"
                          }
                          stroke="rgba(35,31,32,1)"
                          strokeWidth={stroke_width}
                        ></polygon>
                        <polygon
                          points={points.trim()}
                          fill="none"
                          stroke="rgba(35,31,32,1)"
                          strokeWidth={stroke_width}
                        ></polygon>
                      </>
                    );
                  } else {
                    let angle = degrees_to_radians(360 / 8);

                    let points = "";
                    for (let i = 0; i < 8; i++) {
                      let x;
                      let y;
                      if (i % 2 === 0) {
                        x = centerX + (raio2 + inc_raio) * Math.cos(i * angle);
                        y = centerY + (raio2 + inc_raio) * Math.sin(i * angle);
                      } else {
                        x =
                          centerX +
                          ((raio2 + inc_raio) / 2) * Math.cos(i * angle);
                        y =
                          centerY +
                          ((raio2 + inc_raio) / 2) * Math.sin(i * angle);
                      }
                      points = points + `${x},${y} `;
                    }

                    return (
                      <>
                        <polygon
                          points={points.trim()}
                          fill={
                            checkboxesValues.motivo_termino === true
                              ? color
                              : "#fbfbfb"
                          }
                          stroke="rgba(35,31,32,1)"
                          strokeWidth={stroke_width}
                        ></polygon>
                        <polygon
                          points={points.trim()}
                          fill="none"
                          stroke="rgba(35,31,32,1)"
                          strokeWidth={stroke_width}
                        ></polygon>
                      </>
                    );
                  }
                })}
            </g>
          </g>
        </svg>
      </Marker>
      {/*------------------POPUP DETALHES (VALORES MAIS FREQUENTES NAS RELAÇÕES DO PAÍS)------------------*/}
      {showPopup && (
        <Popup
          longitude={props.coordinates.lat}
          latitude={props.coordinates.lng}
          anchor="top-right"
          onClose={() => setShowPopup(false)}
          className={classes.popup}
          style={{
            width: "auto",
            maxWidth: "none",
          }}
        >
          <div className={classes.popup_container}>
            <h3>{answer.pais !== " " ? answer.pais : "Unknown"}</h3>
            <p>
              Os valores aqui apresentados são os mais frequentes de cada
              parâmetro nas relações do país, não representam uma relação.
            </p>
            <ul>
              <li>
                <b>Idade no início da relação (1ª Pessoa):</b>{" "}
                {answer.idade_inicio1 !== " "
                  ? answer.idade_inicio1
                  : "Unknown"}
              </li>
              <li>
                <b>Idade no início da relação (2ª Pessoa):</b>{" "}
                {answer.idade_inicio2 !== " "
                  ? answer.idade_inicio2
                  : "Unknown"}
              </li>
              <li>
                <b>Género (1ª Pessoa):</b>{" "}
                {answer.genero1 !== " " ? answer.genero1 : "Unknown"}
              </li>
              <li>
                <b>Géneros (2ª Pessoa):</b>{" "}
                {answer.genero2 !== " " ? answer.genero2 : "Unknown"}
              </li>
              <li>
                <b>Como as pessoas se conheceram:</b>{" "}
                {answer.meio_conhecimento !== " "
                  ? answer.meio_conhecimento
                  : "Unknown"}
              </li>
              <li>
                <b>Duração das relações:</b>{" "}
                {answer.duracao !== " " ? answer.duracao : "Unknown"}
              </li>
              <li>
                <b>Nível das relações:</b>{" "}
                {answer.nivel !== " " ? answer.nivel : "Unknown"}
              </li>
              <li>
                <b>Orientação:</b>{" "}
                {answer.orientacao !== " " ? answer.orientacao : "Unknown"}
              </li>
              <li>
                <b>Motivos dos términos:</b>{" "}
                {answer.motivo_termino !== " "
                  ? answer.motivo_termino
                  : "Unknown"}
              </li>
              <li>
                <b>Quem acabou:</b>{" "}
                {answer.quem_terminou !== " "
                  ? answer.quem_terminou
                  : "Unknown"}
              </li>
              <li>
                <b>As pessoas tiveram relações após?</b>{" "}
                {answer.teve_mais_relacoes !== " "
                  ? answer.teve_mais_relacoes
                  : "Unknown"}
              </li>
            </ul>
          </div>
        </Popup>
      )}{" "}
    </>
  );
}
