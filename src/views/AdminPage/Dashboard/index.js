import React, { useEffect, useState } from "react";
import { Feather } from "../../../components";
import Numeral from "numeral";
import service from "../../../service/service";
import { useSelector } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import Chart from "react-apexcharts";
import StarRating from "react-star-ratings";
import GoldMedal from "../../../assets/icons/gold-medal.svg";
const chart_opt = {
  loading: true,
  options: {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [],
    },
  },
  series: [
    {
      data: [],
    },
  ],
};

const Dashboard = () => {
  const [stat, set_stat] = useState({ loading: true });
  const { admin } = useSelector((store) => store.auth);
  const [area, setArea] = useState({loading : true});
  const [topHotels, setTopHotels] = useState({ loading: true });
  useEffect(() => {
    if (admin) {
      service
        .get("/stat/admin-overview")
        .then((res) => set_stat({ ...res.data, loading: false }))
        .catch((e) => set_stat({ loading: false }));
      service
        .get("/stat/location")
        .then((res) => {
          setArea({
            loading: false,
            options: {
              ...chart_opt.options,
              labels : res.data.map(d => d.name),
            },
            series: res.data.map(d=>parseFloat(d.percent)),
          });
        })
        .catch((e) => console.log(e));
      service
        .get("/stat/top-hotels")
        .then((res) => {
          setTopHotels({ loading: false, hotels: res.data });
        })
        .catch((e) => setTopHotels({ loading: false }));
    }
  }, [admin]);
  return (
    <div className="dashboard">
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card-el row" style={{ background: "#6407bba3" }}>
            <div className="col-3">
              <Feather name="User" />
            </div>
            <div className="col-9">
              <div className="row">Tài khoản</div>
              <div className="row" style={{ fontSize: "30px" }}>
                {stat.loading ? (
                  <span>Loading...</span>
                ) : (
                  Numeral(stat.accounts).format("0")
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-el row" style={{ background: "#0ab309" }}>
            <div className="col-3">
              <Feather name="Clipboard" />
            </div>
            <div className="col-9">
              <div className="row">Khách sạn</div>
              <div className="row" style={{ fontSize: "30px" }}>
                {stat.loading ? (
                  <span>Loading...</span>
                ) : (
                  Numeral(stat.hotels).format("0")
                )}{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-el row" style={{ background: "#ea9104" }}>
            <div className="col-3">
              <Feather name="Star" />
            </div>
            <div className="col-9">
              <div className="row">Quản trị viên</div>
              <div className="row " style={{ fontSize: "30px" }}>
                {stat.loading ? (
                  <span>Loading...</span>
                ) : (
                  Numeral(stat.admins).format("0")
                )}{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="row">
          <span style = {{fontWeight : "bold", color: "#032a40", fontSize : "23px"}}>Top 10 khách sạn được đánh giá cao</span>
          </div>
          <div className="row" style={{ padding: "2rem" }}>
            {topHotels.loading ? (
              <CircularProgress />
            ) : (
              topHotels.hotels.map((top, index) => (
                <div className="row">
                  <span className="col-8">
                      {index === 0 && <img src={GoldMedal} width="25px" height="25px" />}
                    {top.name}
                  </span>
                  <div className="col-4">
                  <span style={{marginRight:"10px"}}>{top.rate || 0}</span>
                    <StarRating
                      rating={top.rate || 0}
                      starRatedColor="#ff8939"
                      starDimension="22px"
                      starSpacing="3px"
                      numberOfStars={5}
                      name="rating"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <span style = {{fontWeight : "bold", color: "#032a40", fontSize : "23px"}}>Khu vực</span>
          </div>
          <div className="row" style={{ padding: "2rem" }}>
            {area.loading ? (
              <CircularProgress />
            ) : (
              <Chart
                options={area.options}
                series={area.series}
                type="donut"
                style={{ margin: "auto", width: "70%" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
