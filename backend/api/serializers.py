from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    # Automatically set the logged in user on create
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Expense
        fields = ["id", "user", "title", "amount", "category", "date"]
        read_only_fields = ["id", "user"]