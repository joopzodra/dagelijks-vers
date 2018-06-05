<template>
  <div class="spinner-container">
    <div class="spinner"></div>
  </div>
</template>

<script>
/*
 * The Spinner component is a fully css component.
 */
export default {

}
</script>

<style scoped>
.spinner-container {
  width: 100%;
}

.spinner{
  display:flex;
  margin: 16px 0;
  justify-content: center;
}

@keyframes spin{
  100%{
    transform:rotatez(360deg);
  }
}
.spinner::before{
  content:"";
  height:40px;
  width:40px;
  border-radius:50%;
  border:4px solid blue;
  border-color:rgba(0, 128, 0, 0.2) rgba(0, 128, 0, 0.85) rgba(0, 128, 0, 0.2) rgba(0, 128, 0, 0.85) ;
  animation:spin 1s infinite cubic-bezier(0.245, -0.295, 0.740, 1.315);
}
</style>