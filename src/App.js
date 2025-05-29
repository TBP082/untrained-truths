import React, { useState } from "react";

const initialWorkoutHistory = [
  { date: "Mon", details: "Bench Press - 3x10 at 100lbs" },
  { date: "Tue", details: "Deadlift - 5x5 at 200lbs" },
];

const initialExerciseLibrary = [
  { name: "Squat", category: "Strength", target: "Legs" },
  { name: "Push-Up", category: "Bodyweight", target: "Chest" },
  { name: "Plank", category: "Core", target: "Core Stability" },
];

const initialGoals = [
  { description: "Squat 225lbs by August", progress: 70 },
  { description: "Run 5k under 25 minutes", progress: 40 },
];

function downloadCSV(data, filename) {
  const csvRows = [Object.keys(data[0]).join(",")];
  data.forEach(row => {
    csvRows.push(Object.values(row).join(","));
  });
  const csvData = new Blob([csvRows.join("\n")], { type: 'text/csv' });
  const url = window.URL.createObjectURL(csvData);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [premiumUser, setPremiumUser] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState(initialWorkoutHistory);
  const [exerciseLibrary, setExerciseLibrary] = useState(initialExerciseLibrary);
  const [goals, setGoals] = useState(initialGoals);
  const [searchTerm, setSearchTerm] = useState("");
  const [goalSearch, setGoalSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");

  const handleLogin = () => setUser({ name: "Demo User" });
  const handleUpgrade = () => setPremiumUser(true);

  const deleteHistory = (index) => {
    setWorkoutHistory(workoutHistory.filter((_, i) => i !== index));
  };

  const updateHistory = (index, field, value) => {
    const updated = [...workoutHistory];
    updated[index][field] = value;
    setWorkoutHistory(updated);
  };

  const deleteExercise = (index) => {
    setExerciseLibrary(exerciseLibrary.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exerciseLibrary];
    updated[index][field] = value;
    setExerciseLibrary(updated);
  };

  const deleteGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index, field, value) => {
    const updated = [...goals];
    updated[index][field] = value;
    setGoals(updated);
  };

  const filteredExercises = exerciseLibrary.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGoals = goals.filter(goal =>
    goal.description.toLowerCase().includes(goalSearch.toLowerCase())
  ).sort((a, b) => b.progress - a.progress);

  const filteredHistory = workoutHistory.filter(entry =>
    entry.date.toLowerCase().includes(historySearch.toLowerCase()) ||
    entry.details.toLowerCase().includes(historySearch.toLowerCase())
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div style={{ padding: 20 }}>
      <h1>Untrained Truths</h1>

      {!user ? (
        <div>
          <button onClick={handleLogin}>Log In</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span>Logged in as {user.name}</span>
            {!premiumUser && (
              <button onClick={handleUpgrade}>Upgrade to Premium</button>
            )}
          </div>

          <h2>Workout History</h2>
          <input
            type="text"
            placeholder="Search workout history..."
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
          />
          <button onClick={() => downloadCSV(filteredHistory, 'workout-history.csv')}>Export CSV</button>
          <ul>
            {filteredHistory.map((entry, idx) => (
              <li key={idx}>
                <input
                  value={entry.date}
                  onChange={(e) => updateHistory(idx, "date", e.target.value)}
                />
                <input
                  value={entry.details}
                  onChange={(e) => updateHistory(idx, "details", e.target.value)}
                />
                <button onClick={() => deleteHistory(idx)}>Delete</button>
              </li>
            ))}
          </ul>

          <h2>Exercise Library</h2>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul>
            {filteredExercises.map((exercise, idx) => (
              <li key={idx}>
                <input
                  value={exercise.name}
                  onChange={(e) => updateExercise(idx, "name", e.target.value)}
                />
                <input
                  value={exercise.category}
                  onChange={(e) => updateExercise(idx, "category", e.target.value)}
                />
                <input
                  value={exercise.target}
                  onChange={(e) => updateExercise(idx, "target", e.target.value)}
                />
                <button onClick={() => deleteExercise(idx)}>Delete</button>
              </li>
            ))}
          </ul>

          <h2>Personal Goals</h2>
          <input
            type="text"
            placeholder="Search goals..."
            value={goalSearch}
            onChange={(e) => setGoalSearch(e.target.value)}
          />
          <button onClick={() => downloadCSV(filteredGoals, 'goals.csv')}>Export CSV</button>
          {filteredGoals.map((goal, idx) => (
            <div key={idx}>
              <input
                value={goal.description}
                onChange={(e) => updateGoal(idx, "description", e.target.value)}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(e) => updateGoal(idx, "progress", e.target.value)}
              />
              <div style={{ background: '#eee', height: '10px', width: '100%', borderRadius: '5px' }}>
                <div style={{ background: 'blue', height: '10px', width: `${goal.progress}%`, borderRadius: '5px' }}></div>
              </div>
              <button onClick={() => deleteGoal(idx)}>Delete</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

