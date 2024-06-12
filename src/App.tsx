import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { GoalCreationForm } from "./pages/GoalCreationForm";
import { OverviewPage } from "./pages/OverviewPage";
import { ReturnPage } from "./pages/ReturnPage";

const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="" element={<GoalCreationForm />} />
          <Route path="/start" element={<GoalCreationForm />} />
          <Route path="/return" element={<ReturnPage />} />
          <Route path="/home" element={<OverviewPage />} />
        </Routes>
      </Router>
    )
  }
  
  export default App;