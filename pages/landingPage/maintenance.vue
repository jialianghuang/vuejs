<template>
  <div id="maintenance">
    <div class="maintenance-content">
      <img src="~assets/images/common/azazie_logo.svg" alt="" />
      <div class="text-box">
        <p class="text-item en">
          We're currently undergoing scheduled maintenance. The site will be back up shortly and we apologize for any inconvenience.Please
          try again later.
        </p>
        <p class="text-item es">
          Estamos realizando tareas de mantenimiento. El sitio volverá a funcionar en breve y le pedimos disculpas por las molestias.
        </p>
        <p class="text-item fr">
          Nous procédons actuellement à une maintenance programmée. Le site sera rétabli sous peu et nous vous prions de nous excuser pour
          la gêne occasionnée. Veuillez réessayer plus tard.
        </p>
        <p class="text-item it">
          È in corso una manutenzione programmata. Il sito sarà di nuovo attivo a breve e ci scusiamo per gli eventuali disagi.
        </p>
        <p class="text-item de">
          Wir führen derzeit planmäßige Wartungsarbeiten durch. Die Website wird in Kürze wieder verfügbar sein, und wir entschuldigen uns
          für etwaige Unannehmlichkeiten. Bitte versuchen Sie es später erneut.
        </p>
        <p class="text-item ni be">
          Wij voeren momenteel gepland onderhoud uit. De website zal binnenkort weer beschikbaar zijn, en we verontschuldigen ons voor
          eventueel ongemak. Probeer het later opnieuw.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Maintenance'
}
</script>
<style lang="less" scoped>
#maintenance {
  width: 100%;
  height: 100vh;
  background-image: url('https://cdn-1.azazie.com/upimg/userfiles/images/1/52/d9/a38c7051f284b2b1911106c0f60552d9.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  .maintenance-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px 60px;
    background-color: #fff;
    width: 1000px;
    height: 500px;
    text-align: center;
    box-sizing: border-box;
    opacity: 0.95;
    img {
      width: 240px;
      vertical-align: middle;
      margin-bottom: 40px;
    }
    .text-item {
      max-width: 750px;
      &:not(:last-child) {
        margin-bottom: 18px;
      }
    }
  }
}
</style>
