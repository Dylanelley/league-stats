<template>
  <div class="">
    <section class="section">
      <div class="container">
        <input-form></input-form>
        <modal :is-active="modal.isActive">
          <progress class="progress is-primary" :value="modal.progress.value" :max="modal.progress.max"></progress>
        </modal>
        <button @click="toggleModalIsActive">display progress modal</button>
      </div>
    </section>
  </div>
</template>

<script>
import InputForm from "@/components/InputForm";
import Modal from "@/components/partials/Modal";

export default {
  name: "Home",
  components: {
    "input-form": InputForm,
    "modal": Modal
  },
  data() {
    return {
      modal: {
        isActive: false,
        progress: {
          value: undefined,
          max: 100
        }
      }
    }
  },
  methods: {
    toggleModalIsActive() {
      this.modal.isActive = !this.modal.isActive;
    }
  }
}
</script>

<style scoped>

</style>