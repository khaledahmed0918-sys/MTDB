// @ts-nocheck
import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    const props = this.props as any;
    if (this.state.hasError) {
      if (props.fallback) {
        return props.fallback;
      }
      return <ErrorBoundaryContent error={this.state.error} onReload={this.handleReload} />;
    }

    return props.children;
  }
}

function ErrorBoundaryContent({ error, onReload }: { error: Error | null; onReload: () => void }) {
  const { t, dir } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-mt-bg border border-red-900/30 rounded-xl">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
      <h2 className="text-3xl font-display font-bold text-white mb-4">
        {t('systemError')}
      </h2>
      <p className="text-[#888] max-w-md mb-8">
        {t('unexpectedAnomaly')}
        <br/><br/>
        <span className="font-mono text-sm text-red-400 bg-red-900/20 p-2 rounded block">
          {error?.message || t('unknownError')}
        </span>
      </p>
      <button
        onClick={onReload}
        className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors font-bold rounded-lg active:scale-95 transition-transform"
      >
        <RefreshCcw className="w-5 h-5" />
        {t('rebootSystem')}
      </button>
    </div>
  );
}
