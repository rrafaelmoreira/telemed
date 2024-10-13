<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/auth">Login/Register</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
nav {
  padding: 10px;
}
nav a {
  margin: 0 10px;
}
</style>