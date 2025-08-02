import { lazy, Suspense, useEffect } from 'react';
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
/// Style
import './assets/vendor/swiper/css/swiper-bundle.min.css';
import "./assets/vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./assets/css/style.css";


const SignUp = lazy(() => import('./jsx/pages/Registration'));
const Login = lazy(() => {
    return new Promise(resolve => {
        setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
    });
});

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

function App(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        checkAutoLogin(dispatch, navigate);
    }, []);

    let routeblog = (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path='/login' element={<Login />} />
            <Route path='/page-register' element={<SignUp />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
    if (props.isAuthenticated) {
        return (
            <>
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                }
                >
                    <Index />
                </Suspense>
            </>
        );

    } else {
        return (
            <div className="vh-100">
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                }
                >
                    {routeblog}
                </Suspense>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
    };
};

export default withRouter(connect(mapStateToProps)(App)); 