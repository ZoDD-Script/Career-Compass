const { protect, restrictTo, isLoggedIn } = require('../../middleware/authenticate')
const Admin = require('../admin/admin.model')
const jobApplicationRoute = require('../applyJob/apply.job.routes')
const User = require('../users/user.model')
const { createJob, getAllJobs, getJob, updateJob, deleteJob } = require('./job.controller')

const jobRoute = require('express').Router()

jobRoute.use('/:jobId/apllication', jobApplicationRoute)

jobRoute.get('/', protect([Admin, User]), getAllJobs)
jobRoute.get('/:jobId', protect([Admin, User]), isLoggedIn, getJob)

jobRoute.use(protect([Admin]), restrictTo('admin'))

jobRoute.post('/create', createJob)
jobRoute.patch('/update/:jobId', updateJob)
jobRoute.delete('/delete/:jobId', deleteJob)

module.exports = jobRoute