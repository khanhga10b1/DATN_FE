import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/auth";
import {
  Avatar,
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import { getInitialsName } from "../utils/mathUtil";
import { Feather } from "../components";

const NAV_ITEMS = [
  {
    name: "Khách sạn",
    path: "/hotels",
  },
  {
    name: "Phòng",
    path: "/rooms",
  }
];

const TheHeader = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const { user } = useSelector((store) => store.auth);
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const { isAuthenticated } = useSelector((store) => store.auth);
  const handleLogout = () => {
    dispatch(logout());
    history.push("/");
  };
  return (
    <header className="header">
      <div className="header_content d-flex flex-row align-items-center justify-content-between">
        <div className="logo">
          <NavLink to="/">The K</NavLink>
        </div>
        <div className="ml-auto d-flex flex-row align-items-center justify-content-start">
          <nav className="main_nav">
            <ul className="d-flex flex-row align-items-start justify-content-start">
              {NAV_ITEMS.map((nav, i) => (
                <NavLink
                  key={i}
                  onClick={() => history.push(nav.path)}
                  to={`${nav.path}`}
                  style={{ padding: "20px" }}
                >
                  {nav.name}
                </NavLink>
              ))}
            </ul>
          </nav>
          {isAuthenticated ? (
            <div>
              <Button
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <Avatar
                  src={user?.avatar}
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                  }}
                >
                  {getInitialsName(user?.name)}
                </Avatar>
              </Button>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem onClick={() => {
                            setOpen(false)
                            history.push('/dashboard')
                          }}>
                            <Feather name="Grid" style={{marginRight: '20px',width :"20px"}}/>
                            <span>Trang quản lý</span>
                          </MenuItem>
                          <MenuItem onClick={handleLogout}>
                            <Feather name="LogOut" style={{marginRight: '20px',width :"20px"}}/>
                            <span>Đăng xuất</span>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          ) : (
            <>
              <div className="book_button">
                <NavLink to="/register">Đăng ký</NavLink>
              </div>
              <div className="book_button">
                <NavLink to="/login">Đăng nhập</NavLink>
              </div>
            </>
          )}

          <div className="hamburger">
            <i className="fa fa-bars" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TheHeader;
