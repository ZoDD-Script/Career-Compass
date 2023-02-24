const Factory = require("../auth/handler.factory.service");
const Jobs = require("../Job/job.model");
const ApplyJob = require("./apply.job.model");
const JobApply = require("./apply.job.service");

const jobApplication = JobApply.createJobsApplied(ApplyJob, Jobs)
const getAllUserJobsApplication = JobApply.getAllUserAppliedJobs(ApplyJob, Jobs)
const getAllJobsApplication = Factory.getAll(ApplyJob)

module.exports = { jobApplication, getAllUserJobsApplication, getAllJobsApplication }