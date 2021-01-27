<template>
  <div class="field is-horizontal is-expanded">
    <div class="field-body">
      <div class="field">
        <p class="control">
          <input class="input" type="text" placeholder="Summoner">
        </p>
      </div>
      <div class="field is-narrow">
        <p class="control has-icons-left">
          <span class="select">
            <select>
              <option selected>Region</option>
              <option>Select dropdown</option>
              <option>With options</option>
            </select>
          </span>
          <span class="icon is-small is-left">
            <i class="fas fa-globe"></i>
          </span>
        </p>
      </div>
      <div class="field is-narrow">
        <p class="control has-icons-left">
          <span class="select">
            <select>
              <option selected>Size</option>
              <option>Select dropdown</option>
              <option>With options</option>
            </select>
          </span>
          <span class="icon is-small is-left">
            <i class="fas fa-globe"></i>
          </span>
        </p>
      </div>
      <div class="control">
        <button class="button is-primary">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
    name: "InputForm"
}
</script>

<style scoped>

</style>