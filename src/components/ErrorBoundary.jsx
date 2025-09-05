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
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-body text-center">
                                    <h2 className="text-danger">Something went wrong</h2>
                                    <p className="text-muted">
                                        An error occurred while loading the application.
                                    </p>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => window.location.reload()}
                                    >
                                        Reload Page
                                    </button>
                                    {process.env.NODE_ENV === 'development' && (
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
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;