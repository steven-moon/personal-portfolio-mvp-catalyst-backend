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
    console.log('getHomePage: Retrieving homepage data with services');
    
    // Check if database connection is known to be failing
    if (process.env.DB_CONNECTION_FAILED === 'true') {
      console.log('getHomePage: DB connection known to be failed, returning fallback data');
      return res.json(getFallbackHomeData());
    }
    
    // Use the new static method to get home page with services
    const homePage = await HomePage.getWithServices();

    if (!homePage) {
      console.log('getHomePage: No homepage data found in database');
      // Return a default response instead of 404 to improve user experience
      return res.json(getFallbackHomeData());
    }

    console.log('getHomePage: Homepage data found, returning to client');
    res.json(homePage);
  } catch (err) {
    console.error('Error in getHomePage:', err);
    // Return a fallback response instead of an error
    res.json(getFallbackHomeData());
  }
}

// Helper function to get fallback home data
function getFallbackHomeData() {
  return {
    hero: {
      id: 1,
      title: "Steven Moon",
      subtitle: "Innovative AI & Blockchain Advisor with 24+ Years of Experience",
      profession: "Builder | Founder & CEO",
      profileImage: "/images/1741449380465-cropped_profile.jpg",
      services: [
        {
          id: "1",
          title: "AI & Blockchain Advisory",
          description: "Providing strategic guidance on AI integration, blockchain strategy, and model deployment to drive technological advancements."
        },
        {
          id: "2",
          title: "Mobile & Web Development",
          description: "Developing robust mobile and web applications using modern frameworks, optimized for performance and user engagement."
        },
        {
          id: "3",
          title: "Decentralized Solutions",
          description: "Implementing secure, decentralized technologies including blockchain governance, smart contract integrations, and token bridging."
        },
        {
          id: "4",
          title: "Technical Leadership",
          description: "Mentoring teams and managing projects to deliver innovative, scalable technology solutions across various platforms."
        }
      ]
    }
  };
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

    // Use the new static method to create home page
    const homePage = await HomePage.createOrUpdate({
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
    
    // Extract nested data from hero object if present
    let { title, subtitle, profession, profileImage, services } = req.body;
    
    // Check if request has hero structure
    if (req.body.hero) {
      console.log('Extracting data from hero object:', req.body.hero);
      title = req.body.hero.title;
      subtitle = req.body.hero.subtitle;
      profession = req.body.hero.profession;
      profileImage = req.body.hero.profileImage;
      services = req.body.hero.services;
    }
    
    console.log('Updating home page with data:', { id, title, subtitle, profession, profileImage });
    console.log('Services to update:', services);
    
    const homePage = await homePageRepo.getById(id);
    if (!homePage) {
      return res.status(404).json({ error: 'Home page data not found' });
    }

    // Use the static method to update home page
    const updatedHomePage = await HomePage.createOrUpdate({
      id,
      title,
      subtitle,
      profession,
      profileImage
    });

    // Update services if provided
    if (services && Array.isArray(services)) {
      console.log(`Processing ${services.length} services for home page ID ${id}`);
      
      try {
        // First fetch existing services to compare
        const existingServices = await Service.findAll({
          where: { homePageId: id }
        });
        
        console.log(`Found ${existingServices.length} existing services`);
        
        // Create a map of existing service IDs for easy lookup
        const existingServiceMap = {};
        existingServices.forEach(service => {
          // Use numeric ID from database as key
          const serviceId = service.id;
          existingServiceMap[serviceId] = service;
        });
        
        // Delete existing services that are not in the new list
        const newServiceIds = services.map(s => parseInt(s.id)).filter(id => !isNaN(id));
        console.log('New service IDs from request:', newServiceIds);
        
        // Get list of services to delete
        for (const existingService of existingServices) {
          if (!newServiceIds.includes(existingService.id)) {
            console.log(`Deleting service ID ${existingService.id}`);
            await existingService.destroy();
          }
        }
        
        // Create or update services
        for (const serviceData of services) {
          // Try to parse the ID - if it's a valid number use it, otherwise create new
          const serviceId = parseInt(serviceData.id);
          
          if (!isNaN(serviceId) && existingServiceMap[serviceId]) {
            // Update existing service
            console.log(`Updating existing service ID ${serviceId}`);
            const existingService = existingServiceMap[serviceId];
            await existingService.update({
              title: serviceData.title,
              description: serviceData.description
            });
          } else {
            // Create new service
            console.log('Creating new service');
            await Service.create({
              homePageId: id,
              title: serviceData.title,
              description: serviceData.description
            });
          }
        }
      } catch (serviceError) {
        console.error('Error processing services:', serviceError);
        // Continue execution even if service update fails
      }
    }

    // Fetch the updated home page with services to return
    const result = await HomePage.getWithServices();
    res.json(result);
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