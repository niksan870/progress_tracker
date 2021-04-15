import time

from django.contrib.auth.models import User, Group
from rest_framework import viewsets, status, generics
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from time import strftime
from .models import Goal, Profile, Goal, Pomodoro, Graph, Journal
from .serializers import UserSerializer, GroupSerializer, GoalSerializer, \
    UserProfileSerializer, PomodoroForAdminSerializer, \
    PomodoroForUserSerializer, GraphSerializer, JournalSerializer
from .permissions import IsSuperUser, IsOwnerOrReadOnly, IsSuperUserOrReadOnly
import datetime


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)


class GraphViewSet(viewsets.ModelViewSet):
    queryset = Graph.objects.all()
    serializer_class = GraphSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    @action(detail=False, methods=['POST'], name="Update user_profile's graph")
    def get_users_graph(self, request, *args, **kwargs):
        resource_type = request.data.get("type")
        id = str(request.data.get("id"))
        graph = request.user.profile.graph
        loaded_json = graph.data
        if resource_type == "goals":
            buckets = loaded_json["buckets"][resource_type][id]
            loaded_json["buckets"][resource_type][id] = buckets
            graph.data = loaded_json
            graph.save()
            chart_data = [
                {"date": key, "time_spent": value}
                for key, value in buckets.items()
            ]
            return Response(
                chart_data, status=status.HTTP_200_OK
            )

    @action(detail=False, methods=['PUT'], name="Update user_profile's graph")
    def update_graph(self, request, *args, **kwargs):
        time = request.data.get("time")
        resource_type = request.data.get("type")
        id = str(request.data.get("id"))
        graph = request.user.profile.graph
        loaded_json = graph.data
        if resource_type == "goals":
            current_date = datetime.datetime.today().strftime('%Y-%m-%d')
            buckets = loaded_json["buckets"][resource_type][id]
            try:
                print(buckets[current_date])
                buckets = time.strftime('%H:%M', time.gmtime(buckets[current_date] + time))
            except KeyError as e:
                buckets[current_date] = time.strftime('%H:%M', time.gmtime(request.data.get("time")))
            loaded_json["buckets"][resource_type][id] = buckets
            graph.data = loaded_json
            graph.save()
            chart_data = [
                {"date": key, "time_spent": value}
                for key, value in buckets.items()
            ]
            return Response(
                chart_data, status=status.HTTP_200_OK
            )

        return Response({"text": "You are not authorized to do that"},
                        status=status.HTTP_201_CREATED)

    def create(self, request, *args, **kwargs):
        try:
            request.user.profile.graph
            return Response({"text": "You already have a grpah"},
                            status=status.HTTP_400_BAD_REQUEST)
        except:
            pass

        graph_type = request.data.get("type")

        if graph_type == "goal":
            goal = Goal.objects.get(pk=int(request.data.get("id")))

            if goal:
                data = dict(
                    buckets=dict(
                        goals={
                            request.data.get("id"): {
                                strftime("%Y-%m-%d"): time.strftime('%H:%M', time.gmtime(request.data.get("time")))
                            }
                        }
                    )
                )

                new_graph = Graph.objects.create(
                    data=data,
                    summed_time=request.data.get("time"),
                    profile=request.user.profile
                )

                new_graph.save()
                return Response(
                    {"text": "Graph saved"}, status=status.HTTP_200_OK
                )
        else:
            return Response({"text": "Not a valid goal"},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'], name="Get user_profile's graph")
    def user_profile(self, request, *args, **kwargs):
        return Response({"text": "User is now a participant"})
        goal_id = request.data["goal_id"]
        user_profile_id = request.data["user_profile_id"]
        try:
            user_profile = Profile.objects.get(pk=user_profile_id)
        except Profile.DoesNotExist:
            return Response({"text": "No such user"})

        goal = Goal.objects.get(pk=goal_id)

        if request.user.id != goal.owner.id:
            return Response({"text": "You are not the owner of this goal"})

        goal.participants.add(user_profile.id)
        goal.save()
        return Response({"text": "User is now a participant"})


class PomodoroViewSet(viewsets.ModelViewSet):
    queryset = Pomodoro.objects.all()
    serializer_class = PomodoroForAdminSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if request.user.is_superuser:
            pomodoro_data = request.data

            pomodoro_goal = Pomodoro.objects.create(
                title=pomodoro_data["title"],
                work_time=pomodoro_data["work_time"],
                break_time=pomodoro_data["break_time"]
            )
            pomodoro_goal.save()
            return Response({"text": "Pomodoro added successfully"},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"text": "You are not authorized to do that"},
                            status=status.HTTP_201_CREATED)

    def get_serializer_class(self):
        if self.request.user.is_superuser:
            return PomodoroForAdminSerializer
        return PomodoroForUserSerializer


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def create(self, request, *args, **kwargs):
        goal_data = request.data

        try:
            private = goal_data["private"].lower() in ('true',)
        except Exception:
            private = False

        new_goal = Goal.objects.create(owner=request.user.profile,
                                       name=goal_data["name"],
                                       body=goal_data["body"], private=private)
        new_goal.participants.add(request.user.profile)
        new_goal.save()
        return Response({"text": "Goal added successfully"},
                        status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'], name='Request a goal access')
    def invite_a_person(self, request, *args, **kwargs):
        goal_id = request.data["goal_id"]
        user_profile_id = request.data["user_profile_id"]
        try:
            user_profile = Profile.objects.get(pk=user_profile_id)
        except Profile.DoesNotExist:
            return Response({"text": "No such user"})

        goal = Goal.objects.get(pk=goal_id)

        if request.user.id != goal.owner.id:
            return Response({"text": "You are not the owner of this goal"})

        goal.participants.add(user_profile.id)
        goal.save()
        return Response({"text": "User is now a participant"})

    @action(detail=False, methods=['POST'], name='Request a goal access')
    def request(self, request, *args, **kwargs):
        goal_id = request.data["goal_id"]
        user_profile = Profile.objects.get(pk=request.user.id)
        goal = Goal.objects.get(pk=goal_id)
        if not goal.private:
            goal.participants.add(user_profile.id)
            goal.save()
            return Response({"text": "You are now member of the "},
                            status=status.HTTP_200_OK)
        else:
            return Response({"text": "You can't join this goal room"},
                            status=status.HTTP_400_BAD_REQUEST)


class JournalViewSet(viewsets.ModelViewSet):
    queryset = Journal.objects.all()
    serializer_class = JournalSerializer
    permission_classes = [permissions.IsAuthenticated]
