import { Component, ReactNode } from 'react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

function ErrorFallback({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <span className="text-6xl">⚠️</span>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        An unexpected error occurred. You can try again or go back to the dashboard.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={onReset}>
          Try again
        </Button>
        <Button onClick={() => (window.location.href = '/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback onReset={() => this.setState({ hasError: false })} />
      );
    }
    return this.props.children;
  }
}
