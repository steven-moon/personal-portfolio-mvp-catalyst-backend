const { ContactInfo, SocialMedia } = require('../models');
const BaseRepository = require('../models/BaseRepository');

const contactInfoRepo = new BaseRepository(ContactInfo);
const socialMediaRepo = new BaseRepository(SocialMedia);

/******************************
 * ContactInfo CRUD Operations
 ******************************/

// Get contact info
async function getContactInfo(req, res, next) {
  try {
    // Get the first contact info record (assuming there's only one record in most cases)
    // Include associated social media records
    const contactInfo = await ContactInfo.findOne({
      include: [{
        model: SocialMedia,
        as: 'socialMedia',
        where: { enabled: true },
        required: false
      }]
    });

    if (!contactInfo) {
      return res.status(404).json({ error: 'Contact information not found' });
    }

    res.json(contactInfo);
  } catch (err) {
    console.error('Error in getContactInfo:', err);
    next(err);
  }
}

// Create contact info
async function createContactInfo(req, res, next) {
  try {
    // Check if contact info already exists
    const existingContactInfo = await ContactInfo.findOne();
    if (existingContactInfo) {
      return res.status(400).json({ 
        error: 'Contact information already exists. Use UPDATE instead.' 
      });
    }

    const { email, location } = req.body;
    
    if (!email || !location) {
      return res.status(400).json({ error: 'Email and location are required' });
    }

    const contactInfo = await contactInfoRepo.create({
      email,
      location
    });

    res.status(201).json(contactInfo);
  } catch (err) {
    console.error('Error in createContactInfo:', err);
    next(err);
  }
}

// Update contact info
async function updateContactInfo(req, res, next) {
  try {
    const { id } = req.params;
    const { email, location } = req.body;
    
    const contactInfo = await contactInfoRepo.getById(id);
    if (!contactInfo) {
      return res.status(404).json({ error: 'Contact information not found' });
    }

    const updates = {};
    if (email) updates.email = email;
    if (location) updates.location = location;

    const updatedContactInfo = await contactInfoRepo.update(id, updates);
    res.json(updatedContactInfo);
  } catch (err) {
    console.error('Error in updateContactInfo:', err);
    next(err);
  }
}

/******************************
 * SocialMedia CRUD Operations
 ******************************/

// Get all social media links
async function getSocialMedia(req, res, next) {
  try {
    const { contactInfoId } = req.params;
    
    // Validate that the contact info exists
    const contactInfo = await contactInfoRepo.getById(contactInfoId);
    if (!contactInfo) {
      return res.status(404).json({ error: 'Contact information not found' });
    }

    const socialMedia = await SocialMedia.findAll({
      where: { 
        contactInfoId,
        enabled: true
      }
    });

    res.json(socialMedia);
  } catch (err) {
    console.error('Error in getSocialMedia:', err);
    next(err);
  }
}

// Create a social media link
async function createSocialMedia(req, res, next) {
  try {
    const { contactInfoId } = req.params;
    const { platform, name, icon, url, enabled } = req.body;
    
    // Validate that the contact info exists
    const contactInfo = await contactInfoRepo.getById(contactInfoId);
    if (!contactInfo) {
      return res.status(404).json({ error: 'Contact information not found' });
    }

    // Check for required fields
    if (!platform || !name || !icon || !url) {
      return res.status(400).json({ 
        error: 'Platform, name, icon, and URL are required' 
      });
    }

    // Check if platform already exists for this contact info
    const existingPlatform = await SocialMedia.findOne({
      where: { contactInfoId, platform }
    });

    if (existingPlatform) {
      return res.status(400).json({ 
        error: `Social media platform '${platform}' already exists for this contact` 
      });
    }

    const socialMedia = await socialMediaRepo.create({
      contactInfoId,
      platform,
      name,
      icon,
      url,
      enabled: enabled === undefined ? false : enabled
    });

    res.status(201).json(socialMedia);
  } catch (err) {
    console.error('Error in createSocialMedia:', err);
    next(err);
  }
}

// Update a social media link
async function updateSocialMedia(req, res, next) {
  try {
    const { id } = req.params;
    const { platform, name, icon, url, enabled } = req.body;
    
    const socialMedia = await socialMediaRepo.getById(id);
    if (!socialMedia) {
      return res.status(404).json({ error: 'Social media link not found' });
    }

    const updates = {};
    if (platform !== undefined) updates.platform = platform;
    if (name !== undefined) updates.name = name;
    if (icon !== undefined) updates.icon = icon;
    if (url !== undefined) updates.url = url;
    if (enabled !== undefined) updates.enabled = enabled;

    // If changing platform, check for uniqueness
    if (platform && platform !== socialMedia.platform) {
      const existingPlatform = await SocialMedia.findOne({
        where: { 
          contactInfoId: socialMedia.contactInfoId, 
          platform,
          id: { $ne: id }
        }
      });

      if (existingPlatform) {
        return res.status(400).json({ 
          error: `Social media platform '${platform}' already exists for this contact` 
        });
      }
    }

    const updatedSocialMedia = await socialMediaRepo.update(id, updates);
    res.json(updatedSocialMedia);
  } catch (err) {
    console.error('Error in updateSocialMedia:', err);
    next(err);
  }
}

// Delete a social media link
async function deleteSocialMedia(req, res, next) {
  try {
    const { id } = req.params;
    
    const socialMedia = await socialMediaRepo.getById(id);
    if (!socialMedia) {
      return res.status(404).json({ error: 'Social media link not found' });
    }

    await socialMediaRepo.delete(id);
    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteSocialMedia:', err);
    next(err);
  }
}

module.exports = {
  getContactInfo,
  createContactInfo,
  updateContactInfo,
  getSocialMedia,
  createSocialMedia,
  updateSocialMedia,
  deleteSocialMedia
}; 