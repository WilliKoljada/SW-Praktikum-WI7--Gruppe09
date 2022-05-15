from src.server.bo import BusinessObject as bo



class Zeitintervall (bo):

    def __init__(self):
        super().__init__()
        self._projektlaufzeit = ""


    def get_projektlaufzeit(self):
        return self._projektlaufzeit

    def set_projektlaufzeit(self, value):
        self._projektlaufzeit = value

    @staticmethod
    def from_dict(dictionary=dict()):
         obj = Zeitintervall()
         obj.set_id(dictionary["id"])
         obj.set_creation_time(dictionary["creation_time"])
         obj.set_projektlaufzeit(dictionary["projektlaufzeit"])