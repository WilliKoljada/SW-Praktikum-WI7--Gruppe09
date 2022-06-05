from src.server.bo import BusinessObject as bo



class Buchung (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._ersteller = ""

    def get_ersteller(self):
        return self._ersteller

    def set_ersteller(self, ersteller):
        self._ersteller = ersteller


    # Buchung aus dictionary erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Buchung()
        obj.set_id(dictionary["id"])
        obj.set_ersteller(dictionary["ersteller"])

        return obj