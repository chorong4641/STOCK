import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import Stock from "./components/Stock";
import News from "./components/News";
import Word from "./components/Word";
import MyStock from "./components/MyStock";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import FindId from "./components/FindId";
import FindPwd from "./components/FindPwd";
import Mock from "./components/Mock";

import "./App.css";
import { store } from "./store";
import { useContext } from "react";

const BodyStyled = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 50px);
  padding: 20px 0;
  overflow-y: auto;

  .custom-tooltip {
    padding: 10px;
  }

  .bold {
    font-weight: bold;
  }

  // ant-design
  .ant-table {
    &.ant-table-small {
      line-height: 2;
    }

    .ant-table-thead {
      //
    }

    .ant-table-tbody {
      .ant-table-row-selected {
        > td {
          background-color: transparent;
        }
      }
    }
  }

  .ant-pagination-item {
    &.ant-pagination-item-active {
      border-color: #3f4753;

      a {
        color: #3f4753;
      }
    }

    &:hover {
      a {
        color: #3f4753;
      }
    }
  }

  // 체크박스
  .ant-checkbox {
    &:hover {
      .ant-checkbox-inner {
        border-color: #3f4753;
      }
    }

    &.ant-checkbox-checked {
      &::after {
        border-color: #3f4753;
      }

      .ant-checkbox-inner {
        background-color: #3f4753;
        border-color: #3f4753;
      }
    }

    .ant-checkbox-input:focus {
      + .ant-checkbox-inner {
        border-color: #3f4753;
      }
    }

    .ant-checkbox-inner {
      &::after {
        background-color: #3f4753;
      }
    }
  }
`;

function App() {
  const [state] = useContext(store);

  return (
    <div className="App">
      <Header />

      <BodyStyled>
        {/* router */}
        <Switch>
          {/* 기본 */}
          <Route exact path="/" render={() => <Redirect to="/stock" />} />
          {/* 홈 */}
          <Route path="/stock" component={Stock} />
          {/* 뉴스 */}
          <Route path="/news" component={News} />
          {/* 용어검색 */}
          <Route path="/word" component={Word} />
          {/* 관심종목 */}
          <Route path="/mystock" render={() => (state.user ? <MyStock /> : <Redirect to="/login" />)} />
          {/* 모의투자 */}
          <Route path="/mock" render={() => (state.user ? <Mock /> : <Redirect to="/login" />)} />
          {/* 회원가입 */}
          <Route path="/register" component={Register} />
          {/* 로그인 */}
          <Route path="/login" component={Login} />
          {/* 아이디찾기 */}
          <Route path="/findId" component={FindId} />
          {/* 비밀번호찾기 */}
          <Route path="/findPwd" component={FindPwd} />
          {/* 기타 URL (존재하지 않는 URL) */}
          <Route path="*" render={() => <Redirect to="/stock" />} />
        </Switch>
      </BodyStyled>
    </div>
  );
}

export default App;
