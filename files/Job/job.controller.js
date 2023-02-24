const Factory = require("../auth/handler.factory.service");
const Jobs = require("./job.model");

const createJob = Factory.createOne(Jobs)
const getAllJobs = Factory.getAll(Jobs)
const getJob = Factory.getOne(Jobs)
const updateJob = Factory.updateOne(Jobs)
const deleteJob = Factory.deleteOne(Jobs)

module.exports = { createJob, getAllJobs, getJob, updateJob, deleteJob }