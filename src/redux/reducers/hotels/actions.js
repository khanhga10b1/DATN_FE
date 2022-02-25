import * as types from './types';
import service from '../../../service/service';

const fetchListHotels = (params = {}, loadmore = true) => async dispatch => {
    dispatch({ type: types.FETCH_LIST_HOTELS });
    try {
        const hotels = await service.get('/hotels', { params });
        dispatch({ type: types.FETCH_LIST_HOTELS_SUCCESS, payload: hotels.data,loadmore });
    } catch (error) {
        dispatch({ type: types.FETCH_LIST_HOTELS_FAIL });
    }
};

const addHotel = (params = {}) => async dispatch => {
    dispatch({ type: types.ADD_HOTEL });
    try {
        const hotel = await service.post('/hotel', params);
        dispatch({ type: types.ADD_HOTEL_SUCCESS, payload: hotel.data });
    } catch (error) {
        dispatch({ type: types.ADD_HOTEL_FAIL });
    }
};

const editHotel = (id,params = {}) => async dispatch => {
    dispatch({ type: types.EDIT_HOTEL,payload : {id,params} });
    try {
        const hotel = await service.put(`/hotels/${id}`, params);
        dispatch({ type: types.EDIT_HOTEL_SUCCESS, payload: hotel.data });
    } catch (error) {
        dispatch({ type: types.EDIT_HOTEL_FAIL });
    }
};

const deleteHotels = id => dispatch => {
    dispatch({ type: types.DELETE_HOTEL, payload : id });
    const listDeletePromise = [];
    id.forEach(i => {
        listDeletePromise.push(service.delete(`/hotels/${i}`));
    });
    Promise.all(listDeletePromise)
        .then(res => {
            const deletedElement = res.map(r => r.data.id);
            dispatch({ type: types.DELETE_HOTEL_SUCCESS, payload: deletedElement });
        })
        .catch(err => {
            console.log(err);
            dispatch({ type: types.DELETE_HOTEL_FAIL });
        });
};
export { fetchListHotels, addHotel, editHotel, deleteHotels };
