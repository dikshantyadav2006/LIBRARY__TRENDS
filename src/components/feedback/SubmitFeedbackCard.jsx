import React, { useState } from "react";
import feedbackApi from "./feedbackApi";

const MAX_CHARS = 300;

const SubmitFeedbackCard = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(false);

  const charsLeft = MAX_CHARS - message.length;
  const progress = (message.length / MAX_CHARS) * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      await feedbackApi.submitFeedback(message);
      setStatus({ success: true, msg: "Feedback sent 💜" });
      setMessage("");
    } catch {
      setStatus({ success: false, msg: "Something went wrong 😢" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto mt-14">

      {/* 🔮 REAL BACKGROUND (CARD KE PEECHE) */}
      <div className="absolute inset-0 -z-10 blur-3xl">
        <div className="absolute w-60 h-60 bg-purple-500/40 rounded-full -top-20 -left-20 animate-floatSlow" />
        <div className="absolute w-72 h-72 bg-pink-500/40 rounded-full -bottom-24 -right-24 animate-floatSlow delay-2000" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-bgShift" />
      </div>

      {/* 🌈 GRADIENT BORDER */}
      <div className="p-[2px] rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-gradientMove">
        {/* INNER CARD */}
        <div className="bg-[--primary-light-color] dark:bg-[--primary-dark-color] rounded-3xl p-6 shadow-2xl">
          
          <h2 className="text-2xl font-bold mb-1">Drop your thoughts ✨</h2>
          <p className="text-sm text-gray-500 mb-4">We actually read these 👀</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                rows={4}
                maxLength={MAX_CHARS}
                placeholder="Type something magical..."
                className={`
                  w-full resize-none rounded-2xl p-4 border text-black
                  transition-all duration-300
                  ${
                    focus
                      ? "ring-2 ring-purple-400 bg-white scale-[1.01]"
                      : "bg-[--secondary-light-color]"
                  }
                `}
              />
              <span
                className={`absolute bottom-2 right-3 text-xs font-medium ${
                  charsLeft < 20 ? "text-red-500 animate-pulse" : "text-gray-400"
                }`}
              >
                {charsLeft} left
              </span>
            </div>

            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-2.5 rounded-xl font-semibold text-white
                bg-gradient-to-r from-blue-600 to-purple-600
                transition-all duration-300 hover:scale-[1.03]
                disabled:opacity-60
              "
            >
              {loading ? "Sending vibes..." : "🚀 Submit Feedback"}
            </button>
          </form>

          {status && (
            <div
              className={`mt-4 p-3 rounded-xl text-sm text-center ${
                status.success
                  ? "bg-green-100 text-green-700 animate-pulse"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedbackCard;
