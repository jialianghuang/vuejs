/**
 * google pay
 */
let paymentInfo = {}
let googlepaycallBack = null

/**
 * Define the version of the Google Pay API referenced when creating your
 * configuration
 * 指定您的 Google Pay API 版本
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|apiVersion in PaymentDataRequest}
 */
const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
}

/**
 * Card networks supported by your site and your gateway
 * 指定支持的支付卡网络
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
 * @todo confirm card networks supported by your site and gateway
 */
const allowedCardNetworks = ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA']

/**
 * Card authentication methods supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
 * @todo confirm your processor supports Android device tokens for your
 * supported card networks
 */
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS']

/**
 * Describe your site's support for the CARD payment method and its required
 * fields
 * 说明您允许的付款方式
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
 */
const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks
  }
}

/**
 *  初始化google pay
 * @param {*} temPaymentInfo 支付信息
 * @param {*} callBack 支付结果回调
 */
const initGooglePay = (temPaymentInfo = null, callBack = null) => {
  if (temPaymentInfo) paymentInfo = temPaymentInfo
  googlepaycallBack = callBack
  const env = window.$nuxt.$store.state.environment
  let isDev = false // 是否是沙盒模式
  if (env.includes('dev') || env.includes('test')) isDev = true

  /**
   * Identify your gateway and your site's gateway merchant identifier
   *
   * The Google Pay API response will return an encrypted payment method capable
   * of being charged by a supported gateway after payer authorization
   * 为您的付款服务机构申请付款令牌
   * @todo check with your gateway on the parameters to pass
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway|PaymentMethodTokenizationSpecification}
   */

  const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
      gateway: 'checkoutltd',
      // gatewayMerchantId: 'pk_sbox_jnk2gpoifgeota5mnyxjaittr4h'
      gatewayMerchantId: isDev ? 'pk_sbox_jnk2gpoifgeota5mnyxjaittr4h' : 'pk_h6renxqqhucq7nfeunvewmwvbuj'
    }
  }

  /**
   * Describe your site's support for the CARD payment method including optional
   * fields
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
   */
  const cardPaymentMethod = Object.assign({}, baseCardPaymentMethod, {
    tokenizationSpecification
  })

  /**
   * An initialized google.payments.api.PaymentsClient object or null if not yet set
   *
   * @see {@link getGooglePaymentsClient}
   */
  let paymentsClient = null

  /**
   * Configure your site's support for payment methods supported by the Google Pay
   * API.
   *
   * Each member of allowedPaymentMethods should contain only the required fields,
   * allowing reuse of this base request when determining a viewer's ability
   * to pay and later requesting a supported payment method
   * 确定是否能使用 Google Pay API 进行付款
   * @returns {object} Google Pay API version, payment methods supported by the site
   */
  function getGoogleIsReadyToPayRequest() {
    return Object.assign({}, baseRequest, {
      allowedPaymentMethods: [baseCardPaymentMethod]
    })
  }

  /**
   * Configure support for the Google Pay API
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
   * @returns {object} PaymentDataRequest fields
   */
  function getGooglePaymentDataRequest() {
    // 测试供应商id
    const paymentDataRequest = Object.assign({}, baseRequest)
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod]
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo()

    paymentDataRequest.merchantInfo = isDev
      ? {
          merchantName: 'Example Merchant'
        }
      : {
          // @todo a merchant ID is available for a production environment after approval by Google
          // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
          merchantId: 'BCR2DN4TYSNPTLZT',
          merchantName: 'Azazie'
          // merchantName: 'Example Merchant'
        }

    //   paymentDataRequest.callbackIntents = ['SHIPPING_ADDRESS', 'SHIPPING_OPTION', 'PAYMENT_AUTHORIZATION']
    paymentDataRequest.callbackIntents = ['PAYMENT_AUTHORIZATION']
    //   paymentDataRequest.shippingAddressRequired = true
    //   paymentDataRequest.shippingAddressParameters = getGoogleShippingAddressParameters()
    //   paymentDataRequest.shippingOptionRequired = true

    return paymentDataRequest
  }

  /**
   * Return an active PaymentsClient or initialize
   * 设置授权付款
   * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
   * @returns {google.payments.api.PaymentsClient} Google Pay API client
   */
  function getGooglePaymentsClient() {
    if (paymentsClient === null) {
      // paymentsClient = new window.google.payments.api.PaymentsClient({
      //   environment: 'TEST',
      //   merchantInfo: {
      //     merchantName: 'Example Merchant',
      //     merchantId: '01234567890123456789'
      //   },
      //   paymentDataCallbacks: {
      //     onPaymentAuthorized,
      //     onPaymentDataChanged
      //   }
      // })
      const environment = isDev ? 'TEST' : 'PRODUCTION'
      paymentsClient = new window.google.payments.api.PaymentsClient({
        environment,
        paymentDataCallbacks: {
          onPaymentAuthorized
        }
      })
    }
    return paymentsClient
  }

  // 处理 onPaymentAuthorized 回调
  function onPaymentAuthorized(paymentData) {
    return new Promise(function(resolve, reject) {
      // handle the response
      processPayment(paymentData)
        .then(function() {
          resolve({ transactionState: 'SUCCESS' })
        })
        .catch(function() {
          resolve({
            transactionState: 'ERROR',
            error: {
              intent: 'PAYMENT_AUTHORIZATION',
              message: 'Insufficient funds',
              reason: 'PAYMENT_DATA_INVALID'
            }
          })
        })
    })
  }

  /**
   * Handles dynamic buy flow shipping address and shipping options callback intents.
   *
   * @param {object} itermediatePaymentData response from Google Pay API a shipping address or shipping option is selected in the payment sheet.
   * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#IntermediatePaymentData|IntermediatePaymentData object reference}
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentDataRequestUpdate|PaymentDataRequestUpdate}
   * @returns Promise<{object}> Promise of PaymentDataRequestUpdate object to update the payment sheet.
   */
  // function onPaymentDataChanged(intermediatePaymentData) {
  //   return new Promise(function(resolve, reject) {
  //     const shippingAddress = intermediatePaymentData.shippingAddress
  //     const shippingOptionData = intermediatePaymentData.shippingOptionData
  //     const paymentDataRequestUpdate = {}

  //     if (intermediatePaymentData.callbackTrigger == 'INITIALIZE' || intermediatePaymentData.callbackTrigger == 'SHIPPING_ADDRESS') {
  //       if (shippingAddress.administrativeArea == 'NJ') {
  //         paymentDataRequestUpdate.error = getGoogleUnserviceableAddressError()
  //       } else {
  //         paymentDataRequestUpdate.newShippingOptionParameters = getGoogleDefaultShippingOptions()
  //         const selectedShippingOptionId = paymentDataRequestUpdate.newShippingOptionParameters.defaultSelectedOptionId
  //         paymentDataRequestUpdate.newTransactionInfo = calculateNewTransactionInfo(selectedShippingOptionId)
  //       }
  //     } else if (intermediatePaymentData.callbackTrigger == 'SHIPPING_OPTION') {
  //       paymentDataRequestUpdate.newTransactionInfo = calculateNewTransactionInfo(shippingOptionData.id)
  //     }

  //     resolve(paymentDataRequestUpdate)
  //   })
  // }

  /**
   * Helper function to create a new TransactionInfo object.
   * @param string shippingOptionId respresenting the selected shipping option in the payment sheet.
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
   * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
   */
  // function calculateNewTransactionInfo(shippingOptionId) {
  //   const newTransactionInfo = getGoogleTransactionInfo()
  //   const shippingCost = getShippingCosts()[shippingOptionId]
  //   newTransactionInfo.displayItems.push({
  //     type: 'LINE_ITEM',
  //     label: 'Shipping cost',
  //     price: shippingCost,
  //     status: 'FINAL'
  //   })
  //   let totalPrice = 0.0
  //   newTransactionInfo.displayItems.forEach((displayItem) => (totalPrice += parseFloat(displayItem.price)))
  //   newTransactionInfo.totalPrice = totalPrice.toString()

  //   return newTransactionInfo
  // }

  /**
   * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
   *
   * Display a Google Pay payment button after confirmation of the viewer's
   * ability to pay.
   */
  function onGooglePayLoaded() {
    const paymentsClient = getGooglePaymentsClient()
    // 确保仅在您的网站通过 isReadyToPay() 函数确认用户能够付款后，Google Pay 付款按钮才会显示
    // 重新赋值网站 商户数据

    paymentsClient
      .isReadyToPay(getGoogleIsReadyToPayRequest())
      .then(function(response) {
        if (response.result) {
          addGooglePayButton()
          // @todo prefetch payment data to improve performance after confirming site functionality
          // prefetchGooglePaymentData();
        }
      })
      .catch(function(err) {
        // show error in developer console for debugging
        console.error(err)
      })
  }

  /**
   * Add a Google Pay purchase button alongside an existing checkout button
   * 添加 Google Pay 付款按钮
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ButtonOptions|Button options}
   * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
   */
  function addGooglePayButton() {
    const paymentsClient = getGooglePaymentsClient()
    const button = paymentsClient.createButton({
      buttonSizeMode: 'fill',
      onClick: onGooglePaymentButtonClicked
    })
    document.getElementById('btn_google_pay').appendChild(button)
    // 按钮添加之后，才能使用google pay
    window.$nuxt.$store.commit('checkout/setShowGooglePay', true)
  }

  /**
   * Provide Google Pay API with a payment amount, currency, and amount status
   * 创建 PaymentDataRequest 对象
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
   * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
   */
  function getGoogleTransactionInfo() {
    return {
      // displayItems: [
      //   {
      //     label: 'Subtotal',
      //     type: 'SUBTOTAL',
      //     price: paymentInfo.totalAmount + ''
      //   },
      //   {
      //     label: 'Tax',
      //     type: 'TAX',
      //     price: paymentInfo.taxFee + ''
      //   }
      // ],
      countryCode: paymentInfo.countryCode,
      currencyCode: paymentInfo.currencyCode,
      totalPriceStatus: 'FINAL',
      totalPrice: paymentInfo.totalAmount + '',
      totalPriceLabel: 'Total'
    }
  }

  /**
   * Provide a key value store for shippping options.
   */
  // function getShippingCosts() {
  //   return {
  //     'shipping-001': '0.00',
  //     'shipping-002': '1.99',
  //     'shipping-003': '10.00'
  //   }
  // }

  /**
   * Provide Google Pay API with shipping address parameters when using dynamic buy flow.
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ShippingAddressParameters|ShippingAddressParameters}
   * @returns {object} shipping address details, suitable for use as shippingAddressParameters property of PaymentDataRequest
   */
  // function getGoogleShippingAddressParameters() {
  //   return {
  //     phoneNumberRequired: true
  //   }
  // }

  /**
   * Provide Google Pay API with shipping options and a default selected shipping option.
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ShippingOptionParameters|ShippingOptionParameters}
   * @returns {object} shipping option parameters, suitable for use as shippingOptionParameters property of PaymentDataRequest
   */
  // function getGoogleDefaultShippingOptions() {
  //   return {
  //     defaultSelectedOptionId: 'shipping-001',
  //     shippingOptions: [
  //       {
  //         id: 'shipping-001',
  //         label: 'Free: Standard shipping',
  //         description: 'Free Shipping delivered in 5 business days.'
  //       },
  //       {
  //         id: 'shipping-002',
  //         label: '$1.99: Standard shipping',
  //         description: 'Standard shipping delivered in 3 business days.'
  //       },
  //       {
  //         id: 'shipping-003',
  //         label: '$10: Express shipping',
  //         description: 'Express shipping delivered in 1 business day.'
  //       }
  //     ]
  //   }
  // }

  /**
   * Provide Google Pay API with a payment data error.
   *
   * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentDataError|PaymentDataError}
   * @returns {object} payment data error, suitable for use as error property of PaymentDataRequestUpdate
   */
  // function getGoogleUnserviceableAddressError() {
  //   return {
  //     reason: 'SHIPPING_ADDRESS_UNSERVICEABLE',
  //     message: 'Cannot ship to the selected address',
  //     intent: 'SHIPPING_ADDRESS'
  //   }
  // }

  /**
   * Prefetch payment data to improve performance
   * 在用户互动之前预取付款数据
   * @see {@link https://developers.google.com/pay/api/web/reference/client#prefetchPaymentData|prefetchPaymentData()}
   */
  // function prefetchGooglePaymentData() {
  //   const paymentDataRequest = getGooglePaymentDataRequest() // transactionInfo must be set but does not affect cache
  //   paymentDataRequest.transactionInfo = {
  //     totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
  //     currencyCode: 'USD'
  //   }
  //   const paymentsClient = getGooglePaymentsClient()
  //   paymentsClient.prefetchPaymentData(paymentDataRequest)
  // }

  /**
   * Show Google Pay payment sheet when Google Pay payment button is clicked
   * 为用户手势注册事件处理程序
   */
  function onGooglePaymentButtonClicked() {
    const paymentDataRequest = getGooglePaymentDataRequest()
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo()
    // console.log('---paymentDataRequest---', paymentDataRequest)
    const paymentsClient = getGooglePaymentsClient()
    paymentsClient.loadPaymentData(paymentDataRequest).catch((error) => {
      console.log(error)
      console.error({ error })
      googlepaycallBack({ error })
    })
  }

  /**
   * Process payment data returned by the Google Pay API
   *
   * @param {object} paymentData response from Google Pay API after user approves payment
   * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData|PaymentData object reference}
   */
  function processPayment(paymentData) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        // show returned data in developer console for debugging
        // @todo pass payment token to your gateway to process payment

        const paymentToken = paymentData.paymentMethodData.tokenizationData.token
        googlepaycallBack({ paymentToken })
        resolve({ paymentToken })
      }, 3000)
    })
  }
  if (!temPaymentInfo) onGooglePayLoaded() // google js 加载完，初始化google pay
}

export default initGooglePay
