// export interface TechnologyItem {
//     techName: string,
//     quantity: number
// }

// export interface Subcategory {
//     subcategory: string;
//     items: TechnologyItem[];
// }

// export interface MainCategory {
//     mainCategory: string;
//     subcategories: Subcategory[];
// }


// export interface SkillSet {
//     predefinedTechData: MainCategory[];
//     customTechsData?: TechnologyItem[];
// }

// export interface ClientModel {
//     industry: string;
//     name: string;
//     email: string;
//     phone: string;
//     date: string;
//     requirements: string;
//     nda: boolean;
//     skillsets?: SkillSet;
// }


export interface TechnologyItem {
  tech: string;
  quantity: number;
}

export interface TransformedSkillsets {
  _id?:string,
  category: string;
  technologies: TechnologyItem[];
}

export interface SkillSet {
  _id?:string;
  skillset: TransformedSkillsets[];
}

export interface ClientModel {
  industry: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason?: string;
  nda: boolean;
  arrSkillsets?: SkillSet[];
  duration?: string;
}

export interface ClientModelForAdd {
  industry: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason?: string;
  nda: boolean;
  skillsets?: TransformedSkillsets[];
  duration?: string;
}


export interface ClientRecord extends ClientModel{
    city?:string,
    contactedChannel?:'Call'|'WhatsApp'|'VoiceMail'|'Email',
    responded?:boolean,
    isInterested?:boolean,
    remarks?:string
}

export interface ClientRecordForAdd extends ClientModelForAdd{
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
        reason: "Need a full-stack development team.",
        nda: true,
        arrSkillsets:[],
        city: "New York",
        contactedChannel: "Email",
        responded: true,
        isInterested: true,
        remarks: "Follow up next week.",
        time:'11:22',
        duration:'6 Months'
    },
    {
        industry: "E-commerce",
        name: "Will Smith",
        email: "will.smith@gmail.com",
        phone: "987-654-3210",
        date: "2024-07-25",
        reason: "Looking for a platform to launch a new online store.",
        nda: false,
        arrSkillsets: [],
        city: "Los Angeles",
        contactedChannel: "Call",
        responded: false,
        isInterested: true,
        remarks: "Needs more information.",
        time:'23:22',
        duration:'6 Months'
    },
];
