import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/login.jsx";
import Home from "./pages/home/home.jsx";
import Activity from "./pages/activitys/activity.jsx";
import Test from "./pages/test.jsx";
import PeriodDetail from "./pages/periodDetails/Perioddetails.jsx";
import ActivityDetail from "./pages/activityDetails/ActivityDetail.jsx";
import Crud from "./pages/crud/crud.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
            <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
            <Route path="/cursos/:periodId" element={<ProtectedRoute><PeriodDetail /></ProtectedRoute>} />
            <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
            <Route path="/actividad/:activityId" element={<ProtectedRoute><ActivityDetail /></ProtectedRoute>} />
            <Route path="/crud" element={<ProtectedRoute><Crud /></ProtectedRoute>} />
        </Routes>
    )
}
export default AppRouter;
