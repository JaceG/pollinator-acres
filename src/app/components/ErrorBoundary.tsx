import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAF7F0",
            padding: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              textAlign: "center",
              padding: "2rem",
              backgroundColor: "#FFF",
              borderRadius: "1rem",
              boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
            }}
          >
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                fontWeight: 600,
                color: "#1C1C1C",
                marginBottom: "1rem",
              }}
            >
              Oops! Something went wrong
            </h1>
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "1rem",
                color: "#5C3D1E",
                lineHeight: 1.7,
                marginBottom: "2rem",
              }}
            >
              We're sorry for the inconvenience. Please try refreshing the page,
              or contact us if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                fontFamily: "'Lato', sans-serif",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                backgroundColor: "#E8A020",
                color: "#FFF",
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(232, 160, 32, 0.4)",
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
