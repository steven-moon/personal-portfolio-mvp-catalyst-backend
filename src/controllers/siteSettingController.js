const { SiteSetting } = require('../models');
const BaseRepository = require('../models/BaseRepository');

const siteSettingRepo = new BaseRepository(SiteSetting);

/******************************
 * SiteSetting Operations
 ******************************/

// Get site settings
async function getSiteSettings(req, res, next) {
  try {
    // Get the site settings record (assuming there's only one)
    const siteSettings = await SiteSetting.findOne();

    if (!siteSettings) {
      return res.status(404).json({ error: 'Site settings not found' });
    }

    res.json(siteSettings);
  } catch (err) {
    console.error('Error in getSiteSettings:', err);
    next(err);
  }
}

// Create site settings
async function createSiteSettings(req, res, next) {
  try {
    // Check if site settings already exists
    const existingSiteSettings = await SiteSetting.findOne();
    if (existingSiteSettings) {
      return res.status(400).json({ 
        error: 'Site settings already exist. Use UPDATE instead.' 
      });
    }

    // Extract only valid fields from the request body
    const { 
      siteName, authorName, siteIcon, email, showEmailInFooter, 
      theme, primaryColor, enableAnimations, fontFamily,
      metaDescription, keywords, enableSocialMetaTags, googleAnalyticsId,
      enableBlog, enableProjects, enableContactForm, enableNewsletter, enableMvpBanner,
      enableGithub, enableLinkedin, enableTwitter, enableInstagram, enableYoutube, enableFacebook,
      githubUrl, linkedinUrl, twitterUrl, instagramUrl, youtubeUrl, facebookUrl
    } = req.body;
    
    // Validate required fields
    if (!siteName || !authorName || !email) {
      return res.status(400).json({ error: 'Site name, author name, and email are required' });
    }

    const siteSettings = await siteSettingRepo.create({
      siteName,
      authorName,
      siteIcon,
      email,
      showEmailInFooter,
      theme,
      primaryColor,
      enableAnimations,
      fontFamily,
      metaDescription,
      keywords,
      enableSocialMetaTags,
      googleAnalyticsId,
      enableBlog,
      enableProjects,
      enableContactForm,
      enableNewsletter,
      enableMvpBanner,
      enableGithub,
      enableLinkedin,
      enableTwitter,
      enableInstagram,
      enableYoutube,
      enableFacebook,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      instagramUrl,
      youtubeUrl,
      facebookUrl
    });

    res.status(201).json(siteSettings);
  } catch (err) {
    console.error('Error in createSiteSettings:', err);
    next(err);
  }
}

// Update site settings
async function updateSiteSettings(req, res, next) {
  try {
    const { id } = req.params;
    
    // Find the site settings
    const siteSettings = await siteSettingRepo.getById(id);
    if (!siteSettings) {
      return res.status(404).json({ error: 'Site settings not found' });
    }

    // Extract updates from the request body
    const updates = {};
    const allowedFields = [
      'siteName', 'authorName', 'siteIcon', 'email', 'showEmailInFooter',
      'theme', 'primaryColor', 'enableAnimations', 'fontFamily',
      'metaDescription', 'keywords', 'enableSocialMetaTags', 'googleAnalyticsId',
      'enableBlog', 'enableProjects', 'enableContactForm', 'enableNewsletter', 'enableMvpBanner',
      'enableGithub', 'enableLinkedin', 'enableTwitter', 'enableInstagram', 'enableYoutube', 'enableFacebook',
      'githubUrl', 'linkedinUrl', 'twitterUrl', 'instagramUrl', 'youtubeUrl', 'facebookUrl'
    ];

    // Only add fields that are present in the request body and in the allowed fields list
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedSiteSettings = await siteSettingRepo.update(id, updates);
    res.json(updatedSiteSettings);
  } catch (err) {
    console.error('Error in updateSiteSettings:', err);
    next(err);
  }
}

// Get public site settings
// This is a limited version of site settings that is safe to expose publicly
async function getPublicSiteSettings(req, res, next) {
  try {
    const siteSettings = await SiteSetting.findOne();

    if (!siteSettings) {
      return res.status(404).json({ error: 'Site settings not found' });
    }

    // Return only public-safe fields
    const publicFields = {
      id: siteSettings.id,
      siteName: siteSettings.siteName,
      authorName: siteSettings.authorName,
      siteIcon: siteSettings.siteIcon,
      showEmailInFooter: siteSettings.showEmailInFooter,
      theme: siteSettings.theme,
      primaryColor: siteSettings.primaryColor,
      enableAnimations: siteSettings.enableAnimations,
      fontFamily: siteSettings.fontFamily,
      metaDescription: siteSettings.metaDescription,
      keywords: siteSettings.keywords,
      enableSocialMetaTags: siteSettings.enableSocialMetaTags,
      enableBlog: siteSettings.enableBlog,
      enableProjects: siteSettings.enableProjects,
      enableContactForm: siteSettings.enableContactForm,
      enableNewsletter: siteSettings.enableNewsletter,
      enableMvpBanner: siteSettings.enableMvpBanner,
      // Only include enabled social media and their URLs
      enableGithub: siteSettings.enableGithub,
      enableLinkedin: siteSettings.enableLinkedin,
      enableTwitter: siteSettings.enableTwitter,
      enableInstagram: siteSettings.enableInstagram,
      enableYoutube: siteSettings.enableYoutube,
      enableFacebook: siteSettings.enableFacebook
    };

    // Only include social media URLs if that platform is enabled
    if (siteSettings.enableGithub) publicFields.githubUrl = siteSettings.githubUrl;
    if (siteSettings.enableLinkedin) publicFields.linkedinUrl = siteSettings.linkedinUrl;
    if (siteSettings.enableTwitter) publicFields.twitterUrl = siteSettings.twitterUrl;
    if (siteSettings.enableInstagram) publicFields.instagramUrl = siteSettings.instagramUrl;
    if (siteSettings.enableYoutube) publicFields.youtubeUrl = siteSettings.youtubeUrl;
    if (siteSettings.enableFacebook) publicFields.facebookUrl = siteSettings.facebookUrl;

    // Only include email if showEmailInFooter is true
    if (siteSettings.showEmailInFooter) {
      publicFields.email = siteSettings.email;
    }

    res.json(publicFields);
  } catch (err) {
    console.error('Error in getPublicSiteSettings:', err);
    next(err);
  }
}

module.exports = {
  getSiteSettings,
  createSiteSettings,
  updateSiteSettings,
  getPublicSiteSettings
}; 