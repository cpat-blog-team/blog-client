const Delta = require('quill-delta');

interface BlogPostInterface {
	title: string;
	content: string;
	summary: string;
	name: string;
	updatedAt: string;
	_id: string;
	date: string;
	filename: string;
}

const exampleBlogPost: BlogPostInterface = {
	title: 'Im Pickle Rick!!!',
	content: JSON.stringify(new Delta([ { insert: 'Some content about Rick and Morty...' } ])),
	summary: 'Rick turns himself into a pickle.',
	name: 'Morty',
	updatedAt: 'Feb 5',
	_id: 'G3J4K56M7J',
	date: new Date().toDateString(),
	filename: '7821357235896034570'
};

const emptyBlogPost = (): BlogPostInterface => ({
	title: '',
	content: '',
	summary: '',
	name: '',
	updatedAt: '',
	_id: '',
	date: new Date().toDateString(),
	filename: ''
});

const exampleList = (numberOfPosts: number) => {
	const list: BlogPostInterface[] = [];

	for (let c = 0; c < numberOfPosts; c++) {
		list.push(exampleBlogPost);
	}

	return list;
};

export { exampleBlogPost, exampleList, BlogPostInterface, emptyBlogPost };
