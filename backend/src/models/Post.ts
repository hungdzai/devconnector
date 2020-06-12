export default interface Post {
  id: string
  date: string
  user: string
  text: string
  name: string
  avatar: string
  likes: [
    {
      user: string
    }
  ]
  comments: [
    {
      id: string
      user: string
      text: string
      name: string
      avatar: string
      date: string
    }
  ]
}
