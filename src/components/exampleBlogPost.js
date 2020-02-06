const exampleBlogPost = {
  title: 'Im Pickle Rick!!!',
  content: 'I turned myself into a pickle Morty!!!',
  summary: 'Rick turns himself into a pickle.',
  username: 'Morty',
  date: 'Feb 5'
}

const exampleList = (numberOfPosts) => {
  const list = [];

  for (let c = 0; c < numberOfPosts; c++) {
    list.push(exampleBlogPost);
  }
  
  return list;
}

export { exampleBlogPost, exampleList }