# Generated by Django 3.1.5 on 2021-03-13 17:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pomodoro', '0002_auto_20210312_1719'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='graph',
            name='user',
        ),
        migrations.AddField(
            model_name='graph',
            name='profile',
            field=models.OneToOneField(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='pomodoro.profile'),
        ),
    ]
