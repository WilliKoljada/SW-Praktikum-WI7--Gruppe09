from server.bo import BusinessObject as bo


class Aktivitaet(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._name = ""
        self._beschreibung = ""
        self._projektID = 0
        self._dauert = ""

    def set_name(self, name):
        self._name = name

    def get_name(self):
        return self._name

    def set_beschreibung(self, beschreibung):
        self._beschreibung = beschreibung

    def get_beschreibung(self):
        return self._beschreibung

    def set_projektID(self, projektID):
        self._projektID = projektID

    def get_projektID(self):
        return self._projektID

    def set_dauert(self, value):
        self._dauert = value

    def get_dauert(self):
        return self._dauert


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Rating()."""
        obj = Aktivitaet()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_creation_date(dictionary["creation_date"])
        obj.set_name(dictionary["name"])
        obj.set_beschreibung(dictionary["beschreibung"])
        obj.set_projektID(dictionary["projektID"])

        return obj