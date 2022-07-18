from unicodedata import name
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from .models import *
from rest_framework.decorators import api_view
import secrets,json

@csrf_exempt
@api_view(['POST'])
def get_admin_key(request):
    key=secrets.token_urlsafe(16)
    while(admin.objects(key=key).count()>0):
        key=secrets.token_urlsafe(16)
    new_key=admin(key=key)
    new_key.save()
    return JsonResponse({'key':new_key.key})

@csrf_exempt
@api_view(['POST'])
def add_restaurant(request):
    request=json.loads(request.body.decode('utf8').replace("'", '"'))
    for k in ["key","name","cuisine"]:
        if k not in request.keys():
            return HttpResponse(False)
    restaurant_count=restaurant.objects(name=request['name'],owner=admin.objects.get(key=request['key']).id).count()
    if admin.objects(
        key=request['key']).count()==0 or restaurant_count>0:
        return HttpResponse(False)
    new_restaurant=restaurant()
    for temp in ['name','address','cuisine','logo','key']:
        if temp in request:
            if temp=='key':
                setattr(new_restaurant,'owner',admin.objects.get(key=request['key']).id)
            else:
                setattr(new_restaurant,temp,request[temp])
    new_restaurant.save()
    return HttpResponse(True)

@csrf_exempt
@api_view(['POST'])
def delete_restaurant(request):
    request=json.loads(request.body.decode('utf8').replace("'", '"'))
    if admin.objects(key=request['key']).count()==0:
        return HttpResponse(False)
    if "name" not in request:
        return HttpResponse(False)
    restaurant.objects(owner=admin.objects.get(key=request['key']).id,name=request['name']).delete()
    return HttpResponse(True)

@csrf_exempt
@api_view(['POST'])
def add_item(request,name):
    request=json.loads(request.body.decode('utf8').replace("'", '"'))
    for key in ['key','name','isVegetarian','price']:
        if key not in request:
            return HttpResponse(False)
    if admin.objects(key=request['key']).count()==0:
        return HttpResponse(False)
    if restaurant.objects(name=name,owner=admin.objects.get(key=request['key']).id).count()==0:
        return HttpResponse(False)
    restaurant_id=restaurant.objects.get(name=name,owner=admin.objects.get(key=request['key']).id).id
    if item.objects(name=request['name'],restaurant_id=restaurant_id).count()>0:
        return HttpResponse(False)
    new_item=item()
    for temp in ['name','description','image','isVegetarian','category','isAvailable','timings','restaurant_id','price']:
        if temp in request:
            setattr(new_item,temp,request[temp])
    setattr(new_item,'restaurant_id',restaurant_id)
    new_item.save()
    return HttpResponse(True)

@csrf_exempt
@api_view(['POST'])
def delete_item(request,name):
    request=json.loads(request.body.decode('utf8').replace("'", '"'))
    for key in ['key','name']:
        if key not in request:
            return HttpResponse(False)
    if admin.objects(key=request['key']).count()==0:
        return HttpResponse(False)
    if restaurant.objects(name=name,owner=admin.objects.get(key=request['key']).id).count()==0:
        return HttpResponse(False)
    restaurant_id=restaurant.objects.get(name=name,owner=admin.objects.get(key=request['key']).id)
    item.objects(name=request['name'],restaurant_id=restaurant_id).delete()
    return HttpResponse(True)

@csrf_exempt
@api_view(['GET'])
def search_restaurants(request):
    ans=[]
    for res in restaurant.objects():
        ans.append(res.to_json())
        for key in request.GET:
            if getattr(res,key)!=request.GET[key]:
                ans=ans[:-1]
                break
    return HttpResponse(ans)

@csrf_exempt
@api_view(['GET'])
def get_items(request,name):
    arr=[]
    for temp in restaurant.objects(name=name):
        arr.append(temp.id)
    ans=[]
    for temp in arr:
        ans.append(item.objects(restaurant_id=temp).to_json())
    return HttpResponse(ans)

@csrf_exempt
@api_view(['GET'])
def search_restaurant_items(request,name):
    return HttpResponse(item.objects(name=name))
