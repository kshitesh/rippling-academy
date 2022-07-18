from django.urls import path

from . import views

urlpatterns = [
    path('', views.get_admin_key, name='get_admin_key'), #POST  #compulsory fields = None

    path('add-restaurant/',views.add_restaurant,name='add_restaurant'), #POST #compulsory fields: [key, name,cuisine]

    path('delete-restaurant/',views.delete_restaurant,name='delete_restaurant'), #POST #compulsory fields: [key, name]

    path('search/',views.search_restaurants,name='search_restaurants'), #GET #field example: name

    path('<str:name>/add/',views.add_item,name='add_item'), #POST #compulsory fields: [key, name,isVegetarian, price]

    path('<str:name>/delete/',views.delete_item,name='delete_item'), #POST # compulsory fields: [key, name]

    path('<str:name>/',views.get_items,name='get_items'), #GET

    path('<str:name>/search/',views.search_restaurant_items,name='search_restaurant_items') #GET #field example: name
]