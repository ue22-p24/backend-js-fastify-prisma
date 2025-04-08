
const books = [];

async function booksMemoryRoute(fastify, options) {

  fastify.get('/', async (request, reply) => {;
    reply.code(200);
    return books;
  });

  const getBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  };

  fastify.get('/:id', { schema: getBookSchema }, async (request, reply) => {;
    reply.code(200);
    return(books[request.params.id]);
  });

  const createBookSchema = {
    body: {
      type: 'object',
      required: ['title', 'author'],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
      },
    },
  };

  fastify.post('/', { schema: createBookSchema }, async (request, reply) => {
    const [title, author] = request.params;
    if (title.length == 0) {
      reply.code(400);
      return { error: "Title is required" };
    }
    if (author.lenght == 0) {
      reply.code(400);
      return { error: "Author is required" };
    }
    const newBook = {
      id: books.length,
      title: title,
      author: author,
    };
    books.push(newBook);
    reply.code(201)
    return newBook;
  });

  const updateBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
    body: {
      type: 'object',
      required: ['title', 'author'],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
      },
    },
  };

  fastify.put('/:id', { schema: updateBookSchema }, async (request, reply) => {
    const[new_title, new_author] = request.params;
    if (new_title.length == 0) {
      reply.code(400);
      return { error: "Title is required" };
    }
    if (new_author.length == 0) {
      reply.code(400);
      return { error: "Author is required" };
    }
    if (request.params.id < 0 || request.params.id >= books.length) {
      reply.code(404);
      return { error: "Book not found" };
    }
    const newBook = {
      title: new_title,
      author: new_author,
    };
    books[request.params.id].title = new_title;
    books[request.params.id].author = new_author;
    reply.code(200);
    return books[request.params.id];

  });

  const deleteBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  };
  fastify.delete('/:id', { schema: deleteBookSchema }, async (request, reply) => {
    const bookId = request.params;
    if (bookId < 0 || bookId >= books.length) {
      reply.code(404);
      return { error: "Book not found" };
    }
    books.splice(bookId, 1);
    reply.code(204);
  });
}

export default booksMemoryRoute;