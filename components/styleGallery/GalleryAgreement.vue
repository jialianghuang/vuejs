<template>
  <div class="gallery-agreement">
    <span class="title">SUPPLEMENTAL AGREEMENT TO CONTENT SUBMISSION AGREEMENT FOR THE STYLE GALLERY CONTEST</span>
    <div class="content">
      <p>
        This Supplemental Agreement is entered by and between Azazie, Inc. (“Company”) and the undersigned (the Company’s customers and/or
        others) (“Undersigned”). The Company and the Undersigned are hereinafter collectively referred to as “Parties” and individually as
        “Party”.
      </p>
      <p>WHEREAS, the Company and the Undersigned have executed the Content Submission Agreement (“Original Agreement”).</p>
      <p>WHEREAS, the Company will hold a Style Gallery Contest (“Contest”) and the Undersigned agrees to participate in the Contest.</p>
      <p>It is agreed as follows:</p>
      <p>1.New clauses 1.1(viii), 1.4, 2.2 and 2.3 shall be added to the Original Agreement as follows:</p>
      <p>Clause 1.1 (viii)</p>
      <p>Submit only one entry per person. Any additional entries will be disqualified.</p>
      <p>Clause 1.4</p>
      <p>The Undersigned may browse and "like" other entries, but may not "like" his/her own.</p>
      <p>Clause 2.2</p>
      <p>
        The Company will hold a Style Gallery Contest and the Undersigned agrees to participate in the Contest by allowing his/her Content
        to be published in the Contest for voting purposes.
      </p>
      <p>The Company will offer a 10% off coupon for next special occasion dress purchase to each participant of the Contest.</p>
      <p>The Contest will be held in three stages:</p>
      <p>Stage 1: March 31st - April 30th (PST) -Shop prom & Upload photos/video of the Undersigned’s prom day look.</p>
      <p>Stage 2: May 1st -May 6th (PST) Who's your pick? Invite the Undersigned’s friends to vote for their favorite looks.</p>
      <p>Stage 3: May 8th (PST)- Winners are selected and awarded their prizes.</p>
      <p>
        During the Contest period, the Undersigned who receives the most “likes” for his/her Content will be awarded as follows (“Award”):
      </p>
      <ul type="i">
        <li>
          <p>TOP LIKED:</p>
          <p>$300 Azazie Credit+ Full Refund On One Prom Dress</p>
          <p>(If more than one prom dresses are involved, the refund will be made for the most expensive one.)</p>
          <p>The Undersigned will receive the reward via Azazie Gift card.</p>
        </li>
        <li>
          <p>2nd-3th LIKED:</p>
          <p>$100 Azazie Credit+ Full Refund On the Undersigned’s Prom Dress.</p>
          <p>The Undersigned will receive the reward via Azazie Gift card.</p>
        </li>
        <li>
          <p>4th-10th LIKED:</p>
          <p>15% Off Coupon+Full Refund On the Undersigned’s Prom Dress.</p>
          <p>*Note: You will receive your reward via Azazie Coupon Code.</p>
        </li>
        <li>
          <p>Gifts For Every Participant:</p>
          <p>10% Off Next Special Occasion Dress Purchase</p>
          <p>*Note: You will receive your reward via Azazie Coupon Code.</p>
        </li>
      </ul>
      <p>Clause 2.3</p>
      <p>The Company will offer the Award to the Undersigned no later than 2 months after the end of the Contest Period.</p>
      <p>
        1. Except as expressly supplemented by this Supplemental Agreement, the provisions of the Original Agreement shall remain in full
        force and effect.
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'GalleryAgreement',
  props: {
    shareList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({})
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.gallery-agreement {
  .title {
    display: block;
    text-align: center;
    font-size: 24px;
    font-family: @font-family-600, sans-serif;
    margin-top: 20px;
  }
  .content {
    text-align: left;
    margin: 0px 30px 25px;
    h3 {
      text-align: left;
      font-weight: bold;
      display: block;
      font-size: 16px;
      margin-top: 30px;
      margin-bottom: 13px;
    }
    p {
      font-size: 13px;
      margin: 1em auto;
    }

    .empty-one-line {
      margin-top: 18px;
    }

    ul {
      margin: 10px 0 10px 25px;
      list-style-type: lower-roman;
      li {
        list-style: lower-roman;
        p {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
