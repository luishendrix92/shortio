const Joi        = require('joi');
const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const createHash = require('./createhash');
const hashLen    = 8; /* 8 chars long */
const baseUrl    = process.env.BASE_URL || 'http://your-domain.com';
const urlPattern = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

/* CREATING MONGOOSE SCHEMAS
============================================*/
const redirSchema = new Schema({
  shortUrl: String,
  url: String,
  createdAt: Date
});

const Redir = mongoose.model('Redir', redirSchema);

/* EXPORTING THE ROUTES
============================================*/
module.exports = [
  {
    method: 'GET',
    path:'/{hash}',
    handler: async function(request, reply) {
      const query = {
        'shortUrl': `${baseUrl}/${request.params.hash}`
      };

      try {
        const redir = await Redir.findOne(query).exec();

        return redir
          ? reply.redirect(redir.url)
          : reply.file('views/404.html').code(404);
      } catch (err) {
        return reply.response(err).code(500);
      }
    }
  },
  {
   method: 'POST',
   path: '/new',
   handler: async function(request, reply) {
     const uniqueID = createHash(hashLen);
     const newRedir = new Redir({
       shortUrl: `${baseUrl}/${uniqueID}`,
       url: request.payload.url,
       createdAt: new Date()
     });     

     try {
       const redir = await newRedir.save();

       return reply.response(redir).code(201);
     } catch (err) {
       return reply.response(err).code(500);
     }
   },
   options: {
     validate: {
       payload: Joi.object({
         url: Joi.string().regex(urlPattern).required()
       })
     }
   }
  },
  {
    method: 'GET',
    path: '/',
    handler: function(_request, reply) {
      return reply.file('views/index.html');
    }
  },
  {
    method: 'GET',
    path: '/public/{file}',
    handler: function (request, reply) {
      return reply.file('public/' + request.params.file);
    }
  }
];
