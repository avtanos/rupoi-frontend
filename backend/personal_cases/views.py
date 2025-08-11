from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters import rest_framework as filters
from .models import PersonalCase
from .serializers import PersonalCaseSerializer


class PersonalCaseViewSet(viewsets.ModelViewSet):
    queryset = PersonalCase.objects.all()
    serializer_class = PersonalCaseSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('disability_group', 'created_at')
    search_fields = ('pin', 'last_name', 'first_name', 'middle_name')
    ordering_fields = ('created_at', 'last_name', 'first_name')
    ordering = ('-created_at',)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Получить статистику по личным делам"""
        total = PersonalCase.objects.count()
        active = PersonalCase.objects.filter(disability_group__in=['I', 'II', 'III', 'CHILD']).count()
        closed = PersonalCase.objects.filter(disability_group='NONE').count()
        
        return Response({
            'total': total,
            'active': active,
            'closed': closed,
            'urgent': 0  # Пока заглушка
        })
