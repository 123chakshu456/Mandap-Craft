import prisma from '../config/prisma.js';

/**
 * @route   POST /api/quotes
 * @desc    Submit a bespoke event decor quotation request
 * @access  Public / Authenticated
 */
export const createQuote = async (req, res, next) => {
  try {
    const { email, scale, venue, drapes, estimated } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required to receive the estimate.',
      });
    }

    const userId = req.user ? req.user.id : null;

    const quote = await prisma.quote.create({
      data: {
        email,
        scale: scale || 'premium',
        venue: venue || 'banquet',
        drapes: drapes || 'heavy',
        estimated: parseFloat(estimated) || 0,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Bespoke quotation sent and registered with our design studio.',
      data: {
        quote,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/quotes
 * @desc    Get quotes
 * @access  Public / Admin
 */
export const getAllQuotes = async (req, res, next) => {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        quotes,
      },
    });
  } catch (error) {
    next(error);
  }
};
