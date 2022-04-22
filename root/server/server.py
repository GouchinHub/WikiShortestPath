#==========================================
# Title:  WSP app server
# Author: Aatu Laitinen
# Date:   22 April 2022
#==========================================

import json
from flask import Flask, request, Response
import shortestpathfinder

MIMETYPE = 'application/json'

app = Flask(__name__)


@app.route('/')
def index():
    return 'Index Page'

@app.route("/findpath", methods=['POST'])
def findpath():
    if request.method == 'POST':
        start_page_title = request.json['start'].strip().capitalize()
        end_page_title = request.json['end'].strip().capitalize()
        
        if(not start_page_title or not end_page_title):
            errorjson = {'error': 'Starting or ending page was missing'}
            return Response(response=json.dumps(errorjson), status=400, content_type=MIMETYPE)
        if(start_page_title == end_page_title):
            errorjson = {'error': 'Starting and ending page cannot be same'}
            return Response(response=json.dumps(errorjson), status=400, content_type=MIMETYPE)
        
        try:
            response = shortestpathfinder.execute_search(start_page_title, end_page_title)
            responsejson = json.loads(response)
            if(int(responsejson["status"]) == 200):
                return response
            else:
                errorjson = {'error': responsejson["error"]}
                return Response(response=json.dumps(errorjson), status=int(responsejson["status"]), content_type=MIMETYPE)
                
        except Exception:
            errorjson = {'error': 'Something went wrong'}
            return Response(response=json.dumps(errorjson), status=500, content_type=MIMETYPE)
    else:
        errorjson = {'error': 'Not found'}
        return Response(response=json.dumps(errorjson), status=404, content_type=MIMETYPE)

if __name__ == "__main__":
    app.run(threaded=True)
    
