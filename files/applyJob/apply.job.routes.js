const { protect, restrictTo } = require('../../middleware/authenticate')
const Admin = require('../admin/admin.model')
const User = require('../users/user.model')
const { jobApplication, getAllUserJobsApplication, getAllJobsApplication } = require('./apply.job.controller')

const jobApplicationRoute = require('express').Router({ mergeParams: true })

jobApplicationRoute.post('/apply/:jobId', protect([User]), restrictTo('user'), jobApplication)
jobApplicationRoute.get('/myApplication', protect([User, Admin]), restrictTo('user'), getAllUserJobsApplication)
jobApplicationRoute.get('/applications', protect([Admin]), restrictTo('admin'), getAllJobsApplication)

module.exports = jobApplicationRoute