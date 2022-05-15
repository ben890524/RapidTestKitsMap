/* services */
import { getOpenData } from "@/services/Axios.opendata";
/* interfaces */
import OpenData from "@/interfaces/OpenData";
const sortOpenDataByAddress = (next: OpenData, current: OpenData) => {
  if (next.address < current.address) {
    return -1;
  }
  if (next.address > current.address) {
    return 1;
  }
  return 0;
};
export const getOpenDataJson = async () => {
  const rawOpenData = (await getOpenData()).data.split("\r\n");
  const openData = rawOpenData.slice(1);
  let openDataJson: Array<OpenData> = [];
  openData.forEach((element: string) => {
    const splitOpenData: Array<string> = element.split(",");
    if (splitOpenData[0]) {
      const newOpenData: OpenData = {
        id: splitOpenData[0],
        name: splitOpenData[1],
        address: splitOpenData[2],
        longitude: splitOpenData[3],
        latitude: splitOpenData[4],
        phone: splitOpenData[5],
        manufacturer: splitOpenData[6],
        stock: splitOpenData[7],
        datatime: splitOpenData[8],
        remark: splitOpenData[9],
      };
      openDataJson.push(newOpenData);
    }
  });
  openDataJson.sort(sortOpenDataByAddress);
  return openDataJson;
};
