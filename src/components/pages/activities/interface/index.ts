export interface Barangay {
    _id: string;
    name: string;
}

export interface City {
    _id: string;
    name: string;
}

export interface Province {
    _id: string;
    name: string;
}


export interface Role {
    _id: string;
    name: string;
    key: string;
}

export interface User {
    nationality: string;
    middleName: string;
    gender: string;
    dateOfBirth: Date;
    contactNumber: string;
    lastName: string;
    firstName: string;
    email: string;
    role: Role;
    _id: string;
}

export interface RadioType {
    value: string;
    selected: string;
    label: string;
}

export interface Service {
    _id: string;
    name: string;
    radioType: RadioType;
}

export interface ApprovalHistory {
    time: Date;
    action: string;
    status: string;
    _id: string;
}

export interface Soa {
    item: string;
    _id: string;
    amount: number;
}

export interface Doc {
    _id: string;
    applicant: Applicant;
    service: Service;
    status: string;
    paymentStatus?: any;
    paymentMethod?: any;
    totalFee: number;
    assignedPersonnel: AssignedPersonnel;
    soa?: any;
    approvalHistory: ApprovalHistory[];
    paymentHistory: PaymentHistory[];
    exam?: any;
    ORNumber?: any;
    createdAt: Date;
    updatedAt: Date;
}

export interface Application {
    page: number;
    size: number;
    total: number;
    docs: Doc[];
}

export interface ActivityDetails {
    application: Application;
    applicationType: string;
    dateTime: Date;
    description: string;
    status: string;
    subject: string;
}

export interface Activities {
    __v: number;
    _id: string;
    activityDetails: ActivityDetails;
    activityType: string;
    createdAt: Date;
    isPinned: boolean;
    updatedAt: Date;
}

export interface UserApplication {
    _id: string
    updatedAt: string
    createdAt: string
    username: string
    role: Role
    email: string
    firstName: string
    lastName: string
    password: string
    contactNumber: string
    __v: number
    address: string
    profilePicture: ProfilePicture
    avatar: string
}


export interface ProfilePicture {
    xlarge: string
    large: string
    medium: string
    small: string
    thumb: string
    original: string
}


export interface Contact {
    contactNumber: string;
    email: string;
}

export interface DateOfBirth {
    day: string;
    month: string;
    year: string;
}

export interface Education {
    schoolAttended: string;
    courseTaken: string;
    yearGraduated: string;
}

export interface Applicant {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    nationality: string;
    sex: string;
    birthDate?: any;
    contact: Contact;
    dateOfBirth: DateOfBirth;
    education: Education;
}

export interface Requirement {
    key: string;
    title: string;
    links: any;
}

export interface ApplicationType {
    label: string;
    element: string;
    requirements: Requirement[];
}

export interface Service {
    _id: string;
    name: string;
    serviceCode: string;
    applicationType: ApplicationType;
}

export interface AssignedPersonnel {
    _id: string;
    firstName: string;
    lastName: string;
    middleName?: any;
    email: string;
}

export interface ApprovalHistory {
    time: Date;
    action: string;
    userId: string;
    status: string;
}

export interface PaymentHistory {
    time: Date;
    action: string;
    userId: string;
    status: string;
}
