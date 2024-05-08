// import { createFlash } from './flash';

// // FIXME: костыль для сохранения значений, не связанных с пользователем, при выходе из приложения
// // мб стоит пересмотреть структуру localStorage и сохранять всё, что нужно сбросить при выходе, в одном storage ключе? Тогда этот костыль будет не нужен
// const PERSISTENT_KEYS = ['isCookiePolicyAccepted'];

// export const userLogout = () => (dispatch, getState) => {
//   const { currentUser } = getState();

//   const valuesToRecover = [];
//   for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i);

//     if (PERSISTENT_KEYS.includes(key)) {
//       valuesToRecover.push({ key, value: getItem(key) });
//     }
//   }
//   localStorage.clear();
//   valuesToRecover.forEach(({ key, value }) => setItem(key, value));

//   // @ts-ignore TODO: type
//   window.dataLayer?.splice(0, window.dataLayer.length);
//   clearUserCookies();
//   dispatch(removeCurrentUser());
//   chatSocket.disconnect();
//   // TODO: добавить очистку кеша новостей?
//   router.navigate('/');
//   closeConnection(currentUser);
// };
