interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon = '🔍', title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="text-6xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-300 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark
                     transition-colors duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
