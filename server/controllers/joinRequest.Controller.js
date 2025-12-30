const Join = require('../models/JoinRequest.model');
const mongoose = require("mongoose");
const Tournament = require("../models/Tournament.model");

const getAllJoinRequests = async (req, res) => {
    try {
        const joins = await Join.find()
            .sort({ createdAt: -1 })
            .populate("userId", "firstName lastName email")
            .populate("tournamentId", "title mode sportType")
            .populate("teamId", "name");

        res.json({ data: joins });

        return res.json({ data: joins });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};


const approveJoinRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid join request id" });
        }

        const jr = await Join.findById(id);
        if (!jr) return res.status(404).json({ message: "Join request not found" });

        if (jr.status !== "pending") {
            return res.status(400).json({ message: `Can't approve. Current status: ${jr.status}` });
        }

        const tournament = await Tournament.findById(jr.tournamentId);
        if (!tournament) return res.status(404).json({ message: "Tournament not found" });

        if (tournament.status !== "open") {
            return res.status(400).json({ message: "Registration is closed" });
        }

        // SOLO approve
        if (jr.requestType === "solo") {
            const userId = String(jr.userId);

            const already = (tournament.participantsUsers || []).some(
                (x) => String(x) === userId
            );
            if (already) return res.status(400).json({ message: "User already joined" });

            if (tournament.maxParticipants && (tournament.participantsUsers?.length || 0) >= tournament.maxParticipants) {
                return res.status(400).json({ message: "Tournament is full" });
            }

            tournament.participantsUsers.push(jr.userId);
        }

        // TEAM approve
        if (jr.requestType === "team") {
            if (!jr.teamId) return res.status(400).json({ message: "teamId is missing in join request" });

            const teamId = String(jr.teamId);
            const already = (tournament.participantsTeams || []).some(
                (x) => String(x) === teamId
            );
            if (already) return res.status(400).json({ message: "Team already joined" });

            if (tournament.maxTeams && (tournament.participantsTeams?.length || 0) >= tournament.maxTeams) {
                return res.status(400).json({ message: "Tournament is full" });
            }

            tournament.participantsTeams.push(jr.teamId);
        }

        await tournament.save();

        jr.status = "approved";
        await jr.save();

        return res.json({ message: "Approved", joinRequest: jr, tournament });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

const rejectJoinRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid join request id" });
        }

        const jr = await Join.findById(id);
        if (!jr) return res.status(404).json({ message: "Join request not found" });

        if (jr.status !== "pending") {
            return res.status(400).json({ message: `Can't reject. Current status: ${jr.status}` });
        }

        jr.status = "rejected";
        await jr.save();

        return res.json({ message: "Rejected", joinRequest: jr });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};


const createJoin = async (req, res) => {
    try {
        const { tournamentId, requestType, userId, teamId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
            return res.status(400).json({ message: "Invalid tournamentId" });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }
        if (!["solo", "team"].includes(requestType)) {
            return res.status(422).json({ message: "requestType must be solo or team" });
        }
        if (requestType === "team") {
            if (!teamId) return res.status(422).json({ message: "teamId is required for team request" });
            if (!mongoose.Types.ObjectId.isValid(teamId)) {
                return res.status(400).json({ message: "Invalid teamId" });
            }
        }

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) return res.status(404).json({ message: "Tournament not found" });

        if (tournament.status !== "open") {
            return res.status(400).json({ message: "Registration is closed" });
        }

        const existing = await Join.findOne({
            tournamentId,
            userId,
            status: { $in: ["pending", "confirm_sent", "confirmed", "approved"] },
        });

        if (existing) {
            return res.status(409).json({ message: "Join request already exists" });
        }

        const join = await Join.create({
            tournamentId,
            requestType,
            userId,
            teamId: requestType === "team" ? teamId : undefined,
            status: "pending",
        });

        return res.status(201).json({ data: join });
    } catch (err) {
        console.log("createJoin error:", err);

        if (err.name === "ValidationError") {
            return res.status(422).json({ errors: err.errors });
        }

        return res.status(500).json({ message: "Server error", error: err.message });
    }
};




const updateJoin = async (req, res) => {
    try{
        const join = await Join.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(join);
    }catch(err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({error: err.errors});
        }
        res.json(err);
    }
}

const deleteJoin = async (req, res) => {
    try{
        const join = await Join.findByIdAndDelete({_id: req.params._id});
        res.json(join);
    }catch(err){
        res.json(err);
    }
}

const findAllJoins = async (req, res) => {
    try{
        const joins = await Join.find();
        res.json(joins);
    }catch(err){
        res.json(err);
    }
}

const findOneJoin = async (req, res) => {
    try{
          const join = await Join.findById({_id: req.params._id});
          res.json(join);
    }catch(err){
        res.json(err);
    }
}

const joinTournament = async (req, res) => {
    try {
        const { userId, teamId } = req.body;

        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ message: "Tournament not found" });

        if (tournament.status !== "open") {
            return res.status(400).json({ message: "Registration is closed" });
        }

        if (tournament.mode === "solo") {
            if (!userId) return res.status(400).json({ message: "userId is required" });

            const already = tournament.participantsUsers?.some((id) => id.toString() === userId);
            if (already) return res.status(400).json({ message: "Already joined" });

            if (tournament.maxParticipants && tournament.participantsUsers.length >= tournament.maxParticipants) {
                return res.status(400).json({ message: "Tournament is full" });
            }

            tournament.participantsUsers.push(userId);
            await tournament.save();
            return res.json(tournament);
        }

        if (tournament.mode === "team") {
            if (!teamId) return res.status(400).json({ message: "teamId is required" });

            const already = tournament.participantsTeams?.some((id) => id.toString() === teamId);
            if (already) return res.status(400).json({ message: "Team already joined" });

            if (tournament.maxTeams && tournament.participantsTeams.length >= tournament.maxTeams) {
                return res.status(400).json({ message: "Tournament is full" });
            }

            tournament.participantsTeams.push(teamId);
            await tournament.save();
            return res.json(tournament);
        }

        if (tournament.mode === "both") {
            if (teamId) {
                const already = tournament.participantsTeams?.some((id) => id.toString() === teamId);
                if (already) return res.status(400).json({ message: "Team already joined" });
                if (tournament.maxTeams && tournament.participantsTeams.length >= tournament.maxTeams) {
                    return res.status(400).json({ message: "Tournament is full" });
                }
                tournament.participantsTeams.push(teamId);
            } else {
                if (!userId) return res.status(400).json({ message: "userId is required (or send teamId)" });
                const already = tournament.participantsUsers?.some((id) => id.toString() === userId);
                if (already) return res.status(400).json({ message: "Already joined" });
                if (tournament.maxParticipants && tournament.participantsUsers.length >= tournament.maxParticipants) {
                    return res.status(400).json({ message: "Tournament is full" });
                }
                tournament.participantsUsers.push(userId);
            }
            await tournament.save();
            return res.json(tournament);
        }

        return res.status(400).json({ message: "Invalid mode" });
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = { createJoin, updateJoin, deleteJoin, findAllJoins, findOneJoin, joinTournament, approveJoinRequest, rejectJoinRequest, getAllJoinRequests };