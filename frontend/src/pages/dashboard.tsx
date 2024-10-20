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
  const [newTeamName, setNewTeamName] = useState<string>(""); // State for the new team name
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal visibility state

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

  // Function to handle form submission inside the modal
  const handleCreateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/teams', {
        name: newTeamName,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the teams list with the newly created team
      setTeams([...teams, response.data]);
      setNewTeamName(''); // Clear the input after submission
      setIsModalOpen(false); // Close the modal after submission
    } catch (error) {
      console.error("Error creating team", error);
    }
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

        {/* Clickable "Create a Team" link */}
        <p className="create-team-link" onClick={() => setIsModalOpen(true)}>
          + Create a new team
        </p>
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

      {/* Modal for creating a new team */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Create a new team</h4>
            <form onSubmit={handleCreateTeam}>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                required
              />
              <button type="submit">Create Team</button>
            </form>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
