import Auction from '../models/Auction.js';
import moment from 'moment';
import { validateAuction } from '../utils/validations/auctionValidations.js';

// Create new auction (admin only)
export const createAuction = async (req, res) => {
  try {
    const validation = validateAuction(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Get the latest auction number
    const latestAuction = await Auction.findOne().sort({ auctionNumber: -1 });
    const nextAuctionNumber = latestAuction ? latestAuction.auctionNumber + 1 : 1;

    const auction = await Auction.create({
      ...req.body,
      auctionNumber: nextAuctionNumber
    });

    return res.status(201).json({
      success: true,
      message: 'Auction created successfully',
      data: auction
    });
  } catch (error) {
    console.error('Create auction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create auction'
    });
  }
};

// Get upcoming auctions
export const getUpcomingAuctions = async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
  
      // Get all upcoming auctions for the current year
      const upcomingAuctions = await Auction.find({
        status: 'upcoming',
        year: currentYear
      })
      .sort({ date: 1 })
      .lean();
  
      // Get the first upcoming auction
      const firstUpcoming = upcomingAuctions[0];
  
      const response = {
        success: true,
        data: {
          // Return only the first upcoming auction and list of upcoming auctions
          firstUpcomingAuction: firstUpcoming ? {
            date: moment(firstUpcoming.date).format('Do MMMM'),
            type: firstUpcoming.type === 'traditional' ? 'Traditional floor auction' : 'Internet only auction'
          } : null,
  
          upcomingAuctions: upcomingAuctions.map(auction => ({
            date: moment(auction.date).format('Do MMMM'),
            type: auction.type === 'traditional' ? 'Traditional floor auction' : 'Internet only auction'
          }))
        }
      };
  
      return res.status(200).json(response);
    } catch (error) {
      console.error('Get upcoming auctions error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming auctions'
      });
    }
  };

// Get past auctions
export const getPastAuctions = async (req, res) => {
    try {
      const { page = 1, limit = 15 } = req.query; // Default to page 1 and limit to 15 auctions
  
      // Calculate the number of auctions to skip based on the page number and limit
      const skip = (page - 1) * limit;
  
      // Fetch past auctions with pagination
      const auctions = await Auction.find({ status: 'past' })
        .sort({ date: -1 }) 
        .skip(skip) 
        .limit(parseInt(limit)) 
        .lean();
  
      if (!auctions || auctions.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No past auctions found.',
          data: []
        });
      }
  
      // Format auctions into the required structure
      const formattedAuctions = auctions.map((auction) => {
        const formattedDate = moment(auction.date).format('D MMM YYYY'); // e.g., "25 Jun 2022"
        const title = auction.title || `Auction ${auction.auctionNumber}`; 
        return {
          title: title,
          date: formattedDate,
        };
      });
  
      // Get the total number of past auctions to calculate the total pages
      const totalAuctions = await Auction.countDocuments({ status: 'past' });
  
      return res.status(200).json({
        success: true,
        data: {
          totalAuctions,
          totalPages: Math.ceil(totalAuctions / limit), 
          currentPage: page, 
          auctions: formattedAuctions
        }
      });
    } catch (error) {
      console.error('Error fetching past auctions:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch past auctions.'
      });
    }
  };

// Update auction (admin only)
export const updateAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateAuction(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const auction = await Auction.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Auction updated successfully',
      data: auction
    });
  } catch (error) {
    console.error('Update auction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update auction'
    });
  }
};

// Delete auction (admin only)
export const deleteAuction = async (req, res) => {
    try {
      const { id } = req.params;
      const auction = await Auction.findByIdAndUpdate(
        id,
        { status: 'deleted' }, 
        { new: true }
      );
  
      if (!auction) {
        return res.status(404).json({
          success: false,
          message: 'Auction not found'
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Auction marked as deleted successfully'
      });
    } catch (error) {
      console.error('Delete auction error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete auction'
      });
    }
  };