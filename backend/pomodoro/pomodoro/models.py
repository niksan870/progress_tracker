from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Pomodoro(models.Model):
    title = models.CharField(max_length=255, blank=True)
    work_time = models.PositiveIntegerField()
    break_time = models.PositiveIntegerField()

    class Meta:
        ordering = ['work_time']

    def __str__(self):
        return self.__class__.__name__


class Graph(models.Model):
    data = models.JSONField()
    summed_time = models.IntegerField()
    profile = models.OneToOneField(
        "Profile", on_delete=models.CASCADE, null=True, default=None)

    def __str__(self):
        return self.__class__.__name__


class Profile(models.Model):
    ROLE_CHOICES = (
        (1, 'Student'),
        (2, 'Teacher'),
        (3, 'Supervisor'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=30, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    role = models.PositiveSmallIntegerField(
        choices=ROLE_CHOICES, null=True, blank=True)
    pomodoro = models.OneToOneField(
        Pomodoro, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.user.username


class Goal(models.Model):
    name = models.CharField(max_length=255)
    body = models.TextField()
    private = models.BooleanField()
    owner = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="username_users",
        default=None)
    participants = models.ManyToManyField(
        Profile, related_name='goals', blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.__class__.__name__


class Journal(models.Model):
    owner = models.ForeignKey(
        "Profile", on_delete=models.CASCADE, related_name='profile'
    )
    journal_category = models.OneToOneField(
        "JournalCategory", on_delete=models.CASCADE, null=True, default=None
    )
    title = models.CharField(max_length=140, blank=True)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class JournalCategory(models.Model):
    title = models.CharField(max_length=140, blank=True)


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()
