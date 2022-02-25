import * as types from "./types";

const initialState = {
  hotels: [],
  count: 0,
  details: { count: 0, filter: "", limit: 0, page: 0, pages: 0 },
  sending: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DELETE_HOTEL:
      return {
        ...state,
      };
    case types.DELETE_HOTEL_FAIL:
      return {
        ...state,
        sending: false,
      };
    case types.DELETE_HOTEL_SUCCESS:
      const temp = [...state.hotels];
      action.payload.map((v) => {
        const i = temp.findIndex((t) => t.id === v);
        temp.splice(i, 1);
      });
      return {
        ...state,
        hotels: temp,
        sending: false,
      };
    case types.EDIT_HOTEL:
      return {
        ...state,
        sending: true,
      };
    case types.EDIT_HOTEL_FAIL:
      return {
        ...state,
        sending: false,
      };
    case types.EDIT_HOTEL_SUCCESS:
      const list = [...state.hotels];
      const index = list.findIndex((e) => e.id === action.payload.id);
      list[index] = action.payload;
      return {
        ...state,
        hotels: list,
        sending: false,
      };
    case types.ADD_HOTEL:
      return {
        ...state,
        sending: true,
      };
    case types.ADD_HOTEL_FAIL:
      return {
        ...state,
        sending: false,
      };
    case types.ADD_HOTEL_SUCCESS:
      return {
        ...state,
        hotels: [...state.hotels, action.payload],
        sending: false,
      };
    case types.FETCH_LIST_HOTELS:
      return {
        ...state,
        sending: true,
      };
    case types.FETCH_LIST_HOTELS_SUCCESS:
      if (!action.payload.loadmore)
        return {
          ...state,
          hotels: action.payload.hotels,
          sending: false,
        };
      let _temp = [...state.hotels];
      const _id_list = _temp.map((t) => t.id);
      if (_id_list.length === 0) {
        _temp = action.payload.hotels;
      } else {
        action.payload.hotels.forEach((el) => {
          if (!_id_list.includes(el.id)) {
            _temp = [..._temp, el];
          }
        });
      }
      return {
        ...state,
        hotels: _temp,
        count: action.payload.count,
        details: action.payload.details,
        sending: false,
      };
    case types.FETCH_LIST_HOTELS_FAIL:
      return {
        ...state,
        sending: false,
      };
    default:
      return state;
  }
};

export default reducer;
