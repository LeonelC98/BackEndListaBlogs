const {test, describe, after, beforeEach} =require('node:test')
const mongoose = require('mongoose')
const supertest= require('supertest')
const assert = require('assert')
const app = require('../app')
const Blog =require('../models/blog')
const blog = require('../models/blog')


const api = supertest(app)
const inicialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {

    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,

  }  
]
  beforeEach(async()=>{
    await Blog.deleteMany({})
    const blogObjects = inicialBlogs.map(blog=> new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are return as json', async()=>{
      await api
      .get('/api/blogs')
      .expect('Content-Type',/application\/json/)
  })

  test('the correct amount of blogs is return',async()=>{

    const response = await api.get('/api/blogs')
    
    assert.strictEqual(response.body.length, inicialBlogs.length)
  })

  test('the blog id property exists',async()=>{
    
     const blogs = await Blog.find({});
    const blogsJSON = blogs.map(blog => blog.toJSON());

    for (const blog of blogsJSON) {
      assert.ok(blog.id, 'The blog must have id property')
      assert.strictEqual(typeof blog.id, 'string')
      assert.strictEqual(blog._id, undefined, 'Must not have _id property')
      assert.strictEqual(blog.__v, undefined, 'Must not have __v property')
    }
  })
  test('a new blog is added', async () => {
    const newBlog = {
          title: "React patterns",
          author: "Leonel",
          url: "https://reactpatterns.com/",
          likes: 7
        }
    const blog = new Blog(newBlog)
    await blog.save()


    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, inicialBlogs.length + 1)
  })
after(async()=>{
    await mongoose.connection.close()
})