import ReactDOM from "react-dom";
import { Suspense } from "react";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(<Suspense><App /></Suspense>, rootElement);
