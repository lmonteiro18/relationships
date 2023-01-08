import { useEffect, useState } from "react";
import classes from "../styles/scss/globalPage.module.scss";

export default function BarraSentimentos(props) {
  const [gruposSentimentos, setGruposSentimentos] = useState(props.sentimentos);

  useEffect(() => {
    console.log("props.sentimentos:", gruposSentimentos);
  }, []);

  return (
    <div className={classes.barra_sentimentos}>
      {gruposSentimentos !== undefined &&
        gruposSentimentos.updated_groups.map((item, i) => {
          /* console.log(
            "gruposSentimentos.updated_count:",
            gruposSentimentos.updated_count[i]
          );
          console.log(
            "gruposSentimentos.total_count:",
            gruposSentimentos.total_count
          ); */
          let width =
            (gruposSentimentos.updated_count[i] * 100) /
            gruposSentimentos.total_count;
          //console.log("width:", width);
          return (
            <div
              key={i}
              className={classes.seccao_sentimento}
              style={{ width: `${width}%` }}
            >
              <p>{item}</p>
              <span className={classes.popup}>
                {`${item} (${width.toFixed(1)}%)`}
              </span>
            </div>
          );
        })}
    </div>
  );
}
