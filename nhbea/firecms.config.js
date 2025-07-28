// FireCMS Configuration for NHBEA
// This configuration defines the data structure for your FireCMS instance
// Visit https://app.firecms.co/p/nhbea-64cab to manage your content

export const firecmsConfig = {
  // Project configuration
  projectId: "nhbea-64cab",
  
  // Collections definition
  collections: {
    // Homepage Content Collection
    content: {
      name: "Homepage Content",
      description: "Main content for homepage sections",
      path: "content",
      properties: {
        heroTitle: {
          name: "Hero Title",
          dataType: "string",
          description: "Main headline for the hero section"
        },
        heroSubtitle: {
          name: "Hero Subtitle", 
          dataType: "string",
          description: "Subtitle text for the hero section"
        },
        heroImageURL: {
          name: "Hero Image URL",
          dataType: "string",
          description: "URL for hero background image (optional)",
          url: true
        },
        missionTitle: {
          name: "Mission Title",
          dataType: "string",
          description: "Title for the mission section"
        },
        missionContent: {
          name: "Mission Content",
          dataType: "string",
          description: "Mission statement content",
          multiline: true
        },
        aboutTitle: {
          name: "About Title",
          dataType: "string", 
          description: "Title for the about section"
        },
        aboutContent: {
          name: "About Content",
          dataType: "string",
          description: "About section content",
          multiline: true
        }
      }
    },

    // Board Members Collection
    boardMembers: {
      name: "Board Members",
      description: "Current board members information",
      path: "boardMembers",
      properties: {
        name: {
          name: "Full Name",
          dataType: "string",
          description: "Board member's full name"
        },
        title: {
          name: "Position Title",
          dataType: "string",
          description: "Board position (e.g., President, Vice President)"
        },
        bio: {
          name: "Biography",
          dataType: "string", 
          description: "Short biography of the board member",
          multiline: true
        },
        imageURL: {
          name: "Profile Photo URL",
          dataType: "string",
          description: "URL to profile photo (optional)",
          url: true
        },
        order: {
          name: "Display Order",
          dataType: "number",
          description: "Order for displaying on website (1 = first)"
        }
      }
    },

    // Past Presidents Collection  
    pastPresidents: {
      name: "Past Presidents",
      description: "Historical list of past presidents",
      path: "pastPresidents", 
      properties: {
        name: {
          name: "Full Name",
          dataType: "string",
          description: "Past president's full name"
        },
        term: {
          name: "Term Served",
          dataType: "string",
          description: "Term dates (e.g., '2022-2023')"
        },
        order: {
          name: "Display Order", 
          dataType: "number",
          description: "Order for chronological display (1 = most recent)"
        }
      }
    },

    // Sponsors Collection
    sponsors: {
      name: "Sponsors",
      description: "Organization sponsors and partners",
      path: "sponsors",
      properties: {
        name: {
          name: "Organization Name", 
          dataType: "string",
          description: "Sponsor organization name"
        },
        logoURL: {
          name: "Logo URL",
          dataType: "string",
          description: "URL to sponsor logo image",
          url: true
        },
        website: {
          name: "Website URL",
          dataType: "string", 
          description: "Sponsor's website URL",
          url: true
        },
        order: {
          name: "Display Order",
          dataType: "number",
          description: "Order for displaying on website (1 = first)"
        }
      }
    }
  }
};

// Sample data for initial setup
export const sampleData = {
  content: {
    id: "homepage",
    heroTitle: "New Hampshire Business Educators Association", 
    heroSubtitle: "Empowering educators, inspiring students, and strengthening business education across New Hampshire",
    missionTitle: "Our Mission",
    missionContent: "NHBEA is dedicated to promoting excellence in business education through professional development, networking, and advocacy for business educators and students throughout New Hampshire.",
    aboutTitle: "About NHBEA", 
    aboutContent: "The New Hampshire Business Educators Association serves as the premier professional organization for business educators in the state. We provide resources, support, and opportunities for growth to help our members deliver exceptional business education to their students."
  },
  
  boardMembers: [
    {
      name: "Sarah Johnson",
      title: "President", 
      bio: "Sarah has been an advocate for business education for over 15 years, bringing innovative teaching methods to the classroom.",
      order: 1
    },
    {
      name: "Michael Chen",
      title: "Vice President",
      bio: "Michael specializes in entrepreneurship education and has helped launch numerous student business ventures.", 
      order: 2
    },
    {
      name: "Jennifer Rodriguez", 
      title: "Secretary",
      bio: "Jennifer focuses on curriculum development and has authored several business education textbooks.",
      order: 3
    },
    {
      name: "David Thompson",
      title: "Treasurer",
      bio: "David brings financial expertise and has been instrumental in securing funding for educational programs.",
      order: 4
    }
  ],

  pastPresidents: [
    {
      name: "Robert Williams",
      term: "2022-2023", 
      order: 1
    },
    {
      name: "Maria Garcia",
      term: "2021-2022",
      order: 2  
    },
    {
      name: "James Smith",
      term: "2020-2021",
      order: 3
    },
    {
      name: "Patricia Davis", 
      term: "2019-2020",
      order: 4
    },
    {
      name: "Christopher Brown",
      term: "2018-2019", 
      order: 5
    }
  ]
};