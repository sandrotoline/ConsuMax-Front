<template>
  <div>
    <form @submit.prevent="cadastrar">
      <h2>ConsuMax</h2>
      <div class="form-group">
        <label for="consumoMl">Consumo</label>
        <input
          type="number"
          id="consumoMl"
          class="form-control"
          required
          autofocus
          v-model="consumoMl"
        >
      </div>
      <div class="form-group">
        <label for="observacao">Observação</label>
        <textarea id="observacao" class="form-control" v-model="observacao"></textarea>
      </div>
      <button class="btn btn-lg btn-success btn-block" type="submit">Adicionar</button>
    </form>
    <br>
    <div class="progress">
      <!-- style é retornado pela função barraprogresso, pq tem o valor de width (que é o
      quanto foi de progresso na barra, variável. o aria-valuenow é só um número, então
      já coloquei a variável progresso.
      -->
      <div
        class="progress-bar"
        role="progressbar"
        :style="barraProgresso"
        :aria-valuenow="this.progresso"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th class="text-center">Quantindade</th>
          <th class="text-center">Observação</th>
          <th class="text-center">Data/hora</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="historico in historicos" :key="historico.id">
          <td>{{ historico.consumoMl }} mg</td>
          <td>{{ historico.observacao }}</td>
          <td>{{ converterHora(historico.datahora) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "historicoConsumo",
  data() {
    return {
      consumoMl: "",
      observacao: "",
      total: 0,
      progresso: 0,
      historicos: [],
      iconeAgua: { height: "70px", width: "70px" }
    };
  },
  computed: {
    ...mapState(["usuario", "metadiaria"]),

    barraProgresso: function() {
      return "width: " + this.progresso + "%";
    }
  },
  methods: {
    cadastrar() {
      axios
        .post("historicoConsumo/addHistorico", {
          consumoMl: this.consumoMl,
          observacao: this.observacao,
          usuario: this.usuario
        })
        .then(res => {
          console.log(res);
          this.consumoMl = "";
          this.observacao = "";
          this.atualizar();
          this.calculaMeta();
          this.$alert(
            "Você está mais próximo(a) da sua meta!",
            "Sucesso!",
            "success"
          );
        })
        .catch(error => console.log(error));
    },
    atualizar() {
      axios
        .get("/historicoConsumo/getByUser/" + this.usuario, {
          headers: { Accept: "application/json" }
        })
        .then(res => {
          console.log(res);
          this.historicos = res.data;
        })
        .catch(error => console.log(error));
    },
    calculaMeta() {
      axios
        .get("/historicoConsumo/getConsumoHojePorUsuario/" + this.usuario, {
          headers: { Accept: "application/json" }
        })
        .then(res => {
          console.log(res);
          this.total = res.data;
          if (this.metadiaria == null) {
            this.getMeta();
          }
          this.progresso = (this.total / this.metadiaria) * 100;
        })
        .catch(error => console.log(error));
    },
    ...mapActions(["getUserInfo"]),
    getMeta() {
      this.getUserInfo({ usuario: this.usuario });
    },
    converterHora(date) {
      var dateJS = new Date(date);
      var hoje = new Date();
      var ehHoje =
        hoje.getDate() === dateJS.getDate() &&
        hoje.getMonth() === dateJS.getMonth() &&
        hoje.getFullYear() === dateJS.getFullYear();
      var dia = ehHoje
        ? "Hoje"
        : ("0" + dateJS.getDate()).slice(-2) +
          "-" +
          ("0" + (dateJS.getMonth() + 1)).slice(-2) +
          "-" +
          dateJS.getFullYear();
      var hora =
        ("0" + (dateJS.getHours() + 3)).slice(-2) +
        ":" +
        ("0" + dateJS.getMinutes()).slice(-2) +
        ":" +
        ("0" + dateJS.getSeconds()).slice(-2);
      return dia + " " + hora;
    }
  },
  created() {
    this.atualizar();
  }
};
</script>
