const Factory = require("../auth/handler.factory.service");
const Jobs = require("../Job/job.model");
const User = require("../users/user.model");
const JobOffer = require("./job.offer.model");
const Offers = require("./job.offer.service");

const offerJob = Offers.createOffer(JobOffer, Jobs, User)
const getAllUserJobOffers = Offers.getAllUserJobOffers(JobOffer)
const getAllJobOffers = Factory.getAll(JobOffer)
const acceptJobOffer = Offers.acceptOffer(JobOffer)
const declineJobOffer = Offers.declineOffer(JobOffer)

module.exports = { offerJob, getAllUserJobOffers, getAllJobOffers, acceptJobOffer, declineJobOffer }