export default interface Profile {
  user: string
  company: string
  website: string
  location: string
  status: string
  skills: string
  bio: string
  githubusername: string
  experience: [
    {
      title: string
      company: string
      location: string
      from: string
      to: string
      current: boolean
      description: string
    }
  ]
  education: [
    {
      school: string
      degree: string
      fieldofstudy: string
      from: string
      to: string
      current: boolean
      description: string
    }
  ]
  social: {
    youtube: string
    twitter: string
    facebook: string
    linkedin: string
    instagram: string
  }
  date: string
}
