import {
  HashRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { GoalCreationForm } from "./pages/GoalCreationForm";
import { OverviewPage } from "./pages/OverviewPage";

const App = () => {
    return (
      <Router basename="">
        <Routes>
          <Route path="/start" element={<GoalCreationForm />} />
          <Route path="/return" element={<OverviewPage />} />
          <Route path="/home" element={<OverviewPage />} />
          {/* <Route path="/" element={<GoalCreationForm />} /> */}
          <Route path="*" element={<OverviewPage />} />
        </Routes>
      </Router>
    )
  }
  
  export default App;