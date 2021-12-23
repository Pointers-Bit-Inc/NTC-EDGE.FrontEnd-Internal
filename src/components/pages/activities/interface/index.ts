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
    dateOfBirth: string;
    firstName: string;
    gender: string;
    lastName: string;
    middleName: string;
    role: Role;
}

export interface Applicant {
    __v: number;
    _id: string;
    barangay: Barangay;
    category: string;
    city: City;
    courseTaken: string;
    createdAt: Date;
    province: Province;
    schoolAttended: string;
    street: string;
    unit: string;
    updatedAt: Date;
    user: User;
    yearGraduated: string;
    zipCode: string;
}



export interface ActivityDetails {
    applicant: Applicant;
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
