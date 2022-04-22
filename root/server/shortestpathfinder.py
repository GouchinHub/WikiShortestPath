#==========================================
# Title:  WSP app shortestpathfinder
# Author: Aatu Laitinen
# Date:   22 April 2022
#==========================================

import os
import time
import json
import requests
import concurrent.futures
import threading
import traceback
import re
from collections import deque

threads_with_found_path = [] # Global so all workers have access to it

API_URL = "https://en.wikipedia.org/w/api.php"
WIKI_URL = "https://en.wikipedia.org/wiki/"
TWO_MINUTES = 120


#Main method which the server can use
def execute_search(path_start, path_end):
    global threads_with_found_path
    
    try:
        if(not is_wikipedia_page_valid(path_start)):
            return json.dumps({"status": "500", "error": "Start page is not found"})
        if(not is_wikipedia_page_valid(path_end)):
            return json.dumps({"status": "500", "error": "End page is not found"})
        
        print(f'Searching path from {path_start} to {path_end}')
        search_start_time = time.time()
        
                
        shortest_paths = search_for_shortest_paths(path_start, path_end)

        threads_with_found_path.remove(threading.get_ident())
        
        search_end_time = time.time()
        
        execution_time_in_seconds = str("{:.2f}".format((search_end_time - search_start_time) % 60))
        response = json.dumps({"status": "200", "execution_time_in_seconds": execution_time_in_seconds, "shortest_paths": shortest_paths})
        
        print(response)
        return response

    except Exception:
        traceback.print_exc()
        return json.dumps({"status": "500", "error": "Failed to find a path"})

    
    
def is_wikipedia_page_valid(title):
	try:
		response = requests.get(WIKI_URL + title)
		if response.status_code == 404:
			return False
		return True
	except Exception:
		traceback.print_exc()
		return False



def search_for_shortest_paths(path_start, path_end):
    global threads_with_found_path
    
    paths = {}
    paths[path_start] = [path_start]
    pages_being_processed = {}
    shortest_paths = []
    
    DEQUE_OF_PAGES_TO_VISIT = deque([path_start])

    #Use a pool of workers to concurrently execute searches
    while not (threading.get_ident() in threads_with_found_path):
        with concurrent.futures.ThreadPoolExecutor(max_workers=os.cpu_count()) as pool:
        
            while DEQUE_OF_PAGES_TO_VISIT:
                if not (threading.get_ident() in threads_with_found_path):
                    next_page_in_queue = DEQUE_OF_PAGES_TO_VISIT.popleft()
                    
                    #Add new worker to pool
                    pages_being_processed[pool.submit(query_links_from_wikipedia_api, next_page_in_queue, threading.get_ident())] = next_page_in_queue
                    
            for processed_page in concurrent.futures.as_completed(pages_being_processed):
                try:
                    links_in_page = processed_page.result(timeout=TWO_MINUTES)
    
                    if links_in_page == -1:
                        break
                    
                    page = pages_being_processed[processed_page]
                    
                    #remove page from worker pool
                    pages_being_processed.pop(processed_page)
                    
                    for link in links_in_page: 
                        if link == path_end:
                            paths[link] = paths[page] + [link]
                            shortest_paths.append(paths[page] + [path_end])
                            if(not threading.get_ident() in threads_with_found_path):
                                threads_with_found_path.append(threading.get_ident())
                
                        #Add new page to be queried
                        if (link not in paths) and (link != page):
                            paths[link] = paths[page] + [link]
                            DEQUE_OF_PAGES_TO_VISIT.append(link)

                except Exception:
                    pass 
    
    return shortest_paths
        


def query_links_from_wikipedia_api(title, path):
    global threads_with_found_path
    try:
        titles_that_are_excluded = "Category:|Template:|Template talk:|Wikipedia:|Book:|Portal:|Help:|File:|MediaWiki:|MediaWiki talk|User talk:|Wikipedia talk:|Draft:|User:|Talk:|Module:"
        links_in_page = []

        if(path in threads_with_found_path):
            return links_in_page
        
        URL_PARAMETERS = {
            "action": "query",
            "format": "json",
            "prop": "links",
            "pllimit": "max",
            "titles": title
        }

        session = requests.Session()
        wiki_response = session.get(url=API_URL, params=URL_PARAMETERS)

        response_data = wiki_response.json()
        pages = response_data["query"]["pages"]
        if not pages: return links_in_page
        
        for page_id, item in pages.items():
            for link in item["links"]:
                if not re.search(titles_that_are_excluded, link["title"]):
                    links_in_page.append((link["title"]))
        
        #handle pages with more than 500 links
        while("continue" in response_data):
            URL_PARAMETERS["plcontinue"] = response_data["continue"]["plcontinue"]

            wiki_response = session.get(url=API_URL, params=URL_PARAMETERS)
            response_data = wiki_response.json()
            pages = response_data["query"]["pages"]
            for page_id, item in pages.items():
                for link in item["links"]:
                    if not re.search(titles_that_are_excluded, link["title"]):
                        links_in_page.append((link["title"]))
                
        return links_in_page
    
    #Return empty list if worker fails to get links from page
    except Exception:
        return [] 
