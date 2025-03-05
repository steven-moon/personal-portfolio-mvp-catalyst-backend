const { About, WorkExperience, Education, Skill, Value } = require('../models');
const BaseRepository = require('../models/BaseRepository');
const { sequelize } = require('../config/database');

const aboutRepo = new BaseRepository(About);
const workExperienceRepo = new BaseRepository(WorkExperience);
const educationRepo = new BaseRepository(Education);
const skillRepo = new BaseRepository(Skill);
const valueRepo = new BaseRepository(Value);

// Get public about data (no authentication required)
async function getPublicAbout(req, res, next) {
  try {
    console.log('Getting public about profile');
    
    // Find any about profile with all related data
    let about = await aboutRepo.getAll({
      include: [
        { model: WorkExperience, as: 'workExperiences' },
        { model: Education, as: 'educations' },
        { model: Skill, as: 'skills' },
        { model: Value, as: 'values' }
      ],
      limit: 1
    });

    // If about profile exists, return it
    if (about && about.length > 0) {
      // Format the data to match the frontend's expected structure
      const aboutData = about[0];
      
      // Group skills by category
      const skillsMap = new Map();
      aboutData.skills.forEach(skill => {
        if (!skillsMap.has(skill.categoryTitle)) {
          skillsMap.set(skill.categoryTitle, {
            id: skill.category,
            title: skill.categoryTitle,
            skills: []
          });
        }
        skillsMap.get(skill.categoryTitle).skills.push(skill.name);
      });
      
      // Convert the skills map to an array
      const skillCategories = Array.from(skillsMap.values());
      
      // Transform the data to match the frontend's expected structure
      const formattedData = {
        intro: {
          headline: aboutData.headline,
          subheadline: aboutData.subheadline
        },
        story: aboutData.story.split('\n\n'), // Split story into paragraphs
        workExperience: aboutData.workExperiences.map(exp => ({
          id: exp.id.toString(),
          title: exp.title,
          company: exp.company,
          period: exp.period,
          description: exp.description
        })),
        education: aboutData.educations.map(edu => ({
          id: edu.id.toString(),
          degree: edu.degree,
          institution: edu.institution,
          period: edu.period,
          description: edu.description
        })),
        skillCategories: skillCategories,
        values: aboutData.values.map(val => ({
          id: val.id.toString(),
          title: val.title,
          description: val.description
        }))
      };
      
      res.json(formattedData);
    } else {
      // Return empty data if no about profile exists
      res.json({
        intro: { headline: '', subheadline: '' },
        story: [],
        workExperience: [],
        education: [],
        skillCategories: [],
        values: []
      });
    }
  } catch (err) {
    next(err);
  }
}

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
    const { intro, story, workExperience, education, skillCategories, values } = req.body;
    
    console.log('==== updateAbout called ====');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Story type:', typeof story);
    console.log('Story value:', story);
    console.log('workExperience data:', JSON.stringify(workExperience, null, 2));
    console.log('education data:', JSON.stringify(education, null, 2));
    console.log('skillCategories data:', JSON.stringify(skillCategories, null, 2));
    console.log('values data:', JSON.stringify(values, null, 2));
    
    // Find about id by userId
    const existingAbout = await aboutRepo.getAll({
      where: { userId },
      include: [
        { model: WorkExperience, as: 'workExperiences' },
        { model: Education, as: 'educations' },
        { model: Skill, as: 'skills' },
        { model: Value, as: 'values' }
      ]
    });

    if (!existingAbout || existingAbout.length === 0) {
      console.log('About profile not found for user ID:', userId);
      return res.status(404).json({ 
        message: 'About profile not found for this user'
      });
    }

    const about = existingAbout[0];
    const aboutId = about.id;
    console.log('Found existing about ID:', aboutId);

    // Prepare the data for update
    const updateData = {
      headline: intro?.headline,
      subheadline: intro?.subheadline,
      story: story
    };
    
    console.log('Update data for main about fields:', JSON.stringify(updateData, null, 2));
    
    try {
      // Transaction to ensure all operations succeed or fail together
      await sequelize.transaction(async (t) => {
        // 1. Update the main about profile
        await aboutRepo.update(aboutId, updateData, { transaction: t });
        console.log('About profile main fields updated successfully');
        
        // 2. Handle work experiences
        if (Array.isArray(workExperience)) {
          console.log('Updating work experiences...');
          
          // Get existing work experiences
          const existingExperiences = about.workExperiences || [];
          console.log(`Found ${existingExperiences.length} existing work experiences`);
          
          // Create a map of existing experiences by ID for quick lookup
          const existingExperiencesMap = new Map();
          existingExperiences.forEach(exp => {
            existingExperiencesMap.set(exp.id.toString(), exp);
          });
          
          // Track which experiences were processed to determine which ones to delete
          const processedExperienceIds = new Set();
          
          // Process each work experience in the request
          for (const exp of workExperience) {
            // Clean the experience data
            const experienceData = {
              title: exp.title,
              company: exp.company,
              period: exp.period,
              description: exp.description,
              aboutId: aboutId
            };
            
            if (exp.id && existingExperiencesMap.has(exp.id)) {
              // Update existing experience
              console.log(`Updating existing work experience with ID: ${exp.id}`);
              await workExperienceRepo.update(existingExperiencesMap.get(exp.id).id, experienceData, { transaction: t });
              processedExperienceIds.add(exp.id.toString());
            } else {
              // Create new experience
              console.log('Creating new work experience');
              const newExp = await workExperienceRepo.create(experienceData, { transaction: t });
              processedExperienceIds.add(newExp.id.toString());
            }
          }
          
          // Delete experiences that weren't in the request (were removed)
          for (const exp of existingExperiences) {
            if (!processedExperienceIds.has(exp.id.toString())) {
              console.log(`Deleting work experience with ID: ${exp.id}`);
              await workExperienceRepo.delete(exp.id, { transaction: t });
            }
          }
          
          console.log('Work experiences updated successfully');
        }
        
        // 3. Handle education
        if (Array.isArray(education)) {
          console.log('Updating education entries...');
          
          // Get existing education entries
          const existingEducations = about.educations || [];
          console.log(`Found ${existingEducations.length} existing education entries`);
          
          // Create a map of existing education entries by ID for quick lookup
          const existingEducationsMap = new Map();
          existingEducations.forEach(edu => {
            existingEducationsMap.set(edu.id.toString(), edu);
          });
          
          // Track which education entries were processed to determine which ones to delete
          const processedEducationIds = new Set();
          
          // Process each education entry in the request
          for (const edu of education) {
            // Clean the education data
            const educationData = {
              degree: edu.degree,
              institution: edu.institution,
              period: edu.period,
              description: edu.description,
              aboutId: aboutId
            };
            
            if (edu.id && existingEducationsMap.has(edu.id)) {
              // Update existing education
              console.log(`Updating existing education with ID: ${edu.id}`);
              await educationRepo.update(existingEducationsMap.get(edu.id).id, educationData, { transaction: t });
              processedEducationIds.add(edu.id.toString());
            } else {
              // Create new education
              console.log('Creating new education entry');
              const newEdu = await educationRepo.create(educationData, { transaction: t });
              processedEducationIds.add(newEdu.id.toString());
            }
          }
          
          // Delete education entries that weren't in the request (were removed)
          for (const edu of existingEducations) {
            if (!processedEducationIds.has(edu.id.toString())) {
              console.log(`Deleting education with ID: ${edu.id}`);
              await educationRepo.delete(edu.id, { transaction: t });
            }
          }
          
          console.log('Education entries updated successfully');
        }
        
        // 4. Handle the new skillCategories
        if (Array.isArray(skillCategories)) {
          console.log('Updating skill categories...');
          
          // Get existing skills
          const existingSkills = about.skills || [];
          console.log(`Found ${existingSkills.length} existing skills`);
          
          // Delete all existing skills first (simpler approach)
          for (const skill of existingSkills) {
            await skillRepo.delete(skill.id, { transaction: t });
          }
          
          // Create new skills based on the skillCategories
          for (const category of skillCategories) {
            const categoryTitle = category.title || 'Uncategorized Skills';
            
            // Add each skill in this category
            if (Array.isArray(category.skills)) {
              for (const skillName of category.skills) {
                await skillRepo.create({
                  category: category.id || categoryTitle.toLowerCase().replace(/\s+/g, '-'),
                  categoryTitle: categoryTitle,
                  name: skillName,
                  aboutId: aboutId
                }, { transaction: t });
              }
            }
          }
          
          console.log('Skill categories updated successfully');
        }
        
        // 5. Handle values
        if (Array.isArray(values)) {
          console.log('Updating values...');
          
          // Get existing values
          const existingValues = about.values || [];
          console.log(`Found ${existingValues.length} existing values`);
          
          // Create a map of existing values by ID for quick lookup
          const existingValuesMap = new Map();
          existingValues.forEach(val => {
            existingValuesMap.set(val.id.toString(), val);
          });
          
          // Track which values were processed to determine which ones to delete
          const processedValueIds = new Set();
          
          // Process each value in the request
          for (const val of values) {
            // Clean the value data
            const valueData = {
              title: val.title,
              description: val.description,
              aboutId: aboutId
            };
            
            if (val.id && existingValuesMap.has(val.id)) {
              // Update existing value
              console.log(`Updating existing value with ID: ${val.id}`);
              await valueRepo.update(existingValuesMap.get(val.id).id, valueData, { transaction: t });
              processedValueIds.add(val.id.toString());
            } else {
              // Create new value
              console.log('Creating new value');
              const newVal = await valueRepo.create(valueData, { transaction: t });
              processedValueIds.add(newVal.id.toString());
            }
          }
          
          // Delete values that weren't in the request (were removed)
          for (const val of existingValues) {
            if (!processedValueIds.has(val.id.toString())) {
              console.log(`Deleting value with ID: ${val.id}`);
              await valueRepo.delete(val.id, { transaction: t });
            }
          }
          
          console.log('Values updated successfully');
        }
      });
      
      // Get updated about with all related data
      const updatedAbout = await aboutRepo.getAll({
        where: { id: aboutId },
        include: [
          { model: WorkExperience, as: 'workExperiences' },
          { model: Education, as: 'educations' },
          { model: Skill, as: 'skills' },
          { model: Value, as: 'values' }
        ]
      });
      
      // Process the data to match the expected format for the frontend
      const processedAbout = updatedAbout[0];
      
      // Group skills by category for the response
      const skillsMap = new Map();
      processedAbout.skills.forEach(skill => {
        if (!skillsMap.has(skill.categoryTitle)) {
          skillsMap.set(skill.categoryTitle, {
            id: skill.category,
            title: skill.categoryTitle,
            skills: []
          });
        }
        skillsMap.get(skill.categoryTitle).skills.push(skill.name);
      });
      
      // Convert the skills map to an array for the response
      const skillCategoriesResponse = Array.from(skillsMap.values());
      
      // Return the formatted response
      const responseData = {
        intro: {
          headline: processedAbout.headline,
          subheadline: processedAbout.subheadline
        },
        story: processedAbout.story.split('\n\n'),
        workExperience: processedAbout.workExperiences.map(exp => ({
          id: exp.id.toString(),
          title: exp.title,
          company: exp.company,
          period: exp.period,
          description: exp.description
        })),
        education: processedAbout.educations.map(edu => ({
          id: edu.id.toString(),
          degree: edu.degree,
          institution: edu.institution,
          period: edu.period,
          description: edu.description
        })),
        skillCategories: skillCategoriesResponse,
        values: processedAbout.values.map(val => ({
          id: val.id.toString(),
          title: val.title,
          description: val.description
        }))
      };
      
      res.json(responseData);
      console.log('About profile completely updated and returned to client');
    } catch (error) {
      console.error('Error updating about profile:', error.message);
      console.error('Error stack:', error.stack);
      return res.status(500).json({
        message: 'Error updating about profile',
        error: error.message
      });
    }
  } catch (err) {
    console.error('Unexpected error in updateAbout:', err.message);
    console.error('Error stack:', err.stack);
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
  getAbout: getOrCreateAbout,
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
  deleteEducation,
  getPublicAbout
}; 