"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeam = exports.joinTeam = void 0;
const xata_1 = require("../xata"); // Import the Xata client
const xata = (0, xata_1.getXataClient)();
// Join a team
const joinTeam = async (req, res) => {
    const userId = req.user.id; // Use non-null assertion since authMiddleware guarantees `user` exists
    const { teamId } = req.body;
    try {
        // Fetch the team from the database and safely cast it
        const team = await xata.db.Team.read(teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }
        const castedTeam = team; // Safe type casting after checking
        // Check if user is already a member
        if (castedTeam.members.includes(userId)) {
            return res.status(400).json({ message: "You are already a member of this team" });
        }
        // Add user to the team's members array
        await xata.db.Team.update(teamId, {
            members: [...castedTeam.members, userId],
        });
        return res.json({ message: "Successfully joined the team" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.joinTeam = joinTeam;
// Create a new team
const createTeam = async (req, res) => {
    const { name, description } = req.body;
    const adminId = req.user.id; // Use non-null assertion
    try {
        // Create a new team record in the database
        const team = await xata.db.Team.create({ name, description, adminId });
        return res.status(201).json(team); // Return the created team
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createTeam = createTeam;
