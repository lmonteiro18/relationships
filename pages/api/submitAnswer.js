const mongoose = require("mongoose");
import connectMongoose from "../../utils/connectMongoose";
import Relationship from "../../models/relationshipModel";

/**
 * @param {import('next).NextApiRequest} req
 * @param {import('next).NextApiResponse} res
 */

const saltRounds = 12;

export default async function handler(req, res) {
  await connectMongoose();

  console.log("Body:", req.body);

  const {
    username,
    idade_atual,
    idade_inicio1,
    pais,
    distrito_estado,
    concelho,
    cidade_vila_aldeia,
    genero1,
    orientacao,
    idade_inicio2,
    genero2,
    regiao,
    relacao_monogamica,
    relacao_distancia,
    primeira_relacao,
    primeira_relacao_pessoa,
    meio_conhecimento,
    abertura,
    duracao,
    nivel,
    quem_terminou,
    esperado,
    desenvolvimento_termino,
    motivo_termino,
    informacao_extra,
    teve_mais_relacoes,
  } = req.body;

  let sentimentos = [];
  for (let i = 0; i < 15; i++) {
    if (req.body[`sentimentos${i + 1}`] !== undefined) {
      sentimentos.push(req.body[`sentimentos${i + 1}`]);
    }
  }
  //console.log("Sentimentos", sentimentos);

  const relationship = new Relationship({
    username: username,
    idade_atual: idade_atual,
    idade_inicio1: idade_inicio1,
    pais: pais,
    distrito_estado: distrito_estado,
    concelho: concelho,
    cidade_vila_aldeia: cidade_vila_aldeia,
    genero1: genero1,
    orientacao: orientacao,
    idade_inicio2: idade_inicio2,
    genero2: genero2,
    regiao: regiao,
    relacao_monogamica: relacao_monogamica,
    relacao_distancia: relacao_distancia,
    primeira_relacao: primeira_relacao,
    primeira_relacao_pessoa: primeira_relacao_pessoa,
    meio_conhecimento: meio_conhecimento,
    abertura: abertura,
    duracao: duracao,
    nivel: nivel,
    quem_terminou: quem_terminou,
    esperado: esperado,
    desenvolvimento_termino: desenvolvimento_termino,
    motivo_termino: motivo_termino,
    sentimentos: sentimentos,
    informacao_extra: informacao_extra,
    teve_mais_relacoes: teve_mais_relacoes,
  });

  //console.log("Relationship:", relationship);

  try {
    const newRelationship = await relationship.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log("Error:", err);
    res.status(404).json({ error: err });
  }

  //Descomentar caso seja necessário inserir documentos sem ser submetendo o formulário pela app

  /* for (let i = 0; i < answers.length; i++) {
    let updated_data = {};
    for (const property of Object.keys(req.body)) {
      console.log("Property:", property);
      if (property.includes("sentimentos")) {
        if (updated_data["sentimentos"] === undefined) {
          updated_data["sentimentos"] = answers[i]["sentimentos"].split(", ");
          console.log(updated_data[property]);
        }
      }
      if (answers[i][property] !== undefined) {
        if (!property.includes("sentimentos")) {
          updated_data[property] = answers[i][property];
        }
      } else {
        if (
          property === "informacao_extra" ||
          property === "username" ||
          property === "regiao" ||
          property === "cidade_vila_aldeia" ||
          property === "concelho"
        ) {
          updated_data[property] = " ";
        }
      }
    }
    //console.log("Updated data:", updated_data);

    const relationship = new Relationship({
      username: updated_data.username,
      idade_atual: updated_data.idade_atual,
      idade_inicio1: updated_data.idade_inicio1,
      pais: updated_data.pais,
      distrito_estado: updated_data.distrito_estado,
      concelho: updated_data.concelho,
      cidade_vila_aldeia: updated_data.cidade_vila_aldeia,
      genero1: updated_data.genero1,
      orientacao: updated_data.orientacao,
      idade_inicio2: updated_data.idade_inicio2,
      genero2: updated_data.genero2,
      regiao: updated_data.regiao,
      relacao_monogamica: updated_data.relacao_monogamica,
      relacao_distancia: updated_data.relacao_distancia,
      primeira_relacao: updated_data.primeira_relacao,
      primeira_relacao_pessoa: updated_data.primeira_relacao_pessoa,
      meio_conhecimento: updated_data.meio_conhecimento,
      abertura: updated_data.abertura,
      duracao: updated_data.duracao,
      nivel: updated_data.nivel,
      quem_terminou: updated_data.quem_terminou,
      esperado: updated_data.esperado,
      desenvolvimento_termino: updated_data.desenvolvimento_termino,
      motivo_termino: updated_data.motivo_termino,
      sentimentos: updated_data.sentimentos,
      informacao_extra: updated_data.informacao_extra,
      teve_mais_relacoes: updated_data.teve_mais_relacoes,
    });

    //console.log("Relationship:", relationship);

    try {
      const newRelationship = await relationship.save();
      //res.status(200).json({ success: true });
    } catch (err) {
      console.log("Error:", i, err);
      //res.status(404).json({ error: err });
    }
  } */
}
