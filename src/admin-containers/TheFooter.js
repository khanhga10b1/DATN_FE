import React from "react";

const TheFooter = () => {
  return (
    <footer className="footer">
      <div className="footer_content">
        <div className="container">
          <div className="row footer_row">
            <div className="col-lg-6">
              <div className="footer_title">Our Address</div>
              <div className="footer_list">
                <ul>
                  <li>Beach Str. 345</li>
                  <li>67559 Miami</li>
                  <li>USA</li>
                </ul>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="footer_title">Contact</div>
              <div className="footer_list">
                <ul>
                  <li>Tel: 345 5667 889</li>
                  <li>Fax: 6783 4567 889</li>
                  <li>reservations@hotelriver.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        Copyright ©<script>document.write(new Date().getFullYear());</script>
        2020 All rights reserved 
      </div>
    </footer>
  );
};

export default TheFooter;
