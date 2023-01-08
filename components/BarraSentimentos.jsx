import { useEffect, useState } from "react";
import classes from "../styles/scss/globalPage.module.scss";

export default function BarraSentimentos(props) {
  //----------------------------------VARIÁVEIS----------------------------------
  const [gruposSentimentos, setGruposSentimentos] = useState(props.sentimentos);
  //--------------------------------------------------------------------

  useEffect(() => {
    console.log("props.sentimentos:", gruposSentimentos);
  }, []);

  //----------------------------------ESTRUTURA----------------------------------
  return (
    <div className={classes.barra_sentimentos}>
      {gruposSentimentos !== undefined &&
        gruposSentimentos.updated_groups.map((item, i) => {
          let width =
            (gruposSentimentos.updated_count[i] * 100) /
            gruposSentimentos.total_count;
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
