from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .models import Goal, Profile, Pomodoro, Graph, Journal


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class GraphSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Graph
        fields = ["id", 'url', 'data', 'summed_time']


class GoalSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        ordering = ['-id']
        model = Goal
        fields = ("id",
                  "url",
                  "name",
                  "owner",
                  "private",
                  "body",
                  "participants",
                  )

        extra_kwargs = {'participants': {'required': False}}
        read_only_fields = ('owner', "participants")


class JournalSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Journal
        fields = ['id', 'title', 'body', 'created_at', 'updated_at', "owner"]
        read_only_fields = ('owner', "participants")


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    goals = GoalSerializer(many=True, read_only=True)
    journals = JournalSerializer(many=True, read_only=True)
    graph_id = serializers.CharField(source="graph.id", read_only=True)

    class Meta:
        ordering = ['-id']
        model = Profile
        fields = ("id", "url", "user", "location", "role", "goals", "journals",
                  "pomodoro", "graph_id")
        extra_kwargs = {'goals': {'required': False}}


class PomodoroForAdminSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pomodoro
        fields = ['id', 'work_time', 'break_time', "title"]


class PomodoroForUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pomodoro
        fields = ['id', 'work_time', 'break_time']
        read_only_fields = ('id', 'work_time', 'break_time')
