from django.urls import path
from .views import delete_expense, get_expenses , register_user

urlpatterns = [
    path('expenses/', get_expenses),
    path('expenses/<int:id>/', delete_expense),
    path('register/', register_user),
]