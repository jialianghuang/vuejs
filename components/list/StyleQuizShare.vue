<template>
  <div class="style_quiz_share">
    <a
      id="style_quiz_facebook"
      :href="
        'http://www.facebook.com/sharer/sharer.php?u=' +
          share['url'] +
          share['symbol'] +
          'utm_source=facebook&utm_medium=style_quiz_link&utm_campaign=share'
      "
      @click="shareClick($event)"
      target="_blank"
      class="facebook_share share"
    ></a>
    <a
      id="style_quiz_pinterest"
      :href="
        'http://pinterest.com/pin/create/button/?description=' +
          share['title'] +
          '%23Bridesmaid %23Wedding %23CustomDresses %23AZAZIE&media=' +
          share['img'] +
          '&is_video=false&url=' +
          share['url'] +
          share['symbol'] +
          'utm_source=pinterest&utm_medium=style_quiz_link&utm_campaign=share'
      "
      @click="shareClick($event)"
      target="_blank"
      class="pinterest_share share"
    ></a>
    <a
      id="style_quiz_twitter"
      :href="
        'http://twitter.com/share?text=' +
          share['title'] +
          '&via=iheartazazie&url=' +
          share['url'] +
          share['symbol'] +
          'utm_source=twitter&utm_medium=style_quiz_link&utm_campaign=share'
      "
      @click="shareClick($event)"
      target="_blank"
      class="twitter_share share"
    ></a>
    <a
      id="style_quiz_mail"
      :href="
        'mailto:?subject=' +
          share['text'] +
          '&body=' +
          share['url'] +
          share['symbol'] +
          'utm_source=email&utm_medium=style_quiz_link&utm_campaign=share'
      "
      @click="shareClick($event)"
      class="mail_share share"
    ></a>
    <a
      id="style_quiz_googleplus"
      :href="
        'https://plus.google.com/share?hl=en&url=' +
          share['url'] +
          share['symbol'] +
          'utm_source=googleplus&utm_medium=style_quiz_link&utm_campaign=share'
      "
      @click="shareClick($event)"
      target="_blank"
      class="googleplus_share share"
    ></a>
  </div>
</template>

<script>
export default {
  name: 'StyleQuizShare',
  data() {
    return {
      share: {
        url: encodeURIComponent('https://www.azazie.com' + this.$route.fullPath),
        symbol: this.$route.fullPath.includes('?') ? '&' : '?',
        title: encodeURIComponent('I just took the Azazie Style Quiz! Take the quiz to find your dream dress.'),
        text: 'I just took the Azazie Style Quiz! Take the quiz to find your dream dress.',
        img: encodeURIComponent(this.HTTPS_HOST + '/themes/mazazie/images/style_quiz/pinterest_share.gif'),
        dialog_height: 320,
        dialog_width: 700
      }
    }
  },
  methods: {
    shareClick(e) {
      if (e.target.className.includes('mail_share')) {
        window.location.href = e.target.href
        return false
      }
      window.open(
        e.target.href,
        '_blank',
        'height=' + e.target.className.includes('googleplus_share')
          ? '600'
          : this.share.dialog_height + ',width=' + e.target.className.includes('googleplus_share')
          ? '600'
          : this.share.dialog_width + ',top=' + window.outerHeight / 3 + ',left=' + window.outerWidth / 3
      )
      e.preventDefault()
    }
  }
}
</script>

<style lang="less" scoped>
.style_quiz_share {
  position: fixed;
  right: 35px;
  z-index: @popuy-z-index;
  .facebook_share {
    background-image: url('~assets/images/style_quiz/facebook.png');
  }
  .pinterest_share {
    background-image: url('~assets/images/style_quiz/pinterest.png');
  }
  .twitter_share {
    background-image: url('~assets/images/style_quiz/twitter.png');
  }
  .mail_share {
    background-image: url('~assets/images/style_quiz/mail.png');
  }
  .googleplus_share {
    background-image: url('~assets/images/style_quiz/googleplus.png');
  }
  .share {
    width: 36px;
    height: 36px;
    background-size: cover;
    margin-bottom: 6px;
    display: block;
  }
}
</style>
