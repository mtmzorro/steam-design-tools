import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import BackgroundList from '../BackgroundList';
import Header from '../../components/Header';
import About from '../About';
import Footer from '../../components/Footer';
import './index.scss';

const App = () => {
    return (
        <div className="App">
            <Header />
            <Switch>
                <Route path="/index.html" exact component={BackgroundList} />
                <Route path="/about" component={About} />
            </Switch>
            <Footer />
        </div>
    );
}

export default App;
