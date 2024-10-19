import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Make sure to include your CSS file

interface Team {
  id: string;
  name: string;
  projects: { id: string; name: string }[];
}

const Dashboard = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/teams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeams(response.data);
    };
    fetchTeams();
  }, []);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
  };

    return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>Profile</h3>
        <ul>
          {teams.map((team) => (
            <li key={team.id} onClick={() => handleTeamClick(team)}>
              {team.name}
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">
        <h2>Your Teams</h2>
        <ul>
          {teams.map((team) => (
            <li key={team.id} onClick={() => handleTeamClick(team)}>
              {team.name}
            </li>
          ))}
        </ul>
      </main>
      <section className="project-details">
        {selectedTeam ? (
          <div>
            <h3>Projects for {selectedTeam.name}</h3>
            <ul>
              {selectedTeam.projects.map((project) => (
                <li key={project.id}>{project.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Select a team to see projects.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
