import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Places from "./pages/Places";
import Store from "./store";
import TransactionForm from "./pages/TransactionForm";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <Store>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/transactions" />
          </Route>

          <Route path="/transactions" exact>
            <Transactions />
          </Route>

          <Route path="/transactions/add" exact>
            <TransactionForm />
          </Route>

          <Route path="/transactions/edit/:id" exact>
            <TransactionForm />
          </Route>

          <Route path="/places">
            <Places />
          </Route>
        </Switch>
      </Router>
    </Store>
  );
}

export default App;
