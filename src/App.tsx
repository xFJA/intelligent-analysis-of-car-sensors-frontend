import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Upload } from "./components/Upload";
import { Header } from "./components/Header";

export const App: React.FC = () => {


  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/upload">
          <Upload />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
