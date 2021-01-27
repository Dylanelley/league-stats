<template>
  <div>
    <div class="modal" :class="{ 'is-active': this.isActive }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <progress class="progress is-primary" :value="progress" max="100"></progress>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="toggleIsActive"></button>
    </div>

    <button @click="toggleIsActive">test</button>
  </div>
</template>
<script>
export default {
  name: "Spinner",
  props: ["progress"],
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    toggleIsActive() {
      this.isActive = !this.isActive;
    }
  }

}
</script>

<style scoped>

</style>