from src.server.bo import BusinessObject as bo



class Buchung (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._ersteller = 0

    def get_ersteller(self):
        return self._ersteller

    def set_ersteller(self, value):
        self._ersteller = value


    # Buchung aus dictionary erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Buchung()
        obj.set_id(dictionary["id"])
        obj.set_creation_date(dictionary["creation_date"])
        obj.set_id(dictionary["buchungs_id"])

        return obj