import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import Stock from "./components/Stock";
import News from "./components/News";
import Word from "./components/Word";
import Recommend from "./components/Recommend";
import MyPage from "./components/MyPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import FindId from "./components/FindId";
import FindPwd from "./components/FindPwd";

import "./App.css";

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
      <Header />

      <BodyStyled>
        {/* router */}
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/stock" />} />
          <Route path="/stock" component={Stock} />
          <Route path="/recommend" component={Recommend} />
          <Route path="/news" component={News} />
          <Route path="/word" component={Word} />
          <Route path="/mypage" component={MyPage} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/findId" component={FindId} />
          <Route path="/findPwd" component={FindPwd} />
          <Route path="*" render={() => <Redirect to="/stock" />} />
        </Switch>
      </BodyStyled>
    </div>
  );
}

export default App;
