import React, { useEffect, useState } from "react";
import classes from "../../../styles/scss/globalPage.module.scss";
import answers from "../../../public/data/form_answers.json";
import Map, { Marker, Source, Layer } from "react-map-gl";
import CustomMarker from "../../../components/CustomMarker";
import axios from "axios";

export default function GlobalPage(props) {
  const [windowWidth, setWindowWidth] = useState();
  const [windowHeight, setWindowHeight] = useState();
  const [viewState, setViewState] = useState({
    longitude: -7.8536599,
    latitude: 39.557191,
    zoom: 3.5,
  });
  const [selectedCountry, setSelectedCountry] = useState("Portugal");
  const [meanAge, setMeanAge] = useState(16);
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
  //const [allAnswers, setAllAnswers] = useState(props.updated_answers);
  const [visualizationMode, setVisualizationMode] = useState(0);

  useEffect(() => {
    if (visualizationMode === 0) {
      document.querySelector("#motivo_termino").checked = true;
      document.querySelector("#como_conheceram").checked = true;
      document.querySelector("#duracao").checked = true;
      document.querySelector("#orientacao").checked = true;
      document.querySelector("#diferenca_idades").checked = true;
      document.querySelector("#nivel").checked = true;
      document.querySelector("#quem_terminou").checked = true;
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
        quem_terminou: true,
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

  return (
    <main className={classes.main}>
      <div className={classes.lateral_bar}>
        <div className={classes.title_container}>
          <h1 className={classes.title}>
            <span>Understanding</span> Relationship Patterns
          </h1>
        </div>
        <div className={classes.menu}>
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
              {/* <option value="2">Parâmetros Principais</option> */}
            </select>
          </label>
          {visualizationMode === 0 && (
            <div className={classes.param_selection_container}>
              <p className={classes.label_text}>PARÂMETROS (1 OU MAIS)</p>
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
              <label htmlFor="duracao" className={classes.param_checkbox_label}>
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
              <label
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
              </label>
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
              {/*             <label htmlFor="origens" className={classes.param_checkbox_label}>
              <input
                type="checkbox"
                name="params"
                id="origens"
                onChange={onCheckboxChange}
              />
              <span className={classes.custom_checkbox}></span>
              <p>Origens das pessoas</p>
            </label> */}
              {/* <label
              htmlFor="sentimentos_termino"
              className={classes.param_checkbox_label}
            >
              <input
                type="checkbox"
                name="params"
                id="sentimentos_termino"
                onChange={onCheckboxChange}
              />
              <span className={classes.custom_checkbox}></span>
              <p>Sentimentos após o término</p>
            </label> */}
              <label htmlFor="genero1" className={classes.param_checkbox_label}>
                <input
                  type="checkbox"
                  name="params"
                  id="genero1"
                  onChange={onCheckboxChange}
                />
                <span className={classes.custom_checkbox}></span>
                <p>Género da pessoa que submeteu</p>
              </label>
              <label htmlFor="genero2" className={classes.param_checkbox_label}>
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
              <div></div>
              <svg></svg>
            </div>
          </div>
        </div>
      </div>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: windowWidth, height: windowHeight }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {props.updated_answers !== undefined && visualizationMode === 0
          ? props.updated_answers.map((answer, i) => {
              //console.log("Answer:", answer);
              //console.log(i, answer.lng);
              //console.log(i, answer.lat);
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
          : new Array(props.updated_answers.length * 2)
              .fill("")
              .map((item, i) => {
                let index =
                  i < props.updated_answers.length
                    ? i
                    : i - props.updated_answers.length;

                if (i < props.updated_answers.length) {
                  return (
                    <Marker
                      longitude={props.updated_answers[index].lat}
                      latitude={props.updated_answers[index].lng}
                    >
                      <svg
                        className="glyph"
                        width={20}
                        height={20}
                        style={{
                          cursor: "pointer",
                          fill: "none",
                          stroke: "none",
                          //transform: `translate(${-20 / 2}px,${-20}px)`,
                        }}
                        onClick={() => onClick(city)}
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
                    props.updated_answers[index].lat2 !== undefined &&
                    props.updated_answers[index].lng2 !== undefined
                  ) {
                    return (
                      <Marker
                        longitude={props.updated_answers[index].lat2}
                        latitude={props.updated_answers[index].lng2}
                      >
                        <svg
                          className="glyph"
                          width={20}
                          height={20}
                          style={{
                            cursor: "pointer",
                            fill: "none",
                            stroke: "none",
                            //transform: `translate(${-20 / 2}px,${-20}px)`,
                          }}
                          onClick={() => onClick(city)}
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
        {visualizationMode === 1 &&
          new Array(props.updated_answers.length).fill("").map((item, i) => {
            if (
              props.updated_answers[i].lat2 !== undefined &&
              props.updated_answers[i].lng2 !== undefined
            ) {
              const lineData = {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [
                      props.updated_answers[i].lat,
                      props.updated_answers[i].lng,
                    ],
                    [
                      props.updated_answers[i].lat2,
                      props.updated_answers[i].lng2,
                    ],
                  ],
                },
              };
              console.log("Line Data:", lineData);

              return (
                <Source type="geojson" data={lineData}>
                  <Layer
                    type="line"
                    source="my-data"
                    layout={{
                      "line-join": "round",
                      "line-cap": "round",
                    }}
                    paint={{
                      "line-color": "rgb(50, 0, 58, 0.25)",
                      "line-width": 5,
                    }}
                  />
                </Source>
              );
            }
          })}
      </Map>
      {/* <div id="Visualization" className={classes.visualization_container}></div> */}
    </main>
  );
}

export async function getServerSideProps() {
  let updated_answers = [];
  //console.log("Answers Length:", answers.length);
  for (let i = 0; i < answers.length; i++) {
    let fetched_answer1;
    let pais = answers[i].pais || "";
    pais = pais.trim().replace(" ", "%20");
    try {
      let url1 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${pais}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

      let country_coordinates = await fetch(url1)
        .then((response) => response.json())
        .then(async (data) => {
          fetched_answer1 = data;
          //console.log("Data 1:", i, fetched_answer1);
        });
    } catch (err) {
      console.log("Error 1:", err);
    }
    //console.log("Fetched Answer 1 Out:", i, fetched_answer1);

    if (fetched_answer1.features[0].center !== undefined) {
      //console.log("----------------------if----------------------");
      let fetched_answer2;
      let cidade =
        answers[i].cidade_vila_aldeia !== undefined
          ? answers[i].cidade_vila_aldeia
          : answers[i].concelho !== undefined
          ? answers[i].concelho
          : answers[i].distrito_estado;
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
            //console.log("Data 2", i, fetched_answer2);
          });
      } catch (err) {
        console.log("Error 2:", err);
      }
      //console.log("Fetched Answer 2 Out:", i, fetched_answer2);

      let fetched_answer3;
      let regiao = answers[i].regiao !== undefined ? answers[i].regiao : "";
      regiao = regiao.trim().replace(" ", "%20");

      if (regiao !== "") {
        try {
          //console.log("Center 1:", fetched_answer1.features[0].center);
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
              //console.log("Data 3", i, fetched_answer3);
            });
        } catch (err) {
          console.log("Error 3:", err);
        }
        //console.log("Fetched Answer 3 Out:", i, fetched_answer3);
        //console.log("Center 3:", fetched_answer3.features[0].center);

        updated_answers.push({
          ...answers[i],
          lat: fetched_answer2.features[0].center[0],
          lng: fetched_answer2.features[0].center[1],
          lat2: fetched_answer3.features[0].center[0],
          lng2: fetched_answer3.features[0].center[1],
        });
      } else {
        updated_answers.push({
          ...answers[i],
          lat: fetched_answer2.features[0].center[0],
          lng: fetched_answer2.features[0].center[1],
        });
      }
    } else {
      //console.log("----------------------else----------------------");
      updated_answers.push({});
    }
  }
  //console.log("Updated Answers:", updated_answers.length, updated_answers);

  return {
    props: { updated_answers },
  };
}
