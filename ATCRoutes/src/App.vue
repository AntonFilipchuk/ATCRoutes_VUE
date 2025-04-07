<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  top: 0;
  z-index: 100;
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  text-decoration: none;
  color: #000000;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

nav a:hover {
  color: #007bff;
  background-color: rgba(66, 110, 185, 0.1);
}

nav a.router-link-active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

nav a.router-link-exact-active {
  font-weight: 600;
}
</style>
