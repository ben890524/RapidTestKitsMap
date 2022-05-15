<template>
  <div class="openDataElement">
    <table class="openDataTable mobile">
      <tr>
        <th>醫事機構名稱</th>
        <td>{{ openDataElement.name }}</td>
      </tr>
      <tr>
        <th>醫事機構地址</th>
        <td>{{ openDataElement.address }}</td>
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
        <td>Link</td>
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
/* vue module */
import { PropType, ref, onMounted } from "vue";
/* interfaces */
import OpenData from "@/interfaces/OpenData";

const props = defineProps({
  openDataElement: {
    type: Object as PropType<OpenData>,
    required: true,
  },
});
let openDataRefreshTime = ref<string>("");
onMounted(() => {
  const currentDate = new Date();
  openDataRefreshTime.value = `${currentDate.toDateString()} ${currentDate
    .toTimeString()
    .substring(0, 8)}`;
});
</script>

<style lang="scss" scoped>
.openDataElement {
  padding: 15px;
  margin-top: 10px;
  background-color: white;
  border-radius: 8px;
  table.openDataTable {
    width: 100%;
    border-spacing: 0;
    border-color: black;
    tr {
      border: 0.5px solid #c8c8c8;
      td,
      th {
        border: 0.5px solid #c8c8c8;
      }
      > th {
        background-color: #9ce0c0;
      }
      .important {
        color: red;
        font-weight: 600;
      }
    }
  }
  table.openDataTable.browser {
    display: none;
    tr {
      td,
      th {
        padding: 0.5rem 1rem;
        border: 0.5px solid #c8c8c8;
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
    tr {
      td,
      th {
        padding: 0.5rem;
        border: 0.5px solid #c8c8c8;
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
    table.openDataTable.browser {
      display: table;
    }
    table.openDataTable.mobile {
      display: none;
    }
  }
}
</style>
