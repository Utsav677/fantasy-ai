"use client";

import { useState } from "react";
import axios from "axios";

export default function FantasyAI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [players, setPlayers] = useState([]);
  const [cookies, setCookies] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/fantasy/login", { email, password });
      setTeams(response.data.teams);
      setCookies(response.data.cookies); // Store login cookies
    } catch (error) {
      console.error("Login failed:", error);
    }
    setLoading(false);
  };

  const handleTeamSelection = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/fantasy/fetch-team", { team: selectedTeam, cookies });
      setPlayers(response.data.players);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
    setLoading(false);
  };

  return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Fantasy Basketball AI</h1>

        <div className="mt-4">
          <input type="text" placeholder="Enter ESPN Email" className="border p-2 w-full mb-2"
                 value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input type="password" placeholder="Enter Password" className="border p-2 w-full mb-2"
                 value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
        </div>

        {teams.length > 0 && (
            <div className="mt-4">
              <select className="border p-2 w-full" value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="">Select Fantasy Team</option>
                {teams.map((team, index) => (
                    <option key={index} value={team}>{team}</option>
                ))}
              </select>
              <button onClick={handleTeamSelection} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
                Fetch Team Data
              </button>
            </div>
        )}

        {players.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Your Team Players</h2>
              <ul>
                {players.map((player, index) => (
                    <li key={index} className="mt-2">{player}</li>
                ))}
              </ul>
            </div>
        )}

        {loading && <p>Loading...</p>}
      </div>
  );
}
