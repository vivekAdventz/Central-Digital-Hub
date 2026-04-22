/**
 * Spinner Component
 * ------------------
 * Simple loading spinner used across the app.
 */

const Spinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-gray-200 border-t-indigo-600 rounded-full animate-spin`}
        style={{ borderTopWidth: size === 'sm' ? '2px' : '3px' }}
      ></div>
      {text && (
        <p className="text-sm text-gray-500 font-medium">{text}</p>
      )}
    </div>
  );
};

export default Spinner;
