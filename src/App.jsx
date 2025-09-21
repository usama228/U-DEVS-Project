/* eslint-disable react/prop-types */
import { lazy, Suspense, useEffect, useState } from 'react';
/// Components
import Index from './jsx/index';
import { connect, useDispatch } from 'react-redux';
import { Route, Routes, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
// action
import {
    checkAutoLogin,
    // isLogin 
} from './services/AuthService';
import { isAuthenticated } from './store/selectors/AuthSelectors';
import { ToastContainer } from 'react-toastify';
/// Style
import './assets/vendor/swiper/css/swiper-bundle.min.css';
import "./assets/css/style.css";
import './jsx/pages/pages.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/modal.css';


const SignUp = lazy(() => import('./jsx/pages/Registration'));
const Login = lazy(() => import('./jsx/pages/Login'));

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();

        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }

    return ComponentWithRouterProp;
}

// Layout component with a single ToastContainer
const Layout = ({ children }) => (
    <>
        <Suspense fallback={
            <div id="preloader">
                <div className="sk-three-bounce">
                    <div className="sk-child sk-bounce1"></div>
                    <div className="sk-child sk-bounce2"></div>
                    <div className="sk-child sk-bounce3"></div>
                </div>
            </div>
        }>
            {children}
        </Suspense>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    </>
);

function App(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isInitialized, setIsInitialized] = useState(false);
    
    useEffect(() => {
        console.log('App mounted, checking auto login...');
        checkAutoLogin(dispatch, navigate);
        setIsInitialized(true);
    }, [dispatch, navigate]);

    useEffect(() => {
        console.log('Authentication state changed:', props.isAuthenticated);
    }, [props.isAuthenticated]);

    // Show loading while initializing
    if (!isInitialized) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Initializing...</p>
                </div>
            </div>
        );
    }

    const authRoutes = (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path='/login' element={<Login />} />
            <Route path='/page-register' element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );

    return (
        <Layout>
            {props.isAuthenticated ? <Index /> : authRoutes}
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
    };
};

export default withRouter(connect(mapStateToProps)(App));
