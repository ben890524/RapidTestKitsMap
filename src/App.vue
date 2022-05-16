<template>
  <router-view></router-view>
</template>
<script setup lang="ts"></script>

<style>
@import "@/assets/css/root.css";
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  min-height: 100vh; /* fall-back */
  min-height: -moz-available;
  min-height: -webkit-fill-available;
  min-height: fill-available;
  background-color: var(--app-main-color);
}
#app {
  padding: 0;
  margin: 0;
  width: 100%;
  height: fill-available;
  height: -webkit-fill-available;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: var(--app-main-color);
}
</style>
<!-- https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv -->
