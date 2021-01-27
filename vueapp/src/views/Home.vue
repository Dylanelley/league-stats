<template>
  <div class="">
    <input-form></input-form>
    <spinner></spinner>
  </div>
</template>

<script>
import InputForm from "@/components/InputForm";
import Spinner from "@/components/Spinner";

export default {
  name: "Home",
  components: {
    "input-form": InputForm,
    "spinner": Spinner
  }
}
</script>

<style scoped>

</style>