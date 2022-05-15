import { createRouter, createWebHashHistory } from "vue-router";
import TestKitPage from "@/views/TestKitPage.vue";
import TextShowPage from "@/views/TextShowPage.vue";
import MapShowPage from "@/views/MapShowPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "TestKitPage",
    component: TestKitPage,
    children: [
      {
        path: "textshow",
        component: TextShowPage,
      },
      {
        path: "mapshow",
        component: MapShowPage,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/index",
  },
];
export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});
