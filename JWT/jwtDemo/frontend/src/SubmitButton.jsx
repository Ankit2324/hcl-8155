import { useFormStatus } from "react-dom";

const SubmitButton = ({ text = "Submit" }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full flex items-center justify-center gap-2
        rounded-xl px-5 py-3 font-semibold text-white
        shadow-lg shadow-indigo-500/20
        transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-indigo-200
        ${
          pending
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl active:scale-[0.98]"
        }`}
    >
      {pending && (
        <svg
          className="h-5 w-5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}

      {pending ? "Please wait..." : text}
    </button>
  );
};

export default SubmitButton;