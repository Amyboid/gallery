import Home from "./routes/Home"; 
import { Route } from "wouter";
import Gallery from "../components/Gallery";
function App() {
    return (
    <>
      <Route path="/" component={Home} />

      <Route path="/upload/:collId" component={Gallery} />
    </>
  );
}

export default App;
