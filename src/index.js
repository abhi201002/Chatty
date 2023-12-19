import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { Layer } from "./datalayer.js";
import { initialState, reducer } from "./reducer.js";
import {disableReactDevTools} from '@fvilers/disable-react-devtools'

if(process.env.NODE_ENV == 'production') disableReactDevTools();

ReactDOM.render(
  <React.StrictMode>
    <Layer reducer={reducer} initialState={initialState}>
      <App />
    </Layer>
  </React.StrictMode>,
  document.getElementById("root")
);
