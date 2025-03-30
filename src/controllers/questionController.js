import Question from "../models/Question.js";

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $sample: { size: 10 } },
      { $project: { __v: 0 } },
    ]);

    return res.status(200).json({
      success: true,
      message: `Successfully fetched ${questions.length} questions`,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
      error: error.message,
    });
  }
};


export const createQuestions = async (req, res) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || !questions.length) {
    return res.status(400).json({
      success: false,
      message: "Invalid request format",
      details: "Questions array is required",
    });
  }

  const invalidQuestions = questions.filter(
    (q) => !q.text?.trim() || !Array.isArray(q.options) || !q.options.length
  );

  if (invalidQuestions.length) {
    return res.status(400).json({
      success: false,
      message: "Invalid question format",
      details: "Each question must have text and options array",
      invalidQuestions: invalidQuestions,
    });
  }

  try {
    const createdQuestions = await Question.insertMany(questions);

    return res.status(201).json({
      success: true,
      message: `Successfully created ${createdQuestions.length} questions`,
      data: createdQuestions,
    });
  } catch (error) {
    console.error("Error creating questions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create questions",
      error: error.message,
    });
  }
};
