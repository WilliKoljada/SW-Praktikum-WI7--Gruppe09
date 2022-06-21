from server.bo import BusinessObject as bo
from datetime import datetime


class Ereignis (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._type = ""
        self._datum = None
        self._startzeit = None
        self._endzeit = None
        self._aktivitaetID = 0
        self._personID = 0

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

    def set_startzeit(self, startzeit):
        self._startzeit = startzeit

    def get_endzeit(self):
        return self._endzeit

    def set_endzeit(self, endzeit):
        self._endzeit = endzeit

    def get_personID(self):
        return self._personID

    def set_personID(self, personID):
        self._personID = personID

    # User Object aus Dict erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Ereignis()
        obj.set_id(dictionary["id"])
        obj.set_creation_date(dictionary["creation_date"])
        obj.set_type(dictionary["type"])
        obj.set_datum(dictionary["datum"])
        obj.set_startzeit(dictionary["startzeit"])
        obj.set_endzeit(dictionary["endzeit"])
        obj.set_personID(dictionary["personID"])

        return obj