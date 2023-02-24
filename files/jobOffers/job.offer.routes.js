const { protect, restrictTo } = require('../../middleware/authenticate')
const Admin = require('../admin/admin.model')
const User = require('../users/user.model')
const { offerJob, getAllUserJobOffers, getAllJobOffers, acceptJobOffer, declineJobOffer } = require('./job.offer.controller')

const offerRoute = require('express').Router()

offerRoute.post('/create/:jobId/:userId', protect([Admin]), restrictTo('admin'), offerJob)
offerRoute.get('/', protect([Admin]), restrictTo('admin'), getAllJobOffers)
offerRoute.get('/userOffers', protect([User]), restrictTo('user'), getAllUserJobOffers)
offerRoute.post('/acceptOffer/:offerId', protect([User]), restrictTo('user'), acceptJobOffer)
offerRoute.post('/declineOffer/:offerId', protect([User]), restrictTo('user'), declineJobOffer)

module.exports = offerRoute