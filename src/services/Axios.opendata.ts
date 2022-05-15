import axios from "axios";

const OpenDataAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const getOpenData = () =>
  OpenDataAxios.get("https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv");
