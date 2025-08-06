// seeds/contentSeeder.js
const mongoose = require("mongoose");
const Content = require("../models/content.model");
const User = require("../models/user.model");
const dotenv=require("dotenv");
dotenv.config();

// Sample content data that matches your frontend structure
const contentData = [
  {
    title: "Getting Started with React",
    description: "A comprehensive guide for beginners to learn React fundamentals",
    type: "Article",
    status: "Published",
    category: "Web Development",
    tags: ["React", "JavaScript", "Frontend", "Tutorial"],
    content: `# Getting Started with React

React is a popular JavaScript library for building user interfaces. This comprehensive guide will walk you through the fundamentals of React development.

## What is React?

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".

## Key Concepts

1. **Components**: The building blocks of React applications
2. **JSX**: A syntax extension that allows you to write HTML-like code in JavaScript
3. **Props**: How you pass data between components
4. **State**: How you manage data that changes over time

## Getting Started

To create a new React application, you can use Create React App:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

This will set up a new React project with all the necessary dependencies and configuration.

## Your First Component

Here's a simple React component:

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

This component accepts a single "props" parameter and returns a React element.

## Conclusion

React is a powerful tool for building modern web applications. With its component-based architecture and rich ecosystem, it's an excellent choice for both beginners and experienced developers.`,
    views: 1250,
    likes: 89,
    shares: 23,
    comments: 15,
    featured: true,
    visibility: "public",
    metadata: {
      wordCount: 245,
      readTime: 2,
    },
    seo: {
      metaTitle: "Getting Started with React - Complete Beginner's Guide",
      metaDescription: "Learn React fundamentals with this comprehensive beginner's guide. Covers components, JSX, props, and state.",
      keywords: ["React", "JavaScript", "Tutorial", "Web Development", "Frontend"],
      slug: "getting-started-with-react",
    },
    analytics: {
      impressions: 2340,
      clicks: 1250,
      engagementRate: 7.2,
      bounceRate: 23.5,
      avgTimeSpent: 180,
    },
  },
  {
    title: "Advanced CSS Techniques",
    description: "Modern CSS features and best practices for responsive design",
    type: "Video",
    status: "Pending",
    category: "Web Development",
    tags: ["CSS", "Responsive Design", "Animation", "Grid", "Flexbox"],
    content: "Advanced CSS techniques video content covering modern layout methods, animations, and responsive design patterns.",
    views: 890,
    likes: 67,
    shares: 12,
    comments: 8,
    featured: false,
    visibility: "public",
    metadata: {
      duration: 1800, // 30 minutes
      fileSize: 157680000, // ~157MB
      thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
    },
    seo: {
      metaTitle: "Advanced CSS Techniques - Modern Web Design",
      metaDescription: "Master advanced CSS techniques including Grid, Flexbox, animations, and responsive design best practices.",
      keywords: ["CSS", "Grid", "Flexbox", "Animation", "Responsive"],
      slug: "advanced-css-techniques",
    },
    analytics: {
      impressions: 1890,
      clicks: 890,
      engagementRate: 9.8,
      bounceRate: 18.2,
      avgTimeSpent: 1080,
    },
  },
  {
    title: "JavaScript Best Practices",
    description: "Clean code principles for JavaScript developers",
    type: "Article",
    status: "Rejected",
    category: "Programming",
    tags: ["JavaScript", "Best Practices", "Clean Code", "ES6"],
    content: `# JavaScript Best Practices

Writing clean, maintainable JavaScript code is essential for any developer. Here are some key principles to follow.

## Code Organization

1. Use meaningful variable names
2. Keep functions small and focused
3. Avoid deep nesting
4. Use consistent indentation

## ES6+ Features

Take advantage of modern JavaScript features:

- Arrow functions
- Template literals
- Destructuring
- Modules
- Classes

## Error Handling

Always handle errors gracefully:

\`\`\`javascript
try {
  // risky operation
} catch (error) {
  console.error('Something went wrong:', error);
}
\`\`\``,
    views: 567,
    likes: 34,
    shares: 7,
    comments: 12,
    featured: false,
    visibility: "public",
    metadata: {
      wordCount: 156,
      readTime: 1,
    },
    seo: {
      metaTitle: "JavaScript Best Practices - Clean Code Guide",
      metaDescription: "Learn JavaScript best practices for writing clean, maintainable code. Covers ES6+ features and error handling.",
      keywords: ["JavaScript", "Best Practices", "Clean Code", "ES6"],
      slug: "javascript-best-practices",
    },
    analytics: {
      impressions: 1234,
      clicks: 567,
      engagementRate: 9.4,
      bounceRate: 31.2,
      avgTimeSpent: 95,
    },
  },
  {
    title: "Node.js Fundamentals",
    description: "Backend development with Node.js and Express",
    type: "Video",
    status: "Published",
    category: "Backend Development",
    tags: ["Node.js", "Express", "Backend", "API", "JavaScript"],
    content: "Comprehensive Node.js tutorial covering server setup, Express framework, middleware, routing, and API development.",
    views: 2145,
    likes: 156,
    shares: 43,
    comments: 28,
    featured: true,
    visibility: "public",
    metadata: {
      duration: 2700, // 45 minutes
      fileSize: 234567000, // ~234MB
      thumbnailUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=225&fit=crop",
    },
    seo: {
      metaTitle: "Node.js Fundamentals - Complete Backend Guide",
      metaDescription: "Master Node.js backend development with Express, middleware, routing, and API creation.",
      keywords: ["Node.js", "Express", "Backend", "API", "Server"],
      slug: "nodejs-fundamentals",
    },
    analytics: {
      impressions: 3456,
      clicks: 2145,
      engagementRate: 10.6,
      bounceRate: 15.8,
      avgTimeSpent: 1620,
    },
  },
  {
    title: "Database Design Patterns",
    description: "Scalable database architecture and design patterns",
    type: "Document",
    status: "Published",
    category: "Database",
    tags: ["Database", "SQL", "NoSQL", "Architecture", "Design Patterns"],
    content: "Comprehensive guide to database design patterns, normalization, indexing strategies, and scalability considerations for modern applications.",
    views: 934,
    likes: 78,
    shares: 19,
    comments: 11,
    featured: false,
    visibility: "public",
    metadata: {
      fileSize: 2456789, // ~2.4MB PDF
      fileName: "database-design-patterns.pdf",
      wordCount: 3456,
      readTime: 17,
    },
    seo: {
      metaTitle: "Database Design Patterns - Scalable Architecture Guide",
      metaDescription: "Learn database design patterns, normalization, and scalability strategies for modern applications.",
      keywords: ["Database", "Design Patterns", "SQL", "Architecture"],
      slug: "database-design-patterns",
    },
    analytics: {
      impressions: 1567,
      clicks: 934,
      engagementRate: 11.5,
      bounceRate: 22.3,
      avgTimeSpent: 420,
    },
  },
  {
    title: "API Development Guide",
    description: "RESTful API design and implementation best practices",
    type: "Article",
    status: "Pending",
    category: "Backend Development",
    tags: ["API", "REST", "HTTP", "Backend", "Web Services"],
    content: `# API Development Guide

Creating well-designed APIs is crucial for modern web development. This guide covers RESTful API design principles and implementation best practices.

## REST Principles

1. **Stateless**: Each request contains all information needed
2. **Resource-based**: URLs represent resources, not actions
3. **HTTP Methods**: Use appropriate methods (GET, POST, PUT, DELETE)
4. **Status Codes**: Return meaningful HTTP status codes

## URL Design

Good API URLs are:
- Intuitive and predictable
- Resource-oriented
- Consistent in naming

Examples:
- GET /api/users - Get all users
- GET /api/users/123 - Get specific user
- POST /api/users - Create new user
- PUT /api/users/123 - Update user
- DELETE /api/users/123 - Delete user

## Error Handling

Always return consistent error responses:

\`\`\`json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found",
    "details": {}
  }
}
\`\`\``,
    views: 678,
    likes: 45,
    shares: 8,
    comments: 6,
    featured: false,
    visibility: "public",
    metadata: {
      wordCount: 234,
      readTime: 2,
    },
    seo: {
      metaTitle: "API Development Guide - RESTful Design Best Practices",
      metaDescription: "Learn RESTful API design principles and implementation best practices for modern web development.",
      keywords: ["API", "REST", "HTTP", "Web Services", "Backend"],
      slug: "api-development-guide",
    },
    analytics: {
      impressions: 1123,
      clicks: 678,
      engagementRate: 8.7,
      bounceRate: 28.9,
      avgTimeSpent: 145,
    },
  },
  {
    title: "Mobile App Development",
    description: "Cross-platform mobile development with React Native",
    type: "Video",
    status: "Published",
    category: "Mobile Development",
    tags: ["React Native", "Mobile", "Cross-platform", "iOS", "Android"],
    content: "Complete React Native course covering navigation, state management, native modules, and app deployment to both iOS and Android platforms.",
    views: 1567,
    likes: 112,
    shares: 34,
    comments: 22,
    featured: true,
    visibility: "public",
    metadata: {
      duration: 3600, // 60 minutes
      fileSize: 345678000, // ~345MB
      thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=225&fit=crop",
    },
    seo: {
      metaTitle: "Mobile App Development - React Native Complete Course",
      metaDescription: "Master cross-platform mobile development with React Native. Build iOS and Android apps.",
      keywords: ["React Native", "Mobile", "Cross-platform", "iOS", "Android"],
      slug: "mobile-app-development",
    },
    analytics: {
      impressions: 2567,
      clicks: 1567,
      engagementRate: 10.8,
      bounceRate: 19.4,
      avgTimeSpent: 2160,
    },
  },
  {
    title: "DevOps Essentials",
    description: "Continuous integration and deployment best practices",
    type: "Document",
    status: "Rejected",
    category: "DevOps",
    tags: ["DevOps", "CI/CD", "Docker", "Kubernetes", "Automation"],
    content: "Comprehensive DevOps guide covering CI/CD pipelines, containerization with Docker, orchestration with Kubernetes, and infrastructure as code.",
    views: 445,
    likes: 23,
    shares: 5,
    comments: 3,
    featured: false,
    visibility: "public",
    metadata: {
      fileSize: 3456789, // ~3.4MB PDF
      fileName: "devops-essentials.pdf",
      wordCount: 4567,
      readTime: 23,
    },
    seo: {
      metaTitle: "DevOps Essentials - CI/CD and Automation Guide",
      metaDescription: "Learn DevOps best practices including CI/CD, Docker, Kubernetes, and infrastructure automation.",
      keywords: ["DevOps", "CI/CD", "Docker", "Kubernetes", "Automation"],
      slug: "devops-essentials",
    },
    analytics: {
      impressions: 789,
      clicks: 445,
      engagementRate: 7.0,
      bounceRate: 35.2,
      avgTimeSpent: 380,
    },
  },
  {
    title: "Machine Learning Basics",
    description: "Introduction to machine learning concepts and algorithms",
    type: "Article",
    status: "Published",
    category: "Data Science",
    tags: ["Machine Learning", "AI", "Python", "Data Science", "Algorithms"],
    content: `# Machine Learning Basics

Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed.

## Types of Machine Learning

### 1. Supervised Learning
- Uses labeled training data
- Examples: Classification, Regression
- Algorithms: Linear Regression, Decision Trees, SVM

### 2. Unsupervised Learning
- Finds patterns in unlabeled data
- Examples: Clustering, Dimensionality Reduction
- Algorithms: K-means, PCA, Hierarchical Clustering

### 3. Reinforcement Learning
- Learns through interaction with environment
- Uses rewards and penalties
- Examples: Game playing, Robotics

## Common Algorithms

**Linear Regression**: Predicts continuous values
**Logistic Regression**: Binary classification
**Decision Trees**: Rule-based decisions
**Random Forest**: Ensemble of decision trees
**K-means**: Clustering algorithm

## Getting Started

1. Learn Python programming
2. Understand statistics and probability
3. Practice with datasets
4. Use libraries like scikit-learn, pandas, numpy

## Tools and Libraries

- **Python**: Primary programming language
- **Scikit-learn**: Machine learning library
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Matplotlib**: Data visualization`,
    views: 1834,
    likes: 145,
    shares: 67,
    comments: 32,
    featured: true,
    visibility: "public",
    metadata: {
      wordCount: 267,
      readTime: 2,
    },
    seo: {
      metaTitle: "Machine Learning Basics - Complete Beginner's Guide",
      metaDescription: "Learn machine learning fundamentals, algorithms, and tools. Perfect introduction for beginners.",
      keywords: ["Machine Learning", "AI", "Python", "Data Science"],
      slug: "machine-learning-basics",
    },
    analytics: {
      impressions: 2945,
      clicks: 1834,
      engagementRate: 13.3,
      bounceRate: 16.7,
      avgTimeSpent: 195,
    },
  },
  {
    title: "Web Security Best Practices",
    description: "Essential security measures for web applications",
    type: "Article",
    status: "Draft",
    category: "Security",
    tags: ["Security", "Web Development", "HTTPS", "Authentication", "OWASP"],
    content: `# Web Security Best Practices

Security should be a top priority in web development. Here are essential practices to protect your applications and users.

## OWASP Top 10

1. **Injection Attacks** - SQL, NoSQL, OS injection
2. **Broken Authentication** - Session management flaws
3. **Sensitive Data Exposure** - Inadequate protection
4. **XML External Entities** - XXE attacks
5. **Broken Access Control** - Authorization failures

## Authentication & Authorization

### Strong Password Policies
- Minimum 8 characters
- Mix of letters, numbers, symbols
- Regular password updates
- Account lockout mechanisms

### Multi-Factor Authentication
- SMS codes
- Authenticator apps
- Hardware tokens
- Biometric verification

## Data Protection

### Encryption
- Use HTTPS everywhere
- Encrypt sensitive data at rest
- Secure key management
- TLS 1.3 minimum

### Input Validation
- Validate all user inputs
- Use parameterized queries
- Sanitize output
- Content Security Policy (CSP)

## Monitoring & Response

- Log security events
- Monitor for anomalies
- Incident response plan
- Regular security audits`,
    views: 123,
    likes: 8,
    shares: 2,
    comments: 1,
    featured: false,
    visibility: "public",
    metadata: {
      wordCount: 198,
      readTime: 1,
    },
    seo: {
      metaTitle: "Web Security Best Practices - Complete Security Guide",
      metaDescription: "Learn essential web security practices to protect your applications from common threats and vulnerabilities.",
      keywords: ["Web Security", "OWASP", "Authentication", "Encryption"],
      slug: "web-security-best-practices",
    },
    analytics: {
      impressions: 234,
      clicks: 123,
      engagementRate: 8.9,
      bounceRate: 42.3,
      avgTimeSpent: 87,
    },
  },
];

// Function to seed content data
const seedContent = async () => {
  try {
    console.log("🌱 Starting content seeding...");

    // Check if content already exists
    const existingContent = await Content.countDocuments();
    if (existingContent > 0) {
      console.log(`⚠️  Content already exists (${existingContent} items). Skipping seeding.`);
      return;
    }

    // Get all users to assign as content creators
    const users = await User.find({ status: "active" }).limit(10);
    
    if (users.length === 0) {
      console.log("❌ No users found. Please seed users first.");
      return;
    }

    console.log(`👥 Found ${users.length} users for content assignment`);

    // Assign random users to content and add timestamps
    const contentWithUsers = contentData.map((content, index) => {
      const randomUser = users[index % users.length];
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
      
      return {
        ...content,
        createdBy: randomUser._id,
        lastModifiedBy: randomUser._id,
        createdAt: createdDate,
        updatedAt: new Date(createdDate.getTime() + Math.random() * 24 * 60 * 60 * 1000), // Updated within 24 hours of creation
        publishedAt: content.status === "Published" ? createdDate : null,
      };
    });

    // Insert content
    const insertedContent = await Content.insertMany(contentWithUsers);
    console.log(`✅ Successfully seeded ${insertedContent.length} content items`);

    // Display summary
    const statusCounts = await Content.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const typeCounts = await Content.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("\n📊 Content Summary:");
    console.log("By Status:");
    statusCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });

    console.log("By Type:");
    typeCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });

    console.log("\n🎉 Content seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding content:", error);
    throw error;
  }
};

// Function to clear all content (for development/testing)
const clearContent = async () => {
  try {
    console.log("🗑️  Clearing all content...");
    const result = await Content.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} content items`);
  } catch (error) {
    console.error("❌ Error clearing content:", error);
    throw error;
  }
};

// Function to update existing content with new fields (for migrations)
const updateContentSchema = async () => {
  try {
    console.log("🔄 Updating content schema...");
    
    const contents = await Content.find({});
    
    for (const content of contents) {
      // Add missing analytics data
      if (!content.analytics || Object.keys(content.analytics).length === 0) {
        content.analytics = {
          impressions: content.views * (1.5 + Math.random()),
          clicks: content.views,
          engagementRate: ((content.likes + content.shares + content.comments) / content.views) * 100 || 0,
          bounceRate: 15 + Math.random() * 30,
          avgTimeSpent: 60 + Math.random() * 300,
        };
      }

      // Add missing SEO data
      if (!content.seo || !content.seo.slug) {
        content.seo = {
          ...content.seo,
          slug: content.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          metaTitle: content.title,
          metaDescription: content.description,
          keywords: content.tags || [],
        };
      }

      // Add missing metadata
      if (content.type === "Article" && content.content && !content.metadata.wordCount) {
        const wordCount = content.content.split(/\s+/).length;
        content.metadata.wordCount = wordCount;
        content.metadata.readTime = Math.ceil(wordCount / 200);
      }

      await content.save();
    }
    
    console.log(`✅ Updated ${contents.length} content items`);
  } catch (error) {
    console.error("❌ Error updating content schema:", error);
    throw error;
  }
};

// Export functions for use in scripts or direct execution
module.exports = {
  seedContent,
  clearContent,
  updateContentSchema,
  contentData,
};

// Auto-run if this file is executed directly
if (require.main === module) {
  const mongoose = require("mongoose");
  
  const runSeeder = async () => {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      console.log("📡 Connected to MongoDB");
      
      // Run seeding
      await seedContent();
      
      console.log("🏁 Seeding process completed");
      process.exit(0);
      
    } catch (error) {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    }
  };
  
  runSeeder();
}