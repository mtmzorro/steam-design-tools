import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import BackgroundList from '../BackgroundList';
import Header from '../../components/Header';
import About from '../About';
import './index.css';

const App = () => {
    return (
        <div className="App">
            <Header />
            <Switch>
                <Route path="/" exact component={BackgroundList} />
                <Route path="/about" component={About} />
            </Switch>
            <div className="footer">
                <Link to="/about/">About</Link>
            </div>
        </div>
    );
}

export default App;
