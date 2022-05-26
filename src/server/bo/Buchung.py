from src.server.bo import BusinessObject as bo



class Buchung (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._buchungs_id = 0

    def get_buchungs_id(self):
        return self._buchungs_id

    def set_buchungs_id(self, value):
        self._buchungs_id = value


    # Buchung aus dictionary erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Buchung()
        obj.set_id(dictionary["id"])
        obj.set_creation_date(dictionary["creation_date"])
        obj.set_id(dictionary["buchungs_id"])

        return obj