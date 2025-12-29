const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name field is required."],
            minlength: [2, "name must be at least 2 chars."],
            trim: true,
        },

        ownerUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "ownerUserId field is required."],
            index: true,
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                index: true,
            },
        ],
    },
    { timestamps: true }
);

TeamSchema.pre("save", function (next) {
    if (this.members && this.members.length) {
        this.members = [...new Set(this.members.map((id) => id.toString()))].map(
            (id) => new mongoose.Types.ObjectId(id)
        );
    }
    next();
});

module.exports = mongoose.model("Team", TeamSchema, "teams");
