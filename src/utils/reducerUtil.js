/**
 * @param {*} initialState
 * @param {*} fnMap
 */
export const createReducer = (initialState, fnMap) => {
  return (state = initialState, { type, payload }) => {
    const handler = fnMap[type];
    return handler && handler !== undefined ? handler(state, payload) : state;
  };
};
