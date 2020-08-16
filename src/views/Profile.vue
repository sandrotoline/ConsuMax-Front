<template>
  <div v-if="this.verificaUser()" class="text-center">
    <h1>Olá, {{ this.$store.state.usuario }}!</h1>
    <h4>Meta Diária: {{ this.verificaMeta() }}mg</h4>
    <br>
    <form @submit.prevent="enviarMeta">
      <div class="form-group">
        <label for="meta-diaria">Alterar meta diária</label>
        <input
          type="number"
          id="meta-diaria"
          placeholder="Nova meta diária (mg)"
          style="display: inline-block;"
          class="form-control"
          required
          v-model="metaDiaria"
        >
      </div>
      <button class="btn btn-success btn-block" type="submit">Inserir</button>
    </form>
    <br>
    <form @submit.prevent="trocarSenha">
      <h4>Trocar Senha</h4>
      <div class="form-group">
        <input
          id="antiga-senha"
          placeholder="Antiga senha"
          type="password"
          style="display: inline-block;"
          class="form-control"
          required
          v-model="antigaSenha"
        >
        <input
          id="nova-senha"
          placeholder="Nova senha"
          type="password"
          style="display: inline-block;"
          class="form-control"
          required
          v-model="novaSenha"
        >
      </div>
      <button class="btn btn-success btn-block" type="submit">Salvar</button>
    </form>
    <br>
    <div v-if="this.verificaAdmin()" class="text-center">
      <h4>Seção Admins:</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Meta Diária</th>
            <th>Autorizações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.nome }}</td>
            <td>{{ usuario.metadiaria ? usuario.metadiaria : 'Sem meta' }}</td>
            <td>{{ usuario.autorizacoes.map(autorizacao => autorizacao.nome).join() }}</td>
          </tr>
        </tbody>
      </table>
      <br>
      <label>Novo usuário</label>
      <form @submit.prevent="adicionarUser">
        <div class="form-group">
          <input
            id="nome-new-user"
            placeholder="Nome"
            style="display: inline-block;"
            class="form-control"
            required
            v-model="nomeNewUser"
          >
          <input
            id="senha-new-user"
            placeholder="Senha"
            type="password"
            style="display: inline-block;"
            class="form-control"
            required
            v-model="senhaNewUser"
          >
        </div>
        <button class="btn btn-success btn-block" type="submit">Adicionar</button>
      </form>
      <br>
      <form @submit.prevent="removerUser">
        <div class="form-group">
          <label for="remove-user">Remover usuário</label>
          <input
            id="remove-user"
            placeholder="Nome do usuário"
            style="display: inline-block;"
            class="form-control"
            required
            v-model="removeUser"
          >
        </div>
        <button class="btn btn-success btn-block" type="submit">Remover</button>
      </form>
    </div>
  </div>

  <div v-else class="text-center">Faça login para consultar as lesões.</div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["usuario", "autorizacoes", "metadiaria"])
  },
  data() {
    return {
      usuarios: [],
      antigaSenha: "",
      novaSenha: "",
      metaDiaria: "",
      nomeNewUser: "",
      senhaNewUser: "",
      removeUser: "",
      iconeAgua: { height: "70px", width: "70px" }
    };
  },
  created() {
    this.atualizar();
  },
  methods: {
    atualizar() {
      if (this.verificaAdmin()) {
        axios
          .get("usuario/getAllComplete", {
            headers: { Accept: "application/json" }
          })
          .then(res => {
            console.log(res);
            this.usuarios = res.data;
          })
          .catch(error => console.log(error));
      }
    },
    verificaUser() {
      if (this.$store.state.token) {
        return true;
      } else {
        return false;
      }
    },
    verificaAdmin() {
      return this.getAutorizacoes().includes("ROLE_ADMIN");
    },
    verificaMeta() {
      if (this.metadiaria) {
        return this.metadiaria;
      }
      return "Sem meta!";
    },
    logout() {
      this.$store.commit("logout");
    },
    enviarMeta() {
      axios
        .post("usuario/setMetaDiaria", {
          nome: this.usuario,
          metadiaria: this.metaDiaria
        })
        .then(res => {
          console.log(res);
          this.$store.state.metadiaria = this.metaDiaria;
          this.metaDiaria = "";
          this.atualizar();
          this.$alert("Meta inserida com sucesso!", "Sucesso", "success");
        })
        .catch(error => {
          console.log(error);
          alert(JSON.stringify(error));
        });
    },
    trocarSenha() {
      axios
        .post("usuario/changePass", {
          username: this.usuario,
          oldPass: this.antigaSenha,
          newPass: this.novaSenha
        })
        .then(res => {
          console.log(res);
          this.antigaSenha = "";
          this.novaSenha = "";
          this.$alert("Senha alterada com sucesso!", "Sucesso", "success");
        })
        .catch(error => {
          console.log(error);
          this.$confirm(
            "Você não tem permissão para realizar essa ação!",
            "Erro",
            "error"
          );
        });
    },
    adicionarUser() {
      axios
        .post("usuario/addUser", {
          nome: this.nomeNewUser,
          senha: this.senhaNewUser,
          autorizacao: "ROLE_USER"
        })
        .then(res => {
          console.log(res);
          this.nomeNewUser = "";
          this.senhaNewUser = "";
          this.atualizar();
          this.$alert(
            "Usuário " + this.nomeNewUser + " adicionado!",
            "Sucesso",
            "success"
          );
        })
        .catch(error => {
          console.log(error);
          this.$confirm(
            "Você não tem permissão para realizar essa ação!",
            "Erro",
            "error"
          );
        });
    },
    removerUser() {
      this.$confirm("Você tem certeza?", "Remover usuário", "question").then(
        () => {
          axios
            .post("usuario/deleteUser", {
              nome: this.removeUser
            })
            .then(res => {
              console.log(res);
              this.removeUser = "";
              this.atualizar();
              this.$alert(
                "Usuário " + this.removeUser + " removido!",
                "Sucesso",
                "success"
              );
            })
            .catch(error => {
              console.log(error);
              this.$confirm(
                "Você não tem permissão para realizar essa ação!",
                "Erro",
                "error"
              );
            });
        }
      );
    },
    getAutorizacoes() {
      return this.autorizacoes.map(autorizacao => autorizacao.nome);
    }
  }
};
</script>
<style>
</style>
