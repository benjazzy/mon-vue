<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <div class="text-h4">
          Mon Vue
        </div>
      </div>
    </v-app-bar>

    <v-main class="fill-height">
      <ClientList class="fill-height"/>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import ClientList from "@/components/ClientList";

export default {
  name: 'App',

  components: {
    ClientList,
  },

  data: () => ({
    //
  }),
};
</script>
