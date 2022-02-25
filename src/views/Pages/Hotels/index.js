import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListHotels } from "../../../redux/reducers/hotels/actions";
import {
  Button,
  Dropdown,
  Feather,
  Spinner,
  TextField,
} from "../../../components";
import { cityList } from "../../../utils/cityUtil";
import { NavLink, useHistory } from "react-router-dom";
const Hotels = () => {
  const { hotels, sending, count } = useSelector((store) => store.hotels);
  const [limit, set_limit] = useState(6);
  const [city, set_city] = useState("");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(
      fetchListHotels({
          limit,
          offset: 0,
          name: search?.trim(),
          city: city?.trim(),
      })
    );
  }, []);

  const onSearch = () => {
    dispatch(
      fetchListHotels({
          limit,
          offset: 0,
          name: search?.trim(),
          city : city?.trim()
      }),
      false
    );
  };

  useEffect(() => {
    onSearch()
  },[city])

  return (
    <div className="main">
      <div className="section" style={{ padding: "20px" }}>
        <div className="welcome__block flex">
          <Dropdown
            placeholder="Thành phố"
            onChange={(e) => set_city(e.value)}
            defaultValue={{ value: city, label: city }}
            options={cityList.map((c) => {
              return {
                value: c,
                label: c,
              };
            })}
          />{" "}
          <div className="col-12 search-form">
            <TextField
              value={search}
              placeholder="Tìm kiếm"
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <div className="toggle-password" onClick={onSearch}>
                    <Feather name="Search" />
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </div>
      <div className="section">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="hotel__item col-md-3 cursor_pointer"
                  onClick={() => history.push(`/hotels/${hotel.id}`)}
                >
                  <img src={hotel.image[0]} />
                  <div className="hotel__info">
                    <h4 className="row md-3">{hotel.name}</h4>
                    <div className="flex justify-content-between">
                      <div className="flex justify-flex-start">
                        <Feather
                          name="MapPin"
                          className="mr-10"
                          width="18px"
                          color="#ffa37b"
                        />
                        <span className="hotel__city mx-auto">
                          {hotel.city}
                        </span>
                      </div>
                      <div className="visit_button">
                        <NavLink to={`/hotels/${hotel.id}`}>Visit</NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {count > hotels.length && (
              <div className="row">
                <Button
                  customClass="btn--primary"
                  style={{ width: "150px", margin: "auto" }}
                  type="primary"
                  onClick={() =>
                    dispatch(
                      fetchListHotels({
                          limit,
                          offset: hotels.length,
                      })
                    )
                  }
                >
                  <strong>Xem thêm</strong>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {sending && <Spinner />}
    </div>
  );
};

export default Hotels;
