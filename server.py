#!/usr/bin/env python

import cgi
import BaseHTTPServer,CGIHTTPServer

BaseHTTPServer.HTTPServer(( '127.0.0.1', 8080 ), CGIHTTPServer.CGIHTTPRequestHandler ).serve_forever()
