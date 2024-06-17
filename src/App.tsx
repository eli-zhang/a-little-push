import {
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";

import { GoalCreationForm } from "./pages/GoalCreationForm";
import { OverviewPage } from "./pages/OverviewPage";

const App = () => {
    return (
      <HashRouter>
        <Routes>
          <Route path="/start" element={<GoalCreationForm />} />
          <Route path="/home" element={<OverviewPage />} />
          <Route path="*" element={<OverviewPage />} />
        </Routes>
      </HashRouter>
    )
  }
  
  export default App;