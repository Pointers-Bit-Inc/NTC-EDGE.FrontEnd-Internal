




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
    key: string;
    name: string;
}

export interface User {
    _id: string;
    contactNumber: string;
    dateOfBirth: Date;
    email: string;
    firstName: string;
    gender: string;
    lastName: string;
    middleName: string;
    nationality: string;
    role: Role;
}

export interface Applicant {
    _id: string;
    barangay: Barangay;
    category: string;
    city: City;
    courseTaken: string;
    province: Province;
    schoolAttended: string;
    street: string;
    unit: string;
    user: User;
    yearGraduated: string;
    zipCode: string;
}

export interface Requirement {
    _id: string;
    name: string;
    path: string;
}

export interface SelectedType {
    _id: string;
    name: string;
    selectedItems: string[];
}

export interface Service {
    _id: string;
    name: string;
    revisionDate: Date;
    revisionNumber: string;
    serviceCode: string;
}

export interface Soa {
    _id: string;
    amount: number;
    item: string;
}

export interface Application {
    _id: string;
    applicant: Applicant;
    applicationType: string;
    paymentStatus: string;
    requirements: Requirement[];
    selectedTypes: SelectedType[];
    service: Service;
    soa: Soa[];
    status: string;
    totalFee: number;
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