<template>
  <form @submit.prevent="auth">
    <h2>Login</h2>
    <div class="form-group">
      <label for="username">Usuário</label>
      <input
        type="text"
        id="username"
        class="form-control"
        required
        autofocus
        v-model="username"
      />
    </div>
    <div class="form-group">
      <label for="inputPassword">Senha</label>
      <input
        type="password"
        id="inputPassword"
        class="form-control"
        required
        v-model="password"
      />
    </div>
    <button class="btn btn-lg btn-success btn-block" type="submit">Entrar</button>
  </form>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['login']),
    auth () {
      this.login({ usuario: this.username, senha: this.password })
    }
  }
}
</script>
