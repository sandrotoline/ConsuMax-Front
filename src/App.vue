<template>
  <div id="app" class="container">
    <user-bar/>
    <b-nav id="nav" class="row text-center" align="center">
      <b-nav-item active>
        <router-link to="/">Home</router-link>
      </b-nav-item>
      <b-nav-item active v-if="this.token">
        <p>Logado</p>
      </b-nav-item>
      <b-nav-item active v-else>
        <router-link to="/login">Login</router-link>
      </b-nav-item>
      <b-nav-item active>
        <router-link to="/drink-water">ConsuMax</router-link>
      </b-nav-item>
      <b-nav-item active>
        <router-link to="/usuario">Profile</router-link>
      </b-nav-item>
    </b-nav>
    <router-view/>
  </div>
</template>
<script>
import UserBar from "./components/UserBar.vue";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["token", "autorizacoes"])
  },
  data() {
    return {
      menuUser: null
    };
  },

  created() {
    this.menuUser = this.verificaUser();
  },
  components: {
    "user-bar": UserBar
  },
  methods: {
    verificaUser() {
      if (this.$store.state.token) {
        return true;
      } else {
        return false;
      }
    },
    logout() {
      this.$store.commit("logout");
    },
    getAutorizacoes() {
      return this.autorizacoes.map(autorizacao => autorizacao.nome).join();
    }
  }
};
</script>
