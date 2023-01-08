const mongoose = require("mongoose");
import { Schema, model, models } from "mongoose";

const relationshipSchema = new Schema({
  username: { type: String, required: true },
  idade_atual: { type: Number, required: true },
  idade_inicio1: { type: Number, required: true },
  pais: { type: String, required: true },
  distrito_estado: { type: String, required: true },
  concelho: { type: String, required: true },
  cidade_vila_aldeia: { type: String, required: true },
  genero1: { type: String, required: true },
  orientacao: { type: String, required: true },
  idade_inicio2: { type: Number, required: true },
  genero2: { type: String, required: true },
  regiao: { type: String, required: true },
  relacao_monogamica: { type: String, required: true },
  relacao_distancia: { type: String, required: true },
  primeira_relacao: { type: String, required: true },
  primeira_relacao_pessoa: { type: String, required: true },
  meio_conhecimento: { type: String, required: true },
  abertura: { type: String, required: true },
  duracao: { type: String, required: true },
  nivel: { type: String, required: true },
  quem_terminou: { type: String, required: true },
  esperado: { type: String, required: true },
  desenvolvimento_termino: { type: String, required: true },
  motivo_termino: { type: String, required: true },
  sentimentos: { type: Array, required: true },
  informacao_extra: { type: String, required: true },
  teve_mais_relacoes: { type: String, required: true },
});

//Descomentar estas duas linhas e submeter uma resposta ao formulário para resetar os modelos e esquemas
/* mongoose.models = {};
mongoose.modelSchemas = {}; */

//console.log(models);
const Relationship =
  models.Relationship || model("Relationship", relationshipSchema);

export default Relationship;
