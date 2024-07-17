<template>
  <div ref="addressForm" class="address-form">
    <!-- <p v-if="currentCountry === 'DE' && hasOldAddress" class="doorplate-tip">{{ nl('page_checkout_address_doorplate_empty_tip') }}</p> -->
    <div class="select-item-country">
      {{ nl('page_address_country') }} <img :src="countryOption.headItemImageUrl" class="icon-country" alt="country" />
      {{ countryOption.label }}
      <div v-if="editOrderAddressOrderSn" class="cannot-change">
        <div class="notification">
          <div class="tri_rig1"></div>
          <div class="tri_rig2"></div>
          <div class="a-country">
            <p class="text">
              {{ nl('page_address_another_country') }}
              <a :href="countryUrl(`/order/ticket?order_sn=${editOrderAddressOrderSn}&type=editAddress`)" class="contact">{{
                nl('page_address_contact')
              }}</a
              ><span>.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <form method="post">
      <div class="pay-address-form">
        <ul>
          <li v-if="scene !== 'alteration'">
            <div class="col2">
              <div :class="{ 'error-border': rulesResult.firstName }" class="input-wrap">
                <input
                  v-model="addressForm.firstName"
                  :placeholder="nl('page_placeholder_first_name')"
                  @focus="resetInput('firstName')"
                  @blur="onBlur('firstName')"
                  type="text"
                  name="firstName"
                  maxlength="32"
                />
                <az-icon v-if="rulesPassResult.firstName" icon-class="icon-right" class="icon-right" />
              </div>
              <p class="error-tip">{{ rulesResult.firstName }}</p>
            </div>
            <div class="col2">
              <div :class="{ 'error-border': rulesResult.lastName }" class="input-wrap">
                <input
                  v-model="addressForm.lastName"
                  :placeholder="nl('page_placeholder_last_name')"
                  @focus="resetInput('lastName')"
                  @blur="onBlur('lastName')"
                  type="text"
                  name="lastName"
                  maxlength="32"
                />
                <az-icon v-if="rulesPassResult.lastName" icon-class="icon-right" class="icon-right" />
              </div>
              <p class="error-tip">{{ rulesResult.lastName }}</p>
            </div>
          </li>
          <li>
            <div>
              <div :class="{ 'error-border': rulesResult.address }" class="input-wrap">
                <input
                  v-model="addressForm.address"
                  :placeholder="nl('page_placeholder_add_line_one')"
                  @focus="resetInput('address')"
                  @blur="onBlur('address')"
                  :maxlength="currentCountry == 'FR' ? 50 : 35"
                  type="text"
                  name="address"
                />
                <az-icon v-if="rulesPassResult.address" icon-class="icon-right" class="icon-right" />
              </div>
              <p class="error-tip">{{ rulesResult.address }}</p>
            </div>
            <!-- <div v-if="source != 'billing'" class="addr-tip">
              <span class="addr-tip-star">*</span>
              <span class="addr-tip-text">{{ nl('page_write_review_tip') }}:&nbsp;{{ nl('page_js_no_PO') }}</span>
            </div> -->
          </li>
          <li v-if="currentCountry === 'DE'">
            <div>
              <div :class="{ 'error-border': rulesResult.doorplate }" class="input-wrap">
                <input
                  v-model="addressForm.doorplate"
                  :placeholder="nl('page_placeholder_add_doorplate')"
                  @focus="resetInput('doorplate')"
                  @blur="onBlur('doorplate')"
                  :maxlength="5"
                  type="text"
                  name="doorplate"
                />
                <az-icon v-if="rulesPassResult.doorplate" icon-class="icon-right" class="icon-right" />
              </div>
              <p class="error-tip">{{ rulesResult.doorplate }}</p>
              <!-- <p class="doorplate-tip">{{ nl('page_placeholder_doorplate_tip') }}</p> -->
            </div>
          </li>
          <li>
            <div>
              <div :class="{ 'error-border': rulesResult.signBuilding }" class="input-wrap">
                <input
                  v-model="addressForm.signBuilding"
                  :placeholder="nl('page_placeholder_add_two_opt')"
                  @focus="resetInput('signBuilding')"
                  @blur="onBlur('signBuilding')"
                  type="text"
                  name="signBuilding"
                  maxlength="32"
                />
                <az-icon v-if="rulesPassResult.signBuilding" icon-class="icon-right" class="icon-right" />
              </div>

              <p class="error-tip">{{ rulesResult.signBuilding }}</p>
            </div>
          </li>
          <li>
            <!-- UK 没有省 -->
            <div v-if="currentCountry == 'GB'" class="col2">
              <template v-if="ffCtRegionList && ffCtRegionList.length">
                <az-select
                  :class="{ 'error-border': rulesResult.cityText || verifyErrorCode == 4 }"
                  :options="ffCtRegionList"
                  :defaultValue="(addressForm.city && addressForm.city + '') || ''"
                  :placeholder="cityPlaceholder"
                  :showOption="showCityOption"
                  :width="currentCountry === 'MX' ? 176 : 367"
                  :inputAble="true"
                  @on-change="handleCityChange"
                  @on-reset="handleResetOption"
                  @on-close="handleClosePop"
                  name="showCityOption"
                ></az-select>
              </template>
              <div v-else :class="{ 'error-border': rulesResult.cityText || verifyErrorCode == 4 }" class="input-wrap">
                <input
                  v-model="addressForm.cityText"
                  @focus="resetInput('cityText')"
                  :placeholder="cityPlaceholder"
                  type="text"
                  name="cityText"
                  maxlength="30"
                />
              </div>
              <p class="error-tip">{{ rulesResult.cityText }}</p>
            </div>
            <div v-else class="col2">
              <template v-if="ffPRegionList && ffPRegionList.length">
                <az-select
                  :class="{ 'error-border': rulesResult.province || verifyErrorCode == 4, unselected: addressForm.province == '' }"
                  :options="ffPRegionList"
                  :defaultValue="(ffPRegionList.length && addressForm.province && addressForm.province + '') || ''"
                  :placeholder="nl('page_common_state_province_region')"
                  :showOption="showStateOption"
                  :width="367"
                  :zIndex="2"
                  :inputAble="true"
                  @on-change="handleProvinceChange"
                  @on-reset="handleResetOption"
                  @on-close="handleClosePop"
                  name="showStateOption"
                ></az-select>
                <p class="error-tip">{{ rulesResult.province }}</p>
              </template>
              <div v-else>
                <input
                  v-model="addressForm.provinceText"
                  :placeholder="nl('page_common_state_province_region')"
                  @focus="resetInput('province')"
                  @blur="onBlur('province')"
                  :class="{ 'error-border': rulesResult.province || verifyErrorCode == 4, unselected: addressForm.province == '' }"
                  type="text"
                  name="provinceText"
                  maxlength="30"
                />
                <p class="error-tip">{{ rulesResult.province }}</p>
              </div>
            </div>
            <!-- AU没有市 UK市在上一级 -->
            <div v-if="!['AU', 'GB', 'NL'].includes(currentCountry)" class="col2">
              <template v-if="ffCtRegionList && ffCtRegionList.length">
                <az-select
                  :class="{ 'error-border': rulesResult.cityText || verifyErrorCode == 4 }"
                  :options="ffCtRegionList"
                  :defaultValue="(addressForm.city && addressForm.city + '') || ''"
                  :placeholder="nl('page_placeholder_city')"
                  :showOption="showCityOption"
                  :width="367"
                  :inputAble="true"
                  @on-change="handleCityChange"
                  @on-reset="handleResetOption"
                  @on-close="handleClosePop"
                  name="showCityOption"
                ></az-select>
              </template>
              <div v-else :class="{ 'error-border': rulesResult.cityText || verifyErrorCode == 4 }" class="input-wrap">
                <input
                  v-model="addressForm.cityText"
                  @focus="resetInput('cityText')"
                  @blur="onBlur('cityText')"
                  :placeholder="nl('page_placeholder_city')"
                  type="text"
                  name="cityText"
                  maxlength="30"
                />
                <az-icon v-if="isOldReCountry && rulesPassResult.cityText" icon-class="icon-right" class="icon-right" />
              </div>
              <p class="error-tip">{{ rulesResult.cityText }}</p>
            </div>
            <div v-if="hasDistrictCountry && !['MX', 'ES'].includes(currentCountry)" class="col2">
              <template v-if="districtList && districtList.length">
                <az-select
                  :class="{ 'error-border': rulesResult.districtText || verifyErrorCode == 4 }"
                  :options="districtList"
                  :defaultValue="(addressForm.district && addressForm.district + '') || ''"
                  :placeholder="districtPlaceholder"
                  :showOption="showDistrictOption"
                  :width="367"
                  :inputAble="true"
                  @on-change="handleDistrictChange"
                  @on-reset="handleResetOption"
                  @on-close="handleClosePop"
                  name="showDistrictOption"
                ></az-select>
              </template>
              <div v-else :class="{ 'error-border': rulesResult.districtText || verifyErrorCode == 4 }" class="input-wrap">
                <input
                  v-model="addressForm.districtText"
                  @focus="resetInput('districtText')"
                  @blur="onBlur('districtText')"
                  :placeholder="districtPlaceholder"
                  type="text"
                  name="districtText"
                  maxlength="30"
                />
              </div>
              <p class="error-tip">{{ rulesResult.districtText }}</p>
            </div>
          </li>
          <!-- mx 'ES'布局和其他国家不一样 -->
          <template v-if="['MX', 'ES'].includes(currentCountry)">
            <li>
              <div class="col2">
                <template v-if="districtList && districtList.length">
                  <az-select
                    :class="{ 'error-border': rulesResult.districtText || verifyErrorCode == 4 }"
                    :options="districtList"
                    :defaultValue="(addressForm.district && addressForm.district + '') || ''"
                    :placeholder="districtPlaceholder"
                    :showOption="showDistrictOption"
                    :width="367"
                    :inputAble="true"
                    @on-change="handleDistrictChange"
                    @on-reset="handleResetOption"
                    @on-close="handleClosePop"
                    name="showDistrictOption"
                  ></az-select>
                </template>
                <div v-else :class="{ 'error-border': rulesResult.districtText || verifyErrorCode == 4 }" class="input-wrap">
                  <input
                    v-model="addressForm.districtText"
                    @focus="resetInput('districtText')"
                    @blur="onBlur('districtText')"
                    :placeholder="districtPlaceholder"
                    type="text"
                    name="districtText"
                    maxlength="30"
                  />
                </div>
                <p class="error-tip">{{ rulesResult.districtText }}</p>
              </div>
              <div class="col2">
                <template v-if="zipCodeList && zipCodeList.length && zipCodeList.length > 1">
                  <az-select
                    :class="{ 'error-border': rulesResult.zipcode }"
                    :options="zipCodeList"
                    :defaultValue="(addressForm.zipcode && addressForm.zipcode + '') || ''"
                    :placeholder="nl('page_common_zip_post_code')"
                    :showOption="showZipCodeOption"
                    :width="367"
                    :inputAble="false"
                    @on-change="handleZipCodeChange"
                    @on-reset="handleResetOption"
                    @on-close="handleClosePop"
                    name="showZipCodeOption"
                  ></az-select>
                </template>
                <div v-else :class="{ 'error-border': rulesResult.zipcode }" class="input-wrap">
                  <input
                    v-model="addressForm.zipcode"
                    @focus="resetInput('zipcode')"
                    @blur="onBlur('zipcode')"
                    :placeholder="nl('page_common_zip_post_code')"
                    type="text"
                    name="zipcode"
                    maxlength="10"
                  />
                  <az-icon v-if="rulesPassResult.zipcode" icon-class="icon-right" class="icon-right" />
                </div>
                <p v-if="rulesResult.zipcode || verifyErrorCode == 4" :class="{ 'no-valid': !isValidZipCode }" class="error-tip">
                  {{ rulesResult.zipcode }}
                </p>
              </div>
            </li>
            <li v-if="scene !== 'alteration'">
              <div>
                <div :class="{ 'error-border': rulesResult.tel }" class="input-wrap">
                  <span>
                    {{ currentCountry }}
                    <em>{{ countryTelPre }}</em>
                  </span>
                  <input
                    v-model="addressForm.tel"
                    @focus="resetInput('tel')"
                    @blur="onBlur('tel')"
                    @input="telChange"
                    :placeholder="nl('page_common_phone_number')"
                    :maxlength="['US', 'CA'].includes(currentCountry) ? 10 : 60"
                    type="tel"
                    name="tel"
                  />
                  <az-icon v-if="rulesPassResult.tel" icon-class="icon-right" class="icon-right" />
                </div>
                <p class="error-tip">{{ rulesResult.tel }}</p>
              </div>
            </li>
          </template>
          <li v-else>
            <div class="col2">
              <template v-if="zipCodeList && zipCodeList.length && zipCodeList.length > 1">
                <az-select
                  :class="{ 'error-border': rulesResult.zipcode }"
                  :options="zipCodeList"
                  :defaultValue="(addressForm.zipcode && addressForm.zipcode + '') || ''"
                  :placeholder="nl(currentCountry === 'IE' ? 'page_common_zip_post_code_ie' : 'page_common_zip_post_code')"
                  :showOption="showZipCodeOption"
                  :width="367"
                  :inputAble="false"
                  @on-change="handleZipCodeChange"
                  @on-reset="handleResetOption"
                  @on-close="handleClosePop"
                  name="showZipCodeOption"
                ></az-select>
              </template>
              <div v-else :class="{ 'error-border': rulesResult.zipcode }" class="input-wrap">
                <input
                  v-model="addressForm.zipcode"
                  @focus="resetInput('zipcode')"
                  @blur="onBlur('zipcode')"
                  :placeholder="nl(currentCountry === 'IE' ? 'page_common_zip_post_code_ie' : 'page_common_zip_post_code')"
                  type="text"
                  name="zipcode"
                  maxlength="10"
                />
                <az-icon v-if="rulesPassResult.zipcode" icon-class="icon-right" class="icon-right" />
              </div>
              <p v-if="rulesResult.zipcode || verifyErrorCode == 4" :class="{ 'no-valid': !isValidZipCode }" class="error-tip">
                {{ rulesResult.zipcode }}
              </p>
            </div>
            <div v-if="scene !== 'alteration'" class="col2">
              <div :class="{ 'error-border': rulesResult.tel }" class="input-wrap">
                <span>
                  {{ currentCountry }}
                  <em>{{ countryTelPre }}</em>
                </span>
                <input
                  v-model="addressForm.tel"
                  @focus="resetInput('tel')"
                  @blur="onBlur('tel')"
                  @input="telChange"
                  :placeholder="nl('page_common_phone_number')"
                  :maxlength="['US', 'CA'].includes(currentCountry) ? 10 : 60"
                  type="tel"
                  name="tel"
                />
                <az-icon v-if="rulesPassResult.tel" icon-class="icon-right" class="icon-right" />
              </div>
              <p class="error-tip">{{ rulesResult.tel }}</p>
            </div>
          </li>
        </ul>
        <p v-if="verifyErrorMsg" class="error-tip">{{ verifyErrorMsg }}</p>

        <template v-if="verifyErrorCode == 3">
          <az-button
            v-if="verifyType != 'continue'"
            :loading="loading"
            :disabled="loading"
            :needIcon="false"
            @click="handleSaveAddress($event, 'verify')"
            class="btn btn-default btn-verify need_datalayer"
            data-datalayer-category="NewStructureCheckout"
            data-datalayer-label="NewStructureCheckout_Address_Error5_Button1_View"
          >
            <span v-html="loading ? `${nl('page_order_progress_processing')}...` : 'Verify'"></span>
          </az-button>
          <az-button
            id="btn_address_save"
            v-if="verifyType != 'verify'"
            :loading="loading"
            :disabled="loading"
            :needIcon="false"
            @click="handleSaveAddress($event, 'continue')"
            class="btn btn-default btn-save need_datalayer"
            data-datalayer-category="NewStructureCheckout"
            data-datalayer-label="NewStructureCheckout_Address_Error5_Button2_View"
          >
            <span v-html="loading ? `${nl('page_order_progress_processing')}...` : nl('page_address_continue')"></span>
          </az-button>
        </template>

        <az-button
          id="btn_address_save"
          v-else
          :loading="loading"
          :disabled="loading"
          :needIcon="false"
          @click="handleSaveAddress($event)"
          class="btn btn-default btn-save"
        >
          <span
            v-html="loading ? `${nl('page_order_progress_processing')}...` : isCouponSwatch ? 'Complete My Order' : nl('page_common_save')"
          ></span>
        </az-button>
      </div>
    </form>
    <az-loading v-if="isLoading"></az-loading>
  </div>
</template>

<script>
import AzButton from '@/components/az-ui/Button/AzButton'
import { mapState } from 'vuex'
import Schema from 'async-validator'
// import AddressCheckBox from '@/components/checkout/AddressCheckBox'
import AzSelect from '@/components/az-ui/AzSelect'
import { debounce } from '@/assets/js/utils'
import AzLoading from '@/components/az-ui/AzLoading'

export default {
  name: 'AddressForm',
  languageKeys: [
    'page_address_country',
    'page_address_another_country',
    'page_address_contact',
    'page_placeholder_first_name',
    'page_placeholder_last_name',
    'page_placeholder_add_line_one',
    'page_placeholder_add_two_opt',
    'page_common_state_province_region',
    'page_common_zip_post_code',
    'page_common_zip_post_code_ie',
    'page_common_phone_number',
    'page_address_continue',
    'page_common_save',
    'page_placeholder_county',
    'page_placeholder_city',
    'page_placeholder_district',
    'page_placeholder_surburb',
    'page_pay_minimum_2',
    'page_pay_minimum_2_ie',
    'page_pay_minimum_3',
    'page_pay_minimum_5',
    'page_address_notPO',
    'page_pay_select_state',
    'page_please_enter_valid_zip_code',
    'page_pay_valid_phone_num',
    'page_pay_valid_phone_num_length',
    'page_checkout_please_select_country',
    'page_address_params_miss_district',
    'page_address_valid_zip_code_err',
    'page_checkout_address_doorplate_empty_tip',
    'page_placeholder_add_doorplate',
    'page_placeholder_doorplate_tip'
  ],
  components: { AzButton, AzSelect, AzLoading },
  props: {
    addressType: {
      type: Number,
      default: 1
    },
    editIndex: {
      type: Number,
      default: -1
    },
    addressInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    verifyAddress: {
      type: Boolean,
      default: true
    },
    sortBy: {
      type: String,
      default: ''
    },
    editOrderAddressOrderSn: {
      type: String,
      default: null
    },
    source: {
      type: String,
      default: null
    },
    // 使用场景，default,alteration
    // 如果是alteration，没有name和phone
    scene: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: false,
      loading: false,
      validator: null,
      addressForm: {
        firstName: '',
        lastName: '',
        address: '',
        signBuilding: '',
        country: '',
        province: 0,
        provinceText: '',
        city: 0,
        cityText: '',
        district: 0,
        districtText: '',
        zipcode: '',
        tel: ''
      },
      rulesResult: {
        // 报错情况
        firstName: '',
        lastName: '',
        address: '',
        signBuilding: '',
        country: '',
        province: '',
        cityText: '',
        districtText: '',
        zipcode: '',
        tel: ''
      },
      rulesPassResult: {
        // 校验通过情况
        firstName: false,
        lastName: false,
        address: false,
        signBuilding: false,
        country: false,
        province: false,
        cityText: false,
        districtText: false,
        zipcode: false,
        tel: false
      },
      verifyErrorCode: 0,
      verifyType: '', // verify continue有错误，顾客可选择后继续完成支付，不校验
      verifyErrorMsg: '', // 显示保存按钮上方的报错
      isSelected: false,
      isRenderSubscribeCheckbox: false,
      abTest: false, // abtest 30% 添加
      telFocus: false,
      ffPRegionList: [], // 省/州/郡（state）
      ffCtRegionList: [], // 市（city）
      districtList: [], // 区域（district）
      zipCodeList: [], // zip code
      showStateOption: false, // 显示state下拉
      showCityOption: false, // 显示city下拉
      showDistrictOption: false, // 显示district下拉
      showZipCodeOption: false,
      hasZipCodeRegion: false, // 是否有反查结果
      originProvince: '',
      originCity: '',
      originDistrict: '',
      originZipCode: '',
      zipCodeMap: {},
      isValidZipCode: true, // 是否有效code
      zipCodeCityMap: {} // au只能通过zipcode查找市的情况
    }
  },
  computed: {
    ...mapState('checkout', ['regionList', 'orderInfo']),
    countryOption() {
      // 国家根据当前订单的国家来
      const res = {
        value: this.countryId * 1,
        label: this.countryName
      }
      this.siteOptions.forEach((ele) => {
        if (ele.countryCode === this.currentCountry) {
          res.value = ele.countryId * 1
          res.label = ele.countryName
          res.headItemImageUrl = ele.headItemImageUrl
        }
      })
      return res
    },
    // 当前应该使用的国家code，如果url中存在订单国家code，就是用订单国家code，否则网站环境国家code
    currentCountry() {
      const res = this.$route.query.order_country_code
      return res || this.country
    },
    currentCountryId() {
      let id = ''
      this.siteOptions.forEach((ele) => {
        if (ele.countryCode === this.currentCountry) {
          id = ele.countryId * 1
        }
      })
      return id
    },
    isOldReCountry() {
      return ['CA', 'IE'].includes(this.currentCountry)
    },
    hasDistrictCountry() {
      return ['AU', 'MX', 'GB', 'ES', 'NL'].includes(this.currentCountry)
    },
    cityPlaceholder() {
      const name = this.nl('page_placeholder_city')
      if (this.currentCountry == 'GB') {
        return this.nl('page_placeholder_county')
      }
      return name
    },
    districtPlaceholder() {
      const name = this.nl('page_placeholder_district')
      if (['NL', 'AU'].includes(this.currentCountry)) {
        return this.nl('page_placeholder_surburb')
      } else if (this.currentCountry == 'GB') {
        return this.nl('page_placeholder_city')
      }
      return name
    },
    countryTelPre() {
      // 国家对应的电话前缀
      let telPre = '+1'
      switch (this.currentCountry) {
        case 'AU':
          telPre = '+61'
          break
        case 'GB':
          telPre = '+44'
          break
        case 'FR':
          telPre = '+33'
          break
        case 'MX':
          telPre = '+52'
          break
        case 'ES':
          telPre = '+34'
          break
        case 'DE':
          telPre = '+49'
          break
        case 'IT':
          telPre = '+39'
          break
        case 'IE':
          telPre = '+353'
          break
        case 'BE':
          telPre = '+32'
          break
        case 'NL':
          telPre = '+31'
          break
        case 'SE':
          telPre = '+46'
          break
        case 'AT':
          telPre = '+43'
          break
        case 'FI':
          telPre = '+358'
          break
        case 'DK':
          telPre = '+45'
          break
        default:
          telPre = '+1'
          break
      }
      return telPre
    }
  },
  watch: {
    addressInfo: {
      handler(val) {
        let tempAddressInfo = {
          address: '',
          signBuilding: '',
          country: this.countryOption.value,
          province: 0,
          provinceText: '',
          city: 0,
          cityText: '',
          district: 0,
          districtText: '',
          zipcode: ''
        }
        if (this.scene !== 'alteration') {
          tempAddressInfo = {
            ...tempAddressInfo,
            firstName: '',
            lastName: '',
            tel: ''
          }
        }
        if (this.currentCountry === 'DE') {
          tempAddressInfo = {
            ...tempAddressInfo,
            doorplate: ''
          }
        }
        let isEdit = false
        if (Object.keys(this.addressInfo).length) {
          isEdit = true
          tempAddressInfo = JSON.parse(JSON.stringify(this.addressInfo))
          // 兼容处理cityText和provinceTexxt
          tempAddressInfo = {
            ...tempAddressInfo,
            provinceText: tempAddressInfo.provinceText || tempAddressInfo.province_text,
            cityText: tempAddressInfo.cityText || tempAddressInfo.city_text
          }
          this.originProvince = JSON.parse(JSON.stringify(tempAddressInfo.province))
          this.originCity = JSON.parse(JSON.stringify(tempAddressInfo.city))
          if (tempAddressInfo.district) {
            this.originDistrict = JSON.parse(JSON.stringify(tempAddressInfo.district))
          }
          const tempResult = {
            address: true,
            province: true,
            cityText: true,
            districtText: true,
            zipcode: true,
            signBuilding: !!tempAddressInfo.signBuilding
          }
          if (this.currentCountry === 'DE') {
            this.rulesPassResult = {
              ...tempResult,
              doorplate: true
            }
          }
          if (this.scene !== 'alteration') {
            this.rulesPassResult = {
              ...tempResult,
              firstName: true,
              lastName: true,
              tel: true
            }
          } else {
            this.rulesPassResult = tempResult
          }
        }
        this.addressForm = tempAddressInfo
        if (this.scene !== 'alteration') {
          this.addressForm.firstName = this.addressForm.firstName || ''
          this.addressForm.lastName = this.addressForm.lastName || ''
        }
        if (['NL', 'AU'].includes(this.currentCountry) && this.addressForm.city == 0) this.addressForm.cityText = ''
        if (this.currentCountry == 'GB') {
          this.getSubRegion(2, this.currentCountryId, false, isEdit)
        } else {
          this.getSubRegion(1, this.currentCountryId, false, isEdit)
        }
        if (process.client) {
          const addressId = this.addressInfo.addressId
          const tel = this.addressInfo.tel
          if (!addressId && !tel) {
            this.isRenderSubscribeCheckbox = true
          } else {
            this.getPhoneIsSubscribe(this.addressInfo.tel)
          }
        }
      },
      immediate: true
    },
    isRenderSubscribeCheckbox: {
      handler(val) {
        if (val && process.client) {
          this.setDataLayer({
            action: 'view',
            category: 'SignUpSMS',
            label: 'SignUpSMS_Show_View'
          })
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.scene === 'alteration') {
      this.rulesResult = {
        // 报错情况
        address: '',
        signBuilding: '',
        country: '',
        province: '',
        cityText: '',
        districtText: '',
        zipcode: ''
      }
      this.rulesPassResult = {
        // 校验通过情况
        address: false,
        signBuilding: false,
        country: false,
        province: false,
        cityText: false,
        districtText: false,
        zipcode: false
      }
    }
    if (this.currentCountry === 'DE') {
      this.addressForm = {
        doorplate: '',
        ...this.addressForm
      }
      this.rulesResult = {
        doorplate: '',
        ...this.rulesResult
      }
      this.rulesPassResult = {
        ...this.rulesPassResult,
        doorplate: false
      }
    }
  },
  mounted() {
    this.getAbTest()
    const rules = {
      hasSpace(val) {
        return / /.test(val.toString().trim())
      },
      fixedLength(val, checks) {
        return val.toString().trim().length == checks.fixedLength
      },
      maxLength(val, checks) {
        return val.toString().trim().length <= checks.maxLength
      },
      minLength(val, checks) {
        if (checks.name == 'tel') {
          return (
            val
              .toString()
              .replace(/[^0-9]/gi, '')
              .trim().length >= checks.minLength
          )
        } else {
          return val.toString().trim().length >= checks.minLength
        }
      },
      tel(val, checks) {
        return (
          /^[\d-\s]{1,20}$/.test(val) &&
          val
            .toString()
            .trim()
            .replace(/[\s]+/g, ' ').length <= checks.maxLength
        )
      },
      number(val) {
        return /^[0-9]+$/.test(val.toString().trim())
      },
      letter(val) {
        return /^[a-zA-Z]+$/.test(val.toString().trim())
      },
      notPobox(val, source) {
        const addressVal = val
          .toString()
          .replace(/\./g, '')
          .replace(/[ ]/g, '')
          .toLowerCase()
        const poAddress1 = addressVal.includes('pobox')
        const poAddress2 = addressVal.includes('p.o.box')
        const except1 = addressVal.includes('apo')
        const except2 = addressVal.includes('fpo')
        const except3 = addressVal.includes('dpo')
        const except4 = addressVal.includes('armedforces')
        // billing address 不做pobox限制
        return (!poAddress1 && !poAddress2) || except1 || except2 || except3 || except4 || source == 'billing'
      }
    }
    const firstNameCheck = (rule, value, callback) => {
      if (!rules.minLength(value, { minLength: 2 })) {
        callback(new Error(this.nl('page_pay_minimum_2')))
      } else {
        callback()
      }
    }
    const addressCheck = (rule, value, callback) => {
      if (!rules.minLength(value, { minLength: 5 })) {
        callback(new Error(this.nl('page_pay_minimum_5')))
      } else if (!rules.notPobox(value, this.source)) {
        this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: 'NewStructureCheckout_Address_Error3_View' })
        callback(new Error(this.nl('page_address_notPO')))
      } else {
        callback()
      }
    }
    const signBuildingCheck = (rule, value, callback) => {
      if (this.addressForm.signBuilding) {
        if (!rules.notPobox(value, this.source)) {
          this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: 'NewStructureCheckout_Address_Error3_View' })
          callback(new Error(this.nl('page_address_notPO')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    const provinceCheck = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error(this.nl('page_pay_select_state')))
      } else {
        callback()
      }
    }

    const cityTextCheck = (rule, value, callback) => {
      if (!rules.minLength(value, { minLength: 3 })) {
        callback(new Error(this.nl('page_pay_minimum_3')))
      } else {
        callback()
      }
    }
    const zipCodeCheck = (rule, value, callback) => {
      if (this.currentCountry == 'CA') {
        if (
          value.length != 6 ||
          !(
            rules.letter(value.substr(0, 1)) &&
            rules.letter(value.substr(2, 1)) &&
            rules.letter(value.substr(4, 1)) &&
            rules.number(value.substr(1, 1)) &&
            rules.number(value.substr(3, 1)) &&
            rules.number(value.substr(5, 1))
          )
        ) {
          callback(new Error(this.nl('page_please_enter_valid_zip_code')))
        } else {
          callback()
        }
      } else if (['US', 'IE'].includes(this.currentCountry)) {
        if (!rules.minLength(value, { minLength: 2 })) {
          callback(new Error(this.nl(this.currentCountry == 'IE' ? 'page_pay_minimum_2_ie' : 'page_pay_minimum_2')))
        } else {
          callback()
        }
      } else if (['AU', 'AT'].includes(this.currentCountry)) {
        // AU\AT国家邮编：4位数字
        const reg = /\d{4}/g
        if (value.length === 4 && reg.test(value)) {
          callback()
        } else {
          callback(new Error(this.nl('page_please_enter_valid_zip_code')))
        }
      } else if (['DK'].includes(this.currentCountry)) {
        // DK国家邮编：3-4位数字
        const reg = /\d{3,4}/g
        if ((value.length === 3 || value.length === 4) && reg.test(value)) {
          callback()
        } else {
          callback(new Error(this.nl('page_please_enter_valid_zip_code')))
        }
      } else if (this.currentCountry == 'GB') {
        // GB国家邮编：6种类型（A代表字母，0代表数字）A0 0AA、A00 0AA、AA0 0AA、AA00 0AA、A0A 0AA、AA0A 0AA
        const reg1 = /[a-zA-z]\d\d[a-zA-z]{2}/g
        const reg2 = /[a-zA-z]\d\d\d[a-zA-z]{2}/g
        const reg3 = /[a-zA-z]{2}\d\d[a-zA-z]{2}/g
        const reg4 = /[a-zA-z]{2}\d{2}\d[a-zA-z]{2}/g
        const reg5 = /[a-zA-z]\d[a-zA-z]\d[a-zA-z]{2}/g
        const reg6 = /[a-zA-z]{2}\d[a-zA-z]\d[a-zA-z]{2}/g
        if (reg1.test(value) || reg2.test(value) || reg3.test(value) || reg4.test(value) || reg5.test(value) || reg6.test(value)) {
          callback()
        } else {
          callback(new Error(this.nl('page_please_enter_valid_zip_code')))
        }
      } else if (['FR', 'MX', 'ES', 'DE', 'IT', 'SE', 'FI'].includes(this.currentCountry)) {
        // FR,MX,ES,DE,IT, 'SE', 'FI'国家邮编：5位数字
        const reg = /\d{5}/g
        if (value.length === 5 && reg.test(value)) {
          callback()
        } else {
          callback(new Error(this.nl('page_please_enter_valid_zip_code')))
        }
      } else {
        callback()
      }
    }
    const telCheck = (rule, value, callback) => {
      if (!rules.number(value)) {
        callback(new Error(this.nl('page_pay_valid_phone_num')))
      }
      if (['AU', 'GB', 'FR', 'MX', 'DE', 'IT'].includes(this.currentCountry)) {
        // 不检验长度
        callback()
      }

      // ES 9位数
      else if (['ES'].includes(this.currentCountry)) {
        if (!rules.fixedLength(value, { fixedLength: 9, name: 'tel' })) {
          callback(new Error(this.nl('page_pay_valid_phone_num')))
        } else {
          callback()
        }
      }
      // DK 8位数
      else if (['DK'].includes(this.currentCountry)) {
        if (!rules.fixedLength(value, { fixedLength: 8, name: 'tel' })) {
          callback(new Error(this.nl('page_pay_valid_phone_num')))
        } else {
          callback()
        }
      }
      // FI 7-11位数
      else if (this.currentCountry == 'FI') {
        if (!rules.minLength(value, { minLength: 7, name: 'tel' })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else if (!rules.maxLength(value, { maxLength: 11 })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else {
          callback()
        }
      }

      // IE 8-15位数
      else if (this.currentCountry == 'IE') {
        if (!rules.minLength(value, { minLength: 8, name: 'tel' })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else if (!rules.maxLength(value, { maxLength: 15 })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else {
          callback()
        }
      }
      // NL\BE 9-10位数
      else if (['NL', 'BE', 'SE'].includes(this.currentCountry)) {
        if (!rules.minLength(value, { minLength: 9, name: 'tel' })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else if (!rules.maxLength(value, { maxLength: 10 })) {
          callback(new Error(this.nl('page_pay_valid_phone_num_length')))
        } else {
          callback()
        }
      } else if (!rules.minLength(value, { minLength: 10, name: 'tel' })) {
        callback(new Error(this.nl('page_pay_valid_phone_num')))
      } else if (!rules.maxLength(value, { maxLength: 11 })) {
        callback(new Error(this.nl('page_pay_valid_phone_num')))
      } else {
        callback()
      }
    }
    const doorplateCheck = (rule, value, callback) => {
      const reg = /^\d(\/|-|_|\d)*/g
      if (!value || value.length > 5 || !reg.test(value)) {
        callback(new Error(this.nl('page_placeholder_doorplate_error_tip')))
      } else {
        callback()
      }
    }
    let descriptor = {
      address: [{ type: 'string', required: true, validator: addressCheck, trigger: 'blur' }],
      signBuilding: [{ type: 'string', required: false, validator: signBuildingCheck, trigger: 'blur' }],
      zipcode: [{ type: 'string', required: true, validator: zipCodeCheck, trigger: 'blur' }]
    }

    // alteration场景下，不需要name,tel
    if (this.scene !== 'alteration') {
      descriptor = {
        ...descriptor,
        firstName: [{ type: 'string', required: true, validator: firstNameCheck, trigger: 'blur' }],
        lastName: [{ type: 'string', required: true, validator: firstNameCheck, trigger: 'blur' }],
        country: [{ type: 'number', required: true, message: this.nl('page_checkout_please_select_country'), trigger: 'blur' }],
        tel: [{ type: 'number', required: true, validator: telCheck, trigger: 'blur' }]
      }
    }
    if (this.currentCountry === 'DE') {
      descriptor.doorplate = [{ type: 'string', required: true, validator: doorplateCheck, trigger: 'blur' }]
    }

    if (this.currentCountry != 'GB') {
      descriptor.province = [{ type: 'number', required: true, validator: provinceCheck, trigger: 'blur' }]
    }
    if (!['NL', 'AU'].includes(this.currentCountry)) {
      descriptor.cityText = [{ type: 'string', required: true, validator: cityTextCheck, trigger: 'blur' }]
    }
    if (this.hasDistrictCountry) {
      descriptor.districtText = [{ type: 'string', required: true, message: this.nl('page_address_params_miss_district'), trigger: 'blur' }]
    }
    this.validator = new Schema(descriptor)
  },
  methods: {
    getOptions(list, type) {
      const tempOptions = []
      if (list && list.length) {
        for (const i in list) {
          const item = list[i]
          if (type == 'isOldReCountry') {
            tempOptions[i] = {
              name: item.regionName,
              value: item.regionId,
              key: item.regionId + ''
            }
          } else if (type == 'zipCode') {
            tempOptions[i] = {
              name: item,
              value: item,
              key: item
            }
          } else {
            tempOptions[i] = {
              name: item.regionNameLocal,
              value: item.regionId,
              key: item.regionId + '',
              ffRegionId: item.ffRegionId,
              parentId: item.parentId
            }
            if (item.parentLocalName) {
              tempOptions[i].parentLocalName = item.parentLocalName
            }
            if (item.subRegionList) {
              tempOptions[i].subRegionList = item.subRegionList
            }
            if (item.zipCodeCityMap) {
              tempOptions[i].zipCodeCityMap = item.zipCodeCityMap
            }
            if (item.skippedDistrictList) {
              tempOptions[i].skippedDistrictList = item.skippedDistrictList
            }
          }
        }
      }
      // tempOptions = this.uniqueByKey(tempOptions, 'key')
      return tempOptions
    },
    /**
     * 获取省市区code数据
     * type (1 state 2 city 3 district/zipcode)
     * isReset 不使用推荐数据，重置数据，恢复到正常选择
     * isEdit 编辑地址时，不需要联动
     */
    getSubRegion(type, ffId, isReset, isEdit) {
      if (!ffId) return
      this.isLoading = true
      if (type == 1) this.ffPRegionList = []
      let url = `/1.0/address-suggest/fetch-sub-region?order_country_code=${this.currentCountry}&${isEdit ? 'region_id' : 'ff_id'}=${ffId}`
      if (type == 3 && ['NL', 'AU'].includes(this.currentCountry)) {
        // au 没有市
        url = url + '&ff_type=3'
      }
      if (type == 2 && this.currentCountry == 'GB') {
        // uk 没有省
        url = url + '&ff_type=2'
      }

      this.$axios
        .$post(url)
        .then((res) => {
          this.isLoading = false
          if (res.code == 0) {
            let tempOptions = []
            if (res.data.res.regionList) {
              tempOptions = this.getOptions(res.data.res.regionList, 'isOldReCountry')
            } else {
              tempOptions = this.getOptions(res.data.res.ffRegionList)
            }
            if (type == 1) {
              this.ffPRegionList = tempOptions
              if (isEdit) return
              this.resetForm('province')
              if (isReset) this.resetOptionShow('showStateOption')
            } else if (type == 2) {
              this.ffCtRegionList = tempOptions
              // us 有省无市
              if (this.ffCtRegionList.length <= 0) {
                this.resetForm('city')
                this.addressForm.zipcode = ''
                this.resetAllPopup()
                return
              }
              if (isEdit) return
              this.resetForm('city')
              if ((this.currentCountry == 'GB' && isReset) || this.currentCountry != 'GB') this.resetOptionShow('showCityOption')
            } else if (type == 3) {
              this.zipCodeMap = res.data.res.zipCodeMap
              if (this.hasDistrictCountry) {
                if (isEdit) {
                  // 编辑时当前区是否在区列表里，不在的话添加进去
                  let hasDistrict = false
                  hasDistrict = tempOptions.some((item) => item.name == this.addressForm.districtText)
                  if (hasDistrict) {
                    const addDistrctInfo = {
                      name: this.addressForm.districtText,
                      value: this.addressForm.district,
                      key: this.addressForm.district + '',
                      hide: true
                    }
                    tempOptions.push(addDistrctInfo)
                  }
                  this.districtList = tempOptions
                  return
                }

                this.districtList = tempOptions
                this.resetForm('district')
                this.resetOptionShow('showDistrictOption')
              } else {
                this.zipCodeList = this.getOptions(this.zipCodeMap[this.addressForm.cityText], 'zipCode')
                if (isEdit) return
                this.resetForm('zipcode')
                this.resetOptionShow('showZipCodeOption')
              }
            }
          }
        })
        .catch((error) => {
          this.isLoading = false
          console.log(error)
        })
    },
    // 获取地址库的省区关联结果
    validateZipcode(zipCode) {
      this.isLoading = true
      this.$axios
        .$post(`/1.0/address-suggest/validate-zipcode?order_country_code=${this.currentCountry}&code=${zipCode}`)
        .then((res) => {
          this.isLoading = false
          if (res.code == 0) {
            if (!res.data.res.checkResult) {
              this.rulesResult.zipcode = this.nl('page_address_valid_zip_code_err')
              this.rulesPassResult.zipcode = false
              this.isValidZipCode = false
              return
            }
            this.hasZipCodeRegion = true
            this.addressForm.province = 0
            this.addressForm.provinceText = ''
            this.resetForm('province')

            this.ffPRegionList = this.getOptions(res.data.res.regionTree)
            if (this.currentCountry == 'GB') this.ffCtRegionList = this.getOptions(this.ffPRegionList[0].subRegionList) // todo 这里应该是所有省下面市的合集
            this.$nextTick(() => {
              if (this.ffPRegionList.length) this.resetOptionShow('showStateOption')
              if (this.ffCtRegionList.length) this.resetOptionShow('showCityOption')
            })
          }
        })
        .catch((error) => {
          this.isLoading = false
          console.log(error)
        })
    },
    // 选择省
    handleProvinceChange(data) {
      if (!data.value) return

      this.resetInput('province')
      this.addressForm.province = data.value
      this.addressForm.provinceText = data.name
      if (this.isOldReCountry) return
      if (data.value != this.originProvince) {
        this.originProvince = JSON.parse(JSON.stringify(data.value))
      } else if (!this.hasZipCodeRegion && !this.showStateOption) {
        // 编辑地址 不重置下拉框
        this.getSubRegion(['NL', 'AU'].includes(this.currentCountry) ? 3 : 2, this.addressForm.province, false, true)
        return
      }
      if (this.hasZipCodeRegion) {
        if (this.currentCountry != 'AU') {
          this.ffCtRegionList = this.getOptions(data.subRegionList)
          if (this.ffCtRegionList.length) this.resetOptionShow('showCityOption') // 市的反查选择弹框需要弹起
        } else {
          // au 显示省之后显示区
          this.districtList = this.getOptions(data.skippedDistrictList) // 这里显示所有市下面区的合集
          if (this.districtList.length) this.resetOptionShow('showDistrictOption') // 区的反查选择弹框需要弹起
        }
      } else {
        this.getSubRegion(['NL', 'AU'].includes(this.currentCountry) ? 3 : 2, data.ffRegionId)
      }
    },
    // 选择市
    handleCityChange(data) {
      if (!data.value) return
      this.resetInput('cityText')
      this.addressForm.city = data.value
      this.addressForm.cityText = data.name
      // 针对uk 有市无省
      if (data.parentId && data.parentLocalName) this.addressForm.province = data.parentId
      if (data.parentLocalName) this.addressForm.provinceText = data.parentLocalName
      if (data.value != this.originCity) {
        this.originCity = JSON.parse(JSON.stringify(data.value))
      } else if (!this.hasZipCodeRegion && !this.showCityOption) {
        // 编辑地址 不重置下拉框
        this.getSubRegion(3, this.addressForm.city, false, true)
        return
      }
      if (this.hasZipCodeRegion) {
        this.districtList = this.getOptions(data.subRegionList)
        if (this.hasDistrictCountry && this.districtList.length) {
          this.resetOptionShow('showDistrictOption') // 区的反查选择弹框需要弹起
        }
      } else {
        this.getSubRegion(3, data.ffRegionId)
      }
    },
    // 选择区
    handleDistrictChange(data) {
      if (!data.value) return
      this.resetInput('districtText')
      this.addressForm.district = data.value
      this.addressForm.districtText = data.name
      this.zipCodeCityMap = data.zipCodeCityMap || {}
      // 针对au 有区没有市
      if (data.parentId && data.parentLocalName) this.addressForm.city = data.parentId
      if (data.parentLocalName) this.addressForm.cityText = data.parentLocalName
      if (data.value != this.originDistrict) {
        this.originDistrict = JSON.parse(JSON.stringify(data.value))
      } else if (!this.hasZipCodeRegion && !this.showDistrictOption) {
        // 编辑地址
        return
      }
      if (this.zipCodeMap && this.zipCodeMap[this.addressForm.districtText] && this.zipCodeMap[this.addressForm.districtText].length) {
        const tempList = this.getOptions(this.zipCodeMap[this.addressForm.districtText], 'zipCode')
        if (tempList.length > 10000) {
          this.zipCodeList = []
        } else {
          this.zipCodeList = tempList
          this.resetOptionShow('showZipCodeOption')
        }
        // console.log('-----zipCodeList-----', this.zipCodeList.length)
      }
    },
    // 选择zipcode
    handleZipCodeChange(data) {
      if (!data.value) return
      this.resetInput('zipcode')
      this.addressForm.zipcode = data.value
      this.rulesPassResult.zipcode = true
      if (Object.keys(this.zipCodeCityMap).length && this.zipCodeCityMap[data.value]) {
        const cityItem = this.zipCodeCityMap[data.value]
        // 针对au 无法根据区获取市的情况，根据code匹配市
        if (cityItem.parentId) this.addressForm.city = cityItem.parentId
        if (cityItem.parentLocalName) this.addressForm.cityText = cityItem.parentLocalName
      }
      this.originZipCode = JSON.parse(JSON.stringify(this.addressForm.zipcode))
      this.zipCodeList = [] // 选择zipcode 之后，需要可以输入，不再显示下拉
    },
    // zipcode 输入反查
    handleZipCodeInput() {
      this.zipCodeList = []
      if (this.originZipCode == this.addressForm.zipcode) {
        // 判断code是否发生变化
        return
      }
      this.originZipCode = JSON.parse(JSON.stringify(this.addressForm.zipcode))
      if (!this.isOldReCountry) {
        if (this.addressForm.zipcode && this.currentCountry != 'IE') {
          // 爱尔兰IE不额外对邮编校验
          this.validateZipcode(this.addressForm.zipcode)
        }
      }
    },
    // 关闭所有弹框
    resetAllPopup() {
      this.showStateOption = false
      this.showCityOption = false
      this.showDistrictOption = false
      this.showZipCodeOption = false
    },
    // 下拉框关闭
    handleClosePop(name) {
      if (name == 'showZipCodeOption') this.zipCodeList = [] // code下拉不选择，则变输入
      this.$nextTick(() => {
        this[name] = false
      })
    },
    // 下拉框展开（处理只显示一个弹框和反查重置下拉问题）
    handleResetOption(name, type) {
      this.$nextTick(() => {
        // 保证弹框只显示一个,下拉组件控制弹框显示，反传到父级
        this.resetAllPopup()
        this[name] = true
      })
      // zipcode此时是反查输入，不用重置
      if (name == 'showZipCodeOption') return
      if (type == 'isFocus') {
        // 反查focus大于1条数据不用重置数据，可以进行搜索
        return
      }
      if (this.hasZipCodeRegion) {
        // 再次点击select选择框，有反查数据没有选或者选好之后点击任意select就是中断选择，重置数据
        // console.log('反查情况的手动点开应该重置')
        this.resetForm('province')
        this.hasZipCodeRegion = false
        if (this.currentCountry == 'GB') {
          this.getSubRegion(2, this.currentCountryId, true)
        } else {
          this.getSubRegion(1, this.currentCountryId, true)
        }
      }
    },
    // 重置报错
    resetInput(name) {
      if (name) {
        this.rulesResult[name] = ''
        this.rulesPassResult[name] = false
        if (name == 'tel') {
          this.telFocus = true
        }
        if (name == 'zipcode') {
          this.isValidZipCode = true
          this.resetAllPopup()
        }
        return false
      }
      this.rulesResult = {
        address: '',
        signBuilding: '',
        country: '',
        province: '',
        cityText: '',
        districtText: '',
        zipcode: ''
      }
      if (this.scene !== 'alteration') {
        this.rulesResult = {
          ...this.rulesResult,
          firstName: '',
          lastName: '',
          tel: ''
        }
      }
      if (this.currentCountry === 'DE') {
        this.rulesResult = {
          ...this.rulesResult,
          doorplate: ''
        }
      }
    },
    // 重置关联数据
    resetForm(name) {
      // console.log('重置关联数据', name)

      if (name == 'province') {
        this.addressForm.province = 0
        this.addressForm.provinceText = ''
        this.ffCtRegionList = [] // 市（city）
      }
      if (['province', 'city'].includes(name)) {
        this.addressForm.city = 0
        this.addressForm.cityText = ''
        this.districtList = [] // 区域（district）
      }
      if (['province', 'city', 'district'].includes(name)) {
        this.addressForm.district = 0
        this.addressForm.districtText = ''
      }
      if (name != 'zipcode') {
        this.zipCodeList = []
      }
      if (!this.hasZipCodeRegion && this.zipCodeList && this.zipCodeList.length) {
        // 排除code 反查值
        this.addressForm.zipcode = ''
        this.originZipCode = JSON.parse(JSON.stringify(this.addressForm.zipcode))
      }
    },
    // 显示弹框
    resetOptionShow(name) {
      const nameMap = {
        showStateOption: 'province', // 显示state下拉
        showCityOption: 'cityText', // 显示city下拉
        showDistrictOption: 'districtText', // 显示district下拉
        showZipCodeOption: 'zipcode'
      }
      this.rulesResult[nameMap[name]] = ''
      this.rulesPassResult.zipcode = false

      if (name == 'showStateOption') {
        if (this.ffPRegionList.length == 1) {
          this.addressForm.province = this.ffPRegionList[0].value
          this.addressForm.provinceText = this.ffPRegionList[0].name
          return
        }
      }
      if (name == 'showCityOption') {
        if (this.ffCtRegionList.length == 1) {
          this.addressForm.city = this.ffCtRegionList[0].value
          this.addressForm.cityText = this.ffCtRegionList[0].name
          return
        }
      }
      if (name == 'showDistrictOption') {
        if (this.districtList.length == 1) {
          this.addressForm.district = this.districtList[0].value
          this.addressForm.districtText = this.districtList[0].name
          return
        }
      }
      if (name == 'showZipCodeOption') {
        if (this.zipCodeList.length == 1) {
          this.addressForm.zipcode = this.zipCodeList[0].value
          this.originZipCode = JSON.parse(JSON.stringify(this.addressForm.zipcode))
          this.rulesResult.zipcode = ''
          this.rulesPassResult.zipcode = true
          return
        }
      }
      this.resetAllPopup()
      this.$nextTick(() => {
        this[name] = true
      })
    },
    onBlur(name) {
      if (name == 'tel') {
        this.telFocus = false
        this.addressForm.tel = this.addressForm.tel ? (this.addressForm.tel + '').replace(/\s+/g, '') : ''
      } else if (name == 'zipcode') {
        this.addressForm.zipcode = this.addressForm.zipcode.replace(/\s+/g, '')
      }
      this.$store.commit('checkout/setIsAddressRulesResult', false)
      this.validator.validate(
        {
          ...this.addressForm
        },
        (errors, fields) => {
          // console.log('------------', name, this.addressForm[name])
          if (this.addressForm[name]) this.rulesPassResult[name] = true
          if (errors) {
            errors.map((item) => {
              if (name == item.field) {
                this.rulesPassResult[name] = false
              }
              if (!this.rulesResult[item.field] && name == item.field) {
                this.rulesResult[name] = item.message
              }
            })
            if (name == 'zipcode' && !this.rulesResult[name]) {
              this.handleZipCodeInput()
            }
            return false
          }
          if (name == 'zipcode') this.handleZipCodeInput()
          this.$store.commit('checkout/setIsAddressRulesResult', true)
        }
      )
    },
    getAbTest() {
      // 订阅提示的 ABTest
      // 2020-9.23 NABTEST 坏了，这里暂时强制使用A版本
      // const tabTest = this.$cookie.getCookie('NABTEST')
      const tabTest = 'A'
      const show = ['A', 'B', 'C']
      if (show.includes(tabTest)) {
        this.abTest = true
        return true
      } else {
        this.abTest = false
        return false
      }
    },
    telChange() {
      // jira 4561
      if (!this.abTest) return
      debounce(this.getPhoneIsSubscribe, 500)
    },
    handleCheckBox(val) {
      this.isSelected = val
    },
    handleSaveAddress(e, verifyType) {
      if (!verifyType) {
        this.setPoint(this.source == 'billing' ? 'billingaddress' : 'shippingaddress', 'addresssave', 'click')
      } else if (verifyType == 'verify') {
        this.setPoint(this.source == 'billing' ? 'billingaddress' : 'shippingaddress', 'verify', 'click')
      } else if (verifyType == 'continue') {
        this.setPoint(this.source == 'billing' ? 'billingaddress' : 'shippingaddress', 'save_continue', 'click')
      }
      this.verifyType = verifyType || ''
      this.resetInput()
      this.validator
        .validate(
          {
            ...this.addressForm
          },
          (errors, fields) => {
            if (errors) {
              console.log(errors)
              errors.map((item) => {
                if (!this.rulesResult[item.field]) {
                  this.rulesResult[item.field] = item.message
                }
              })
              e.preventDefault()
              return false
            }
            this.saveAddress()
          }
        )
        .catch((e) => {
          console.log('校验结束--catch出错', e)
        })
    },
    // 保存地址(新增和编辑)
    saveAddress() {
      this.loading = true
      // 重发色卡 订单地址-10001, 修改接口 转新增
      let act = this.addressForm.addressId && this.addressForm.addressId != -10001 ? 'edit' : 'add'
      if (!this.isLogin && !this.orderInfo.orderSn && !this.$route.query.origin_order_sn) act = 'check'
      // 11714修复编辑或新增地址更新地址信息失败
      if (this.$route.name === 'order-editAddress' && this.$route.query.order_sn) {
        act = this.addressForm.addressId && this.addressForm.addressId != -10001 ? 'edit' : 'add'
      }

      let param = {
        address_type: this.addressType,
        country: this.addressForm.country,
        province: this.addressForm.province,
        province_text: this.addressForm.provinceText,
        city: this.addressForm.city,
        city_text: this.addressForm.cityText,
        district: this.addressForm.district,
        district_text: this.addressForm.districtText,
        address: this.addressForm.address,
        sign_building: this.addressForm.signBuilding,
        zipcode: this.addressForm.zipcode
      }

      let checkValidation = this.addressType == 1 ? 1 : 0
      if (this.verifyType == 'continue') {
        // 有错误，顾客可选择后继续完成支付 地址不正确，state/city/zipcode与第三方响应一致
        checkValidation = 0
        if (this.scene === 'alteration') {
          // 将addressForm数据传给父组件，目前仅alteration的场景会用到这个数据
          this.$emit('handleSaveAddress', param)
          return
        }
      }
      // jira 4561
      if (this.isSelected && this.getAbTest()) {
        this.setDataLayer({
          action: 'click',
          category: 'SignUpSMS',
          label: 'SignUpSMS_Selected_Click'
        })
        // this.subscribePhone()
        this.subscribeSMSCode(this.addressForm.tel)
      }
      param = {
        ...param,
        check_validation: checkValidation
      }
      if (this.scene !== 'alteration') {
        param = {
          ...param,
          first_name: this.addressForm.firstName,
          last_name: this.addressForm.lastName,
          tel: this.addressForm.tel
        }
      }
      if (this.currentCountry === 'DE') {
        param = {
          ...param,
          doorplate: this.addressForm.doorplate
        }
      }
      // 如果页面路径中有订单国家code，接口中传入此参数
      const orderCountryCode = this.$route.query.order_country_code
      if (orderCountryCode) {
        param.order_country_code = orderCountryCode
      }
      // 账户修改地址特殊逻辑
      param.sort_by = this.sortBy
      if (this.addressForm.addressId) {
        param.address_id = this.addressForm.addressId
        param.is_default = this.addressForm.isDefault
      }
      // 未登录时 信息补全
      if (act == 'check') {
        param.province_name = this.addressForm.provinceText
        param.country_name = this.countryOption.label
        param.country_code = this.currentCountry
        param.full_name = `${param.first_name} ${param.last_name}`
      }
      const tempAddressId = this.addressForm.addressId || ''
      let url = `/1.0/address/${act}`
      if (this.scene === 'alteration') {
        url = '/1.0/alteration-address/check'
      }
      this.$axios
        .$post(url, param)
        .then((res) => {
          this.loading = false
          this.verifyType = ''
          this.verifyErrorCode = 0
          // console.log('this.source', this.source)
          if (res.code == 0) {
            if (this.scene !== 'alteration') {
              if (act == 'check') {
                const nowShippingAddress = JSON.parse(JSON.stringify(this.$store.state.checkout.shippingAddress))
                const nowBillingAddress = JSON.parse(JSON.stringify(this.$store.state.checkout.billingAddress))
                if (this.addressType == 1) {
                  if (this.editIndex > -1) {
                    nowShippingAddress[this.editIndex] = { ...res.data, addressId: tempAddressId || Date.parse(new Date()) }
                  } else {
                    nowShippingAddress.unshift({ ...res.data, addressId: tempAddressId || Date.parse(new Date()) })
                  }
                } else if (this.addressType == 2) {
                  if (this.editIndex > -1) {
                    nowBillingAddress[this.editIndex] = { ...res.data, addressId: tempAddressId || Date.parse(new Date()) }
                  } else {
                    nowBillingAddress.unshift({ ...res.data, addressId: tempAddressId || Date.parse(new Date()) })
                  }
                }
                if (nowBillingAddress.length < 1) {
                  nowBillingAddress.unshift({ ...res.data, addressId: tempAddressId || Date.parse(new Date()) })
                }
                this.$store.commit('checkout/setAddressInfo', { shippingAddress: nowShippingAddress, billingAddress: nowBillingAddress })
              } else {
                res.data.addressList && this.$store.commit('checkout/setAddressInfo', res.data.addressList)
              }
            }
            // 将addressForm数据传给父组件，目前仅alteration的场景会用到这个数据
            this.$emit('handleSaveAddress', param)
          } else if (res.code == 500001) {
            this.verifyErrorCode = res.data.apiCode
            // console.log('this.source', this.source)
            // 地址校验出错
            const items = []
            if (res.data.address && Object.keys(res.data.address).length) {
              for (const key in this.rulesResult) {
                if (res.data.address[key] && res.data.address[key].errorTip) {
                  const msg = {
                    error: res.data.address[key].errorTip
                  }
                  items.push({
                    ec: this.source == 'billing' ? 'billingaddress' : 'shippingaddress',
                    el: 'error',
                    ea: 'view',
                    msg: JSON.stringify(msg)
                  })
                  this.rulesResult[key] = res.data.address[key].errorTip
                  this.rulesPassResult[key] = false
                }
              }
            }
            this.buryPoint(this, 'events', items)
            if (res.data.apiCode == 1) {
              // 有错误，反馈信息中不包含zip code
              this.verifyErrorMsg = res.data.msg
              setTimeout(() => {
                this.verifyErrorMsg = ''
              }, 3000)
            } else if (res.data.apiCode == 2) {
              // 有错误，顾客可选择后继续完成支付 地址正确，state/city/zipcode与第三方响应不一致
              const tempSuggestAddressList = []
              const suggestAddress = res.data.address
              const temSuggestAddress = { isAddressError: false, isCsz: false }
              const tempAddressInfo = JSON.parse(JSON.stringify(this.addressForm))
              for (const key in suggestAddress) {
                temSuggestAddress[key] = suggestAddress[key].value
                if (suggestAddress.address && suggestAddress.address.error) {
                  temSuggestAddress.isAddressError = true
                }
                if (
                  (suggestAddress.city && suggestAddress.city.error) ||
                  (suggestAddress.province && suggestAddress.province.error) ||
                  (suggestAddress.zipcode && suggestAddress.zipcode.error)
                ) {
                  temSuggestAddress.isCsz = true
                }
              }
              if (this.scene !== 'alteration') {
                tempAddressInfo.fullName = tempAddressInfo.firstName + ' ' + tempAddressInfo.lastName
              }
              tempSuggestAddressList[0] = tempAddressInfo
              tempSuggestAddressList[1] = temSuggestAddress
              this.$emit('setSuggestAddress', tempSuggestAddressList)
            } else if (res.data.apiCode == 3) {
              // 有错误，顾客可选择后继续完成支付 地址不正确，state/city/zipcode与第三方响应一致
              this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: 'NewStructureCheckout_Address_Error5_View' })
            } else if (res.data.apiCode == 4) {
              //  重置报错
              this.rulesPassResult.province = false
              this.rulesPassResult.cityText = false
              this.rulesPassResult.districtText = false
              this.rulesPassResult.zipcode = false
              // 有错误，必须修改无误后才可继续支付
              this.setDataLayer({ category: 'NewStructureCheckout', action: 'view', label: 'NewStructureCheckout_Address_Error2_View' })
            } else if (res.data.apiCode == 5) {
              // 有错误，反馈信息中包含zipcode 报错：Your ZIP / postal code is invalid.
            } else {
              alert(res.data.msg)
            }
          } else if (res.code == 500002) {
            // address 地址长度校验
            this.rulesResult.address = res.msg
          } else if (res.code == 500003) {
            // signBuilding 地址长度校验
            this.rulesResult.signBuilding = res.msg
          } else {
            alert(res.msg)
          }
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    // subscribePhone() {
    //   const param = {
    //     content: this.addressForm.tel,
    //     type: 1,
    //     source: 1
    //   }
    //   this.$axios.$post(`/1.0/user/subscribe`, param).catch((error) => {
    //     console.log(error)
    //   })
    // },
    getPhoneIsSubscribe(tel) {
      if (!this.getAbTest()) return
      const param = {
        phone: tel || this.addressForm.tel
      }
      this.$axios
        .$get(`/1.0/user/phone-subscribe`, { params: param })
        .then((res) => {
          if (res.code == 0) {
            if (res.data.subscribe) {
              this.isRenderSubscribeCheckbox = false
            } else {
              this.isRenderSubscribeCheckbox = true
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.address-form {
  .doorplate-tip {
    font-size: 13px;
    line-height: normal;
    margin-bottom: 20px;
    color: var(--color-121212);
  }
  .select-item-country {
    display: flex;
    align-items: center;
    .icon-country {
      width: 20px;
      height: 14px;
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px;
    }
  }

  .pay-address-form {
    width: 750px;
    margin-top: 20px;
    li {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 15px;
      // overflow: hidden;
      justify-content: space-between;
    }
    // .is_billing {
    //   margin-bottom: 15px;
    // }
    label {
      display: block;
      margin: 0 0 3px 2px;
    }
    .col2 {
      position: relative;
    }
    .col3 {
      width: 176px;
      position: relative;
    }
    .fr-tip {
      float: right;
      margin-right: 37px;
      color: #666;
      line-height: 16px;
    }
    .addr-tip {
      display: flex;
      width: 100%;
      font-family: @font-family-500, sans-serif;
      font-size: 13px;
      color: var(--color-999999);
      margin-right: 37px;
      line-height: 14px;
    }
    .addr-tip-star {
      margin-top: 0px;
      // float: left;
    }
    .addr-tip-text {
      // float: left;
      width: 90%;
      margin-bottom: 20px;
    }
    input,
    select {
      background: #fff;
      border: solid 1px #ccc;
      padding: 10px 5px 10px 10px;
      margin-bottom: 5px;
      box-sizing: border-box;
      height: 40px;
    }
    input {
      width: 750px;
      &:focus {
        border-color: var(--color-121212);
      }
    }
    .input-wrap {
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      margin-bottom: 5px;
      box-sizing: border-box;
      height: 40px;
      width: 750px;
      position: relative;
      .icon-right {
        fill: currentColor;
        color: @theme-green;
        padding: 10px;
        position: absolute;
        right: 0;
      }
      span {
        padding: 0 10px;
        width: 57px;
        em {
          display: inline-block;
        }
      }
      input {
        border: none;
        width: 100% !important;
        margin-bottom: 0;
        height: 100%;
        padding-right: 30px;
      }
      input[name='tel'] {
        border-left: 1px solid #ccc;
        &:focus {
          border-color: #ccc !important;
        }
      }
    }
    select {
      width: 341px;
      height: 40px;
      padding: 10px 0;
      &.unselected {
        color: #999;
      }
    }
    .col2 {
      .error-tip,
      .input-wrap,
      input {
        width: 367px;
      }
    }
    .col3 {
      .input-wrap,
      input {
        width: 176px;
      }
    }
    .col2 select {
      width: 367px;
    }
    .mt {
      margin-top: 6px;
    }
    input.error,
    select.error {
      // border: solid 1px #f00;
    }
    .error-tip {
      display: block;
      color: #f00;
      &.no-valid {
        color: #999;
        max-width: 367px;
      }
    }
    .doorplate-tip {
      font-size: 12px;
      line-height: normal;
      color: #999;
      margin-top: 5px;
      margin-bottom: 0px;
    }
  }
  .btn-verify {
    margin-right: 10px;
  }
}
.cannot-change {
  position: relative;
  margin-left: 10px;
  width: 20px;
  height: 20px;
  background-image: url('~assets/images/order/credit_card_pic.png');
  background-position: -71px -116px;
  &:hover {
    .notification {
      display: block;
    }
  }
}
.notification {
  display: none;
  .tri_rig1 {
    position: absolute;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid black;
    border-bottom: 10px solid transparent;
    border-left: 10px solid transparent;
    overflow: hidden;
    top: 0px;
    left: 10px;
  }
  .tri_rig2 {
    position: relative;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid white;
    border-bottom: 10px solid transparent;
    border-left: 10px solid transparent;
    overflow: hidden;
    top: 0;
    left: 10px;
    z-index: 7;
  }
  .a-country {
    position: absolute;
    text-align: center;
    top: -30px;
    left: 29px;
    border: 1px #ccc solid;
    width: 186px;
    height: 64px;
    z-index: 8;
    background-color: #ffffff;
    .text {
      padding-top: 14px;
    }
    .contact {
      color: var(--color-121212);
      text-decoration: underline;
    }
  }
}
// #country_select {
//   appearance: none;
//   line-height: 28px;
//   padding: 0;
//   padding-left: 10px;
//   background-color: var(--color-f9f9f9);
//   color: var(--color-121212);
//   opacity: 1;
// }
#province_select {
  position: relative;
  appearance: none;
  line-height: 28px;
  padding: 0;
  padding-left: 10px;
}
.icon-select {
  width: 10px;
  height: 10px;
  position: absolute;
  right: 10px;
  top: 16px;
}
.btn-default {
  min-width: 80px;
  box-sizing: border-box;
  border-radius: 0%;
  font-size: 13px;
  font-family: @font-family-600;
}
.checkout-box {
  #btn_address_save,
  .btn-verify {
    background-color: @black-btn-color!important;
    border: solid 1px @black-btn-color;
    &:hover {
      background-color: @black-btn-hover-color;
    }
  }
}
</style>
