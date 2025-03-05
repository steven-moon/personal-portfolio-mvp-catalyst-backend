# Node.js Express API with Sequelize Models - To-Do List

This document contains a checklist of tasks to implement Sequelize models corresponding to the database schema defined in the migration scripts.

## To-Do List

- [x] **Step 1: About Me Models**
  - Create the following models for the About Me section:
    - [x] Create About model with fields: userId, headline, subheadline, story
    - [x] Create WorkExperience model with fields: title, company, period, description, aboutId
    - [x] Create Education model with fields: degree, institution, period, description, aboutId
    - [x] Create Skill model with fields: category, name, aboutId
    - [x] Create Value model with fields: title, description, aboutId
  - Set up associations:
    - [x] One-to-one between User and About
    - [x] One-to-many between About and WorkExperience
    - [x] One-to-many between About and Education
    - [x] One-to-many between About and Skill
    - [x] One-to-many between About and Value

- [x] **Step 2: Blog Post Models**
  - Create the following models for the Blog section:
    - [x] Create Category model with fields: name
    - [x] Create BlogPost model with fields: title, excerpt, content, date, imageUrl, authorId, categoryId
  - Set up associations:
    - [x] One-to-many between User and BlogPost (author)
    - [x] One-to-many between Category and BlogPost

- [ ] **Step 3: Contact Info Models**
  - Create the following models for Contact information:
    - [ ] Create ContactInfo model with fields: email, location
    - [ ] Create SocialMedia model with fields: platform, name, icon, url, enabled, contactInfoId
  - Set up associations:
    - [ ] One-to-many between ContactInfo and SocialMedia

- [ ] **Step 4: Home Page Models**
  - Create the following models for the Home Page:
    - [ ] Create HomePage model with fields: title, subtitle, profession, profileImage
    - [ ] Create Service model with fields: title, description, homePageId
  - Set up associations:
    - [ ] One-to-many between HomePage and Service

- [ ] **Step 5: Project Models**
  - Create the following models for the Projects section:
    - [ ] Create Project model with fields: title, description, image, link, fullDescription
    - [ ] Create Tag model with fields: name
    - [ ] Create ProjectImage model with fields: imageUrl, projectId
    - [ ] Create ProjectTag model (join table) with fields: projectId, tagId
  - Set up associations:
    - [ ] One-to-many between Project and ProjectImage
    - [ ] Many-to-many between Project and Tag (through ProjectTag)

- [ ] **Step 6: Site Settings Model**
  - Create SiteSettings model with fields:
    - [ ] General settings: siteName, authorName, siteIcon, email, showEmailInFooter
    - [ ] Appearance settings: theme, primaryColor, enableAnimations, fontFamily
    - [ ] SEO settings: metaDescription, keywords, enableSocialMetaTags, googleAnalyticsId
    - [ ] Feature toggles: enableBlog, enableProjects, enableContactForm, enableNewsletter, enableMvpBanner
    - [ ] Social media toggles and URLs: enableGithub, githubUrl, enableLinkedin, linkedinUrl, etc.

## Model Implementation Guidelines

1. **File Structure:** Create model files in the `src/models/` directory with appropriate names (e.g., `About.js`, `WorkExperience.js`)

2. **Model Definition:** Use Sequelize's `sequelize.define` or ES6 class syntax to define models

3. **Field Validation:** Implement appropriate validations for each field as defined in the migrations

4. **Associations:** Set up proper model associations in the `associate` method of each model

5. **Instance Methods:** Add any helpful instance methods for business logic

6. **Hooks:** Implement lifecycle hooks where needed (e.g., beforeCreate, afterUpdate)

## Progress Tracking

Mark tasks as completed by replacing `[ ]` with `[x]` as you progress through the implementation.
