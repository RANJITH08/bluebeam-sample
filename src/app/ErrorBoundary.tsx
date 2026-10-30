import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          color: 'red',
          backgroundColor: '#fff',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          height: '100vh',
          overflow: 'auto'
        }}>
          <h1>Application Error</h1>
          <p><strong>Message:</strong> {this.state.error?.message}</p>
          <pre style={{ background: '#f8f8f8', padding: '10px', border: '1px solid #ddd' }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
