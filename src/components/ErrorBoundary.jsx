import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="vh-100">
                    <div className="authincation h-100">
                        <div className="container h-100">
                            <div className="row justify-content-center h-100 align-items-center">
                                <div className="col-md-6">
                                    <div className="error-page">
                                        <h1 className="error-text">Oops!</h1>
                                        <p>Something went wrong. Please try again later.</p>
                                        
                                        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                                            <details className="mt-3 text-left">
                                                <summary>Error Details</summary>
                                                <pre className="text-danger small">
                                                    {this.state.error && this.state.error.toString()}
                                                    <br />
                                                    {this.state.errorInfo.componentStack}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
