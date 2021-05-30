import { Redirect, Route, NavLink } from "react-router-dom";
import styled from "styled-components";
import Home from "./components/Home";
import Stock from "./components/Stock";
import News from "./components/News";
import Word from "./components/Word";
import Recommend from "./components/Recommend";
import MyPage from "./components/MyPage";
import "./App.css";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60px;
  font-size: 15px;
  background-color: #3f4753;
  box-shadow: rgb(0 0 0 / 8%) 0px 0px 8px;
`;

const NavStyled = styled.div`
  width: 50%;
  min-width: 512px;
  display: flex;
  align-items: center;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #fff;
    font-weight: 700;
    text-decoration: none;

    &:hover,
    &.active {
      color: #3f4753;
      background-color: #fff;
    }
  }
`;

const BodyStyled = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  padding: 20px;
`;

function App() {
  return (
    <div className="App">
      {/* header */}
      <HeaderStyled>
        <NavStyled>
          <NavLink to="/home" activeClassName="active">
            홈
          </NavLink>
          <NavLink to="/stock" activeClassName="active">
            종목정보
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
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
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
