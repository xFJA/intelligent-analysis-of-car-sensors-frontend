import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Upload } from "./components/Upload";

export const App: React.FC = () => {
  return (
    <Router>
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
