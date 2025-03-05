/**
 * Seeder script to create sample blog posts and categories
 */
'use strict';

module.exports = {
  // Apply seeder
  up: async (queryInterface, Sequelize) => {
    // Check if blog posts exist before creating samples
    const blogPosts = await queryInterface.sequelize.query(
      'SELECT id FROM BlogPosts LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Check if blog categories exist before creating samples
    const blogCategories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // Only proceed if no blog posts and categories exist
    if (blogPosts.length === 0 && blogCategories.length === 0) {
      // Find admin user for authorship
      const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE role = "admin" LIMIT 1;',
        { type: Sequelize.QueryTypes.SELECT }
      );
      
      let authorId = null;
      if (users.length > 0) {
        authorId = users[0].id;
        console.log(`Found admin user with id: ${authorId}`);
      } else {
        console.log('No admin user found. Using null for authorId.');
      }
      
      // Create blog categories first
      await queryInterface.bulkInsert('Categories', [
        {
          name: 'Web Development',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'UI/UX Design',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Programming',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Career Advice',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Project Management',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      console.log('Sample blog categories created successfully');
      
      // Create blog posts
      await queryInterface.bulkInsert('BlogPosts', [
        {
          title: 'Getting Started with React Hooks',
          excerpt: 'An introduction to React Hooks, including useState and useEffect with practical examples for beginners.',
          content: `# Getting Started with React Hooks

React Hooks have revolutionized how we build React components. This post will guide you through the basics of using hooks in your React applications.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 to allow you to use state and other React features without writing a class.

## The useState Hook

The most basic Hook is useState, which allows you to add state to function components:

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  // Declare a state variable called "count" with initial value 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## The useEffect Hook

The useEffect Hook lets you perform side effects in function components. It replaces lifecycle methods like componentDidMount, componentDidUpdate, and componentWillUnmount:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    // Update the document title using the browser API
    document.title = \`You clicked \${count} times\`;
    
    // Return a cleanup function (similar to componentWillUnmount)
    return () => {
      document.title = 'React App';
    };
  }, [count]); // Only re-run if count changes

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Custom Hooks

You can also create your own Hooks to reuse stateful logic between different components:

\`\`\`jsx
import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return width;
}

// Using the custom hook in a component
function MyComponent() {
  const width = useWindowWidth();
  return <div>Window width: {width}</div>;
}
\`\`\`

## Conclusion

React Hooks provide a powerful way to use state and side effects in function components. They allow for better code organization, reuse of stateful logic, and can make your components more concise and easier to understand.

In future posts, we'll explore more advanced hooks like useContext, useReducer, and useMemo.`,
          date: new Date(new Date().setDate(new Date().getDate() - 60)),
          imageUrl: '/assets/images/blog/react-hooks.jpg',
          authorId: authorId,
          categoryId: 1, // Web Development
          createdAt: new Date(new Date().setDate(new Date().getDate() - 60)),
          updatedAt: new Date(new Date().setDate(new Date().getDate() - 60))
        },
        {
          title: 'Designing Better User Interfaces',
          excerpt: 'Principles and practices for creating effective, user-friendly interfaces with a focus on clarity, consistency, and accessibility.',
          content: `# Designing Better User Interfaces

Creating effective user interfaces is crucial for the success of any digital product. In this post, we'll explore principles and practices that can help you design better UIs.

## Clarity is Key

The most important characteristic of a good UI is clarity. Users should never have to guess how to use your interface. Some ways to achieve clarity:

- Use familiar patterns and conventions
- Make interactive elements look interactive
- Provide clear, concise labels
- Use hierarchy to indicate importance

## Consistency Matters

Consistency in UI design helps users form mental models about how your interface works. When elements behave consistently, users can apply what they've learned across the interface.

Maintain consistency in:

- Visual design (colors, typography, spacing)
- Interactions (how buttons, menus, and other elements behave)
- Language and terminology
- Layout across similar screens or components

## Accessibility is Not Optional

Designing for accessibility benefits all users, not just those with disabilities. Key accessibility considerations include:

- Sufficient color contrast
- Keyboard navigability
- Support for screen readers
- Text scaling
- Focus indicators

\`\`\`css
/* Example of focus styles that don't rely solely on color */
.button:focus {
  outline: 2px solid #4A90E2;
  box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.3);
}
\`\`\`

## Feedback and Responsiveness

Users need to know that their actions have been registered and understood. Good feedback includes:

- Visual changes when elements are hovered or focused
- Loaders or progress indicators for processes that take time
- Clear success and error messages
- Animations that reinforce interactions

## Simplicity Over Complexity

As designers, we should aim to make interfaces as simple as possible (but no simpler):

- Eliminate unnecessary elements
- Break complex tasks into simpler steps
- Hide advanced options unless needed
- Use progressive disclosure to reveal information gradually

## Testing with Real Users

No matter how experienced you are as a designer, there's no substitute for testing your designs with real users:

- Conduct usability testing with representative users
- Observe how people use your interface
- Ask open-ended questions
- Iterate based on feedback

## Conclusion

Designing better user interfaces is an ongoing process of learning, testing, and refinement. By focusing on clarity, consistency, accessibility, feedback, and simplicity—and testing your designs with real users—you can create interfaces that not only look good but work well for the people who use them.`,
          date: new Date(new Date().setDate(new Date().getDate() - 45)),
          imageUrl: '/assets/images/blog/ui-design.jpg',
          authorId: authorId,
          categoryId: 2, // UI/UX Design
          createdAt: new Date(new Date().setDate(new Date().getDate() - 45)),
          updatedAt: new Date(new Date().setDate(new Date().getDate() - 45))
        },
        {
          title: 'Understanding TypeScript Generics',
          excerpt: 'A comprehensive guide to TypeScript generics, covering basic usage, constraints, and practical examples for real-world applications.',
          content: `# Understanding TypeScript Generics

TypeScript generics are a powerful feature that enables you to create reusable components that work with a variety of types rather than a single one. Let's explore how to use them effectively.

## The Basics of Generics

At their core, generics allow you to write code that can work with different types while maintaining type safety:

\`\`\`typescript
// A simple generic function
function identity<T>(arg: T): T {
  return arg;
}

// Usage
const num = identity<number>(42); // Type of num is number
const str = identity<string>("hello"); // Type of str is string
// TypeScript can also infer the type
const bool = identity(true); // Type of bool is boolean
\`\`\`

## Generic Interfaces

You can also create generic interfaces:

\`\`\`typescript
interface Box<T> {
  contents: T;
}

// Usage
const numberBox: Box<number> = { contents: 42 };
const stringBox: Box<string> = { contents: "hello" };
\`\`\`

## Generic Classes

Similarly, classes can be generic:

\`\`\`typescript
class Queue<T> {
  private data: T[] = [];
  
  push(item: T): void {
    this.data.push(item);
  }
  
  pop(): T | undefined {
    return this.data.shift();
  }
}

// Usage
const numberQueue = new Queue<number>();
numberQueue.push(10);
numberQueue.push(20);
const item = numberQueue.pop(); // Type is number | undefined
\`\`\`

## Constraints on Type Parameters

Sometimes you want to restrict the types that can be used with your generic:

\`\`\`typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // OK - we know arg has a .length property
  return arg;
}

// Usage
logLength("hello"); // Works because strings have a length property
logLength([1, 2, 3]); // Works because arrays have a length property
// logLength(42); // Error - numbers don't have a length property
\`\`\`

## Using Multiple Type Parameters

Generics can use multiple type parameters:

\`\`\`typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// Usage
const p = pair<string, number>("hello", 42); // Type is [string, number]
\`\`\`

## Generic Type Inference

TypeScript can often infer generic types, making your code cleaner:

\`\`\`typescript
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}

// No need to specify types - TypeScript infers them
const numbers = [1, 2, 3];
const strings = map(numbers, n => n.toString()); // Type of strings is string[]
\`\`\`

## Real-World Example: API Client

Here's a more practical example - a generic API client:

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return await response.json() as ApiResponse<T>;
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

// TypeScript knows this returns Promise<ApiResponse<User>>
const userResponse = await fetchData<User>('/api/users/1');
// So we can safely use:
console.log(userResponse.data.name);
\`\`\`

## Conclusion

Generics are one of TypeScript's most powerful features, enabling you to write flexible, reusable code while maintaining type safety. While they may seem complicated at first, mastering generics will significantly improve your TypeScript code quality and developer experience.`,
          date: new Date(new Date().setDate(new Date().getDate() - 30)),
          imageUrl: '/assets/images/blog/typescript-generics.jpg',
          authorId: authorId,
          categoryId: 3, // Programming
          createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
          updatedAt: new Date(new Date().setDate(new Date().getDate() - 30))
        },
        {
          title: 'Navigating Your First Developer Job',
          excerpt: 'Essential advice for junior developers starting their first professional role, covering expectations, technical growth, and maintaining work-life balance.',
          content: `# Navigating Your First Developer Job

Starting your first job as a software developer can be both exciting and overwhelming. This guide aims to help new developers transition smoothly into their professional roles.

## The First Few Weeks

### Set Realistic Expectations

Don't expect to be immediately productive or understand the entire codebase. Most companies understand that there's a learning curve for new developers:

- Focus on learning rather than proving yourself
- Ask questions (but try to research first)
- Keep notes on everything you learn
- Celebrate small victories

### Understand the Development Environment

Every company has its own development setup and workflow:

- Get comfortable with the version control system (usually Git)
- Learn the deployment process
- Understand the testing strategy
- Familiarize yourself with code review practices

### Build Relationships

Your colleagues are your best resources:

- Introduce yourself to team members
- Find a mentor (formal or informal)
- Participate in team activities
- Be humble and open to feedback

## Technical Growth

### Start with Small Tasks

Begin with smaller, well-defined tasks to build confidence:

- Bug fixes are good starting points
- Documentation improvements
- Minor feature enhancements
- Test writing or improvements

### Read the Codebase

Spend time just reading and understanding the existing code:

- Follow the execution flow of key features
- Understand architectural patterns used
- Look at how experienced developers solve problems
- Run the application and correlate behaviors with code

### Embrace Code Reviews

Code reviews are valuable learning opportunities:

- Don't take feedback personally
- Ask questions about suggested changes
- Study the reviewers' approach
- Apply what you learn to future work

## Communication Skills

### Ask Good Questions

Knowing how to ask effective questions is crucial:

- Do your research first
- Be specific about what you've tried
- Provide context for your question
- Format your questions clearly

### Document What You Learn

Create your own knowledge base:

- Keep notes on commands, processes, and explanations
- Document solutions to problems you solve
- Share your documentation when appropriate

### Learn to Estimate Work

Estimating is hard for everyone, but especially beginners:

- Break tasks into smaller components
- Consider testing and integration time, not just coding
- Add buffer time for unexpected challenges
- Be honest when you're unsure

## Work-Life Balance

### Avoid Burnout Early

It's easy to overwork yourself when trying to prove your worth:

- Stick to regular working hours
- Take your breaks and vacations
- Have interests outside of coding
- Recognize the signs of burnout

### Continuous Learning

Balance on-the-job learning with personal development:

- Set aside time for learning new technologies
- Follow industry blogs and podcasts
- Consider side projects (if you have energy)
- Attend meetups or conferences

## Conclusion

Your first developer job is just the beginning of a long journey. Focus on learning, building relationships, and growing steadily rather than trying to know everything at once. Remember that everyone—even the most senior developers—started exactly where you are now.

With patience, persistence, and a positive attitude, you'll soon find yourself becoming a valuable contributor to your team and building the foundation for a successful career in software development.`,
          date: new Date(new Date().setDate(new Date().getDate() - 15)),
          imageUrl: '/assets/images/blog/first-dev-job.jpg',
          authorId: authorId,
          categoryId: 4, // Career Advice
          createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
          updatedAt: new Date(new Date().setDate(new Date().getDate() - 15))
        },
        {
          title: 'Implementing Agile in Small Development Teams',
          excerpt: 'Practical strategies for small development teams to implement Agile methodologies effectively, with adaptations for team size and limited resources.',
          content: `# Implementing Agile in Small Development Teams

Agile methodologies have become the standard for software development, but implementing them in small teams requires adaptation. This guide explores how to effectively implement Agile principles in teams of 2-10 developers.

## The Challenges of Small Team Agile

Small teams face unique challenges when implementing Agile:

- Fewer people to fill specialized roles (Scrum Master, Product Owner)
- Limited bandwidth for ceremonies and documentation
- Individual absences have higher impact
- Cross-functional skills may be limited

However, small teams also have advantages:

- Communication is simpler and more direct
- Changes can be implemented more quickly
- Less coordination overhead
- Stronger team cohesion

## Adapting Agile Ceremonies

### Daily Standups

Keep them short and focused:

- Stick to the 15-minute timeframe
- Address the classic three questions: What did you do yesterday? What will you do today? Any blockers?
- Consider reducing frequency to 2-3 times per week if daily feels excessive

### Sprint Planning

Simplify but don't skip:

- Keep planning sessions under 2 hours
- Focus on the most critical user stories
- Be realistic about capacity with a small team
- Consider 2-week sprints to balance planning overhead with flexibility

### Retrospectives

Make them count:

- Keep them to 30-45 minutes
- Use a simple format (e.g., What went well? What could be improved?)
- Ensure each retrospective leads to 1-2 actionable changes
- Consider bi-weekly or monthly retrospectives instead of after every sprint

### Sprint Reviews

Make them efficient:

- Invite stakeholders but keep the demo focused
- Prepare in advance to avoid technical issues
- Allocate 30-45 minutes
- Document feedback clearly for follow-up

## Tools and Processes for Small Teams

### Lightweight Project Management

Avoid tool overhead:

- Consider simpler tools like Trello or GitHub Projects instead of heavyweight ALM tools
- Focus on visualization over comprehensive reporting
- Ensure tools serve the team, not vice versa

### Documentation

Be pragmatic:

- Document architectural decisions and key processes
- Use lightweight formats (e.g., Markdown in version control)
- Focus on "just enough" documentation
- Update regularly as part of the development process

### Quality Assurance

Embed quality in the process:

- Implement automated testing as a non-negotiable practice
- Consider pair programming for complex features
- Use code reviews consistently
- Create a Definition of Done that includes quality criteria

## Role Flexibility

In small teams, rigid roles can be counterproductive:

### Shared Leadership

- Rotate facilitation responsibilities
- Allow technical leads to also contribute as developers
- Share product ownership responsibilities if no dedicated product owner exists

### T-Shaped Skills

Encourage team members to develop:

- Deep expertise in one area (the vertical bar of the T)
- Working knowledge in multiple areas (the horizontal bar)
- This increases team resilience when someone is unavailable

## Communication Practices

Small teams need effective communication more than formal processes:

### Information Radiators

Use visual indicators to share status:

- Physical or digital Kanban boards
- Burndown/burnup charts
- Visible project calendars
- Dashboards for key metrics

### Decision Making

Establish clear processes:

- Decide which decisions need consensus vs. which can be made individually
- Document important decisions with context
- Revisit decisions when new information emerges

## Conclusion

Implementing Agile in small teams is less about following frameworks rigidly and more about embracing the underlying principles:

- Individuals and interactions over processes and tools
- Working software over comprehensive documentation
- Customer collaboration over contract negotiation
- Responding to change over following a plan

By adapting Agile practices to fit your team size and context, you can maintain agility and deliver value consistently without unnecessary overhead. The key is to keep what works, modify what doesn't, and always focus on delivering value to your customers.`,
          date: new Date(new Date().setDate(new Date().getDate() - 7)),
          imageUrl: '/assets/images/blog/agile-small-teams.jpg',
          authorId: authorId,
          categoryId: 5, // Project Management
          createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
          updatedAt: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      ]);
      
      console.log('Sample blog posts created successfully');
    } else {
      console.log('Skipping blog creation - posts or categories already exist');
    }
  },

  // Revert seeder
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('BlogPosts', {}, {});
    await queryInterface.bulkDelete('Categories', {}, {});
  }
}; 