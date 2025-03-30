import Career from "../models/Career.js";

export const predictCareer = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers?.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        details: 'Answers array is required'
      });
    }

    const traitCounts = answers.flat().reduce((counts, trait) => {
      counts[trait] = (counts[trait] || 0) + 1;
      return counts;
    }, {});

    const careers = await Career.find().lean();
    
    const bestCareer = careers.reduce((best, career) => {
      const matchScore = career.traits.reduce(
        (score, trait) => score + (traitCounts[trait] || 0),
        0
      );

      return matchScore > best.score ? { career, score: matchScore } : best;
    }, { career: null, score: 0 }).career;

    return res.json({
      success: true,
      data: bestCareer ? { career: bestCareer.name } : null,
      message: bestCareer ? 'Career match found' : 'No suitable career match found'
    });

  } catch (error) {
    console.error('Error processing career prediction:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process career prediction',
      error: error.message
    });
  }
};


export const getCareers = async (req, res) => {
  try {
    const careers = await Career.find().lean();
    return res.json({
      success: true,
      data: careers,
      message: 'Careers fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching careers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch career paths',
      error: error.message
    });
  }
};


export const createCareer = async (req, res) => {
  try {
    const careers = Array.isArray(req.body) ? req.body : [req.body];

    const invalidCareers = careers.filter(
      career => !career.name?.trim() || !Array.isArray(career.traits) || !career.traits.length
    );

    if (invalidCareers.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid career path format',
        details: 'Each career must have a name and traits array'
      });
    }

    const createdCareers = await Career.insertMany(careers);

    return res.status(201).json({
      success: true,
      message: 'Career paths created successfully',
      data: createdCareers
    });
  } catch (error) {
    console.error('Error creating careers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create career paths',
      error: error.message
    });
  }
};