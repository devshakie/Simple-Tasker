import { useEffect, useState } from "react";
import "./Dashboard.css";

interface Team {
  id: string;
  name: string;
  description: string;
  adminId: string;
  members: string[];
  projects: { id: string; name: string }[];
}

interface User {
  id: string;
  name: string;
}

const Dashboard = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newAdminId, setNewAdminId] = useState<string>("");
  const [newMembers, setNewMembers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/teams", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTeams();
    fetchUsers();
  }, []);

  // Fetch projects for the selected team when "View" is clicked
  const handleViewProjects = async (team: Team) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/projects/team/${team.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const projects = await response.json();
      setSelectedTeam({ ...team, projects });
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle form submission for creating a new team
  const handleCreateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/teams", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTeamName,
          description: newDescription,
          adminId: newAdminId,
          members: newMembers,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const newTeam = await response.json();
      setTeams((prevTeams) => [...prevTeams, newTeam]);

      // Clear the form input and close the modal
      setNewTeamName("");
      setNewDescription("");
      setNewAdminId("");
      setNewMembers([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle creating a new project
  const handleCreateProject = async (teamId: string) => {
    const projectName = prompt("Enter the project name:");
    if (!projectName) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/teams/${teamId}/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const newProject = await response.json();
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === teamId ? { ...team, projects: [...team.projects, newProject] } : team
        )
      );

      // Update the selected team with the new project
      if (selectedTeam && selectedTeam.id === teamId) {
        setSelectedTeam((prevSelectedTeam) =>
          prevSelectedTeam
            ? { ...prevSelectedTeam, projects: [...prevSelectedTeam.projects, newProject] }
            : prevSelectedTeam
        );
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>Profile</h3>

        <p className="create-team-link" onClick={() => setIsModalOpen(true)}>
          + Create a new team
        </p>
      </aside>

      <main className="main-content">
        <h2>Your Teams</h2>
        <ul className="team-list">
          {teams.map((team) => (
            <li key={team.id} className="team-item">
              <span className="team-name">{team.name}</span>
              <span className="team-description">{team.description}</span>
              <button
                className="view-projects-btn"
                onClick={() => handleViewProjects(team)}
              >
                View Projects
              </button>
              <button className="create-project-btn" onClick={() => handleCreateProject(team.id)}>
                Create New Project
              </button>
            </li>
          ))}
        </ul>
      </main>

      <section className="project-details">
        {selectedTeam && selectedTeam.projects ? (
          <div>
            <h3>Projects for {selectedTeam.name}</h3>
            <ul className="project-list">
              {selectedTeam.projects.map((project) => (
                <li key={project.id} className="project-item">
                  <div className="project-header">
                    <h4 className="project-name">{project.name}</h4>
                  </div>
                
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Select a team to see projects.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Create a new team</h4>
            <span
              className="close-modal"
              onClick={() => setIsModalOpen(false)}
              style={{
                cursor: "pointer",
                fontSize: "24px",
                position: "absolute",
                right: "10px",
                top: "10px",
              }}
            >
              &times;
            </span>
            <form onSubmit={handleCreateTeam}>
              {/* Team Name */}
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                required
              />

              {/* Description */}
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter team description"
                required
              />

              {/* Admin ID */}
              <input
                type="text"
                value={newAdminId}
                onChange={(e) => setNewAdminId(e.target.value)}
                placeholder="Enter admin ID"
                required
              />

              {/* Submit Button */}
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Team"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;