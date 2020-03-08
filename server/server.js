//import http from 'http';
const http = require('http');
//import fs from 'fs';
const fs = require('fs');
//import url from 'url';
const url = require('url');
//import path from 'path';
const path = require('path');

function requestHandler(request, response) {
	let requestedResource = path.join(
		__dirname, // where this file resides
		'../public', //one step out to a directory called 'public'
		url.parse(request.url).pathname
	);
	
	// note how important usage of the fs module is
	fs.exists(requestedResource, function(exists){
		if(!exists) {
			response.writeHead(404, {"Content-Type":"text/plain"});
			response.write("404 not found\n");
			response.end();
			return;
		}
		
		if (fs.statSync(requestedResource).isDirectory()) { //statSync asks for info about a resource
			requestedResource += '/index.html'; //append index.html
		}
		
		fs.readFile(
			requestedResource,
			"binary",
			function(err, file) {
				if (err) {
					response.writeHead(500, {"Content-Type" : "text/plain"});
					response.write(err + "\n");
					response.end();
					return;
				}
				
				//something to do with types
				const contentTypesByExtension = {
					'.html': "text/html",
					'.css': "text/css",
					'.js': "text/javascript"
				};
				
				const headers = {};
				const contentType = contentTypesByExtension[path.extname(requestedResource)];
				
				if (contentType) {
					headers["Content-Type"] = contentType;
				}
				
				response.writeHead(200, headers);
				response.write(file,"binary");
				response.end();
			}
		);
	});
}

const server = http.createServer(requestHandler);
const portNumber = 3030;
server.listen(portNumber, function () {
	console.log('Server listening on port ',portNumber); //diff
});