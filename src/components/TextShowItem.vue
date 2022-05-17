<template>
  <div class="openDataElement">
    <table class="openDataTable mobile">
      <tr>
        <th>醫事機構名稱</th>
        <td>{{ openDataElement.name }}</td>
      </tr>
      <tr>
        <th>醫事機構地址</th>
        <td>
          <div class="tdIcon">
            {{ openDataElement.address }}
            <a
              class="googleMapsIcon"
              target="_blank"
              :href="`https://www.google.com/maps?q=${openDataElement.name}+${openDataElement.address}`"
            >
              <img :src="googleMapsIcon" alt="" />
            </a>
          </div>
        </td>
      </tr>
      <tr>
        <th>醫事機構代碼</th>
        <td>{{ openDataElement.id }}</td>
      </tr>
      <tr>
        <th>醫事機構電話</th>
        <td>{{ openDataElement.phone }}</td>
      </tr>
      <tr>
        <th>更新時間</th>
        <td>{{ openDataRefreshTime }}</td>
      </tr>
      <tr>
        <th>廠牌</th>
        <td class="important">{{ openDataElement.manufacturer }}</td>
      </tr>
      <tr>
        <th>剩餘存貨數量</th>
        <td class="important">{{ openDataElement.stock }} 份</td>
      </tr>
      <tr>
        <th>備註</th>
        <td>{{ openDataElement.remark }}</td>
      </tr>
    </table>
    <table class="openDataTable browser">
      <tr>
        <th colspan="4" class="openDataLeft">醫事機構名稱</th>
        <th class="openDataRight">醫事機構代碼</th>
        <td>{{ openDataElement.id }}</td>
      </tr>
      <tr>
        <td colspan="4" class="openDataLeft">{{ openDataElement.name }}</td>
        <th class="openDataRight">醫事機構電話</th>
        <td>{{ openDataElement.phone }}</td>
      </tr>
      <tr>
        <th colspan="4" class="openDataLeft">醫事機構地址</th>
        <th class="openDataRight">醫事機構地圖</th>
        <td class="tdIcon">
          <a
            class="googleMapsIcon"
            target="_blank"
            :href="`https://www.google.com/maps?q=${openDataElement.name}+${openDataElement.address}`"
          >
            Link
            <img :src="googleMapsIcon" alt="" />
          </a>
        </td>
      </tr>
      <tr>
        <td colspan="4" class="openDataLeft">{{ openDataElement.address }}</td>
        <th class="openDataRight">來源資料時間</th>
        <td>{{ openDataRefreshTime }}</td>
      </tr>
      <tr>
        <th colspan="4" class="openDataLeft">廠牌</th>
        <td colspan="2" class="important">
          {{ openDataElement.manufacturer }}
        </td>
      </tr>
      <tr>
        <th colspan="4" class="openDataLeft">剩餘存貨數量</th>
        <td colspan="2" class="important">{{ openDataElement.stock }} 份</td>
      </tr>
      <tr>
        <th colspan="4" class="openDataLeft">備註</th>
        <td colspan="2">{{ openDataElement.remark }}</td>
      </tr>
    </table>
  </div>
</template>
<script setup lang="ts">
/* import img */
import googleMapsIcon from "@/assets/img/GoogleMapsIcon.svg";
/* vue module */
import { PropType, ref } from "vue";
/* interfaces */
import OpenData from "@/interfaces/OpenData";

const props = defineProps({
  openDataElement: {
    type: Object as PropType<OpenData>,
    required: true,
  },
  openDataRefreshTime: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.openDataElement {
  padding: 15px;
  margin-top: 10px;
  background-color: var(--table-background-color);
  border-radius: 8px;
  table.openDataTable {
    width: 100%;
    border-spacing: 0;
    border: 1px solid var(--table-table-border-color);
    tr {
      border: 0.5px solid var(--table-table-border-color);
      td,
      th {
        border: 0.5px solid var(--table-table-border-color);
      }
      > th {
        background-color: var(--table-th-color);
      }
      .important {
        color: red;
        font-weight: 600;
      }
      .tdIcon {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .googleMapsIcon {
          height: 25px;
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          img {
            padding: 5px 0 5px 5px;
            height: 100%;
          }
        }
      }
    }
  }
  table.openDataTable.browser {
    display: none;
    text-align: center;
    tr {
      td,
      th {
        padding: 0.5rem 1rem;
        border: 0.5px solid var(--table-table-border-color);
      }
      td.tdIcon {
        justify-content: center;
        .googleMapsIcon {
          padding: 0;
          transition: 0.25s ease;
          img {
            padding: 5px 0 5px 10px;
          }
        }
        .googleMapsIcon:hover {
          transform: translateX(5px);
        }
      }
      .openDataLeft {
        width: 50%;
        min-width: 50%;
        max-width: 50%;
      }
      .openDataRight {
        width: 25%;
        min-width: 25%;
        max-width: 25%;
      }
    }
  }
  table.openDataTable.mobile {
    display: table;
    font-size: 14px;
    tr {
      td,
      th {
        padding: 0.25rem 0.5rem;
        border: 0.5px solid var(--table-table-border-color);
      }
      th {
        width: 25%;
        min-width: 25%;
        max-width: 25%;
      }
    }
  }
}
@media only screen and (min-width: 768px) {
  .openDataElement {
    padding: 20px;
    margin-top: 35px;
    table.openDataTable.browser {
      display: table;
    }
    table.openDataTable.mobile {
      display: none;
    }
  }
}
</style>
