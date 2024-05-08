// сервис для работы с localstorage(изменение, получение, удаление)

type LocalStorage = Partial<{
  token: string;
  [key: string | number]: unknown;
}>;

type IdsType = string | number | (string | number)[];

type ValueType<T extends keyof LocalStorage> = LocalStorage[T];

type GetItemType = <T extends keyof LocalStorage & string>(
  key: T,
  ids?: IdsType
) => ValueType<T>;

type SetItemType = <T extends keyof LocalStorage & string>(
  key: T,
  value: ValueType<T>,
  ids?: IdsType
) => void;

type RemoveItemType = GetItemType;

const joinIds = (ids?: IdsType) => {
  if (Array.isArray(ids)) {
    if (ids.length > 0) {
      return `_${ids.join("_")}`;
    }
    return "";
  }
  return ids ?? "";
};

/** *
 *
 * @param key ключ
 * @param value значение
 * @param ids нужен, чтобы например, создать уникальную запись для определенного пользователя указав ids=[currentUser.id]
 */
export const setItem: SetItemType = (key, value, ids) =>
  localStorage.setItem(`${key}${joinIds(ids)}`, JSON.stringify(value));

/** *
 *
 * @param key ключ
 * @param ids нужен, чтобы например, создать уникальную запись для определенного пользователя указав ids=[currentUser.id]
 */
export const getItem: GetItemType = (key, ids) => {
  const itemKey = `${key}${joinIds(ids)}`;

  try {
    return JSON.parse(localStorage.getItem(itemKey) || "");
  } catch {
    // случай для старых записей, которые были записаны без JSON.stringify
    setItem(itemKey, localStorage.getItem(itemKey));
    return getItem(itemKey);
  }
};

/** *
 *
 * @param key ключ
 * @param ids нужен, чтобы например, создать уникальную запись для определенного пользователя указав ids=[currentUser.id]
 */
export const removeItem: RemoveItemType = (key, ids) =>
  localStorage.removeItem(`${key}${joinIds(ids)}`);
