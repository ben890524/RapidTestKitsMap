import { router } from "../router/index";

export const redirectToHomePage = () => router.push("/");
export const redirectToShowInText = () => router.push("/index/textshow");
export const redirectToShowInMap = () => router.push("/index/mapshow");
