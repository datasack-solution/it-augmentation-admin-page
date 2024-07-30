export interface TechnologyItem {
    techName: string,
    quantity: number
}

export interface Subcategory {
    subcategory: string;
    items: TechnologyItem[];
}

export interface MainCategory {
    mainCategory: string;
    subcategories: Subcategory[];
}


export interface SkillSet {
    predefinedTechData: MainCategory[];
    customTechsData?: TechnologyItem[];
}

export interface ClientModel {
    industry: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    requirements: string;
    nda: boolean;
    skillsets?: SkillSet;
}

export interface ClientRecord extends ClientModel{
    city?:string,
    contactedChannel?:'Call'|'WhatsApp'|'VoiceMail'|'Email',
    responded?:boolean,
    isInterested?:boolean,
    remarks?:string
}

export const clientRecords: ClientRecord[] = [
    {
        industry: "Technology",
        name: "Rajesh",
        email: "Rajesh@gmail.com",
        phone: "123-456-7890",
        date: "2024-07-26",
        requirements: "Need a full-stack development team.",
        nda: true,
        skillsets: {
            predefinedTechData: [
                {
                    mainCategory: "Development Technologies",
                    subcategories: [
                        {
                            subcategory: "Web",
                            items: [
                                { techName: "HTML5", quantity: 5 },
                                { techName: "CSS3", quantity: 4 },
                                { techName: "JavaScript", quantity: 6 }
                            ]
                        }
                    ]
                }
            ],
            customTechsData: [
                { techName: "React", quantity: 3 },
                { techName: "Node.js", quantity: 2 }
            ]
        },
        city: "New York",
        contactedChannel: "Email",
        responded: true,
        isInterested: true,
        remarks: "Follow up next week."
    },
    {
        industry: "E-commerce",
        name: "Will Smith",
        email: "will.smith@gmail.com",
        phone: "987-654-3210",
        date: "2024-07-25",
        requirements: "Looking for a platform to launch a new online store.",
        nda: false,
        skillsets: {
            predefinedTechData: [
                {
                    mainCategory: "Business Solutions",
                    subcategories: [
                        {
                            subcategory: "eCommerce",
                            items: [
                                { techName: "Magento", quantity: 2 },
                                { techName: "Shopify", quantity: 1 },
                                { techName: "Magento1", quantity: 2 },
                                { techName: "Shopify1", quantity: 1 },
                                { techName: "Magento2", quantity: 2 },
                                { techName: "Shopify2", quantity: 1 },
                                { techName: "Magento3", quantity: 2 },
                                { techName: "Shopify3", quantity: 1 },
                            ]
                        },
                        {
                            subcategory: "Database",
                            items: [
                                { techName: "PostgreSQL", quantity: 2 },
                                { techName: "Sqlite3", quantity: 1 },
                                { techName: "PostgreSQL1", quantity: 2 },
                                { techName: "Sqlite31", quantity: 1 },
                                { techName: "PostgreSQL2", quantity: 2 },
                                { techName: "Sqlite32", quantity: 1 },
                                { techName: "PostgreSQL3", quantity: 2 },
                                { techName: "Sqlite33", quantity: 1 },
                            ]
                        },
                        {
                            subcategory: "Frontend",
                            items: [
                                { techName: "PostgreSQL", quantity: 2 },
                                { techName: "Sqlite3", quantity: 1 },
                                { techName: "PostgreSQL1", quantity: 2 },
                                { techName: "Sqlite31", quantity: 1 },
                                { techName: "PostgreSQL2", quantity: 2 },
                                { techName: "Sqlite32", quantity: 1 },
                                { techName: "PostgreSQL3", quantity: 2 },
                                { techName: "Sqlite33", quantity: 1 },
                            ]
                        }
                    ]
                },
                {
                    mainCategory: "Frontend Development",
                    subcategories: [
                        {
                            subcategory: "eCommerce",
                            items: [
                                { techName: "Magento", quantity: 2 },
                                { techName: "Shopify", quantity: 1 },
                                { techName: "Magento1", quantity: 2 },
                                { techName: "Shopify1", quantity: 1 },
                                { techName: "Magento2", quantity: 2 },
                                { techName: "Shopify2", quantity: 1 },
                                { techName: "Magento3", quantity: 2 },
                                { techName: "Shopify3", quantity: 1 },
                            ]
                        },
                        {
                            subcategory: "Database",
                            items: [
                                { techName: "PostgreSQL", quantity: 2 },
                                { techName: "Sqlite3", quantity: 1 },
                                { techName: "PostgreSQL1", quantity: 2 },
                                { techName: "Sqlite31", quantity: 1 },
                                { techName: "PostgreSQL2", quantity: 2 },
                                { techName: "Sqlite32", quantity: 1 },
                                { techName: "PostgreSQL3", quantity: 2 },
                                { techName: "Sqlite33", quantity: 1 },
                            ]
                        },
                        {
                            subcategory: "Frontend",
                            items: [
                                { techName: "PostgreSQL", quantity: 2 },
                                { techName: "Sqlite3", quantity: 1 },
                                { techName: "PostgreSQL1", quantity: 2 },
                                { techName: "Sqlite31", quantity: 1 },
                                { techName: "PostgreSQL2", quantity: 2 },
                                { techName: "Sqlite32", quantity: 1 },
                                { techName: "PostgreSQL3", quantity: 2 },
                                { techName: "Sqlite33", quantity: 1 },
                            ]
                        }
                    ]
                }
            ],
            customTechsData: []
        },
        city: "Los Angeles",
        contactedChannel: "Call",
        responded: false,
        isInterested: true,
        remarks: "Needs more information."
    },
    {
        industry: "Finance",
        name: "Jackie Chan",
        email: "jackie.chan@gmail.com",
        phone: "456-789-0123",
        date: "2024-07-24",
        requirements: "Require a system for managing client accounts.",
        nda: true,
        skillsets: {
            predefinedTechData: [
                {
                    mainCategory: "Data Management and Analytics",
                    subcategories: [
                        {
                            subcategory: "Database",
                            items: [
                                { techName: "SQL Server", quantity: 3 },
                                { techName: "MongoDB", quantity: 2 }
                            ]
                        }
                    ]
                }
            ],
            customTechsData: [
                { techName: "Python", quantity: 4 }
            ]
        },
        city: "Chicago",
        contactedChannel: "WhatsApp",
        responded: true,
        isInterested: false,
        remarks: "Not interested at this time."
    },
    {
        industry: "Healthcare",
        name: "Karthik",
        email: "karthik@yahoo.com",
        phone: "321-654-9870",
        date: "2024-07-23",
        requirements: "Need software for patient management.",
        nda: false,
        skillsets: {
            predefinedTechData: [
                {
                    mainCategory: "Quality Assurance and Project Management",
                    subcategories: [
                        {
                            subcategory: "Testing",
                            items: [
                                { techName: "Selenium", quantity: 3 },
                                { techName: "JUnit", quantity: 5 }
                            ]
                        }
                    ]
                }
            ],
            customTechsData: []
        },
        city: "Houston",
        contactedChannel: "Email",
        responded: true,
        isInterested: true,
        remarks: "Very interested in discussing further."
    },
    {
        industry: "Retail",
        name: "Mohamed Abdullah",
        email: "mohamed@hotmail.com",
        phone: "654-321-0987",
        date: "2024-07-22",
        requirements: "Looking for a mobile app solution for our store.",
        nda: true,
        skillsets: {
            predefinedTechData: [
                {
                    mainCategory: "Development Technologies",
                    subcategories: [
                        {
                            subcategory: "Mobile",
                            items: [
                                { techName: "Android", quantity: 2 },
                                { techName: "iOS", quantity: 1 }
                            ]
                        }
                    ]
                }
            ],
            customTechsData: [
                { techName: "Flutter", quantity: 3 }
            ]
        },
        city: "Phoenix",
        contactedChannel: "VoiceMail",
        responded: false,
        isInterested: true,
        remarks: "Awaiting a response."
    }
];
