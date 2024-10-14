import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

const Indexpage = () => {
  const [posts,setPosts] = useState([])
  useEffect(()=>{
    fetch("http://localhost:3000/posts").then(response => {
      response.json().then(posts => {
        setPosts(posts)
      })
    })
  },[])
  return (
    <div>
       {posts.length>0 && posts.map(post => (
        <Post {...post} key={post._id}/>
       ))}
    </div>
  )
}

export default Indexpage