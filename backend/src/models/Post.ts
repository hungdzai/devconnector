export default interface Post {
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
      user: string
      text: string
      name: string
      avatar: string
      date: string
    }
  ]
}
