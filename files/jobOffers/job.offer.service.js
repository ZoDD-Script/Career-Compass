const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

class Offers{

  static createOffer = (Model, model, modal) =>
  catchAsync(async (req, res, next) => {
    try {
      // Get the job and user from the database
      const job = await model.findById(req.params.jobId);
      const user = await modal.findById(req.params.userId);

      // Check if the job and user exist
      if (!job || !user) {
        return next(new AppError('Job or user not found', 404))
      }

      // Check if an offer already exists for the given job and user IDs
      const existingOffer = await Model.findOne({
        jobId: job._id,
        userId: user._id
      });
      if (existingOffer) {
        return next(new AppError('An offer for this job to this user already exists', 400))
      }

      // Create the job offer and save it to the database
      const offer = new Model({
        jobId: job._id,
        userId: user._id
      });
      await offer.save();

      return res.status(200).json({
        msg: 'Offer has been sent',
        data: offer
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: 'Internal server error'
      });
    }
  });

  static getAllUserJobOffers = Model =>
  catchAsync(async (req, res, next) => {
    try {
      // Get the job offers where the user id equals the id of the current logged in user
      const jobOffers = await Model.find({userId: req.user})

      if (!jobOffers) {
        return next(new AppError('You have no job Offers yet', 400))
      }

      return res.status(200).json({
        msg: 'Here are your job offers',
        data: jobOffers
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: 'Internal server error'
      });
    }
  });

  static acceptOffer = Model =>
  catchAsync(async (req, res, next) => {
    try {
      // Get the job offer and the user from the database
      const offer = await Model.findById(req.params.offerId);

      // Check if the offer and user exist
      if (!offer) {
        return next(new AppError('Offer or user not found', 404))
      }

      // Check if the user is the one to whom the offer was made
      if (offer.userId.toString() !== req.user._id.toString()) {
        console.log(offer.userId, req.user._id)
        return next(new AppError('You are not authorized to accept this offer', 403))
      }

      if(offer.status === 'ACCEPTED' ) {
        return next(new AppError('You already accepted this offer', 400))
      }

      if(offer.status === 'DECLINED' ) {
        return next(new AppError('You declined this offer', 400))
      }

      // Accept the offer
      offer.status = 'ACCEPTED';
      await offer.save();

      return res.status(200).json({
        msg: 'Offer has been accepted',
        data: offer
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: 'Internal server error'
      });
    }
  });

  static declineOffer = Model =>
  catchAsync(async (req, res, next) => {
    try {
      // Get the job offer and the user from the database
      const offer = await Model.findById(req.params.offerId);

      // Check if the offer and user exist
      if (!offer) {
        return next(new AppError('Offer or user not found', 404))
      }

      // Check if the user is the one to whom the offer was made
      if (offer.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to decline this offer'))
      }

      if(offer.status === 'ACCEPTED' ) {
        return next(new AppError('You already accepted this offer', 400))
      }

      if(offer.status === 'DECLINED' ) {
        return next(new AppError('You declined this offer', 400))
      }

      // Decline the offer
      offer.status = 'DECLINED';
      await offer.save();

      return res.status(200).json({
        msg: 'Offer has been declined',
        data: offer
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: 'Internal server error'
      });
    }
  });
}

module.exports = Offers