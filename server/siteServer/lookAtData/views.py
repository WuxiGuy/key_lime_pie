from django.shortcuts import render
from dateutil.parser import parse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# from .tools.parseData import UserActivityAnalyzer
import json

# Create your views here.
from django.http import HttpResponse
from .models import UserActions  # Import the missing model class
from django.template import loader

# Dealing with HTTP requests from the client
@csrf_exempt
def post_data(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))  # Decode the request body and parse the JSON data
        new_history = UserActions.objects.create(
            hostUrl=data['hostUrl'],
            pageUrl=data['pageUrl'],
            startTime=parse(data['startTime']), 
            endTime=parse(data['endTime']),
            activeTime=data['activeTime'],
            webType=data['type']
        )
        return JsonResponse({'id': new_history.id})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def index(request):
    UserAction = UserActions.objects.all()
    template = loader.get_template("lookAtData/index.html")
    context = {
        "user_actions": UserAction,
    }
    return HttpResponse(template.render(context, request))

@csrf_exempt
def show_data(request):
#     db_path = '../../db.sqlite3'
#     output_json_path = '../../user_activity_results.json'
    
#     analyzer = UserActivityAnalyzer(db_path)
#     analyzer.save_results_to_json(output_json_path)

#     with open(output_json_path, 'r') as f:
#         data = json.load(f)

#     categories = ["Adults", "Sports", "Shopping", "Gambling", "News", "Social"]
#     visiting_frequencies = [data['visiting_frequencies'].get(category, 0) for category in categories]
#     total_active_time = [data['total_active_time'].get(category, 0) for category in categories]
#     average_time = [t/f if f != 0 else 0 for t, f in zip(total_active_time, visiting_frequencies)]

#     data_array = [categories, visiting_frequencies, total_active_time, average_time]

    if request.method == "GET":
        # pop up a tab to show the result("127.0,0,1:8000/show_data/")
        # return JsonResponse(data)
        # return HttpResponse("hello")
        return render(request, "lookAtData/show_data.html")