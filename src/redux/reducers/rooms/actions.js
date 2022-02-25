import * as types from "./types";
import service from "../../../service/service";

const fetchListRooms = (params = {},oldRoom=[]) => async (dispatch) => {
  console.log({params});
  dispatch({ type: types.FETCH_LIST_ROOMS });
  try {
    const rooms = await service.get("/rooms",{params});
    dispatch({ type: types.FETCH_LIST_ROOMS_SUCCESS, payload: {
        oldRoom : oldRoom,
        newRoom :rooms.data.rooms
    } });
  } catch (error) {
      console.log(error);
    dispatch({ type: types.FETCH_LIST_ROOMS_FAIL });
  }
};

const addRoom = (params = {}) => async (dispatch) => {
  dispatch({ type: types.ADD_ROOM });
  try {
    const room = await service.post("/room", params);
    dispatch({ type: types.ADD_ROOM_SUCCESS, payload: room.data });
  } catch (error) {
    dispatch({ type: types.ADD_ROOM_FAIL });
  }
};

const editRoom = (id, params = {}) => async (dispatch) => {
  dispatch({ type: types.EDIT_ROOM, payload: { id, params } });
  try {
    const room = await service.put(`/rooms/${id}`, params);
    dispatch({ type: types.EDIT_ROOM_SUCCESS, payload: room.data });
  } catch (error) {
    dispatch({ type: types.EDIT_ROOM_FAIL });
  }
};

const deleteRooms = (id) => (dispatch) => {
  dispatch({ type: types.DELETE_ROOM, payload: id });
  const listDeletePromise = [];
  id.forEach((i) => {
    listDeletePromise.push(service.delete(`/rooms/${i}`));
  });
  Promise.all(listDeletePromise)
    .then((res) => {
      const deletedElement = res.map((r) => r.data.id);
      dispatch({ type: types.DELETE_ROOM_SUCCESS, payload: deletedElement });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: types.DELETE_ROOM_FAIL });
    });
};
export { fetchListRooms, addRoom, editRoom, deleteRooms };
