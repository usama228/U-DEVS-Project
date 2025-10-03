
import React, { useContext } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";
import "./pages/layout-override.css";
import "../assets/scss/layout.css";

/// Layout
import Nav from "./layouts/nav";
import Nav2 from "./layouts/nav/index2";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";
import WalletBar from './layouts/WalletBar';

/// Dashboard
import Analysis from "./pages/Analysis";
import DashboardDark from "./components/Dashboard/DashboardDark";
import Dashboard from "./pages/Dashboard";

/// User Management
import Users from "./pages/Users";
import TeamLeads from "./pages/TeamLeads";
import Employees from "./pages/Employees";
import Interns from "./pages/Interns";
import ProtectedRoute from "../components/ProtectedRoute";
import Profile from "./pages/Profile";
import CreateUser from "./pages/CreateUser";
import UserProfile from "./pages/UserProfile";

// Task Management
import AllTasks from "./pages/AllTasks";
import CreateTask from "./pages/CreateTask";
import ViewTask from "./pages/ViewTask";
import MyTasks from "./pages/MyTasks";

// Notifications
import NotificationsPage from "./pages/Notifications";

/// File Manager
import User from './components/FileManager/User';
import HomeCalendar from './components/FileManager/HomeCalendar';
import Activity from './components/FileManager/Activity';
import FileChat from './components/FileManager/FileChat';


/// App
import AppProfile from "./components/AppsMenu/AppProfile/AppProfile";
import PostDetails from "./components/AppsMenu/AppProfile/PostDetails";
import EditProfile from "./components/AppsMenu/AppProfile/EditProfile";
import Compose from "./components/AppsMenu/Email/Compose/Compose";
import Inbox from "./components/AppsMenu/Email/Inbox/Inbox";
import Read from "./components/AppsMenu/Email/Read/Read";
import Calendar from "./components/AppsMenu/Calendar/Calendar";

/// Charts
import SparklineChart from "./components/charts/Sparkline";
import ChartJs from "./components/charts/Chartjs";
import RechartJs from "./components/charts/rechart";
import ApexChart from "./components/charts/apexcharts";

/// Bootstrap
import UiAlert from "./components/bootstrap/Alert";
import UiAccordion from "./components/bootstrap/Accordion";
import UiBadge from "./components/bootstrap/Badge";
import UiButton from "./components/bootstrap/Button";
import UiModal from "./components/bootstrap/Modal";
import UiButtonGroup from "./components/bootstrap/ButtonGroup";
import UiListGroup from "./components/bootstrap/ListGroup";
import UiCards from "./components/bootstrap/Cards";
import UiCarousel from "./components/bootstrap/Carousel";
import UiDropDown from "./components/bootstrap/DropDown";
import UiPopOver from "./components/bootstrap/PopOver";
import UiProgressBar from "./components/bootstrap/ProgressBar";
import UiTab from "./components/bootstrap/Tab";
import UiPagination from "./components/bootstrap/Pagination";
import UiGrid from "./components/bootstrap/Grid";
import UiTypography from "./components/bootstrap/Typography";

/// Plugins
import Select2 from "./components/PluginsMenu/Select2/Select2";
import MainNouiSlider from "./components/PluginsMenu/NouiSlider/MainNouiSlider";
import MainSweetAlert from "./components/PluginsMenu/SweetAlert/SweetAlert";
import Toastr from "./components/PluginsMenu/Toastr/Toastr";
import Lightgallery from "./components/PluginsMenu/Lightgallery/Lightgallery";

/// Widget
import Widget from "./pages/Widget";

/// Table
import SortingTable from "./components/table/SortingTable/SortingTable";
import FilteringTable from "./components/table/FilteringTable/FilteringTable";
import BootstrapTable from "./components/table/BootstrapTable";

/// Form
import Element from "./components/Forms/Element/Element";
import Wizard from "./components/Forms/Wizard/Wizard";
import CkEditor from "./components/Forms/CkEditor/CkEditor";
import Pickers from "./components/Forms/Pickers/Pickers";
import FormValidation from "./components/Forms/FormValidation/FormValidation";

/// Pages
import LockScreen from "./pages/LockScreen";
import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";
import { ThemeContext } from "../context/ThemeContext";
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';

const Markup = () => {
  const routhPath = [
    { url: "analysis", component: <Analysis />, protected: true },
    { url: "user", component: <User />, protected: true },
    { url: "activity", component: <Activity />, protected: true },
    { url: "calendar", component: <HomeCalendar />, protected: true },
    // User Management
    { url: "users", component: <Users />, protected: true },
    { url: "team-leads", component: <TeamLeads />, protected: true },
    { url: "employees", component: <Employees />, protected: true },
    { url: "interns", component: <Interns />, protected: true },
    { url: "profile", component: <Profile />, protected: true },
    { url: "create-user", component: <CreateUser />, protected: true },
    { url: "user-profile/:id", component: <UserProfile />, protected: true },
    // Task Management
    { url: "all-tasks", component: <AllTasks />, protected: true },
    { url: "create-task", component: <CreateTask />, protected: true },
    { url: "task/:id", component: <ViewTask />, protected: true },
    { url: "my-tasks", component: <MyTasks />, protected: true },
    // Notifications
    { url: "notifications", component: <NotificationsPage />, protected: true },
    { url: "attendance", component: <Attendance />, protected: true },
    { url: "leaves", component: <Leaves />, protected: true },
    //App Profile
    { url: "app-profile", component: <AppProfile />, protected: true },
    { url: "post-details", component: <PostDetails />, protected: true },
    { url: "edit-profile", component: <EditProfile />, protected: true },
    { url: "app-calender", component: <Calendar />, protected: true },
    //Charts
    { url: "chart-apexchart", component: <ApexChart />, protected: true },
    { url: "chart-rechart", component: <RechartJs />, protected: true },
    { url: "chart-chartjs", component: <ChartJs />, protected: true },
    { url: "chart-sparkline", component: <SparklineChart />, protected: true },

    //bootstrap
    { url: "ui-modal", component: <UiModal />, protected: true },
    { url: 'ui-popover', component: <UiPopOver />, protected: true },
    { url: "ui-typography", component: <UiTypography />, protected: true },
    { url: "ui-grid", component: <UiGrid />, protected: true },

    //Plugins
    { url: "uc-select2", component: <Select2 />, protected: true },
    { url: "uc-noui-slider", component: <MainNouiSlider />, protected: true },
    { url: "uc-toastr", component: <Toastr />, protected: true },
    { url: "uc-lightgallery", component: <Lightgallery />, protected: true },
    { url: "uc-sweetalert", component: <MainSweetAlert />, protected: true },
    { url: "form-element", component: <Element />, protected: true },
    { url: "form-wizard", component: <Wizard />, protected: true },
    { url: "form-ckeditor", component: <CkEditor />, protected: true },
    { url: "form-validation", component: <FormValidation />, protected: true },
    //widget
    { url: "widget", component: <Widget />, protected: true },
    /// table
    { url: 'table-filtering', component: <FilteringTable />, protected: true },
    { url: 'table-sorting', component: <SortingTable />, protected: true },
    { url: "table-bootstrap-basic", component: <BootstrapTable />, protected: true },
    { url: "form-pickers", component: <Pickers />, protected: true },
  ]
  const routhPath2 = [
    //Bootstrap
    { url: "ui-accordion", component: <UiAccordion />, protected: true },
    { url: "ui-alert", component: <UiAlert />, protected: true },
    { url: "ui-badge", component: <UiBadge />, protected: true },
    { url: "ui-button", component: <UiButton />, protected: true },
    { url: "ui-button-group", component: <UiButtonGroup />, protected: true },
    { url: "ui-list-group", component: <UiListGroup />, protected: true },
    { url: "ui-card", component: <UiCards />, protected: true },
    { url: '/ui-carousel', component: <UiCarousel />, protected: true },
    { url: '/ui-dropdown', component: <UiDropDown />, protected: true },
    { url: '/ui-progressbar', component: <UiProgressBar />, protected: true },
    { url: '/ui-tab', component: <UiTab />, protected: true },
    { url: '/ui-pagination', component: <UiPagination />, protected: true },
  ];

  return (
    <>
      <Routes>
        <Route path='/page-error-400' element={<Error400 />} />
        <Route path='/page-error-403' element={<Error403 />} />
        <Route path='/page-error-404' element={<Error404 />} />
        <Route path='/page-error-500' element={<Error500 />} />
        <Route path='/page-error-503' element={<Error503 />} />
        <Route path='/page-lock-screen' element={<LockScreen />} />
        <Route element={<Layout1 />}>
          <Route path='/' exact element={<Dashboard />} />
          <Route path='/dashboard' exact element={<Dashboard />} />
          <Route path='/dashboard-dark' exact element={<DashboardDark />} />         
        </Route>
        <Route element={<Layout2 />}>
          {routhPath.map((data, i) => {
            // Apply ProtectedRoute to all routes if they have the protected flag
            if (data.protected) {
              return (
                <Route 
                  key={i} 
                  exact 
                  path={`/${data.url}`} 
                  element={
                    <ProtectedRoute requiredRoute={`/${data.url}`}>
                      {data.component}
                    </ProtectedRoute>
                  } 
                />
              );
            }
            
            return (
              <Route key={i} exact path={`/${data.url}`} element={data.component} />
            );
          })}
        </Route>

        <Route element={<Layout5 />}>
          <Route path='/chat' exact element={
            <ProtectedRoute requiredRoute="/chat">
              <FileChat />
            </ProtectedRoute>
          } />
          <Route path='/email-compose' exact element={
            <ProtectedRoute requiredRoute="/email-compose">
              <Compose />
            </ProtectedRoute>
          } />
          <Route path='/email-inbox' exact element={
            <ProtectedRoute requiredRoute="/email-inbox">
              <Inbox />
            </ProtectedRoute>
          } />
          <Route path='/email-read' exact element={
            <ProtectedRoute required_route="/email-read">
              <Read />
            </ProtectedRoute>
          } />
        </Route>
        <Route element={<Layout6 />}>
          {routhPath2.map((data, i) => {
            if (data.protected) {
              return (
                <Route 
                  key={i} 
                  exact 
                  path={`/${data.url}`} 
                  element={
                    <ProtectedRoute requiredRoute={`/${data.url}`}>
                      {data.component}
                    </ProtectedRoute>
                  } 
                />
              );
            }
            return (
              <Route key={i} exact path={`/${data.url}`} element={data.component} />
            );
          })}
        </Route>
      </Routes>      
      <ScrollToTop />
    </>
  );
};

function Layout1() {
  const { sidebariconHover } = useContext(ThemeContext);
  const sideMenu = useSelector(state => state.sideMenu);
  return (
    <div id="main-wrapper" className={` show  ${sidebariconHover ? "iconhover-toggle" : ""} ${sideMenu ? "menu-toggle" : ""}`}>
      <div className={`wallet-open`}>
        <Nav2 />
        <div className="content-body">
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
        <Footer changeFooter="footer-outer" />
        <WalletBar />
      </div>
    </div>

  )
}

function Layout2() {
  const sideMenu = useSelector(state => state.sideMenu);
  const { sidebariconHover } = useContext(ThemeContext);
  return (
    <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${sideMenu ? "menu-toggle" : ""}`}>
      <Nav />
      <div className="content-body">
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
      <Footer changeFooter="out-footer style-2" />
    </div>

  )
}



function Layout5() {
  const sideMenu = useSelector(state => state.sideMenu);
  const { sidebariconHover } = useContext(ThemeContext);
  return (
    <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${sideMenu ? "menu-toggle" : ""}`}>
      <Nav />
      <div className="content-body message-body mh-auto">
        <div className="container-fluid mh-auto p-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
function Layout6() {
  const sideMenu = useSelector(state => state.sideMenu);
  const { sidebariconHover } = useContext(ThemeContext);
  return (
    <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${sideMenu ? "menu-toggle" : ""}`}>
      <Nav />
      <div className="content-body">
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
      <Footer changeFooter="out-footer style-1" />
    </div>
  )
}

export default Markup;
