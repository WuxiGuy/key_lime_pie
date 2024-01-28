from django.db import models

class UserActions(models.Model):
    hostUrl = models.CharField(max_length=200)
    pageUrl = models.CharField(max_length=200)
    startTime = models.DateTimeField("start timestamp")
    endTime = models.DateTimeField("end timestamp")
    activeTime = models.IntegerField(default=0)
    webType = models.CharField(max_length=200)

    def __str__(self):
        output = "hostUrl: " + self.hostUrl + "\n"
        output += "pageUrl: " + self.pageUrl + "\n"
        output += "startTime: " + str(self.startTime) + "\n"
        output += "endTime: " + str(self.endTime) + "\n"
        output += "activeTime: " + str(self.activeTime) + "\n"
        output += "webType: " + self.webType + "\n"
        return output
