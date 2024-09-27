import Tag from "../models/tagModel";

const createTag = async (req: any, res: any, next: any) => {
  const { name, category, description } = req.body;
  try {
    const tag = await Tag.create({
      name,
      category: category || "General",
      description: description || "No description provided",
    });

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Tag created successfully",
      data: tag,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error creating tag",
      error,
    });
  }
};

const getAllTags = async (req: any, res: any, next: any) => {
  try {
    const tags = await Tag.find();
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Tags retrieved successfully",
      data: tags,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error retrieving tags",
      error,
    });
  }
};

const getTagById = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  try {
    const tag = await Tag.findById(id);

    if (tag) {
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Tag retrieved successfully",
        data: tag,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Tag not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error retrieving tag",
      error,
    });
  }
};

const getTagByCategory = async (req: any, res: any, next: any) => {
  const { category } = req.params;

  try {
    const tags = await Tag.find({ category });

    if (tags.length > 0) {
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Tags retrieved successfully",
        tags,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Tags not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error retrieving tags",
      error,
    });
  }
};

const updateTag = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const { name, category, description } = req.body;

  try {
    const tag = await Tag.findById(id);

    if (tag) {
      tag.name = name || tag.name;
      tag.category = category || tag.category;
      tag.description = description || tag.description;

      await tag.save();

      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Tag updated successfully",
        data: tag,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Tag not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error updating tag",
      error,
    });
  }
};

const deleteTag = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  try {
    const tag = await Tag.findById(id);

    if (tag) {
      await tag.deleteOne();

      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Tag deleted successfully",
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Tag not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error deleting tag",
      error,
    });
  }
};

export {
  createTag,
  getAllTags,
  getTagById,
  getTagByCategory,
  updateTag,
  deleteTag,
};
