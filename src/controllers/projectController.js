const { Project, Tag, ProjectImage, ProjectTag } = require('../models');
const BaseRepository = require('../models/BaseRepository');
const { Op } = require('sequelize');

const projectRepo = new BaseRepository(Project);
const tagRepo = new BaseRepository(Tag);
const projectImageRepo = new BaseRepository(ProjectImage);

/******************************
 * Project CRUD Operations
 ******************************/

// Get all projects
async function getAllProjects(req, res, next) {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] } // Don't include join table attributes
        }
      ]
    });

    res.json(projects);
  } catch (err) {
    console.error('Error in getAllProjects:', err);
    next(err);
  }
}

// Get project by ID
async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;
    
    const project = await Project.findByPk(id, {
      include: [
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] } // Don't include join table attributes
        },
        {
          model: ProjectImage,
          as: 'images'
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error('Error in getProjectById:', err);
    next(err);
  }
}

// Create a project
async function createProject(req, res, next) {
  try {
    const { title, description, image, link, fullDescription, tags, additionalImages } = req.body;
    
    // Validate required fields
    if (!title || !description || !image || !link || !fullDescription) {
      return res.status(400).json({ 
        error: 'Title, description, image, link, and fullDescription are required' 
      });
    }

    // Create the project
    const project = await projectRepo.create({
      title,
      description,
      image,
      link,
      fullDescription
    });

    // Process tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      // Find or create each tag and associate with the project
      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName }
        });
        await ProjectTag.create({
          projectId: project.id,
          tagId: tag.id
        });
      }
    }

    // Process additional images if provided
    if (additionalImages && Array.isArray(additionalImages) && additionalImages.length > 0) {
      for (const imageUrl of additionalImages) {
        await ProjectImage.create({
          imageUrl,
          projectId: project.id
        });
      }
    }

    // Fetch the project with all associations
    const createdProject = await Project.findByPk(project.id, {
      include: [
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] }
        },
        {
          model: ProjectImage,
          as: 'images'
        }
      ]
    });

    res.status(201).json(createdProject);
  } catch (err) {
    console.error('Error in createProject:', err);
    next(err);
  }
}

// Update a project
async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, image, link, fullDescription, tags } = req.body;
    
    // Find the project
    const project = await projectRepo.getById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update the project fields
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (image !== undefined) updates.image = image;
    if (link !== undefined) updates.link = link;
    if (fullDescription !== undefined) updates.fullDescription = fullDescription;

    // Update the project
    const updatedProject = await projectRepo.update(id, updates);

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Remove existing tag associations
      await ProjectTag.destroy({
        where: {
          projectId: id
        }
      });

      // Create new tag associations
      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName }
        });
        await ProjectTag.create({
          projectId: id,
          tagId: tag.id
        });
      }
    }

    // Fetch the updated project with associations
    const result = await Project.findByPk(id, {
      include: [
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] }
        },
        {
          model: ProjectImage,
          as: 'images'
        }
      ]
    });

    res.json(result);
  } catch (err) {
    console.error('Error in updateProject:', err);
    next(err);
  }
}

// Delete a project
async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    
    const project = await projectRepo.getById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // The associations will be deleted automatically due to CASCADE delete
    await projectRepo.delete(id);
    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteProject:', err);
    next(err);
  }
}

/******************************
 * Tag CRUD Operations
 ******************************/

// Get all tags
async function getAllTags(req, res, next) {
  try {
    const tags = await tagRepo.getAll();
    res.json(tags);
  } catch (err) {
    console.error('Error in getAllTags:', err);
    next(err);
  }
}

// Get projects by tag
async function getProjectsByTag(req, res, next) {
  try {
    const { tagName } = req.params;
    
    // Find the tag
    const tag = await Tag.findOne({
      where: {
        name: tagName
      }
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Find all projects with this tag
    const projects = await Project.findAll({
      include: [
        {
          model: Tag,
          as: 'tags',
          where: { id: tag.id },
          through: { attributes: [] }
        }
      ]
    });

    res.json(projects);
  } catch (err) {
    console.error('Error in getProjectsByTag:', err);
    next(err);
  }
}

/******************************
 * Project Images Operations
 ******************************/

// Add an image to a project
async function addProjectImage(req, res, next) {
  try {
    const { projectId } = req.params;
    const { imageUrl } = req.body;
    
    // Validate required fields
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Check if project exists
    const project = await projectRepo.getById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create the image
    const projectImage = await projectImageRepo.create({
      imageUrl,
      projectId
    });

    res.status(201).json(projectImage);
  } catch (err) {
    console.error('Error in addProjectImage:', err);
    next(err);
  }
}

// Delete a project image
async function deleteProjectImage(req, res, next) {
  try {
    const { id } = req.params;
    
    const projectImage = await projectImageRepo.getById(id);
    if (!projectImage) {
      return res.status(404).json({ error: 'Project image not found' });
    }

    await projectImageRepo.delete(id);
    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteProjectImage:', err);
    next(err);
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getAllTags,
  getProjectsByTag,
  addProjectImage,
  deleteProjectImage
}; 