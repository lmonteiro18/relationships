import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classes from "../styles/scss/submitAnswer.module.scss";

export default function SubmitAnswerPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [showErrors, setShowErrors] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    let sentimentos = [];
    for (let i = 0; i < 15; i++) {
      if (i < 14) {
        if (e.target[`sentimentos${i + 1}`].checked === true) {
          sentimentos.push(e.target[`sentimentos${i + 1}`].value);
        }
      } else {
        if (
          e.target[`sentimentos15`].value !== undefined &&
          e.target[`sentimentos15`].value !== ""
        ) {
          sentimentos.push(e.target[`sentimentos15`].value);
        }
      }
    }

    const formData = {
      username: e.target.username.value,
      idade_atual: e.target.idade_atual.value,
      idade_inicio1: e.target.idade_inicio1.value,
      pais: e.target.pais.value,
      distrito_estado: e.target.distrito_estado.value,
      concelho: e.target.concelho.value,
      cidade_vila_aldeia: e.target.cidade_vila_aldeia.value,
      genero1: e.target.genero1.value,
      orientacao: e.target.orientacao.value,
      idade_inicio2: e.target.idade_inicio2.value,
      genero2: e.target.genero2.value,
      regiao: e.target.regiao.value,
      relacao_monogamica: e.target.relacao_monogamica.value,
      relacao_distancia: e.target.relacao_distancia.value,
      primeira_relacao: e.target.primeira_relacao.value,
      primeira_relacao_pessoa: e.target.primeira_relacao_pessoa.value,
      meio_conhecimento: e.target.meio_conhecimento.value,
      abertura: e.target.abertura.value,
      duracao: e.target.duracao.value,
      nivel: e.target.nivel.value,
      quem_terminou: e.target.quem_terminou.value,
      esperado: e.target.esperado.value,
      desenvolvimento_termino: e.target.desenvolvimento_termino.value,
      motivo_termino: e.target.motivo_termino.value,
      sentimentos: sentimentos,
      informacao_extra:
        e.target.informacao_extra.value !== undefined &&
        e.target.informacao_extra.value !== ""
          ? e.target.informacao_extra.value
          : " ",
      teve_mais_relacoes: e.target.teve_mais_relacoes.value,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    const response = await fetch("/api/submitAnswer", options);
    const result = await response.json();
    //console.log("Result", result);
    if (result.success !== undefined && result.success === true) {
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } else {
      setShowErrors(
        result.error !== undefined
          ? result.error.message
          : "Houve um erro ao submeter a resposta"
      );
    }
  }

  return (
    <main className={classes.main}>
      {success === false ? (
        <div className={classes.container}>
          <Link href="/global" className={classes.button_goback}>
            <div>
              <img
                src="images/seta-12.png"
                role="presentation"
                width="30"
                height="30"
              />
            </div>
            <p>Voltar ?? visualiza????o</p>
          </Link>
          <h1 className={classes.title}>Love Relationship Form</h1>
          <div className={classes.form_container}>
            {showErrors !== "" && (
              <div className={classes.errorList}>
                <ul>
                  <li>{showErrors}</li>
                </ul>
              </div>
            )}
            <form
              action="/api/submitAnswer"
              method="POST"
              onSubmit={handleSubmit}
            >
              <h2 className={classes.section_title}>
                Sec????o 1 de 3 - Perguntas sobre ti
              </h2>
              <label htmlFor="username">
                <span className={classes.required}>required</span>
                <p>Username</p>
                <input id="username" type="text" name="username" required />
              </label>
              <label htmlFor="idade_atual">
                <span className={classes.required}>required</span>
                <p>A tua idade atual</p>
                <input
                  id="idade_atual"
                  type="number"
                  name="idade_atual"
                  required
                />
              </label>
              <label htmlFor="idade_inicio1">
                <span className={classes.required}>required</span>
                <p>A tua idade (quando a rela????o come??ou)</p>
                <input
                  id="idade_inicio1"
                  type="number"
                  name="idade_inicio1"
                  required
                />
              </label>
              <label htmlFor="pais">
                <span className={classes.required}>required</span>
                <p>Pa??s onde vivias (quando tiveste a rela????o)</p>
                <input id="pais" type="text" name="pais" required />
              </label>
              <label htmlFor="distrito_estado">
                <span className={classes.required}>required</span>
                <p>Distrito/Estado onde vivias (quando tiveste a rela????o)</p>
                <input
                  id="distrito_estado"
                  type="text"
                  name="distrito_estado"
                  required
                />
              </label>
              <label htmlFor="concelho">
                <span className={classes.required}>required</span>
                <p>Concelho onde vivias (quando tiveste a rela????o)</p>
                <input id="concelho" type="text" name="concelho" required />
              </label>
              <label htmlFor="cidade_vila_aldeia">
                <span className={classes.required}>required</span>
                <p>Cidade/Vila/Aldeia onde vivias (quando tiveste a rela????o)</p>
                <input
                  id="cidade_vila_aldeia"
                  type="text"
                  name="cidade_vila_aldeia"
                  required
                />
              </label>
              <label htmlFor="genero1">
                <span className={classes.required}>required</span>
                <p>O teu g??nero</p>
                <select id="genero1" name="genero1" required>
                  <option value="Mulher Cisg??nero">Mulher Cisg??nero</option>
                  <option value="Homem Cisg??nero">Homem Cisg??nero</option>
                  <option value="Mulher Transg??nero">Mulher Transg??nero</option>
                  <option value="Homem Transg??nero">Homem Transg??nero</option>
                  <option value="N??o-bin??rio">N??o-bin??rio</option>
                  <option value="Prefiro n??o dizer">Prefiro n??o dizer</option>
                  <option value="N??o sei">N??o sei</option>
                </select>
              </label>
              <label htmlFor="orientacao">
                <span className={classes.required}>required</span>
                <p>A tua orienta????o sexual</p>
                <select id="orientacao" name="orientacao" required>
                  <option value="Heterossexual">Heterossexual</option>
                  <option value="Homossexual">Homossexual</option>
                  <option value="Bissexual">Bissexual</option>
                  <option value="Poliamoroso">Poliamoroso</option>
                  <option value="Polissexual">Polissexual</option>
                  <option value="Panssexual">Panssexual</option>
                  <option value="Assexual">Assexual</option>
                  <option value="Androssexual">Androssexual</option>
                  <option value="Ginessexual">Ginessexual</option>
                  <option value="Sexualmente Flu??do">Sexualmente Flu??do</option>
                  <option value="Skoliossexual">Skoliossexual</option>
                  <option value="A questionar">A questionar</option>
                  <option value="Prefiro n??o dizer">Prefiro n??o dizer</option>
                  <option value="Outro">Outro</option>
                </select>
              </label>
              <h2 className={classes.section_title}>
                Sec????o 2 de 3 - Perguntas sobre a outra pessoa
              </h2>
              <label htmlFor="idade_inicio2">
                <span className={classes.required}>required</span>
                <p>A idade da outra pessoa (quando a rela????o come??ou)</p>
                <input
                  id="idade_inicio2"
                  type="number"
                  name="idade_inicio2"
                  required
                />
              </label>
              <label htmlFor="genero2">
                <span className={classes.required}>required</span>
                <p>O g??nero da outra pessoa</p>
                <select id="genero2" name="genero2" required>
                  <option value="Mulher Cisg??nero">Mulher Cisg??nero</option>
                  <option value="Homem Cisg??nero">Homem Cisg??nero</option>
                  <option value="Mulher Transg??nero">Mulher Transg??nero</option>
                  <option value="Homem Transg??nero">Homem Transg??nero</option>
                  <option value="N??o-bin??rio">N??o-bin??rio</option>
                  <option value="Prefiro n??o dizer">Prefiro n??o dizer</option>
                  <option value="N??o sei">N??o sei</option>
                </select>
              </label>
              <label htmlFor="regiao">
                <span className={classes.required}>required</span>
                <p>
                  Distrito/Estado onde a outra pessoa vivia (quando tiveram a
                  rela????o)
                </p>
                <input id="regiao" type="text" name="regiao" required />
              </label>
              <h2 className={classes.section_title}>
                Sec????o 3 de 3 - Perguntas sobre a rela????o
              </h2>
              <label htmlFor="relacao_monogamica">
                <span className={classes.required}>required</span>
                <p>A rela????o era apenas com uma pessoa?</p>
                <fieldset id="relacao_monogamica">
                  <div>
                    <input
                      type="radio"
                      name="relacao_monogamica"
                      value="Sim"
                      required
                    />{" "}
                    <p>Sim</p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="relacao_monogamica"
                      value="N??o"
                      required
                    />{" "}
                    <p>N??o</p>
                  </div>
                </fieldset>
              </label>
              <label htmlFor="relacao_distancia">
                <span className={classes.required}>required</span>
                <p>Rela????o ?? dist??ncia</p>
                <fieldset id="relacao_distancia">
                  <div>
                    <input
                      type="radio"
                      name="relacao_distancia"
                      value="Sim"
                      required
                    />{" "}
                    <p>Sim</p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="relacao_distancia"
                      value="N??o"
                      required
                    />{" "}
                    <p>N??o</p>
                  </div>
                </fieldset>
              </label>
              <label htmlFor="primeira_relacao">
                <span className={classes.required}>required</span>
                <p>Foi a tua primeira rela????o?</p>
                <fieldset id="primeira_relacao">
                  <div>
                    <input
                      type="radio"
                      name="primeira_relacao"
                      value="Sim"
                      required
                    />{" "}
                    <p>Sim</p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="primeira_relacao"
                      value="N??o"
                      required
                    />{" "}
                    <p>N??o</p>
                  </div>
                </fieldset>
              </label>
              <label htmlFor="primeira_relacao_pessoa">
                <span className={classes.required}>required</span>
                <p>Foi a primeira rela????o com a pessoa?</p>
                <fieldset id="primeira_relacao_pessoa">
                  <div>
                    <input
                      type="radio"
                      name="primeira_relacao_pessoa"
                      value="Sim"
                      required
                    />{" "}
                    <p>Sim</p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="primeira_relacao_pessoa"
                      value="N??o"
                      required
                    />{" "}
                    <p>N??o</p>
                  </div>
                </fieldset>
              </label>
              <label htmlFor="meio_conhecimento">
                <span className={classes.required}>required</span>
                <p>Como se conheceram?</p>
                <input
                  id="meio_conhecimento"
                  name="meio_conhecimento"
                  type="text"
                  list="meios"
                  required
                />
                <datalist id="meios">
                  <option value="Cara-a-cara em contexto normal">
                    Cara-a-cara em contexto normal
                  </option>
                  <option value="Cara-a-cara numa festa">
                    Cara-a-cara numa festa
                  </option>
                  <option value="Site/aplica????o de namoro">
                    Site/aplica????o de namoro
                  </option>
                  <option value="Rede social">Cara-a-cara numa festa</option>
                </datalist>
              </label>
              <label htmlFor="abertura">
                <span className={classes.required}>required</span>
                <p>Abertura da rela????o</p>
                <select id="abertura" name="abertura" required>
                  <option value="Exclusiva">Exclusiva</option>
                  <option value="Aberta">Aberta</option>
                  <option value="Indefinido">Indefinido</option>
                </select>
              </label>
              <label htmlFor="duracao">
                <span className={classes.required}>required</span>
                <p>Dura????o da rela????o</p>
                <select id="duracao" name="duracao" required>
                  <option value="Menos de 3 meses">Menos de 3 meses</option>
                  <option value="Entre 3 meses e 1 ano">
                    Entre 3 meses e 1 ano
                  </option>
                  <option value="Entre 1 e 2 anos">Entre 1 e 2 anos</option>
                  <option value="Entre 2 e 5 anos">Entre 2 e 5 anos</option>
                  <option value="Entre 5 e 10 anos">Entre 5 e 10 anos</option>
                  <option value="Entre 10 e 20 anos">Entre 10 e 20 anos</option>
                  <option value="Entre 20 e 40 anos">Entre 20 e 40 anos</option>
                  <option value="Mais de 40 anos">Mais de 40 anos</option>
                </select>
              </label>
              <label htmlFor="nivel">
                <span className={classes.required}>required</span>
                <p>N??vel mais alto que a rela????o atingiu</p>
                <select id="nivel" name="nivel" required>
                  <option value="Namoro">Namoro</option>
                  <option value="Casamento">Casamento</option>
                  <option value="N??o rotul??mos">N??o rotul??mos</option>
                </select>
              </label>
              <label htmlFor="quem_terminou">
                <span className={classes.required}>required</span>
                <p>Quem acabou a rela????o?</p>
                <select id="quem_terminou" name="quem_terminou" required>
                  <option value="Eu">Eu</option>
                  <option value="A outra pessoa">A outra pessoa</option>
                  <option value="Decis??o m??tua">Decis??o m??tua</option>
                </select>
              </label>
              <label htmlFor="esperado">
                <span className={classes.required}>required</span>
                <p>O t??rmino da rela????o foi:</p>
                <select id="esperado" name="esperado" required>
                  <option value="Esperava (j?? tinha havido sinais)">
                    Esperava (j?? tinha havido sinais)
                  </option>
                  <option value="Inesperado (sem qualquer sinal/aviso/indica????o)">
                    Inesperado (sem qualquer sinal/aviso/indica????o)
                  </option>
                </select>
              </label>
              <label htmlFor="desenvolvimento_termino">
                <span className={classes.required}>required</span>
                <p>Como se desenvolveu o t??rmino da rela????o?</p>
                <select
                  id="desenvolvimento_termino"
                  name="desenvolvimento_termino"
                  required
                >
                  <option value="Abrupto ou curto">Abrupto ou curto</option>
                  <option value="Durou algum tempo, fomo-nos afastando aos poucos">
                    Durou algum tempo, fomo-nos afastando aos poucos
                  </option>
                  <option value="Durou muito tempo, houve rompimentos e recome??os consecutivos">
                    Durou muito tempo, houve rompimentos e recome??os
                    consecutivos
                  </option>
                </select>
              </label>
              <label htmlFor="motivo_termino">
                <span className={classes.required}>required</span>
                <p>Motivo do final da rela????o</p>
                <input
                  id="motivo_termino"
                  name="motivo_termino"
                  type="text"
                  list="motivos"
                  required
                ></input>
                <datalist id="motivos">
                  <option value="Os sentimentos deixaram de ser os mesmos">
                    Os sentimentos deixaram de ser os mesmos
                  </option>
                  <option value="Incompatibilidade (trabalho, localiza????o, objetivos, ...)">
                    Incompatibilidade (trabalho, localiza????o, objetivos, ...)
                  </option>
                  <option value="Interfer??ncia de outras rela????es (amizades, fam??lia, ...)">
                    Interfer??ncia de outras rela????es (amizades, fam??lia, ...)
                  </option>
                  <option value="Rela????o abusiva (falta de respeito, mentiras, viol??ncia, trai????o, v??cios, ...)">
                    Rela????o abusiva (falta de respeito, mentiras, viol??ncia,
                    trai????o, v??cios, ...)
                  </option>
                  <option value="Medo de compromisso">
                    Medo de compromisso
                  </option>
                  <option value="Perda de contacto">Perda de contacto</option>
                  <option value="Ainda havia sentimentos de uma rela????o anterior">
                    Ainda havia sentimentos de uma rela????o anterior
                  </option>
                </datalist>
              </label>
              <div className={classes.checkboxes_container}>
                <span className={classes.required}>required</span>
                <p>Como te sentiste no final da rela????o?</p>
                <fieldset id="sentimentos1">
                  <label htmlFor="sentimentos1">
                    <input
                      id="sentimentos1"
                      type="checkbox"
                      name="sentimentos1"
                      value="Perdido"
                    />
                    <span className={classes.custom_checkbox}></span>
                    <p>Perdido</p>
                  </label>
                  <label htmlFor="sentimentos2">
                    <input
                      id="sentimentos2"
                      type="checkbox"
                      name="sentimentos2"
                      value="Triste"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Triste
                  </label>
                  <label htmlFor="sentimentos3">
                    <input
                      id="sentimentos3"
                      type="checkbox"
                      name="sentimentos3"
                      value="Aliviado"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Aliviado
                  </label>
                  <label htmlFor="sentimentos4">
                    <input
                      id="sentimentos4"
                      type="checkbox"
                      name="sentimentos4"
                      value="Indiferente"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Indiferente
                  </label>
                  <label htmlFor="sentimentos5">
                    <input
                      id="sentimentos5"
                      type="checkbox"
                      name="sentimentos5"
                      value="Isolado"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Isolado
                  </label>
                  <label htmlFor="sentimentos6">
                    <input
                      id="sentimentos6"
                      type="checkbox"
                      name="sentimentos6"
                      value="Confuso"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Confuso
                  </label>
                  <label htmlFor="sentimentos7">
                    <input
                      id="sentimentos7"
                      type="checkbox"
                      name="sentimentos7"
                      value="Inseguro"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Inseguro
                  </label>
                  <label htmlFor="sentimentos8">
                    <input
                      id="sentimentos8"
                      type="checkbox"
                      name="sentimentos8"
                      value="Irritado"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Irritado
                  </label>
                  <label htmlFor="sentimentos9">
                    <input
                      id="sentimentos9"
                      type="checkbox"
                      name="sentimentos9"
                      value="Indignado"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Indignado
                  </label>
                  <label htmlFor="sentimentos10">
                    <input
                      id="sentimentos10"
                      type="checkbox"
                      name="sentimentos10"
                      value="Solit??rio"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Solit??rio
                  </label>

                  <label htmlFor="sentimentos11">
                    <input
                      id="sentimentos11"
                      type="checkbox"
                      name="sentimentos11"
                      value="Esperan??oso"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Esperan??oso
                  </label>
                  <label htmlFor="sentimentos12">
                    <input
                      id="sentimentos12"
                      type="checkbox"
                      name="sentimentos12"
                      value="Ansioso"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Ansioso
                  </label>
                  <label htmlFor="sentimentos13">
                    <input
                      id="sentimentos13"
                      type="checkbox"
                      name="sentimentos13"
                      value="Livre"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Livre
                  </label>
                  <label htmlFor="sentimentos14">
                    <input
                      id="sentimentos14"
                      type="checkbox"
                      name="sentimentos14"
                      value="Alegre"
                    />
                    <span className={classes.custom_checkbox}></span>
                    Alegre
                  </label>
                  <label htmlFor="sentimentos15">
                    Escreve outro sentimento, se necess??rio:
                    <input
                      id="sentimentos15"
                      type="text"
                      name="sentimentos15"
                    />
                    <span className={classes.custom_checkbox}></span>
                  </label>
                </fieldset>
              </div>
              <div className={classes.textarea_container}>
                <p>Queres dizer mais alguma coisa sobre a rela????o?</p>
                <textarea
                  name="informacao_extra"
                  id=""
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
              <label htmlFor="teve_mais_relacoes">
                <span className={classes.required}>required</span>
                <p>J?? tiveste mais rela????es desde ent??o?</p>
                <fieldset id="teve_mais_relacoes">
                  <div>
                    <input
                      type="radio"
                      name="teve_mais_relacoes"
                      value="Sim"
                      required
                    />{" "}
                    <p>Sim</p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="teve_mais_relacoes"
                      value="N??o"
                      required
                    />{" "}
                    <p>N??o</p>
                  </div>
                </fieldset>
              </label>
              <input id="submit" type="submit" name="submit" value="Submit" />
            </form>
          </div>
        </div>
      ) : (
        <div className={`${classes.container} ${classes.center}`}>
          <h2>Relationship Info Submited Successfully</h2>
          <p>You are now being redirected to the visualization page.</p>
        </div>
      )}
    </main>
  );
}
