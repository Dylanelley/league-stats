<template>
  <div class="modal" :class="{ 'is-active': this.isActive }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "modal",
  props: ["isActive"]
}
</script>

<style scoped>

</style>