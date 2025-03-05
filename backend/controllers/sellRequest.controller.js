import SellRequest from '../models/sellRequest.model.js';
import { sendSellRequestConfirmation, sendSellRequestNotificationToAdmin } from '../services/email.service.js';
import { validateSellRequest } from '../utils/validations/sellRequestValidations.js';
import path from 'path';
import fs from 'fs';

export const submitSellRequest = async (req, res) => {
  try {
    const { name, email, phone, productName, price, description } = req.body;
    
    // Validate request data
    const validation = validateSellRequest(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Process uploaded files
    const images = req.files ? req.files.map(file => ({
      filename: file.filename,
      path: file.path
    })) : [];

    // Create sell request
    const sellRequest = new SellRequest({
      name,
      email,
      phone,
      productName,
      price: parseFloat(price),
      description,
      images,
      user: req.id 
    });

    await sellRequest.save();

    // Send confirmation emails
    try {
      await Promise.all([
        sendSellRequestConfirmation(email, name),
        sendSellRequestNotificationToAdmin(sellRequest)
      ]);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue execution even if email fails
    }

    return res.status(201).json({
      success: true,
      message: 'Sell request submitted successfully',
      data: { id: sellRequest._id }
    });
  } catch (error) {
    console.error('Sell request submission error:', error);
    // Clean up uploaded files in case of an error
    if (req.files) {
        req.files.forEach(file => fs.unlinkSync(file.path));
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to submit sell request'
    });
  }
};

export const getSellRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const requests = await SellRequest.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await SellRequest.countDocuments();

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get sell requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sell requests'
    });
  }
};

export const downloadFile = async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join('uploads', filename);
  
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }
  
      return res.download(filePath, filename, err => {
        if (err) {
          console.error('File download error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to download file'
          });
        }
      });
    } catch (error) {
      console.error('File download error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while trying to download the file'
      });
    }
  };