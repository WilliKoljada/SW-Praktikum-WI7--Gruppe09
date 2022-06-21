from server.bo import BusinessObject as bo


class Projekt(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._name = ""
        self._beschreibung = ""
        self._auftraggeber = ""
        self.personID = 0

    def get_beschreibung(self):
        return self._beschreibung

    def set_beschreibung(self, value):
        self._beschreibung = value

    def get_name(self):
        return self._name

    def set_name(self, value):
        self._name = value

    def get_auftraggeber(self):
        return self._auftraggeber

    def set_auftraggeber(self, value):
        self._auftraggeber = value

    def get_personID(self):
        return self.personID

    def set_personID(self, personID):
        self._personID = personID

    # User Object aus Dict erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Projekt()
        obj.set_id(dictionary["id"])
        obj.set_creation_date(dictionary["creation_date"])
        obj.set_name((dictionary["name"]))
        obj.set_auftraggeber((dictionary["auftraggeber"]))
        obj.set_beschreibung(dictionary["beschreibung"])
        obj.set_personID(dictionary["personID"])

        return obj