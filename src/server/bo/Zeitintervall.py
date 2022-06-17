from server.bo import BusinessObject as bo



class Zeitintervall (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._datum = None
        self._startzeit = None
        self._endzeit = None
        self._aktivitaetID = 0
        self._personID = 0
        self._aktivitaetID = 0

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

    def get_aktivitaetID(self):
        return self._aktivitaetID

    def set_aktivitaetID(self, aktivitaetID):
        self._aktivitaetID = aktivitaetID

    # User Object aus Dict erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Zeitintervall()
        obj.set_id(dictionary["id"])
        obj.set_datum(dictionary["datum"])
        obj.set_startzeit(dictionary["startzeit"])
        obj.set_endzeit(dictionary["endzeit"])
        obj.set_aktivitaetID(dictionary["aktivitaetID"])

        return obj
