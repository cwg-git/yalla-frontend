import Routes from './Routes';
import 'font-awesome/css/font-awesome.min.css';
import "leaflet/dist/leaflet.css";
import "./leaflet-config";  // 🔥 FIXES ICON ISSUE

const App = () => {
    return (
        <div>
            <Routes />
        </div>
    );
};

export default App;
