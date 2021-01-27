<template>
  <div class="">
    <input-form></input-form>
    <spinner :progress="progress"></spinner>
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
  },
  data() {
    return {
      progress: 15
    }
  }
}
</script>

<style scoped>

</style>