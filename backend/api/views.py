from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Expense
from .serializers import ExpenseSerializer


# 👉 GET + POST (list + create)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_expenses(request):

    if request.method == 'GET':
        expenses = Expense.objects.filter(user=request.user)
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ExpenseSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 👉 DELETE (single item)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_expense(request, id):
    try:
        expense = Expense.objects.get(id=id, user=request.user)
        expense.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_200_OK)

    except Expense.DoesNotExist:
        return Response(
            {"error": "Expense not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"})

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"})

    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "User created successfully"})