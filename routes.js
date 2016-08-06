const Joi        = require('joi');
const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;
const createHash = require('./createhash');
const hashLen    = 8; /* 8 chars long */
// Local machine? Set baseUrl to 'http://localhost:3000'
// It's important that you don't add the slash at the end
// or else, it will conflict with one of the routes
const baseUrl    = 'http://your-domain.com';
const urlPattern = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

/* CREATING MONGOOSE SCHEMAS
 ================================================*/

const redirSchema = new Schema({
  shortUrl: String,
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
      const query = {
        'shortUrl': `${baseUrl}/${request.params.hash}`
      };
      
      Redir.findOne(query, (err, redir) => {
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
     const uniqueID = createHash(hashLen);
     const newRedir = new Redir({
       shortUrl: `${baseUrl}/${uniqueID}`,
       url: request.payload.url,
       createdAt: new Date()
     });
     
     newRedir.save((err, redir) => {
       if (err) { reply(err); } else { reply(redir); }
     });
   },
   config: {
     validate: {
       payload: {
         url: Joi.string().regex(urlPattern).required()
       }
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
