const initialState = [];

export default function flashes(state = initialState, action) {
  switch (action.type) {
    case "CREATE_FLASH":
      return [...state, action.payload];
    case "REMOVE_FLASH":
      return state.filter((flash) => flash.id !== action.payload);
    default:
      return state;
  }
}
