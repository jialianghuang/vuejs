<template>
  <div id="sizeChartDialog" class="size-fit-dialog">
    <h2 class="size_chart size_title">{{ nl('page_size_size_fit') }}</h2>
    <div class="tabs tabs_new">
      <span @click="clickTab = 'bridesmaid'" :class="{ active: clickTab == 'bridesmaid' }" class="tab" data-tab-name="bridesmaid">
        {{ nl('page_category_bridemaids') }}
      </span>
      <span @click="clickTab = 'brides'" :class="{ active: clickTab == 'brides' }" class="tab" data-tab-name="brides">
        {{ nl('page_category_bride') }}
      </span>
      <span
        @click="clickTab = 'junior_bridesmaid'"
        :class="{ active: clickTab == 'junior_bridesmaid' }"
        class="tab"
        data-tab-name="junior_bridesmaid"
        >{{ nl('page_category_junior_bridesmaid') }}</span
      >
      <span
        @click="clickTab = 'flower_girl'"
        :class="{ active: clickTab == 'flower_girl' }"
        v-if="country == 'US'"
        class="tab"
        data-tab-name="flower_girl"
        >{{ nl('page_category_flower_girl') }}</span
      >
      <span
        @click="clickTab = 'mother_of_the_bride'"
        :class="{ active: clickTab == 'mother_of_the_bride' }"
        class="tab"
        data-tab-name="mother_of_the_bride"
        >{{ nl('page_category_bride_mother') }}</span
      >
      <span @click="clickTab = 'maternity'" :class="{ active: clickTab == 'maternity' }" class="tab" data-tab-name="maternity">
        {{ nl('page_common_maternity') }}
      </span>
      <span @click="clickTab = 'modest'" :class="{ active: clickTab == 'modest' }" class="tab" data-tab-name="modest">
        {{ nl('page_common_modest') }}
      </span>
      <span @click="clickTab = 'veil'" :class="{ active: clickTab == 'veil' }" class="tab" data-tab-name="veil">
        {{ nl('page_category_wedding_veils') }}
      </span>
      <span @click="clickTab = 'vest'" :class="{ active: clickTab == 'vest' }" class="tab" data-tab-name="vest">
        {{ nl('page_category_vests') }}
      </span>
    </div>
    <div v-if="!['US'].includes(country)" class="switch_unit_box">
      <span class="unit">IN</span>
      <div :class="[sizeType == 'inch' ? 'inch' : 'cm']" @click="sizeType = sizeType == 'inch' ? 'cm' : 'inch'" class="switch_unit">
        <span class="selected_icon_bg_left selected_icon_bg"></span>
        <span class="selected_icon_bg_right selected_icon_bg"></span>
        <span class="selected_icon"></span>
      </div>
      <span class="unit">CM</span>
    </div>
    <div v-show="sizeType == 'cm'" class="content cm_content" data-tab-content>
      <div v-show="clickTab == 'bridesmaid'" class="bridesmaid">
        <h2 class="size_chart size_chart_title">{{ nl('page_goods_size_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th width="18%">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="32">81</td>
                <td data-value="33">84</td>
                <td data-value="34">86</td>
                <td data-value="35">89</td>
                <td data-value="36">91</td>
                <td data-value="37.5">95</td>
                <td data-value="39">99</td>
                <td data-value="41">104</td>
                <td data-value="43.25">110</td>
                <td data-value="45.5">116</td>
                <td data-value="47.75">121</td>
                <td data-value="50">127</td>
                <td data-value="53">135</td>
                <td data-value="56">142</td>
                <td data-value="59">150</td>
                <td data-value="63">160</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="25.5">65</td>
                <td data-value="26.5">67</td>
                <td data-value="27.5">70</td>
                <td data-value="28.5">72</td>
                <td data-value="29.5">75</td>
                <td data-value="31">79</td>
                <td data-value="32.5">83</td>
                <td data-value="34.75">88</td>
                <td data-value="37.25">95</td>
                <td data-value="39.75">101</td>
                <td data-value="42.25">107</td>
                <td data-value="44.75">114</td>
                <td data-value="48">122</td>
                <td data-value="51.25">130</td>
                <td data-value="54.5">138</td>
                <td data-value="58.75">149</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="35.5">90</td>
                <td data-value="36.5">93</td>
                <td data-value="37.5">95</td>
                <td data-value="38.5">98</td>
                <td data-value="39.5">100</td>
                <td data-value="41">104</td>
                <td data-value="42.5">108</td>
                <td data-value="44.5">113</td>
                <td data-value="46.75">119</td>
                <td data-value="49">124</td>
                <td data-value="51.25">130</td>
                <td data-value="53.5">136</td>
                <td data-value="56.5">144</td>
                <td data-value="59.5">151</td>
                <td data-value="62.5">159</td>
                <td data-value="66.5">169</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note1') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_size_dress_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-dress-length">
            <thead>
              <tr>
                <th colspan="2">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr class="hg-35">
                <th colspan="2">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_mini') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/short_mini.jpg" alt="short mini" />
                </td>
                <td data-value="33.5">85</td>
                <td data-value="33.5">85</td>
                <td data-value="33.5">85</td>
                <td data-value="34">86</td>
                <td data-value="34">86</td>
                <td data-value="34">86</td>
                <td data-value="34">86</td>
                <td data-value="35">89</td>
                <td data-value="35">89</td>
                <td data-value="35">89</td>
                <td data-value="35">89</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_knee_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td data-value="38">97</td>
                <td data-value="38">97</td>
                <td data-value="38">97</td>
                <td data-value="38">97</td>
                <td data-value="38.5">98</td>
                <td data-value="38.5">98</td>
                <td data-value="38.5">98</td>
                <td data-value="38.5">98</td>
                <td data-value="39">99</td>
                <td data-value="39">99</td>
                <td data-value="39">99</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_tea_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td data-value="45.5">116</td>
                <td data-value="45.5">116</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="47">119</td>
                <td data-value="47">119</td>
                <td data-value="48">122</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ankle_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
                <td data-value="53">135</td>
                <td data-value="53">135</td>
                <td data-value="53.5">136</td>
                <td data-value="53.5">136</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
                <td data-value="55">140</td>
                <td data-value="55">140</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/floor_length.jpg" alt="floor length" />
                </td>
                <td data-value="58">147</td>
                <td data-value="58">147</td>
                <td data-value="59">150</td>
                <td data-value="59">150</td>
                <td data-value="60">152</td>
                <td data-value="60">152</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="size_chart_note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2_cm') }}
        </p>
        <h2 class="train_length_chart size_chart_title">{{ nl('page_size_train_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_size_train') }}</th>
                <td>{{ nl('page_size_sweep_train') }}</td>
                <td>{{ nl('page_size_court_train') }}</td>
                <td>{{ nl('page_size_chapel_train') }}</td>
                <td>{{ nl('page_size_cathedral_train') }}</td>
                <td>{{ nl('page_size_royal_train') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_cm') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/sweep_train.jpg" alt="sweep train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/court_train.jpg" alt="court train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/chapel_train.jpg" alt="chapel train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/cathedral_train.jpg" alt="cathedral train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/royal_train.jpg" alt="royal train" />
                </td>
              </tr>
              <tr>
                <td data-value="12">30</td>
                <td data-value="18">46</td>
                <td data-value="24">61</td>
                <td data-value="32">81</td>
                <td data-value="48">122</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note3') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'brides'" class="brides">
        <h2 class="size_chart size_chart_title">{{ nl('page_goods_size_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th width="18%">US {{ nl('page_common_size') }}</th>
                <td>WD0</td>
                <td>WD2</td>
                <td>WD4</td>
                <td>WD6</td>
                <td>WD8</td>
                <td>WD10</td>
                <td>WD12</td>
                <td>WD14</td>
                <td>WD16</td>
                <td>WD18</td>
                <td>WD20</td>
                <td>WD22</td>
                <td>WD24</td>
                <td>WD26</td>
                <td>WD28</td>
                <td>WD30</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="32.5">81</td>
                <td data-value="33.5">84</td>
                <td data-value="34.5">86</td>
                <td data-value="35.5">89</td>
                <td data-value="36.5">91</td>
                <td data-value="38">95</td>
                <td data-value="39.5">99</td>
                <td data-value="41">104</td>
                <td data-value="43">110</td>
                <td data-value="45">116</td>
                <td data-value="47">121</td>
                <td data-value="49">127</td>
                <td data-value="51">135</td>
                <td data-value="53">142</td>
                <td data-value="59">150</td>
                <td data-value="63">160</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="25.5">65</td>
                <td data-value="26.5">67</td>
                <td data-value="27.5">70</td>
                <td data-value="28.5">72</td>
                <td data-value="29.5">75</td>
                <td data-value="31">79</td>
                <td data-value="32.5">83</td>
                <td data-value="34">88</td>
                <td data-value="36.25">95</td>
                <td data-value="38.5">101</td>
                <td data-value="40.75">107</td>
                <td data-value="43">114</td>
                <td data-value="45.25">122</td>
                <td data-value="47.5">130</td>
                <td data-value="54.5">138</td>
                <td data-value="58.75">149</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="35.75">90</td>
                <td data-value="36.75">93</td>
                <td data-value="37.75">95</td>
                <td data-value="38.75">98</td>
                <td data-value="39.75">100</td>
                <td data-value="41.25">104</td>
                <td data-value="42.75">108</td>
                <td data-value="44.25">113</td>
                <td data-value="45.5">119</td>
                <td data-value="47.5">124</td>
                <td data-value="49.5">130</td>
                <td data-value="51.5">136</td>
                <td data-value="53.5">144</td>
                <td data-value="55.5">151</td>
                <td data-value="62.5">159</td>
                <td data-value="66.5">169</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note1') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_size_dress_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size_bride tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_filter_silhouette') | lower | title }}</th>
                <td>{{ nl('page_filter_aline') }}</td>
                <td>{{ nl('page_filter_sheath') }}</td>
                <td>{{ nl('page_filter_empire') }}</td>
                <td>{{ nl('page_filter_trumpet') }}</td>
                <td>{{ nl('page_filter_ball_gown') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/A-line_princess.jpg" alt="A-line princess" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/sheath_column.jpg" alt="sheath column" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/empire.jpg" alt="empire" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/trumpet_mermaid.jpg" alt="trumpet mermaid" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ball gown.jpg" alt="ball gown" />
                </td>
              </tr>
              <tr>
                <td>155</td>
                <td>155</td>
                <td>155</td>
                <td>155</td>
                <td>155</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt">
          <table class="tbl-size tbl-size_bride tbl-size-train-length">
            <thead>
              <tr style="text-transform: capitalize">
                <th>{{ nl('page_goods_length_desc') }}</th>
                <td>{{ nl('page_size_mini_noinch') }}</td>
                <td>{{ nl('page_size_knee_length') }}</td>
                <td>{{ nl('page_size_tea_length') }}</td>
                <td>{{ nl('page_size_ankle_length') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_cm') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/short_mini.jpg" alt="short mini" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
              </tr>
              <tr>
                <td>91</td>
                <td>104</td>
                <td>119</td>
                <td>135</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="size_chart_note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2_cm') }}
        </p>
        <h2 class="train_length_chart size_chart_title">{{ nl('page_size_train_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_size_train') }}</th>
                <td>{{ nl('page_size_sweep_train') }}</td>
                <td>{{ nl('page_size_court_train') }}</td>
                <td>{{ nl('page_size_chapel_train') }}</td>
                <td>{{ nl('page_size_cathedral_train') }}</td>
                <td>{{ nl('page_size_royal_train') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_cm') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/sweep_train.jpg" alt="sweep train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/court_train.jpg" alt="court train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/chapel_train.jpg" alt="chapel train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/cathedral_train.jpg" alt="cathedral train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/royal_train.jpg" alt="royal train" />
                </td>
              </tr>
              <tr>
                <td>152</td>
                <td>165</td>
                <td>190</td>
                <td>203</td>
                <td>254</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note4') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'junior_bridesmaid'" class="junior_bridesmaid">
        <h2 class="size_chart size_chart_title">{{ nl('page_goods_size_chart') }}</h2>

        <div class="mt">
          <table class="tbl-size tbl-size-junior">
            <thead>
              <tr>
                <th>US {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr class="junior-sizec">
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_cm') }})</th>
                <td>67</td>
                <td>70</td>
                <td>72</td>
                <td>76</td>
                <td>80</td>
                <td>84</td>
              </tr>
              <tr class="junior-sizec">
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_cm') }})</th>
                <td>56</td>
                <td>58</td>
                <td>61</td>
                <td>64</td>
                <td>66</td>
                <td>69</td>
              </tr>
              <tr class="junior-sizec">
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_cm') }})</th>
                <td>72</td>
                <td>75</td>
                <td>77</td>
                <td>81</td>
                <td>85</td>
                <td>89</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note1') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_size_dress_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-dress-length">
            <thead>
              <tr>
                <th colspan="2">US {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
            </thead>
            <tbody>
              <tr class="hg-35">
                <th colspan="2">EU {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">UK {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">AU {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_mini') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/short_mini.jpg" alt="short mini" />
                </td>
                <td data-value="33.5">74</td>
                <td data-value="33.5">76</td>
                <td data-value="33.5">79</td>
                <td data-value="34">81</td>
                <td data-value="34">84</td>
                <td data-value="34">86</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_knee_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td data-value="38">84</td>
                <td data-value="38">86</td>
                <td data-value="38">91</td>
                <td data-value="38">97</td>
                <td data-value="38.5">99</td>
                <td data-value="38.5">102</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_tea_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td data-value="45.5">94</td>
                <td data-value="45.5">99</td>
                <td data-value="46.5">104</td>
                <td data-value="46.5">109</td>
                <td data-value="47">112</td>
                <td data-value="47">114</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ankle_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
                <td data-value="53.5">108</td>
                <td data-value="53.5">113</td>
                <td data-value="53.5">118</td>
                <td data-value="54">122</td>
                <td data-value="54">124</td>
                <td data-value="55">127</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/floor_length.jpg" alt="floor length" />
                </td>
                <td>117</td>
                <td>122</td>
                <td>127</td>
                <td>132</td>
                <td>135</td>
                <td>137</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2_cm') }}
        </p>
      </div>
      <div v-show="clickTab == 'flower_girl'" class="flower_girl">
        <h2 class="size_chart size_chart_title">{{ nl('page_goods_size_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th>US {{ nl('page_common_size') }}</th>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>EU {{ nl('page_common_size') }}</th>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
              </tr>
              <tr>
                <th>UK {{ nl('page_common_size') }}</th>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
              </tr>
              <tr>
                <th>AU {{ nl('page_common_size') }}</th>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_chest') }} ({{ nl('page_common_length_cm') }})</th>
                <td>57</td>
                <td>60</td>
                <td>62</td>
                <td>65</td>
                <td>67</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_cm') }})</th>
                <td>55</td>
                <td>56</td>
                <td>57</td>
                <td>60</td>
                <td>62</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_height') }} ({{ nl('page_common_length_cm') }})</th>
                <td>85</td>
                <td>93</td>
                <td>98</td>
                <td>110</td>
                <td>116</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note7') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'mother_of_the_bride'" class="mother_of_the_bride">
        <h2 class="size_chart size_chart_title">{{ nl('page_goods_size_chart') }}</h2>

        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th width="18%">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="32">81</td>
                <td data-value="33">84</td>
                <td data-value="34">86</td>
                <td data-value="35">89</td>
                <td data-value="36">91</td>
                <td data-value="37.5">95</td>
                <td data-value="39">99</td>
                <td data-value="41">104</td>
                <td data-value="43.25">110</td>
                <td data-value="45.5">116</td>
                <td data-value="47.75">121</td>
                <td data-value="50">127</td>
                <td data-value="53">135</td>
                <td data-value="56">142</td>
                <td data-value="59">150</td>
                <td data-value="63">160</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="25.5">65</td>
                <td data-value="26.5">67</td>
                <td data-value="27.5">70</td>
                <td data-value="28.5">72</td>
                <td data-value="29.5">75</td>
                <td data-value="31">79</td>
                <td data-value="32.5">83</td>
                <td data-value="34.75">88</td>
                <td data-value="37.25">95</td>
                <td data-value="39.75">101</td>
                <td data-value="42.25">107</td>
                <td data-value="44.75">114</td>
                <td data-value="48">122</td>
                <td data-value="51.25">130</td>
                <td data-value="54.5">138</td>
                <td data-value="58.75">149</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="35.5">90</td>
                <td data-value="36.5">93</td>
                <td data-value="37.5">95</td>
                <td data-value="38.5">98</td>
                <td data-value="39.5">100</td>
                <td data-value="41">104</td>
                <td data-value="42.5">108</td>
                <td data-value="44.5">113</td>
                <td data-value="46.75">119</td>
                <td data-value="49">124</td>
                <td data-value="51.25">130</td>
                <td data-value="53.5">136</td>
                <td data-value="56.5">144</td>
                <td data-value="59.5">151</td>
                <td data-value="62.5">159</td>
                <td data-value="66.5">169</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note1') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_size_dress_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-dress-length">
            <thead>
              <tr>
                <th colspan="2">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr class="hg-35">
                <th colspan="2">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_mini') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/short_mini.jpg" alt="short mini" />
                </td>
                <td data-value="33.5">85</td>
                <td data-value="33.5">85</td>
                <td data-value="33.5">85</td>
                <td data-value="34">86</td>
                <td data-value="34">86</td>
                <td data-value="34">86</td>
                <td data-value="34">86</td>
                <td data-value="35">89</td>
                <td data-value="35">89</td>
                <td data-value="35">89</td>
                <td data-value="35">89</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_knee_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td data-value="38">97</td>
                <td data-value="38">97</td>
                <td data-value="38">97</td>
                <td data-value="38">97</td>
                <td data-value="38.5">98</td>
                <td data-value="38.5">98</td>
                <td data-value="38.5">98</td>
                <td data-value="38.5">98</td>
                <td data-value="39">99</td>
                <td data-value="39">99</td>
                <td data-value="39">99</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_midi_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/midi_length.jpg" alt="midi length" />
                </td>
                <td data-value="43.5">110</td>
                <td data-value="43.5">110</td>
                <td data-value="44.5">113</td>
                <td data-value="44.5">113</td>
                <td data-value="45">114</td>
                <td data-value="45">114</td>
                <td data-value="46">117</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_tea_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td data-value="45.5">116</td>
                <td data-value="45.5">116</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="47">119</td>
                <td data-value="47">119</td>
                <td data-value="48">122</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ballerina_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ballerina_length.jpg" alt="ballerina length" />
                </td>
                <td data-value="51">130</td>
                <td data-value="51">130</td>
                <td data-value="51.5">131</td>
                <td data-value="51.5">131</td>
                <td data-value="52">132</td>
                <td data-value="52">132</td>
                <td data-value="53">135</td>
                <td data-value="53">135</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ankle_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
                <td data-value="53">135</td>
                <td data-value="53">135</td>
                <td data-value="53.5">136</td>
                <td data-value="53.5">136</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
                <td data-value="55">140</td>
                <td data-value="55">140</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/floor_length.jpg" alt="floor length" />
                </td>
                <td data-value="58">147</td>
                <td data-value="58">147</td>
                <td data-value="59">150</td>
                <td data-value="59">150</td>
                <td data-value="60">152</td>
                <td data-value="60">152</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="size_chart_note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2_cm') }}
        </p>
        <h2 class="train_length_chart size_chart_title">{{ nl('page_size_train_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_size_train') }}</th>
                <td>{{ nl('page_size_sweep_train') }}</td>
                <td>{{ nl('page_size_court_train') }}</td>
                <td>{{ nl('page_size_chapel_train') }}</td>
                <td>{{ nl('page_size_cathedral_train') }}</td>
                <td>{{ nl('page_size_royal_train') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_cm') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/sweep_train.jpg" alt="sweep train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/court_train.jpg" alt="court train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/chapel_train.jpg" alt="chapel train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/cathedral_train.jpg" alt="cathedral train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/royal_train.jpg" alt="royal train" />
                </td>
              </tr>
              <tr>
                <td data-value="12">30</td>
                <td data-value="18">46</td>
                <td data-value="24">61</td>
                <td data-value="32">81</td>
                <td data-value="48">122</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note3') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'maternity'" class="maternity">
        <p style="margin-top:20px;margin-bottom: 5px;color:#666;">
          <strong>{{ nl('page_size_note') }}</strong> Ordering your maternity gown doesn't have to be hard. We've done our best to simplify
          the process for you, so you order the perfect dress. Measure your bust and hips only and find your closest match on the chart
          below.
          <span class="ont-family-text">{{ nl('page_size_advice') }}</span>
        </p>
        <h2 class="size_chart size_chart_title">{{ nl('page_common_size_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th width="18%">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="32">81</td>
                <td data-value="33">84</td>
                <td data-value="34">86</td>
                <td data-value="35">89</td>
                <td data-value="36">91</td>
                <td data-value="37.5">95</td>
                <td data-value="39">99</td>
                <td data-value="41">104</td>
                <td data-value="43.25">110</td>
                <td data-value="45.5">116</td>
                <td data-value="47.75">121</td>
                <td data-value="50">127</td>
                <td data-value="53">135</td>
                <td data-value="56">142</td>
                <td data-value="59">150</td>
                <td data-value="63">160</td>
              </tr>
              <tr>
                <th>{{ nl('page_common_under_bust') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="28.5">72</td>
                <td data-value="29.5">75</td>
                <td data-value="30.5">77</td>
                <td data-value="31.5">80</td>
                <td data-value="32.5">83</td>
                <td data-value="34">86</td>
                <td data-value="35.5">90</td>
                <td data-value="37.75">96</td>
                <td data-value="40.5">103</td>
                <td data-value="42.75">109</td>
                <td data-value="45.5">116</td>
                <td data-value="47.5">121</td>
                <td data-value="50.75">129</td>
                <td data-value="53.75">137</td>
                <td data-value="56.75">144</td>
                <td data-value="63">160</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="35.5">90</td>
                <td data-value="36.5">93</td>
                <td data-value="37.5">95</td>
                <td data-value="38.5">98</td>
                <td data-value="39.5">100</td>
                <td data-value="41">104</td>
                <td data-value="42.5">108</td>
                <td data-value="44.5">113</td>
                <td data-value="46.75">119</td>
                <td data-value="49">124</td>
                <td data-value="51.25">130</td>
                <td data-value="53.5">136</td>
                <td data-value="56.5">144</td>
                <td data-value="59.5">151</td>
                <td data-value="62.5">159</td>
                <td data-value="66.5">169</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong> Some styles have ease added for your comfort. If you are in between sizes, it is
            suggested to call and speak to a stylist or order the dress in custom size.
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_size_dress_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-dress-length">
            <thead>
              <tr>
                <th colspan="2">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr class="hg-35">
                <th colspan="2">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_mini') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/short_mini.jpg" alt="short mini" />
                </td>
                <td data-value="33.5">85</td>
                <td data-value="33.5">85</td>
                <td data-value="33.5">85</td>
                <td data-value="34">86</td>
                <td data-value="34">86</td>
                <td data-value="34">86</td>
                <td data-value="34">86</td>
                <td data-value="35">89</td>
                <td data-value="35">89</td>
                <td data-value="35">89</td>
                <td data-value="35">89</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
                <td data-value="36">91</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_knee_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td data-value="38">97</td>
                <td data-value="38">97</td>
                <td data-value="38">97</td>
                <td data-value="38">97</td>
                <td data-value="38.5">98</td>
                <td data-value="38.5">98</td>
                <td data-value="38.5">98</td>
                <td data-value="38.5">98</td>
                <td data-value="39">99</td>
                <td data-value="39">99</td>
                <td data-value="39">99</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_tea_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td data-value="45.5">116</td>
                <td data-value="45.5">116</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="47">119</td>
                <td data-value="47">119</td>
                <td data-value="48">122</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ankle_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
                <td data-value="53">135</td>
                <td data-value="53">135</td>
                <td data-value="53.5">136</td>
                <td data-value="53.5">136</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
                <td data-value="55">140</td>
                <td data-value="55">140</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/floor_length.jpg" alt="floor length" />
                </td>
                <td data-value="58">147</td>
                <td data-value="58">147</td>
                <td data-value="59">150</td>
                <td data-value="59">150</td>
                <td data-value="60">152</td>
                <td data-value="60">152</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="size_chart_note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2_cm') }}
        </p>
        <h2 class="train_length_chart size_chart_title">{{ nl('page_size_train_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_size_train') }}</th>
                <td>{{ nl('page_shop_by_length_Sweep_Train') }}</td>
                <td>{{ nl('page_size_court_train') }}</td>
                <td>{{ nl('page_size_chapel_train') }}</td>
                <td>{{ nl('page_size_cathedral_train') }}</td>
                <td>{{ nl('page_size_royal_train') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_cm') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/sweep_train.jpg" alt="sweep train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/court_train.jpg" alt="court train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/chapel_train.jpg" alt="chapel train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/cathedral_train.jpg" alt="cathedral train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/royal_train.jpg" alt="royal train" />
                </td>
              </tr>
              <tr>
                <td data-value="12">30</td>
                <td data-value="18">46</td>
                <td data-value="24">61</td>
                <td data-value="32">81</td>
                <td data-value="48">122</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note3') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'modest'" class="modest">
        <h2 class="size_chart size_chart_title">{{ nl('page_common_size_chart') }}</h2>

        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th width="18%">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="32">81</td>
                <td data-value="33">84</td>
                <td data-value="34">86</td>
                <td data-value="35">89</td>
                <td data-value="36">91</td>
                <td data-value="37.5">95</td>
                <td data-value="39">99</td>
                <td data-value="41">104</td>
                <td data-value="43.25">110</td>
                <td data-value="45.5">116</td>
                <td data-value="47.75">121</td>
                <td data-value="50">127</td>
                <td data-value="53">135</td>
                <td data-value="56">142</td>
                <td data-value="59">150</td>
                <td data-value="63">160</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="25.5">65</td>
                <td data-value="26.5">67</td>
                <td data-value="27.5">70</td>
                <td data-value="28.5">72</td>
                <td data-value="29.5">75</td>
                <td data-value="31">79</td>
                <td data-value="32.5">83</td>
                <td data-value="34.75">88</td>
                <td data-value="37.25">95</td>
                <td data-value="39.75">101</td>
                <td data-value="42.25">107</td>
                <td data-value="44.75">114</td>
                <td data-value="48">122</td>
                <td data-value="51.25">130</td>
                <td data-value="54.5">138</td>
                <td data-value="58.75">149</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_cm') }})</th>
                <td data-value="35.5">90</td>
                <td data-value="36.5">93</td>
                <td data-value="37.5">95</td>
                <td data-value="38.5">98</td>
                <td data-value="39.5">100</td>
                <td data-value="41">104</td>
                <td data-value="42.5">108</td>
                <td data-value="44.5">113</td>
                <td data-value="46.75">119</td>
                <td data-value="49">124</td>
                <td data-value="51.25">130</td>
                <td data-value="53.5">136</td>
                <td data-value="56.5">144</td>
                <td data-value="59.5">151</td>
                <td data-value="62.5">159</td>
                <td data-value="66.5">169</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note1') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">DRESS LENGTH CHART (HOLLOW TO HEM)</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-dress-length">
            <thead>
              <tr>
                <th colspan="2">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr class="hg-35">
                <th colspan="2">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_knee_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td data-value="39">99</td>
                <td data-value="39">99</td>
                <td data-value="39.5">100</td>
                <td data-value="39.5">100</td>
                <td data-value="40">102</td>
                <td data-value="40">102</td>
                <td data-value="40.5">103</td>
                <td data-value="40.5">103</td>
                <td data-value="41">104</td>
                <td data-value="41">104</td>
                <td data-value="41">104</td>
                <td data-value="42">107</td>
                <td data-value="42">107</td>
                <td data-value="42">107</td>
                <td data-value="42">107</td>
                <td data-value="42">107</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_tea_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td data-value="45.5">116</td>
                <td data-value="45.5">116</td>
                <td data-value="46.5">118</td>
                <td data-value="46.5">118</td>
                <td data-value="47">119</td>
                <td data-value="47">119</td>
                <td data-value="48">122</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
                <td data-value="48.5">123</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ankle_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
                <td data-value="53">135</td>
                <td data-value="53">135</td>
                <td data-value="53.5">136</td>
                <td data-value="53.5">136</td>
                <td data-value="54">137</td>
                <td data-value="54">137</td>
                <td data-value="55">140</td>
                <td data-value="55">140</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
                <td data-value="56">142</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_cm') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/floor_length.jpg" alt="floor length" />
                </td>
                <td data-value="58">147</td>
                <td data-value="58">147</td>
                <td data-value="59">150</td>
                <td data-value="59">150</td>
                <td data-value="60">152</td>
                <td data-value="60">152</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
                <td data-value="61">155</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="size_chart_note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2_cm') }}
        </p>
        <h2 class="train_length_chart size_chart_title">{{ nl('page_size_train_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_size_train') }}</th>
                <td>{{ nl('page_shop_by_length_Sweep_Train') }}</td>
                <td>{{ nl('page_size_court_train') }}</td>
                <td>{{ nl('page_size_chapel_train') }}</td>
                <td>{{ nl('page_size_cathedral_train') }}</td>
                <td>{{ nl('page_size_royal_train') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_cm') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/sweep_train.jpg" alt="sweep train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/court_train.jpg" alt="court train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/chapel_train.jpg" alt="chapel train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/cathedral_train.jpg" alt="cathedral train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/royal_train.jpg" alt="royal train" />
                </td>
              </tr>
              <tr>
                <td data-value="12">30</td>
                <td data-value="18">46</td>
                <td data-value="24">61</td>
                <td data-value="32">81</td>
                <td data-value="48">122</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note3') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'veil'" class="veil">
        <h2 class="size_chart_title">{{ nl('page_veil_length') }}</h2>
        <div :style="{ background: 'url(' + veilImgCm + ') no-repeat', backgroundSize: 'contain' }" class="veil_img"></div>
        <table class="tbl-size">
          <thead>
            <tr>
              <th>US {{ nl('page_common_size') }}</th>
              <td>{{ nl('page_size_cathedral') }}</td>
              <td>{{ nl('page_size_chapel') }}</td>
              <td>{{ nl('page_size_intermission') }}</td>
              <td>{{ nl('page_size_fingertip') }}</td>
              <td>{{ nl('page_size_wrist') }}</td>
              <td>{{ nl('page_size_elbow') }}</td>
              <td>{{ nl('page_size_shoulder') }}</td>
            </tr>
          </thead>
          <tr>
            <th>{{ nl('page_size_length_cm') }}</th>
            <td>279</td>
            <td>241</td>
            <td>140</td>
            <td>107</td>
            <td>86</td>
            <td>69</td>
            <td>56</td>
          </tr>
        </table>
      </div>
      <div v-show="clickTab == 'vest'" class="vest">
        <h2 class="size_chart size_chart_title">{{ nl('page_man_vest_size_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th>US {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
                <td>XL</td>
                <td>2XL</td>
                <td>3XL</td>
                <td>4XL</td>
                <td>5XL</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
                <td>XL</td>
                <td>XXL</td>
                <td>3XL</td>
                <td>4XL</td>
                <td>5XL</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
                <td>XL</td>
                <td>XXL</td>
                <td>XXXL</td>
                <td>XXXXL</td>
                <td>XXXXXL</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
                <td>XL</td>
                <td>XXL</td>
                <td>XXXL</td>
                <td>4XL</td>
                <td>5XL</td>
              </tr>
              <tr>
                <th>{{ nl('page_common_equivalent_coat_size') }} ({{ nl('page_common_length_cm') }})</th>
                <td>86-97</td>
                <td>99-107</td>
                <td>109-117</td>
                <td>122-127</td>
                <td>132-137</td>
                <td>142-147</td>
                <td>152-157</td>
                <td>163-168</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_chest') }} ({{ nl('page_common_length_cm') }})</th>
                <td>104</td>
                <td>112</td>
                <td>119</td>
                <td>131</td>
                <td>144</td>
                <td>154</td>
                <td>164</td>
                <td>174</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_cm') }})</th>
                <td>102</td>
                <td>109</td>
                <td>117</td>
                <td>128</td>
                <td>141</td>
                <td>151</td>
                <td>161</td>
                <td>171</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note7') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_boy_vest_size_chart') | dropFanXie }}</h2>
        <div class="mt">
          <table class="tbl-boy-size">
            <thead>
              <tr>
                <th>US {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>EU {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
              </tr>
              <tr>
                <th>UK {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
              </tr>
              <tr>
                <th>AU {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
              </tr>
              <tr>
                <th>{{ nl('page_common_boy_vest_age_size') }}</th>
                <td>2-6yrs</td>
                <td>7-11yrs</td>
                <td>12-16yrs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-show="sizeType == 'inch'" class="content inch_content" data-tab-content>
      <div v-show="clickTab == 'bridesmaid'" class="bridesmaid">
        <h2 class="size_chart size_chart_title">{{ nl('page_goods_size_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th width="18%">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="32">32</td>
                <td data-value="33">33</td>
                <td data-value="34">34</td>
                <td data-value="35">35</td>
                <td data-value="36">36</td>
                <td data-value="37.5">37 ½</td>
                <td data-value="39">39</td>
                <td data-value="41">41</td>
                <td data-value="43.25">43 ¼</td>
                <td data-value="45.5">45 ½</td>
                <td data-value="47.75">47 ¾</td>
                <td data-value="50">50</td>
                <td data-value="53">53</td>
                <td data-value="56">56</td>
                <td data-value="59">59</td>
                <td data-value="63">63</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="25.5">25 ½</td>
                <td data-value="26.5">26 ½</td>
                <td data-value="27.5">27 ½</td>
                <td data-value="28.5">28 ½</td>
                <td data-value="29.5">29 ½</td>
                <td data-value="31">31</td>
                <td data-value="32.5">32 ½</td>
                <td data-value="34.75">34 ¾</td>
                <td data-value="37.5">37 ½</td>
                <td data-value="39.75">39 ¾</td>
                <td data-value="42.5">42 ½</td>
                <td data-value="44.75">44 ¾</td>
                <td data-value="48">48</td>
                <td data-value="51.25">51 ¼</td>
                <td data-value="54.5">54 ½</td>
                <td data-value="58.75">58 ¾</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="35.5">35 ½</td>
                <td data-value="36.5">36 ½</td>
                <td data-value="37.5">37 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="39.5">39 ½</td>
                <td data-value="41">41</td>
                <td data-value="42.5">42 ½</td>
                <td data-value="44.5">44 ½</td>
                <td data-value="46.75">46 ¾</td>
                <td data-value="49">49</td>
                <td data-value="51.25">51 ¼</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="56.5">56 ½</td>
                <td data-value="59.5">59 ½</td>
                <td data-value="62.5">62 ½</td>
                <td data-value="66.5">66 ½</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note1') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_size_dress_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-dress-length">
            <thead>
              <tr>
                <th colspan="2">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr class="hg-35">
                <th colspan="2">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_mini') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/short_mini.jpg" alt="short mini" />
                </td>
                <td data-value="33.5">33 ½</td>
                <td data-value="33.5">33 ½</td>
                <td data-value="33.5">33 ½</td>
                <td data-value="34">34</td>
                <td data-value="34">34</td>
                <td data-value="34">34</td>
                <td data-value="34">34</td>
                <td data-value="35">35</td>
                <td data-value="35">35</td>
                <td data-value="35">35</td>
                <td data-value="35">35</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_knee_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td data-value="38">38</td>
                <td data-value="38">38</td>
                <td data-value="38">38</td>
                <td data-value="38">38</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="39">39</td>
                <td data-value="39">39</td>
                <td data-value="39">39</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_tea_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td data-value="45.5">45 ½</td>
                <td data-value="45.5">45 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="47">47</td>
                <td data-value="47">47</td>
                <td data-value="48">48</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ankle_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
                <td data-value="53">53</td>
                <td data-value="53">53</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
                <td data-value="55">55</td>
                <td data-value="55">55</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/floor_length.jpg" alt="floor length" />
                </td>
                <td data-value="58">58</td>
                <td data-value="58">58</td>
                <td data-value="59">59</td>
                <td data-value="59">59</td>
                <td data-value="60">60</td>
                <td data-value="60">60</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="size_chart_note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2') }}
        </p>
        <h2 class="train_length_chart size_chart_title">{{ nl('page_size_train_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_size_train') }}</th>
                <td>{{ nl('page_size_sweep_train') }}</td>
                <td>{{ nl('page_size_court_train') }}</td>
                <td>{{ nl('page_size_chapel_train') }}</td>
                <td>{{ nl('page_size_cathedral_train') }}</td>
                <td>{{ nl('page_size_royal_train') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_inch') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/sweep_train.jpg" alt="sweep train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/court_train.jpg" alt="court train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/chapel_train.jpg" alt="chapel train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/cathedral_train.jpg" alt="cathedral train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/royal_train.jpg" alt="royal train" />
                </td>
              </tr>
              <tr>
                <td data-value="12">12</td>
                <td data-value="18">18</td>
                <td data-value="24">24</td>
                <td data-value="32">32</td>
                <td data-value="48">48</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note3') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'brides'" class="brides">
        <h2 class="size_chart size_chart_title">{{ nl('page_goods_size_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th width="18%">US {{ nl('page_common_size') }}</th>
                <td>WD0</td>
                <td>WD2</td>
                <td>WD4</td>
                <td>WD6</td>
                <td>WD8</td>
                <td>WD10</td>
                <td>WD12</td>
                <td>WD14</td>
                <td>WD16</td>
                <td>WD18</td>
                <td>WD20</td>
                <td>WD22</td>
                <td>WD24</td>
                <td>WD26</td>
                <td>WD28</td>
                <td>WD30</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="32.5">32</td>
                <td data-value="33.5">33</td>
                <td data-value="34.5">34</td>
                <td data-value="35.5">35</td>
                <td data-value="36.5">36</td>
                <td data-value="38">37 ½</td>
                <td data-value="39.5">39</td>
                <td data-value="41">41</td>
                <td data-value="43">
                  43
                  <span class="zoomlarge">¼</span>
                </td>
                <td data-value="45">45 ½</td>
                <td data-value="47">47 ¾</td>
                <td data-value="49">50</td>
                <td data-value="51">53</td>
                <td data-value="53">56</td>
                <td data-value="59">59</td>
                <td data-value="63">63</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="25.5">25 ½</td>
                <td data-value="26.5">26 ½</td>
                <td data-value="27.5">27 ½</td>
                <td data-value="28.5">28 ½</td>
                <td data-value="29.5">29 ½</td>
                <td data-value="31">31</td>
                <td data-value="32.5">32 ½</td>
                <td data-value="34">34 ¾</td>
                <td data-value="36.25">37 ½</td>
                <td data-value="38.5">39 ¾</td>
                <td data-value="40.75">42 ½</td>
                <td data-value="43">44 ¾</td>
                <td data-value="45.25">48</td>
                <td data-value="47.5">51 ¼</td>
                <td data-value="54.5">54 ½</td>
                <td data-value="58.75">58 ¾</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="35.75">35 ½</td>
                <td data-value="36.75">36 ½</td>
                <td data-value="37.75">37 ½</td>
                <td data-value="38.75">38 ½</td>
                <td data-value="39.75">39 ½</td>
                <td data-value="41.25">41</td>
                <td data-value="42.75">42 ½</td>
                <td data-value="44.25">44 ½</td>
                <td data-value="45.5">46 ¾</td>
                <td data-value="47.5">49</td>
                <td data-value="49.5">51 ¼</td>
                <td data-value="51.5">53 ½</td>
                <td data-value="53.5">56 ½</td>
                <td data-value="55.5">59 ½</td>
                <td data-value="62.5">62 ½</td>
                <td data-value="66.5">66 ½</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note1') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_size_dress_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size_bride tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_filter_silhouette') | lower | title }}</th>
                <td>{{ nl('page_filter_aline') }}</td>
                <td>{{ nl('page_filter_sheath') }}</td>
                <td>{{ nl('page_filter_empire') }}</td>
                <td>{{ nl('page_filter_trumpet') }}</td>
                <td>{{ nl('page_filter_ball_gown') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/A-line_princess.jpg" alt="A-line princess" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/sheath_column.jpg" alt="sheath column" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/empire.jpg" alt="empire" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/trumpet_mermaid.jpg" alt="trumpet mermaid" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ball gown.jpg" alt="ball gown" />
                </td>
              </tr>
              <tr>
                <td>61</td>
                <td>61</td>
                <td>61</td>
                <td>61</td>
                <td>61</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt">
          <table class="tbl-size tbl-size_bride tbl-size-train-length">
            <thead>
              <tr style="text-transform: capitalize">
                <th>{{ nl('page_goods_length_desc') }}</th>
                <td>{{ nl('page_size_mini') }}</td>
                <td>{{ nl('page_size_mini_noinch') }}</td>
                <td>{{ nl('page_size_knee_length') }}</td>
                <td>{{ nl('page_size_tea_length') }}</td>
                <td>{{ nl('page_size_ankle_length') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_inch') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/length_mini.jpg" alt="length mini" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/short_mini.jpg" alt="short mini" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
              </tr>
              <tr>
                <td>32 ~ 34 ½</td>
                <td>36</td>
                <td>41</td>
                <td>47</td>
                <td>53</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="size_chart_note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2') }}
        </p>
        <h2 class="train_length_chart size_chart_title">{{ nl('page_size_train_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_size_train') }}</th>
                <td>{{ nl('page_size_sweep_train') }}</td>
                <td>{{ nl('page_size_court_train') }}</td>
                <td>{{ nl('page_size_chapel_train') }}</td>
                <td>{{ nl('page_size_cathedral_train') }}</td>
                <td>{{ nl('page_size_royal_train') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_inch') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/sweep_train.jpg" alt="sweep train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/court_train.jpg" alt="court train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/chapel_train.jpg" alt="chapel train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/cathedral_train.jpg" alt="cathedral train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/royal_train.jpg" alt="royal train" />
                </td>
              </tr>
              <tr>
                <td>60</td>
                <td>65</td>
                <td>75</td>
                <td>80</td>
                <td>100</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note4') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'junior_bridesmaid'" class="junior_bridesmaid">
        <h2 class="size_chart size_chart_title">{{ nl('page_goods_size_chart') }}</h2>

        <div class="mt">
          <table class="tbl-size tbl-size-junior">
            <thead>
              <tr>
                <th>US {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr class="junior-sizec">
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_inch') }})</th>
                <td>26 ½</td>
                <td>27 ½</td>
                <td>28 ½</td>
                <td>30</td>
                <td>31 ½</td>
                <td>33</td>
              </tr>
              <tr class="junior-sizec">
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_inch') }})</th>
                <td>22</td>
                <td>23</td>
                <td>24</td>
                <td>25</td>
                <td>26</td>
                <td>27</td>
              </tr>
              <tr class="junior-sizec">
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_inch') }})</th>
                <td>28 ½</td>
                <td>29 ½</td>
                <td>30 ½</td>
                <td>32</td>
                <td>33 ½</td>
                <td>35</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note1') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_size_dress_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-dress-length">
            <thead>
              <tr>
                <th colspan="2">US {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
            </thead>
            <tbody>
              <tr class="hg-35">
                <th colspan="2">EU {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">UK {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">AU {{ nl('page_common_size') }}</th>
                <td>J6</td>
                <td>J8</td>
                <td>J10</td>
                <td>J12</td>
                <td>J14</td>
                <td>J16</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_mini') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/short_mini.jpg" alt="short mini" />
                </td>
                <td data-value="33.5">29</td>
                <td data-value="33.5">30</td>
                <td data-value="33.5">31</td>
                <td data-value="34">32</td>
                <td data-value="34">33</td>
                <td data-value="34">34</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_knee_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td data-value="38">33</td>
                <td data-value="38">34</td>
                <td data-value="38">36</td>
                <td data-value="38">38</td>
                <td data-value="38.5">39</td>
                <td data-value="38.5">40</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_tea_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td data-value="45.5">37</td>
                <td data-value="45.5">39</td>
                <td data-value="46.5">41</td>
                <td data-value="46.5">43</td>
                <td data-value="47">44</td>
                <td data-value="47">45</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ankle_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
                <td data-value="53.5">42 ½</td>
                <td data-value="53.5">44 ½</td>
                <td data-value="53.5">46 ½</td>
                <td data-value="54">48</td>
                <td data-value="54">49</td>
                <td data-value="55">50</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/floor_length.jpg" alt="floor length" />
                </td>
                <td>46</td>
                <td>48</td>
                <td>50</td>
                <td>52</td>
                <td>53</td>
                <td>54</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2') }}
        </p>
      </div>
      <div v-show="clickTab == 'flower_girl'" class="flower_girl">
        <h2 class="size_chart size_chart_title">{{ nl('page_goods_size_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th>US {{ nl('page_common_size') }}</th>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>EU {{ nl('page_common_size') }}</th>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
              </tr>
              <tr>
                <th>UK {{ nl('page_common_size') }}</th>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
              </tr>
              <tr>
                <th>AU {{ nl('page_common_size') }}</th>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_chest') }} ({{ nl('page_common_length_inch') }})</th>
                <td>22 ½</td>
                <td>23 ½</td>
                <td>24 ½</td>
                <td>25 ½</td>
                <td>26 ½</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_inch') }})</th>
                <td>21 ½</td>
                <td>22</td>
                <td>22 ½</td>
                <td>23 ½</td>
                <td>24 ½</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_height') }} ({{ nl('page_common_length_inch') }})</th>
                <td>33 ½</td>
                <td>36 ½</td>
                <td>38 ½</td>
                <td>43 ½</td>
                <td>45 ½</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note7') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'mother_of_the_bride'" class="mother_of_the_bride">
        <h2 class="size_chart size_chart_title">{{ nl('page_goods_size_chart') }}</h2>

        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th width="18%">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="32">32</td>
                <td data-value="33">33</td>
                <td data-value="34">34</td>
                <td data-value="35">35</td>
                <td data-value="36">36</td>
                <td data-value="37.5">37 ½</td>
                <td data-value="39">39</td>
                <td data-value="41">41</td>
                <td data-value="43.25">43 ¼</td>
                <td data-value="45.5">45 ½</td>
                <td data-value="47.75">47 ¾</td>
                <td data-value="50">50</td>
                <td data-value="53">53</td>
                <td data-value="56">56</td>
                <td data-value="59">59</td>
                <td data-value="63">63</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="25.5">25 ½</td>
                <td data-value="26.5">26 ½</td>
                <td data-value="27.5">27 ½</td>
                <td data-value="28.5">28 ½</td>
                <td data-value="29.5">29 ½</td>
                <td data-value="31">31</td>
                <td data-value="32.5">32 ½</td>
                <td data-value="34.75">34 ¾</td>
                <td data-value="37.5">37 ½</td>
                <td data-value="39.75">39 ¾</td>
                <td data-value="42.5">42 ½</td>
                <td data-value="44.75">44 ¾</td>
                <td data-value="48">48</td>
                <td data-value="51.25">51 ¼</td>
                <td data-value="54.5">54 ½</td>
                <td data-value="58.75">58 ¾</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="35.5">35 ½</td>
                <td data-value="36.5">36 ½</td>
                <td data-value="37.5">37 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="39.5">39 ½</td>
                <td data-value="41">41</td>
                <td data-value="42.5">42 ½</td>
                <td data-value="44.5">44 ½</td>
                <td data-value="46.75">46 ¾</td>
                <td data-value="49">49</td>
                <td data-value="51.25">51 ¼</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="56.5">56 ½</td>
                <td data-value="59.5">59 ½</td>
                <td data-value="62.5">62 ½</td>
                <td data-value="66.5">66 ½</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note1') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_size_dress_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-dress-length">
            <thead>
              <tr>
                <th colspan="2">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr class="hg-35">
                <th colspan="2">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_mini') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/short_mini.jpg" alt="short mini" />
                </td>
                <td data-value="33.5">33 ½</td>
                <td data-value="33.5">33 ½</td>
                <td data-value="33.5">33 ½</td>
                <td data-value="34">34</td>
                <td data-value="34">34</td>
                <td data-value="34">34</td>
                <td data-value="34">34</td>
                <td data-value="35">35</td>
                <td data-value="35">35</td>
                <td data-value="35">35</td>
                <td data-value="35">35</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_knee_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td data-value="38">38</td>
                <td data-value="38">38</td>
                <td data-value="38">38</td>
                <td data-value="38">38</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="39">39</td>
                <td data-value="39">39</td>
                <td data-value="39">39</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_midi_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/midi_length.jpg" alt="midi length" />
                </td>
                <td data-value="43.5">43 ½</td>
                <td data-value="43.5">43 ½</td>
                <td data-value="44.5">44 ½</td>
                <td data-value="44.5">44 ½</td>
                <td data-value="45">45</td>
                <td data-value="45">45</td>
                <td data-value="46">46</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_tea_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td data-value="45.5">45 ½</td>
                <td data-value="45.5">45 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="47">47</td>
                <td data-value="47">47</td>
                <td data-value="48">48</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ballerina_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ballerina_length.jpg" alt="ballerina length" />
                </td>
                <td data-value="51">51</td>
                <td data-value="51">51</td>
                <td data-value="51.5">51 ½</td>
                <td data-value="51.5">51 ½</td>
                <td data-value="52">52</td>
                <td data-value="52">52</td>
                <td data-value="53">53</td>
                <td data-value="53">53</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ankle_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
                <td data-value="53">53</td>
                <td data-value="53">53</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
                <td data-value="55">55</td>
                <td data-value="55">55</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/floor_length.jpg" alt="floor length" />
                </td>
                <td data-value="58">58</td>
                <td data-value="58">58</td>
                <td data-value="59">59</td>
                <td data-value="59">59</td>
                <td data-value="60">60</td>
                <td data-value="60">60</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="size_chart_note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2') }}
        </p>
        <h2 class="train_length_chart size_chart_title">{{ nl('page_size_train_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_size_train') }}</th>
                <td>{{ nl('page_size_sweep_train') }}</td>
                <td>{{ nl('page_size_court_train') }}</td>
                <td>{{ nl('page_size_chapel_train') }}</td>
                <td>{{ nl('page_size_cathedral_train') }}</td>
                <td>{{ nl('page_size_royal_train') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_inch') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/sweep_train.jpg" alt="sweep train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/court_train.jpg" alt="court train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/chapel_train.jpg" alt="chapel train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/cathedral_train.jpg" alt="cathedral train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/royal_train.jpg" alt="royal train" />
                </td>
              </tr>
              <tr>
                <td data-value="12">12</td>
                <td data-value="18">18</td>
                <td data-value="24">24</td>
                <td data-value="32">32</td>
                <td data-value="48">48</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note3') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'maternity'" class="maternity">
        <p style="margin-top:20px;margin-bottom: 5px;color:#666;">
          <strong>{{ nl('page_size_note') }}</strong> Ordering your maternity gown doesn't have to be hard. We've done our best to simplify
          the process for you, so you order the perfect dress. Measure your bust and hips only and find your closest match on the chart
          below.
          <span class="ont-family-text">{{ nl('page_size_advice') }}</span>
        </p>
        <h2 class="size_chart size_chart_title">{{ nl('page_common_size_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th width="18%">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="32">32</td>
                <td data-value="33">33</td>
                <td data-value="34">34</td>
                <td data-value="35">35</td>
                <td data-value="36">36</td>
                <td data-value="37.5">37 ½</td>
                <td data-value="39">39</td>
                <td data-value="41">41</td>
                <td data-value="43.25">43 ¼</td>
                <td data-value="45.5">45 ½</td>
                <td data-value="47.75">47 ¾</td>
                <td data-value="50">50</td>
                <td data-value="53">53</td>
                <td data-value="56">56</td>
                <td data-value="59">59</td>
                <td data-value="63">63</td>
              </tr>
              <tr>
                <th>{{ nl('page_common_under_bust') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="28.5">28 ½</td>
                <td data-value="29.5">29 ½</td>
                <td data-value="30.5">30 ½</td>
                <td data-value="31.5">31 ½</td>
                <td data-value="32.5">32 ½</td>
                <td data-value="34">34</td>
                <td data-value="35.5">35 ½</td>
                <td data-value="37.75">37 ¾</td>
                <td data-value="40.5">40 ½</td>
                <td data-value="42.75">42 ¾</td>
                <td data-value="45.5">45 ½</td>
                <td data-value="47.5">47 ½</td>
                <td data-value="50.75">50 ¾</td>
                <td data-value="53.75">53 ¾</td>
                <td data-value="56.75">56 ¾</td>
                <td data-value="63">63</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="35.5">35 ½</td>
                <td data-value="36.5">36 ½</td>
                <td data-value="37.5">37 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="39.5">39 ½</td>
                <td data-value="41">41</td>
                <td data-value="42.5">42 ½</td>
                <td data-value="44.5">44 ½</td>
                <td data-value="46.75">46 ¾</td>
                <td data-value="49">49</td>
                <td data-value="51.25">51 ¼</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="56.5">56 ½</td>
                <td data-value="59.5">59 ½</td>
                <td data-value="62.5">62 ½</td>
                <td data-value="66.5">66 ½</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong> Some styles have ease added for your comfort. If you are in between sizes, it is
            suggested to call and speak to a stylist or order the dress in custom size.
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_size_dress_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-dress-length">
            <thead>
              <tr>
                <th colspan="2">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr class="hg-35">
                <th colspan="2">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_mini') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/short_mini.jpg" alt="short mini" />
                </td>
                <td data-value="33.5">33 ½</td>
                <td data-value="33.5">33 ½</td>
                <td data-value="33.5">33 ½</td>
                <td data-value="34">34</td>
                <td data-value="34">34</td>
                <td data-value="34">34</td>
                <td data-value="34">34</td>
                <td data-value="35">35</td>
                <td data-value="35">35</td>
                <td data-value="35">35</td>
                <td data-value="35">35</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
                <td data-value="36">36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_knee_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td data-value="38">38</td>
                <td data-value="38">38</td>
                <td data-value="38">38</td>
                <td data-value="38">38</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="39">39</td>
                <td data-value="39">39</td>
                <td data-value="39">39</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_tea_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td data-value="45.5">45 ½</td>
                <td data-value="45.5">45 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="47">47</td>
                <td data-value="47">47</td>
                <td data-value="48">48</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ankle_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
                <td data-value="53">53</td>
                <td data-value="53">53</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
                <td data-value="55">55</td>
                <td data-value="55">55</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/floor_length.jpg" alt="floor length" />
                </td>
                <td data-value="58">58</td>
                <td data-value="58">58</td>
                <td data-value="59">59</td>
                <td data-value="59">59</td>
                <td data-value="60">60</td>
                <td data-value="60">60</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="size_chart_note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2') }}
        </p>
        <h2 class="train_length_chart size_chart_title">{{ nl('page_size_train_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_size_train') }}</th>
                <td>{{ nl('page_shop_by_length_Sweep_Train') }}</td>
                <td>{{ nl('page_size_court_train') }}</td>
                <td>{{ nl('page_size_chapel_train') }}</td>
                <td>{{ nl('page_size_cathedral_train') }}</td>
                <td>{{ nl('page_size_royal_train') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_inch') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/sweep_train.jpg" alt="sweep train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/court_train.jpg" alt="court train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/chapel_train.jpg" alt="chapel train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/cathedral_train.jpg" alt="cathedral train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/royal_train.jpg" alt="royal train" />
                </td>
              </tr>
              <tr>
                <td data-value="12">12</td>
                <td data-value="18">18</td>
                <td data-value="24">24</td>
                <td data-value="32">32</td>
                <td data-value="48">48</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note3') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'modest'" class="modest">
        <h2 class="size_chart size_chart_title">{{ nl('page_common_size_chart') }}</h2>

        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th width="18%">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_bust') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="32">32</td>
                <td data-value="33">33</td>
                <td data-value="34">34</td>
                <td data-value="35">35</td>
                <td data-value="36">36</td>
                <td data-value="37.5">37 ½</td>
                <td data-value="39">39</td>
                <td data-value="41">41</td>
                <td data-value="43.25">43 ¼</td>
                <td data-value="45.5">45 ½</td>
                <td data-value="47.75">47 ¾</td>
                <td data-value="50">50</td>
                <td data-value="53">53</td>
                <td data-value="56">56</td>
                <td data-value="59">59</td>
                <td data-value="63">63</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="25.5">25 ½</td>
                <td data-value="26.5">26 ½</td>
                <td data-value="27.5">27 ½</td>
                <td data-value="28.5">28 ½</td>
                <td data-value="29.5">29 ½</td>
                <td data-value="31">31</td>
                <td data-value="32.5">32 ½</td>
                <td data-value="34.75">34 ¾</td>
                <td data-value="37.25">37 ¼</td>
                <td data-value="39.75">39 ¾</td>
                <td data-value="42.25">42 ¼</td>
                <td data-value="44.75">44 ¾</td>
                <td data-value="48">48</td>
                <td data-value="51.25">51 ¼</td>
                <td data-value="54.5">54 ½</td>
                <td data-value="58.75">58 ¾</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_hips') }} ({{ nl('page_common_length_inch') }})</th>
                <td data-value="35.5">35 ½</td>
                <td data-value="36.5">36 ½</td>
                <td data-value="37.5">37 ½</td>
                <td data-value="38.5">38 ½</td>
                <td data-value="39.5">39 ½</td>
                <td data-value="41">41</td>
                <td data-value="42.5">42 ½</td>
                <td data-value="44.5">44 ½</td>
                <td data-value="46.75">46 ¾</td>
                <td data-value="49">49</td>
                <td data-value="51.25">51 ¼</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="56.5">56 ½</td>
                <td data-value="59.5">59 ½</td>
                <td data-value="62.5">62 ½</td>
                <td data-value="66.5">66 ½</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note1') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">DRESS LENGTH CHART (HOLLOW TO HEM)</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-dress-length">
            <thead>
              <tr>
                <th colspan="2">US {{ nl('page_common_size') }}</th>
                <td>A0</td>
                <td>A2</td>
                <td>A4</td>
                <td>A6</td>
                <td>A8</td>
                <td>A10</td>
                <td>A12</td>
                <td>A14</td>
                <td>A16</td>
                <td>A18</td>
                <td>A20</td>
                <td>A22</td>
                <td>A24</td>
                <td>A26</td>
                <td>A28</td>
                <td>A30</td>
              </tr>
            </thead>
            <tbody>
              <tr class="hg-35">
                <th colspan="2">EU {{ nl('page_common_size') }}</th>
                <td>EU 32</td>
                <td>EU 34</td>
                <td>EU 36</td>
                <td>EU 38</td>
                <td>EU 40</td>
                <td>EU 42</td>
                <td>EU 44</td>
                <td>EU 46</td>
                <td>EU 48</td>
                <td>EU 50</td>
                <td>EU 52</td>
                <td>EU 54</td>
                <td>EU 56</td>
                <td>EU 58</td>
                <td>EU 60</td>
                <td>EU 62</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">UK {{ nl('page_common_size') }}</th>
                <td>UK 4</td>
                <td>UK 6</td>
                <td>UK 8</td>
                <td>UK 10</td>
                <td>UK 12</td>
                <td>UK 14</td>
                <td>UK 16</td>
                <td>UK 18</td>
                <td>UK 20</td>
                <td>UK 22</td>
                <td>UK 24</td>
                <td>UK 26</td>
                <td>UK 28</td>
                <td>UK 30</td>
                <td>UK 32</td>
                <td>UK 36</td>
              </tr>
              <tr class="hg-35">
                <th colspan="2">AU {{ nl('page_common_size') }}</th>
                <td>AU 4</td>
                <td>AU 6</td>
                <td>AU 8</td>
                <td>AU 10</td>
                <td>AU 12</td>
                <td>AU 14</td>
                <td>AU 16</td>
                <td>AU 18</td>
                <td>AU 20</td>
                <td>AU 22</td>
                <td>AU 24</td>
                <td>AU 26</td>
                <td>AU 28</td>
                <td>AU 30</td>
                <td>AU 32</td>
                <td>AU 36</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_knee_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/knee_length.jpg" alt="knee length" />
                </td>
                <td data-value="39">39</td>
                <td data-value="39">39</td>
                <td data-value="39.5">39 ½</td>
                <td data-value="39.5">39 ½</td>
                <td data-value="40">40</td>
                <td data-value="40">40</td>
                <td data-value="40.5">40 ½</td>
                <td data-value="40.5">40 ½</td>
                <td data-value="41">41</td>
                <td data-value="41">41</td>
                <td data-value="41">41</td>
                <td data-value="42">42</td>
                <td data-value="42">42</td>
                <td data-value="42">42</td>
                <td data-value="42">42</td>
                <td data-value="42">42</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_tea_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/tea_length.jpg" alt="tea length" />
                </td>
                <td data-value="45.5">45 ½</td>
                <td data-value="45.5">45 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="46.5">46 ½</td>
                <td data-value="47">47</td>
                <td data-value="47">47</td>
                <td data-value="48">48</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
                <td data-value="48.5">48 ½</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_ankle_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/ankle_length.jpg" alt="ankle length" />
                </td>
                <td data-value="53">53</td>
                <td data-value="53">53</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="53.5">53 ½</td>
                <td data-value="54">54</td>
                <td data-value="54">54</td>
                <td data-value="55">55</td>
                <td data-value="55">55</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
                <td data-value="56">56</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_floor_length') }} ({{ nl('page_common_length_inch') }})</th>
                <td>
                  <img src="~assets/images/measurement_guide/dress_length_chart/floor_length.jpg" alt="floor length" />
                </td>
                <td data-value="58">58</td>
                <td data-value="58">58</td>
                <td data-value="59">59</td>
                <td data-value="59">59</td>
                <td data-value="60">60</td>
                <td data-value="60">60</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
                <td data-value="61">61</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="size_chart_note">
          <strong>{{ nl('page_size_note') }}</strong>
          {{ nl('page_size_note2') }}
        </p>
        <h2 class="train_length_chart size_chart_title">{{ nl('page_size_train_length_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size tbl-size-train-length">
            <thead>
              <tr>
                <th>{{ nl('page_size_train') }}</th>
                <td>{{ nl('page_shop_by_length_Sweep_Train') }}</td>
                <td>{{ nl('page_size_court_train') }}</td>
                <td>{{ nl('page_size_chapel_train') }}</td>
                <td>{{ nl('page_size_cathedral_train') }}</td>
                <td>{{ nl('page_size_royal_train') }}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th rowspan="2">{{ nl('page_size_length_inch') }}</th>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/sweep_train.jpg" alt="sweep train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/court_train.jpg" alt="court train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/chapel_train.jpg" alt="chapel train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/cathedral_train.jpg" alt="cathedral train" />
                </td>
                <td>
                  <img src="~assets/images/measurement_guide/train_length_chart/royal_train.jpg" alt="royal train" />
                </td>
              </tr>
              <tr>
                <td data-value="12">12</td>
                <td data-value="18">18</td>
                <td data-value="24">24</td>
                <td data-value="32">32</td>
                <td data-value="48">48</td>
              </tr>
            </tbody>
          </table>
          <p class="note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note3') }}
          </p>
        </div>
      </div>
      <div v-show="clickTab == 'veil'" class="veil">
        <h2 class="size_chart_title">{{ nl('page_veil_length') }}</h2>
        <div :style="{ background: 'url(' + veilImgIn + ') no-repeat', backgroundSize: 'contain' }" class="veil_img"></div>
        <table class="tbl-size">
          <thead>
            <tr>
              <th>US {{ nl('page_common_size') }}</th>
              <td>{{ nl('page_size_cathedral') }}</td>
              <td>{{ nl('page_size_chapel') }}</td>
              <td>{{ nl('page_size_intermission') }}</td>
              <td>{{ nl('page_size_fingertip') }}</td>
              <td>{{ nl('page_size_wrist') }}</td>
              <td>{{ nl('page_size_elbow') }}</td>
              <td>{{ nl('page_size_shoulder') }}</td>
            </tr>
          </thead>
          <tr>
            <th>{{ nl('page_size_length_inch') }}</th>
            <td>110</td>
            <td>95</td>
            <td>55</td>
            <td>42</td>
            <td>34</td>
            <td>27</td>
            <td>22</td>
          </tr>
        </table>
      </div>
      <div v-show="clickTab == 'vest'" class="vest">
        <h2 class="size_chart size_chart_title">{{ nl('page_man_vest_size_chart') }}</h2>
        <div class="mt">
          <table class="tbl-size">
            <thead>
              <tr>
                <th>US {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
                <td>XL</td>
                <td>2XL</td>
                <td>3XL</td>
                <td>4XL</td>
                <td>5XL</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th width="18%">EU {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
                <td>XL</td>
                <td>XXL</td>
                <td>3XL</td>
                <td>4XL</td>
                <td>5XL</td>
              </tr>
              <tr>
                <th width="18%">UK {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
                <td>XL</td>
                <td>XXL</td>
                <td>XXXL</td>
                <td>XXXXL</td>
                <td>XXXXXL</td>
              </tr>
              <tr>
                <th width="18%">AU {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
                <td>XL</td>
                <td>XXL</td>
                <td>XXXL</td>
                <td>4XL</td>
                <td>5XL</td>
              </tr>
              <tr>
                <th>{{ nl('page_common_equivalent_coat_size') }} ({{ nl('page_common_length_inch') }})</th>
                <td>34-38</td>
                <td>39-42</td>
                <td>43-46</td>
                <td>48-50</td>
                <td>52-54</td>
                <td>56-58</td>
                <td>60-62</td>
                <td>64-66</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_chest') }} ({{ nl('page_common_length_inch') }})</th>
                <td>41</td>
                <td>44</td>
                <td>47</td>
                <td>51 ½</td>
                <td>56 ½</td>
                <td>60 ½</td>
                <td>64 ½</td>
                <td>68 ½</td>
              </tr>
              <tr>
                <th>{{ nl('page_size_waist') }} ({{ nl('page_common_length_inch') }})</th>
                <td>40 ½</td>
                <td>43 ½</td>
                <td>46 ½</td>
                <td>50 ½</td>
                <td>55 ½</td>
                <td>59 ½</td>
                <td>63 ½</td>
                <td>67 ½</td>
              </tr>
            </tbody>
          </table>
          <p class="size_chart_note">
            <strong>{{ nl('page_size_note') }}</strong>
            {{ nl('page_size_note7') }}
          </p>
        </div>
        <h2 class="size_chart size_chart_title">{{ nl('page_boy_vest_size_chart') | dropFanXie }}</h2>
        <div class="mt">
          <table class="tbl-boy-size">
            <thead>
              <tr>
                <th>US {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>EU {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
              </tr>
              <tr>
                <th>UK {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
              </tr>
              <tr>
                <th>AU {{ nl('page_common_size') }}</th>
                <td>S</td>
                <td>M</td>
                <td>L</td>
              </tr>
              <tr>
                <th>{{ nl('page_common_boy_vest_age_size') }}</th>
                <td>2-6yrs</td>
                <td>7-11yrs</td>
                <td>12-16yrs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SizeAndFit',
  filters: {
    lower(data) {
      return (data || '').toLocaleLowerCase()
    },
    title(data) {
      return data || ''
    }
  },
  data() {
    return {
      sizeType: 'inch',
      clickTab: 'bridesmaid'
    }
  },
  computed: {
    veilImgIn() {
      // inch图
      // return require('~/assets/images/veil/veil_length-' + this.language + '.jpg')
      return this.nl('page_image_veil_veil_length_in')
    },
    veilImgCm() {
      // cm图
      // return require('~/assets/images/veil/veil_length_cm-' + this.language + '.jpg')
      return this.nl('page_image_veil_veil_length_cm')
    }
  },
  created() {
    if (this.showEuSize) this.sizeType = 'cm'
  }
}
</script>

<style lang="less" scoped>
.size-fit-dialog {
  .mt {
    margin-top: 20px;
    // padding-top: 10px;
  }
  .mt40 {
    margin-top: 40px;
    // padding-top: 10px;
  }
  .note {
    margin-top: 15px;
    color: var(--color-121212);
  }
  strong {
    color: var(--color-121212);
    font-weight: normal;
  }
  .font-family-text {
    font-family: @font-family-600;
  }
}
.tbl-size {
  line-height: 18px;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  tr th {
    width: 169px;
  }
  th,
  td {
    border: solid 1px #e2e2e2;
    text-align: center;
    padding: 9px 0 8px;
    width: 56px;
    .transition(all 0.5s ease 0s);
  }
  th,
  thead td {
    font-weight: normal;
    background: #f2f2f2;
    span {
      text-transform: uppercase;
    }
  }
  .active {
    background: #f9d4e3;
  }
  thead tr {
    th,
    td {
      text-transform: capitalize;
    }
  }
}
.tbl-boy-size {
  line-height: 18px;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  th,
  td {
    border: solid 1px #e2e2e2;
    text-align: center;
    padding: 9px 0 8px;
    width: 56px;
    .transition(all 0.5s ease 0s);
  }
  th,
  thead td {
    font-weight: normal;
    background: #f2f2f2;
    span {
      text-transform: uppercase;
    }
  }
  .active {
    background: #f9d4e3;
  }
}

.tbl-size_bride {
  th,
  td {
    width: 100px;
  }
}
.tbl-size-junior tr th:first-child {
  width: 90px;
}
.tbl-size-dress-length {
  tr th {
    width: 111px;
    padding: 0 1px;
  }
  img {
    width: 47px;
    height: 58px;
    padding: 0 0 1px;
    vertical-align: middle;
  }

  tbody tr td {
    padding: 0;
  }
}

.tbl-size-train-length {
  tr th {
    width: 66px;
    padding: 0 1px;
  }
  img {
    width: 47px;
    height: 58px;
    padding: 0 0 1px;
    vertical-align: middle;
  }

  tbody tr:first-child td {
    padding: 0;
  }
}

#sizeChartDialog {
  .tabs_new {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #eee;
    line-height: 28px;
    padding-top: 15px;
    .tab {
      color: var(--color-121212);
      font-size: 13px;
      text-transform: capitalize;
      &.active {
        color: var(--color-121212);
        &::after {
          content: '';
          display: block;
          width: 100%;
          height: 2px;
          background: var(--color-121212);
          margin-top: -2px;
          padding: 0 6px;
          position: relative;
          left: -6px;
        }
      }
      &:hover {
        color: var(--color-121212);
        cursor: pointer;
        &::after {
          content: '';
          display: block;
          width: 100%;
          height: 2px;
          background: var(--color-121212);
          margin-top: -2px;
          padding: 0 6px;
          position: relative;
          left: -6px;
        }
      }
    }
  }

  .content {
    width: 100%;
    > div {
      margin-top: -20px;
    }
  }
  .size_title {
    margin-top: 30px;
    font-size: 16px;
    padding-bottom: 5px;
    border-bottom: solid 1px #ccc;
    font-family: @font-family-600, sans-serif;
    text-transform: uppercase;
  }
  .size_chart_title {
    margin-top: 45px;
    font-size: 14px;
    font-family: @font-family-600, sans-serif;
    text-transform: uppercase;
  }
  .size_chart_note {
    margin-top: 20px;
    color: #666;
    margin-bottom: 45px;
  }
  .flower_girl,
  .vest {
    .size_chart_note {
      margin-bottom: 0px;
      padding-bottom: 0px;
      border-bottom: 0px;
    }
  }
  .standard-size {
    div.left {
      float: left;
      height: 505px;
      width: 393px;
      padding-right: 38px;
      overflow-y: scroll;

      .show-measurement {
        margin-top: 15px;
        margin-bottom: 30px;
        &:hover {
          cursor: pointer;
        }
        a {
          color: @theme;
          text-decoration: underline;
        }
      }

      .measurement {
        img {
          margin: 20px 0;
        }
      }

      table {
        width: 390px;
        td {
          width: 70px;
          text-align: center;
        }
        thead tr {
          height: 40px;
          background-color: #f6f6f6;
          th {
            text-transform: uppercase;
            width: 70px;
            text-align: center;
          }
        }

        tbody tr:nth-child(even) {
          background-color: #f6f6f6;
        }
        tbody tr {
          height: 34px;
          line-height: 34px;
          -moz-transition: all 0.5s ease 0s;
          -webkit-transition: all 0.5s ease 0s;
          transition: all 0.5s ease 0s;
          th {
            text-align: center;
          }
          &.pink {
            background-color: #f9d4e3;
          }
        }
      }

      div.note-size {
        margin-top: 7px;
        width: 390px;
      }
    }
  }
  .veil_img {
    height: 440px;
    width: 100%;
    margin-top: 15px;
  }
}
.switch_unit_box {
  display: flex;
  align-items: center;
  .unit {
    font-size: 13px;
    line-height: 18px;
    font-family: @font-family-500;
    color: var(--color-999999);
  }
}
.switch_unit {
  display: flex;
  align-items: center;
  position: relative;
  width: 32px;
  height: 12px;
  margin: 0 8px;
  span {
    display: inline-block;
    width: 16px;
    height: 12px;
  }
  .selected_icon_bg {
    background: var(--color-eeeeee);
  }
  .selected_icon_bg_left {
    border-radius: 50% 0 0 50%;
  }
  .selected_icon_bg_right {
    border-radius: 0 50% 50% 0;
  }
  .selected_icon {
    position: absolute;
    top: -2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-121212);
  }
  &.cm {
    .selected_icon {
      right: 0;
    }
  }
}
#sizeChartDialog {
  .switch_unit_box {
    margin-top: 20px;
  }
}

#sizeChartDialog .scp-table,
.dialog .scp-table {
  .switch_unit_box {
    margin-top: -5px;
    margin-bottom: 15px;
  }
}

.prod-info {
  div.label-line,
  div.custom-label-box {
    display: flex;
    justify-content: space-between;
  }
  div.custom-label-box {
    max-width: 420px;
  }
  .switch_unit_box {
    display: none;
  }
}
.cm-pis-size-box.pis-size-box a {
  width: 82px;
}
.hg-35 {
  height: 35px;
}
</style>
