const { About, WorkExperience, Education, Skill, Value } = require('../models');
const BaseRepository = require('../models/BaseRepository');

const aboutRepo = new BaseRepository(About);
const workExperienceRepo = new BaseRepository(WorkExperience);
const educationRepo = new BaseRepository(Education);
const skillRepo = new BaseRepository(Skill);
const valueRepo = new BaseRepository(Value);

// Get user's about profile (or create if not exists)
async function getOrCreateAbout(req, res, next) {
  try {
    console.log('Getting about profile for user:', req.user);
    const userId = req.user.id; // From authentication middleware

    // Try to find existing about profile
    console.log('Searching for about profile with userId:', userId);
    let about = await aboutRepo.getAll({
      where: { userId },
      include: [
        { model: WorkExperience, as: 'workExperiences' },
        { model: Education, as: 'educations' },
        { model: Skill, as: 'skills' },
        { model: Value, as: 'values' }
      ]
    });

    console.log('Search result:', about ? about.length : 'no results');

    // If about profile exists, return the first one (should be only one per user)
    if (about && about.length > 0) {
      console.log('Found about profile');
      return res.json(about[0]);
    }

    // If not exists, return 404
    console.log('No about profile found for userId:', userId);
    return res.status(404).json({ 
      message: 'About profile not found for this user'
    });
  } catch (err) {
    console.error('Error in getOrCreateAbout:', err);
    next(err);
  }
}

// Create about profile
async function createAbout(req, res, next) {
  try {
    console.log('Creating about profile for user:', req.user.id);
    const userId = req.user.id;
    
    // Check if user already has an about profile
    const existingAbout = await aboutRepo.getAll({ where: { userId } });
    
    if (existingAbout && existingAbout.length > 0) {
      console.log('User already has an about profile');
      return res.status(400).json({ 
        message: 'User already has an about profile. Use PUT to update it.' 
      });
    }
    
    // Prepare data with default values if not provided
    const aboutData = {
      userId,
      headline: req.body.headline || 'Software Developer',
      subheadline: req.body.subheadline || 'Building digital experiences',
      story: req.body.story || 'Tell your story here.'
    };
    
    console.log('Creating about profile with data:', aboutData);
    
    // Create about profile
    const newAbout = await aboutRepo.create(aboutData);
    
    console.log('About profile created:', newAbout.id);
    
    // Return created about profile
    return res.status(201).json(newAbout);
  } catch (err) {
    console.error('Error in createAbout:', err);
    next(err);
  }
}

// Update about profile
async function updateAbout(req, res, next) {
  try {
    const userId = req.user.id; // From authentication middleware
    const { headline, subheadline, story } = req.body;
    
    // Find about id by userId
    const existingAbout = await aboutRepo.getAll({
      where: { userId }
    });

    if (!existingAbout || existingAbout.length === 0) {
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const aboutId = existingAbout[0].id;

    // Update about profile
    await aboutRepo.update(aboutId, {
      headline,
      subheadline,
      story
    });

    // Get updated about
    const updatedAbout = await aboutRepo.getById(aboutId);
    res.json(updatedAbout);
  } catch (err) {
    next(err);
  }
}

// Delete about profile
async function deleteAbout(req, res, next) {
  try {
    const userId = req.user.id; // From authentication middleware
    
    // Find about id by userId
    const existingAbout = await aboutRepo.getAll({
      where: { userId }
    });

    if (!existingAbout || existingAbout.length === 0) {
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const aboutId = existingAbout[0].id;

    // Delete about profile (cascade will delete related records)
    await aboutRepo.delete(aboutId);
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// WORK EXPERIENCE CRUD OPERATIONS

// Get all work experiences for a user
async function getWorkExperiences(req, res, next) {
  try {
    const userId = req.user.id;
    
    // Find about id by userId
    const about = await aboutRepo.getAll({
      where: { userId }
    });

    if (!about || about.length === 0) {
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const aboutId = about[0].id;

    // Get all work experiences for this about profile
    const workExperiences = await workExperienceRepo.getAll({
      where: { aboutId }
    });

    res.json(workExperiences);
  } catch (err) {
    next(err);
  }
}

// Create work experience
async function createWorkExperience(req, res, next) {
  try {
    const userId = req.user.id;
    
    // Find about id by userId
    const about = await aboutRepo.getAll({
      where: { userId }
    });

    if (!about || about.length === 0) {
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const aboutId = about[0].id;
    
    // Create new work experience
    const { title, company, period, description } = req.body;
    
    const newWorkExperience = await workExperienceRepo.create({
      title,
      company,
      period,
      description,
      aboutId
    });

    res.status(201).json(newWorkExperience);
  } catch (err) {
    next(err);
  }
}

// Update work experience
async function updateWorkExperience(req, res, next) {
  try {
    const userId = req.user.id;
    const workExperienceId = req.params.id;
    
    // Find about id by userId
    const about = await aboutRepo.getAll({
      where: { userId }
    });

    if (!about || about.length === 0) {
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const aboutId = about[0].id;
    
    // Find work experience and verify it belongs to the user's about profile
    const workExperience = await workExperienceRepo.getById(workExperienceId);
    
    if (!workExperience) {
      return res.status(404).json({ 
        message: 'Work experience not found'
      });
    }

    if (workExperience.aboutId !== aboutId) {
      return res.status(403).json({ 
        message: 'You do not have permission to update this work experience'
      });
    }
    
    // Update work experience
    const { title, company, period, description } = req.body;
    
    await workExperienceRepo.update(workExperienceId, {
      title,
      company,
      period,
      description
    });

    // Get updated work experience
    const updatedWorkExperience = await workExperienceRepo.getById(workExperienceId);
    res.json(updatedWorkExperience);
  } catch (err) {
    next(err);
  }
}

// Delete work experience
async function deleteWorkExperience(req, res, next) {
  try {
    const userId = req.user.id;
    const workExperienceId = req.params.id;
    
    // Find about id by userId
    const about = await aboutRepo.getAll({
      where: { userId }
    });

    if (!about || about.length === 0) {
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const aboutId = about[0].id;
    
    // Find work experience and verify it belongs to the user's about profile
    const workExperience = await workExperienceRepo.getById(workExperienceId);
    
    if (!workExperience) {
      return res.status(404).json({ 
        message: 'Work experience not found'
      });
    }

    if (workExperience.aboutId !== aboutId) {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this work experience'
      });
    }
    
    // Delete work experience
    await workExperienceRepo.delete(workExperienceId);
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/******************************
 * Education CRUD Operations
 ******************************/

// Get all educations for current user
async function getEducations(req, res, next) {
  try {
    const userId = req.user.id;
    
    // Find about id by userId
    const about = await aboutRepo.getAll({
      where: { userId }
    });

    if (!about || about.length === 0) {
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const aboutId = about[0].id;
    
    // Get all educations for this about profile
    const educations = await educationRepo.getAll({
      where: { aboutId }
    });
    
    res.json(educations);
  } catch (err) {
    console.error('Error in getEducations:', err);
    next(err);
  }
}

// Create education
async function createEducation(req, res, next) {
  try {
    const userId = req.user.id;
    
    // Find about id by userId
    const about = await aboutRepo.getAll({
      where: { userId }
    });

    if (!about || about.length === 0) {
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const aboutId = about[0].id;
    
    // Create education entry
    const { degree, institution, period, description } = req.body;
    
    const newEducation = await educationRepo.create({
      degree,
      institution,
      period,
      description,
      aboutId
    });
    
    res.status(201).json(newEducation);
  } catch (err) {
    console.error('Error in createEducation:', err);
    next(err);
  }
}

// Update education
async function updateEducation(req, res, next) {
  try {
    const userId = req.user.id;
    const educationId = req.params.id;
    
    // Find about id by userId
    const about = await aboutRepo.getAll({
      where: { userId }
    });

    if (!about || about.length === 0) {
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const aboutId = about[0].id;
    
    // Find education and verify it belongs to the user's about profile
    const education = await educationRepo.getById(educationId);
    
    if (!education) {
      return res.status(404).json({ 
        message: 'Education not found'
      });
    }

    if (education.aboutId !== aboutId) {
      return res.status(403).json({ 
        message: 'You do not have permission to update this education'
      });
    }
    
    // Update education
    const { degree, institution, period, description } = req.body;
    
    await educationRepo.update(educationId, {
      degree,
      institution,
      period,
      description
    });

    // Get updated education
    const updatedEducation = await educationRepo.getById(educationId);
    res.json(updatedEducation);
  } catch (err) {
    console.error('Error in updateEducation:', err);
    next(err);
  }
}

// Delete education
async function deleteEducation(req, res, next) {
  try {
    const userId = req.user.id;
    const educationId = req.params.id;
    
    // Find about id by userId
    const about = await aboutRepo.getAll({
      where: { userId }
    });

    if (!about || about.length === 0) {
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const aboutId = about[0].id;
    
    // Find education and verify it belongs to the user's about profile
    const education = await educationRepo.getById(educationId);
    
    if (!education) {
      return res.status(404).json({ 
        message: 'Education not found'
      });
    }

    if (education.aboutId !== aboutId) {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this education'
      });
    }
    
    // Delete education
    await educationRepo.delete(educationId);
    
    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteEducation:', err);
    next(err);
  }
}

// Export all the controller functions
module.exports = {
  getOrCreateAbout,
  createAbout,
  updateAbout,
  deleteAbout,
  getWorkExperiences,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getEducations,
  createEducation,
  updateEducation,
  deleteEducation
}; 