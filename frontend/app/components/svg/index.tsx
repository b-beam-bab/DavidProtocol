export const SuccessIcon = () => (
  <svg
    className="h-6 w-6 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

SuccessIcon.displayName = "SuccessIcon";

export const ErrorIcon = () => (
  <svg
    className="h-6 w-6 text-destructive"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

ErrorIcon.displayName = "ErrorIcon";
