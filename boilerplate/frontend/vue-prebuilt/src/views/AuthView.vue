<script lang="ts">
import React from "react";
import SuperTokensReactComponent from "../components/SuperTokens";
import ReactDOM from "react-dom";

export default {
  mounted: () => {
    ReactDOM.render(
      React.createElement(SuperTokensReactComponent as React.FC),
      document.getElementById("authapp")
    );
  },
};
</script>

<template>
  <div id="authapp" />
</template>
