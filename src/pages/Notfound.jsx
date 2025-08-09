import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center from-slate-50 bg-gradient-to-r to-slate-100 dark:from-slate-950 dark:to-slate-900 justify-center p-4">
      <div className="relative z-10 max-w-md w-full p-8 rounded-xl shadow-lg dark:bg-slate-900/30 dark:border-slate-700 bg-white border border-slate-200">
        <h1
          className="text-8xl font-bold animate-tada animate-iteration-count-infinite text-center mb-4 bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-400 to-blue-600"
        >
          404
        </h1>
        <h2 className="text-2xl font-semibold uppercase text-center mb-3 dark:text-slate-100 text-slate-600">
          Page Not Found
        </h2>
        <p className="text-center mb-6 dark:text-slate-300 text-slate-600">
          The page your your looking for cannot be found or no longer exist!
        </p>

        {/* Action buttons */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="px-5 py-2 rounded-full border-2 dark:border-white/30 font-medium transition-all dark:bg-blue-600 dark:hover:bg-blue-700 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
