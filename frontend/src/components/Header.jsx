import { UserOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

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

function Header(params) {
  return (
    <HeaderStyled>
      <img src="/img/stock_logo.jpg" className="logo" />
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

      {/* {localStorage.getItem("user") ? (
        <UserOutlined />
      ) : ( */}
        <LoginBtn>
          <NavLink to="/login" activeClassName="active">
            로그인
          </NavLink>
        </LoginBtn>
      {/* )} */}
    </HeaderStyled>
  );
}

export default Header;
