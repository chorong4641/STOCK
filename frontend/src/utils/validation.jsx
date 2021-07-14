export const validRequired = (value) => {
  return !value ? "값이 없습니다." : undefined;
};

export const validEmail = (value, message) => {
  const regExp = new RegExp(/^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+/);
  const hint = message || "올바르지 않은 이메일 양식입니다.";
  console.log("validemail1", value && !regExp.test(value));
  return value && !regExp.test(value) ? hint : undefined;
};
