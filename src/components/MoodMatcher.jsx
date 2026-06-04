export default function MoodMatcher({ setQuery, fetchMovies }) {
  const getMoodQuery = (text) => {
    const t = (text || "").toLowerCase();
    if (t.includes("sad")) return "drama";
    if (t.includes("happy")) return "comedy";
    if (t.includes("love")) return "romance";
    if (t.includes("scary")) return "horror";
    if (t.includes("action")) return "action";
    return "avengers";
  };

  function handleMood(e) {
    e.preventDefault();
    const moodInput = e.target.mood?.value || "";
    const mapped = getMoodQuery(moodInput);

    setQuery(mapped);
    fetchMovies(mapped);
  }

  return (
    <form onSubmit={handleMood} className="mood-block" aria-label="Mood matcher">
      <input name="mood" className="mood-input" placeholder="I feel sad but want action..." />
      <button type="submit" className="btn-secondary">Mood Match</button>
    </form>
  );
}
