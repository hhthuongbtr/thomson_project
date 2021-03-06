from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect, Http404, HttpResponse 
from rest_framework import status
from setting.get_thomson_api import *
from accounts.user_info import *
from django.contrib.auth.decorators import login_required
from utils import DatabaseWorkflow as WorkflowDB

# Create your views here.

#######################################################################
#                                                                     #
#------------------------------WORKFLOW-------------------------------#
#                                                                     #
#######################################################################

@require_http_methods(['GET'])
@csrf_exempt
@login_required() # login required
def workflow_json(request, thomson_name):
    # workflow_list = Workflow().get_workflow()
    workflow_list = WorkflowDB().json_all_workflow(thomson_name)
    return HttpResponse(workflow_list, content_type='application/json', status=200)

def get_workflow(request, thomson_name):
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/accounts/login')
    user = user_info(request)
    return render_to_response('workflow/'+thomson_name+'.html', user)

#######################################################################
#                                                                     #
#--------------------------WORKFLOW DETAIL----------------------------#
#                                                                     #
#######################################################################

@require_http_methods(['GET'])
@csrf_exempt
@login_required()
def get_workflow_params(request, wfid, thomson_name):
	param_list = WorkflowDetail(wfid, thomson_name).get_param()
	return HttpResponse(param_list, content_type='application/json', status=200)


# @require_http_methods(['POST'])
# @csrf_exempt
