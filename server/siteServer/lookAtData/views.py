from django.shortcuts import render
from dateutil.parser import parse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils.parseData import UserActivityAnalyzer
from .utils.recommendations import UserActivityLLMAnalyzer
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
    db_path = '/Users/glenn_hyh/Documents/github/WhyGetThis/server/siteServer/db.sqlite3'  # Replace with your actual database file path
    output_json_path = '/Users/glenn_hyh/Documents/github/WhyGetThis/server/user_activity_results.json'
    llm_output_json_path = '/Users/glenn_hyh/Documents/github/WhyGetThis/server/recommendation_results.json'

    analyzer = UserActivityAnalyzer(db_path)
    analyzer.save_results_to_json(output_json_path)
    analyzer.close_connection()

    with open(output_json_path, 'r') as f:
        data = json.load(f)

    categories = ["adults", "sports", "shopping", "gambling", "news", "social"]
    visiting_frequencies = [data['visiting_frequencies'].get(category, 0) for category in categories]
    total_active_time = [data['total_active_time'].get(category, 0) for category in categories]
    average_time = [data['average_staying_time'].get(category, 0) for category in categories]
    data_array = [categories, visiting_frequencies, total_active_time, average_time]

    llm_analyzer = UserActivityLLMAnalyzer(output_json_path)
    llm_analyzer.make_decision_and_save(llm_output_json_path)
    str_llm_recommendation = ""
    with open(llm_output_json_path, 'r') as f:
        llm_data = json.load(f)
        str_llm_recommendation = llm_data['recommendation']

    return render(request, "lookAtData/show_data.html", {"data": data_array, "message": str_llm_recommendation})