from django.db import models

class Question(models.Model):
    Id = models.CharField(max_length=50)
    Pw = models.CharField(max_length=100)