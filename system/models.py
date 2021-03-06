from __future__ import unicode_literals
from django.db import models

# Create your models here.
class Node(models.Model):
    nid = models.IntegerField(blank=True, null=True)
    host = models.CharField(max_length=20, blank=True, null=True)
    cpu = models.IntegerField(blank=True, null=True)
    alloccpu = models.IntegerField(blank=True, null=True)
    mem = models.IntegerField(blank=True, null=True)
    allocmem = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=10, blank=True, null=True)
    state = models.CharField(max_length=10, blank=True, null=True)
    uncreachable = models.CharField(max_length=5, blank=True, null=False)

    class Meta:
        managed = True
        db_table = 'node'

class NodeDetail(models.Model):
    nid = models.IntegerField(blank=True, null=True)
    host = models.CharField(max_length=20, blank=True, null=True)
    jid = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'node_detail'

from captcha.models import CaptchaStore
from captcha.helpers import captcha_image_url
import json
class AjaxCaptcha():
    def getCaptcha(self):
        to_json_response = dict()
        to_json_response['status'] = 0
        to_json_response['new_cptch_key'] = CaptchaStore.generate_key()
        to_json_response['new_cptch_image'] = captcha_image_url(to_json_response['new_cptch_key'])
        return to_json_response
    def validateCaptcha(self, client_response):
        # print "fdfasd"
        isCapt = CaptchaStore.objects.filter(response = client_response['cpt_value'], hashkey = client_response['cpt_key'])
        to_json_response = dict()
        print isCapt
        if not isCapt:
            to_json_response['status'] = 1 #captcha ignore
        else:
            to_json_response['status'] = 0
        to_json_response['new_cptch_key'] = CaptchaStore.generate_key()
        to_json_response['new_cptch_image'] = captcha_image_url(to_json_response['new_cptch_key'])
        return to_json_response