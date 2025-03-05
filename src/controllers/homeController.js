const { HomePage, Service } = require('../models');
const BaseRepository = require('../models/BaseRepository');

const homePageRepo = new BaseRepository(HomePage);
const serviceRepo = new BaseRepository(Service);

/******************************
 * HomePage CRUD Operations
 ******************************/

// Get home page data
async function getHomePage(req, res, next) {
  try {
    // Get the first home page record (assuming there's only one record in most cases)
    // Include associated services
    const homePage = await HomePage.findOne({
      include: [{
        model: Service,
        as: 'services'
      }]
    });

    if (!homePage) {
      return res.status(404).json({ error: 'Home page data not found' });
    }

    res.json(homePage);
  } catch (err) {
    console.error('Error in getHomePage:', err);
    next(err);
  }
}

// Create home page data
async function createHomePage(req, res, next) {
  try {
    // Check if home page data already exists
    const existingHomePage = await HomePage.findOne();
    if (existingHomePage) {
      return res.status(400).json({ 
        error: 'Home page data already exists. Use UPDATE instead.' 
      });
    }

    const { title, subtitle, profession, profileImage } = req.body;
    
    if (!title || !subtitle || !profession) {
      return res.status(400).json({ error: 'Title, subtitle, and profession are required' });
    }

    const homePage = await homePageRepo.create({
      title,
      subtitle,
      profession,
      profileImage
    });

    res.status(201).json(homePage);
  } catch (err) {
    console.error('Error in createHomePage:', err);
    next(err);
  }
}

// Update home page data
async function updateHomePage(req, res, next) {
  try {
    const { id } = req.params;
    const { title, subtitle, profession, profileImage } = req.body;
    
    const homePage = await homePageRepo.getById(id);
    if (!homePage) {
      return res.status(404).json({ error: 'Home page data not found' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (subtitle !== undefined) updates.subtitle = subtitle;
    if (profession !== undefined) updates.profession = profession;
    if (profileImage !== undefined) updates.profileImage = profileImage;

    const updatedHomePage = await homePageRepo.update(id, updates);
    res.json(updatedHomePage);
  } catch (err) {
    console.error('Error in updateHomePage:', err);
    next(err);
  }
}

/******************************
 * Service CRUD Operations
 ******************************/

// Get all services
async function getAllServices(req, res, next) {
  try {
    const { homePageId } = req.params;
    
    // Validate that the home page exists
    const homePage = await homePageRepo.getById(homePageId);
    if (!homePage) {
      return res.status(404).json({ error: 'Home page not found' });
    }

    const services = await Service.findAll({
      where: { homePageId }
    });

    res.json(services);
  } catch (err) {
    console.error('Error in getAllServices:', err);
    next(err);
  }
}

// Get a specific service
async function getServiceById(req, res, next) {
  try {
    const { id } = req.params;
    
    const service = await serviceRepo.getById(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    console.error('Error in getServiceById:', err);
    next(err);
  }
}

// Create a service
async function createService(req, res, next) {
  try {
    const { homePageId } = req.params;
    const { title, description } = req.body;
    
    // Validate that the home page exists
    const homePage = await homePageRepo.getById(homePageId);
    if (!homePage) {
      return res.status(404).json({ error: 'Home page not found' });
    }

    // Check for required fields
    if (!title || !description) {
      return res.status(400).json({ 
        error: 'Title and description are required' 
      });
    }

    const service = await serviceRepo.create({
      homePageId,
      title,
      description
    });

    res.status(201).json(service);
  } catch (err) {
    console.error('Error in createService:', err);
    next(err);
  }
}

// Update a service
async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const service = await serviceRepo.getById(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    const updatedService = await serviceRepo.update(id, updates);
    res.json(updatedService);
  } catch (err) {
    console.error('Error in updateService:', err);
    next(err);
  }
}

// Delete a service
async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    
    const service = await serviceRepo.getById(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await serviceRepo.delete(id);
    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteService:', err);
    next(err);
  }
}

module.exports = {
  getHomePage,
  createHomePage,
  updateHomePage,
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
}; 