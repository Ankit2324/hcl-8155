import { useActionState } from "react";
import SubmitButton from "./SubmitButton";
import api from "./api";

const PostForm = ({ onCreated }) => {
  const submitAction = async (prev, formData) => {
    const title = formData.get("title")?.trim();
    const content = formData.get("content")?.trim();

    if (!title || !content) {
      return {
        error: "Title and content are required",
        msg: "",
        title: title || "",
        content: content || "",
      };
    }

    try {
      await api.post("/posts", { title, content });
      await onCreated?.();

      return {
        error: null,
        msg: "Post created successfully!",
        title: "",
        content: "",
      };
    } catch (error) {
      return {
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to create post. Please try again.",
        msg: "",
        title,
        content,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    submitAction,
    {
      error: null,
      msg: "",
      title: "",
      content: "",
    }
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        action={formAction}
        className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 space-y-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
              ✍️
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Write a Post
              </h3>
              <p className="text-sm text-gray-500">
                Share your thoughts with the community.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700"
          >
            Post Title
          </label>

          <input
            type="text"
            name="title"
            id="title"
            placeholder="Enter an interesting title..."
            defaultValue={state.title}
            required
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="content"
            className="block text-sm font-semibold text-gray-700"
          >
            Content
          </label>

          <textarea
            name="content"
            id="content"
            placeholder="What's on your mind?"
            rows={5}
            defaultValue={state.content}
            required
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 outline-none resize-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
          />
        </div>

        <SubmitButton text="Publish Post" />

        {state.msg && (
          <p
            role="status"
            className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium"
          >
            ✓ {state.msg}
          </p>
        )}

        {state.error && (
          <p
            role="alert"
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium"
          >
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
};

export default PostForm;