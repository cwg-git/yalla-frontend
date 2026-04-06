import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import RedirectComponent from './controller/RouteRedirect';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:object" element={<RedirectComponent />} />
                    <Route path="/:object/:key" element={<RedirectComponent />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
