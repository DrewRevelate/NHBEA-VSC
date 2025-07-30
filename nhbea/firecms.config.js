// FireCMS Configuration for NHBEA
// This configuration defines the data structure for your FireCMS instance
// Visit https://app.firecms.co/p/nhbea-64cab to manage your content

export const firecmsConfig = {
  // Project configuration
  projectId: "nhbea-64cab",
  
  // Collections definition  
  collections: {
    // Organizations Collection (NEW)
    organizations: {
      name: "Organizations",
      description: "Educational institutions and organizations",
      path: "organizations",
      properties: {
        name: {
          name: "Organization Name",
          dataType: "string",
          description: "Full name of the organization"
        },
        type: {
          name: "Organization Type",
          dataType: "string",
          description: "Type of organization",
          enumValues: {
            school: "School",
            college: "College", 
            university: "University",
            business: "Business",
            government: "Government",
            nonprofit: "Nonprofit",
            other: "Other"
          }
        },
        address: {
          name: "Address",
          dataType: "map",
          description: "Organization address",
          properties: {
            street: { dataType: "string", name: "Street" },
            city: { dataType: "string", name: "City" },
            state: { dataType: "string", name: "State" },
            zipCode: { dataType: "string", name: "ZIP Code" }
          }
        },
        contact: {
          name: "Contact Information", 
          dataType: "map",
          description: "Contact details",
          properties: {
            phone: { dataType: "string", name: "Phone" },
            email: { dataType: "string", name: "Email" },
            website: { dataType: "string", name: "Website", url: true }
          }
        },
        isActive: {
          name: "Active",
          dataType: "boolean",
          description: "Whether organization is currently active"
        },
        notes: {
          name: "Notes",
          dataType: "string",
          description: "Additional notes about the organization",
          multiline: true
        }
      }
    },

    // Members Collection (ENHANCED with nested structure)
    members: {
      name: "Members", 
      description: "Professional members with nested data structure",
      path: "members",
      properties: {
        personalInfo: {
          name: "Personal Information",
          dataType: "map",
          description: "Personal details",
          properties: {
            firstName: { dataType: "string", name: "First Name" },
            lastName: { dataType: "string", name: "Last Name" },
            phone: { dataType: "string", name: "Phone Number" },
            email: { dataType: "string", name: "Email Address" }
          }
        },
        organization: {
          name: "Organization Information",
          dataType: "map",
          description: "Professional organization details",
          properties: {
            address: { 
              dataType: "reference", 
              name: "Organization", 
              path: "organizations",
              description: "Reference to organization"
            },
            title: { dataType: "string", name: "Position/Title" }
          }
        },
        membership: {
          name: "Membership Information",
          dataType: "map",
          description: "Membership details and status",
          properties: {
            type: {
              dataType: "string",
              name: "Membership Type",
              enumValues: {
                individual: "Individual",
                student: "Student",
                retired: "Retired",
                honorary: "Honorary"
              }
            },
            membershipYear: { dataType: "string", name: "Membership Year" },
            status: {
              dataType: "string",
              name: "Status",
              enumValues: {
                active: "Active",
                inactive: "Inactive",
                suspended: "Suspended",
                expired: "Expired"
              }
            },
            renewalDate: { dataType: "timestamp", name: "Renewal Date" },
            autoRenewal: { dataType: "boolean", name: "Auto Renewal" },
            joinDate: { dataType: "timestamp", name: "Join Date" }
          }
        },
        profile: {
          name: "Profile Information",
          dataType: "map",
          description: "Member profile and roles",
          properties: {
            activeBoardMember: { 
              dataType: "boolean", 
              name: "Active Board Member",
              description: "Is this member currently on the board?"
            },
            boardPosition: {
              dataType: "string",
              name: "Board Position",
              enumValues: {
                "President": "President",
                "Vice President": "Vice President",
                "Secretary": "Secretary",
                "Treasurer": "Treasurer",
                "Board Member": "Board Member"
              }
            },
            boardOrder: { 
              dataType: "number", 
              name: "Board Display Order",
              description: "Display order for board members (1 = first)"
            },
            bio: { 
              dataType: "string", 
              name: "Biography",
              description: "Member biography for display purposes",
              multiline: true
            },
            isPastPresident: { 
              dataType: "boolean", 
              name: "Past President",
              description: "Is this member a past president?"
            },
            presidencyTerm: { 
              dataType: "string", 
              name: "Presidency Term",
              description: "Term served as president (e.g., '2022-2023')"
            },
            presidencyOrder: { 
              dataType: "number", 
              name: "Presidency Order",
              description: "Display order for past presidents (1 = most recent)"
            },
            isHallOfFame: { 
              dataType: "boolean", 
              name: "Hall of Fame Member",
              description: "Is this member in the Hall of Fame?"
            },
            hallOfFameYear: { 
              dataType: "number", 
              name: "Hall of Fame Year",
              description: "Year inducted into Hall of Fame"
            },
            hallOfFameAwardType: {
              dataType: "string",
              name: "Hall of Fame Award Type",
              enumValues: {
                "business_educator_of_the_year": "Business Educator of the Year",
                "lifetime_achievement": "Lifetime Achievement",
                "other": "Other"
              }
            },
            hallOfFameOrder: { 
              dataType: "number", 
              name: "Hall of Fame Display Order"
            },
            achievements: {
              dataType: "array",
              name: "Achievements",
              description: "List of achievements and awards",
              of: { dataType: "string" }
            }
          }
        },
        preferences: {
          name: "Communication Preferences",
          dataType: "map",
          description: "Member preferences",
          properties: {
            emailNotifications: { dataType: "boolean", name: "Email Notifications" },
            directoryListing: { dataType: "boolean", name: "Directory Listing" },
            newsletterSubscription: { dataType: "boolean", name: "Newsletter Subscription" }
          }
        },
        metadata: {
          name: "Metadata",
          dataType: "map",
          description: "System metadata",
          properties: {
            updatedAt: { dataType: "timestamp", name: "Updated At" },
            createdAt: { dataType: "timestamp", name: "Created At" },
            createdBy: { dataType: "string", name: "Created By" }
          }
        }
      }
    },

    // Conference Collection (ENHANCED)
    conference: {
      name: "Conferences",
      description: "Conference events with virtual support",
      path: "conference", 
      properties: {
        title: {
          name: "Conference Title",
          dataType: "string",
          description: "Conference name/title"
        },
        theme: {
          name: "Theme",
          dataType: "string",
          description: "Conference theme (optional)"
        },
        description: {
          name: "Description",
          dataType: "string",
          description: "Conference description",
          multiline: true
        },
        startDate: {
          name: "Start Date",
          dataType: "timestamp",
          description: "Conference start date and time"
        },
        endDate: {
          name: "End Date", 
          dataType: "timestamp",
          description: "Conference end date and time"
        },
        timezone: {
          name: "Timezone",
          dataType: "string",
          description: "Conference timezone (e.g., America/New_York)"
        },
        isVirtual: {
          name: "Virtual Conference",
          dataType: "boolean",
          description: "Is this a virtual conference?"
        },
        virtualUrl: {
          name: "Virtual Conference URL",
          dataType: "string", 
          description: "URL for virtual conference (required if virtual)",
          url: true
        },
        venue: {
          name: "Venue Information",
          dataType: "map",
          description: "Physical venue details",
          properties: {
            name: { dataType: "string", name: "Venue Name" },
            address: { dataType: "string", name: "Address" },
            city: { dataType: "string", name: "City" },
            state: { dataType: "string", name: "State" },
            zipCode: { dataType: "string", name: "ZIP Code" },
            directions: { dataType: "string", name: "Directions" }
          }
        },
        registrationFee: {
          name: "Registration Fee",
          dataType: "number",
          description: "Registration fee amount"
        },
        currency: {
          name: "Currency",
          dataType: "string", 
          description: "Currency code (e.g., USD)"
        },
        maxCapacity: {
          name: "Maximum Capacity",
          dataType: "number",
          description: "Maximum number of attendees"
        },
        registrationDeadline: {
          name: "Registration Deadline",
          dataType: "timestamp",
          description: "Last date for registration"
        },
        isRegistrationOpen: {
          name: "Registration Open",
          dataType: "boolean",
          description: "Is registration currently open?"
        },
        isActive: {
          name: "Active",
          dataType: "boolean", 
          description: "Is this conference currently active?"
        },
        notes: {
          name: "Notes",
          dataType: "string",
          description: "Additional conference notes",
          multiline: true
        }
      }
    },

    // Conference Registrants Collection (ENHANCED)
    registrants: {
      name: "Conference Registrants",
      description: "Conference registrations with enhanced participant data", 
      path: "registrants",
      properties: {
        conferenceId: {
          name: "Conference",
          dataType: "string",
          description: "Conference ID reference"
        },
        participantInfo: {
          name: "Participant Information",
          dataType: "map",
          description: "Participant details",
          properties: {
            fullName: { dataType: "string", name: "Full Name" },
            email: { dataType: "string", name: "Email" },
            phone: { dataType: "string", name: "Phone" },
            institution: { dataType: "string", name: "Institution" },
            jobTitle: { dataType: "string", name: "Job Title" },
            membershipId: { dataType: "string", name: "Membership ID" },
            membershipStatus: { 
              dataType: "string", 
              name: "Membership Status",
              enumValues: {
                member: "Member",
                "non-member": "Non-Member",
                student: "Student"
              }
            }
          }
        },
        registrationType: {
          name: "Registration Type",
          dataType: "string",
          description: "Type of registration",
          enumValues: {
            regular: "Regular",
            early_bird: "Early Bird",
            student: "Student",
            speaker: "Speaker"
          }
        },
        addressInfo: {
          name: "Address Information",
          dataType: "map",
          description: "Participant address",
          properties: {
            street: { dataType: "string", name: "Street Address" },
            city: { dataType: "string", name: "City" },
            state: { dataType: "string", name: "State" },
            zipCode: { dataType: "string", name: "ZIP Code" }
          }
        },
        emergencyContact: {
          name: "Emergency Contact",
          dataType: "map",
          description: "Emergency contact information",
          properties: {
            name: { dataType: "string", name: "Name" },
            phone: { dataType: "string", name: "Phone" },
            relationship: { dataType: "string", name: "Relationship" }
          }
        },
        dietaryRestrictions: {
          name: "Dietary Restrictions",
          dataType: "string",
          description: "Any dietary restrictions or preferences"
        },
        accessibilityNeeds: {
          name: "Accessibility Needs", 
          dataType: "string",
          description: "Any accessibility accommodation needs"
        },
        sessionPreferences: {
          name: "Session Preferences",
          dataType: "array",
          description: "Preferred sessions",
          of: {
            dataType: "string"
          }
        },
        networkingOptIn: {
          name: "Networking Opt-In",
          dataType: "boolean",
          description: "Opted in for networking opportunities"
        },
        marketingConsent: {
          name: "Marketing Consent",
          dataType: "boolean",
          description: "Consented to marketing communications"
        },
        agreeToTerms: {
          name: "Agreed to Terms",
          dataType: "boolean",
          description: "Agreed to terms and conditions"
        },
        status: {
          name: "Status",
          dataType: "string",
          description: "Registration status",
          enumValues: {
            pending: "Pending",
            confirmed: "Confirmed",
            cancelled: "Cancelled"
          }
        },
        paymentStatus: {
          name: "Payment Status",
          dataType: "string",
          description: "Payment status",
          enumValues: {
            pending: "Pending",
            paid: "Paid",
            refunded: "Refunded"
          }
        },
        submissionDate: {
          name: "Submission Date",
          dataType: "timestamp",
          description: "When the registration was submitted"
        }
      }
    },
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
    },

    // Awards Collection
    awards: {
      name: "Awards",
      description: "Awards and recognition programs",
      path: "awards",
      properties: {
        name: {
          name: "Award Name",
          dataType: "string",
          description: "Name of the award"
        },
        icon: {
          name: "Award Icon",
          dataType: "string",
          description: "Icon identifier for the award (optional)"
        },
        description: {
          name: "Description",
          dataType: "string",
          description: "Detailed description of the award",
          multiline: true
        },
        eligibility: {
          name: "Eligibility Requirements",
          dataType: "string",
          description: "Requirements and criteria for eligibility",
          multiline: true
        },
        deadline: {
          name: "Application Deadline",
          dataType: "timestamp",
          description: "Deadline for award nominations/applications"
        },
        category: {
          name: "Award Category",
          dataType: "string",
          description: "Category of the award",
          enumValues: {
            Excellence: "Excellence in Education",
            Lifetime: "Lifetime Achievement",
            Innovation: "Innovation in Teaching",
            Service: "Service to Community"
          }
        },
        isActive: {
          name: "Active",
          dataType: "boolean",
          description: "Whether this award is currently active",
          defaultValue: true
        },
        createdAt: {
          name: "Created At",
          dataType: "timestamp",
          description: "When this award was created",
          autoValue: "on_create"
        },
        updatedAt: {
          name: "Updated At", 
          dataType: "timestamp",
          description: "When this award was last updated",
          autoValue: "on_update"
        }
      }
    },

    // Award Nominations Collection
    nominations: {
      name: "Award Nominations",
      description: "Nominations submitted for awards",
      path: "nominations",
      properties: {
        awardId: {
          name: "Award",
          dataType: "reference",
          description: "Reference to the award being nominated for",
          path: "awards"
        },
        nomineeInfo: {
          name: "Nominee Information",
          dataType: "map",
          description: "Information about the nominee",
          properties: {
            name: { dataType: "string", name: "Full Name" },
            email: { dataType: "string", name: "Email Address" },
            organization: { dataType: "string", name: "Organization" },
            position: { dataType: "string", name: "Position/Title" }
          }
        },
        nominatorInfo: {
          name: "Nominator Information",
          dataType: "map",
          description: "Information about the person making the nomination",
          properties: {
            name: { dataType: "string", name: "Full Name" },
            email: { dataType: "string", name: "Email Address" },
            memberId: { dataType: "reference", name: "Member ID", path: "members" }
          }
        },
        awardCategory: {
          name: "Award Category",
          dataType: "string",
          description: "Category of the award being nominated for"
        },
        nominationText: {
          name: "Nomination Statement",
          dataType: "string",
          description: "Statement explaining why the nominee deserves this award",
          multiline: true
        },
        supportingDocuments: {
          name: "Supporting Documents",
          dataType: "array",
          description: "URLs to supporting documents",
          of: { dataType: "string" }
        },
        submissionDate: {
          name: "Submission Date",
          dataType: "timestamp",
          description: "When this nomination was submitted",
          autoValue: "on_create"
        },
        status: {
          name: "Review Status",
          dataType: "string",
          description: "Current status of the nomination",
          enumValues: {
            pending: "Pending Review",
            under_review: "Under Review",
            approved: "Approved",
            rejected: "Rejected"
          },
          defaultValue: "pending"
        },
        reviewNotes: {
          name: "Review Notes",
          dataType: "string",
          description: "Internal notes about the review process",
          multiline: true
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