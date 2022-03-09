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

export interface Applicant {
    yearGraduated: string;
    courseTaken: string;
    schoolAttended: string;
    company: string;
    zipCode: string;
    province: string;
    city: string;
    barangay: string;
    unit: string;
    street: string;
    user: User;
    _id: string;
    category: string;
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

export interface SelectedType {
    name: string;
    _id: string;
    selectedItems: string[];
}

export interface Doc {
    _id: string;
    updatedAt: Date;
    createdAt: Date;
    assignedPersonnel?: any;
    applicant: Applicant;
    service: Service;
    paymentHistory: any[];
    approvalHistory: ApprovalHistory[];
    soa: Soa[];
    requirements: any[];
    selectedType: SelectedType[];
    paymentStatus: string;
    totalFee: number;
    status: string;
    __v: number;
    selectedTypes: SelectedType[];
    applicationType: string;
    isPinned: boolean;
    id: string;
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


