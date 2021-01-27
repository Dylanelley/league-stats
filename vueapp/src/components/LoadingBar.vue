<template>
    <svg class="loading-bar" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="150px" height="150px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#2c3e50" stroke="none">
            <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform>
        </path>
        <text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle" font-size="10px" fill="#000000" fill-opacity="50%">{{percent}}%</text>
    </svg>
</template>
<script>
export default {
    name: "LoadingBar",
    props: ["percent"]
    
}
</script>

<style scoped>

</style>