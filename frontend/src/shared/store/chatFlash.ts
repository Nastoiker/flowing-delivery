import { uniqueId as getUniqueId } from "lodash";

export const createChatFlash = (dialog) => (dispatch) => {
  const uniqueId = getUniqueId("chat_flash_");
  dispatch({
    type: "CREATE_CHAT_FLASH",
    payload: { uniqueId, ...dialog },
  });
};

export const removeChatFlash = (uniqueId) => (dispatch) => {
  dispatch({
    type: "REMOVE_CHAT_FLASH",
    payload: uniqueId,
  });
};
