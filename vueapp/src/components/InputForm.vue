<template>
  <div class="field is-horizontal is-expanded">
    <div class="field-body">
      <div class="field">
        <p class="control is-expanded has-icons-left">
          <input class="input" type="text" placeholder="Summoner">
          <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
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
            <i class="fas fa-sort-amount-up-alt"></i>
          </span>
        </p>
      </div>
      <div class="control">
        <button class="button is-primary">Search</button>
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