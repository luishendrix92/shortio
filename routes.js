const Joi          = require('joi');
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const randomString = require('./createhash');
const hashLen  = 8; /* 8 chars long */

/* CREATING MONGOOSE SCHEMAS
 =====================================================================*/

const redirSchema = new Schema({
  hash: String,
  url: String,
  createdAt: Date
});

const Redir = mongoose.model('Redir', redirSchema);

/* EXPORTING THE ROUTES
 =====================================================================*/
 
module.exports = [
  {
    method: 'GET',
    path:'/{hash}',
    handler(request, reply) {
      Redir.findOne({ 'hash': request.params.hash }, (err, redir) => {
        if (err) { return reply(err); }
        else if (redir) { reply().redirect(redir.url); }
        else { reply.file('views/404.html').code(404); }
      });
    }
  },
  {
    method: 'POST',
    path: '/new',
    handler(request, reply) {
      const newRedir = new Redir({
        hash: randomString(hashLen),
        url: request.payload.url,
        createdAt: new Date()
      });
      
      newRedir.save((err, redir) => {
        if (err) { reply(err); } else { reply(redir); }
      });
    },
    config: {
      validate: {
        payload: { url: Joi.string().regex(/^http?:\/\//).required() }
      }
    }
  },
  {
    method: 'GET',
    path: '/',
    handler(request, reply) {
      reply.file('views/index.html');
    }
  },
  {
    method: 'GET',
    path: '/public/{file}',
    handler(request, reply) {
      reply.file('public/' + request.params.file);
    }
  }
];
