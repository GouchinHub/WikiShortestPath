import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Main from "./pages/Main";
import { Box } from "@mui/material";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Box display={"flex"} height={"100vh"} sx={{ flexFlow: "column" }}>
        <Router>
          <div className="App">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Main />
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </Box>
    </QueryClientProvider>
  );
};

export default App;
