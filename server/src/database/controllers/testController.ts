import Test from "../models/testModel";

const createTest = async (req: any, res: any, next: any) => {
  const { title, content } = req.body;
  try {
    const test = await Test.create({
      title,
      content,
      repetition: 1,
    });

    res.status(200).json({
      message: "Test created successfully",
      test,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating test",
      error,
    });
  }
};

const getAllTests = async (req: any, res: any, next: any) => {
  try {
    const tests = await Test.find();
    res.status(200).json({
      message: "Tests retrieved successfully",
      tests: tests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving tests",
      error,
    });
  }
};
const incrementTestRepetition = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  try {
    const updatedTest = await Test.findByIdAndUpdate(
      id,
      { $inc: { repetition: 1 } },
      { new: true }
    );

    if (updatedTest) {
      res.status(200).json({
        message: "Repetition incremented successfully",
        test: updatedTest,
      });
    } else {
      res.status(404).json({
        message: "Test not found",
      });
    }
  } catch (error) {
    console.error("Error incrementing repetition:", error);
    res.status(500).json({
      message: "Error incrementing repetition",
      error,
    });
  }
};

export { createTest, getAllTests, incrementTestRepetition };
