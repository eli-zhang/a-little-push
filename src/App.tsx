import {
  HashRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { GoalCreationForm } from "./pages/GoalCreationForm";
import { OverviewPage } from "./pages/OverviewPage";

const App = () => {
    return (
      <Router basename="/a-little-push">
        <Routes>
          <Route path="/start" element={<GoalCreationForm />} />
          <Route path="/home" element={<OverviewPage />} />
          <Route path="*" element={<OverviewPage />} />
        </Routes>
      </Router>
    )
  }
  
  export default App;