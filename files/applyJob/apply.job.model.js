const mongoose = require("mongoose");

const applyJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  jobsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
    },
  ]
});

const ApplyJob = mongoose.model("ApplyJob", applyJobSchema);

module.exports = ApplyJob;
