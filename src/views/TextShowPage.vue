<template>
  <div class="textShowPage">
    <div class="textShowFilterBar">
      <div class="filter">
        <div class="filterItem">
          <span>縣市：</span>
          <div class="filterItemSelect">
            <select
              name="county"
              id="county"
              @change="filterChangeHandler()"
              v-model="targetFilterDataCountyNameIndex"
            >
              <option value="-1" selected>請選擇</option>
              <option
                v-for="(filterCounty, index) in filterData"
                :key="filterCounty.countyName"
                :value="index"
              >
                {{ filterCounty.countyName }}
              </option>
            </select>
          </div>
        </div>
        <div class="filterItem">
          <span>區域：</span>
          <div class="filterItemSelect">
            <select
              name="section"
              id="section"
              v-model="targetFilterDataCountySectionIndex"
            >
              <option value="-1" selected>請選擇</option>
              <option
                v-for="(filterSection, index) in targetFilterData.countySection"
                :value="index"
              >
                {{ filterSection }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="button">
        <button @click="executeFilter()">確認篩選</button>
        <button @click="clearFilter()">顯示全部</button>
      </div>
    </div>
    <div class="textShow">
      <div class="filterNoTarget" v-if="showOpenData.length === 0">
        <span>所查區域無庫存！</span>
      </div>
      <TextShowItem
        v-else
        v-for="openDataElement in showOpenData"
        :key="openDataElement.id"
        :openDataElement="openDataElement"
        :openDataRefreshTime="openDataRefreshTime"
      />
    </div>
  </div>
  <loadingScreen
    :isNowLoading="isNowLoading"
    :isNowAutoUpdating="isNowAutoUpdating"
  />
</template>
<script setup lang="ts">
/* vue module */
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
/* services */
import { getOpenDataJson } from "@/services/Convert.opendata";
/* interfaces */
import OpenData from "@/interfaces/OpenData";
import FilterData from "@/interfaces/FilterData";
/* components */
import TextShowItem from "@/components/TextShowItem.vue";
import loadingScreen from "@/components/loadingScreen.vue";

const filterDefaultIndex = ref<number>(-1);
const filterDefaultString = ref<string>("");
const filterData = reactive<FilterData[]>([
  {
    countyName: "臺北市",
    countySection: [
      "中正區",
      "大同區",
      "中山區",
      "松山區",
      "大安區",
      "萬華區",
      "信義區",
      "士林區",
      "北投區",
      "內湖區",
      "南港區",
      "文山區",
    ],
  },
  {
    countyName: "基隆市",
    countySection: [
      "仁愛區",
      "中正區",
      "信義區",
      "中山區",
      "安樂區",
      "暖暖區",
      "七堵區",
    ],
  },
  {
    countyName: "新北市",
    countySection: [
      "板橋區",
      "新莊區",
      "中和區",
      "永和區",
      "土城區",
      "樹林區",
      "三峽區",
      "鶯歌區",
      "三重區",
      "蘆洲區",
      "五股區",
      "泰山區",
      "林口區",
      "八里區",
      "淡水區",
      "三芝區",
      "石門區",
      "金山區",
      "萬里區",
      "汐止區",
      "瑞芳區",
      "貢寮區",
      "平溪區",
      "雙溪區",
      "新店區",
      "深坑區",
      "石碇區",
      "坪林區",
      "烏來區",
    ],
  },
  {
    countyName: "宜蘭縣",
    countySection: [
      "宜蘭市",
      "頭城鎮",
      "羅東鎮",
      "蘇澳鎮",
      "礁溪鄉",
      "壯圍鄉",
      "員山鄉",
      "冬山鄉",
      "五結鄉",
      "三星鄉",
      "大同鄉",
      "南澳鄉",
    ],
  },
  {
    countyName: "桃園市",
    countySection: [
      "桃園區",
      "中壢區",
      "平鎮區",
      "八德區",
      "楊梅區",
      "蘆竹區",
      "大溪區",
      "龍潭區",
      "龜山區",
      "大園區",
      "觀音區",
      "新屋區",
      "復興區",
    ],
  },
  {
    countyName: "新竹市",
    countySection: ["東區", "北區", "香山區"],
  },
  {
    countyName: "新竹縣",
    countySection: [
      "竹北市",
      "竹東鎮",
      "新埔鎮",
      "關西鎮",
      "湖口鄉",
      "新豐鄉",
      "峨眉鄉",
      "寶山鄉",
      "北埔鄉",
      "芎林鄉",
      "橫山鄉",
      "尖石鄉",
      "五峰鄉",
    ],
  },
  {
    countyName: "苗栗縣",
    countySection: [
      "苗栗市",
      "頭份市",
      "竹南鎮",
      "後龍鎮",
      "通霄鎮",
      "苑裡鎮",
      "卓蘭鎮",
      "造橋鄉",
      "西湖鄉",
      "頭屋鄉",
      "公館鄉",
      "銅鑼鄉",
      "三義鄉",
      "大湖鄉",
      "獅潭鄉",
      "三灣鄉",
      "南庄鄉",
      "泰安鄉",
    ],
  },
  {
    countyName: "臺中市",
    countySection: [
      "中區",
      "東區",
      "南區",
      "西區",
      "北區",
      "北屯區",
      "西屯區",
      "南屯區",
      "太平區",
      "大里區",
      "霧峰區",
      "烏日區",
      "豐原區",
      "后里區",
      "石岡區",
      "東勢區",
      "新社區",
      "潭子區",
      "大雅區",
      "神岡區",
      "大肚區",
      "沙鹿區",
      "龍井區",
      "梧棲區",
      "清水區",
      "大甲區",
      "外埔區",
      "大安區",
      "和平區",
    ],
  },
  {
    countyName: "彰化縣",
    countySection: [
      "彰化市",
      "員林市",
      "和美鎮",
      "鹿港鎮",
      "溪湖鎮",
      "二林鎮",
      "田中鎮",
      "北斗鎮",
      "花壇鄉",
      "芬園鄉",
      "大村鄉",
      "永靖鄉",
      "伸港鄉",
      "線西鄉",
      "福興鄉",
      "秀水鄉",
      "埔心鄉",
      "埔鹽鄉",
      "大城鄉",
      "芳苑鄉",
      "竹塘鄉",
      "社頭鄉",
      "二水鄉",
      "田尾鄉",
      "埤頭鄉",
      "溪州鄉",
    ],
  },
  {
    countyName: "南投縣",
    countySection: [
      "南投市",
      "埔里鎮",
      "草屯鎮",
      "竹山鎮",
      "集集鎮",
      "名間鄉",
      "鹿谷鄉",
      "中寮鄉",
      "魚池鄉",
      "國姓鄉",
      "水里鄉",
      "信義鄉",
      "仁愛鄉",
    ],
  },
  {
    countyName: "雲林縣",
    countySection: [
      "斗六市",
      "斗南鎮",
      "虎尾鎮",
      "西螺鎮",
      "土庫鎮",
      "北港鎮",
      "林內鄉",
      "古坑鄉",
      "大埤鄉",
      "莿桐鄉",
      "褒忠鄉",
      "二崙鄉",
      "崙背鄉",
      "麥寮鄉",
      "臺西鄉",
      "東勢鄉",
      "元長鄉",
      "四湖鄉",
      "口湖鄉",
      "水林鄉",
    ],
  },
  {
    countyName: "嘉義市",
    countySection: ["東區", "西區"],
  },
  {
    countyName: "嘉義縣",
    countySection: [
      "太保市",
      "朴子市",
      "布袋鎮",
      "大林鎮",
      "民雄鄉",
      "溪口鄉",
      "新港鄉",
      "六腳鄉",
      "東石鄉",
      "義竹鄉",
      "鹿草鄉",
      "水上鄉",
      "中埔鄉",
      "竹崎鄉",
      "梅山鄉",
      "番路鄉",
      "大埔鄉",
      "阿里山鄉",
    ],
  },
  {
    countyName: "臺南市",
    countySection: [
      "中西區",
      "東區",
      "南區",
      "北區",
      "安平區",
      "安南區",
      "永康區",
      "歸仁區",
      "新化區",
      "左鎮區",
      "玉井區",
      "楠西區",
      "南化區",
      "仁德區",
      "關廟區",
      "龍崎區",
      "官田區",
      "麻豆區",
      "佳里區",
      "西港區",
      "七股區",
      "將軍區",
      "學甲區",
      "北門區",
      "新營區",
      "後壁區",
      "白河區",
      "東山區",
      "六甲區",
      "下營區",
      "柳營區",
      "鹽水區",
      "善化區",
      "大內區",
      "山上區",
      "新市區",
      "安定區",
    ],
  },
  {
    countyName: "高雄市",
    countySection: [
      "楠梓區",
      "左營區",
      "鼓山區",
      "三民區",
      "鹽埕區",
      "前金區",
      "新興區",
      "苓雅區",
      "前鎮區",
      "旗津區",
      "小港區",
      "鳳山區",
      "大寮區",
      "鳥松區",
      "林園區",
      "仁武區",
      "大樹區",
      "大社區",
      "岡山區",
      "路竹區",
      "橋頭區",
      "梓官區",
      "彌陀區",
      "永安區",
      "燕巢區",
      "田寮區",
      "阿蓮區",
      "茄萣區",
      "湖內區",
      "旗山區",
      "美濃區",
      "內門區",
      "杉林區",
      "甲仙區",
      "六龜區",
      "茂林區",
      "桃源區",
      "那瑪夏區",
    ],
  },
  {
    countyName: "臺東縣",
    countySection: [
      "臺東市",
      "成功鎮",
      "關山鎮",
      "長濱鄉",
      "池上鄉",
      "東河鄉",
      "鹿野鄉",
      "卑南鄉",
      "大武鄉",
      "綠島鄉",
      "太麻里鄉",
      "海端鄉",
      "延平鄉",
      "金峰鄉",
      "達仁鄉",
      "蘭嶼鄉",
    ],
  },
  {
    countyName: "花蓮縣",
    countySection: [
      "花蓮市",
      "鳳林鎮",
      "玉里鎮",
      "新城鄉",
      "吉安鄉",
      "壽豐鄉",
      "光復鄉",
      "豐濱鄉",
      "瑞穗鄉",
      "富里鄉",
      "秀林鄉",
      "萬榮鄉",
      "卓溪鄉",
    ],
  },
  {
    countyName: "屏東縣",
    countySection: [
      "屏東市",
      "潮州鎮",
      "東港鎮",
      "恆春鎮",
      "萬丹鄉",
      "長治鄉",
      "麟洛鄉",
      "九如鄉",
      "里港鄉",
      "鹽埔鄉",
      "高樹鄉",
      "萬巒鄉",
      "內埔鄉",
      "竹田鄉",
      "新埤鄉",
      "枋寮鄉",
      "新園鄉",
      "崁頂鄉",
      "林邊鄉",
      "南州鄉",
      "佳冬鄉",
      "琉球鄉",
      "車城鄉",
      "滿州鄉",
      "枋山鄉",
      "霧臺鄉",
      "瑪家鄉",
      "泰武鄉",
      "來義鄉",
      "春日鄉",
      "獅子鄉",
      "牡丹鄉",
      "三地門鄉",
    ],
  },
  {
    countyName: "澎湖縣",
    countySection: ["馬公市", "湖西鄉", "白沙鄉", "西嶼鄉", "望安鄉", "七美鄉"],
  },
  {
    countyName: "金門縣",
    countySection: ["金城鎮", "金湖鎮", "金沙鎮", "金寧鄉", "烈嶼鄉", "烏坵鄉"],
  },
  {
    countyName: "連江縣",
    countySection: ["南竿鄉", "北竿鄉", "莒光鄉", "東引鄉"],
  },
]);
const autoUpdateIntervalForOneMinute = ref<number>(60000);

let allOpenData = ref<OpenData[]>([]);
let showOpenData = ref<OpenData[]>([]);
let autoUpdateOpenData = ref<OpenData[]>([]);
let openDataRefreshTime = ref<string>("");
let targetFilterDataCountyNameIndex = ref<number>(-1);
let targetFilterDataCountySectionIndex = ref<number>(-1);
let targetFilterData = ref<FilterData>({ countyName: "", countySection: [] });
let filterString = ref<string>("");
let isNowLoading = ref<boolean>(false);
let isNowAutoUpdating = ref<boolean>(false);
let autoUpdateIntervalTimerId = ref<number>(0);

const setDefaultCountyNameIndex = () => {
  targetFilterDataCountyNameIndex.value = filterDefaultIndex.value;
};
const setDefaultCountySectionIndex = () => {
  targetFilterDataCountySectionIndex.value = filterDefaultIndex.value;
};
const setDefaultShowOpenData = async () => {
  allOpenData.value = await getOpenDataJson();
  showOpenData.value = allOpenData.value;
};
const setDefaultTargetFilterData = () => {
  targetFilterData.value = { countyName: "", countySection: [] };
};
const setDefaultFilterString = () => {
  filterString.value = filterDefaultString.value;
};
const setIsNowLoading = () => {
  isNowLoading.value = true;
};
const setIsNotNowLoading = () => {
  isNowLoading.value = false;
};
const setIsAutoUpdating = () => {
  isNowAutoUpdating.value = true;
};
const setIsNotAutoUpdating = () => {
  isNowAutoUpdating.value = false;
};
const setOpenDataRefreshTime = () => {
  const currentDate = new Date();
  openDataRefreshTime.value = `${currentDate.toDateString()} ${currentDate
    .toTimeString()
    .substring(0, 8)}`;
};
const filterChangeHandler = () => {
  if (targetFilterDataCountyNameIndex.value > -1) {
    targetFilterData.value = filterData[targetFilterDataCountyNameIndex.value];
    setDefaultCountySectionIndex();
  } else {
    setDefaultCountyNameIndex();
    setDefaultCountySectionIndex();
    setDefaultFilterString();
  }
};
const findFilterInAllOpenData = () => {
  showOpenData.value = allOpenData.value.filter((openDataElement) => {
    return openDataElement.address.includes(filterString.value);
  });
};
const executeFilter = () => {
  if (
    targetFilterDataCountyNameIndex.value !== filterDefaultIndex.value &&
    targetFilterDataCountySectionIndex.value !== filterDefaultIndex.value
  ) {
    setIsNowLoading();
    filterString.value = `${
      filterData[targetFilterDataCountyNameIndex.value].countyName
    }${
      filterData[targetFilterDataCountyNameIndex.value].countySection[
        targetFilterDataCountySectionIndex.value
      ]
    }`;
    findFilterInAllOpenData();
    setIsNotNowLoading();
  }
};
const clearFilter = async () => {
  setIsNowLoading();
  setDefaultCountyNameIndex();
  setDefaultCountySectionIndex();
  setDefaultTargetFilterData();
  setDefaultFilterString();
  await setDefaultShowOpenData();
  setIsNotNowLoading();
};
const autoUpdateNewShowOpendata = () => {
  showOpenData.value = autoUpdateOpenData.value;
};
const autoUpdateCompareShowOpenData = async () => {
  setIsAutoUpdating();
  autoUpdateOpenData.value = await getOpenDataJson();
  setOpenDataRefreshTime();
  autoUpdateOpenData.value = autoUpdateOpenData.value.filter(
    (openDataElement) => {
      return openDataElement.address.includes(filterString.value);
    }
  );
  if (
    !(
      JSON.stringify(showOpenData.value) ===
      JSON.stringify(autoUpdateOpenData.value)
    )
  ) {
    autoUpdateNewShowOpendata();
  }
  setIsNotAutoUpdating();
};
const setAutoUpdateTimer = () => {
  autoUpdateIntervalTimerId.value = window.setInterval(
    async () => await autoUpdateCompareShowOpenData(),
    autoUpdateIntervalForOneMinute.value
  );
};
const clearAutoUpdateTimer = () => {
  window.clearInterval(autoUpdateIntervalTimerId.value);
};
onMounted(async () => {
  setIsNowLoading();
  allOpenData.value = await getOpenDataJson();
  showOpenData.value = allOpenData.value;
  setOpenDataRefreshTime();
  setOpenDataRefreshTime();
  setIsNotNowLoading();
  setAutoUpdateTimer();
});
onBeforeUnmount(() => {
  clearAutoUpdateTimer();
});
</script>

<style lang="scss" scoped>
.textShowPage {
  background-color: whitesmoke;
  padding: 5px 10px;
  .textShowFilterBar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .filter {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .filterItem {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        padding: 2.5px 5px;
        font-weight: bold;
        font-size: 16px;
        .filterItemSelect {
          position: relative;
          display: flex;
          width: 90px;
          height: 30px;
          border-radius: 0.25em;
          overflow: hidden;
          select {
            height: 30px;
            min-height: 30px;
            max-height: 30px;
            appearance: none;
            outline: 0;
            border: 0;
            box-shadow: none;
            flex: 1;
            padding: 0 1em;
            color: whitesmoke;
            background-color: #6f95bb;
            background-image: none;
            cursor: pointer;
          }
        }
        .filterItemSelect::after {
          content: "\25BC";
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 30px;
          min-width: 20px;
          min-height: 30px;
          max-width: 20px;
          max-height: 30px;
          padding: 7.5px 0 5px 5px;
          background-color: rgb(92, 131, 169);
          transition: 0.25s all ease;
          pointer-events: none;
        }
        /* Transition */
        .filterItemSelect:hover::after {
          color: #192d5a;
        }
      }
    }
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      button {
        outline: none;
        color: whitesmoke;
        background-color: #6f95bb;
        padding: 10px;
        margin-left: 20px;
        border-radius: 8px;
        border: none;
        transition: 0.125s ease-in;
      }
      button:hover {
        background-color: rgb(92, 131, 169);
      }
      button:active {
        background-color: #192d5a;
      }
    }
  }
  .textShow {
    height: calc(100vh - 173px);
    overflow-y: auto;
    margin-top: 10px;
    margin-right: 5px;
    border-radius: 8px;
    &::-webkit-scrollbar {
      width: 10px;
    }
    /* Track */
    &::-webkit-scrollbar-track {
      border-radius: 8px;
      box-shadow: inset 0 0 5px grey;
      background-color: white;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background-clip: content-box;
      border-radius: 9999px;
      background-color: #aaaaaa;
    }
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #767676;
    }
    .filterNoTarget {
      height: 100%;
      position: relative;
      span {
        position: absolute;
        top: 40%;
        left: calc(50% + 5px);
        transform: translate(-50%, -50%);
        width: fit-content;
        font-size: 30px;
        font-weight: 600;
        color: red;
      }
    }
    .openDataElement:first-child {
      margin-top: 0;
    }
  }
}
@media screen and (min-width: 503px) {
  .textShowPage {
    .textShowFilterBar {
      .button {
        margin-top: 0px;
      }
    }
    .textShow {
      height: calc(100vh - 148px);
    }
  }
}
@media screen and (min-width: 768px) {
  .textShowPage {
    padding: 5px 12.5px 5px 15px;
    .textShowFilterBar {
      .filter {
        .filterItem {
          font-size: 20px;
          .filterItemSelect {
            transition: 0.125s ease;
            width: 120px;
          }
          .filterItemSelect::after {
            width: 25px;
            min-width: 25px;
            max-width: 25px;
            padding: 5px 0 5px 5px;
          }
        }
      }
    }
    .textShow {
      height: calc(100vh - 156px);
    }
  }
}
</style>
