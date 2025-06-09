import { Profile, Project, Experience, Education, Certification, ContactInfo, ProjectStatus, SocialLink } from '../../shared/models';

export const mockProfile: Profile = {
  name: 'Victor Ahdeen Ami',
  title: 'Node.js & Angular Developer',
  bio: 'A passionate Node.js & Angular developer specializing in full-stack web application development.'
};


export const mockExperiences: Experience[] = [
  {
    company: 'Company 1',
    role: 'Software Engineer',
    startDate: '2021-01-01',
    endDate: '2022-01-01',
    responsibilities: ['Description of experience 1']
  }
];

export const mockCompletedProjects: Project[] = [
  {
    title: 'Project Title 1',
    status: ProjectStatus.Completed,
    description: 'Short description of the project and technologies used.',
    technologies: [],
    imageUrl: '',
    projectUrl: '',
    viewLink: '#',
    githubLink: '#'
  },
  {
    title: 'Project Title 2',
    status: ProjectStatus.Completed,
    description: 'Short description of the project and technologies used.',
    technologies: [],
    imageUrl: '',
    projectUrl: '',
    viewLink: '#',
    githubLink: '#'
  },
  {
    title: 'Project Title 3',
    status: ProjectStatus.Completed,
    description: 'Short description of the project and technologies used.',
    technologies: [],
    imageUrl: '',
    projectUrl: '',
    viewLink: '#',
    githubLink: '#'
  }
];

export const mockProjectsInProgress: Project[] = [
  {
    title: 'Ongoing Project 1',
    status: ProjectStatus.Active,
    description: 'Description of the ongoing project and current status.',
    technologies: [],
    imageUrl: '',
    projectUrl: '',
    inProgress: true,
    progress: 75,
    githubLink: '#'
  },
  {
    title: 'Ongoing Project 2',
    status: ProjectStatus.Active,
    description: 'Description of the ongoing project and current status.',
    technologies: [],
    imageUrl: '',
    projectUrl: '',
    inProgress: true,
    progress: 45,
    githubLink: '#'
  }
];

export const mockEducations: Education[] = [
  {
    institution: 'University 1',
    degree: 'Bacheloro of Science',
    fieldOfStudy: 'Computer Science',
    startDate: '2016-09-01',
    endDate: '2020-01-01'
  }
];

export const mockCertifications: Certification[] = [
  {
    name: 'Certification 1',
    issuer: 'Organization 1',
    date: '2020-01-01'
  }
];

export const mockContactInfo: ContactInfo = {
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  linkedin: '',
  github: ''
};