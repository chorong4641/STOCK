from django.db import models

class Stock(models.Model):
    code = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'stock'

class User(models.Model):
    idx = models.AutoField(primary_key=True)
    id = models.CharField(max_length=30)
    password = models.CharField(max_length=50)
    name = models.CharField(max_length=30)
    email = models.CharField(max_length=50, blank=True, null=True)
    date_insert = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'