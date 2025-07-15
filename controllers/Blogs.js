const blogsRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')

blogsRouter.get('/',async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async(request,response)=>{
const blog = await Blog.findById(request.params.id)
if(blog){
  response.json(blog)
}else{
  response.status(404).end()
}
})

blogsRouter.post('/', async(request, response) => {
  const blog = new Blog(request.body)
  const saveBlog = await blog.save()
  response.status(201).json(saveBlog)

})

blogsRouter.put('/:id', async(request,response)=>{
  const blog={
    title: request.body.title,
    autor: request.body.autor,
    url: request.body.url,
    likes: request.body.likes
  }
  const updateBlog = await Blog.findByIdAndUpdate(request.params.id,blog,{new:true})
  response.json(updateBlog)
})

blogsRouter.delete('/:id', async(request,response)=> {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter