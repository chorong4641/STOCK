import { UserOutlined } from "@ant-design/icons";
import { Divider, Popover } from "antd";
import { useContext, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components";
import { store } from "../store";
import { logout } from "../store/actions";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  // background-color: #3f4753;
  box-shadow: rgb(0 0 0 / 8%) 0px 0px 8px;

  .logo {
    position: absolute;
    left: 30px;
    width: 33px;
    height: 33px;
  }

  .user-icon {
    position: absolute;
    right: 30px;
    padding: 8px;
    background-color: #e9e9eb;
    border-radius: 100%;
    font-size: 16px;
  }
`;

const NavStyled = styled.div`
  width: 50%;
  height: 46px;
  min-width: 512px;
  display: flex;
  align-items: center;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #3f4753;
    font-weight: 700;
    text-decoration: none;

    &:hover,
    &.active {
      box-shadow: 0 3px 0 #9d141d;
    }
  }
`;

const LoginBtn = styled.button`
  position: absolute;
  right: 30px;
  padding: 3px 10px;
  background-color: #9d141d;

  a {
    color: #fff !important;
  }
`;

const UserPopoverStyled = styled.div`
  font-size: 13px;

  .info-title {
    padding-bottom: 10px;
    color: #3f4753;
    font-weight: normal;
    border-bottom: 1px solid #ddd;

    span {
      font-weight: bold;
    }
  }

  .edit-user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    font-size: 12px;
    cursor: pointer;
  }
`;

function Header(params) {
  const history = useHistory();
  const [state, dispatch] = useContext(store);
  const [openModal, setOpenModal] = useState(false);

  // 로그아웃
  const onLogout = async () => {
    await dispatch(logout());
    history.push("/stock");
  };

  return (
    <HeaderStyled>
      <img src="/img/stock_logo.jpg" className="logo" alt="logo" />
      <NavStyled>
        <NavLink to="/stock" activeClassName="active">
          홈
        </NavLink>
        {/* <NavLink to="/recommend" activeClassName="active">
          추천종목
        </NavLink> */}
        <NavLink to="/news" activeClassName="active">
          뉴스
        </NavLink>
        <NavLink to="/word" activeClassName="active">
          용어검색
        </NavLink>
        <NavLink to="/mypage" activeClassName="active">
          마이페이지
        </NavLink>
      </NavStyled>
      {state.user.data ? (
        <Popover
          placement="bottomRight"
          content={
            <UserPopoverStyled>
              <div className="info-title">
                <span>{state.user.data}</span>님 환영합니다!
              </div>
              <div className="edit-user-info">
                <div onClick={() => setOpenModal(true)}>내 정보 수정</div>
                <Divider type="vertical" style={{ borderColor: "#ddd" }} />
                <div onClick={onLogout}>로그아웃</div>
              </div>
            </UserPopoverStyled>
          }
          trigger="click"
          arrowPointAtCenter
        >
          <UserOutlined className="user-icon" />
        </Popover>
      ) : (
        <LoginBtn>
          <NavLink to="/login" activeClassName="active">
            로그인
          </NavLink>
        </LoginBtn>
      )}
    </HeaderStyled>
  );
}

export default Header;
