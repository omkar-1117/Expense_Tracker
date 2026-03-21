from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    amount = models.IntegerField()
    category = models.CharField(max_length=50)
    date = models.DateField(default=timezone.now)