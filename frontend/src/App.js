import { Redirect, Route, NavLink } from "react-router-dom";
import styled from "styled-components";
import Stock from "./components/Stock";
import News from "./components/News";
import Word from "./components/Word";
import Recommend from "./components/Recommend";
import MyPage from "./components/MyPage";
import "./App.css";

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

const BodyStyled = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 50px);
  padding: 20px 0;
  overflow-y: auto;
`;

function App() {
  return (
    <div className="App">
      {/* header */}
      <HeaderStyled>
        <img src="/img/stock_logo.jpg" className="logo" />
        <NavStyled>
          {/* <NavLink to="/home" activeClassName="active">
            홈
          </NavLink> */}
          <NavLink to="/stock" activeClassName="active">
            홈
          </NavLink>
          <NavLink to="/recommend" activeClassName="active">
            추천종목
          </NavLink>
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
      </HeaderStyled>

      <BodyStyled>
        {/* router */}
        <Route exact path="/" render={() => <Redirect to="/stock" />} />
        {/* <Route path="/home" component={Home} /> */}
        <Route path="/stock" component={Stock} />
        <Route path="/recommend" component={Recommend} />
        <Route path="/news" component={News} />
        <Route path="/word" component={Word} />
        <Route path="/mypage" component={MyPage} />
      </BodyStyled>
    </div>
  );
}

export default App;
