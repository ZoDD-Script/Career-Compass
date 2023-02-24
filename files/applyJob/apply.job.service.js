const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

class JobApply{
  static createJobsApplied = (Model, model) =>
    catchAsync(async (req, res, next) => {
      try {
        const userId = req.user;
        const jobId = req.params.jobId;
    
        // Check if the job exists
        const job = await model.findById(jobId);
        if (!job) {
          return next(new AppError('No job found', 404));
        }
    
        // Check if the user has already applied for the job
        if (job.usersApplied.map(String).includes(String(userId.id))) {
          return next(new AppError('You have already applied for this job', 404));
        } else {
          console.log(userId, job.usersApplied[0])
          // Add the user to the list of users who have applied for the job
          job.usersApplied.push(userId);
          await job.save();
        }
        
    
    
        // Check if a JobsApplied document exists for the user
        let jobsApplied = await Model.findOne({ userId });
        if (!jobsApplied) {
          // If a JobsApplied document does not exist, create one
          jobsApplied = await Model.create({ userId, jobsId: [] });
        }
    
        // Check if the job already exists in the user's JobsApplied document
        if (jobsApplied.jobsId.includes(jobId)) {
          return next(new AppError('You have already applied for this job', 404));
        }
    
        // Add the job to the list of jobs the user has applied for
        jobsApplied.jobsId.push(jobId);
        await jobsApplied.save();
    
        return res.status(200).json({ msg: "Job applied successfully", data: jobsApplied });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
      }
    });
  
  
  static getAllUserAppliedJobs = (Model, model) =>
    catchAsync(async (req, res, next) => {
      const userJobsApplied = await Model.findOne({ userId: req.user });
    
      if (!userJobsApplied) {
        return next(new AppError('No applied jobs found for this user', 404))
      }
    
      const appliedJobIds = userJobsApplied.jobsId;
    
      const jobs = await model.find({ _id: { $in: appliedJobIds } });
    
      if (!jobs) {
        return next(new AppError('No jobs found for the applied job ids'))
      }
    
      res.status(200).json({
        msg: "Jobs Applied Fetched",
        result: jobs.length,
        data: jobs,
      });
    });
  }

module.exports = JobApply