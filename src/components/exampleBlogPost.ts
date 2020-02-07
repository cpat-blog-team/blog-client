interface BlogPostInterface {
  title: string,
  content: string,
  summary: string,
  username: string,
  date: string
}

const exampleBlogPost: BlogPostInterface = {
  title: 'Im Pickle Rick!!!',
  content: 'I turned myself into a pickle Morty!!!',
  summary: 'Rick turns himself into a pickle.',
  username: 'Morty',
  date: 'Feb 5'
}

const exampleList = (numberOfPosts: number) => {
  const list: BlogPostInterface[] = [];

  for (let c = 0; c < numberOfPosts; c++) {
    list.push(exampleBlogPost);
  }

  return list;
}


export { exampleBlogPost, exampleList, BlogPostInterface}