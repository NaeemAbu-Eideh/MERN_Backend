const Join = require('../models/JoinRequest.model');

const createJoin = async (req, res) => {
    try{
        const join = await Join.create(req.body);
        res.json(join);
    }catch(err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({error: err.errors});
        }
        res.json(err);
    }
}



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

        // ✅ SOLO join
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

        // ✅ TEAM join
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

        // ✅ BOTH mode (اختار بناءً على اللي مرسله)
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

module.exports = { createJoin, updateJoin, deleteJoin, findAllJoins, findOneJoin, joinTournament };