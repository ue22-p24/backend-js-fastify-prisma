async function booksRoute(fastify, options) {

  fastify.get('/', async (request, reply) => {
    const books = await fastify.prisma.book.findMany();
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

  fastify.get('/:id', { schema: getBookSchema }, async (request, reply) => {
    const id = request.params;
    if id < 0 || id > books.length {
      reply.code(400).send({ error: 'Book not found' });
    }
    const book = await fastify.prisma.book.findUnique({
      where: { id: id },
    });
    if (!book) {
      reply.code(404).send({ error: 'Book not found' });
    }
    reply.code(200)
    return book;
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
      reply.code(400).send({ error: 'Title is required' });
    }
    if (author.length == 0) {
      reply.code(400).send({ error: 'Author is required' });
    }
    const newBook = {
      id: books.length,
      title: title,
      author: author,
    };
    books.push(newBook);
    reply.code(201);
    return {title: title, author: author};
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
    const id = request.params.id;
    const new_title = request.params.title;
    const new_author = request.params.author;
    if (new_title.length == 0) {
      reply.code(400).send({ error: 'Title is required' });
    }
    if (new_author.length == 0) {
      reply.code(400).send({ error: 'Author is required' });
    }
    if id < 0 || id > books.length {
      reply.code(404).send({ error: 'Book not found' });
    }
    books[id].title = new_title;
    books[id].author = new_author;

    reply.code(201);
    return { title: new_title, author: new_author };
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
    const id = request.params.id;
    if id < 0 || id > books.length {
      reply.code(404).send({ error: 'Book not found' });
    }
    books.splice(id, 1);
    reply.code(204);
    
  });
}

export default booksRoute;