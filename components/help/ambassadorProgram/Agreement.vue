<template>
  <!-- 校园大使合同弹窗 -->
  <div v-if="showToast" class="ambassdor-toast-popup">
    <div>
      <az-icon @click="toogleShow" icon-class="icon-icon_style_gallery_off" class="icon"></az-icon>
      <div class="content">
        <h4>{{ nl('page_ambassador_agreement_title') }}</h4>
        <p v-html="nl(`page_ambassador_agreement_content_1${country !== 'US' ? `_${country.toLowerCase()}` : ''}`)"></p>
        <p><span>WHEREBY IT IS AGREED</span> as follows:</p>
        <p><span>1. REMUNERATION</span></p>
        <p>
          <i>1.1 </i>If the Company receives the Undersigned’s consent to participate in the ambassador program held by the Company
          (“<span>Program</span>”) on or before a date designated by the Company (“<span>Commencement Date</span>”), the Company shall
          reimburse the Undersigned for its services in the following manners:-
        </p>
        <p v-html="nl(`page_ambassador_agreement_content_2${country !== 'US' ? `_${country.toLowerCase()}` : ''}`)"></p>
        <p v-html="nl(`page_ambassador_agreement_content_3${country !== 'US' ? `_${country.toLowerCase()}` : ''}`)"></p>
        <p><e>(iii)</e>{{ nl(`page_ambassador_agreement_content_4${country !== 'US' ? `_${country.toLowerCase()}` : ''}`) }}</p>
        <p><e>(iv)</e>{{ nl(`page_ambassador_agreement_content_5${country !== 'US' ? `_${country.toLowerCase()}` : ''}`) }}</p>
        <p><e>(v)</e>{{ nl(`page_ambassador_agreement_content_6${country !== 'US' ? `_${country.toLowerCase()}` : ''}`) }}</p>
        <p>
          <i>1.2</i>After a Valid User’s Azazie account has been connected with the Undersigned’s profile for 90 days, the Undersigned will
          no longer earn Commission from the orders of the Valid User. Each of the Valid User’s Azazie account can only be connected with
          one ambassador’s profile.
        </p>
        <p><i>1.3</i>{{ nl(`page_ambassador_agreement_content_7${country !== 'US' ? `_${country.toLowerCase()}` : ''}`) }}</p>
        <p><span>2. TERM</span></p>
        <p>
          <i>2.1 </i>This Agreement will have an initial term of 180 days (“<span>Initial Term</span>”), commencing on the Commencement
          Date.
        </p>
        <p>
          <i>2.2 </i>Following the expiration of the Initial Term or any Renewed Term (as defined below), this Agreement can be renewed at
          the option of the Undersigned for another 180 days (a “<span>Renewed Term</span>”; Initial Term and Renewed Term are collectively
          referred as “<span>Term</span>”), on the same terms and conditions, and be terminable by either Party by giving 7 days’ written
          notice to the other Party.
        </p>
        <p><span>3. LIMITED LICENSE AND USE OF THE COMPANY’S TRADEMARKS(S) AND ASSETS </span></p>
        <p>
          <i>3.1</i>The Company grants the Undersigned a personal, non-exclusive, non-transferable, non-sublicensable, fully-revocable
          license, to use the Company’s logos, trademarks and other similar identifying material including images and other electronic and
          physical assets for the purpose of marketing and promoting the Company, the Company’s brand(s) and the Company’s website in
          accordance with the terms of this Agreement.
        </p>
        <p>
          <i>3.2</i>The Undersigned acknowledges and agrees that this Agreement does not provide the Undersigned with any intellectual
          property rights in the licensed materials other than the limited rights contained herein.
        </p>
        <p><span>4. UNDERSIGNED’S OBLIGATIONS </span></p>
        <p><i>4.1 </i>By participating in the Program, the Undersigned shall:-</p>
        <p>
          <e>(i)</e>at their own expense, provide for the Company marketing and promotional services targeting students, including but not
          limited to publishing promotional content, such as posts, videos on various social medial platforms;
        </p>
        <p><e>(ii)</e>{{ nl(`page_ambassador_agreement_content_8${country !== 'US' ? `_${country.toLowerCase()}` : ''}`) }}</p>
        <p>
          <e>(iii)</e>only be allowed to promote as an ambassador. The Undersigned cannot promote as a third-party and hide his/her
          ambassador identity to gain new customers;
        </p>
        <p>
          <e>(iv)</e>disclose that the Reference Link and/or Reference Code being promoted is the Undersigned’s Reference Link and/or
          Reference Code;
        </p>
        <p>
          <e>(v)</e>not promote his/her own Reference Link and/or Reference Code on any section of the Company’s website or on the Company’s
          social media, including but not limited to TikTok, Facebook, Instagram and Twitter;
        </p>
        <p><e>(vi)</e>not add his/her own Reference Link and/or Reference Code to any coupon sites; and</p>
        <p>
          <e>(vii)</e>not advertise his/her own Reference Link and/or Reference Code under other ambassadors’ posts or content or on their
          social media, including but not limited to TikTok, Facebook, Instagram, and Twitter.
        </p>
        <p>
          <i>4.2 </i>The participation of the Program by the Undersigned shall be subject to the terms and conditions in clause 5 below.
        </p>
        <p><span>5. TERMS AND CONDITIONS</span></p>
        <p><i>5.1</i>The Undersigned shall be at least 18 years old to participate in the Program.</p>
        <p><i>5.2</i>{{ nl(`page_ambassador_agreement_content_9${country !== 'US' ? `_${country.toLowerCase()}` : ''}`) }}</p>
        <p><i>5.3</i>{{ nl(`page_ambassador_agreement_content_10${country !== 'US' ? `_${country.toLowerCase()}` : ''}`) }}</p>
        <p>
          <i>5.4</i>The Undersigned shall be an independent contractor and nothing in this Agreement will be construed as establishing an
          employment, agency or partnership relationship between the Undersigned and the Company or its affiliates.
        </p>
        <p>
          <i>5.5</i>For compliance purposes, the Undersigned shall provide the Company with specific information and/or documents from time
          to time. The Undersigned shall also submit specific information and/or documents if requested by applicable law or regulation. For
          example, if the Commission paid by the Company to the Undersigned (a United States individual) is in the sum of $600 or above, the
          Company has the right to request the Undersigned to submit a duly signed W-9 Form to the Company.
        </p>
        <p>
          <i>5.6</i>The Undersigned voluntarily participate in the Program and is participating in the Program entirely at the Undersigned’s
          own risk. The Undersigned is aware of the risks associated with participating in the Program (“<span>Risks</span>”), which may
          include, but not limited to physical or psychological injury, pain, illness, economic and emotional loss and/or death caused to
          the Undersigned and/or others. The Undersigned assume all Risks, both known or unknown to the Undersigned, of the participation in
          the Program.
        </p>
        <p>
          <i>5.7</i>The Undersigned is recommended to maintain in force adequate liability insurance to protect anyone from claims of
          personal injury (or death) or tangible or intangible property damage.
        </p>
        <p>
          <i>5.8</i>The Undersigned warrants that the participation in the Program will not infringe, misappropriate, or violate any
          applicable laws and regulations, including but not limited to the copyright, privacy right and/or other rights of any third party.
        </p>
        <p>
          <i>5.9</i>The Undersigned will display the best representation of the Company by providing positive, professional feedback and
          marketing materials, free of inappropriate language or offensive material in regards to, age, sexual orientation, disability,
          nationality, religion, gender, race or any form of discrimination.
        </p>
        <p>
          <i>5.10</i>At the request of the Company and the expenses of the same, after the Commencement Date, the Undersigned will assist
          and cooperate with the Company in all respects to obtain any third party’s authorization and confirmation for the purposes of
          performing this Agreement and will execute documents, and, give testimony and take such further acts reasonably requested by the
          Company to enable the Company to acquire, transfer, maintain, perfect, enforce, and utilize its rights (including intellectual
          property rights) and take other legal protections for the Program, worldwide and for the full term/duration of those rights.
        </p>
        <p>
          <i>5.11</i>The Undersigned will defend, indemnify and hold the Company harmless from and against all claims, damages, liabilities,
          losses, expenses and costs (including reasonable fees and expenses of attorneys and other professions) arising out of any action
          by a third party against the Company that is based on or resulted from the Undersigned’ participation in the Program.
        </p>
        <p><span>6. TERMINATION</span></p>
        <p>
          <i>6.1</i>In the event the Undersigned is in breach of any provision in this Agreement, the Company reserves the right to
          terminate (i) this Agreement and (ii) the Undersigned’s status as the Company’s ambassador immediately.
        </p>
        <p>
          <i>6.2</i>Without breach of any provision in this Agreement by the other Party, each Party may terminate this Agreement by giving
          7 days’ written notice to the other Party.
        </p>
        <p>
          <i>6.3</i>Without breach of any provision in this Agreement by the Undersigned, the termination of this Agreement by any of the
          Parties will not affect the payment of the Commission Unpaid to the Undersigned and the manners of remuneration referred to in
          clause above.
        </p>
        <p><i>6.4</i>If the Company terminates this Agreement due to any breach of this Agreement by the Undersigned, the Company may:-</p>
        <p><e>(i)</e>withhold the Commission to be paid to the Undersigned; and/or</p>
        <p><e>(ii)</e>seek such other relief, equitable and legal, as may be available.</p>
        <p>
          <e></e> The Undersigned understands that this Agreement and the Program may be changed or terminated at any time without notice.
          Changes may include, but not limited to, modifying the Commission Percentage, imposing additional restrictions, or terminating the
          Program.
        </p>
        <p><span>7. CONFIDENTIALITY</span></p>
        <p>
          <i>7.1</i>Except for the purposes of complying with this Agreement, the Undersigned shall not, directly or indirectly, disclose to
          any person or entity any information in relation to (i) this Agreement and (ii) the documents relevant to this Agreement.
        </p>
        <p><span>8. COLLECTION OF PERSONAL INFORMATION</span></p>
        <p>
          <i>8.1</i>The Company collects copy of the Undersigned’s identity document and/or social security number and use it for the
          purposes of complying with applicable laws and performing this Agreement ONLY, such as verifying (i) the identity and (ii) the age
          of the Undersigned. This is to ensure that the personal information of the Undersigned as stated in this Agreement is in order.
          The Company WILL NOT use or disclose the Undersigned’s identity document for any purpose unrelated to the compliance of applicable
          laws and the performance of this Agreement.
        </p>
        <p><span>9. DISCLAIMER </span></p>
        <p>
          <i>9.1</i>The Company makes no express or implied warranties or representations with respect to the Program or the Undersigned’s
          potential to earn income from the Program.
        </p>
        <p>
          <i>9.2</i>The Company makes no representation that the operation of the Company’s website will be uninterrupted or error-free, and
          the Company will not be liable for its website downtime.
        </p>
        <p><span>10. GOVERNING LAW </span></p>
        <p><i>10.1</i>This Agreement shall be governed by, and construed in accordance with, the laws of the State of California.</p>
        <p><span>11. JURISDICTION</span></p>
        <p>
          <i>11.1</i>Each of the Parties irrevocably agrees that the Courts of California County of Santa Clara shall have exclusive
          jurisdiction to hear and decide any disputes and/or proceedings in connection with this Agreement and for these purposes, each of
          the parties irrevocably submits to the jurisdiction of the Courts of California County of Santa Clara.
        </p>
      </div>
      <div class="bottom-btn"><az-button @click="toogleShow" class="btn btn-theme">OK</az-button></div>
    </div>
  </div>
</template>
<script>
import AzButton from '@/components/az-ui/Button/AzButton'
export default {
  components: {
    AzButton
  },
  data() {
    return {
      showToast: false
    }
  },
  methods: {
    toogleShow() {
      this.showToast = !this.showToast
      this.$emit('toogleShowToast', this.showToast)
      if (this.showToast && !document.body.classList.contains('body-overflow-hidden')) {
        document.body.classList.add('body-overflow-hidden')
      } else if (!this.showToast) {
        document.body.classList.remove('body-overflow-hidden')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.ambassdor-toast-popup {
  position: fixed;
  z-index: @popuy-z-index;
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  & > div {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 745px;
    padding: 40px 20px 20px 40px;
    background: #fff;
    .content {
      height: 80vh;
      overflow-y: auto;
      text-align: left;
      color: var(--color-121212);
      padding-right: 20px;
      &::-webkit-scrollbar-track-piece {
        background: #f1f1f1;
      }

      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 4px;
      }
      h4 {
        font-family: @font-family-600;
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 25px;
        text-align: center;
      }
      p {
        line-height: 17px;
        font-family: @font-family-500;
        font-size: 13px;
        margin-bottom: 20px;
        display: table;
        /deep/ i {
          padding-right: 20px;
          font-style: normal;
          display: table-cell;
        }
        /deep/ e {
          display: table-cell;
          padding-left: 30px;
          padding-right: 20px;
        }
        /deep/ span {
          font-family: @font-family-600;
          font-size: 14px;
          line-height: 19px;
        }
      }
    }
    .icon {
      position: absolute;
      right: 15px;
      top: 15px;
      width: 15px;
      height: 15px;
      fill: var(--color-121212);
      cursor: pointer;
    }
    /deep/ a {
      color: @theme;
    }
  }
  .bottom-btn {
    margin-top: 20px;
    margin-left: -38px;
    width: calc(100% + 56px);
    box-shadow: 0 -3px 4px 1px #eee;
    padding-top: 20px;
  }
  .btn {
    display: block;
    margin: auto;
    width: 320px;
    height: 40px;
    font-weight: 600;
  }
}
</style>
