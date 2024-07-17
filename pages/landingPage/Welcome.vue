<template>
  <div id="welcome">
    <main-app :navigation="navigation">
      <div v-track.view.click="getBiParams('dbwelcome', 'page')" class="welcome-content">
        <div
          v-track.view.click="getBiParams('dbwelcome', 'banner')"
          @click="clickCliaimOffersFixedBtn"
          :class="bannerType"
          class="welcome-content-header"
        >
          <img :src="addWebpSuffix(bannerUrl)" alt="azazie db top banner" />
          <div :class="{ 'welcome-count-down-bg': !['bd', 'sod'].includes(bannerType) }">
            <div v-if="endTime" class="welcome-count-down">
              <span>Ends in</span>
              <AzCountDown :endTime="endTime" :isWelcomeTime="true" />
            </div>
          </div>

          <!-- <div v-track.view.click="getBiParams('email', 'module')" class="welcome-content-header-msg">
            <svg id="icon-dear" width="217" height="23" viewBox="0 0 217 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.12 19C13.528 19 17.752 14.08 17.752 8.2C17.752 4.072 15.184 1.528 10.504 1.528H3.832L3.808 1.672C5.392 1.672 5.344 2.608 4.936 4.432L2.464 16.096C2.08 17.872 1.792 18.856 0.16 18.856L0.136 19H7.12ZM6.952 18.616C4.528 18.616 4.168 18.016 4.384 17.08L7.408 2.776C7.528 2.2 7.96 1.912 8.512 1.912H10.384C13.648 1.912 15.496 3.952 15.496 7.792C15.496 13 12.688 18.616 6.952 18.616ZM30.5258 7.984C30.5258 6.88 29.7098 6.136 27.9098 6.136C23.1578 6.136 20.4458 11.536 20.4458 15.352C20.4458 18.04 21.8138 19.312 23.7338 19.312C25.6058 19.312 27.4538 18.112 29.2058 15.4L29.0618 15.304C27.6698 16.984 26.0858 18.112 24.6218 18.112C23.2778 18.112 22.4858 17.128 22.4858 14.896C22.4858 14.224 22.5578 13.528 22.7018 12.88C27.4778 11.44 30.5258 10.168 30.5258 7.984ZM27.5258 6.496C28.4378 6.496 28.7258 7.12 28.7258 7.888C28.7258 9.88 26.7338 11.08 22.7978 12.472C23.5658 9.28 25.6538 6.496 27.5258 6.496ZM44.5187 15.52C43.6547 16.696 42.7187 17.656 42.2627 17.656C41.8547 17.656 42.0467 16.84 42.1187 16.528L44.2787 6.28H44.1587L42.8627 7.12C42.3587 6.448 41.4947 6.136 40.3907 6.136C35.9507 6.136 32.7347 11.416 32.7347 15.736C32.7347 18.04 33.6467 19.288 35.2067 19.288C37.1507 19.288 39.3107 17.392 40.7027 13.96L40.1027 16.744C39.8627 17.824 39.7427 19.288 40.9667 19.288C42.1187 19.288 43.4387 17.92 44.6387 15.616L44.5187 15.52ZM36.3107 18.112C35.3507 18.112 34.7747 17.128 34.7747 15.328C34.7747 11.416 37.3427 6.472 40.0067 6.472C41.2547 6.472 41.6147 7.528 41.6147 8.872C41.6147 9.376 41.5667 9.76 41.4947 10.168C40.5827 14.632 38.0627 18.112 36.3107 18.112ZM56.0326 6.136C53.8966 6.136 52.1206 9.376 50.8486 13.312L51.8566 8.68C52.1446 7.264 52.1446 6.136 51.0406 6.136C50.0566 6.136 48.8326 7.264 47.7766 9.328L47.8966 9.424C48.7606 8.296 49.3846 7.672 49.7206 7.672C50.1286 7.672 49.9846 8.296 49.8646 8.896L47.7286 19H49.6486C50.8006 13.624 52.6966 8.2 55.1686 8.2C55.4566 8.2 55.6966 8.248 55.9846 8.392H56.1286L57.0406 6.328C56.7046 6.16 56.3686 6.136 56.0326 6.136ZM77.5465 1.672C79.3705 1.84 78.8425 3.184 77.2585 6.016L71.8105 15.808L70.2025 4.048C69.9865 2.464 70.6585 1.768 72.0505 1.672L72.0745 1.528H66.6025L66.5785 1.672C67.5865 1.768 67.8505 2.584 68.1385 4.6L70.1785 19.288H70.3705L77.7385 6.136C79.3705 3.232 80.3545 1.864 81.5065 1.672L81.5305 1.528H77.5705L77.5465 1.672ZM91.4313 15.52C90.5673 16.696 89.6313 17.656 89.1753 17.656C88.7673 17.656 88.9593 16.84 89.0313 16.528L91.1913 6.28H91.0713L89.7753 7.12C89.2713 6.448 88.4073 6.136 87.3033 6.136C82.8633 6.136 79.6473 11.416 79.6473 15.736C79.6473 18.04 80.5593 19.288 82.1193 19.288C84.0633 19.288 86.2233 17.392 87.6153 13.96L87.0153 16.744C86.7753 17.824 86.6553 19.288 87.8793 19.288C89.0313 19.288 90.3513 17.92 91.5513 15.616L91.4313 15.52ZM83.2233 18.112C82.2633 18.112 81.6873 17.128 81.6873 15.328C81.6873 11.416 84.2553 6.472 86.9193 6.472C88.1673 6.472 88.5273 7.528 88.5273 8.872C88.5273 9.376 88.4793 9.76 88.4073 10.168C87.4953 14.632 84.9753 18.112 83.2233 18.112ZM95.4811 19.288C96.6811 19.288 98.0011 17.848 99.2011 15.592L99.0811 15.496C98.2411 16.624 97.2331 17.656 96.7771 17.656C96.3451 17.656 96.5371 16.84 96.6091 16.528L100.065 0.231998H99.9691L96.7771 0.904L96.7531 1.048C97.5211 1.24 97.8091 1.792 97.4731 3.304L94.6171 16.744C94.3771 17.824 94.2091 19.288 95.4811 19.288ZM114.244 15.52C113.068 17.104 112.3 17.752 111.94 17.752C111.532 17.752 111.676 17.104 111.796 16.528L113.956 6.376H113.836L111.94 6.688C110.572 13 107.332 17.872 105.46 17.872C104.332 17.872 104.596 16.432 104.956 14.872L106.372 8.68C106.708 7.24 106.636 6.136 105.484 6.136C104.548 6.136 103.348 7.264 102.292 9.328L102.412 9.424C103.276 8.296 103.9 7.672 104.26 7.672C104.644 7.672 104.476 8.32 104.356 8.896L103.036 14.68C102.46 17.176 102.292 19.288 104.284 19.288C106.708 19.288 109.252 15.856 111.028 11.104L109.804 16.744C109.516 18.16 109.54 19.288 110.668 19.288C111.82 19.288 113.164 17.92 114.364 15.616L114.244 15.52ZM127.28 7.984C127.28 6.88 126.464 6.136 124.664 6.136C119.912 6.136 117.2 11.536 117.2 15.352C117.2 18.04 118.568 19.312 120.488 19.312C122.36 19.312 124.208 18.112 125.96 15.4L125.816 15.304C124.424 16.984 122.84 18.112 121.376 18.112C120.032 18.112 119.24 17.128 119.24 14.896C119.24 14.224 119.312 13.528 119.456 12.88C124.232 11.44 127.28 10.168 127.28 7.984ZM124.28 6.496C125.192 6.496 125.48 7.12 125.48 7.888C125.48 9.88 123.488 11.08 119.552 12.472C120.32 9.28 122.408 6.496 124.28 6.496ZM139.017 17.656C138.609 17.656 138.777 16.84 138.849 16.528L142.305 0.231998H142.209L139.017 0.904L138.993 1.048C139.761 1.24 140.049 1.792 139.713 3.304L139.017 6.592C138.513 6.28 137.889 6.136 137.121 6.136C132.705 6.136 129.489 11.416 129.489 15.736C129.489 18.04 130.401 19.288 131.961 19.288C133.905 19.288 136.041 17.392 137.457 13.936L136.857 16.744C136.617 17.824 136.473 19.288 137.721 19.288C138.873 19.288 140.169 17.92 141.393 15.616L141.273 15.52C140.409 16.696 139.449 17.656 139.017 17.656ZM133.041 18.112C132.081 18.112 131.529 17.128 131.529 15.328C131.529 11.416 134.073 6.472 136.761 6.472C137.985 6.472 138.369 7.528 138.369 8.872C138.369 9.376 138.321 9.76 138.249 10.168C137.337 14.632 134.817 18.112 133.041 18.112ZM160.256 9.88C162.872 9.328 165.224 7.84 165.224 5.128C165.224 3.04 163.544 1.528 160.016 1.528H153.968L153.944 1.672C155.528 1.672 155.48 2.608 155.072 4.432L152.6 16.096C152.216 17.872 151.928 18.856 150.296 18.856L150.272 19H156.728C160.904 19 164.288 17.392 164.288 13.936C164.288 11.848 162.584 10.264 160.256 9.928V9.88ZM159.68 1.912C161.864 1.912 163.04 3.184 163.04 5.128C163.04 8.032 161.072 9.712 158 9.712H156.08L157.544 2.776C157.664 2.2 158.072 1.912 158.648 1.912H159.68ZM156.368 18.616C154.184 18.616 154.376 17.824 154.52 17.08L156.008 10.096H158C160.616 10.096 162.056 11.512 162.056 13.576C162.056 16.672 159.8 18.616 156.368 18.616ZM176.22 6.136C174.084 6.136 172.308 9.376 171.036 13.312L172.044 8.68C172.332 7.264 172.332 6.136 171.228 6.136C170.244 6.136 169.02 7.264 167.964 9.328L168.084 9.424C168.948 8.296 169.572 7.672 169.908 7.672C170.316 7.672 170.172 8.296 170.052 8.896L167.916 19H169.836C170.988 13.624 172.884 8.2 175.356 8.2C175.644 8.2 175.884 8.248 176.172 8.392H176.316L177.228 6.328C176.892 6.16 176.556 6.136 176.22 6.136ZM183.069 4.144C183.813 4.144 184.413 3.544 184.413 2.8C184.413 2.056 183.813 1.456 183.069 1.456C182.301 1.456 181.701 2.056 181.701 2.8C181.701 3.544 182.301 4.144 183.069 4.144ZM180.261 19.288C181.413 19.288 182.733 17.92 183.957 15.616L183.837 15.52C182.949 16.696 182.013 17.656 181.557 17.656C181.149 17.656 181.341 16.864 181.413 16.528L183.069 8.68C183.357 7.264 183.357 6.136 182.253 6.136C181.269 6.136 180.045 7.264 178.989 9.328L179.109 9.424C179.973 8.296 180.597 7.672 180.933 7.672C181.341 7.672 181.197 8.32 181.077 8.896L179.397 16.744C179.157 17.824 179.037 19.288 180.261 19.288ZM196.252 17.656C195.844 17.656 196.012 16.84 196.084 16.528L199.54 0.231998H199.444L196.252 0.904L196.228 1.048C196.996 1.24 197.284 1.792 196.948 3.304L196.252 6.592C195.748 6.28 195.124 6.136 194.356 6.136C189.94 6.136 186.724 11.416 186.724 15.736C186.724 18.04 187.636 19.288 189.196 19.288C191.14 19.288 193.276 17.392 194.692 13.936L194.092 16.744C193.852 17.824 193.708 19.288 194.956 19.288C196.108 19.288 197.404 17.92 198.628 15.616L198.508 15.52C197.644 16.696 196.684 17.656 196.252 17.656ZM190.276 18.112C189.316 18.112 188.764 17.128 188.764 15.328C188.764 11.416 191.308 6.472 193.996 6.472C195.22 6.472 195.604 7.528 195.604 8.872C195.604 9.376 195.556 9.76 195.484 10.168C194.572 14.632 192.052 18.112 190.276 18.112ZM211.534 7.984C211.534 6.88 210.718 6.136 208.918 6.136C204.166 6.136 201.454 11.536 201.454 15.352C201.454 18.04 202.822 19.312 204.742 19.312C206.614 19.312 208.462 18.112 210.214 15.4L210.07 15.304C208.678 16.984 207.094 18.112 205.63 18.112C204.286 18.112 203.494 17.128 203.494 14.896C203.494 14.224 203.566 13.528 203.71 12.88C208.486 11.44 211.534 10.168 211.534 7.984ZM208.534 6.496C209.446 6.496 209.734 7.12 209.734 7.888C209.734 9.88 207.742 11.08 203.806 12.472C204.574 9.28 206.662 6.496 208.534 6.496ZM212.879 22.24C214.775 21.952 216.359 20.488 216.359 18.544C216.359 17.176 215.447 16.336 214.487 16.336C213.743 16.336 213.215 16.84 213.215 17.56C213.215 18.016 213.479 18.592 214.247 18.784C214.751 18.904 215.399 19.096 215.375 19.768C215.351 20.872 213.887 21.856 212.855 22.096L212.879 22.24Z"
                fill="var(--color-121212)"
              />
            </svg>
            <div v-html="nl('page_welcome_msg_1')"></div>
            <ul>
              <li>
                <az-icon icon-class="icon_common_star"></az-icon>
                {{ nl('page_welcome_msg_2_1') }}
              </li>
              <li>
                <az-icon icon-class="icon_common_star"></az-icon>
                {{ nl('page_welcome_msg_2_2') }}
              </li>
              <li>
                <az-icon icon-class="icon_common_star"></az-icon>
                {{ nl('page_welcome_msg_2_3') }}
              </li>
            </ul>
            <div v-html="nl('page_welcome_msg_3')"></div>
            <svg id="icon-regards" width="146" height="43" viewBox="0 0 146 43" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.84 8.16C9.802 7.746 11.566 6.63 11.566 4.596C11.566 3.03 10.306 1.896 7.66 1.896H3.124L3.106 2.004C4.294 2.004 4.258 2.706 3.952 4.074L2.098 12.822C1.81 14.154 1.594 14.892 0.37 14.892L0.352 15H5.194C8.326 15 10.864 13.794 10.864 11.202C10.864 9.636 9.586 8.448 7.84 8.196V8.16ZM7.408 2.184C9.046 2.184 9.928 3.138 9.928 4.596C9.928 6.774 8.452 8.034 6.148 8.034H4.708L5.806 2.832C5.896 2.4 6.202 2.184 6.634 2.184H7.408ZM4.924 14.712C3.286 14.712 3.43 14.118 3.538 13.56L4.654 8.322H6.148C8.11 8.322 9.19 9.384 9.19 10.932C9.19 13.254 7.498 14.712 4.924 14.712ZM21.1405 6.738C21.1405 5.91 20.5285 5.352 19.1785 5.352C15.6145 5.352 13.5805 9.402 13.5805 12.264C13.5805 14.28 14.6065 15.234 16.0465 15.234C17.4505 15.234 18.8365 14.334 20.1505 12.3L20.0425 12.228C18.9985 13.488 17.8105 14.334 16.7125 14.334C15.7045 14.334 15.1105 13.596 15.1105 11.922C15.1105 11.418 15.1645 10.896 15.2725 10.41C18.8545 9.33 21.1405 8.376 21.1405 6.738ZM18.8905 5.622C19.5745 5.622 19.7905 6.09 19.7905 6.666C19.7905 8.16 18.2965 9.06 15.3445 10.104C15.9205 7.71 17.4865 5.622 18.8905 5.622ZM24.7592 15.216C26.6492 15.216 28.0352 13.956 28.0352 12.264C28.0352 11.04 27.3872 10.464 26.4152 9.672L25.9112 9.258C25.3172 8.754 24.7592 8.25 24.7592 7.368C24.7592 6.558 25.3352 5.694 26.2892 5.694C27.3692 5.694 28.1792 6.576 28.5032 7.458H28.6112L28.9532 6.09C28.4312 5.766 27.6032 5.352 26.6492 5.352C24.9392 5.352 23.7152 6.63 23.7152 8.214C23.7152 9.438 24.3272 9.978 24.9752 10.5L25.4792 10.914C26.3432 11.634 26.9732 12.156 26.9732 13.074C26.9732 14.064 26.2712 14.874 25.2632 14.874C24.1112 14.874 23.1032 13.956 22.7972 12.84H22.6892L22.2212 14.262C22.7072 14.802 23.6972 15.216 24.7592 15.216ZM36.9578 6.216L37.3538 5.568H34.3298L34.8158 3.21H34.7078C33.8078 4.884 32.9798 5.55 32.0978 5.928L31.8278 6.036L31.7738 6.216H32.7278L31.2878 12.93C31.0178 14.244 31.2518 15.216 32.2058 15.216C33.3578 15.216 34.8338 13.83 35.8778 11.886L35.7878 11.814C34.6178 13.38 33.6638 14.118 33.1418 14.118C32.6198 14.118 32.6558 13.434 32.7818 12.786L34.1678 6.216H36.9578ZM49.724 5.352C48.122 5.352 46.79 7.782 45.836 10.734L46.592 7.26C46.808 6.198 46.808 5.352 45.98 5.352C45.242 5.352 44.324 6.198 43.532 7.746L43.622 7.818C44.27 6.972 44.738 6.504 44.99 6.504C45.296 6.504 45.188 6.972 45.098 7.422L43.496 15H44.936C45.8 10.968 47.222 6.9 49.076 6.9C49.292 6.9 49.472 6.936 49.688 7.044H49.796L50.48 5.496C50.228 5.37 49.976 5.352 49.724 5.352ZM58.7049 6.738C58.7049 5.91 58.0929 5.352 56.7429 5.352C53.1789 5.352 51.1449 9.402 51.1449 12.264C51.1449 14.28 52.1709 15.234 53.6109 15.234C55.0149 15.234 56.4009 14.334 57.7149 12.3L57.6069 12.228C56.5629 13.488 55.3749 14.334 54.2769 14.334C53.2689 14.334 52.6749 13.596 52.6749 11.922C52.6749 11.418 52.7289 10.896 52.8369 10.41C56.4189 9.33 58.7049 8.376 58.7049 6.738ZM56.4549 5.622C57.1389 5.622 57.3549 6.09 57.3549 6.666C57.3549 8.16 55.8609 9.06 52.9089 10.104C53.4849 7.71 55.0509 5.622 56.4549 5.622ZM66.4276 5.838C65.9776 5.532 65.3656 5.352 64.6816 5.352C62.5756 5.352 60.9916 7.098 60.9916 9.096C60.9916 10.5 61.8376 11.472 63.1696 11.688C62.1436 11.922 61.2616 12.336 61.2616 13.2C61.2616 13.812 61.7296 14.154 62.3596 14.334L64.5736 14.928C65.6716 15.216 66.8236 15.576 66.8236 16.602C66.8236 17.79 65.2756 18.726 63.2956 18.726C61.3516 18.726 60.4336 17.862 60.4336 16.746C60.4336 15.918 60.9376 15.072 62.1076 14.496L62.0356 14.478L61.7476 14.532C60.1636 14.982 59.2636 16.008 59.2636 17.178C59.2636 18.42 60.2176 19.32 62.3056 19.32C65.1136 19.32 67.7956 17.754 67.7956 15.756C67.7956 14.478 66.4996 14.028 64.8976 13.578L63.0256 13.074C62.6656 12.966 62.4856 12.822 62.4856 12.57C62.4856 12.21 62.8096 12.03 63.8176 11.742C65.9056 11.724 67.4716 9.996 67.4716 7.98C67.4716 7.242 67.2376 6.63 66.8056 6.18L68.7856 6.36L69.2176 5.442L66.4276 5.838ZM63.7096 11.49C62.7916 11.49 62.3416 10.788 62.3416 9.654C62.3416 8.016 63.2236 5.604 64.7896 5.604C65.6896 5.604 66.1216 6.306 66.1216 7.422C66.1216 9.06 65.2576 11.49 63.7096 11.49ZM78.857 12.39C78.209 13.272 77.507 13.992 77.165 13.992C76.859 13.992 77.003 13.38 77.057 13.146L78.677 5.46H78.587L77.615 6.09C77.237 5.586 76.589 5.352 75.761 5.352C72.431 5.352 70.019 9.312 70.019 12.552C70.019 14.28 70.703 15.216 71.873 15.216C73.331 15.216 74.951 13.794 75.995 11.22L75.545 13.308C75.365 14.118 75.275 15.216 76.193 15.216C77.057 15.216 78.047 14.19 78.947 12.462L78.857 12.39ZM72.701 14.334C71.981 14.334 71.549 13.596 71.549 12.246C71.549 9.312 73.475 5.604 75.473 5.604C76.409 5.604 76.679 6.396 76.679 7.404C76.679 7.782 76.643 8.07 76.589 8.376C75.905 11.724 74.015 14.334 72.701 14.334ZM87.4924 5.352C85.8904 5.352 84.5584 7.782 83.6044 10.734L84.3604 7.26C84.5764 6.198 84.5764 5.352 83.7484 5.352C83.0104 5.352 82.0924 6.198 81.3004 7.746L81.3904 7.818C82.0384 6.972 82.5064 6.504 82.7584 6.504C83.0644 6.504 82.9564 6.972 82.8664 7.422L81.2644 15H82.7044C83.5684 10.968 84.9904 6.9 86.8444 6.9C87.0604 6.9 87.2404 6.936 87.4564 7.044H87.5644L88.2484 5.496C87.9964 5.37 87.7444 5.352 87.4924 5.352ZM95.8998 13.992C95.5938 13.992 95.7198 13.38 95.7738 13.146L98.3658 0.923999H98.2938L95.8998 1.428L95.8818 1.536C96.4578 1.68 96.6738 2.094 96.4218 3.228L95.8998 5.694C95.5218 5.46 95.0538 5.352 94.4778 5.352C91.1658 5.352 88.7538 9.312 88.7538 12.552C88.7538 14.28 89.4378 15.216 90.6078 15.216C92.0658 15.216 93.6678 13.794 94.7298 11.202L94.2798 13.308C94.0998 14.118 93.9918 15.216 94.9278 15.216C95.7918 15.216 96.7638 14.19 97.6818 12.462L97.5918 12.39C96.9438 13.272 96.2238 13.992 95.8998 13.992ZM91.4178 14.334C90.6978 14.334 90.2838 13.596 90.2838 12.246C90.2838 9.312 92.1918 5.604 94.2078 5.604C95.1258 5.604 95.4138 6.396 95.4138 7.404C95.4138 7.782 95.3778 8.07 95.3238 8.376C94.6398 11.724 92.7498 14.334 91.4178 14.334ZM101.709 15.216C103.599 15.216 104.985 13.956 104.985 12.264C104.985 11.04 104.337 10.464 103.365 9.672L102.861 9.258C102.267 8.754 101.709 8.25 101.709 7.368C101.709 6.558 102.285 5.694 103.239 5.694C104.319 5.694 105.129 6.576 105.453 7.458H105.561L105.903 6.09C105.381 5.766 104.553 5.352 103.599 5.352C101.889 5.352 100.665 6.63 100.665 8.214C100.665 9.438 101.277 9.978 101.925 10.5L102.429 10.914C103.293 11.634 103.923 12.156 103.923 13.074C103.923 14.064 103.221 14.874 102.213 14.874C101.061 14.874 100.053 13.956 99.7472 12.84H99.6392L99.1712 14.262C99.6572 14.802 100.647 15.216 101.709 15.216ZM107.122 17.43C108.544 17.214 109.732 16.116 109.732 14.658C109.732 13.632 109.048 13.002 108.328 13.002C107.77 13.002 107.374 13.38 107.374 13.92C107.374 14.262 107.572 14.694 108.148 14.838C108.526 14.928 109.012 15.072 108.994 15.576C108.976 16.404 107.878 17.142 107.104 17.322L107.122 17.43ZM12.232 28.896H3.214L2.422 31.596H2.53C3.88 29.544 4.528 29.184 6.328 29.184H6.868L4.636 39.75C4.348 41.082 4.096 41.892 2.872 41.892L2.854 42H7.048L7.066 41.892C5.842 41.892 5.932 41.082 6.22 39.75L8.47 29.184H8.992C10.828 29.184 11.314 29.544 11.8 31.596H11.908L12.232 28.896ZM21.7145 39.39C20.8145 40.578 20.2385 41.064 19.9685 41.064C19.6805 41.064 19.7885 40.578 19.8965 40.146L20.8865 35.808C21.3185 33.936 21.4265 32.352 19.9505 32.352C18.1325 32.352 16.2065 34.926 14.8925 38.49L17.1245 27.924H17.0525L14.6585 28.428L14.6225 28.536C15.2165 28.68 15.4145 29.094 15.1805 30.228L12.6965 42H14.1545C15.1265 37.428 17.5025 33.414 19.0505 33.414C19.8965 33.414 19.7165 34.494 19.4285 35.664L18.3845 40.308C18.1325 41.388 18.1685 42.216 19.0325 42.216C19.8785 42.216 20.8865 41.19 21.8045 39.462L21.7145 39.39ZM31.4483 33.738C31.4483 32.91 30.8363 32.352 29.4863 32.352C25.9223 32.352 23.8883 36.402 23.8883 39.264C23.8883 41.28 24.9143 42.234 26.3543 42.234C27.7583 42.234 29.1443 41.334 30.4583 39.3L30.3503 39.228C29.3063 40.488 28.1183 41.334 27.0203 41.334C26.0123 41.334 25.4183 40.596 25.4183 38.922C25.4183 38.418 25.4723 37.896 25.5803 37.41C29.1623 36.33 31.4483 35.376 31.4483 33.738ZM29.1983 32.622C29.8823 32.622 30.0983 33.09 30.0983 33.666C30.0983 35.16 28.6043 36.06 25.6523 37.104C26.2283 34.71 27.7943 32.622 29.1983 32.622ZM45.3544 28.68H45.2104L39.6664 38.544C38.4244 40.704 37.7044 41.748 36.8404 41.892L36.8224 42H39.7924L39.8104 41.892C38.4604 41.766 38.8384 40.758 40.0264 38.634L40.7104 37.41H44.9584L45.3184 40.11C45.4804 41.298 44.9944 41.82 43.9324 41.892L43.9144 42H48.0184L48.0364 41.892C47.2804 41.82 47.0824 41.208 46.8664 39.696L45.3544 28.68ZM44.1484 31.254L44.9044 36.978H40.9444L44.1484 31.254ZM58.2563 32.208C58.0043 32.568 57.5723 32.712 56.9783 32.712C56.1863 32.712 54.9083 32.352 53.9003 32.352C52.7483 32.352 51.9923 33.108 51.5603 34.332L51.2903 35.124H51.3983C51.9563 34.134 52.4603 33.666 53.5403 33.666C54.5663 33.666 55.5383 34.026 56.7083 34.044L50.7143 40.326C50.3543 40.65 50.1743 40.992 50.1743 41.37C50.1743 41.622 50.2823 41.91 50.4803 42.216H50.5883C50.5883 41.82 50.6063 41.514 50.7863 41.334C51.5603 41.334 53.6663 42.216 54.9803 42.216C56.5283 42.216 56.8523 41.046 57.1403 39.804L57.3203 38.994H57.2123C56.5823 40.488 56.1323 40.866 55.2503 40.866C54.0443 40.866 52.2443 40.11 51.3803 40.074L57.6803 33.45C58.0223 33.144 58.3643 32.604 58.3643 32.208H58.2563ZM68.6125 39.39C67.9645 40.272 67.2625 40.992 66.9205 40.992C66.6145 40.992 66.7585 40.38 66.8125 40.146L68.4325 32.46H68.3425L67.3705 33.09C66.9925 32.586 66.3445 32.352 65.5165 32.352C62.1865 32.352 59.7745 36.312 59.7745 39.552C59.7745 41.28 60.4585 42.216 61.6285 42.216C63.0865 42.216 64.7065 40.794 65.7505 38.22L65.3005 40.308C65.1205 41.118 65.0305 42.216 65.9485 42.216C66.8125 42.216 67.8025 41.19 68.7025 39.462L68.6125 39.39ZM62.4565 41.334C61.7365 41.334 61.3045 40.596 61.3045 39.246C61.3045 36.312 63.2305 32.604 65.2285 32.604C66.1645 32.604 66.4345 33.396 66.4345 34.404C66.4345 34.782 66.3985 35.07 66.3445 35.376C65.6605 38.724 63.7705 41.334 62.4565 41.334ZM78.2919 32.208C78.0399 32.568 77.6079 32.712 77.0139 32.712C76.2219 32.712 74.9439 32.352 73.9359 32.352C72.7839 32.352 72.0279 33.108 71.5959 34.332L71.3259 35.124H71.4339C71.9919 34.134 72.4959 33.666 73.5759 33.666C74.6019 33.666 75.5739 34.026 76.7439 34.044L70.7499 40.326C70.3899 40.65 70.2099 40.992 70.2099 41.37C70.2099 41.622 70.3179 41.91 70.5159 42.216H70.6239C70.6239 41.82 70.6419 41.514 70.8219 41.334C71.5959 41.334 73.7019 42.216 75.0159 42.216C76.5639 42.216 76.8879 41.046 77.1759 39.804L77.3559 38.994H77.2479C76.6179 40.488 76.1679 40.866 75.2859 40.866C74.0799 40.866 72.2799 40.11 71.4159 40.074L77.7159 33.45C78.0579 33.144 78.3999 32.604 78.3999 32.208H78.2919ZM83.1229 30.858C83.6809 30.858 84.1309 30.408 84.1309 29.85C84.1309 29.292 83.6809 28.842 83.1229 28.842C82.5469 28.842 82.0969 29.292 82.0969 29.85C82.0969 30.408 82.5469 30.858 83.1229 30.858ZM81.0169 42.216C81.8809 42.216 82.8709 41.19 83.7889 39.462L83.6989 39.39C83.0329 40.272 82.3309 40.992 81.9889 40.992C81.6829 40.992 81.8269 40.398 81.8809 40.146L83.1229 34.26C83.3389 33.198 83.3389 32.352 82.5109 32.352C81.7729 32.352 80.8549 33.198 80.0629 34.746L80.1529 34.818C80.8009 33.972 81.2689 33.504 81.5209 33.504C81.8269 33.504 81.7189 33.99 81.6289 34.422L80.3689 40.308C80.1889 41.118 80.0989 42.216 81.0169 42.216ZM93.478 33.738C93.478 32.91 92.866 32.352 91.516 32.352C87.952 32.352 85.918 36.402 85.918 39.264C85.918 41.28 86.944 42.234 88.384 42.234C89.788 42.234 91.174 41.334 92.488 39.3L92.38 39.228C91.336 40.488 90.148 41.334 89.05 41.334C88.042 41.334 87.448 40.596 87.448 38.922C87.448 38.418 87.502 37.896 87.61 37.41C91.192 36.33 93.478 35.376 93.478 33.738ZM91.228 32.622C91.912 32.622 92.128 33.09 92.128 33.666C92.128 35.16 90.634 36.06 87.682 37.104C88.258 34.71 89.824 32.622 91.228 32.622ZM111.415 28.896H102.397L101.605 31.596H101.713C103.063 29.544 103.711 29.184 105.511 29.184H106.051L103.819 39.75C103.531 41.082 103.279 41.892 102.055 41.892L102.037 42H106.231L106.249 41.892C105.025 41.892 105.115 41.082 105.403 39.75L107.653 29.184H108.175C110.011 29.184 110.497 29.544 110.983 31.596H111.091L111.415 28.896ZM117.985 33.738C117.985 32.91 117.373 32.352 116.023 32.352C112.459 32.352 110.425 36.402 110.425 39.264C110.425 41.28 111.451 42.234 112.891 42.234C114.295 42.234 115.681 41.334 116.995 39.3L116.887 39.228C115.843 40.488 114.655 41.334 113.557 41.334C112.549 41.334 111.955 40.596 111.955 38.922C111.955 38.418 112.009 37.896 112.117 37.41C115.699 36.33 117.985 35.376 117.985 33.738ZM115.735 32.622C116.419 32.622 116.635 33.09 116.635 33.666C116.635 35.16 115.141 36.06 112.189 37.104C112.765 34.71 114.331 32.622 115.735 32.622ZM128.48 39.39C127.832 40.272 127.13 40.992 126.788 40.992C126.482 40.992 126.626 40.38 126.68 40.146L128.3 32.46H128.21L127.238 33.09C126.86 32.586 126.212 32.352 125.384 32.352C122.054 32.352 119.642 36.312 119.642 39.552C119.642 41.28 120.326 42.216 121.496 42.216C122.954 42.216 124.574 40.794 125.618 38.22L125.168 40.308C124.988 41.118 124.898 42.216 125.816 42.216C126.68 42.216 127.67 41.19 128.57 39.462L128.48 39.39ZM122.324 41.334C121.604 41.334 121.172 40.596 121.172 39.246C121.172 36.312 123.098 32.604 125.096 32.604C126.032 32.604 126.302 33.396 126.302 34.404C126.302 34.782 126.266 35.07 126.212 35.376C125.528 38.724 123.638 41.334 122.324 41.334ZM145.305 39.39C144.423 40.578 143.829 41.064 143.559 41.064C143.271 41.064 143.379 40.578 143.487 40.146L144.477 35.808C144.909 33.936 145.035 32.352 143.541 32.352C141.723 32.352 139.779 34.962 138.465 38.544L139.077 35.808C139.473 33.936 139.617 32.352 138.123 32.352C136.323 32.352 134.397 34.908 133.083 38.472L133.983 34.26C134.199 33.198 134.199 32.352 133.371 32.352C132.633 32.352 131.715 33.198 130.923 34.746L131.013 34.818C131.661 33.972 132.129 33.504 132.381 33.504C132.687 33.504 132.579 33.99 132.489 34.422L130.887 42H132.327C133.317 37.428 135.693 33.414 137.241 33.414C138.087 33.414 137.871 34.494 137.619 35.664L136.305 42H137.745C138.735 37.41 141.093 33.414 142.641 33.414C143.505 33.414 143.307 34.494 143.037 35.664L141.975 40.308C141.723 41.388 141.777 42.216 142.641 42.216C143.469 42.216 144.477 41.19 145.395 39.462L145.305 39.39Z"
                fill="var(--color-121212)"
              />
            </svg>
            <az-button
              v-track.view.click="getBiParams('claimtheoffer', 'button')"
              @click="clickClaimTheOffer"
              :disabled="loading"
              class="btn btn-default btn-submit"
            >
              CLAIM YOUR OFFERS
            </az-button>
          </div> -->
        </div>
        <div class="welcome-content-main">
          <!-- <div v-track.view.click="getBiParams('compareDB', 'module')" class="welcome-content-vs">
            <img src="https://cdn-1.azazie.com/upimg/userfiles/images/1/a0/91/9c3456c97ce639dff6d1f274a328a091.jpg" alt="azazie" />
          </div> -->
          <!-- <div ref="promoCodes" v-if="davidBridalCoupons.length">
            <david-bridal-promo-codes :coupons="davidBridalCoupons" @clickShop="clickShop"></david-bridal-promo-codes>
          </div>
          <div ref="specialPackage" v-else>
            <special-package></special-package>
          </div> -->
          <div class="sale-list">
            <div ref="sale_wd" v-track.view.click="getBiParams('bride', 'all')" class="sale-list-item">
              <h2 ref="bridalGowns">BRIDAL GOWNS</h2>
              <product-swiper :prodList="weddingDresses" :showArrowIcon="false">
                <div v-swiper:module_wedding_swiper="swiperOption" class="swiper-container">
                  <div class="swiper-wrapper product-swiper-viewport">
                    <div
                      v-for="(product, productIndex) in weddingDresses"
                      :key="productIndex"
                      v-track.view.click="
                        getBiParams('bride', 'items', { position: productIndex, color: product.colorReal, goodsId: product.goodsId })
                      "
                      class="goods-item swiper-slide"
                    >
                      <product-swiper-item :item="product" :addSuffix="true" :stickerClass="`cat-product-item-icon`"></product-swiper-item>
                    </div>
                    <div v-track.view.click="getBiParams('bride', 'button')" class="goods-item swiper-slide view-more-block">
                      <div class="view-more">
                        <a :href="countryUrl('/all/wedding-dresses')" target="_blank">
                          <img
                            :src="
                              addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/99/1c/143ce11b5ffd67459d56208b9192991c.jpg')
                            "
                            alt="azazie bride more"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </product-swiper>
            </div>
            <div ref="sale_bd" v-track.view.click="getBiParams('bridesmaid', 'all')" class="sale-list-item">
              <h2>Bridesmaids</h2>
              <product-swiper :prodList="bridesmaidDresses" :showArrowIcon="false">
                <div v-swiper:module_bridesmaid_swiper="swiperOption" class="swiper-container">
                  <div class="swiper-wrapper product-swiper-viewport">
                    <div
                      v-for="(product, productIndex) in bridesmaidDresses"
                      :key="productIndex"
                      v-track.view.click="
                        getBiParams('bridesmaid', 'items', { position: productIndex, color: product.colorReal, goodsId: product.goodsId })
                      "
                      class="goods-item swiper-slide"
                    >
                      <product-swiper-item :item="product" :addSuffix="true" :stickerClass="`cat-product-item-icon`"></product-swiper-item>
                    </div>
                    <div v-track.view.click="getBiParams('bridesmaid', 'button')" class="goods-item swiper-slide view-more-block">
                      <div class="view-more">
                        <a :href="countryUrl('/all/bridesmaid-dresses')" target="_blank">
                          <img
                            :src="
                              addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/a8/1d/4b53e37a90969006af37b7cbede8a81d.jpg')
                            "
                            alt="azazie bridesmaid more"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </product-swiper>
            </div>
            <div ref="sale_mom" v-track.view.click="getBiParams('moms', 'all')" class="sale-list-item">
              <h2>Moms</h2>
              <product-swiper :prodList="momBridesmaidDresses" :showArrowIcon="false">
                <div v-swiper:module_mom_bridesmaid_swiper="swiperOption" class="swiper-container">
                  <div class="swiper-wrapper product-swiper-viewport">
                    <div
                      v-for="(product, productIndex) in momBridesmaidDresses"
                      :key="productIndex"
                      v-track.view.click="
                        getBiParams('moms', 'items', { position: productIndex, color: product.colorReal, goodsId: product.goodsId })
                      "
                      class="goods-item swiper-slide"
                    >
                      <product-swiper-item :item="product" :addSuffix="true" :stickerClass="`cat-product-item-icon`"></product-swiper-item>
                    </div>
                    <div v-track.view.click="getBiParams('moms', 'button')" class="goods-item swiper-slide view-more-block">
                      <div class="view-more">
                        <a :href="countryUrl('/all/mother-of-the-bride-dresses')" target="_blank">
                          <img
                            :src="
                              addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/14/78/ea877909de64bcac76e6bc07bc561478.jpg')
                            "
                            alt="azazie monms more"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </product-swiper>
            </div>
            <div ref="sale_sod" v-track.view.click="getBiParams('sod', 'all')" class="sale-list-item">
              <h2>SPECIAL OCCASION</h2>
              <product-swiper :prodList="sodDresses" :showArrowIcon="false">
                <div v-swiper:module_sod_swiper="swiperOption" class="swiper-container">
                  <div class="swiper-wrapper product-swiper-viewport">
                    <div
                      v-for="(product, productIndex) in sodDresses"
                      :key="productIndex"
                      v-track.view.click="
                        getBiParams('sod', 'items', { position: productIndex, color: product.colorReal, goodsId: product.goodsId })
                      "
                      class="goods-item swiper-slide"
                    >
                      <product-swiper-item :item="product" :addSuffix="true" :stickerClass="`cat-product-item-icon`"></product-swiper-item>
                    </div>
                    <div v-track.view.click="getBiParams('sod', 'button')" class="goods-item swiper-slide view-more-block">
                      <div class="view-more">
                        <a :href="countryUrl('/all/special-occasion-dresses')" target="_blank">
                          <img
                            :src="
                              addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/7b/f3/937f13e8bfe09260c36e660fd90c7bf3.jpg')
                            "
                            alt="azazie sod more"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </product-swiper>
            </div>
          </div>
        </div>
        <index-reviews-b :item="{ bannerList }" :skeleton="false"></index-reviews-b>
        <div v-track.view.click="getBiParams('howitworks', 'module')" class="welcome-content-tips">
          <img
            :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/1/12/f0/dabe3d735c0d5e0dfbc1e8c11a4412f0.jpg')"
            alt="how it works"
          />
        </div>
        <div class="index-sellpoint">
          <a href="/sample-dresses/how-it-works" aria-label="At-Home Try On’s" target="_blank" class="az_v_directive_track">
            <img
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/4d/fe/6f49369276c5f434d3b8985c3ae34dfe.jpg')"
              alt="At-Home Try On’s"
            />
          </a>
          <a
            :href="getSupportUrl(`/articles/207213726`, `/articles/8076729`)"
            aria-label="Free Custom Sizing"
            target="_blank"
            class="az_v_directive_track"
            ><img
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/28/2e/9a8213d8e3f66ab5b8cb86917e75282e.jpg')"
              alt="Free Custom Sizing"
            />
          </a>
          <a href="/all/bridesmaids-bridal-party" aria-label="700+ styles and 70 colors" target="_blank" class="az_v_directive_track"
            ><img
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/d7/0b/f7480e0594e8817a9cb545b00c4cd70b.jpg')"
              alt="700+ styles and 70 colors"
          /></a>
          <a href="/promotion/free-swatch" aria-label="3 Free Swatches" target="_blank" class="az_v_directive_track"
            ><img
              :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/22/a4/260bd318ef556aafb4ded4d25dec22a4.jpg')"
              alt="3 Free Swatches"
            />
          </a>
        </div>
        <div v-track.view.click="getBiParams('featuredin', 'module')" class="index-featuredin">
          <h2>FEATURED IN...</h2>
          <div>
            <a href="/press" aria-label="logo"
              ><img
                :src="addWebpSuffix('https://cdn-1.azazie.com/upimg/userfiles/images/68/3b/0b3301f7f28ba855ea3fce7cf154683b.jpg')"
                alt="logo"
            /></a>
          </div>
        </div>
      </div>
      <div v-show="showFixedBottomBtn && !showShoppingForDialog" class="btn-fixed-bottom">
        <az-button v-track.view.click="getBiParams('dbwelcome', 'button_bottom')" @click="clickCliaimOffersFixedBtn" class="btn btn-theme">
          CLAIM your offers
        </az-button>
      </div>
    </main-app>
  </div>
</template>

<script>
import mainApp from '@/components/Main'
import AzButton from '@/components/az-ui/Button/AzButton'
import productSwiper from '@/components/product/ProductSwiper'
import ProductSwiperItem from '@/components/product/productSwiperItem'
// import SpecialPackage from '@/components/landingPage/SpecialPackage'
import { init } from '@/plugins/commonAsyncData'
import { getHeadJson } from '@/plugins/head'
import { mapState } from 'vuex'
import AzCountDown from '@/components/az-ui/AzCountDown'
import IndexReviewsB from '@/components/indexNew/IndexReviewsB'

export default {
  name: 'Welcome',
  components: {
    mainApp,
    AzButton,
    AzCountDown,
    productSwiper,
    ProductSwiperItem,
    // SpecialPackage,
    IndexReviewsB
  },
  data() {
    return {
      bannerList: [
        {
          bannerType: 'carousel',
          goodsName: 'AZAZIE EVALLEEN',
          goodsScore: '5',
          commentDate: '28/09/22',
          commentText:
            'I loved my dress! It was absolutely beautiful, the color was perfect. The sizing in the bust was larger than I expected and I had to have it taken in a bit. Other than that I loved my dress!',
          commentUserName: 'pandabehrest',
          imageLabel: 'AZAZIE MANILA',
          imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/0-9A-Za-z-MOB/43/97/68e147ee344e709546ecc6c647ac4397.webp',
          linkUrl: '/products/azazie-evalleen-bridesmaid-dress?color=agave&from_color_family=trendingcolors2023',
          desc: 'AZAZIE EVALLEEN',
          _imgLoaded: true
        },
        {
          bannerType: 'carousel',
          goodsName: 'AZAZIE SINGER',
          goodsScore: '5',
          commentDate: '17/10/22',
          commentText:
            "Loved this dress! Was perfect for my daughter's wedding. I did custom fitting, and the fit was perfection. The dress was comfy and classy!",
          commentUserName: 'jmthomas',
          imageLabel: 'AZAZIE SINGER',
          imageUrl: 'https://cdn-1.azazie.com/upimg/h65/23/ed/8a00263e9a02abf4559fd5e1c9b923ed.jpg',
          linkUrl: 'https://www.azazie.com/products/azazie-singer-mother-of-the-bride-dress?color=desert-rose&from=search',
          desc: 'AZAZIE SINGER',
          _imgLoaded: true
        },
        {
          bannerType: 'carousel',
          goodsName: 'AZAZIE VIVIENNE WEDDING DRESS',
          goodsScore: '5',
          commentDate: '08/06/22',
          commentText: 'I loved this dress! I bought it when there was no review and I was worried how it would be.',
          commentUserName: 'setarehbakhshian',
          imageLabel: 'AZAZIE CELANDINE WEDDING DRESS',
          linkUrl: '/products/azazie-celandine-wedding-dress?color=diamond-white%2Fchampagne&subsite=bridal',
          desc: 'AZAZIE CELANDINE WEDDING DRESS',
          imageUrl: 'https://cdn-1.azazie.com/upimg/userfiles/images/dc/e3/85c5c362752238753ba93080f5e2dce3.jpg',
          _imgLoaded: true
        },
        {
          bannerType: 'carousel',
          goodsName: "GENTLEMEN'S COLLECTION MATTE SATIN SKINNY TIE",
          goodsScore: '5',
          commentDate: '16/10/22',
          commentText:
            'These ties were perfect for our wedding day! The color match to the bridesmaid dresses was very nice as well because everyone was a perfect match. The quality of the satin ties were very nice too. I would highly recommend getting both ties and bridesmaid dresses from Azazie.',
          commentUserName: 'kgashleyautumn1',
          imageLabel: "GENTLEMEN'S COLLECTION MATTE SATIN SKINNY TIE",
          linkUrl: '/products/gentlemen-collection-matte-satin-skinny-tie?color=TERRACOTTA',
          desc: "GENTLEMEN'S COLLECTION MATTE SATIN SKINNY TIE",
          imageUrl: 'https://cdn-1.azazie.com/upimg/h65/54/49/3134dd5fdda04256cd51dee078135449.jpg.webp',
          _imgLoaded: true
        },
        {
          bannerType: 'carousel',
          goodsName: 'Feeling Like Forever Fuchsia Floral Print Maxi Dress',
          goodsScore: 5,
          commentText:
            'Beautiful, bright, summer dress! It will fit any figure! The material is wonderful, not dense, just for warm weather. The top of the dress can be tied on the dressing and worn both to the beach and to the city!',
          commentUserName: 'ulitochka',
          imageLabel: 'Feeling Like Forever Fuchsia Floral Print Maxi Dress',
          imageUrl: 'https://cdn-1.azazie.com/upimg/h65/06/5d/b11f5513f7ca0a9089fd3d277a18065d.jpg',
          linkUrl: '/products/feeling-like-forever-fuchsia-floral-print-maxi-sod-dress/212466?sourceTag=events_dresses',
          el: null,
          desc: 'Feeling Like Forever Fuchsia Floral Print Maxi Dress',
          _imgLoaded: true
        }
      ],
      swiperOption: {
        slidesPerView: 6,
        spaceBetween: 15,
        slidesPerGroup: 6,
        simulateTouch: false
      },
      loading: false,
      showFixedBottomBtn: false // 是否展示吸底按钮
    }
  },
  computed: {
    ...mapState({
      davidBridalCoupons: (state) => state.userInfo.davidBridalCoupons
    }),
    bannerUrl() {
      const bannerMap = {
        bd: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/ee/08/79979b1bbfbab6bd4b5b70a87552ee08.jpg',
        wd: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/38/41/24ca5ca059c5e96e1559d78f4ee03841.jpg',
        sod: 'https://cdn-1.azazie.com/upimg/userfiles/images/1/31/da/2c814415fe4cdc62dc09a36c0bc531da.jpg'
      }
      return (
        (this.bannerType && bannerMap[this.bannerType]) ||
        'https://cdn-1.azazie.com/upimg/userfiles/images/1/15/49/003c078fc9993b07af1b2770c8e81549.jpg'
      )
    },
    endTime() {
      return this.serverTime.split(' ')[0] + ' 23:59:59'
    }
  },
  watch: {
    // davidBridalCoupons(val) {
    //   if (val) {
    //     this.$nextTick(() => {
    //       this.$refs.promoCodes.scrollIntoView({ block: 'center', behavior: 'smooth' })
    //     })
    //   }
    // }
  },
  async asyncData(context) {
    try {
      const commonAsyncData = await init(context)
      if (!commonAsyncData) return
      const res = await context.$axios.$get('/1.0/landing-page/davids-bridal/info')
      if (res.code != 0) {
        context.redirect(302, context.store.state.currentCountryUrl + '/')
        return
      }
      const { weddingDresses, bridesmaidDresses, momBridesmaidDresses, sodDresses } = res.data
      context.store.commit('setJsKey', 'welcome')
      return {
        ...commonAsyncData,
        weddingDresses,
        bridesmaidDresses,
        momBridesmaidDresses,
        sodDresses,
        bannerType: context.route.query.banner
      }
    } catch (error) {
      if (!/axios/.test(error)) {
        context.app.$throw(error, { $options: { name: context.route.name }, $route: context.route }, 'asyncdata')
      }
      context.error({
        statusCode: 200,
        message: 'service are unavailable temporarily, please refresh page!'
      })
    }
  },
  head() {
    try {
      return getHeadJson(this)
    } catch (e) {
      this.$throw(e, this, 'head')
    }
  },
  mounted() {
    this.buryPoint(this, 'events', [
      {
        ec: 'product',
        el: 'dbwelcome',
        ea: 'page',
        param1: (location && location.href) || '-1'
      }
    ])
    // document.querySelector('#welcome_fill_form').addEventListener('click', () => {
    //   this.clickClaimTheOffer()
    // })
    // 如果路径中存在特殊标识，滚动到bridal gowns
    // if (this.$route.query.bridal_gowns) {
    //   this.$refs.bridalGowns.scrollIntoView({ block: 'center', behavior: 'smooth' })
    // }
    // 弹框一进页面弹
    this.$store.commit('setShowShoppingForDialog', true)
    this.$cookie.setCookie('shoppingForDialogOpened', 1)
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    getBiParams(ec, el, msg = {}) {
      if (process.server) return
      return {
        common: {
          ec,
          el,
          msg: msg || {}
        }
      }
    },
    // 处理页面滚动监听
    handleScroll() {
      // 页面最大滚动距离，超出此距离后显示吸底按钮，否则，隐藏
      // const maxScroll = this.$refs.specialPackage.offsetTop + 194
      const maxScroll = 194
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= maxScroll) {
        this.showFixedBottomBtn = true
      } else {
        this.showFixedBottomBtn = false
      }
    },
    // 点击第一屏幕的按钮，滚动页面到special package
    clickClaimTheOffer() {
      const high = this.$refs.specialPackage.offsetTop - 70
      this.scrollToSmoothly(high, 1000)
    },
    scrollToSmoothly(pos, time) {
      const currentPos = window.pageYOffset
      let start = null
      if (time == null) time = 500
      pos = +pos
      time = +time
      window.requestAnimationFrame(function step(currentTime) {
        start = !start ? currentTime : start
        const progress = currentTime - start
        if (currentPos < pos) {
          window.scrollTo(0, ((pos - currentPos) * progress) / time + currentPos)
        } else {
          window.scrollTo(0, currentPos - ((currentPos - pos) * progress) / time)
        }
        if (progress < time) {
          window.requestAnimationFrame(step)
        } else {
          window.scrollTo(0, pos)
        }
      })
    },
    // 根据类别点击shop now跳转
    clickShop() {
      if (this.bannerType && this.$refs[`sale_${this.bannerType}`]) {
        this.$refs[`sale_${this.bannerType}`].scrollIntoView({ block: 'center', behavior: 'smooth' })
      } else {
        this.$refs.sale_wd.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
    },
    // 点击吸底按钮，弹出邮箱操作弹框
    clickCliaimOffersFixedBtn() {
      this.$store.commit('setShowShoppingForDialog', true)
    }
    // 邮箱订阅成功后，页面滚动到券显示位置
    // handleSubOperations() {
    //   this.$nextTick(() => {
    //     const high = this.$refs.promoCodes.offsetTop - 70
    //     this.scrollToSmoothly(high, 1000)
    //     this.showFixedBottomBtn = false
    //   })
    // },
  }
}
</script>
<style lang="less" scoped>
#welcome {
  h2 {
    font-family: @font-Ivy-Mode-400;
    font-size: 36px;
    line-height: 45px;
    font-weight: 400;
    text-align: center;
    margin-bottom: 30px;
    text-transform: uppercase;
  }
  .welcome-content-header {
    position: relative;
    // background: url(https://cdn-1.azazie.com/upimg/userfiles/images/1/0a/d1/7cb5de28966544087f51f9fd757e0ad1.jpg) no-repeat top;
    // background-size: 100% auto;
    // overflow: hidden;
    cursor: pointer;
    .welcome-count-down-bg {
      width: 50%;
      background: transparent;
      position: absolute;
      height: 100%;
      top: 0;
      right: 0;
    }
    &.bd,
    &.sod {
      .welcome-count-down {
        left: 0;
        width: 100%;
        bottom: 29%;
      }
    }
    .welcome-count-down {
      position: absolute;
      bottom: 21%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      > span {
        font-size: 18px;
        margin-right: 10px;
      }
      /deep/ .time {
        width: 40px;
        height: 35px;
        line-height: 35px;
        font-size: 24px;
        .d {
          font-size: 18px;
          right: 8px;
          top: 8px;
        }
      }
    }
    img {
      width: 100%;
      display: block;
    }
    .welcome-content-header-msg {
      width: 1400px;
      background: @bg-color;
      margin: auto;
      margin-top: 85px;
      left: 0;
      right: 0;
      padding: 40px 6.9%;
      box-sizing: border-box;
      /deep/ p {
        font-size: 16px;
        line-height: 22px;
        margin-top: 18px;
      }
      /deep/ a {
        color: @theme-color;
        cursor: pointer;
        border-bottom: 1px solid @theme-color;
      }
      ul {
        margin: 18px 0;
        li {
          font-size: 16px;
          line-height: 22px;
          margin-top: 10px;
        }
      }
      #icon-regards {
        margin-top: 18px;
      }
      .btn-submit {
        width: 300px;
        height: 60px;
        display: block;
        margin: auto;
        margin-top: 18px;
      }
    }
    @media screen and (max-width: 1700px) {
      .welcome-content-header-msg {
        margin-top: 55px;
      }
    }
  }
  .welcome-content-main {
    margin-top: 40px;
    .welcome-content-vs {
      img {
        width: 62.5%;
        margin: auto;
        display: block;
      }
    }

    .sale-list {
      margin-top: 40px;
      .sale-list-item {
        margin-top: 10px;
        padding: 40px 7%;
        overflow: hidden;
        &:nth-child(2n + 1) {
          background: @bg-color;
        }
      }

      .view-more-block {
        height: auto;
        .view-more {
          // background-color: #f6f6f6;
          // height: calc(100% - 45px);
          // align-items: center;
          // justify-content: center;
          // display: flex;
          img {
            width: 100%;
          }
          .view-more-text {
            text-transform: uppercase;
            border-bottom: 1px solid var(--color-121212);
            padding-bottom: 2px;
            font-size: 16px;
            line-height: 20px;
            color: var(--color-121212);
            font-family: @font-Ivy-Mode-400;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1700px) {
    .welcome-content-main {
      margin-top: 50px;
    }
  }
  /deep/ .index-reviews-b {
    margin-top: 10px;
  }
  .welcome-content-tips {
    margin: auto;
    margin-top: 50px;
    max-width: 1920px;
    img {
      width: 100%;
      margin: auto;
      display: block;
    }
  }
  .index-sellpoint {
    margin-top: 50px;
    background: var(--color-f1e9e6);
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      width: 16.25%;
      max-width: 312px;
      max-height: 150px;
      border-right: 5px solid #fff;
      &:last-of-type {
        border: none;
      }
    }
    img {
      width: 100%;
    }
  }
  .index-featuredin {
    margin-top: 50px;
    margin-bottom: 80px;
    font-family: @font-Ivy-Mode;
    font-size: 36px;
    line-height: 45px;
    text-align: center;
    text-transform: uppercase;
    h2 {
      margin-bottom: 30px;
    }
    img {
      width: 83.33%;
      max-width: 1600px;
      margin: 0 auto;
    }
  }
  .btn-fixed-bottom {
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background: #ffffff;
    box-shadow: 0px -8px 16px rgba(0, 0, 0, 0.25);
    padding: 22px 0px 21px;
    text-align: center;
    z-index: 3;
    .btn {
      width: 340px;
      height: 57px;
      font-size: 20px;
      line-height: 27px;
      letter-spacing: 0.1em;
    }
  }
}
</style>
