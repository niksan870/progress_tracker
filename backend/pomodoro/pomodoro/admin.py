from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Profile, Goal, Pomodoro, Graph, Journal, JournalCategory

admin.site.unregister(User)


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    pass


@admin.register(Pomodoro)
class PomodoroAdmin(admin.ModelAdmin):
    pass


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline,)
    list_display = (
        'username', 'email', 'first_name', 'last_name', 'is_staff',
        'get_location')
    list_select_related = ('profile',)

    def get_location(self, instance):
        return instance.profile.location

    get_location.short_description = 'Location'

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(CustomUserAdmin, self).get_inline_instances(request, obj)


admin.site.register(Graph)
admin.site.register(Journal)
admin.site.register(JournalCategory)