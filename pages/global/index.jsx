import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import classes from "../../styles/scss/globalPage.module.scss";
//import answers from "../../public/data/form_answers.json";
//import country_codes from "../../public/data/country_codes.json";
import country_names_pt from "../../public/data/country_names_portuguese.json";
import country_names_en from "../../public/data/country_names_english.json";
//import { countiesLayer, highlightLayer } from "../../public/data/layers.js";
import Map, { Marker, Source, Layer } from "react-map-gl";
import GroupMarker from "../../components/GroupMarker";
import CustomMarker from "../../components/CustomMarker";
import BarraSentimentos from "../../components/BarraSentimentos";
//import axios from "axios";
import connectMongoose from "../../utils/connectMongoose";
import Relationship from "../../models/relationshipModel";

export default function GlobalPage(props) {
  const [windowWidth, setWindowWidth] = useState();
  const [windowHeight, setWindowHeight] = useState();
  const [viewState, setViewState] = useState({
    longitude: -7.8536599,
    latitude: 39.557191,
    zoom: 3.5,
  });
  const [selectedCountry, setSelectedCountry] = useState("Global");
  const [meanAge, setMeanAge] = useState(props.idade_media);
  const [checkboxesValues, setCheckboxesValues] = useState({
    motivo_termino: true,
    como_conheceram: true,
    duracao: true,
    orientacao: true,
    diferenca_idades: true,
    nivel: true,
    quem_terminou: true,
    relacoes_apos_termino: true,
    genero1: true,
    genero2: true,
  });
  const [allAnswers, setAllAnswers] = useState(props.updated_answers);
  const [answersPerCountry, setAnswersPerCountry] = useState(
    props.answers_per_country
  );
  const [stats, setStats] = useState(props.stats);
  const [visualizationMode, setVisualizationMode] = useState(0);
  const [scope, setScope] = useState(0);
  const [user, setUser] = useState("login necessário");
  const [mapClickInfo, setMapClickInfo] = useState(null);
  const [markerType, setMarkerType] = useState(0);
  const [showDicas, setShowDicas] = useState(true);
  const [showLegenda, setShowLegenda] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("user") !== null) {
      setUser(sessionStorage.getItem("user"));
    }
    console.log("props.country_coordinates", props.country_coordinates);
    //console.log("Sentimentos:", sentimentos);
    //console.log("Grupos Sentimentos:", props.gruposSentimentos);
  }, []);

  useEffect(() => {
    if (scope === 0) {
      if (selectedCountry === "Global") {
        setStats(props.stats);
        setMeanAge(props.idade_media);
        setAllAnswers(props.updated_answers);
      } else {
        setStats(
          props.answers_per_country[selectedCountry] !== undefined
            ? props.answers_per_country[selectedCountry].stats
            : {}
        );
        setMeanAge(
          props.answers_per_country[selectedCountry] !== undefined
            ? props.answers_per_country[selectedCountry].stats.idade_media
            : "Sem dados"
        );
        //console.log("Stats:", props.answers_per_country[selectedCountry]);
        let filtered_answers = props.updated_answers.filter((item, i) => {
          return item.pais.trim() === selectedCountry;
        });
        setAllAnswers(filtered_answers);
      }
    } else if (scope === 1) {
      let filtered_answers;
      if (selectedCountry === "Global") {
        setStats(props.stats);
        setMeanAge(props.idade_media);
        filtered_answers = props.updated_answers.filter((item, i) => {
          return item.username === sessionStorage.getItem("user");
        });
      } else {
        setStats(
          props.answers_per_country[selectedCountry] !== undefined
            ? props.answers_per_country[selectedCountry].stats
            : {}
        );
        setMeanAge(
          props.answers_per_country[selectedCountry] !== undefined
            ? props.answers_per_country[selectedCountry].stats.idade_media
            : "Sem dados"
        );
        filtered_answers = props.updated_answers.filter((item, i) => {
          return (
            item.username === sessionStorage.getItem("user") &&
            item.pais.trim() === selectedCountry
          );
        });
      }
      setAllAnswers(filtered_answers);
    }
  }, [scope, selectedCountry]);

  useEffect(() => {
    //console.log("allAnswers:", allAnswers);
  }, [allAnswers]);

  useEffect(() => {
    if (visualizationMode === 0) {
      document.querySelector("#motivo_termino").checked = true;
      document.querySelector("#como_conheceram").checked = true;
      document.querySelector("#duracao").checked = true;
      document.querySelector("#orientacao").checked = true;
      document.querySelector("#diferenca_idades").checked = true;
      document.querySelector("#nivel").checked = true;
      //document.querySelector("#quem_terminou").checked = true;
      document.querySelector("#relacoes_apos_termino").checked = true;
      document.querySelector("#genero1").checked = true;
      document.querySelector("#genero2").checked = true;
      setCheckboxesValues({
        motivo_termino: true,
        como_conheceram: true,
        duracao: true,
        orientacao: true,
        diferenca_idades: true,
        nivel: true,
        //quem_terminou: true,
        relacoes_apos_termino: true,
        genero1: true,
        genero2: true,
      });
    }
  }, [visualizationMode]);

  function onCheckboxChange(e) {
    const id = e.target.id;
    const checked = e.target.checked;

    setCheckboxesValues((prevValues) => {
      if (checked === false) {
        if (id === "como_conheceram") {
          document.querySelector("#motivo_termino").checked = false;
          document.querySelector("#diferenca_idades").checked = false;
          document.querySelector("#nivel").checked = false;
          return {
            ...prevValues,
            motivo_termino: false,
            diferenca_idades: false,
            nivel: false,
            [id]: checked,
          };
        } else if (id === "duracao") {
          document.querySelector("#relacoes_apos_termino").checked = false;
          return {
            ...prevValues,
            relacoes_apos_termino: false,
            [id]: checked,
          };
        }
      } else {
        if (
          id === "motivo_termino" ||
          id === "diferenca_idades" ||
          id === "nivel"
        ) {
          document.querySelector("#como_conheceram").checked = true;
          return {
            ...prevValues,
            como_conheceram: true,
            [id]: checked,
          };
        }
      }
      return {
        ...prevValues,
        [id]: checked,
      };
    });
    //document.querySelector("#Visualization").innerHTML = "";
  }

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, [checkboxesValues]);

  function changeMode(e) {
    const value = e.target.value;
    //console.log("Value:", value);
    setVisualizationMode(Number(value));
    if (Number(value) === 0) {
    } else if (Number(value) === 1) {
    }
  }

  function changeScope(e) {
    const value = e.target.value;

    setScope(Number(value));
    if (Number(value) === 0) {
    } else if (Number(value) === 1) {
    }
  }

  async function handleMapClick(event) {
    //console.log(event);
    //console.log("Event Features:", event.lngLat);

    try {
      const response = await fetch(
        `https://api.tiles.mapbox.com/v4/geocode/mapbox.places-country-v1/${event.lngLat.lng},${event.lngLat.lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      )
        .then((response) => response.json())
        .then((data) => {
          //console.log("Data:", data);
          //console.log("Country:", data.features[0].text);

          //console.log("country_names_pt", country_names_pt);
          //console.log("country_names_en", country_names_en);

          let country_id1;
          let country_english;

          if (selectedCountry !== "Global") {
            country_id1 = country_names_pt.find((item) => {
              return item.name === selectedCountry;
            }).id;
            //console.log("country_id1:", country_id1);
            country_english = country_names_en.find((item) => {
              return item.id === country_id1;
            }).name;
            //console.log("country_english", country_english);
          } else {
            country_english = selectedCountry;
          }

          if (country_english === data.features[0].text) {
            setSelectedCountry("Global");
            setMarkerType(0);
          } else {
            //console.log("English:", country_english);
            let country_id2 = country_names_en.find((item, i) => {
              return item.name === data.features[0].text;
            }).id;
            //console.log("country_id2:", country_id2);
            let country_portuguese = country_names_pt.find((item) => {
              return item.id === country_id2;
            }).name;
            //console.log("country_portuguese", country_portuguese);

            setSelectedCountry(country_portuguese);
            setMarkerType(1);
          }
        });
    } catch (err) {
      console.log(err);
      //setSelectedCountry("Global");
    }
  }

  function toggleDicas() {
    setShowDicas((prevValue) => !prevValue);
  }

  function toggleLegenda() {
    setShowLegenda((prevValue) => !prevValue);
  }

  return (
    <main className={classes.main}>
      <div className={classes.lateral_bar}>
        <div className={classes.title_container}>
          <h1 className={classes.title}>
            <span>Understanding</span> Relationship Patterns
          </h1>
        </div>
        <div className={classes.menu}>
          <div>
            <Link href="/submitanswer">Submeter nova relação</Link>
            <label
              className={classes.mode_selection_input_label}
              htmlFor="ScopeSelection"
            >
              <p className={classes.label_text}>SCOPE</p>
              <select
                name="scope_selection"
                id="ScopeSelection"
                onChange={changeScope}
              >
                <option value="0">Global</option>
                <option value="1">Pessoal ({user})</option>
              </select>
            </label>
            <label
              className={classes.mode_selection_input_label}
              htmlFor="ModeSelection"
            >
              <p className={classes.label_text}>MODO DE VISUALIZAÇÃO</p>
              <select
                name="mode_selection"
                id="ModeSelection"
                onChange={changeMode}
              >
                <option value="0">Livre</option>
                <option value="1">Origens das pessoas na relação</option>
              </select>
            </label>
          </div>
          {visualizationMode === 0 && (
            <div className={classes.param_selection_container}>
              <p className={classes.label_text}>PARÂMETROS (1 OU MAIS)</p>
              <div>
                <label
                  htmlFor="motivo_termino"
                  className={classes.param_checkbox_label}
                >
                  <input
                    type="checkbox"
                    name="params"
                    id="motivo_termino"
                    onChange={onCheckboxChange}
                  />
                  <span className={classes.custom_checkbox}></span>
                  <p>Motivo do término</p>
                </label>
                <label
                  htmlFor="como_conheceram"
                  className={classes.param_checkbox_label}
                >
                  <input
                    type="checkbox"
                    name="params"
                    id="como_conheceram"
                    onChange={onCheckboxChange}
                  />
                  <span className={classes.custom_checkbox}></span>
                  <p>Como se conheceram</p>
                </label>
                <label
                  htmlFor="duracao"
                  className={classes.param_checkbox_label}
                >
                  <input
                    type="checkbox"
                    name="params"
                    id="duracao"
                    onChange={onCheckboxChange}
                  />
                  <span className={classes.custom_checkbox}></span>
                  <p>Duração da relação</p>
                </label>
                <label
                  htmlFor="orientacao"
                  className={classes.param_checkbox_label}
                >
                  <input
                    type="checkbox"
                    name="params"
                    id="orientacao"
                    onChange={onCheckboxChange}
                  />
                  <span className={classes.custom_checkbox}></span>
                  <p>Orientação da relação</p>
                </label>
                <label
                  htmlFor="diferenca_idades"
                  className={classes.param_checkbox_label}
                >
                  <input
                    type="checkbox"
                    name="params"
                    id="diferenca_idades"
                    onChange={onCheckboxChange}
                  />
                  <span className={classes.custom_checkbox}></span>
                  <p>Diferença de idades</p>
                </label>
                <label htmlFor="nivel" className={classes.param_checkbox_label}>
                  <input
                    type="checkbox"
                    name="params"
                    id="nivel"
                    onChange={onCheckboxChange}
                  />
                  <span className={classes.custom_checkbox}></span>
                  <p>Nível mais alto da relação</p>
                </label>
                {/* <label
                  htmlFor="quem_terminou"
                  className={classes.param_checkbox_label}
                >
                  <input
                    type="checkbox"
                    name="params"
                    id="quem_terminou"
                    onChange={onCheckboxChange}
                  />
                  <span className={classes.custom_checkbox}></span>
                  <p>Quem terminou</p>
                </label> */}
                <label
                  htmlFor="relacoes_apos_termino"
                  className={classes.param_checkbox_label}
                >
                  <input
                    type="checkbox"
                    name="params"
                    id="relacoes_apos_termino"
                    onChange={onCheckboxChange}
                  />
                  <span className={classes.custom_checkbox}></span>
                  <p>Teve relações posteriores</p>
                </label>
                <label
                  htmlFor="genero1"
                  className={classes.param_checkbox_label}
                >
                  <input
                    type="checkbox"
                    name="params"
                    id="genero1"
                    onChange={onCheckboxChange}
                  />
                  <span className={classes.custom_checkbox}></span>
                  <p>Género da pessoa que submeteu</p>
                </label>
                <label
                  htmlFor="genero2"
                  className={classes.param_checkbox_label}
                >
                  <input
                    type="checkbox"
                    name="params"
                    id="genero2"
                    onChange={onCheckboxChange}
                  />
                  <span className={classes.custom_checkbox}></span>
                  <p>Género da outra pessoa</p>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={classes.superior_bar}>
        <div className={classes.info_container}>
          <div className={classes.country_container}>
            <p className={classes.country_container_title}>PAÍS</p>
            <p className={classes.country_container_value}>{selectedCountry}</p>
          </div>
          <div className={classes.age_container}>
            <p className={classes.age_container_title}>
              IDADE NA 1ª RELAÇÃO (MÉDIA)
            </p>
            <p className={classes.age_container_value}>{meanAge}</p>
          </div>
          <div className={classes.feelings_container}>
            <p className={classes.feelings_container_title}>
              SENTIMENTOS NO FIM DA RELAÇÃO
            </p>
            <div className={classes.feelings_container_value}>
              <BarraSentimentos sentimentos={stats}></BarraSentimentos>
            </div>
          </div>
        </div>
      </div>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        onClick={handleMapClick}
      >
        {allAnswers !== undefined && visualizationMode === 0
          ? markerType === 1
            ? allAnswers.map((answer, i) => {
                if (
                  answer.lng !== undefined &&
                  answer.lat !== undefined &&
                  answer.lng > -90 &&
                  answer.lng < 90 &&
                  answer.lat > -90 &&
                  answer.lat < 90
                ) {
                  return (
                    <CustomMarker
                      key={i}
                      answer={answer}
                      checkboxesValues={checkboxesValues}
                    ></CustomMarker>
                  );
                }
              })
            : new Array(...Object.keys(answersPerCountry)).map((item, i) => {
                //console.log("item:", item);
                return (
                  <GroupMarker
                    key={i}
                    group={answersPerCountry[item].respostas}
                    coordinates={answersPerCountry[item].coordinates}
                    checkboxesValues={checkboxesValues}
                  ></GroupMarker>
                );
              })
          : new Array(allAnswers.length * 2).fill("").map((item, i) => {
              let index = i < allAnswers.length ? i : i - allAnswers.length;

              if (i < allAnswers.length) {
                return (
                  <Marker
                    longitude={allAnswers[index].lat}
                    latitude={allAnswers[index].lng}
                  >
                    <svg
                      className="glyph"
                      width={20}
                      height={20}
                      style={{
                        fill: "none",
                        stroke: "none",
                      }}
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="#32003a"
                        stroke="fbfbfb"
                        strokeWidth="3"
                      ></circle>
                    </svg>
                  </Marker>
                );
              } else {
                if (
                  allAnswers[index].lat2 !== undefined &&
                  allAnswers[index].lng2 !== undefined
                ) {
                  return (
                    <Marker
                      longitude={allAnswers[index].lat2}
                      latitude={allAnswers[index].lng2}
                    >
                      <svg
                        className="glyph"
                        width={20}
                        height={20}
                        style={{
                          fill: "none",
                          stroke: "none",
                        }}
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="10"
                          fill="#ffb865"
                          stroke="fbfbfb"
                          strokeWidth="3"
                        ></circle>
                      </svg>
                    </Marker>
                  );
                }
              }
            })}
      </Map>
      {/* <div id="Visualization" className={classes.visualization_container}></div> */}
      <aside className={classes.aside}>
        <button className={classes.botao_legendas} onClick={toggleLegenda}>
          ?
        </button>
        <div className={classes.dicas_container}>
          <div>
            <button onClick={toggleDicas}>
              <p>Dicas</p>
              <img
                src="images/seta-12.png"
                role="presentation"
                width="30"
                height="30"
                style={{
                  transform: showDicas ? "rotate(180deg)" : "rotate(0)",
                }}
              />
            </button>
          </div>
          {visualizationMode === 0 && showDicas === true && (
            <ul>
              <li>
                Clica num país para mostrar todas as relações do mesmo (clica
                outra vez para desselecionar)
              </li>
              <li>Clica num glifo para mostrar mais detalhes da relação</li>
              <li>
                Escolhe parâmetros no menu da esquerda para alterares o glifo
              </li>
            </ul>
          )}
          {visualizationMode === 1 && showDicas === true && (
            <ul>
              <li>
                <li>
                  Clica num país para mostrar origem e destino de relações do
                  mesmo (clica outra vez para desselecionar)
                </li>
              </li>
            </ul>
          )}
        </div>
      </aside>
      {showLegenda && (
        <div className={classes.legenda_container}>
          <img
            src="images/legenda-11.png"
            role="presentation"
            width="1280"
            height="720"
          />
          <button onClick={toggleLegenda}>
            <img
              src="images/cruz-13.png"
              role="presentation"
              width="30"
              height="30"
            />
          </button>
        </div>
      )}
    </main>
  );
}

export async function getServerSideProps() {
  //conexão ao mongoose
  await connectMongoose();

  //fetch de todas as respostas da base de dados
  let relationships;
  try {
    relationships = await Relationship.find();
  } catch (err) {
    console.log("Error:", err);
  }

  //--------------------------------------Fetch das coordenadas geográficas para cada resposta--------------------------------------
  let updated_answers = [];

  let country_coordinates = [];
  for (let i = 0; i < relationships.length; i++) {
    let fetched_answer1;
    let pais = relationships[i].pais || "";

    let country_info = country_names_pt.find((item) => {
      return item.name === pais.trim();
    });
    //console.log("country_id1:", country_id1);

    let country_english;
    if (country_info !== undefined) {
      let country_id1 = country_info.id;

      country_english = country_names_en.find((item) => {
        return item.id === country_id1;
      }).name;
    }

    pais =
      country_english !== undefined
        ? country_english.replace(" ", "%20")
        : pais.trim().replace(" ", "%20");
    try {
      let url1 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${pais}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

      let country_coordinates = await fetch(url1)
        .then((response) => response.json())
        .then(async (data) => {
          fetched_answer1 = data;
        });
    } catch (err) {
      console.log("Error 1:", err);
    }

    if (fetched_answer1.features[0].center !== undefined) {
      let fetched_answer2;
      let cidade =
        relationships[i].cidade_vila_aldeia !== undefined &&
        relationships[i].cidade_vila_aldeia !== " "
          ? relationships[i].cidade_vila_aldeia
          : relationships[i].concelho !== undefined &&
            relationships[i].concelho !== " "
          ? relationships[i].concelho
          : relationships[i].distrito_estado;
      cidade = cidade.trim().replace(" ", "%20");

      try {
        let center_lat = fetched_answer1.features[0].center[0];
        let center_lng = fetched_answer1.features[0].center[1];
        let proximity_string =
          fetched_answer1.features[0].center !== undefined
            ? `proximity=${center_lng},${center_lat}`
            : "";
        let url2 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${cidade}.json?${proximity_string}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

        let city_coordinates = await fetch(url2)
          .then((response) => response.json())
          .then((data) => {
            fetched_answer2 = data;
          });
      } catch (err) {
        console.log("Error 2:", err);
      }

      let fetched_answer3;
      let regiao =
        relationships[i].regiao !== undefined && relationships[i].regiao !== " "
          ? relationships[i].regiao
          : "";
      regiao = regiao.trim().replace(" ", "%20");

      updated_answers.push({
        username: relationships[i].username,
        idade_atual: relationships[i].idade_atual,
        idade_inicio1: relationships[i].idade_inicio1,
        pais: relationships[i].pais,
        distrito_estado: relationships[i].distrito_estado,
        concelho: relationships[i].concelho,
        cidade_vila_aldeia: relationships[i].cidade_vila_aldeia,
        genero1: relationships[i].genero1,
        orientacao: relationships[i].orientacao,
        idade_inicio2: relationships[i].idade_inicio2,
        genero2: relationships[i].genero2,
        regiao: relationships[i].regiao,
        relacao_monogamica: relationships[i].relacao_monogamica,
        relacao_distancia: relationships[i].relacao_distancia,
        primeira_relacao: relationships[i].primeira_relacao,
        primeira_relacao_pessoa: relationships[i].primeira_relacao_pessoa,
        meio_conhecimento: relationships[i].meio_conhecimento,
        abertura: relationships[i].abertura,
        duracao: relationships[i].duracao,
        nivel: relationships[i].nivel,
        quem_terminou: relationships[i].quem_terminou,
        esperado: relationships[i].esperado,
        desenvolvimento_termino: relationships[i].desenvolvimento_termino,
        motivo_termino: relationships[i].motivo_termino,
        sentimentos: relationships[i].sentimentos,
        informacao_extra: relationships[i].informacao_extra,
        teve_mais_relacoes: relationships[i].teve_mais_relacoes,
      });

      if (regiao !== "") {
        try {
          let center_lat = fetched_answer1.features[0].center[0];
          let center_lng = fetched_answer1.features[0].center[1];
          let proximity_string =
            fetched_answer1.features[0].center !== undefined
              ? `proximity=${center_lng},${center_lat}`
              : "";
          let url3 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${regiao}.json?${proximity_string}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

          let regiao_coordinates = await fetch(url3)
            .then((response) => response.json())
            .then((data) => {
              fetched_answer3 = data;
            });
        } catch (err) {
          console.log("Error 3:", err);
        }

        updated_answers[i].lat = fetched_answer2.features[0].center[0];
        updated_answers[i].lng = fetched_answer2.features[0].center[1];
        updated_answers[i].lat2 = fetched_answer3.features[0].center[0];
        updated_answers[i].lng2 = fetched_answer3.features[0].center[1];
      } else {
        updated_answers[i].lat = fetched_answer2.features[0].center[0];
        updated_answers[i].lng = fetched_answer2.features[0].center[1];
      }
    } else {
      updated_answers.push({});
    }
  }

  //--------------------------------------Respostas por país--------------------------------------
  let answers_per_country = {};
  updated_answers.forEach((answer, i) => {
    answers_per_country[answer.pais.trim()] = {};
    answers_per_country[answer.pais.trim()].respostas = [];
  });

  updated_answers.forEach((answer, i) => {
    answers_per_country[answer.pais.trim()].respostas.push(answer);
  });

  for (const property of Object.keys(answers_per_country)) {
    let stats = groupedStats(answers_per_country[property].respostas);
    answers_per_country[property].stats = stats;
    //console.log("Stats " + property, answers_per_country[property].stats);

    let url4 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${property}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

    let fetched_answer4;
    try {
      let pais_coordinates = await fetch(url4)
        .then((response) => response.json())
        .then((data) => {
          fetched_answer4 = data;
        });
    } catch (err) {
      console.log("Error:", err);
    }

    console.log(fetched_answer4.features[0]);

    if (fetched_answer4.features[0].place_type[0] === "country") {
      answers_per_country[property].coordinates = {
        lat: fetched_answer4.features[0].center[0],
        lng: fetched_answer4.features[0].center[1],
      };
    } else {
      let new_group = {};
      for (const prop of Object.keys(answers_per_country)) {
        if (prop !== property) {
          new_group[prop] = answers_per_country[prop];
        }
      }
      answers_per_country = new_group;
    }
  }
  //console.log("answers_per_country:", answers_per_country);

  //--------------------------------------Todas as respostas (sentimentos)--------------------------------------
  let stats = groupedStats(updated_answers);

  //--------------------------------------Função para calcular stats--------------------------------------
  function groupedStats(all_answers) {
    let contagem_sentimentos = {};

    all_answers.forEach((answer, i) => {
      answer.sentimentos.forEach((sentimento, j) => {
        if (!Object.keys(contagem_sentimentos).includes(sentimento)) {
          contagem_sentimentos[sentimento] = 1;
        } else {
          contagem_sentimentos[sentimento]++;
        }
      });
    });

    let sentimentos_ordenados = Object.keys(contagem_sentimentos).sort(
      function (a, b) {
        return contagem_sentimentos[b] - contagem_sentimentos[a];
      }
    );
    //console.log("sentimentos_ordenados:", sentimentos_ordenados);

    let quantidades_ordenadas = [];
    for (let i = 0; i < sentimentos_ordenados.length; i++) {
      quantidades_ordenadas.push(
        contagem_sentimentos[sentimentos_ordenados[i]]
      );
    }
    //console.log("Quantidades Ordenadas:", quantidades_ordenadas);

    //console.log("Sentimentos:", sentimentos);
    let grupo_outros = [];
    let contagem_grupo_outros = 0;
    sentimentos_ordenados.forEach((sentimento, i) => {
      if (quantidades_ordenadas[i] < 3) {
        grupo_outros.push(sentimento);
        contagem_grupo_outros += quantidades_ordenadas[i];
      }
    });
    //console.log("grupo_outros:", grupo_outros);
    //console.log("contagem_grupo_outros:", contagem_grupo_outros);

    let updated_groups = sentimentos_ordenados;
    for (let i = 0; i < grupo_outros.length; i++) {
      updated_groups = updated_groups.filter((item, j) => {
        return item !== grupo_outros[i];
      });
    }
    updated_groups.push("Outros");
    //console.log("updated_groups:", updated_groups);

    let updated_count = quantidades_ordenadas.filter((item, j) => {
      return item >= 3;
    });

    updated_count.push(contagem_grupo_outros);
    //console.log("updated_count:", updated_count);

    let total_count = 0;
    updated_count.forEach((item, i) => {
      if (i !== updated_count.length - 1) {
        total_count += item;
      }
    });

    let primeiras_relacoes = updated_answers.filter((item, i) => {
      return item.primeira_relacao === "Sim";
    });
    //console.log("primeiras_relacoes:", primeiras_relacoes);

    let idades_primeiras_relacoes = [];
    primeiras_relacoes.forEach((item, i) => {
      idades_primeiras_relacoes.push(item.idade_inicio1);
    });
    //console.log("idades_primeiras_relacoes:", idades_primeiras_relacoes);

    let soma = idades_primeiras_relacoes.reduce((a, b) => a + b);
    let idade_media = Math.round(soma / idades_primeiras_relacoes.length);
    //console.log("idade_media:", idade_media);

    return {
      updated_groups,
      updated_count,
      total_count,
      idade_media,
    };
  }

  //console.log("updated_answers:", updated_answers);

  return {
    props: {
      updated_answers,
      sentimentos: {
        sentimentos_ordenados: stats.updated_groups,
        quantidades_ordenadas: stats.updated_count,
      },
      idade_media: stats.idade_media,
      stats,
      answers_per_country,
      country_coordinates,
    },
  };
}
