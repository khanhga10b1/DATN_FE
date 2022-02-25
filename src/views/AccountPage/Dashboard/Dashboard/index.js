import React, { useEffect, useState } from "react";
import { Feather } from "../../../../components";
import Numeral, { options } from "numeral";
import service from "../../../../service/service";
import { useSelector } from "react-redux";
import { Avatar, CircularProgress } from "@material-ui/core";
import { getInitialsName } from "../../../../utils/mathUtil";
import StarRatings from "react-star-ratings";
import Chart from "react-apexcharts";

const chart_opt = {
  loading: true,
  options: {
    fill: {
      colors: ['#1A73E8', '#ccc',"#000","#fff"]
    },
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [],
    },
  },
  series: [
    {
      name: "series-1",
      data: [],
    },
  ],
};

const Dashboard = () => {
  const [stat, set_stat] = useState({ loading: true });
  const { user } = useSelector((store) => store.auth);
  const [bestSeller, setBestSeller] = useState(chart_opt);
  const [yearData, setYearData] = useState(chart_opt);
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    console.log(user);
    if (user) {
      service
        .get("/stat/overview", { params: { userId: user.id } })
        .then((res) => set_stat({ ...res.data, loading: false }))
        .catch((e) => set_stat({ loading: false }));
      service
        .get("/stat/bestSellerRoom", { params: { userId: user.id } })
        .then((res) => {
          setBestSeller({
            loading: false,
            options: {
              ...chart_opt.options,
              xaxis: {
                ...chart_opt.options.xaxis,
                categories: res.data.categories,
              },
            },
            series: [
              {
                name: "Số đơn",
                data: res.data.data,
              },
            ],
          });
        })
        .catch((e) => console.log(e));
      service
        .get("/stat/yearData", { params: { userId: user.id, year: "2020" } })
        .then((res) => {
          const year_data = res.data.find((r) => r.year === year);
          console.log(year_data);
          setYearData({
            loading: false,
            options: {
              ...chart_opt.options,
              xaxis: {
                ...chart_opt.options.xaxis,
                categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
              },
            },
            series: [
              {
                name: "Số đơn",
                data: year_data.data,
              },
            ],
          });
        })
        .catch((e) => console.log(e));
    }
  }, [user]);
  return (
    <div className="dashboard">
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card-el row" style={{ background: "#6407bba3" }}>
            <div className="col-3">
              <Feather name="Columns" />
            </div>
            <div className="col-9">
              <div className="row">Phòng</div>
              <div className="row" style={{ fontSize: "30px" }}>
                {stat.loading ? (
                  <span>Loading...</span>
                ) : (
                  Numeral(stat.rooms).format("0")
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card-el row" style={{ background: "#0ab309" }}>
            <div className="col-3">
              <Feather name="Clipboard" />
            </div>
            <div className="col-9">
              <div className="row">Đơn phòng</div>
              <div className="row" style={{ fontSize: "30px" }}>
                {stat.loading ? (
                  <span>Loading...</span>
                ) : (
                  Numeral(stat.reservations).format("0")
                )}{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card-el row" style={{ background: "#ea9104" }}>
            <div className="col-3">
              <Feather name="Star" />
            </div>
            <div className="col-9">
              <div className="row">Lượt đánh giá</div>
              <div className="row " style={{ fontSize: "30px" }}>
                {stat.loading ? (
                  <span>Loading...</span>
                ) : (
                  Numeral(stat.ratings?.length).format("0.0")
                )}{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card-el row" style={{ background: "#1da1f2" }}>
            <div className="col-3">
              <Feather name="DollarSign" />
            </div>
            <div className="col-9">
              <div className="row ">Thu nhập</div>
              <div className="row" style={{ fontSize: "30px" }}>
                {stat.loading ? (
                  <span>Loading...</span>
                ) : (
                  Numeral(stat.revenue).format("1,0.0 $")
                )}{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-5">
        <div
          className="col-md-5"
          style={{ padding: "20px", height: "100%", overflow: "auto", maxHeight: "500px" }}
        >
          <h3 className="mb-3">Đánh giá</h3>
          {stat.loading ? (
            <span>Loading...</span>
          ) : (
            stat.ratings?.map((review) => (
              <div key={review.id} className="mb-3">
                <div className="row">
                  <div>
                    <Avatar
                      src={review?.avatar}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "10px",
                      }}
                    >
                      {getInitialsName(review?.name)}
                    </Avatar>
                  </div>
                  <div>
                    <div className="row">{review.name}</div>
                    <div className="row">
                      <StarRatings
                        rating={review.rate || 0}
                        starRatedColor="#ff8939"
                        starDimension="22px"
                        starSpacing="3px"
                        numberOfStars={5}
                        name="rating"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <span>{review.text}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="col-md-7"  style={{ padding: "20px"}}>
        <h3 className="mb-3">Thống kê đơn theo phòng</h3>
          <div className="row" style={{ padding: "2rem" }}>
            {bestSeller.loading ? (
              <CircularProgress />
            ) : (
              <Chart
                options={bestSeller.options}
                series={bestSeller.series}
                type="bar"
                style={{ margin: "auto", width: "100%" }}
              />
            )}
          </div>
        </div>
      </div>      
      <h3 className="mb-3"  style={{ padding: "20px"}}>Thống kê theo năm</h3>
      <div className="row" style={{ padding: "2rem" }}>
        {yearData.loading ? (
          <CircularProgress />
        ) : (
          <Chart
            options={yearData.options}
            series={yearData.series}
            style={{ margin: "auto", width: "80%" }}
            type="area"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
