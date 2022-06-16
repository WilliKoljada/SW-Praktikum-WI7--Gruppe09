from server.bo import BusinessObject as bo
from datetime import datetime


class Ereignis (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._type = ""
        self._datum = None
        self._startzeit = None


    def get_type(self):
        return self._type

    def set_type(self, value):
        self._type = value

    def get_datum(self):
        return self._datum

    def set_datum(self, datum):
        self._datum = datum

    def get_startzeit(self):
        return self._startzeit



    def get_personID(self):
        return self._personID

    def set_personID(self, personID):
        self._personID = personID

    # User Object aus Dict erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Ereignis()
        obj.set_id(dictionary["id"])


        return obj