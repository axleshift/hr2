export interface Certification {
    name: string;
    year: string;
}

export interface ApplicantData {
    firstname?: string;
    middlename?: string | null;
    lastname?: string;
    email?: string;
    phone?: string;
    address?: string;
    portfolioURL?: string | null;
    professionalSummary?: string;
    skills?: string;
    workExperience?: string;
    education?: string;
    certifications?: Certification[];
    tags?: string[];
    remarks?: string | null;
    resumeFileLoc?: string;
}

export interface ApplicantDocument extends ApplicantData {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateData {
    [key: string]: string | string[] | undefined;
    resumeFileLoc?: string;
}
