// 천 단위로 콤마(,) 표시
export const addComma = (number) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
